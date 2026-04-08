import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const clerkUser = await currentUser();
  const meta = clerkUser?.publicMetadata || {};

  // If no plan set yet → initialize as starter
  if (!meta.plan) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan: "starter",
        subscriptionStatus: null,
        planExpiresAt: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        consultationFreeUsed: false,
        consultationMonthlyUsed: 0,
        consultationMonth: null,
        createdAt: new Date().toISOString(),
      },
    });
    await kv.sadd("users:index", userId);
  }

  // Get tool usage from KV
  const toolUsage = (await kv.get(`usage:${userId}`)) || {};

  return NextResponse.json({
    userId,
    email:  clerkUser?.emailAddresses?.[0]?.emailAddress || "",
    name:   [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" "),
    plan:   meta.plan || "starter",
    subscriptionStatus: meta.subscriptionStatus || null,
    planExpiresAt:      meta.planExpiresAt || null,
    consultationFreeUsed:   meta.consultationFreeUsed || false,
    consultationMonthlyUsed: meta.consultationMonthlyUsed || 0,
    consultationMonth:      meta.consultationMonth || null,
    toolUsage,
  });
}
