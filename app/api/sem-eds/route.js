import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { mode, element, energy, imageBase64, imageMimeType } = await req.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

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
    if (mode === "image" && imageBase64) {
      parts = [
        { inline_data: { mime_type: imageMimeType || "image/png", data: imageBase64 } },
        { text: "Bu SEM-EDS spektrum görüntüsünü analiz et. Ana elementleri ve pikleri tanımla. Pik çakışmalarını belirle. Otomatik etiketleme hatalarını tespit et." }
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
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || "Gemini API error" }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return NextResponse.json({ error: "No response from API" }, { status: 500 });

    // Parse JSON, handling potential markdown fences
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("SEM-EDS API error:", err);
    return NextResponse.json({ error: "Analysis failed: " + err.message }, { status: 500 });
  }
}
