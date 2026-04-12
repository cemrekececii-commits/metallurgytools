/**
 * imageStorage.js
 * ───────────────
 * Vercel Blob when BLOB_READ_WRITE_TOKEN env var is present.
 * Falls back to local filesystem (public/blog-images/) for local development.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

function isBlobAvailable() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function getExtFromMime(mime) {
  const map = {
    "image/jpeg": ".jpg", "image/jpg": ".jpg",
    "image/png": ".png", "image/webp": ".webp",
    "image/gif": ".gif",  "image/avif": ".avif",
    "image/bmp": ".bmp",  "image/tiff": ".tif",
    "image/heic": ".heic", "image/heif": ".heif",
  };
  return map[mime] || ".jpg";
}

function buildFilename(originalName, mime) {
  const ext = getExtFromMime(mime);
  const safe = (originalName || "image")
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 40);
  return `${Date.now()}-${safe}${ext}`;
}

/**
 * Upload an image buffer.
 * @param {string}  originalName  Original filename (for extension/safe naming)
 * @param {Buffer}  buffer        Raw image bytes
 * @param {string}  contentType   MIME type
 * @returns {Promise<string>}     Public URL
 */
export async function uploadImage(originalName, buffer, contentType) {
  const filename = buildFilename(originalName, contentType);

  // ── Vercel Blob ───────────────────────────────────────────────────────────
  if (isBlobAvailable()) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`blog-images/${filename}`, buffer, {
        access: "public",
        contentType,
        addRandomSuffix: false,
      });
      return blob.url;
    } catch (e) {
      throw new Error(`Blob yükleme hatası: ${e.message}`);
    }
  }

  // ── Local filesystem fallback ─────────────────────────────────────────────
  const uploadDir = join(process.cwd(), "public", "blog-images");
  try {
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    throw new Error(`Klasör oluşturulamadı: ${e.message}`);
  }
  try {
    writeFileSync(join(uploadDir, filename), buffer);
  } catch (e) {
    throw new Error(`Dosya yazılamadı: ${e.message}`);
  }
  return `/blog-images/${filename}`;
}
