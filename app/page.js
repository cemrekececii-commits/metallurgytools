"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useLang } from "@/lib/LanguageContext";

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
    { id: "inclusion", name: t.inclusion, shortName: t.inclusionShort, desc: t.inclusionDesc, icon: "🔎", tags: ["SEM-EDS", "ASTM E45"], status: "coming", route: null },
  ];

  const featuresTR = [
    { icon: "🏭", title: "Sektörün İçinden", desc: "BOF çelik üretiminden sürekli dökme, haddeleme hatlarından kalite kontrol laboratuvarına kadar — gerçek saha deneyimiyle tasarlanmış araçlar." },
    { icon: "📋", title: "Standartlara Uyumlu", desc: "ASTM E112, ASTM E140, ISO 18265, API 570, ASME FFS-1 gibi uluslararası standartlara dayalı hesaplama altyapısı." },
    { icon: "🔬", title: "Metalografik Doğrulama", desc: "Her araç, optik ve elektron mikroskobu verileriyle doğrulanmış. Laboratuvar pratiğiyle uyumlu." },
    { icon: "🧪", title: "Hasar Analizi Odaklı", desc: "Müşteri şikayeti numunelerinden kök neden analizine, inklüzyon karakterizasyonundan kırılma mekaniğine." },
    { icon: "🌍", title: "Küresel Erişim", desc: "Türkçe ve İngilizce dil desteği. Dünyanın her yerindeki metalurji mühendisleri için tasarlanmış." },
    { icon: "📊", title: "50.000+ Test Verisi", desc: "İçerik ve algoritmalar, onbinlerce gerçek üretim testi verisiyle kalibre edilmiştir." },
  ];
  const featuresEN = [
    { icon: "🏭", title: "From the Industry", desc: "Designed with real field experience — from BOF steelmaking to continuous casting, rolling lines to quality control laboratories." },
    { icon: "📋", title: "Standards-Compliant", desc: "Built on international standards including ASTM E112, ASTM E140, ISO 18265, API 570, and ASME FFS-1." },
    { icon: "🔬", title: "Metallographically Validated", desc: "Every tool validated against optical and electron microscopy data." },
    { icon: "🧪", title: "Failure Analysis Focused", desc: "From customer complaint root cause analysis to inclusion characterization and fracture mechanics." },
    { icon: "🌍", title: "Global Access", desc: "Turkish and English language support. Browser-based platform for metallurgical engineers worldwide." },
    { icon: "📊", title: "50,000+ Test Data Points", desc: "Content and algorithms calibrated with tens of thousands of real production test data." },
  ];

  const features = lang === "tr" ? featuresTR : featuresEN;
  const activeTool = TOOLS.find((tool) => tool.id === activeTab);

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-4xl">

          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {lang === "tr" ? "18+ Yıl Saha Deneyimi · 50.000+ Test Verisi · Tüm Araçlar Ücretsiz" : "18+ Years Field Experience · 50,000+ Test Data · All Tools Free"}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter mb-6">
            {lang === "tr" ? (
              <>
                Uzman Metalurjistlerin{" "}
                <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">
                  Saha Verisiyle
                </span>{" "}
                Geliştirilen Araçlar
              </>
            ) : (
              <>
                Tools Built on{" "}
                <span className="bg-gradient-to-r from-gold-400 via-gold-200 to-gold-500 bg-clip-text text-transparent">
                  Real Field Data
                </span>{" "}
                by Expert Metallurgists
              </>
            )}
          </h1>

          <p className="text-base md:text-lg text-dark-200 max-w-3xl mx-auto mb-6 leading-relaxed">
            {lang === "tr"
              ? "Entegre demir-çelik tesisinde 18 yılı aşkın sürede biriktirilen 50.000'den fazla mekanik test verisi ve uluslararası standart uygulaması deneyimine dayanan profesyonel hesaplama platformu."
              : "A professional computation platform grounded in 18+ years of integrated steel plant experience — built on 50,000+ mechanical test data points and applied international standards."}
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-green-400 font-mono border border-green-400/20 bg-green-400/5 rounded-full px-4 py-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {lang === "tr" ? "Tüm araçlar şu an ücretsiz — kayıt gerekmez" : "All tools currently free — no registration required"}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#tools" className="bg-gradient-to-br from-gold-400 to-gold-500 text-dark-800 rounded-lg px-8 py-3.5 text-base font-semibold no-underline hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-400/25 transition-all">
              {lang === "tr" ? "Araçları Keşfet →" : "Explore Tools →"}
            </a>
            <Link href="/mechanical-tests" className="border border-white/15 rounded-lg px-8 py-3.5 text-base font-medium hover:border-gold-400/50 transition-colors no-underline text-dark-50">
              {lang === "tr" ? "Mekanik Test Rehberi" : "Mechanical Test Guide"}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { val: "18+", label: lang === "tr" ? "Yıl Endüstriyel Deneyim" : "Years Industry Experience" },
            { val: "50K+", label: lang === "tr" ? "Analiz Edilmiş Test Verisi" : "Analyzed Test Data Points" },
            { val: "12+", label: lang === "tr" ? "Akademik Yayın" : "Academic Publications" },
            { val: "ÜCRETSİZ", label: lang === "tr" ? "Tüm Araçlar Açık" : "All Tools Free" },
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
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-green-400 font-mono border border-green-400/20 bg-green-400/5 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {lang === "tr" ? "Tüm araçlar ücretsiz — giriş gerekmez" : "All tools free — no login required"}
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
          <div className="bg-gradient-to-br from-white/[0.03] to-gold-400/[0.03] border border-white/[0.08] rounded-2xl p-10 animate-fade-in">
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
                  <p>Platformdaki her araç, uluslararası standartlarla (ASTM, ISO, API, ASME) uyumlu olarak tasarlanmış ve 50.000'i aşkın gerçek üretim test verisiyle doğrulanmıştır.</p>
                  <p>Hedefimiz, dünya genelindeki metalurji mühendislerine günlük iş akışlarında kullanabilecekleri pratik, güvenilir ve standartlara uygun dijital araçlar sunmaktır.</p>
                </>
              ) : (
                <>
                  <p>MetallurgyTools is developed by expert metallurgical engineers working in integrated iron and steel plants, grounded in real-world experience across every stage of steel production.</p>
                  <p>Every tool is designed in compliance with international standards (ASTM, ISO, API, ASME) and validated against more than 50,000 real production data points.</p>
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

    </div>
  );
}
