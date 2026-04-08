import { NextResponse } from "next/server";

if (!global.consultationStore) { global.consultationStore = []; }

const ADMIN_KEY = "metallurgy2026";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name, email, company, subject, category,
      steelGrade, standard,
      chemicalAnalysis,
      situation,
      processParams,
      additionalInfo,
      files,
    } = body;

    if (!name || !email || !subject || !situation) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "pending",
      name,
      email,
      company: company || "",
      subject,
      category: category || "diger",
      steelGrade: steelGrade || "",
      standard: standard || "",
      chemicalAnalysis: chemicalAnalysis || "",
      situation,
      processParams: processParams || "",
      additionalInfo: additionalInfo || "",
      files: files || [],
      reply: null,
      repliedAt: null,
    };

    global.consultationStore.unshift(entry);
    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
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
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  try {
    const { id, status, reply } = await req.json();
    const item = (global.consultationStore || []).find(x => x.id === id);
    if (!item) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    if (status) item.status = status;
    if (reply !== undefined) {
      item.reply = reply;
      item.repliedAt = new Date().toISOString();
      item.status = "replied";
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
