"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import { useLang } from "@/lib/LanguageContext";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("grain-size");
  const { t } = useLang();

  const TOOLS = [
    { id: "grain-size", name: t.grainSize, shortName: t.grainSizeShort, desc: t.grainSizeDesc, icon: "🔬", tags: ["ASTM E112", "Metallography", "AI-Powered"], status: "live" },
    { id: "corrosion", name: t.corrosion, shortName: t.corrosionShort, desc: t.corrosionDesc, icon: "⚗️", tags: ["API 570", "Weight Loss", "Electrochemical"], status: "live" },
    { id: "phase-diagram", name: t.phaseDiagram, shortName: t.phaseDiagramShort, desc: t.phaseDiagramDesc, icon: "📊", tags: ["Thermodynamics", "Phase Fractions", "Interactive"], status: "live" },
    { id: "hardness", name: t.hardness, shortName: t.hardnessShort, desc: t.hardnessDesc, icon: "🔧", tags: ["ASTM E140", "HRC", "HV", "Brinell"], status: "live" },
    { id: "unit-converter", name: t.unitConverter, shortName: t.unitConverterShort, desc: t.unitConverterDesc, icon: "📐", tags: ["MPa-ksi", "J-ft·lb", "°C-°F"], status: "live" },
    { id: "dbtt", name: t.dbtt, shortName: t.dbttShort, desc: t.dbttDesc, icon: "❄️", tags: ["Charpy", "S355", "API 5L"], status: "coming" },
    { id: "inclusion", name: t.inclusion, shortName: t.inclusionShort, desc: t.inclusionDesc, icon: "🔎", tags: ["SEM-EDS", "ASTM E45", "AI"], status: "coming" },
  ];

  const PRICING = [
    { name: "Starter", price: "$5", features: [t.access2tools, t.calc50, t.basicExport, t.emailSupport], highlight: false, cta: t.startFreeTrial },
    { name: "Professional", price: "$9", features: [t.allTools, t.unlimitedCalc, t.fullExport, t.prioritySupport, t.apiAccess, t.customTemplates], highlight: true, cta: t.startFreeTrial },
    { name: "Enterprise", price: "Custom", features: [t.everythingPro, t.unlimitedApi, t.customDev, t.onPremise, t.dedicatedManager], highlight: false, cta: t.contactUs },
  ];

  const activeTool = TOOLS.find((tool) => tool.id === activeTab);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6">
            {t.heroTitle1}{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">{t.heroTitle2}</span>{" "}
            {t.heroTitle3}
          </h1>
          <p className="text-lg md:text-xl text-dark-200 max-w-xl mx-auto mb-12 leading-relaxed">{t.heroDesc}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-400/25 transition-all border-none font-sans">{t.startTrial}</button>
            </SignUpButton>
            <a href="#tools" className="border border-white/15 rounded-lg px-8 py-3.5 text-base font-medium hover:border-gold-400/50 transition-colors no-underline text-dark-50">{t.viewTools}</a>
          </div>
        </div>
        <div className="relative z-10 mt-20 flex gap-12 flex-wrap justify-center">
          {[{ val: "70,000+", label: t.stat1 }, { val: "18+", label: t.stat2 }, { val: "12", label: t.stat3 }].map((s, i) => (
            <div key={i} className="text-center min-w-[140px]">
              <div className="text-3xl font-bold font-mono text-gold-400">{s.val}</div>
              <div className="text-xs text-dark-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">{t.toolsSuiteTitle}</h2>
          <p className="text-dark-300 text-base max-w-md mx-auto">{t.toolsSuiteDesc}</p>
        </div>
        <div className="flex gap-2 mb-8 overflow-x-auto justify-center flex-wrap">
          {TOOLS.map((tool) => (
            <button key={tool.id} onClick={() => setActiveTab(tool.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all cursor-pointer border font-sans ${activeTab === tool.id ? "bg-gold-400/15 border-gold-400/40 text-gold-400" : "bg-white/[0.03] border-white/[0.08] text-dark-200 hover:border-white/20"}`}>
              <span>{tool.icon}</span>{tool.shortName}
              {tool.status === "coming" && <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-dark-300">{t.comingSoon}</span>}
            </button>
          ))}
        </div>
        {activeTool && (
          <div className="bg-gradient-to-br from-white/[0.03] to-gold-400/[0.03] border border-white/[0.08] rounded-2xl p-10 animate-fade-in">
            <div className="text-5xl mb-4">{activeTool.icon}</div>
            <h3 className="text-2xl font-semibold tracking-tight mb-3">{activeTool.name}</h3>
            <p className="text-dark-200 text-base leading-relaxed mb-5 max-w-xl">{activeTool.desc}</p>
            <div className="flex gap-2 flex-wrap">
              {activeTool.tags.map((tag) => (
                <span key={tag} className="bg-gold-400/10 border border-gold-400/20 rounded-md px-3 py-1 text-xs text-gold-400 font-mono">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-transparent via-gold-400/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">{t.pricingTitle}</h2>
            <p className="text-dark-300">{t.pricingDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-9 relative transition-all hover:-translate-y-1 ${plan.highlight ? "bg-gradient-to-br from-gold-400/[0.08] to-gold-400/[0.02] border border-gold-400/30 hover:shadow-xl hover:shadow-gold-400/10" : "bg-white/[0.02] border border-white/[0.08] hover:shadow-xl hover:shadow-black/30"}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wide">{t.mostPopular}</div>}
                <div className="text-sm text-dark-200 font-medium mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold font-mono">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-dark-300 text-sm">{t.month}</span>}
                </div>
                <div className="flex flex-col gap-3.5 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex gap-2.5 items-start text-sm text-dark-100">
                      <span className="text-gold-400 font-bold shrink-0">✓</span>{f}
                    </div>
                  ))}
                </div>
                <SignUpButton mode="modal">
                  <button className={`w-full py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all font-sans ${plan.highlight ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 border-none hover:shadow-lg hover:shadow-gold-400/20" : "bg-transparent text-dark-50 border border-white/15 hover:border-gold-400/40"}`}>{plan.cta}</button>
                </SignUpButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-5">{t.aboutTitle1}<br /><span className="text-gold-400">{t.aboutTitle2}</span></h2>
          <p className="text-dark-300 leading-relaxed mb-10">{t.aboutDesc}</p>
          <SignUpButton mode="modal">
            <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold cursor-pointer hover:shadow-xl hover:shadow-gold-400/25 transition-all border-none font-sans">{t.getStartedFree}</button>
          </SignUpButton>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-10 px-6 max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-500 rounded flex items-center justify-center text-xs font-bold text-dark-800 font-mono">M</div>
          <span className="text-xs text-dark-300">© 2026 MetallurgyTools. {t.allRights}</span>
        </div>
        <div className="flex gap-6 text-xs">
          {["LinkedIn", "Twitter", "Contact"].map((link) => (
            <a key={link} href="#" className="text-dark-300 hover:text-gold-400 transition-colors no-underline">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
