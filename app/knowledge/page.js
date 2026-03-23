"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

const ARTICLES = [
  {
    slug: "hardness-testing",
    icon: "🔧",
    titleTR: "Sertlik Testleri: Rockwell, Vickers ve Brinell",
    titleEN: "Hardness Testing: Rockwell, Vickers and Brinell",
    descTR: "Metalik malzemelerde sertlik ölçüm prensipleri, uç geometrileri, yük seçimi ve ASTM E140 dönüşüm tablosu.",
    descEN: "Hardness measurement principles in metallic materials, indenter geometries, load selection and ASTM E140 conversion.",
    tags: ["ASTM E18", "ASTM E92", "ASTM E10"],
    category: "testing",
  },
  {
    slug: "fe-c-phase-diagram",
    icon: "📊",
    titleTR: "Fe-C Faz Diyagramı: Kapsamlı Rehber",
    titleEN: "Fe-C Phase Diagram: Comprehensive Guide",
    descTR: "Demir-sementit denge diyagramı, ötektoid reaksiyon, faz bölgeleri, kaldıraç kuralı ve soğuma yolu analizi.",
    descEN: "Iron-cementite equilibrium diagram, eutectoid reaction, phase regions, lever rule and cooling path analysis.",
    tags: ["Thermodynamics", "Phase Fractions", "A1/A3"],
    category: "fundamentals",
  },
  {
    slug: "steel-microstructures",
    icon: "🔬",
    titleTR: "Çelik Mikroyapıları: Ferrit, Perlit, Beynit, Martenzit",
    titleEN: "Steel Microstructures: Ferrite, Pearlite, Bainite, Martensite",
    descTR: "Çeliklerde oluşan temel fazlar, oluşum mekanizmaları, morfolojileri ve mekanik özelliklere etkileri.",
    descEN: "Fundamental phases in steels, formation mechanisms, morphologies and effects on mechanical properties.",
    tags: ["Metallography", "CCT", "TTT"],
    category: "fundamentals",
  },
  {
    slug: "corrosion-mechanisms",
    icon: "⚗️",
    titleTR: "Korozyon Mekanizmaları ve Korozyon Hızı Hesabı",
    titleEN: "Corrosion Mechanisms and Corrosion Rate Calculation",
    descTR: "Elektrokimyasal korozyon temelleri, korozyon türleri, hız hesaplama yöntemleri ve koruma stratejileri.",
    descEN: "Electrochemical corrosion fundamentals, corrosion types, rate calculation methods and protection strategies.",
    tags: ["API 570", "NACE", "Electrochemical"],
    category: "corrosion",
  },
  {
    slug: "mechanical-testing",
    icon: "💪",
    titleTR: "Mekanik Test Yöntemleri: Çekme, Darbe ve DWTT",
    titleEN: "Mechanical Testing Methods: Tensile, Impact and DWTT",
    descTR: "Çekme testi (ASTM E8), Charpy darbe testi (ASTM E23), DWTT ve mekanik özellik yorumlama.",
    descEN: "Tensile testing (ASTM E8), Charpy impact testing (ASTM E23), DWTT and mechanical property interpretation.",
    tags: ["ASTM E8", "ASTM E23", "API 5L"],
    category: "testing",
  },
  {
    slug: "grain-size-hall-petch",
    icon: "🔬",
    titleTR: "Tane Boyutu Ölçümü ve Hall-Petch İlişkisi",
    titleEN: "Grain Size Measurement and Hall-Petch Relationship",
    descTR: "ASTM E112 tane boyutu ölçüm yöntemleri, Hall-Petch denklemi ve tane boyutunun mekanik özelliklere etkisi.",
    descEN: "ASTM E112 grain size measurement methods, Hall-Petch equation and effect of grain size on mechanical properties.",
    tags: ["ASTM E112", "Hall-Petch", "σy"],
    category: "fundamentals",
  },
];

export default function KnowledgeBase() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-mono mb-6">
            <span>📚</span> {lang === "tr" ? "6 Makale" : "6 Articles"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {lang === "tr" ? "Bilgi Bankası" : "Knowledge Base"}
          </h1>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            {lang === "tr"
              ? "Metalurji mühendisliğinin temel konularında kapsamlı teknik rehberler."
              : "Comprehensive technical guides on fundamental metallurgical engineering topics."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/knowledge/${article.slug}`}
              className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 no-underline text-dark-50 hover:border-gold-400/30 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{article.icon}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-gold-400 transition-colors">
                    {lang === "tr" ? article.titleTR : article.titleEN}
                  </h2>
                  <p className="text-dark-300 text-sm leading-relaxed mb-4">
                    {lang === "tr" ? article.descTR : article.descEN}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {article.tags.map((tag) => (
                      <span key={tag} className="bg-gold-400/10 border border-gold-400/20 rounded px-2 py-0.5 text-xs text-gold-400 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold mb-3">
            {lang === "tr" ? "Bu bilgileri pratikte kullanın" : "Put this knowledge into practice"}
          </h3>
          <p className="text-dark-300 text-sm mb-6 max-w-md mx-auto">
            {lang === "tr"
              ? "Sertlik çevirici, birim dönüştürücü ve AI destekli metalurji araçlarımızı ücretsiz deneyin."
              : "Try our hardness converter, unit converter and AI-powered metallurgy tools for free."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/tools/hardness" className="bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">
              {lang === "tr" ? "Sertlik Çevirici →" : "Hardness Converter →"}
            </Link>
            <Link href="/tools/unit-converter" className="border border-white/15 text-dark-50 rounded-lg px-6 py-2.5 text-sm font-medium no-underline hover:border-gold-400/40 transition-colors">
              {lang === "tr" ? "Birim Çevirici →" : "Unit Converter →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
