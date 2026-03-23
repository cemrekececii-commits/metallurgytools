"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function FeCDiagram() {
  return (
    <svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
      {/* Axes */}
      <line x1="80" y1="400" x2="560" y2="400" stroke="#4B5563" strokeWidth="1.5" />
      <line x1="80" y1="400" x2="80" y2="30" stroke="#4B5563" strokeWidth="1.5" />
      {/* Axis labels */}
      <text x="320" y="435" textAnchor="middle" fill="#9CA3AF" fontSize="12" fontFamily="sans-serif">wt% C</text>
      <text x="25" y="220" textAnchor="middle" fill="#9CA3AF" fontSize="12" fontFamily="sans-serif" transform="rotate(-90,25,220)">Temperature (°C)</text>
      {/* X axis ticks */}
      {[0, 0.77, 2.14, 4.3, 6.67].map((c, i) => {
        const x = 80 + (c / 6.67) * 480;
        return (<g key={i}><line x1={x} y1="400" x2={x} y2="405" stroke="#4B5563" strokeWidth="1" /><text x={x} y="418" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="monospace">{c}</text></g>);
      })}
      {/* Y axis ticks */}
      {[200, 400, 600, 727, 912, 1147, 1493, 1538].map((temp, i) => {
        const y = 400 - ((temp - 100) / 1500) * 370;
        return (<g key={i}><line x1="75" y1={y} x2="80" y2={y} stroke="#4B5563" strokeWidth="1" /><text x="72" y={y + 4} textAnchor="end" fill="#9CA3AF" fontSize="8" fontFamily="monospace">{temp}</text></g>);
      })}
      {/* Phase boundaries */}
      {/* Liquidus */}
      <polyline points="80,48 190,130 395,190" fill="none" stroke="#EF4444" strokeWidth="2" />
      <polyline points="395,190 560,190" fill="none" stroke="#EF4444" strokeWidth="2" />
      {/* Solidus */}
      <polyline points="80,48 95,80 140,125" fill="none" stroke="#F59E0B" strokeWidth="2" />
      {/* A3 line */}
      <polyline points="80,155 180,225" fill="none" stroke="#60A5FA" strokeWidth="2" />
      {/* A1 line (eutectoid) */}
      <line x1="80" y1="225" x2="395" y2="225" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6,3" />
      {/* Acm line */}
      <polyline points="180,225 395,190" fill="none" stroke="#A78BFA" strokeWidth="2" />
      {/* Eutectic line */}
      <line x1="140" y1="190" x2="560" y2="190" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Solvus */}
      <line x1="80" y1="225" x2="80" y2="400" stroke="#10B981" strokeWidth="1.5" />
      {/* Phase labels */}
      <text x="110" y="110" fill="#60A5FA" fontSize="13" fontFamily="sans-serif" fontWeight="600">δ</text>
      <text x="130" y="175" fill="#EF4444" fontSize="13" fontFamily="sans-serif" fontWeight="600">L</text>
      <text x="130" y="210" fill="#F59E0B" fontSize="13" fontFamily="sans-serif" fontWeight="600">γ</text>
      <text x="100" y="300" fill="#10B981" fontSize="13" fontFamily="sans-serif" fontWeight="600">α</text>
      <text x="260" y="300" fill="#9CA3AF" fontSize="11" fontFamily="sans-serif">α + Fe₃C</text>
      <text x="200" y="210" fill="#A78BFA" fontSize="11" fontFamily="sans-serif">γ + Fe₃C</text>
      <text x="450" y="300" fill="#6B7280" fontSize="11" fontFamily="sans-serif">Ledeburite</text>
      {/* Key points */}
      <circle cx="180" cy="225" r="5" fill="#D4AF37" />
      <text x="180" y="250" textAnchor="middle" fill="#D4AF37" fontSize="9" fontFamily="monospace">Eutectoid</text>
      <text x="180" y="262" textAnchor="middle" fill="#D4AF37" fontSize="8" fontFamily="monospace">0.77%C, 727°C</text>
      <circle cx="395" cy="190" r="5" fill="#F97316" />
      <text x="395" y="175" textAnchor="middle" fill="#F97316" fontSize="9" fontFamily="monospace">Eutectic</text>
      <text x="395" y="165" textAnchor="middle" fill="#F97316" fontSize="8" fontFamily="monospace">4.3%C, 1147°C</text>
      {/* A1 label */}
      <text x="45" y="228" fill="#D4AF37" fontSize="9" fontFamily="monospace" fontWeight="600">A₁</text>
      <text x="45" y="158" fill="#60A5FA" fontSize="9" fontFamily="monospace" fontWeight="600">A₃</text>
    </svg>
  );
}

export default function FeCArticle() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">{lang === "tr" ? "Bilgi Bankası" : "Knowledge Base"}</Link>
          <span>/</span>
          <span className="text-dark-100">{lang === "tr" ? "Fe-C Faz Diyagramı" : "Fe-C Phase Diagram"}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {lang === "tr" ? "Fe-C Faz Diyagramı: Kapsamlı Rehber" : "Fe-C Phase Diagram: Comprehensive Guide"}
        </h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12">
          <span>📊 {lang === "tr" ? "Temel Bilgi" : "Fundamentals"}</span>
          <span>•</span>
          <span>{lang === "tr" ? "15 dk okuma" : "15 min read"}</span>
        </div>

        <p className="text-dark-200 text-base leading-relaxed mb-8">
          {lang === "tr"
            ? "Demir-karbon (Fe-C) faz diyagramı, metalurji mühendisliğinin temel taşıdır. Çelik ve dökme demirlerdeki faz dönüşümlerini, kritik sıcaklıkları ve oluşan mikroyapıları anlamak için vazgeçilmezdir. Bu diyagram, belirli bir sıcaklık ve bileşimde hangi fazların kararlı olduğunu gösterir."
            : "The iron-carbon (Fe-C) phase diagram is the cornerstone of metallurgical engineering. It is essential for understanding phase transformations, critical temperatures, and resulting microstructures in steels and cast irons. This diagram shows which phases are stable at a given temperature and composition."}
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
          <FeCDiagram />
          <p className="text-xs text-dark-300 text-center mt-3 font-mono">
            {lang === "tr" ? "Şekil 1: Fe-Fe₃C metastabil faz diyagramı (şematik)" : "Figure 1: Fe-Fe₃C metastable phase diagram (schematic)"}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
          {lang === "tr" ? "1. Temel Fazlar" : "1. Fundamental Phases"}
        </h2>
        <div className="space-y-4 mb-8">
          {[
            { phase: "α-Ferrit", desc: lang === "tr" ? "BCC yapıda, maksimum %0.022 C çözebilir (727°C'de). Yumuşak ve sünek. Manyetik (770°C Curie sıcaklığına kadar)." : "BCC structure, dissolves max 0.022% C (at 727°C). Soft and ductile. Magnetic (up to 770°C Curie temperature)." },
            { phase: "γ-Östenit", desc: lang === "tr" ? "FCC yapıda, maksimum %2.14 C çözebilir (1147°C'de). Yüksek sıcaklıkta kararlı. Amanyetik. Tüm ısıl işlemlerin başlangıç fazı." : "FCC structure, dissolves max 2.14% C (at 1147°C). Stable at high temperatures. Non-magnetic. Starting phase for all heat treatments." },
            { phase: "Fe₃C (Sementit)", desc: lang === "tr" ? "Ortorombik yapıda demir karbür. %6.67 C içerir. Sert ve gevrek. Perlitin lameller bileşeni." : "Orthorhombic iron carbide. Contains 6.67% C. Hard and brittle. Lamellar component of pearlite." },
            { phase: "δ-Ferrit", desc: lang === "tr" ? "BCC yapıda, yüksek sıcaklık ferriti. 1394-1538°C arasında kararlı. Sınırlı endüstriyel öneme sahip." : "BCC structure, high-temperature ferrite. Stable between 1394-1538°C. Limited industrial significance." },
          ].map((item) => (
            <div key={item.phase} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
              <span className="text-gold-400 font-semibold">{item.phase}:</span>
              <span className="text-dark-200 ml-2">{item.desc}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
          {lang === "tr" ? "2. Kritik Sıcaklıklar" : "2. Critical Temperatures"}
        </h2>
        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8">
          <div className="space-y-2 text-sm text-dark-200">
            <div><span className="text-gold-400 font-mono font-semibold">A₁ = 727°C:</span> {lang === "tr" ? "Ötektoid sıcaklık. Perlit ↔ östenit dönüşümü. Tüm çeliklerde sabit." : "Eutectoid temperature. Pearlite ↔ austenite transformation. Constant for all steels."}</div>
            <div><span className="text-gold-400 font-mono font-semibold">A₃:</span> {lang === "tr" ? "Hipoötektoid çeliklerde ferrit → östenit dönüşümünün tamamlandığı sıcaklık. C arttıkça düşer." : "Temperature at which ferrite → austenite transformation completes in hypoeutectoid steels. Decreases with increasing C."}</div>
            <div><span className="text-gold-400 font-mono font-semibold">Aₓₘ:</span> {lang === "tr" ? "Hiperötektoid çeliklerde sementit → östenite çözünme sıcaklığı." : "Cementite dissolution temperature in hypereutectoid steels."}</div>
            <div><span className="text-gold-400 font-mono font-semibold">1147°C:</span> {lang === "tr" ? "Ötektik sıcaklık. Sıvı → östenit + sementit (ledeburit)." : "Eutectic temperature. Liquid → austenite + cementite (ledeburite)."}</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
          {lang === "tr" ? "3. Kaldıraç Kuralı (Lever Rule)" : "3. Lever Rule"}
        </h2>
        <p className="text-dark-200 text-base leading-relaxed mb-6">
          {lang === "tr"
            ? "İki fazlı bir bölgede, her fazın ağırlık fraksiyonunu hesaplamak için kaldıraç kuralı kullanılır. Örneğin, %0.4C çelik 727°C'nin hemen altında:"
            : "In a two-phase region, the lever rule is used to calculate the weight fraction of each phase. For example, 0.4%C steel just below 727°C:"}
        </p>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-8 font-mono text-sm">
          <div className="text-gold-400 mb-2">Wα = (C_Fe₃C − C₀) / (C_Fe₃C − C_α)</div>
          <div className="text-gold-400 mb-4">Wα = (6.67 − 0.40) / (6.67 − 0.022) = <span className="text-green-400 font-bold">94.3%</span> {lang === "tr" ? "ferrit" : "ferrite"}</div>
          <div className="text-dark-300">W_Fe₃C = 1 − Wα = <span className="text-green-400 font-bold">5.7%</span> {lang === "tr" ? "sementit" : "cementite"}</div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">
            {lang === "tr" ? "Fe-C Faz Diyagramı Simülatörünü Deneyin" : "Try the Fe-C Phase Diagram Simulator"}
          </h3>
          <p className="text-dark-300 text-sm mb-4">
            {lang === "tr" ? "İnteraktif olarak kompozisyon ve sıcaklık seçin, faz fraksiyonlarını anında hesaplayın." : "Interactively select composition and temperature, instantly calculate phase fractions."}
          </p>
          <Link href="/tools/phase-diagram" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">
            {lang === "tr" ? "Simülatörü Aç →" : "Open Simulator →"}
          </Link>
        </div>
      </article>
    </div>
  );
}
