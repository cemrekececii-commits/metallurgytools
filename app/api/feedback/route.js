import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/adminAuth";
import { cleanString, stripTags, isEmail, approxByteSize } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { putEntry, getEntry, patchEntry, listEntries, deleteEntry } from "@/lib/kvStore";

export const dynamic = "force-dynamic";

const NS = "feedback";

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

    if (approxByteSize(body) > 32 * 1024) {
      return NextResponse.json({ error: "İstek çok büyük" }, { status: 413 });
    }

    const name    = cleanString(body.name, 120);
    const email   = cleanString(body.email, 254);
    const type    = cleanString(body.type, 40);
    const message = stripTags(body.message, 4000);

    if (!name || !isEmail(email) || !message) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik veya geçersiz" }, { status: 400 });
    }

    // KVKK aydınlatma metnine açık rıza beyanı
    if (body.kvkkConsent !== true) {
      return NextResponse.json(
        { error: "Aydınlatma metnine açık rıza zorunludur." },
        { status: 400 }
      );
    }

    await putEntry(NS, {
      id: Date.now().toString(),
      name, email, type, message,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false,
      kvkkConsentAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gönderim başarısız" }, { status: 500 });
  }
}

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await listEntries(NS, { limit: 500 });
  return NextResponse.json({ feedback: items });
}

export async function PATCH(req) {
  if (!requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();

    if (body.markAllRead) {
      const items = await listEntries(NS, { limit: 1000 });
      await Promise.all(items.filter((x) => !x.read).map((x) => patchEntry(NS, x.id, { read: true })));
      return NextResponse.json({ success: true });
    }

    if (body.id) {
      const updated = await patchEntry(NS, body.id, { read: body.read === undefined ? true : !!body.read });
      if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    const existing = await getEntry(NS, id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await deleteEntry(NS, id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
