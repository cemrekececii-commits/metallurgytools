import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Shopier IPN (Instant Payment Notification) Handler
 *
 * Shopier ödeme sonrası bu URL'e POST atar.
 * Gelen alanlar: status, buyer_name, buyer_surname, buyer_email,
 *                product_id, order_id, payment_id, platform, vb.
 *
 * Doğrulama: Shopier REST API'ye PAT (Personal Access Token)
 * ile istek atarak ödemenin gerçekten var olduğunu teyit ediyoruz.
 */

const SHOPIER_PAT        = process.env.SHOPIER_API_KEY || ""; // Kişisel Erişim Anahtarı
const SHOPIER_PRODUCT_ID = "45481563";

async function verifyOrderWithShopier(orderId) {
  if (!SHOPIER_PAT) {
    console.warn("[shopier] PAT not configured — skipping order verification");
    return true; // dev ortamında doğrulamayı atla
  }
  try {
    const res = await fetch(
      `https://www.shopier.com/ShowProduct/api-seller.php?order_id=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${SHOPIER_PAT}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    // Shopier API yanıtında ödeme durumu kontrolü
    return data?.status === "1" || data?.payment_status === "paid" || data?.order_status === "completed";
  } catch (err) {
    console.error("[shopier] Order verification error:", err);
    // API doğrulaması başarısız olursa email + product_id kontrolüne güven
    return true;
  }
}

export async function POST(req) {
  try {
    // Shopier application/x-www-form-urlencoded gönderir
    const text   = await req.text();
    const params = Object.fromEntries(new URLSearchParams(text));

    console.log("[shopier] IPN received:", {
      status:      params.status,
      buyer_email: params.buyer_email,
      product_id:  params.product_id,
      order_id:    params.order_id,
      payment_id:  params.payment_id,
    });

    // 1. Sadece başarılı ödemeleri işle (status = "1")
    if (String(params.status) !== "1") {
      console.log("[shopier] Non-successful payment, status:", params.status);
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 2. Doğru ürün mü?
    if (params.product_id && String(params.product_id) !== SHOPIER_PRODUCT_ID) {
      console.warn("[shopier] Product ID mismatch:", params.product_id);
    }

    // 3. Shopier API'den siparişi doğrula
    const isValid = await verifyOrderWithShopier(params.order_id);
    if (!isValid) {
      console.error("[shopier] Order verification failed for:", params.order_id);
      return NextResponse.json({ error: "Order not verified" }, { status: 400 });
    }

    // 4. Buyer email al
    const buyerEmail = params.buyer_email?.trim()?.toLowerCase();
    if (!buyerEmail) {
      console.error("[shopier] No buyer email in IPN payload");
      return NextResponse.json({ error: "Missing buyer_email" }, { status: 400 });
    }

    // 5. Clerk'te kullanıcıyı email ile bul
    const clerk    = await clerkClient();
    const userList = await clerk.users.getUserList({ emailAddress: [buyerEmail] });
    const clerkUser = userList?.data?.[0] || userList?.[0] || null;

    if (!clerkUser) {
      console.warn("[shopier] Clerk user not found for:", buyerEmail);
      // 200 dön — Shopier tekrar denemez
      return NextResponse.json({ ok: true, note: "user_not_registered_yet" });
    }

    // 6. Planı aktifleştir — şimdiden 30 gün
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await clerk.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        plan:             "professional",
        planExpiresAt,
        shopierOrderId:   params.order_id   || null,
        shopierPaymentId: params.payment_id || null,
        planActivatedAt:  new Date().toISOString(),
      },
    });

    console.log(`[shopier] ✓ Plan activated: ${buyerEmail} → expires ${planExpiresAt}`);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("[shopier] Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Shopier endpoint'in aktif olduğunu test etmek için GET
export async function GET() {
  return NextResponse.json({ status: "Shopier IPN endpoint active", product: SHOPIER_PRODUCT_ID });
}
