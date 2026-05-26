/**
 * lib/rateLimit.js
 * ──────────────────────────────────────────────────────────────────────
 * Vercel KV (Upstash Redis) varsa onu, yoksa in-memory fallback kullanır.
 * Fallback tek node içindir — prod'da KV gereklidir.
 *
 * Kullanım:
 *   const rl = await rateLimit(`feedback:${ip}`, { limit: 10, windowSec: 60 });
 *   if (!rl.ok) return 429;
 */

const memStore = new Map(); // key → { count, resetAt }

function memLimit(key, limit, windowMs) {
  const now = Date.now();
  const rec = memStore.get(key);
  if (!rec || rec.resetAt < now) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  rec.count += 1;
  if (rec.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((rec.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - rec.count, retryAfter: 0 };
}

async function kvLimit(key, limit, windowSec) {
  try {
    const { kv } = await import("@vercel/kv");
    const full = `rl:${key}`;
    const n = await kv.incr(full);
    if (n === 1) await kv.expire(full, windowSec);
    if (n > limit) {
      const ttl = await kv.ttl(full);
      return { ok: false, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSec };
    }
    return { ok: true, remaining: limit - n, retryAfter: 0 };
  } catch (e) {
    // KV arızasında fail-open değil, fail-soft: yerel sayacı kullan.
    return memLimit(key, limit, windowSec * 1000);
  }
}

export async function rateLimit(key, { limit = 10, windowSec = 60 } = {}) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return kvLimit(key, limit, windowSec);
  }
  return memLimit(key, limit, windowSec * 1000);
}
