"use client";
import { useState } from "react";
import { useUser, SignUpButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

const PLANS = [
  {
    name: "Starter",
    price: "$5",
    period: "/month",
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_STARTER",
    features: [
      "Access to 2 tools",
      "50 calculations/month",
      "Basic export (CSV)",
      "Email support",
    ],
    highlight: false,
    cta: "Start 7-Day Free Trial",
  },
  {
    name: "Professional",
    price: "$9",
    period: "/month",
    priceEnv: "NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL",
    features: [
      "All available tools",
      "Unlimited calculations",
      "Full export (CSV, PDF, DOCX)",
      "Priority support",
      "API access (100 calls/day)",
      "Custom report templates",
    ],
    highlight: true,
    cta: "Start 7-Day Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Everything in Professional",
      "Unlimited API access",
      "Custom tool development",
      "On-premise deployment option",
      "Dedicated account manager",
    ],
    highlight: false,
    cta: "Contact Us",
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(null);
  const currentPlan = user?.publicMetadata?.plan || "free_trial";

  const handleCheckout = async (planName) => {
    if (!isSignedIn) return;

    setLoading(planName);

    try {
      // Get price ID from environment
      let priceId;
      if (planName === "Starter") {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER;
      } else if (planName === "Professional") {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL;
      }

      if (!priceId) {
        alert("Plan configuration error. Please contact support.");
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-dark-300 text-lg">
              7-day free trial on all plans. Cancel anytime.
            </p>

            {currentPlan !== "free_trial" && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-2 text-sm text-gold-400">
                Current plan: <span className="font-semibold uppercase">{currentPlan}</span>
                <button
                  onClick={handleManageSubscription}
                  className="ml-2 underline hover:no-underline cursor-pointer bg-transparent border-none text-gold-400 font-sans text-sm"
                >
                  {loading === "manage" ? "Loading..." : "Manage Subscription"}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PLANS.map((plan) => {
              const isCurrentPlan =
                (plan.name === "Starter" && currentPlan === "starter") ||
                (plan.name === "Professional" && currentPlan === "professional");

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-9 relative transition-all hover:-translate-y-1 ${
                    plan.highlight
                      ? "bg-gradient-to-br from-gold-400/[0.08] to-gold-400/[0.02] border border-gold-400/30 hover:shadow-xl hover:shadow-gold-400/10"
                      : "bg-white/[0.02] border border-white/[0.08] hover:shadow-xl hover:shadow-black/30"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}

                  <div className="text-sm text-dark-200 font-medium mb-2">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold font-mono">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-dark-300 text-sm">{plan.period}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3.5 mb-8">
                    {plan.features.map((f) => (
                      <div
                        key={f}
                        className="flex gap-2.5 items-start text-sm text-dark-100"
                      >
                        <span className="text-gold-400 font-bold shrink-0">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <button
                      className="w-full py-3 rounded-lg text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30 cursor-default font-sans"
                      disabled
                    >
                      ✓ Current Plan
                    </button>
                  ) : plan.name === "Enterprise" ? (
                    <a
                      href="mailto:contact@metallurgytools.com"
                      className="block w-full py-3 rounded-lg text-sm font-semibold text-center no-underline bg-transparent text-dark-50 border border-white/15 hover:border-gold-400/40 transition-colors"
                    >
                      Contact Us
                    </a>
                  ) : isSignedIn ? (
                    <button
                      onClick={() => handleCheckout(plan.name)}
                      disabled={loading === plan.name}
                      className={`w-full py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all font-sans border-none ${
                        plan.highlight
                          ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 hover:shadow-lg hover:shadow-gold-400/20"
                          : "bg-white/5 text-dark-50 border border-white/15 hover:border-gold-400/40"
                      } ${loading === plan.name ? "opacity-50" : ""}`}
                    >
                      {loading === plan.name ? "Redirecting to Stripe..." : plan.cta}
                    </button>
                  ) : (
                    <SignUpButton mode="modal">
                      <button
                        className={`w-full py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all font-sans border-none ${
                          plan.highlight
                            ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 hover:shadow-lg hover:shadow-gold-400/20"
                            : "bg-white/5 text-dark-50 border border-white/15 hover:border-gold-400/40"
                        }`}
                      >
                        Sign Up to Subscribe
                      </button>
                    </SignUpButton>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
              Frequently Asked Questions
            </h2>
            {[
              {
                q: "Is there a free trial?",
                a: "Yes! All plans include a 7-day free trial. You won't be charged until the trial ends. Cancel anytime during the trial at no cost.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) through Stripe's secure payment platform.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel anytime from the 'Manage Subscription' link. Your access continues until the end of the billing period.",
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "Yes, you can change your plan at any time. Stripe will automatically prorate the difference.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="border-b border-white/[0.06] py-5"
              >
                <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                <p className="text-dark-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
