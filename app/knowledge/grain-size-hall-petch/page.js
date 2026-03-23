"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function HallPetchSVG() {
  return (
    <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      <line x1="60" y1="280" x2="460" y2="280" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="60" y1="280" x2="60" y2="30" stroke="#4B5563" strokeWidth="1.5" />
      <text x="260" y="310" textAnchor="middle" fill="#9CA3AF" fontSize="11">d⁻¹ᐟ² (mm⁻¹ᐟ²)</text>
      <text x="20" y="160" textAnchor="middle" fill="#9CA3AF" fontSize="11" transform="rotate(-90,20,160)">σy (MPa)</text>
      {/* Hall-Petch line */}
      <line x1="80" y1="240" x2="420" y2="60" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Data points */}
      {[[100,225],[150,200],[200,175],[250,148],[300,120],[350,95],[400,72]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#D4AF37" stroke="#B8860B" strokeWidth="1" />
      ))}
      {/* σ₀ intercept */}
      <line x1="55" y1="240" x2="85" y2="240" stroke="#60A5FA" strokeWidth="1" strokeDasharray="4,3" />
      <text x="50" y="243" textAnchor="end" fill="#60A5FA" fontSize="10" fontFamily="monospace">σ₀</text>
      {/* Slope label */}
      <text x="280" y="120" fill="#D4AF37" fontSize="12" fontFamily="monospace" fontWeight="600">slope = k</text>
      {/* Equation */}
      <rect x="280" y="40" width="180" height="30" rx="6" fill="#1F2937" />
      <text x="370" y="60" textAnchor="middle" fill="#D4AF37" fontSize="12" fontFamily="monospace" fontWeight="600">σy = σ₀ + k·d⁻¹ᐟ²</text>
      {/* Grain size labels */}
      <text x="100" y="270" textAnchor="middle" fill="#6B7280" fontSize="8">Coarse grain</text>
      <text x="400" y="270" textAnchor="middle" fill="#6B7280" fontSize="8">Fine grain</text>
    </svg>
  );
}

export default function GrainSizeArticle() {
  const { lang } = useLang();
  const tr = lang === "tr";

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">{tr ? "Bilgi Bankası" : "Knowledge Base"}</Link>
          <span>/</span><span className="text-dark-100">{tr ? "Tane Boyutu ve Hall-Petch" : "Grain Size and Hall-Petch"}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{tr ? "Tane Boyutu Ölçümü ve Hall-Petch İlişkisi" : "Grain Size Measurement and Hall-Petch Relationship"}</h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12"><span>🔬</span><span>{tr ? "12 dk okuma" : "12 min read"}</span><span>•</span><span>ASTM E112</span></div>

        <p className="text-dark-200 text-base leading-relaxed mb-8">
          {tr ? "Tane boyutu, çeliklerin mekanik özelliklerini belirleyen en önemli mikroyapısal parametrelerden biridir. İnce taneli çelikler hem daha yüksek akma dayanımına hem de daha iyi tokluğa sahiptir — bu benzersiz kombinasyon tane boyutu kontrolünü metalurjide kritik kılar."
             : "Grain size is one of the most important microstructural parameters determining mechanical properties of steels. Fine-grained steels have both higher yield strength and better toughness — this unique combination makes grain size control critical in metallurgy."}
        </p>

        <h2 className="text-2xl font-bold text-gold-400 mb-4">{tr ? "1. ASTM E112 Ölçüm Yöntemleri" : "1. ASTM E112 Measurement Methods"}</h2>
        <div className="space-y-4 mb-8">
          {[
            { name: tr ? "Karşılaştırma Yöntemi" : "Comparison Method", desc: tr ? "Mikrograf, standart tane boyutu şablonlarıyla karşılaştırılır. Hızlı ama operatör bağımlı. Yaygın kalite kontrol uygulaması." : "Micrograph is compared with standard grain size charts. Fast but operator-dependent. Common quality control application." },
            { name: tr ? "Kesişim (Heyn) Yöntemi" : "Intercept (Heyn) Method", desc: tr ? "Mikrograf üzerine çizgi çekilir, tane sınırı kesişimleri sayılır. N_L = (kesişim sayısı) / (çizgi uzunluğu). G = [6.643856 × log₁₀(N_L)] − 3.288." : "Line is drawn on micrograph, grain boundary intersections are counted. N_L = (intersections) / (line length). G = [6.643856 × log₁₀(N_L)] − 3.288." },
            { name: tr ? "Planimetrik (Jeffries) Yöntemi" : "Planimetric (Jeffries) Method", desc: tr ? "Bilinen alandaki tane sayısı hesaplanır. N_A = (iç taneler + 0.5 × sınır taneleri) / alan. En doğru ama en yavaş yöntem." : "Grain count in known area is calculated. N_A = (interior grains + 0.5 × boundary grains) / area. Most accurate but slowest method." },
          ].map((m) => (
            <div key={m.name} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
              <div className="text-gold-400 font-semibold mb-1">{m.name}</div>
              <div className="text-dark-300 text-sm">{m.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">{tr ? "2. Hall-Petch Denklemi" : "2. Hall-Petch Equation"}</h2>
        <p className="text-dark-200 text-base leading-relaxed mb-6">
          {tr ? "Hall-Petch denklemi, akma dayanımı ile tane boyutu arasındaki ters karekök ilişkisini tanımlar. Tane sınırları dislokasyon hareketini engeller — tane boyutu küçüldükçe sınır yoğunluğu artar ve malzeme sertleşir."
             : "The Hall-Petch equation describes the inverse square root relationship between yield strength and grain size. Grain boundaries impede dislocation movement — as grain size decreases, boundary density increases and the material strengthens."}
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
          <HallPetchSVG />
          <p className="text-xs text-dark-300 text-center mt-3 font-mono">{tr ? "Şekil 1: Hall-Petch ilişkisi — akma dayanımı vs d⁻¹ᐟ²" : "Figure 1: Hall-Petch relationship — yield strength vs d⁻¹ᐟ²"}</p>
        </div>

        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8 font-mono text-sm">
          <div className="text-gold-400 text-lg mb-3">σy = σ₀ + k × d⁻¹ᐟ²</div>
          <div className="text-dark-300 space-y-1">
            <div>σy = {tr ? "akma dayanımı (MPa)" : "yield strength (MPa)"}</div>
            <div>σ₀ = {tr ? "kafes sürtünme gerilmesi (~70 MPa, saf Fe)" : "lattice friction stress (~70 MPa, pure Fe)"}</div>
            <div>k = Hall-Petch {tr ? "sabiti" : "constant"} (~0.74 MPa·mm¹ᐟ², {tr ? "düşük karbonlu çelik" : "low carbon steel"})</div>
            <div>d = {tr ? "ortalama tane çapı (mm)" : "average grain diameter (mm)"}</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">{tr ? "3. ASTM G Numarası" : "3. ASTM G Number"}</h2>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-8 font-mono text-sm">
          <div className="text-gold-400 mb-2">n = 2^(G−1)</div>
          <div className="text-dark-300 mb-4">n = {tr ? "100x büyütmede inç² başına tane sayısı" : "number of grains per square inch at 100x"}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {[{g:1,d:"254μm"},{g:3,d:"127μm"},{g:5,d:"64μm"},{g:7,d:"32μm"},{g:8,d:"22μm"},{g:9,d:"16μm"},{g:10,d:"11μm"},{g:12,d:"5.6μm"}].map((r) => (
              <div key={r.g} className="bg-dark-800 rounded p-2 text-center">
                <div className="text-gold-400 font-bold">G = {r.g}</div>
                <div className="text-dark-300">d ≈ {r.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">{tr ? "Tane Boyutu Analizörünü Deneyin" : "Try the Grain Size Analyzer"}</h3>
          <Link href="/tools/grain-size" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline">{tr ? "Analizörü Aç →" : "Open Analyzer →"}</Link>
        </div>
      </article>
    </div>
  );
}
