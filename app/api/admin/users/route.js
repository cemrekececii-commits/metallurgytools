import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { ADMIN_KEY } from "@/lib/planUtils";

function checkAdmin(req) {
  const key = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key");
  return key === ADMIN_KEY;
}

// GET — list all users with plan info
export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clerkClient();
  const { data: clerkUsers } = await client.users.getUserList({ limit: 200 });

  const users = await Promise.all(clerkUsers.map(async (u) => {
    const meta = u.publicMetadata || {};
    const toolUsage = (await kv.get(`usage:${u.id}`)) || {};
    return {
      userId:   u.id,
      email:    u.emailAddresses?.[0]?.emailAddress || "",
      name:     [u.firstName, u.lastName].filter(Boolean).join(" "),
      plan:     meta.plan || "starter",
      subscriptionStatus: meta.subscriptionStatus || null,
      planExpiresAt:      meta.planExpiresAt || null,
      stripeCustomerId:   meta.stripeCustomerId || null,
      stripeSubscriptionId: meta.stripeSubscriptionId || null,
      consultationFreeUsed:    meta.consultationFreeUsed || false,
      consultationMonthlyUsed: meta.consultationMonthlyUsed || 0,
      createdAt: u.createdAt,
      toolUsage,
    };
  }));

  return NextResponse.json({ users });
}

// PATCH — manually update a user's plan (admin action)
export async function PATCH(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, plan, planExpiresAt, resetUsage, subscriptionStatus, consultationFreeUsed } = await req.json();
  if (!userId || !plan) return NextResponse.json({ error: "userId and plan required" }, { status: 400 });

  const client = await clerkClient();

  const updateMeta = { plan, subscriptionStatus: subscriptionStatus || "manual" };
  if (planExpiresAt !== undefined) updateMeta.planExpiresAt = planExpiresAt;
  if (consultationFreeUsed !== undefined) updateMeta.consultationFreeUsed = consultationFreeUsed;
  if (plan === "starter") { updateMeta.planExpiresAt = null; }

  await client.users.updateUserMetadata(userId, { publicMetadata: updateMeta });

  if (resetUsage) {
    await kv.del(`usage:${userId}`);
  }

  await kv.sadd("users:index", userId);
  return NextResponse.json({ success: true });
}
