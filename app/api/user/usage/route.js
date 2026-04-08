import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { STARTER_LIMIT } from "@/lib/planUtils";

function isPlanActive(meta) {
  if (meta.plan !== "professional") return false;
  if (!meta.planExpiresAt) return false;
  return new Date(meta.planExpiresAt) > new Date();
}

// GET /api/user/usage?tool=xxx — check access without recording
export async function GET(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ allowed: false, reason: "unauthenticated" }, { status: 401 });

  const tool = new URL(req.url).searchParams.get("tool");
  if (!tool) return NextResponse.json({ error: "Missing tool" }, { status: 400 });

  const clerkUser = await currentUser();
  const meta = clerkUser?.publicMetadata || {};

  if (isPlanActive(meta)) {
    return NextResponse.json({ allowed: true, reason: "pro", usageLeft: null });
  }

  const toolUsage = (await kv.get(`usage:${userId}`)) || {};
  const used = toolUsage[tool] || 0;
  const left = STARTER_LIMIT - used;
  if (left <= 0) return NextResponse.json({ allowed: false, reason: "limit", usageLeft: 0 }, { status: 403 });
  return NextResponse.json({ allowed: true, reason: "starter", usageLeft: left });
}

// POST /api/user/usage — record a tool use
export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ allowed: false, reason: "unauthenticated" }, { status: 401 });

  const { tool } = await req.json();
  if (!tool) return NextResponse.json({ error: "Missing tool" }, { status: 400 });

  const clerkUser = await currentUser();
  const meta = clerkUser?.publicMetadata || {};

  if (isPlanActive(meta)) {
    return NextResponse.json({ allowed: true, reason: "pro", usageLeft: null });
  }

  const toolUsage = (await kv.get(`usage:${userId}`)) || {};
  const used = toolUsage[tool] || 0;

  if (used >= STARTER_LIMIT) {
    return NextResponse.json({ allowed: false, reason: "limit", usageLeft: 0 }, { status: 403 });
  }

  const updated = { ...toolUsage, [tool]: used + 1 };
  await kv.set(`usage:${userId}`, updated);
  await kv.sadd("users:index", userId);

  return NextResponse.json({ allowed: true, reason: "starter", usageLeft: STARTER_LIMIT - (used + 1) });
}
