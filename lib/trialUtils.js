/**
 * trialUtils.js
 *
 * Trial yönetimi için sunucu tarafı yardımcı fonksiyonlar.
 * KV = source of truth (fingerprint → startTs)
 * Cookie = ikincil / hız optimizasyonu
 *
 * Fingerprint = SHA-256(IP + User-Agent) → ilk 16 hex karakter
 * Edge Runtime uyumlu: Node crypto yerine Web Crypto API kullanır.
 */

import { kv } from "@vercel/kv";

export const TRIAL_DAYS        = 7;
export const TRIAL_COOKIE      = "mt_trial";
export const KV_TTL_SEC        = 90 * 24 * 3600; // 90 gün KV'de tut
export const COOKIE_MAX_AGE    = 90 * 24 * 3600; // 90 gün cookie

// ─── Fingerprint ─────────────────────────────────────────────────────────────
// Edge Runtime'da crypto.subtle kullanılır.

export async function getFingerprint(request) {
  const xff = request.headers.get("x-forwarded-for");
  const ip  = xff
    ? xff.split(",")[0].trim()
    : (request.headers.get("x-real-ip") || "unknown");
  const ua  = request.headers.get("user-agent") || "";
  const raw = `${ip}:${ua}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// ─── Cookie encode / decode ───────────────────────────────────────────────────
// Edge Runtime'da Buffer yok → btoa/atob kullan.

export function encodeTrialCookie(startTs) {
  return btoa(JSON.stringify({ s: startTs, v: 1 }));
}

export function decodeTrialCookie(value) {
  try {
    const obj = JSON.parse(atob(value));
    const ts  = typeof obj?.s === "number" ? obj.s : null;
    // Gelecek tarih ise geçersiz say (manipülasyon önlemi)
    if (ts && ts > Date.now()) return null;
    return ts;
  } catch {
    return null;
  }
}

// ─── KV operations ───────────────────────────────────────────────────────────

export async function kvGetTrial(fingerprint) {
  try {
    const data = await kv.get(`trial:fp:${fingerprint}`);
    return data?.startTs ?? null;
  } catch {
    return null;
  }
}

export async function kvSetTrial(fingerprint, startTs) {
  try {
    await kv.set(`trial:fp:${fingerprint}`, { startTs }, { ex: KV_TTL_SEC });
  } catch (err) {
    console.warn("[trial] KV set failed:", err?.message);
  }
}

// ─── Trial durumu ─────────────────────────────────────────────────────────────

export function trialStatus(startTs) {
  if (!startTs) return { active: false, daysLeft: 0, expired: false, never: true };
  const elapsed   = Date.now() - startTs;
  const daysLeft  = Math.max(0, TRIAL_DAYS - elapsed / (1000 * 60 * 60 * 24));
  const active    = daysLeft > 0;
  return {
    active,
    daysLeft:    Math.ceil(daysLeft),
    daysElapsed: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
    expired:     !active,
    never:       false,
    startTs,
  };
}

// ─── Birleşik kontrol (middleware çağırır) ────────────────────────────────────
// Cookie'den al, KV ile doğrula. Yoksa null döner.

export async function resolveTrialStartTs(request) {
  const fingerprint   = await getFingerprint(request);
  const kvStartTs     = await kvGetTrial(fingerprint);
  if (kvStartTs) return kvStartTs;

  // KV'de yok → cookie'ye bak ve KV'e yaz (geçiş desteği)
  const cookieVal     = request.cookies.get(TRIAL_COOKIE)?.value;
  const cookieStartTs = cookieVal ? decodeTrialCookie(cookieVal) : null;
  if (cookieStartTs) {
    await kvSetTrial(fingerprint, cookieStartTs);
    return cookieStartTs;
  }

  return null; // Hiç trial başlatılmamış
}
