"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function CorrosionCellSVG() {
  return (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      {/* Electrolyte */}
      <rect x="50" y="100" width="400" height="150" rx="6" fill="#1E3A5F" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="250" y="135" textAnchor="middle" fill="#60A5FA" fontSize="11">Electrolyte (H₂O + O₂ + ions)</text>
      {/* Anode */}
      <rect x="90" y="140" width="80" height="100" rx="4" fill="#7F1D1D" fillOpacity="0.5" stroke="#EF4444" strokeWidth="2" />
      <text x="130" y="200" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="600">ANODE</text>
      <text x="130" y="218" textAnchor="middle" fill="#FCA5A5" fontSize="9">Fe → Fe²⁺ + 2e⁻</text>
      <text x="130" y="255" textAnchor="middle" fill="#EF4444" fontSize="9">(Oxidation)</text>
      {/* Cathode */}
      <rect x="330" y="140" width="80" height="100" rx="4" fill="#14532D" fillOpacity="0.5" stroke="#10B981" strokeWidth="2" />
      <text x="370" y="200" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="600">CATHODE</text>
      <text x="370" y="218" textAnchor="middle" fill="#6EE7B7" fontSize="9">O₂ + 2H₂O + 4e⁻</text>
      <text x="370" y="232" textAnchor="middle" fill="#6EE7B7" fontSize="9">→ 4OH⁻</text>
      <text x="370" y="255" textAnchor="middle" fill="#10B981" fontSize="9">(Reduction)</text>
      {/* Electron flow */}
      <line x1="170" y1="160" x2="330" y2="160" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#eArrow)" />
      <text x="250" y="155" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="600">e⁻ flow →</text>
      {/* Ion flow */}
      <path d="M170,190 Q250,210 330,190" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#ionArrow)" />
      <text x="250" y="220" textAnchor="middle" fill="#A78BFA" fontSize="9">Fe²⁺ (ion migration)</text>
      {/* Rust product */}
      <rect x="200" y="60" width="100" height="30" rx="6" fill="#92400E" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="1" />
      <text x="250" y="80" textAnchor="middle" fill="#F59E0B" fontSize="10">Fe₂O₃·nH₂O (Rust)</text>
      <defs>
        <marker id="eArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#F59E0B" /></marker>
        <marker id="ionArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#A78BFA" /></marker>
      </defs>
    </svg>
  );
}

export default function CorrosionArticle() {
  const { lang } = useLang();
  const tr = lang === "tr";

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">{tr ? "Bilgi Bankası" : "Knowledge Base"}</Link>
          <span>/</span><span className="text-dark-100">{tr ? "Korozyon Mekanizmaları" : "Corrosion Mechanisms"}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{tr ? "Korozyon Mekanizmaları ve Korozyon Hızı Hesabı" : "Corrosion Mechanisms and Corrosion Rate Calculation"}</h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12"><span>⚗️</span><span>{tr ? "12 dk okuma" : "12 min read"}</span></div>

        <p className="text-dark-200 text-base leading-relaxed mb-8">
          {tr ? "Korozyon, metallerin çevreleriyle kimyasal veya elektrokimyasal reaksiyona girerek bozunmasıdır. Çelik yapılarda en yaygın hasar mekanizmasıdır ve yıllık küresel maliyeti dünya GSYH'sinin yaklaşık %3-4'ü kadardır. Korozyonu anlamak ve kontrol etmek, yapısal bütünlüğün korunması için kritiktir."
           : "Corrosion is the degradation of metals through chemical or electrochemical reaction with their environment. It is the most common damage mechanism in steel structures and its annual global cost is approximately 3-4% of world GDP. Understanding and controlling corrosion is critical for maintaining structural integrity."}
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-10">
          <CorrosionCellSVG />
          <p className="text-xs text-dark-300 text-center mt-3 font-mono">{tr ? "Şekil 1: Elektrokimyasal korozyon hücresi — anot, katot, elektrolit ve elektron akışı" : "Figure 1: Electrochemical corrosion cell — anode, cathode, electrolyte and electron flow"}</p>
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4">{tr ? "Korozyon Türleri" : "Types of Corrosion"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { name: tr ? "Üniform Korozyon" : "Uniform Corrosion", desc: tr ? "Yüzeyde homojen metal kaybı. Ağırlık kaybı yöntemiyle ölçülür." : "Homogeneous metal loss across surface. Measured by weight loss method." },
            { name: tr ? "Çukurcuk (Pitting)" : "Pitting Corrosion", desc: tr ? "Lokal, derin oyuklar. Pasif film kırılmasıyla başlar. Klorür iyonları tetikler." : "Localized, deep pits. Initiated by passive film breakdown. Triggered by chloride ions." },
            { name: tr ? "Galvanik Korozyon" : "Galvanic Corrosion", desc: tr ? "İki farklı metalin temas ettiği yerde, daha aktif metal çözünür." : "When two dissimilar metals are in contact, the more active metal dissolves." },
            { name: tr ? "Gerilmeli Korozyon (SCC)" : "Stress Corrosion Cracking", desc: tr ? "Çekme gerilmesi + korozif ortam kombinasyonu. Ani kırılmaya neden olabilir." : "Combination of tensile stress + corrosive environment. Can cause sudden failure." },
          ].map((type) => (
            <div key={type.name} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
              <div className="text-gold-400 font-semibold mb-1">{type.name}</div>
              <div className="text-dark-300 text-sm">{type.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">{tr ? "Korozyon Hızı Hesabı" : "Corrosion Rate Calculation"}</h2>
        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8 font-mono text-sm">
          <div className="text-gold-400 mb-2">CR (mm/yr) = (K × W) / (A × T × D)</div>
          <div className="text-dark-300 space-y-1 mt-3">
            <div>K = 8.76 × 10⁴ ({tr ? "birim sabiti" : "unit constant"})</div>
            <div>W = {tr ? "ağırlık kaybı (g)" : "weight loss (g)"}</div>
            <div>A = {tr ? "yüzey alanı (cm²)" : "surface area (cm²)"}</div>
            <div>T = {tr ? "maruz kalma süresi (saat)" : "exposure time (hours)"}</div>
            <div>D = {tr ? "yoğunluk (g/cm³)" : "density (g/cm³)"} — Fe: 7.87</div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">{tr ? "Korozyon Hesaplayıcı'yı Kullanın" : "Use the Corrosion Calculator"}</h3>
          <Link href="/tools/corrosion" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline">{tr ? "Hesaplayıcıyı Aç →" : "Open Calculator →"}</Link>
        </div>
      </article>
    </div>
  );
}
