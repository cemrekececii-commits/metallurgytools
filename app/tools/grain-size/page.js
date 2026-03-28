"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import { useLang } from "@/lib/LanguageContext";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("grain-size");
  const { t, lang } = useLang();

  const TOOLS = [
    { id: "grain-size", name: t.grainSize, shortName: t.grainSizeShort, desc: t.grainSizeDesc, icon: "🔬", tags: ["ASTM E112", "Metallography", "AI-Powered"], status: "live", route: "/tools/grain-size" },
    { id: "corrosion", name: t.corrosion, shortName: t.corrosionShort, desc: t.corrosionDesc, icon: "⚗️", tags: ["API 570", "Weight Loss", "Electrochemical"], status: "live", route: "/tools/corrosion" },
    { id: "phase-diagram", name: t.phaseDiagram, shortName: t.phaseDiagramShort, desc: t.phaseDiagramDesc, icon: "📊", tags: ["Thermodynamics", "Phase Fractions", "Interactive"], status: "live", route: "/tools/phase-diagram" },
    { id: "hardness", name: t.hardness, shortName: t.hardnessShort, desc: t.hardnessDesc, icon: "🔧", tags: ["ASTM E140", "HRC", "HV", "Brinell"], status: "live", route: "/tools/hardness" },
    { id: "unit-converter", name: t.unitConverter, shortName: t.unitConverterShort, desc: t.unitConverterDesc, icon: "📐", tags: ["MPa-ksi", "J-ft·lb", "°C-°F"], status: "live", route: "/tools/unit-converter" },
    { id: "dbtt", name: t.dbtt, shortName: t.dbttShort, desc: t.dbttDesc, icon: "❄️", tags: ["Charpy", "S355", "API 5L"], status: "coming", route: null },
    { id: "inclusion", name: t.inclusion, shortName: t.inclusionShort, desc: t.inclusionDesc, icon: "🔎", tags: ["SEM-EDS", "ASTM E45", "AI"], status: "coming", route: null },
  ];

  const PRICING = [
    { name: "Starter", price: "$5", priceTR: "₺230", features: [t.access2tools, t.calc50, t.basicExport, t.emailSupport], highlight: false, cta: t.startFreeTrial },
    { name: "Professional", price: "$9", priceTR: "₺415", features: [t.allTools, t.unlimitedCalc, t.fullExport, t.prioritySupport, t.apiAccess, t.customTemplates], highlight: true, cta: t.startFreeTrial },
    { name: "Enterprise", price: "Custom", features: [t.everythingPro, t.unlimitedApi, t.customDev, t.onPremise, t.dedicatedManager], highlight: false, cta: t.contactUs },
  ];

  const activeTool = TOOLS.find((tool) => tool.id === activeTab);

  // Detailed intro texts
  const heroDescTR = "Entegre demir-çelik tesislerinde çalışan, üretim hattından laboratuvara kadar sektörün her aşamasında deneyim kazanmış uzman metalurji mühendisleri tarafından geliştirilen profesyonel hesaplama ve analiz platformu. Tane boyutu ölçümünden sertlik dönüşümüne, faz diyagramı simülasyonundan korozyon değerlendirmesine kadar — gerçek üretim verilerine dayalı, uluslararası standartlarla uyumlu araçlar.";
  const heroDescEN = "A professional computation and analysis platform developed by expert metallurgical engineers with hands-on experience across every stage of integrated steel plant operations — from the production line to the testing laboratory. From grain size measurement to hardness conversion, phase diagram simulation to corrosion assessment — tools built on real production data and aligned with international standards.";

  const featuresTR = [
    { icon: "🏭", title: "Sektörün İçinden", desc: "BOF çelik üretiminden sürekli döküme, haddeleme hatlarından kalite kontrol laboratuvarına kadar — gerçek saha deneyimiyle tasarlanmış araçlar." },
    { icon: "📐", title: "Standartlara Uyumlu", desc: "ASTM E112, ASTM E140, ISO 18265, API 570, ASME FFS-1 gibi uluslararası standartlara dayalı hesaplama ve dönüşüm altyapısı." },
    { icon: "🔬", title: "Metalografik Doğrulama", desc: "Her araç, optik ve elektron mikroskobu verileriyle doğrulanmış. Laboratuvar pratiğiyle uyumlu, üretim kalite kontrol süreçlerine entegre." },
    { icon: "🧪", title: "Hasar Analizi Odaklı", desc: "Müşteri şikayeti numunelerinden kök neden analizine, inklüzyon karakterizasyonundan kırılma mekaniğine — hasar analizi perspektifiyle geliştirilmiş." },
    { icon: "🌍", title: "Küresel Erişim", desc: "Türkçe ve İngilizce dil desteği. Dünyanın her yerindeki metalurji mühendisleri için tasarlanmış, tarayıcı tabanlı platform." },
    { icon: "📊", title: "Sürekli Gelişim", desc: "DBTT tahmin motoru, inklüzyon sınıflandırıcı ve daha fazlası geliştirme aşamasında. Yapay zeka destekli yeni araçlar yakında." },
  ];
  const featuresEN = [
    { icon: "🏭", title: "From the Industry", desc: "Designed with real field experience — from BOF steelmaking to continuous casting, rolling lines to quality control laboratories." },
    { icon: "📐", title: "Standards-Compliant", desc: "Built on international standards including ASTM E112, ASTM E140, ISO 18265, API 570, and ASME FFS-1." },
    { icon: "🔬", title: "Metallographically Validated", desc: "Every tool validated against optical and electron microscopy data. Compatible with laboratory practice and production QC processes." },
    { icon: "🧪", title: "Failure Analysis Focused", desc: "From customer complaint root cause analysis to inclusion characterization and fracture mechanics — developed with a failure analysis perspective." },
    { icon: "🌍", title: "Global Access", desc: "Turkish and English language support. Browser-based platform designed for metallurgical engineers worldwide." },
    { icon: "📊", title: "Continuous Development", desc: "DBTT prediction engine, inclusion classifier and more in development. AI-powered new tools coming soon." },
  ];

  const features = lang === "tr" ? featuresTR : featuresEN;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6">
            {t.heroTitle1}{" "}
            <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">{t.heroTitle2}</span>{" "}
            {t.heroTitle3}
          </h1>
          <p className="text-base md:text-lg text-dark-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            {lang === "tr" ? heroDescTR : heroDescEN}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-400/25 transition-all border-none font-sans">{t.startTrial}</button>
            </SignUpButton>
            <a href="#tools" className="border border-white/15 rounded-lg px-8 py-3.5 text-base font-medium hover:border-gold-400/50 transition-colors no-underline text-dark-50">{t.viewTools}</a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { val: "5+", label: lang === "tr" ? "Aktif Mühendislik Aracı" : "Active Engineering Tools" },
            { val: "10+", label: lang === "tr" ? "Sertlik Ölçeği Desteği" : "Hardness Scale Support" },
            { val: "6", label: lang === "tr" ? "Teknik Makale" : "Technical Articles" },
            { val: "TR/EN", label: lang === "tr" ? "Çift Dil Desteği" : "Bilingual Support" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold font-mono text-gold-400">{s.val}</div>
              <div className="text-xs text-dark-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY THIS PLATFORM */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {lang === "tr" ? "Neden MetallurgyTools?" : "Why MetallurgyTools?"}
            </h2>
            <p className="text-dark-300 text-base max-w-2xl mx-auto">
              {lang === "tr"
                ? "Her araç, entegre demir-çelik tesislerinde yıllarca süren üretim ve kalite kontrol deneyiminin ürünüdür. Akademik soyutlamalar değil, üretim hattından gelen gerçek mühendislik çözümleri."
                : "Every tool is the product of years of production and quality control experience in integrated steel plants. Real engineering solutions from the production floor, not academic abstractions."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 hover:border-gold-400/20 hover:-translate-y-0.5 transition-all">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-base font-semibold mb-2 text-dark-50">{f.title}</h3>
                <p className="text-sm text-dark-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
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
            <div className="flex gap-2 flex-wrap mb-6">
              {activeTool.tags.map((tag) => (
                <span key={tag} className="bg-gold-400/10 border border-gold-400/20 rounded-md px-3 py-1 text-xs text-gold-400 font-mono">{tag}</span>
              ))}
            </div>
            {activeTool.status === "live" && activeTool.route ? (
              <Link href={activeTool.route}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-3 text-sm font-semibold no-underline hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/25 transition-all">
                {activeTool.icon} {lang === "tr" ? "Aracı Aç →" : "Open Tool →"}
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/5 text-dark-300 rounded-lg px-6 py-3 text-sm font-medium border border-white/10">
                🔒 {t.comingSoon || "YAKINDA"}
              </div>
            )}
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
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold font-mono">{plan.priceTR || plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-dark-300 text-sm">{t.month}</span>}
                </div>
                {plan.price !== "Custom" && <div className="text-xs text-dark-300 mb-6">≈ {plan.price}/month</div>}
                {plan.price === "Custom" && <div className="mb-6" />}
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
      <section id="about" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-10">
            <h2 className="text-3xl font-bold tracking-tight mb-5 text-center">
              {lang === "tr" ? "Proje Hakkında" : "About the Project"}
            </h2>
            <div className="text-dark-200 leading-relaxed space-y-4 text-sm">
              {lang === "tr" ? (
                <>
                  <p>MetallurgyTools, entegre demir-çelik tesislerinde görev yapan alanında uzman metalurji mühendisleri tarafından geliştirilmektedir. Proje, çelik üretiminin her aşamasında — BOF çelik yapımından sürekli döküme, sıcak haddeleme hatlarından mekanik test laboratuvarlarına kadar — edinilen gerçek saha deneyimine dayanmaktadır.</p>
                  <p>Platformdaki her araç, uluslararası standartlarla (ASTM, ISO, API, ASME) uyumlu olarak tasarlanmış ve gerçek üretim verileriyle doğrulanmıştır. Mekanik test sonuçları, metalografik inceleme verileri ve hasar analizi bulguları, araçların kalibrasyon ve doğrulama süreçlerinde kullanılmaktadır.</p>
                  <p>Hedefimiz, dünya genelindeki metalurji mühendislerine günlük iş akışlarında kullanabilecekleri pratik, güvenilir ve standartlara uygun dijital araçlar sunmaktır. Akademik soyutlamalardan ziyade, üretim hattından gelen somut mühendislik çözümlerine odaklanıyoruz.</p>
                  <p>Platform sürekli geliştirilmektedir. DBTT tahmin motoru, SEM-EDS tabanlı inklüzyon sınıflandırıcı ve yapay zeka destekli yeni araçlar geliştirme aşamasındadır.</p>
                </>
              ) : (
                <>
                  <p>MetallurgyTools is developed by expert metallurgical engineers working in integrated iron and steel plants. The project is grounded in real-world field experience across every stage of steel production — from BOF steelmaking to continuous casting, hot rolling lines to mechanical testing laboratories.</p>
                  <p>Every tool on the platform is designed in compliance with international standards (ASTM, ISO, API, ASME) and validated against real production data. Mechanical test results, metallographic examination data, and failure analysis findings are used in the calibration and validation processes.</p>
                  <p>Our goal is to provide metallurgical engineers worldwide with practical, reliable, and standards-compliant digital tools they can use in their daily workflows. We focus on concrete engineering solutions from the production floor, rather than academic abstractions.</p>
                  <p>The platform is continuously evolving. DBTT prediction engine, SEM-EDS based inclusion classifier, and AI-powered new tools are currently in development.</p>
                </>
              )}
            </div>
            <div className="text-center mt-8">
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold cursor-pointer hover:shadow-xl hover:shadow-gold-400/25 transition-all border-none font-sans">
                  {lang === "tr" ? "Ücretsiz Deneyin" : "Try for Free"}
                </button>
              </SignUpButton>
            </div>
          </div>
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
