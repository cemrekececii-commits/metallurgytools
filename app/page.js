"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useLang } from "@/lib/LanguageContext";
import BlogSidebar from "@/components/BlogSidebar";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("grain-size");
  const { t, lang } = useLang();
  const { isSignedIn } = useUser();

  const TOOLS = [
    { id: "grain-size", name: t.grainSize, shortName: t.grainSizeShort, desc: t.grainSizeDesc, icon: "🔬", tags: ["ASTM E112", "Metallography"], status: "live", route: "/tools/grain-size" },
    { id: "corrosion", name: t.corrosion, shortName: t.corrosionShort, desc: t.corrosionDesc, icon: "⚗️", tags: ["API 570", "Weight Loss", "Electrochemical"], status: "live", route: "/tools/corrosion" },
    { id: "phase-diagram", name: t.phaseDiagram, shortName: t.phaseDiagramShort, desc: t.phaseDiagramDesc, icon: "📊", tags: ["Thermodynamics", "Phase Fractions", "Interactive"], status: "live", route: "/tools/phase-diagram" },
    { id: "hardness", name: t.hardness, shortName: t.hardnessShort, desc: t.hardnessDesc, icon: "🔧", tags: ["ASTM E140", "HRC", "HV", "Brinell"], status: "live", route: "/tools/hardness" },
    { id: "unit-converter", name: t.unitConverter, shortName: t.unitConverterShort, desc: t.unitConverterDesc, icon: "🔍", tags: ["MPa-ksi", "J-ft·lb", "°C-°F"], status: "live", route: "/tools/unit-converter" },
    { id: "sem-eds", name: lang === "tr" ? "SEM-EDS Analizi" : "SEM-EDS Analysis", shortName: "SEM-EDS", desc: lang === "tr" ? "SEM-EDS spektrum çakışma analizi ve metalürjik yorumlama." : "SEM-EDS spectrum overlap analysis and metallurgical interpretation.", icon: "🔬", tags: ["SEM-EDS", "Peak Overlap"], status: "live", route: "/tools/sem-eds" },
    { id: "dbtt", name: t.dbtt, shortName: t.dbttShort, desc: t.dbttDesc, icon: "❄️", tags: ["Charpy", "S355", "API 5L"], status: "live", route: "/tools/dbtt" },
    { id: "carbon-equivalent", name: lang === "tr" ? "Karbon Eşdeğeri Hesaplayıcı" : "Carbon Equivalent Calculator", shortName: "CE Calc", desc: lang === "tr" ? "CE(IIW), CET, Pcm, CEN kaynak kabiliyeti değerlendirmesi." : "CE(IIW), CET, Pcm, CEN weldability assessment.", icon: "🔥", tags: ["CE(IIW)", "Pcm", "EN 1011-2"], status: "live", route: "/tools/carbon-equivalent" },
    { id: "inclusion", name: t.inclusion, shortName: t.inclusionShort, desc: t.inclusionDesc, icon: "🔎", tags: ["SEM-EDS", "ASTM E45"], status: "live", route: "/tools/inclusion" },
    { id: "cct-ttt", name: lang === "tr" ? "CCT/TTT Diyagram Yorumlayıcı" : "CCT/TTT Diagram Interpreter", shortName: "CCT/TTT", desc: lang === "tr" ? "Bileşime dayalı kritik sıcaklıklar, faz fraksiyonu tahmini ve soğuma eğrisi analizi." : "Composition-based critical temperatures, phase fraction prediction and cooling curve analysis.", icon: "🌡️", tags: ["CCT", "TTT", "Ms", "Ae3"], status: "live", route: "/tools/cct-ttt" },
    { id: "preheat", name: lang === "tr" ? "Kaynak Ön Isıtma Hesaplayıcı" : "Weld Preheat Calculator", shortName: lang === "tr" ? "Ön Isıtma" : "Preheat", desc: lang === "tr" ? "EN 1011-2 ve AWS D1.1 bazlı ön ısıtma sıcaklığı hesaplama ve kaynak kabiliyeti değerlendirmesi." : "EN 1011-2 and AWS D1.1 based preheat temperature calculation and weldability assessment.", icon: "🔥", tags: ["EN 1011-2", "AWS D1.1", "CE", "CET"], status: "live", route: "/tools/preheat" },
    { id: "tensile-specimen", name: lang === "tr" ? "Çekme Numunesi L₀ Hesaplayıcı" : "Tensile Specimen L₀ Calculator", shortName: lang === "tr" ? "L₀ Hesap" : "L₀ Calc", desc: lang === "tr" ? "EN ISO 6892-1 ve ASTM E8/E8M'e göre ölçüm uzunluğu, paralel uzunluk ve toplam numune boyu hesabı." : "Gauge length, parallel length and total specimen length per EN ISO 6892-1 and ASTM E8/E8M.", icon: "↕", tags: ["EN ISO 6892-1", "ASTM E8", "L₀", "Lc"], status: "live", route: "/tools/tensile-specimen" },
    { id: "inclusion-atlas", name: lang === "tr" ? "İnklüzyon Atlası" : "Inclusion Atlas", shortName: lang === "tr" ? "İnklüzyon" : "Inc. Atlas", desc: lang === "tr" ? "MnS, Al₂O₃, TiN, kalsiyum alüminat, silikat, Nb(C,N) ve spinel inklüzyonlarının morfoloji, EDS ve proses kaynağı referansı." : "Reference atlas for MnS, Al₂O₃, TiN, calcium aluminates, silicates, Nb(C,N) and spinel — morphology, EDS and process source.", icon: "📖", tags: ["ASTM E45", "SEM-EDS", "MnS", "TiN"], status: "live", route: "/tools/inclusion-atlas" },
  ];

  const featuresTR = [
    { icon: "🏭", title: "Sektörün İçinden", desc: "BOF çelik üretiminden sürekli dökme, haddeleme hatlarından kalite kontrol laboratuvarına kadar — gerçek saha deneyimiyle tasarlanmış araçlar." },
    { icon: "📋", title: "Standartlara Uyumlu", desc: "ASTM E112, ASTM E140, ISO 18265, API 570, ASME FFS-1 gibi uluslararası standartlara dayalı hesaplama altyapısı." },
    { icon: "🔬", title: "Metalografik Doğrulama", desc: "Her araç, optik ve elektron mikroskobu verileriyle doğrulanmış. Laboratuvar pratiğiyle uyumlu." },
    { icon: "🧪", title: "Hasar Analizi Odaklı", desc: "Müşteri şikayeti numunelerinden kök neden analizine, inklüzyon karakterizasyonundan kırılma mekaniğine." },
    { icon: "🌍", title: "Küresel Erişim", desc: "Türkçe ve İngilizce dil desteği. Dünyanın her yerindeki metalurji mühendisleri için tasarlanmış." },
    { icon: "📊", title: "350.000+ Test Verisi", desc: "İçerik ve algoritmalar, 350.000'i aşkın gerçek üretim testi verisiyle kalibre edilmiştir." },
  ];
  const featuresEN = [
    { icon: "🏭", title: "From the Industry", desc: "Designed with real field experience — from BOF steelmaking to continuous casting, rolling lines to quality control laboratories." },
    { icon: "📋", title: "Standards-Compliant", desc: "Built on international standards including ASTM E112, ASTM E140, ISO 18265, API 570, and ASME FFS-1." },
    { icon: "🔬", title: "Metallographically Validated", desc: "Every tool validated against optical and electron microscopy data." },
    { icon: "🧪", title: "Failure Analysis Focused", desc: "From customer complaint root cause analysis to inclusion characterization and fracture mechanics." },
    { icon: "🌍", title: "Global Access", desc: "Turkish and English language support. Browser-based platform for metallurgical engineers worldwide." },
    { icon: "📊", title: "350,000+ Test Data Points", desc: "Content and algorithms calibrated against over 350,000 real production test data points." },
  ];

  const features = lang === "tr" ? featuresTR : featuresEN;
  const activeTool = TOOLS.find((tool) => tool.id === activeTab);

  // Category images for active tool panel
  const TOOL_IMAGES = {
    "grain-size":         "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    "phase-diagram":      "https://images.unsplash.com/photo-1532094349884-543290f27de4?w=600&auto=format&fit=crop&q=80",
    "cct-ttt":            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    "inclusion":          "https://images.unsplash.com/photo-1532094349884-543290f27de4?w=600&auto=format&fit=crop&q=80",
    "sem-eds":            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    "hardness":           "https://images.unsplash.com/photo-1565043589-a03e91538c4b?w=600&auto=format&fit=crop&q=80",
    "dbtt":               "https://images.unsplash.com/photo-1565043589-a03e91538c4b?w=600&auto=format&fit=crop&q=80",
    "tensile-specimen":   "https://images.unsplash.com/photo-1565043589-a03e91538c4b?w=600&auto=format&fit=crop&q=80",
    "corrosion":          "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&auto=format&fit=crop&q=80",
    "carbon-equivalent":  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "preheat":            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    "unit-converter":     "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
  };

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        {/* Hero background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&fit=crop&q=80"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
            style={{ opacity: 0.08 }}
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(3,7,18,0.7) 0%,rgba(3,7,18,0.3) 40%,rgba(3,7,18,0.9) 100%)" }} />
        </div>
        {/* Subtle radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(30,64,175,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl">

          {/* Top badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-mono mb-8" style={{ background: "rgba(30,64,175,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {lang === "tr" ? "20+ Yıl Saha Deneyimi · 350.000+ Test Verisi · Ücretsiz Başla" : "20+ Years Field Experience · 350,000+ Test Data · Start Free"}
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6">
            {lang === "tr" ? (
              <>
                Metalurji Mühendisinin{" "}
                <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">
                  Dijital Alet Çantası
                </span>
              </>
            ) : (
              <>
                The Metallurgist&#39;s{" "}
                <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">
                  Digital Toolkit
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-dark-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            {lang === "tr"
              ? "Hesaplama araçları, bilgi bankası ve uzman danışmanlık — hepsi tek platformda. Entegre demir-çelik tesisinde 20 yılı aşkın saha deneyimi ve 350.000+ mekanik test verisiyle geliştirilmiştir."
              : "Computation tools, knowledge base, and expert consultation — all in one platform. Built on 20+ years of integrated steel plant experience and 350,000+ mechanical test data points."}
          </p>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {/* Pillar 1: Tools */}
            <a href="#tools" className="group rounded-xl p-5 text-left no-underline transition-all hover:-translate-y-1" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="text-sm font-bold text-gold-400 mb-1">
                {lang === "tr" ? "Araçları Kullan" : "Use the Tools"}
              </h3>
              <p className="text-xs text-dark-300 leading-relaxed">
                {lang === "tr"
                  ? "Tane boyutu, sertlik, CCT/TTT, karbon eşdeğeri, SEM-EDS ve daha fazlası — uluslararası standartlara uygun."
                  : "Grain size, hardness, CCT/TTT, carbon equivalent, SEM-EDS and more — standards-compliant."}
              </p>
            </a>

            {/* Pillar 2: Knowledge */}
            <Link href="/knowledge" className="group rounded-xl p-5 text-left no-underline transition-all hover:-translate-y-1" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#93c5fd" }}>
                {lang === "tr" ? "Bilgi Bankası" : "Knowledge Base"}
              </h3>
              <p className="text-xs text-dark-300 leading-relaxed">
                {lang === "tr"
                  ? "Fe-C faz diyagramı, çelik mikroyapıları, mekanik test rehberi, korozyon mekanizmaları ve daha fazlası."
                  : "Fe-C phase diagram, steel microstructures, mechanical testing guide, corrosion mechanisms and more."}
              </p>
            </Link>

            {/* Pillar 3: Consultation */}
            <Link href="/consultation" className="group rounded-xl p-5 text-left no-underline transition-all hover:-translate-y-1" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <div className="text-2xl mb-2">👨‍🔬</div>
              <h3 className="text-sm font-bold mb-1" style={{ color: "#6ee7b7" }}>
                {lang === "tr" ? "Uzman Danışmanlığı" : "Expert Consultation"}
              </h3>
              <p className="text-xs text-dark-300 leading-relaxed">
                {lang === "tr"
                  ? "Metalurjik sorunlarınıza çözüm arayın — hasar analizi, proses optimizasyonu, kalite problemleri."
                  : "Seek solutions to metallurgical problems — failure analysis, process optimization, quality issues."}
              </p>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 justify-center flex-wrap mb-4">
            {/* Primary: Consultation — large, glowing */}
            <Link href="/consultation" className="relative group bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white rounded-xl px-10 py-4 text-base font-bold no-underline hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-3">
              <span className="text-xl">🩺</span>
              {lang === "tr" ? "Uzman Metalurjiste Danıs" : "Consult an Expert Metallurgist"}
              <span className="text-blue-200 text-lg">→</span>
            </Link>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#tools" className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3 text-sm font-semibold no-underline hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-400/25 transition-all">
              {lang === "tr" ? "Araçları Keşfet →" : "Explore Tools →"}
            </a>
            <Link href="/mechanical-tests" className="rounded-lg px-8 py-3 text-sm font-medium hover:border-gold-400/50 transition-colors no-underline text-dark-50" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              {lang === "tr" ? "Mekanik Test Rehberi" : "Mechanical Test Guide"}
            </Link>
            <Link href="/knowledge" className="rounded-lg px-8 py-3 text-sm font-medium hover:border-blue-400/50 transition-colors no-underline" style={{ border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}>
              {lang === "tr" ? "Bilgi Bankası" : "Knowledge Base"}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { val: "20+", label: lang === "tr" ? "Yil Endustriyel Deneyim" : "Years Industry Experience", color: "#D4AF37" },
            { val: "350K+", label: lang === "tr" ? "Analiz Edilmis Test Verisi" : "Analyzed Test Data Points", color: "#D4AF37" },
            { val: "13+", label: lang === "tr" ? "Profesyonel Arac" : "Professional Tools", color: "#60a5fa" },
            { val: "12+", label: lang === "tr" ? "Akademik Yayin" : "Academic Publications", color: "#D4AF37" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs text-dark-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SIDEBAR LAYOUT STARTS ── */}
      <div className="flex gap-0 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Left: sticky blog sidebar */}
        <div className="hidden lg:block w-72 xl:w-80 shrink-0">
          <div className="sticky top-20 py-8 pr-6 border-r border-white/[0.06]">
            <BlogSidebar />
          </div>
        </div>

        {/* Right: main content */}
        <div className="flex-1 min-w-0">

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

      {/* CONSULTATION BANNER */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(30,64,175,0.15) 0%, rgba(16,185,129,0.08) 100%)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <div className="absolute right-0 top-0 w-80 h-80 bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
              <div className="flex-shrink-0 text-5xl">🩺</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {lang === "tr" ? "Metalurjik Sorununuza Uzman Çözüm" : "Expert Solutions for Your Metallurgical Problems"}
                </h3>
                <p className="text-sm text-dark-200 leading-relaxed max-w-xl">
                  {lang === "tr"
                    ? "Hasar analizi, kırılma mekaniği, proses optimizasyonu, inklüzyon karakterizasyonu veya kalite problemi — deneyimli metalurji mühendislerimiz sizin için burada."
                    : "Failure analysis, fracture mechanics, process optimization, inclusion characterization or quality problems — our experienced metallurgical engineers are here for you."}
                </p>
              </div>
              <Link href="/consultation" className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl px-8 py-3.5 text-sm font-bold no-underline hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 whitespace-nowrap">
                {lang === "tr" ? "Danışmanlık Talep Et →" : "Request Consultation →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">{t.toolsSuiteTitle}</h2>
          <p className="text-dark-300 text-base max-w-md mx-auto">{t.toolsSuiteDesc}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-gold-400 font-mono border border-gold-400/25 bg-gold-400/5 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            {lang === "tr"
              ? "Üye ol · Starter planla 5 ücretsiz kullanım kazan"
              : "Sign up · Get 5 free uses per tool with the Starter plan"}
          </div>
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
          <div className="bg-gradient-to-br from-white/[0.03] to-gold-400/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden animate-fade-in">
            <div className="flex">
              {/* Content */}
              <div className="flex-1 p-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl">{activeTool.icon}</div>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded border border-green-500/30 font-semibold">
                    {lang === "tr" ? "ÜCRETSİZ" : "FREE"}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-3">{activeTool.name}</h3>
                <p className="text-dark-200 text-base leading-relaxed mb-5 max-w-xl">{activeTool.desc}</p>
                <div className="flex gap-2 flex-wrap mb-6">
                  {activeTool.tags.map((tag) => (
                    <span key={tag} className="bg-gold-400/10 border border-gold-400/20 rounded-md px-3 py-1 text-xs text-gold-400 font-mono">{tag}</span>
                  ))}
                </div>
                {activeTool.status === "live" && activeTool.route ? (
                  <Link href={activeTool.route} className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-3 text-sm font-semibold no-underline hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/25 transition-all">
                    {activeTool.icon} {lang === "tr" ? "Aracı Aç →" : "Open Tool →"}
                  </Link>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-white/5 text-dark-300 rounded-lg px-6 py-3 text-sm font-medium border border-white/10">
                    🔒 {t.comingSoon || "Yakında"}
                  </div>
                )}
              </div>

              {/* Tool image panel */}
              <div className="hidden md:block w-52 relative overflow-hidden shrink-0">
                <Image
                  src={TOOL_IMAGES[activeTool.id] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80"}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover"
                  style={{ opacity: 0.45 }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(10,10,15,0.85) 0%,rgba(10,10,15,0.2) 60%,rgba(10,10,15,0.5) 100%)" }} />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="font-mono text-[10px] text-gold-400/60 uppercase tracking-widest">{activeTool.tags[0]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
                  <p>MetallurgyTools, entegre demir-çelik tesislerinde görev yapan uzman metalurji mühendisleri tarafından geliştirilmektedir. Çelik üretiminin her aşamasında — BOF çelik yapımından sürekli dökme, sıcak haddeleme hatlarından mekanik test laboratuvarlarına kadar — edinilen gerçek saha deneyimine dayanmaktadır.</p>
                  <p>Platformdaki her araç, uluslararası standartlarla (ASTM, ISO, API, ASME) uyumlu olarak tasarlanmış ve 350.000'i aşkın gerçek üretim test verisiyle doğrulanmıştır.</p>
                  <p>Hedefimiz, dünya genelindeki metalurji mühendislerine günlük iş akışlarında kullanabilecekleri pratik, güvenilir ve standartlara uygun dijital araçlar sunmaktır.</p>
                </>
              ) : (
                <>
                  <p>MetallurgyTools is developed by expert metallurgical engineers working in integrated iron and steel plants, grounded in real-world experience across every stage of steel production.</p>
                  <p>Every tool is designed in compliance with international standards (ASTM, ISO, API, ASME) and validated against more than 350,000 real production data points.</p>
                  <p>Our goal is to provide metallurgical engineers worldwide with practical, reliable, and standards-compliant digital tools for their daily workflows.</p>
                </>
              )}
            </div>
            <div className="text-center mt-8">
              <a href="#tools" className="inline-block bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold no-underline hover:shadow-xl hover:shadow-gold-400/25 transition-all">
                {lang === "tr" ? "Araçları Keşfet →" : "Explore Tools →"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">💡</div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {lang === "tr" ? "Görüş, Öneri ve İstekleriniz" : "Feedback & Feature Requests"}
              </h2>
              <p className="text-dark-300 text-sm">
                {lang === "tr"
                  ? "Yeni metalurjik araç talepleri, mevcut araçlara öneriler veya genel görüşlerinizi bizimle paylaşın."
                  : "Share your requests for new metallurgical tools, suggestions, or general feedback."}
              </p>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const btn = form.querySelector("button[type=submit]");
              btn.disabled = true;
              btn.textContent = lang === "tr" ? "Gönderiliyor..." : "Sending...";
              try {
                const res = await fetch("/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: form.fname.value,
                    email: form.femail.value,
                    type: form.ftype.value,
                    message: form.fmessage.value,
                  }),
                });
                if (res.ok) {
                  form.reset();
                  btn.textContent = lang === "tr" ? "✅ Gönderildi! Teşekkürler." : "✅ Sent! Thank you.";
                  btn.className = "w-full bg-green-500/20 text-green-400 rounded-lg py-3 text-sm font-semibold border border-green-500/30 font-sans";
                  setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = lang === "tr" ? "📩 Gönder" : "📩 Send Feedback";
                    btn.className = "w-full bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg py-3 text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-gold-400/20 transition-all border-none font-sans";
                  }, 3000);
                } else { throw new Error(); }
              } catch {
                btn.textContent = lang === "tr" ? "❌ Hata oluştu." : "❌ Error.";
                btn.disabled = false;
                setTimeout(() => {
                  btn.textContent = lang === "tr" ? "📩 Gönder" : "📩 Send Feedback";
                }, 3000);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-dark-300 font-semibold uppercase tracking-wider mb-1.5">{lang === "tr" ? "Adınız" : "Your Name"}</label>
                  <input name="fname" required placeholder={lang === "tr" ? "İsim Soyisim" : "Full Name"} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-dark-300 font-semibold uppercase tracking-wider mb-1.5">{lang === "tr" ? "E-posta" : "Email"}</label>
                  <input name="femail" type="email" required placeholder="email@example.com" className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-dark-300 font-semibold uppercase tracking-wider mb-1.5">{lang === "tr" ? "Tür" : "Type"}</label>
                <select name="ftype" className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                  <option>{lang === "tr" ? "🔧 Yeni Araç Talebi" : "🔧 New Tool Request"}</option>
                  <option>{lang === "tr" ? "💡 Mevcut Araç Önerisi" : "💡 Existing Tool Suggestion"}</option>
                  <option>{lang === "tr" ? "🐛 Hata Bildirimi" : "🐛 Bug Report"}</option>
                  <option>{lang === "tr" ? "💬 Genel Görüş" : "💬 General Feedback"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-300 font-semibold uppercase tracking-wider mb-1.5">{lang === "tr" ? "Mesajınız" : "Your Message"}</label>
                <textarea name="fmessage" required rows={4} placeholder={lang === "tr" ? "Hangi metalurjik aracı görmek istersiniz?" : "What metallurgical tool would you like to see?"} className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none resize-none" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg py-3 text-sm font-semibold cursor-pointer hover:shadow-lg hover:shadow-gold-400/20 transition-all border-none font-sans">
                {lang === "tr" ? "📩 Gönder" : "📩 Send Feedback"}
              </button>
            </form>
          </div>
        </div>
      </section>

        </div>{/* end right main content */}
      </div>{/* end sidebar layout */}

      {/* Mobile blog section (shown only on small screens) */}
      <div className="lg:hidden px-4 pb-10">
        <div className="bg-dark-800/40 border border-white/[0.07] rounded-xl p-5">
          <BlogSidebar />
        </div>
      </div>

    </div>
  );
}
