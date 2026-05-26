import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/adminAuth";
import {
  cleanString, stripTags, isEmail, approxByteSize, validateAttachments
} from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

if (!global.consultationStore) { global.consultationStore = []; }

function clientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function requireAdmin() {
  return isAdminAuthed(cookies());
}

export async function POST(req) {
  const ip = clientIp(req);
  const rl = await rateLimit(`consult-post:${ip}`, { limit: 3, windowSec: 300 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  try {
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // Toplam istek boyutu koruması (dosyalar hariç metin ~ 64 KB yeterli;
    // dosyalar aşağıda validateAttachments ile ayrıca sınırlanır)
    if (approxByteSize({ ...body, files: undefined }) > 64 * 1024) {
      return NextResponse.json({ error: "Metin alanları çok büyük" }, { status: 413 });
    }

    const name          = cleanString(body.name, 120);
    const email         = cleanString(body.email, 254);
    const company       = cleanString(body.company, 160);
    const subject       = cleanString(body.subject, 200);
    const category      = cleanString(body.category, 40);
    const steelGrade    = cleanString(body.steelGrade, 80);
    const standard      = cleanString(body.standard, 80);
    const chemicalAnalysis = stripTags(body.chemicalAnalysis, 4000);
    const situation     = stripTags(body.situation, 8000);
    const processParams = stripTags(body.processParams, 4000);
    const additionalInfo= stripTags(body.additionalInfo, 4000);

    if (!name || !isEmail(email) || !subject || !situation) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik veya geçersiz" }, { status: 400 });
    }

    const att = validateAttachments(body.files, { maxCount: 5, maxTotalBytes: 6 * 1024 * 1024 });
    if (!att.ok) return NextResponse.json({ error: att.error }, { status: 400 });

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "pending",
      name, email, company, subject, category,
      steelGrade, standard,
      chemicalAnalysis, situation, processParams, additionalInfo,
      files: att.files,
      reply: null,
      repliedAt: null,
    };

    global.consultationStore.unshift(entry);
    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    // Hata detaylarını istemciye sızdırma
    console.error("consultation POST:", err?.message);
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}

export async function GET(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const item = (global.consultationStore || []).find(x => x.id === id);
    return NextResponse.json({ item: item || null });
  }
  const list = (global.consultationStore || []).map(x => ({
    id: x.id, date: x.date, status: x.status,
    name: x.name, email: x.email, subject: x.subject, category: x.category,
    filesCount: x.files?.length || 0,
  }));
  return NextResponse.json({ consultations: list });
}

export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    const { id, status, reply } = await req.json();
    const item = (global.consultationStore || []).find(x => x.id === id);
    if (!item) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    if (status) item.status = cleanString(status, 40);
    if (reply !== undefined) {
      item.reply = stripTags(reply, 8000);
      item.repliedAt = new Date().toISOString();
      item.status = "replied";
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
