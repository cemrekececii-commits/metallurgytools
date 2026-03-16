import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { clerkClient } from "@clerk/nextjs/server";

// Disable body parsing — Stripe needs raw body
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Payment successful — activate subscription
      case "checkout.session.completed": {
        const session = event.data.object;
        const clerkUserId = session.metadata?.clerkUserId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (clerkUserId) {
          // Get subscription details to find the plan
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id;

          // Determine plan from price ID
          let plan = "starter";
          if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) {
            plan = "professional";
          }

          // Update Clerk user metadata
          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              plan: plan,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              subscriptionStatus: "active",
              calculationsUsed: 0,
            },
          });

          console.log(`User ${clerkUserId} activated: ${plan}`);
        }
        break;
      }

      // Subscription renewed / payment succeeded
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerkUserId;

          if (clerkUserId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscriptionStatus: "active",
                calculationsUsed: 0, // Reset monthly count
              },
            });
          }
        }
        break;
      }

      // Payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const clerkUserId = subscription.metadata?.clerkUserId;

          if (clerkUserId) {
            const client = await clerkClient();
            await client.users.updateUserMetadata(clerkUserId, {
              publicMetadata: {
                subscriptionStatus: "past_due",
              },
            });
          }
        }
        break;
      }

      // Subscription cancelled
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const clerkUserId = subscription.metadata?.clerkUserId;

        if (clerkUserId) {
          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              plan: "free_trial",
              subscriptionStatus: "cancelled",
              stripeSubscriptionId: null,
              stripePriceId: null,
            },
          });

          console.log(`User ${clerkUserId} subscription cancelled`);
        }
        break;
      }

      // Subscription updated (plan change)
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const clerkUserId = subscription.metadata?.clerkUserId;
        const priceId = subscription.items.data[0]?.price?.id;

        if (clerkUserId) {
          let plan = "starter";
          if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) {
            plan = "professional";
          }

          const client = await clerkClient();
          await client.users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
              plan: plan,
              stripePriceId: priceId,
              subscriptionStatus: subscription.status,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
