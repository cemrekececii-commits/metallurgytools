import { NextResponse } from "next/server";

// In-memory storage (resets on server restart, but works reliably)
if (!global.feedbackStore) {
  global.feedbackStore = [];
}

export async function POST(req) {
  try {
    const { name, email, type, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const feedback = {
      id: Date.now().toString(),
      name,
      email,
      type: type || "General",
      message,
      date: new Date().toISOString(),
    };

    global.feedbackStore.unshift(feedback);

    // Keep last 500 entries
    if (global.feedbackStore.length > 500) {
      global.feedbackStore = global.feedbackStore.slice(0, 500);
    }

    console.log(`[FEEDBACK] ${type} from ${name} (${email}): ${message.substring(0, 100)}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key !== "metallurgy2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ feedback: global.feedbackStore, total: global.feedbackStore.length });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
