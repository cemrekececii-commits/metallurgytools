import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/adminAuth";
import { cleanString, stripTags, isEmail, approxByteSize } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

if (!global.feedbackStore) { global.feedbackStore = []; }

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
  // Public endpoint — rate limit zorunlu
  const ip = clientIp(req);
  const rl = await rateLimit(`feedback-post:${ip}`, { limit: 5, windowSec: 60 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen bir dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter || 60) } }
    );
  }

  try {
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
    }

    // Toplam gövde boyutu koruması (küçük form — 32 KB yeterli)
    if (approxByteSize(body) > 32 * 1024) {
      return NextResponse.json({ error: "İstek çok büyük" }, { status: 413 });
    }

    const name = cleanString(body.name, 120);
    const email = cleanString(body.email, 254);
    const type = cleanString(body.type, 40);
    const message = stripTags(body.message, 4000);

    if (!name || !isEmail(email) || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik veya geçersiz" }, { status: 400 });
    }

    global.feedbackStore.unshift({
      id: Date.now().toString(),
      name, email, type, message,
      date: new Date().toISOString(),
      read: false,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ feedback: global.feedbackStore || [] });
}

export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();

    if (body.markAllRead) {
      (global.feedbackStore || []).forEach(x => { x.read = true; });
      return NextResponse.json({ success: true });
    }

    if (body.id) {
      const item = (global.feedbackStore || []).find(x => x.id === body.id);
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (body.read !== undefined) item.read = !!body.read;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id || typeof id !== "string") return NextResponse.json({ error: "id required" }, { status: 400 });
    global.feedbackStore = (global.feedbackStore || []).filter(x => x.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
