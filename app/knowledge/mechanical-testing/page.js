"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function TensileCurveSVG() {
  return (
    <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      <line x1="60" y1="280" x2="460" y2="280" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="60" y1="280" x2="60" y2="30" stroke="#4B5563" strokeWidth="1.5" />
      <text x="260" y="310" textAnchor="middle" fill="#9CA3AF" fontSize="11">Strain (ε)</text>
      <text x="20" y="160" textAnchor="middle" fill="#9CA3AF" fontSize="11" transform="rotate(-90,20,160)">Stress (σ)</text>
      {/* Curve */}
      <path d="M60,280 L60,275 L120,140 L130,135 Q160,120 200,110 Q240,100 280,90 Q320,82 350,78 Q370,80 390,90 Q410,110 420,140 L425,160" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Fracture X */}
      <circle cx="425" cy="160" r="4" fill="#EF4444" />
      <text x="440" y="155" fill="#EF4444" fontSize="10" fontWeight="600">Fracture</text>
      {/* YS line */}
      <line x1="120" y1="140" x2="120" y2="280" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4,3" />
      <text x="120" y="295" textAnchor="middle" fill="#60A5FA" fontSize="9">YS</text>
      <line x1="55" y1="140" x2="125" y2="140" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4,3" />
      {/* UTS line */}
      <line x1="350" y1="78" x2="350" y2="280" stroke="#EF4444" strokeWidth="1" strokeDasharray="4,3" />
      <text x="350" y="295" textAnchor="middle" fill="#EF4444" fontSize="9">UTS</text>
      <line x1="55" y1="78" x2="355" y2="78" stroke="#EF4444" strokeWidth="1" strokeDasharray="4,3" />
      {/* Labels */}
      <text x="40" y="143" textAnchor="end" fill="#60A5FA" fontSize="9" fontFamily="monospace">σy</text>
      <text x="40" y="82" textAnchor="end" fill="#EF4444" fontSize="9" fontFamily="monospace">σu</text>
      {/* Regions */}
      <text x="90" y="220" fill="#10B981" fontSize="9" transform="rotate(-70,90,220)">Elastic</text>
      <text x="220" y="70" fill="#F59E0B" fontSize="10">Plastic Region</text>
      <text x="395" y="70" fill="#A78BFA" fontSize="9">Necking</text>
    </svg>
  );
}

export default function MechanicalTestingArticle() {
  const { lang } = useLang();
  const tr = lang === "tr";

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">{tr ? "Bilgi Bankası" : "Knowledge Base"}</Link>
          <span>/</span><span className="text-dark-100">{tr ? "Mekanik Testler" : "Mechanical Testing"}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{tr ? "Mekanik Test Yöntemleri: Çekme, Darbe ve DWTT" : "Mechanical Testing Methods: Tensile, Impact and DWTT"}</h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12"><span>💪</span><span>{tr ? "15 dk okuma" : "15 min read"}</span><span>•</span><span>ASTM E8, E23</span></div>

        <p className="text-dark-200 text-base leading-relaxed mb-8">
          {tr ? "Mekanik testler, malzemelerin yük altındaki davranışını ölçer. Çekme testi dayanım ve sünekliği, darbe testi tokluğu, DWTT ise boru çeliklerinin gevrek kırılma direncini belirler. Bu testler kalite kontrol, malzeme seçimi ve hasar analizi için temeldir."
             : "Mechanical tests measure material behavior under load. Tensile testing determines strength and ductility, impact testing measures toughness, and DWTT determines brittle fracture resistance of pipe steels. These tests are fundamental for quality control, material selection, and failure analysis."}
        </p>

        <h2 className="text-2xl font-bold text-gold-400 mb-4">{tr ? "1. Çekme Testi (ASTM E8/E8M)" : "1. Tensile Testing (ASTM E8/E8M)"}</h2>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
          <TensileCurveSVG />
          <p className="text-xs text-dark-300 text-center mt-3 font-mono">{tr ? "Şekil 1: Mühendislik gerilme-birim şekil değiştirme eğrisi" : "Figure 1: Engineering stress-strain curve"}</p>
        </div>

        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8">
          <div className="text-sm font-semibold text-gold-400 mb-3">{tr ? "Temel Parametreler" : "Key Parameters"}</div>
          <div className="space-y-2 text-sm text-dark-200">
            <div><span className="text-gold-400 font-mono">YS (σy):</span> {tr ? "Akma dayanımı — plastik deformasyonun başladığı gerilme. %0.2 offset yöntemiyle belirlenir." : "Yield strength — stress at which plastic deformation begins. Determined by 0.2% offset method."}</div>
            <div><span className="text-gold-400 font-mono">UTS (σu):</span> {tr ? "Çekme dayanımı — maksimum mühendislik gerilmesi. Boyun verme başlangıcı." : "Ultimate tensile strength — maximum engineering stress. Onset of necking."}</div>
            <div><span className="text-gold-400 font-mono">El (%):</span> {tr ? "Uzama — kopma anındaki kalıcı boy değişimi yüzdesi. Süneklik ölçüsü." : "Elongation — percentage of permanent length change at fracture. Ductility measure."}</div>
            <div><span className="text-gold-400 font-mono">RA (%):</span> {tr ? "Kesit daralması — kopma kesitindeki alan azalması." : "Reduction of area — area decrease at fracture cross-section."}</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">{tr ? "2. Charpy Darbe Testi (ASTM E23)" : "2. Charpy Impact Test (ASTM E23)"}</h2>
        <p className="text-dark-200 text-base leading-relaxed mb-6">
          {tr ? "V-çentikli numune, sarkaç darbe ile kırılır. Absorbe edilen enerji (Joule) ölçülür. Sünek-gevrek geçiş sıcaklığını (DBTT) belirlemek için farklı sıcaklıklarda test yapılır. API 5L boru çelikleri için -20°C veya -40°C'de minimum 27J veya 40J şartı tipiktir."
           : "V-notch specimen is broken by pendulum impact. Absorbed energy (Joule) is measured. Tests at different temperatures determine the ductile-to-brittle transition temperature (DBTT). For API 5L pipe steels, minimum 27J or 40J at -20°C or -40°C is typical."}
        </p>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">{tr ? "3. DWTT (Drop Weight Tear Test)" : "3. DWTT (Drop Weight Tear Test)"}</h2>
        <p className="text-dark-200 text-base leading-relaxed mb-6">
          {tr ? "API 5L3 / ASTM E436 standardına göre yapılır. Tam kalınlıkta boru çeliği numunesi, düşen ağırlıkla kırılır. Kırık yüzeyindeki sünek alan yüzdesi (%SA — Shear Area) ölçülür. Boru hatları için tipik kabul kriteri: belirtilen test sıcaklığında minimum %85 SA."
           : "Performed per API 5L3 / ASTM E436. Full-thickness pipe steel specimen is broken by drop weight. The ductile area percentage (%SA — Shear Area) on fracture surface is measured. Typical acceptance criterion for pipelines: minimum 85% SA at specified test temperature."}
        </p>

        <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">{tr ? "İlgili Araçlar" : "Related Tools"}</h3>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/tools/unit-converter" className="bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-5 py-2 text-sm font-semibold no-underline">{tr ? "Birim Çevirici (MPa↔ksi, J↔ft·lb) →" : "Unit Converter (MPa↔ksi, J↔ft·lb) →"}</Link>
            <Link href="/tools/hardness" className="border border-white/15 text-dark-50 rounded-lg px-5 py-2 text-sm font-medium no-underline hover:border-gold-400/40">{tr ? "Sertlik Çevirici →" : "Hardness Converter →"}</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
