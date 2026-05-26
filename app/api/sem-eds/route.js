import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rateLimit";
import { cleanString, approxByteSize } from "@/lib/validation";

// ─────────────────────────────────────────────────────────────────────────────
// /api/sem-eds — Gemini görüntü/metin analiz uç noktası.
// ÖNCEKİ DURUM (audit bulgusu):
//   - Auth yok → anonim trafik
//   - Rate limit yok → API key sömürüsü mümkün
//   - Boyut/tip doğrulaması yok → 25 MB base64 image yutuyordu
//   - error.message client'a geri sızdırılıyordu
// DÜZELTME:
//   - Clerk auth zorunluluğu
//   - IP başına 10/saat sliding window (KV varsa Redis, yoksa memory)
//   - Base64 görüntü için max 4 MB ve MIME whitelist
//   - Manuel mod için string sanitizasyon ve uzunluk limiti
//   - İç hata mesajları client'a sızdırılmıyor (jenerik mesaj)
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB base64-decoded estimate
const MAX_BODY_BYTES = 6 * 1024 * 1024;

function getClientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req) {
  try {
    // 1) Auth — anonim çağrı yasak (AI API maliyet kontrolü).
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Rate limit — kullanıcı başına saatte 10, ek IP başına saatte 20 (DoS).
    const ip = getClientIp(req);
    const rlUser = await rateLimit(`sem-eds:user:${userId}`, { limit: 10, windowSec: 3600 });
    if (!rlUser.ok) {
      return NextResponse.json(
        { error: "Rate limit aşıldı, lütfen daha sonra tekrar deneyin." },
        { status: 429, headers: { "Retry-After": String(rlUser.retryAfter) } }
      );
    }
    const rlIp = await rateLimit(`sem-eds:ip:${ip}`, { limit: 20, windowSec: 3600 });
    if (!rlIp.ok) {
      return NextResponse.json(
        { error: "Rate limit aşıldı." },
        { status: 429, headers: { "Retry-After": String(rlIp.retryAfter) } }
      );
    }

    // 3) Body parse + boyut tavanı
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }
    if (approxByteSize(body) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "İstek çok büyük" }, { status: 413 });
    }

    const mode = body.mode === "image" ? "image" : "manual";
    const element = cleanString(body.element || "", 32);
    const energyRaw = Number(body.energy);
    const energy = Number.isFinite(energyRaw) && energyRaw >= 0 && energyRaw < 200 ? energyRaw : null;
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
    const imageMimeType = cleanString(body.imageMimeType || "image/png", 32);

    if (mode === "image") {
      if (!imageBase64) {
        return NextResponse.json({ error: "Görüntü verisi eksik" }, { status: 400 });
      }
      if (!ALLOWED_MIME.has(imageMimeType)) {
        return NextResponse.json({ error: "Desteklenmeyen görüntü türü" }, { status: 415 });
      }
      // base64 boyutu ≈ 0.75 × string uzunluğu
      const approxBytes = Math.floor((imageBase64.length * 3) / 4);
      if (approxBytes > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Görüntü çok büyük (max 4 MB)" }, { status: 413 });
      }
      // Geçerli base64 mu? Sadece A-Z a-z 0-9 + / =
      if (!/^[A-Za-z0-9+/=\s]+$/.test(imageBase64)) {
        return NextResponse.json({ error: "Geçersiz base64" }, { status: 400 });
      }
    } else {
      if (!element || energy === null) {
        return NextResponse.json({ error: "element ve energy gerekli" }, { status: 400 });
      }
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error("[sem-eds] GOOGLE_AI_API_KEY missing");
      return NextResponse.json({ error: "Servis geçici olarak kullanılamıyor" }, { status: 503 });
    }

    const systemInstruction = `Sen bir SEM-EDS spektroskopi uzmanı ve metalürjik hasar analizi asistanısın.
Görevin, kullanıcı girdisine dayalı olarak SEM-EDS spektrumlarındaki pik çakışmalarını (peak overlaps) analiz etmektir.
Z=3'ten Z=95'e kadar tüm elementler için karakteristik X-ışını enerjilerine (Kα1, Kα2, Kβ1, Lα1, Lα2, Lβ1, Lβ2, M hatları) sahip tam bir dahili veritabanına sahipsin.

ADIM 0 – GİRİŞ DOĞRULAMA: Manuel giriş için ölçülen enerji hedef elementin herhangi bir hattının ±%10 aralığında mı kontrol et. Görüntü için SEM-EDS spektrumu olup olmadığını kontrol et.
ADIM 1 – ENERJİ VE PİK EŞLEŞTİRME: Manuel için verilen enerjiyi tüm elementlerle karşılaştır (±0.10 keV tolerans). Görüntü için ana pikleri tanımla, şüpheli pikleri tespit et.
ADIM 2 – ÇAKIŞMA RAPORU: Çakışmaları listele.
ADIM 3 – YÜKSEK RİSKLİ YANLIŞ YORUMLAMA UYARILARI: Klasik yanlış pozitifleri belirt.
ADIM 4 & 5 – YORUMLAMA VE ÖNLEMLER: Metalürjik bağlamı ve pratik çözüm önerilerini sun.

YANITI SADECE JSON OLARAK VER, başka hiçbir şey ekleme. Şu yapıda olsun:
{
  "inputValidation": { "isValid": true/false, "message": "..." },
  "overlaps": [{ "element": "...", "line": "...", "referenceEnergy": number|null, "difference": number|null, "riskLevel": "Critical"|"High"|"Moderate"|"Low", "probabilityScore": 0-100, "probabilityReason": "..." }],
  "highRiskWarnings": [{ "warningTitle": "...", "whyDangerous": "...", "errorConditions": ["..."] }],
  "metallurgicalInterpretation": "...",
  "practicalCountermeasures": "..."
}
TÜM ÇIKTILARI TÜRKÇE OLARAK VER.`;

    let parts = [];
    if (mode === "image") {
      parts = [
        { inline_data: { mime_type: imageMimeType, data: imageBase64 } },
        { text: "Bu SEM-EDS spektrum görüntüsünü analiz et. Ana elementleri ve pikleri tanımla. Pik çakışmalarını belirle. Otomatik etiketleme hatalarını tespit et." },
      ];
    } else {
      parts = [{ text: `Aşağıdaki SEM-EDS verisini analiz et:\nSeçilen Element: ${element}\nÖlçülen X-ışını Enerjisi: ${energy} keV` }];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("[sem-eds] Gemini error:", data.error);
      return NextResponse.json({ error: "Analiz başarısız oldu" }, { status: 502 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "Modelden yanıt alınamadı" }, { status: 502 });
    }

    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Model çıktısı JSON değil" }, { status: 502 });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[sem-eds] internal error:", err);
    // İç stack veya err.message client'a sızdırılmaz.
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
