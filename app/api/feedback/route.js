import { NextResponse } from "next/server";

if (!global.feedbackStore) { global.feedbackStore = []; }

const ADMIN_KEY = "metallurgy2026";

function checkAdmin(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("key") === ADMIN_KEY;
}

export async function POST(req) {
  try {
    const { name, email, type, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: "Missing" }, { status: 400 });
    global.feedbackStore.unshift({
      id: Date.now().toString(),
      name, email, type, message,
      date: new Date().toISOString(),
      read: false,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ feedback: global.feedbackStore || [] });
}

export async function PATCH(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();

    // Mark all as read
    if (body.markAllRead) {
      (global.feedbackStore || []).forEach(x => { x.read = true; });
      return NextResponse.json({ success: true });
    }

    // Mark single as read
    if (body.id) {
      const item = (global.feedbackStore || []).find(x => x.id === body.id);
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (body.read !== undefined) item.read = body.read;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    global.feedbackStore = (global.feedbackStore || []).filter(x => x.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
