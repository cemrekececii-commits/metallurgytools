import { NextResponse } from "next/server";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe-server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    const meta = clerkUser?.publicMetadata || {};
    let customerId = meta.stripeCustomerId;

    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
    const name  = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim();

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { clerkUserId: userId },
      });
      customerId = customer.id;
      // Save stripe customer ID
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { ...meta, stripeCustomerId: customerId },
      });
    }

    const priceId = process.env.STRIPE_PRICE_PROFESSIONAL;
    const appUrl  = process.env.NEXT_PUBLIC_APP_URL || "https://metallurgytools.com";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?payment=success`,
      cancel_url:  `${appUrl}/pricing?payment=cancelled`,
      subscription_data: { metadata: { clerkUserId: userId } },
      metadata: { clerkUserId: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
