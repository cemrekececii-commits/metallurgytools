/**
 * lib/kvStore.js
 * ──────────────────────────────────────────────────────────────────────
 * Vercel KV (Upstash Redis) tabanlı küçük persistent store.
 *
 * Veri modeli (her namespace için):
 *   - Index (sorted set):  `${ns}:idx`  → score=createdAt (ms), member=id
 *   - Item  (string/JSON): `${ns}:item:${id}` → entry payload
 *
 * Avantaj: O(log n) sıralı tarama (zrevrange), O(1) item okuma.
 * Önceki `global.*` store serverless'ta kaybolabiliyordu — KV ile kalıcı.
 *
 * Bu modülün TÜM fonksiyonları KV yokken sessizce in-memory fallback'e
 * düşer (yalnızca dev modda anlamlı; prod'da KV env'leri set olmalı).
 */

const memNs = new Map(); // ns → { items: Map(id → entry), order: [ids] }

function getMem(ns) {
  if (!memNs.has(ns)) memNs.set(ns, { items: new Map(), order: [] });
  return memNs.get(ns);
}

async function getKv() {
  // KV env yoksa null dön — caller fallback yapsın
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

/** Yeni kayıt ekle. id otomatik üretilir, yoksa entry.id kullanılır. */
export async function putEntry(ns, entry) {
  const id = entry.id || Date.now().toString();
  const e  = { ...entry, id };
  const score = entry.createdAt ? new Date(entry.createdAt).getTime() : Date.now();

  const kv = await getKv();
  if (kv) {
    await kv.set(`${ns}:item:${id}`, e);
    await kv.zadd(`${ns}:idx`, { score, member: id });
    return e;
  }
  const m = getMem(ns);
  m.items.set(id, e);
  m.order.unshift(id);
  return e;
}

/** Tek bir kayıt oku. */
export async function getEntry(ns, id) {
  const kv = await getKv();
  if (kv) {
    return (await kv.get(`${ns}:item:${id}`)) || null;
  }
  return getMem(ns).items.get(id) || null;
}

/** Kayıt güncelle (merge). Bulunamadıysa null döner. */
export async function patchEntry(ns, id, patch) {
  const existing = await getEntry(ns, id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, id };
  const kv = await getKv();
  if (kv) {
    await kv.set(`${ns}:item:${id}`, merged);
  } else {
    getMem(ns).items.set(id, merged);
  }
  return merged;
}

/** En yeniden eskiye sırayla liste döner. limit varsayılan 200. */
export async function listEntries(ns, { limit = 200, offset = 0 } = {}) {
  const kv = await getKv();
  if (kv) {
    // zrange REV — yüksek score'dan düşüğe (en yeni → en eski)
    const ids = await kv.zrange(`${ns}:idx`, offset, offset + limit - 1, { rev: true });
    if (!ids || ids.length === 0) return [];
    // mget yok → paralel get
    const items = await Promise.all(ids.map((id) => kv.get(`${ns}:item:${id}`)));
    return items.filter(Boolean);
  }
  const m = getMem(ns);
  return m.order.slice(offset, offset + limit).map((id) => m.items.get(id)).filter(Boolean);
}

/** Silme (admin). */
export async function deleteEntry(ns, id) {
  const kv = await getKv();
  if (kv) {
    await kv.del(`${ns}:item:${id}`);
    await kv.zrem(`${ns}:idx`, id);
    return true;
  }
  const m = getMem(ns);
  m.items.delete(id);
  m.order = m.order.filter((x) => x !== id);
  return true;
}
