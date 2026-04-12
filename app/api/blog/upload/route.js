import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/imageStorage";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.BLOG_ADMIN_KEY || "metallurgy2026";
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // ── JSON / base64 path (primary — avoids FormData parsing issues) ────────
    if (contentType.includes("application/json")) {
      let body;
      try { body = await req.json(); }
      catch { return NextResponse.json({ error: "JSON ayrıştırma hatası." }, { status: 400 }); }

      const { adminKey, name, type, data } = body;

      if (adminKey !== ADMIN_KEY) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
      }
      if (!data || !type) {
        return NextResponse.json({ error: "Dosya verisi eksik." }, { status: 400 });
      }
      if (!type.startsWith("image/")) {
        return NextResponse.json({ error: `Geçersiz dosya türü: ${type}` }, { status: 400 });
      }

      const base64 = data.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");

      if (buffer.length > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Dosya çok büyük (${(buffer.length / 1024 / 1024).toFixed(1)} MB). Maksimum 15 MB.` },
          { status: 400 }
        );
      }

      const url = await uploadImage(name || "image", buffer, type);
      return NextResponse.json({ url, size: buffer.length, type });
    }

    // ── FormData fallback ────────────────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      let formData;
      try { formData = await req.formData(); }
      catch (e) {
        return NextResponse.json(
          { error: `Dosya ayrıştırılamadı: ${e.message}. Dosya boyutu çok büyük olabilir.` },
          { status: 413 }
        );
      }

      const adminKey = formData.get("adminKey");
      const file = formData.get("file");

      if (adminKey !== ADMIN_KEY) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
      }
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: `Geçersiz tür: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 15 MB.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const url = await uploadImage(file.name, buffer, file.type);
      return NextResponse.json({ url, size: file.size, type: file.type });
    }

    return NextResponse.json({ error: "Desteklenmeyen içerik türü." }, { status: 415 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Sunucu hatası" }, { status: 500 });
  }
}
