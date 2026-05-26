/**
 * lib/adminAuth.js
 * ──────────────────────────────────────────────────────────────────────────
 * Sunucu tarafı admin kimlik doğrulama yardımcıları.
 *
 * Güvenlik modeli:
 *   1. ADMIN_KEY yalnızca sunucuda (process.env) tutulur. Client'a asla
 *      sızmaz — NEXT_PUBLIC_ prefix'i KULLANILMAMALIDIR.
 *   2. Başarılı login sonrası HMAC-SHA256 imzalı, HttpOnly + Secure +
 *      SameSite=Strict bir cookie set edilir. XSS ile çalınamaz.
 *   3. Cookie içinde yalnızca {exp, v} (süresi ve sürüm) imzalı olarak tutulur.
 *      ADMIN_KEY'in kendisi asla cookie'ye yazılmaz.
 *   4. Timing-safe karşılaştırma kullanılır (timing attack'a karşı).
 *   5. Varsayılan süre 12 saat.
 *
 * Env vars (Vercel → Settings → Environment Variables):
 *   ADMIN_KEY         — uzun, rastgele string (min 24 karakter)
 *   ADMIN_SESSION_SECRET — HMAC için ayrı bir rastgele secret (min 32 byte)
 */

import crypto from "crypto";

const COOKIE_NAME = "mt_admin_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 saat

function getAdminKey() {
  const k = process.env.ADMIN_KEY;
  if (!k || k.length < 16) {
    // Prod'da eksikse fail-closed; log'da detay verme.
    throw new Error("ADMIN_KEY not configured");
  }
  return k;
}

function getSessionSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 24) {
    throw new Error("ADMIN_SESSION_SECRET not configured");
  }
  return s;
}

export function timingSafeEqualStr(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // uzunluk farkı bile sızıntı olmaması için sabit zamanda karşılaştır
    const pad = Buffer.alloc(Math.max(ab.length, bb.length));
    crypto.timingSafeEqual(pad, pad);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload) {
  const secret = getSessionSecret();
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Token formatı: base64url(JSON({exp, v})) + "." + base64url(HMAC)
 */
export function issueToken(version = 1) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const body = Buffer.from(JSON.stringify({ exp, v: version })).toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyToken(token) {
  if (typeof token !== "string" || token.length < 10) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = sign(body);
  if (!timingSafeEqualStr(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    if (typeof exp !== "number" || exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Kullanıcının gönderdiği anahtarı doğrula. Brute-force'a karşı çağıran
 * rate-limit uygulamalıdır.
 */
export function verifyAdminKey(providedKey) {
  try {
    return timingSafeEqualStr(providedKey || "", getAdminKey());
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = {
  name: COOKIE_NAME,
  ttl: SESSION_TTL_SECONDS,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  },
};

/**
 * Next.js Route Handler'ları içinde cookie'yi okuyup doğrular.
 * Kullanım:
 *   import { cookies } from "next/headers";
 *   if (!isAdminAuthed(cookies())) return 401;
 */
export function isAdminAuthed(cookieStore) {
  const c = cookieStore.get(COOKIE_NAME);
  if (!c?.value) return false;
  return verifyToken(c.value);
}
