import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import crypto from "crypto";

/**
 * Shopier IPN (Instant Payment Notification) Handler
 *
 * ──────────────────────────────────────────────────────────────────────
 * GÜVENLİK MODELİ (2026-05 hardening)
 * ──────────────────────────────────────────────────────────────────────
 *
 * 1) SIGNATURE VERIFICATION (fail-CLOSED)
 *    Shopier IPN POST'unda `signature` alanı gelir. Bu alan,
 *    HMAC-SHA256(random_nr + platform_order_id, SHOPIER_SIGNATURE_KEY)
 *    şeklinde hesaplanmalı ve base64'le karşılaştırılmalıdır.
 *    [Unverified — Shopier merchant docs ile DOĞRULANMALIDIR. Format
 *    sürüm/hesap tipine göre değişebilir; örn. bazı belgeler şunu kullanır:
 *      base64(HMAC_SHA256(random_nr + platform_order_id, api_secret))
 *    Eğer Shopier'in kullandığı format farklıysa verifyShopierSignature()
 *    fonksiyonunu güncellemen yeterli.]
 *
 *    Env yoksa → 400 (fail-closed). Önceki davranış (return true) bypass'a
 *    izin veriyordu.
 *
 * 2) IDEMPOTENCY
 *    Aynı order_id ile gelen tekrar eden IPN, 30 gün boyunca KV'de
 *    işaretlenir; ikinci kez plan uzatması yapılmaz.
 *
 * 3) PII REDACTION
 *    buyer_email log'a kısmen maskelenmiş yazılır (c***@d***.com).
 *
 * 4) STRICT PRODUCT_ID
 *    Beklenen ürün ID'si dışında istek 400 ile reddedilir.
 *
 * 5) GENERIC ERROR
 *    Saldırgana state oracle vermemek için tüm hata yanıtları jeneriktir.
 */

const SHOPIER_PAT           = process.env.SHOPIER_API_KEY || "";
const SHOPIER_SIGNATURE_KEY = process.env.SHOPIER_SIGNATURE_KEY || ""; // IPN HMAC anahtarı
const SHOPIER_PRODUCT_ID    = process.env.SHOPIER_PRODUCT_ID || "45481563";

// ─── Yardımcılar ────────────────────────────────────────────────────────────

function redactEmail(email) {
  if (typeof email !== "string" || !email.includes("@")) return "***";
  const [local, domain] = email.split("@");
  const head = local.slice(0, 1) || "*";
  const dotIdx = domain.indexOf(".");
  const dhead = dotIdx > 0 ? domain.slice(0, 1) + "***" + domain.slice(dotIdx) : "***";
  return `${head}***@${dhead}`;
}

function timingSafeEqualB64(a, b) {
  try {
    const ab = Buffer.from(a, "base64");
    const bb = Buffer.from(b, "base64");
    if (ab.length === 0 || ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch { return false; }
}

/**
 * Shopier IPN signature verifier.
 * Beklenen: base64(HMAC-SHA256(random_nr + platform_order_id, SHOPIER_SIGNATURE_KEY))
 * Shopier hesabınızda farklı bir composition kullanılıyorsa BURAYI güncelleyin.
 */
function verifyShopierSignature(params) {
  if (!SHOPIER_SIGNATURE_KEY) return false; // fail-closed
  const random_nr         = String(params.random_nr || "");
  const platform_order_id = String(params.platform_order_id || params.order_id || "");
  const provided          = String(params.signature || "");
  if (!random_nr || !platform_order_id || !provided) return false;

  const computed = crypto
    .createHmac("sha256", SHOPIER_SIGNATURE_KEY)
    .update(random_nr + platform_order_id)
    .digest("base64");

  return timingSafeEqualB64(provided, computed);
}

/** Server-side order doğrulama — sadece signature OK ise çağrılır. */
async function verifyOrderWithShopier(orderId) {
  if (!SHOPIER_PAT) return false; // fail-closed
  try {
    const res = await fetch(
      `https://www.shopier.com/ShowProduct/api-seller.php?order_id=${encodeURIComponent(orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${SHOPIER_PAT}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return (
      String(data?.status) === "1" ||
      data?.payment_status === "paid" ||
      data?.order_status === "completed"
    );
  } catch {
    return false; // fail-closed
  }
}

// ─── Handler ────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    // Shopier application/x-www-form-urlencoded gönderir
    const text   = await req.text();
    const params = Object.fromEntries(new URLSearchParams(text));

    const orderId    = String(params.order_id || params.platform_order_id || "").trim();
    const paymentId  = String(params.payment_id || "").trim();
    const buyerEmail = String(params.buyer_email || "").trim().toLowerCase();

    // 1) SIGNATURE — fail-closed
    if (!verifyShopierSignature(params)) {
      console.warn("[shopier] signature mismatch", {
        orderId,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]
      });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 2) Sadece başarılı ödemeler
    if (String(params.status) !== "1") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 3) Strict product_id kontrolü
    if (params.product_id && String(params.product_id) !== String(SHOPIER_PRODUCT_ID)) {
      console.warn("[shopier] product mismatch", {
        sent: params.product_id, expected: SHOPIER_PRODUCT_ID
      });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 4) Idempotency — aynı order'ı tekrar işleme
    try {
      const idemKey = `shopier:order:${orderId}`;
      const setRes = await kv.set(idemKey, "processed", { nx: true, ex: 60 * 60 * 24 * 30 });
      if (setRes !== "OK") {
        console.log("[shopier] duplicate IPN ignored", { orderId });
        return NextResponse.json({ ok: true, duplicate: true });
      }
    } catch (e) {
      // KV erişilemiyorsa idempotency'yi sessizce atla; ana akışı bozmayalım.
      console.error("[shopier] kv idempotency error:", e?.message);
    }

    // 5) Server-side ek doğrulama (Shopier'e geri sor)
    const verified = await verifyOrderWithShopier(orderId);
    if (!verified) {
      console.error("[shopier] order not verified by Shopier API", { orderId });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!buyerEmail) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 6) Clerk kullanıcı eşle
    const clerk     = await clerkClient();
    const userList  = await clerk.users.getUserList({ emailAddress: [buyerEmail] });
    const clerkUser = userList?.data?.[0] || userList?.[0] || null;

    if (!clerkUser) {
      console.warn("[shopier] user not registered yet:", redactEmail(buyerEmail));
      return NextResponse.json({ ok: true, note: "user_not_registered_yet" });
    }

    // 7) Planı 30 gün aktive et
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await clerk.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        plan:             "professional",
        planExpiresAt,
        shopierOrderId:   orderId || null,
        shopierPaymentId: paymentId || null,
        planActivatedAt:  new Date().toISOString(),
      },
    });

    console.log("[shopier] plan activated", {
      user: redactEmail(buyerEmail),
      orderId,
      expires: planExpiresAt,
    });
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[shopier] internal error:", err?.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Endpoint canlı mı testi — ürün ID'si sızdırmamak için generic.
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
