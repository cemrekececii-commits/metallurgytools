"use client";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";
import { useUser, SignUpButton } from "@clerk/nextjs";

const SHOPIER_LINKS = {
  starter: "https://www.shopier.com/metallurgytools/45481516",
  professional: "https://www.shopier.com/metallurgytools/45481563",
};

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const { t } = useLang();
  const currentPlan = user?.publicMetadata?.plan || "free_trial";

  const PLANS = [
    {
      name: "Starter",
      price: "$5",
      priceTR: "₺230",
      features: [t.access2tools, t.calc50, t.basicExport, t.emailSupport],
      highlight: false,
      link: SHOPIER_LINKS.starter,
    },
    {
      name: "Professional",
      price: "$9",
      priceTR: "₺415",
      features: [t.allTools, t.unlimitedCalc, t.fullExport, t.prioritySupport, t.apiAccess, t.customTemplates],
      highlight: true,
      link: SHOPIER_LINKS.professional,
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceTR: "Custom",
      features: [t.everythingPro, t.unlimitedApi, t.customDev, t.onPremise, t.dedicatedManager],
      highlight: false,
      link: null,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t.pricingTitle}
            </h1>
            <p className="text-dark-300 text-lg">{t.pricingDesc}</p>
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
                      {t.mostPopular}
                    </div>
                  )}

                  <div className="text-sm text-dark-200 font-medium mb-2">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold font-mono">
                      {plan.priceTR !== "Custom" ? plan.priceTR : "Custom"}
                    </span>
                    {plan.priceTR !== "Custom" && (
                      <span className="text-dark-300 text-sm">{t.month}</span>
                    )}
                  </div>
                  {plan.price !== "Custom" && (
                    <div className="text-xs text-dark-300 mb-6">
                      ≈ {plan.price}/month
                    </div>
                  )}
                  {plan.price === "Custom" && <div className="mb-6" />}

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
                      ✓ {t.currentPlan}
                    </button>
                  ) : plan.link ? (
                    <a
                      href={plan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-3 rounded-lg text-sm font-semibold text-center no-underline transition-all ${
                        plan.highlight
                          ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 hover:shadow-lg hover:shadow-gold-400/20"
                          : "bg-white/5 text-dark-50 border border-white/15 hover:border-gold-400/40"
                      }`}
                    >
                      {t.startFreeTrial}
                    </a>
                  ) : (
                    <a
                      href="mailto:contact@metallurgytools.com"
                      className="block w-full py-3 rounded-lg text-sm font-semibold text-center no-underline bg-transparent text-dark-50 border border-white/15 hover:border-gold-400/40 transition-colors"
                    >
                      {t.contactUs}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Payment info */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-lg px-5 py-3">
              <span className="text-lg">🔒</span>
              <span className="text-sm text-dark-300">
                Güvenli ödeme altyapısı: Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz.
              </span>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
              {t.faqTitle}
            </h2>
            {[
              { q: t.faq1q, a: t.faq1a },
              { q: t.faq2q, a: t.faq2a },
              { q: t.faq3q, a: t.faq3a },
              { q: t.faq4q, a: t.faq4a },
            ].map((faq, i) => (
              <div key={i} className="border-b border-white/[0.06] py-5">
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
