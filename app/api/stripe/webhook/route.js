import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { clerkClient } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

function planExpiresAt(periodEnd) {
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

export async function POST(request) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook sig failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const client = await clerkClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const clerkUserId  = session.metadata?.clerkUserId;
        const customerId   = session.customer;
        const subscriptionId = session.subscription;
        if (!clerkUserId) break;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            plan: "professional",
            subscriptionStatus: "active",
            stripeCustomerId:     customerId,
            stripeSubscriptionId: subscriptionId,
            planExpiresAt:        planExpiresAt(subscription.current_period_end),
            consultationMonthlyUsed: 0,
            consultationMonth:    null,
          },
        });
        await kv.sadd("users:index", clerkUserId);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subId   = invoice.subscription;
        if (!subId) break;
        const subscription = await stripe.subscriptions.retrieve(subId);
        const clerkUserId  = subscription.metadata?.clerkUserId;
        if (!clerkUserId) break;
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            subscriptionStatus: "active",
            planExpiresAt: planExpiresAt(subscription.current_period_end),
            consultationMonthlyUsed: 0,
            consultationMonth: null,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subId   = invoice.subscription;
        if (!subId) break;
        const subscription = await stripe.subscriptions.retrieve(subId);
        const clerkUserId  = subscription.metadata?.clerkUserId;
        if (!clerkUserId) break;
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: { subscriptionStatus: "past_due" },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const clerkUserId  = subscription.metadata?.clerkUserId;
        if (!clerkUserId) break;
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            plan: "starter",
            subscriptionStatus: "cancelled",
            planExpiresAt: null,
            stripeSubscriptionId: null,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
