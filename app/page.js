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
    { id: "grain-size", name: t.grainSize, shortName: t.grainSizeShort, desc: t.grainSizeDesc, icon: "\ud83d\udd2c", tags: ["ASTM E112", "Metallography", "AI-Powered"], status: "live", route: "/tools/grain-size", free: false },
    { id: "corrosion", name: t.corrosion, shortName: t.corrosionShort, desc: t.corrosionDesc, icon: "\u2697\ufe0f", tags: ["API 570", "Weight Loss", "Electrochemical"], status: "live", route: "/tools/corrosion", free: false },
    { id: "phase-diagram", name: t.phaseDiagram, shortName: t.phaseDiagramShort, desc: t.phaseDiagramDesc, icon: "\ud83d\udcca", tags: ["Thermodynamics", "Phase Fractions", "Interactive"], status: "live", route: "/tools/phase-diagram", free: false },
    { id: "hardness", name: t.hardness, shortName: t.hardnessShort, desc: t.hardnessDesc, icon: "\ud83d\udd27", tags: ["ASTM E140", "HRC", "HV", "Brinell"], status: "live", route: "/tools/hardness", free: true },
    { id: "unit-converter", name: t.unitConverter, shortName: t.unitConverterShort, desc: t.unitConverterDesc, icon: "\ud83d\udcd0", tags: ["MPa-ksi", "J-ft\u00b7lb", "\u00b0C-\u00b0F"], status: "live", route: "/tools/unit-converter", free: true },
    { id: "sem-eds", name: lang === "tr" ? "SEM-EDS Analizi" : "SEM-EDS Analysis", shortName: "SEM-EDS", desc: lang === "tr" ? "SEM-EDS spektrum \u00e7ak\u0131\u015fma analizi ve metal\u00fcrjik yorumlama." : "SEM-EDS spectrum overlap analysis and metallurgical interpretation.", icon: "\ud83d\udd2c", tags: ["SEM-EDS", "Peak Overlap", "AI"], status: "live", route: "/tools/sem-eds", free: false },
    { id: "dbtt", name: t.dbtt, shortName: t.dbttShort, desc: t.dbttDesc, icon: "\u2744\ufe0f", tags: ["Charpy", "S355", "API 5L"], status: "coming", route: null, free: false },
    { id: "inclusion", name: t.inclusion, shortName: t.inclusionShort, desc: t.inclusionDesc, icon: "\ud83d\udd0e", tags: ["SEM-EDS", "ASTM E45", "AI"], status: "coming", route: null, free: false },
  ];

  const PRICING = [
    { name: "Starter", price: "$5", priceTR: "\u20ba230", features: [t.access2tools, t.calc50, t.basicExport, t.emailSupport], highlight: false, cta: t.startFreeTrial },
    { name: "Professional", price: "$9", priceTR: "\u20ba415", features: [t.allTools, t.unlimitedCalc, t.fullExport, t.prioritySupport, t.apiAccess, t.customTemplates], highlight: true, cta: t.startFreeTrial },
    { name: "Enterprise", price: "Custom", features: [t.everythingPro, t.unlimitedApi, t.customDev, t.onPremise, t.dedicatedManager], highlight: false, cta: t.contactUs },
  ];

  const activeTool = TOOLS.find((tool) => tool.id === activeTab);

  const heroDescTR = "Entegre demir-\u00e7elik tesislerinde \u00e7al\u0131\u015fan, \u00fcretim hatt\u0131ndan laboratuvara kadar sekt\u00f6r\u00fcn her a\u015famas\u0131nda deneyim kazanm\u0131\u015f uzman metalurji m\u00fchendisleri taraf\u0131ndan geli\u015ftirilen profesyonel hesaplama ve analiz platformu. Tane boyutu \u00f6l\u00e7\u00fcm\u00fcnden sertlik d\u00f6n\u00fc\u015f\u00fcm\u00fcne, faz diyagram\u0131 sim\u00fclasyonundan korozyon de\u011ferlendirmesine kadar \u2014 ger\u00e7ek \u00fcretim verilerine dayal\u0131, uluslararas\u0131 standartlarla uyumlu ara\u00e7lar.";
  const heroDescEN = "A professional computation and analysis platform developed by expert metallurgical engineers with hands-on experience across every stage of integrated steel plant operations \u2014 from the production line to the testing laboratory. From grain size measurement to hardness conversion, phase diagram simulation to corrosion assessment \u2014 tools built on real production data and aligned with international standards.";

  const featuresTR = [
    { icon: "\ud83c\udfed", title: "Sekt\u00f6r\u00fcn \u0130\u00e7inden", desc: "BOF \u00e7elik \u00fcretiminden s\u00fcrekli d\u00f6k\u00fcme, haddeleme hatlar\u0131ndan kalite kontrol laboratuvar\u0131na kadar \u2014 ger\u00e7ek saha deneyimiyle tasarlanm\u0131\u015f ara\u00e7lar." },
    { icon: "\ud83d\udcd0", title: "Standartlara Uyumlu", desc: "ASTM E112, ASTM E140, ISO 18265, API 570, ASME FFS-1 gibi uluslararas\u0131 standartlara dayal\u0131 hesaplama ve d\u00f6n\u00fc\u015f\u00fcm altyap\u0131s\u0131." },
    { icon: "\ud83d\udd2c", title: "Metalografik Do\u011frulama", desc: "Her ara\u00e7, optik ve elektron mikroskobu verileriyle do\u011frulanm\u0131\u015f. Laboratuvar prati\u011fiyle uyumlu, \u00fcretim kalite kontrol s\u00fcre\u00e7lerine entegre." },
    { icon: "\ud83e\uddea", title: "Hasar Analizi Odakl\u0131", desc: "M\u00fc\u015fteri \u015fikayeti numunelerinden k\u00f6k neden analizine, inkl\u00fczyon karakterizasyonundan k\u0131r\u0131lma mekani\u011fine \u2014 hasar analizi perspektifiyle geli\u015ftirilmi\u015f." },
    { icon: "\ud83c\udf0d", title: "K\u00fcresel Eri\u015fim", desc: "T\u00fcrk\u00e7e ve \u0130ngilizce dil deste\u011fi. D\u00fcnyan\u0131n her yerindeki metalurji m\u00fchendisleri i\u00e7in tasarlanm\u0131\u015f, taray\u0131c\u0131 tabanl\u0131 platform." },
    { icon: "\ud83d\udcca", title: "S\u00fcrekli Geli\u015fim", desc: "DBTT tahmin motoru, inkl\u00fczyon s\u0131n\u0131fland\u0131r\u0131c\u0131 ve daha fazlas\u0131 geli\u015ftirme a\u015famas\u0131nda. Yapay zeka destekli yeni ara\u00e7lar yak\u0131nda." },
  ];
  const featuresEN = [
    { icon: "\ud83c\udfed", title: "From the Industry", desc: "Designed with real field experience \u2014 from BOF steelmaking to continuous casting, rolling lines to quality control laboratories." },
    { icon: "\ud83d\udcd0", title: "Standards-Compliant", desc: "Built on international standards including ASTM E112, ASTM E140, ISO 18265, API 570, and ASME FFS-1." },
    { icon: "\ud83d\udd2c", title: "Metallographically Validated", desc: "Every tool validated against optical and electron microscopy data. Compatible with laboratory practice and production QC processes." },
    { icon: "\ud83e\uddea", title: "Failure Analysis Focused", desc: "From customer complaint root cause analysis to inclusion characterization and fracture mechanics \u2014 developed with a failure analysis perspective." },
    { icon: "\ud83c\udf0d", title: "Global Access", desc: "Turkish and English language support. Browser-based platform designed for metallurgical engineers worldwide." },
    { icon: "\ud83d\udcca", title: "Continuous Development", desc: "DBTT prediction engine, inclusion classifier and more in development. AI-powered new tools coming soon." },
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

        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { val: "5+", label: lang === "tr" ? "Aktif M\u00fchendislik Arac\u0131" : "Active Engineering Tools" },
            { val: "10+", label: lang === "tr" ? "Sertlik \u00d6l\u00e7e\u011fi Deste\u011fi" : "Hardness Scale Support" },
            { val: "6", label: lang === "tr" ? "Teknik Makale" : "Technical Articles" },
            { val: "TR/EN", label: lang === "tr" ? "\u00c7ift Dil Deste\u011fi" : "Bilingual Support" },
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
                ? "Her ara\u00e7, entegre demir-\u00e7elik tesislerinde y\u0131llarca s\u00fcren \u00fcretim ve kalite kontrol deneyiminin \u00fcr\u00fcn\u00fcd\u00fcr. Akademik soyutlamalar de\u011fil, \u00fcretim hatt\u0131ndan gelen ger\u00e7ek m\u00fchendislik \u00e7\u00f6z\u00fcmleri."
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
              {tool.free && <span className="bg-green-500/20 text-green-400 text-[9px] px-1 rounded border border-green-500/30">{lang === "tr" ? "\u00dcCRET\u0130Z" : "FREE"}</span>}
              {tool.status === "coming" && <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-dark-300">{t.comingSoon}</span>}
            </button>
          ))}
        </div>
        {activeTool && (
          <div className="bg-gradient-to-br from-white/[0.03] to-gold-400/[0.03] border border-white/[0.08] rounded-2xl p-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl">{activeTool.icon}</div>
              {activeTool.free && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/30 font-semibold">
                  {lang === "tr" ? "\u00dcCRET\u0130Z" : "FREE"}
                </span>
              )}
              {!activeTool.free && activeTool.status === "live" && (
                <span className="bg-gold-400/20 text-gold-400 text-xs px-2 py-0.5 rounded border border-gold-400/30 font-semibold">
                  {lang === "tr" ? "\u00dcYE ARACI" : "MEMBER TOOL"}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-semibold tracking-tight mb-3">{activeTool.name}</h3>
            <p className="text-dark-200 text-base leading-relaxed mb-5 max-w-xl">{activeTool.desc}</p>
            <div className="flex gap-2 flex-wrap mb-6">
              {activeTool.tags.map((tag) => (
                <span key={tag} className="bg-gold-400/10 border border-gold-400/20 rounded-md px-3 py-1 text-xs text-gold-400 font-mono">{tag}</span>
              ))}
            </div>

            {/* Button Logic */}
            {activeTool.status === "live" && activeTool.route ? (
              activeTool.free ? (
                <Link href={activeTool.route}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-6 py-3 text-sm font-semibold no-underline hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25 transition-all">
                  {activeTool.icon} {lang === "tr" ? "\u00dccretsiz A\u00e7 \u2192" : "Open Free \u2192"}
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-3 text-sm font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/25 transition-all border-none font-sans">
                    {"\ud83d\udd10"} {lang === "tr" ? "Giri\u015f Yap ve Kullan \u2192" : "Sign In to Use \u2192"}
                  </button>
                </SignUpButton>
              )
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/5 text-dark-300 rounded-lg px-6 py-3 text-sm font-medium border border-white/10">
                {"\ud83d\udd12"} {t.comingSoon || "YAKINDA"}
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
                {plan.price !== "Custom" && <div className="text-xs text-dark-300 mb-6">{"\u2248"} {plan.price}/month</div>}
                {plan.price === "Custom" && <div className="mb-6" />}
                <div className="flex flex-col gap-3.5 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex gap-2.5 items-start text-sm text-dark-100">
                      <span className="text-gold-400 font-bold shrink-0">{"\u2713"}</span>{f}
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
              {lang === "tr" ? "Proje Hakk\u0131nda" : "About the Project"}
            </h2>
            <div className="text-dark-200 leading-relaxed space-y-4 text-sm">
              {lang === "tr" ? (
                <>
                  <p>MetallurgyTools, entegre demir-\u00e7elik tesislerinde g\u00f6rev yapan alan\u0131nda uzman metalurji m\u00fchendisleri taraf\u0131ndan geli\u015ftirilmektedir. Proje, \u00e7elik \u00fcretiminin her a\u015famas\u0131nda \u2014 BOF \u00e7elik yap\u0131m\u0131ndan s\u00fcrekli d\u00f6k\u00fcme, s\u0131cak haddeleme hatlar\u0131ndan mekanik test laboratuvarlar\u0131na kadar \u2014 edinilen ger\u00e7ek saha deneyimine dayanmaktad\u0131r.</p>
                  <p>Platformdaki her ara\u00e7, uluslararas\u0131 standartlarla (ASTM, ISO, API, ASME) uyumlu olarak tasarlanm\u0131\u015f ve ger\u00e7ek \u00fcretim verileriyle do\u011frulanm\u0131\u015ft\u0131r. Mekanik test sonu\u00e7lar\u0131, metalografik inceleme verileri ve hasar analizi bulgular\u0131, ara\u00e7lar\u0131n kalibrasyon ve do\u011frulama s\u00fcre\u00e7lerinde kullan\u0131lmaktad\u0131r.</p>
                  <p>Hedefimiz, d\u00fcnya genelindeki metalurji m\u00fchendislerine g\u00fcnl\u00fck i\u015f ak\u0131\u015flar\u0131nda kullanabilecekleri pratik, g\u00fcvenilir ve standartlara uygun dijital ara\u00e7lar sunmakt\u0131r. Akademik soyutlamalardan ziyade, \u00fcretim hatt\u0131ndan gelen somut m\u00fchendislik \u00e7\u00f6z\u00fcmlerine odaklan\u0131yoruz.</p>
                  <p>Platform s\u00fcrekli geli\u015ftirilmektedir. DBTT tahmin motoru, SEM-EDS tabanl\u0131 inkl\u00fczyon s\u0131n\u0131fland\u0131r\u0131c\u0131 ve yapay zeka destekli yeni ara\u00e7lar geli\u015ftirme a\u015famas\u0131ndad\u0131r.</p>
                </>
              ) : (
                <>
                  <p>MetallurgyTools is developed by expert metallurgical engineers working in integrated iron and steel plants. The project is grounded in real-world field experience across every stage of steel production \u2014 from BOF steelmaking to continuous casting, hot rolling lines to mechanical testing laboratories.</p>
                  <p>Every tool on the platform is designed in compliance with international standards (ASTM, ISO, API, ASME) and validated against real production data. Mechanical test results, metallographic examination data, and failure analysis findings are used in the calibration and validation processes.</p>
                  <p>Our goal is to provide metallurgical engineers worldwide with practical, reliable, and standards-compliant digital tools they can use in their daily workflows. We focus on concrete engineering solutions from the production floor, rather than academic abstractions.</p>
                  <p>The platform is continuously evolving. DBTT prediction engine, SEM-EDS based inclusion classifier, and AI-powered new tools are currently in development.</p>
                </>
              )}
            </div>
            <div className="text-center mt-8">
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold cursor-pointer hover:shadow-xl hover:shadow-gold-400/25 transition-all border-none font-sans">
                  {lang === "tr" ? "\u00dccretsiz Deneyin" : "Try for Free"}
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
          <span className="text-xs text-dark-300">{"\u00a9"} 2026 MetallurgyTools. {t.allRights}</span>
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
