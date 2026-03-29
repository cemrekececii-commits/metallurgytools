import { NextResponse } from "next/server";
if (!global.feedbackStore) { global.feedbackStore = []; }
export async function POST(req) {
  try {
    const { name, email, type, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: "Missing" }, { status: 400 });
    global.feedbackStore.unshift({ id: Date.now().toString(), name, email, type, message, date: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== "metallurgy2026") return NextResponse.json({ error: "No" }, { status: 401 });
  return NextResponse.json({ feedback: global.feedbackStore || [] });
}
