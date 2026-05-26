/**
 * lib/validation.js
 * ──────────────────────────────────────────────────────────────────────
 * Sunucu tarafı giriş doğrulama ve temizleme yardımcıları.
 *
 * Prensip: "Validate on the server, escape on render."
 *   - Bu modül yalnızca doğrular ve kırpar; HTML kaçırma (escape) işlemini
 *     render katmanı yapar (parseMarkdown zaten &/</>  kaçırıyor).
 *   - Kontrol karakterlerini temizler (null byte, control chars).
 */

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}$/i;
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanString(v, max = 500) {
  if (typeof v !== "string") return "";
  return v.replace(CONTROL_CHARS_RE, "").trim().slice(0, max);
}

export function isEmail(v) {
  if (typeof v !== "string") return false;
  if (v.length > 254) return false; // RFC 5321 local+domain max
  return EMAIL_RE.test(v);
}

export function isSlug(v) {
  return typeof v === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) && v.length <= 120;
}

/**
 * JSON gövde için toplam bayt boyutu koruması.
 * Next.js serverAction bodySizeLimit'i genel limit — burada kullanıcı
 * başına daha sıkı limit uygulanabilir.
 */
export function approxByteSize(obj) {
  try { return Buffer.byteLength(JSON.stringify(obj), "utf8"); }
  catch { return Infinity; }
}

/**
 * Gelen listede base64 data URL'leri varsa toplam boyut kontrolü.
 * files: [{name, type, dataUrl}]
 */
export function validateAttachments(files, { maxCount = 5, maxTotalBytes = 6 * 1024 * 1024 } = {}) {
  if (!Array.isArray(files)) return { ok: true, files: [] };
  if (files.length > maxCount) {
    return { ok: false, error: `En fazla ${maxCount} dosya eklenebilir` };
  }
  let total = 0;
  const safe = [];
  for (const f of files) {
    if (!f || typeof f !== "object") continue;
    const name = cleanString(f.name, 200);
    const type = cleanString(f.type, 100);
    const dataUrl = typeof f.dataUrl === "string" ? f.dataUrl : "";
    // Yalnızca data:image/* veya data:application/pdf türlerine izin ver
    if (!/^data:(image\/(png|jpeg|jpg|webp|gif)|application\/pdf);base64,/i.test(dataUrl)) {
      return { ok: false, error: "Geçersiz dosya türü" };
    }
    // base64 uzunluğundan yaklaşık bayt
    const b64 = dataUrl.split(",")[1] || "";
    const approx = Math.floor(b64.length * 0.75);
    total += approx;
    if (total > maxTotalBytes) {
      return { ok: false, error: "Toplam dosya boyutu limiti aşıldı (6 MB)" };
    }
    safe.push({ name, type, dataUrl });
  }
  return { ok: true, files: safe };
}

/**
 * Çok basit bir HTML tag stripleyici — metin alanlarında kullanıcıdan gelen
 * HTML/JS'i düz metne indirger. Render katmanı ayrıca escape eder.
 */
export function stripTags(v, max = 5000) {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").replace(CONTROL_CHARS_RE, "").trim().slice(0, max);
}
