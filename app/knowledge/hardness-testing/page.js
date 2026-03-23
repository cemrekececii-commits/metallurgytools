"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function RockwellDiagram() {
  return (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      <defs>
        <linearGradient id="steel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6B7280" }} />
          <stop offset="100%" style={{ stopColor: "#374151" }} />
        </linearGradient>
        <linearGradient id="indenter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#D4AF37" }} />
          <stop offset="100%" style={{ stopColor: "#B8860B" }} />
        </linearGradient>
      </defs>
      {/* Specimen */}
      <rect x="50" y="160" width="400" height="120" rx="4" fill="url(#steel)" stroke="#4B5563" strokeWidth="1" />
      <text x="250" y="235" textAnchor="middle" fill="#9CA3AF" fontSize="12" fontFamily="monospace">SPECIMEN</text>
      {/* Indenter - diamond cone */}
      <polygon points="250,60 235,155 265,155" fill="url(#indenter)" stroke="#B8860B" strokeWidth="1.5" />
      <text x="250" y="50" textAnchor="middle" fill="#D4AF37" fontSize="11" fontFamily="sans-serif" fontWeight="600">Diamond Cone (120°)</text>
      {/* Indent mark */}
      <path d="M240,160 L250,185 L260,160" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,2" />
      {/* Depth arrows */}
      <line x1="290" y1="160" x2="290" y2="185" stroke="#60A5FA" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
      <text x="310" y="175" fill="#60A5FA" fontSize="10" fontFamily="monospace">d (depth)</text>
      {/* Load arrow */}
      <line x1="250" y1="15" x2="250" y2="55" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowGold)" />
      <text x="250" y="12" textAnchor="middle" fill="#F59E0B" fontSize="11" fontFamily="sans-serif" fontWeight="600">F (load)</text>
      {/* Labels */}
      <rect x="30" y="5" width="140" height="22" rx="4" fill="#1F2937" />
      <text x="100" y="20" textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="monospace">HRC: 150 kgf</text>
      <rect x="330" y="5" width="140" height="22" rx="4" fill="#1F2937" />
      <text x="400" y="20" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace">HRB: 100 kgf</text>
      {/* Arrow markers */}
      <defs>
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#60A5FA" /></marker>
        <marker id="arrowGold" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#F59E0B" /></marker>
      </defs>
    </svg>
  );
}

function VickersDiagram() {
  return (
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      {/* Specimen */}
      <rect x="50" y="150" width="400" height="110" rx="4" fill="#374151" stroke="#4B5563" strokeWidth="1" />
      {/* Diamond pyramid */}
      <polygon points="250,50 225,145 275,145" fill="none" stroke="#D4AF37" strokeWidth="2" />
      <line x1="250" y1="50" x2="250" y2="145" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4,3" />
      <text x="250" y="40" textAnchor="middle" fill="#D4AF37" fontSize="11" fontFamily="sans-serif" fontWeight="600">136° Diamond Pyramid</text>
      {/* Indent impression (top view) */}
      <rect x="350" y="60" width="60" height="60" rx="0" fill="none" stroke="#EF4444" strokeWidth="1.5" transform="rotate(45, 380, 90)" />
      <line x1="352" y1="90" x2="408" y2="90" stroke="#60A5FA" strokeWidth="1" markerStart="url(#arrowBlueS)" markerEnd="url(#arrowBlueE)" />
      <text x="380" y="130" textAnchor="middle" fill="#60A5FA" fontSize="10" fontFamily="monospace">d₁</text>
      <line x1="380" y1="62" x2="380" y2="118" stroke="#60A5FA" strokeWidth="1" markerStart="url(#arrowBlueS)" markerEnd="url(#arrowBlueE)" />
      <text x="415" y="95" fill="#60A5FA" fontSize="10" fontFamily="monospace">d₂</text>
      <text x="380" y="55" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="monospace">Top View</text>
      {/* Formula */}
      <rect x="50" y="10" width="200" height="25" rx="4" fill="#1F2937" />
      <text x="150" y="27" textAnchor="middle" fill="#D4AF37" fontSize="11" fontFamily="monospace">HV = 1.854 × F / d²</text>
      {/* Markers */}
      <defs>
        <marker id="arrowBlueS" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M6,0 L0,3 L6,6 Z" fill="#60A5FA" /></marker>
        <marker id="arrowBlueE" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#60A5FA" /></marker>
      </defs>
    </svg>
  );
}

function BrinellDiagram() {
  return (
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">
      {/* Specimen */}
      <rect x="50" y="160" width="400" height="100" rx="4" fill="#374151" stroke="#4B5563" strokeWidth="1" />
      {/* Ball indenter */}
      <circle cx="250" cy="120" r="40" fill="none" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="250" cy="120" r="2" fill="#D4AF37" />
      <text x="250" y="70" textAnchor="middle" fill="#D4AF37" fontSize="11" fontFamily="sans-serif" fontWeight="600">10mm WC Ball</text>
      {/* Indent impression */}
      <path d="M220,160 Q250,185 280,160" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,2" />
      {/* Diameter measurement */}
      <line x1="220" y1="200" x2="280" y2="200" stroke="#60A5FA" strokeWidth="1.5" markerStart="url(#arrowBlueS)" markerEnd="url(#arrowBlueE)" />
      <text x="250" y="218" textAnchor="middle" fill="#60A5FA" fontSize="11" fontFamily="monospace">d (mm)</text>
      {/* Formula */}
      <rect x="300" y="80" width="180" height="50" rx="6" fill="#1F2937" />
      <text x="390" y="100" textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="monospace">HB = 2F</text>
      <text x="390" y="120" textAnchor="middle" fill="#D4AF37" fontSize="10" fontFamily="monospace">πD(D-√(D²-d²))</text>
      {/* Load */}
      <line x1="250" y1="20" x2="250" y2="75" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#arrowGold2)" />
      <text x="250" y="15" textAnchor="middle" fill="#F59E0B" fontSize="11" fontFamily="sans-serif" fontWeight="600">3000 kgf</text>
      <defs>
        <marker id="arrowGold2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#F59E0B" /></marker>
      </defs>
    </svg>
  );
}

function ComparisonTable({ lang }) {
  const rows = [
    { prop: lang === "tr" ? "Standart" : "Standard", hrc: "ASTM E18", hv: "ASTM E92", hb: "ASTM E10" },
    { prop: lang === "tr" ? "Uç Tipi" : "Indenter", hrc: lang === "tr" ? "Elmas Konik (120°)" : "Diamond Cone (120°)", hv: lang === "tr" ? "Elmas Piramit (136°)" : "Diamond Pyramid (136°)", hb: lang === "tr" ? "WC Bilye (10mm)" : "WC Ball (10mm)" },
    { prop: lang === "tr" ? "Yük" : "Load", hrc: "150 kgf", hv: "1-120 kgf", hb: "3000 kgf" },
    { prop: lang === "tr" ? "Ölçüm" : "Measurement", hrc: lang === "tr" ? "İz derinliği" : "Indent depth", hv: lang === "tr" ? "İz köşegeni" : "Diagonal length", hb: lang === "tr" ? "İz çapı" : "Indent diameter" },
    { prop: lang === "tr" ? "Aralık" : "Range", hrc: "20-68 HRC", hv: "100-1000+ HV", hb: "80-450 HB" },
    { prop: lang === "tr" ? "Uygulama" : "Application", hrc: lang === "tr" ? "Sertleştirilmiş çelik" : "Hardened steels", hv: lang === "tr" ? "Tüm malzemeler" : "All materials", hb: lang === "tr" ? "Döküm, yumuşak çelik" : "Cast iron, soft steel" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-dark-300 font-medium"></th>
            <th className="text-center py-3 px-4 text-gold-400 font-semibold">Rockwell C</th>
            <th className="text-center py-3 px-4 text-gold-400 font-semibold">Vickers</th>
            <th className="text-center py-3 px-4 text-gold-400 font-semibold">Brinell</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.05]">
              <td className="py-3 px-4 text-dark-200 font-medium">{row.prop}</td>
              <td className="py-3 px-4 text-dark-100 text-center">{row.hrc}</td>
              <td className="py-3 px-4 text-dark-100 text-center">{row.hv}</td>
              <td className="py-3 px-4 text-dark-100 text-center">{row.hb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HardnessTestingArticle() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">
            {lang === "tr" ? "Bilgi Bankası" : "Knowledge Base"}
          </Link>
          <span>/</span>
          <span className="text-dark-100">
            {lang === "tr" ? "Sertlik Testleri" : "Hardness Testing"}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {lang === "tr"
            ? "Sertlik Testleri: Rockwell, Vickers ve Brinell"
            : "Hardness Testing: Rockwell, Vickers and Brinell"}
        </h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12">
          <span>🔧 {lang === "tr" ? "Test Yöntemleri" : "Testing Methods"}</span>
          <span>•</span>
          <span>{lang === "tr" ? "12 dk okuma" : "12 min read"}</span>
          <span>•</span>
          <span>ASTM E18, E92, E10</span>
        </div>

        {/* Introduction */}
        <div className="prose-dark">
          <p className="text-dark-200 text-base leading-relaxed mb-8">
            {lang === "tr"
              ? "Sertlik, bir malzemenin plastik deformasyona karşı gösterdiği dirençtir. Metalurjide en yaygın kullanılan mekanik özellik ölçümlerinden biridir çünkü hızlı, tahribatsız veya yarı-tahribatlı olarak uygulanabilir ve diğer mekanik özelliklerle (çekme dayanımı, aşınma direnci) korelasyon gösterir. Üç temel sertlik ölçüm yöntemi — Rockwell, Vickers ve Brinell — farklı uç geometrileri ve yükleme koşulları kullanarak malzemenin sertliğini belirler."
              : "Hardness is the resistance of a material to plastic deformation. It is one of the most commonly used mechanical property measurements in metallurgy because it can be applied quickly, non-destructively or semi-destructively, and correlates with other mechanical properties (tensile strength, wear resistance). Three fundamental hardness testing methods — Rockwell, Vickers, and Brinell — use different indenter geometries and loading conditions to determine material hardness."}
          </p>

          {/* Rockwell Section */}
          <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
            {lang === "tr" ? "1. Rockwell Sertlik Testi" : "1. Rockwell Hardness Test"}
          </h2>
          <p className="text-dark-200 text-base leading-relaxed mb-6">
            {lang === "tr"
              ? "Rockwell testi (ASTM E18), iz derinliği ölçümüne dayanır. Önce küçük bir ön yük (10 kgf) uygulanarak referans noktası belirlenir, ardından ana yük uygulanır. Yük kaldırıldıktan sonra kalan iz derinliği ölçülür ve doğrudan sertlik değerine çevrilir. En büyük avantajı hızlı olması ve optik ölçüm gerektirmemesidir."
              : "The Rockwell test (ASTM E18) is based on depth-of-indentation measurement. A minor load (10 kgf) is first applied to establish a reference point, followed by the major load. After the major load is removed, the remaining depth of penetration is measured and directly converted to a hardness value. Its greatest advantage is speed and no need for optical measurement."}
          </p>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
            <RockwellDiagram />
            <p className="text-xs text-dark-300 text-center mt-3 font-mono">
              {lang === "tr" ? "Şekil 1: Rockwell sertlik testi prensibi — elmas konik uç ve iz derinliği ölçümü" : "Figure 1: Rockwell hardness test principle — diamond cone indenter and depth measurement"}
            </p>
          </div>

          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8">
            <div className="text-sm font-semibold text-gold-400 mb-2">{lang === "tr" ? "Rockwell C (HRC) — Ölçek Detayı" : "Rockwell C (HRC) — Scale Details"}</div>
            <ul className="text-dark-200 text-sm space-y-1">
              <li>• {lang === "tr" ? "Uç: 120° elmas konik (Brale)" : "Indenter: 120° diamond cone (Brale)"}</li>
              <li>• {lang === "tr" ? "Ana yük: 150 kgf | Ön yük: 10 kgf" : "Major load: 150 kgf | Minor load: 10 kgf"}</li>
              <li>• {lang === "tr" ? "Geçerli aralık: 20-68 HRC" : "Valid range: 20-68 HRC"}</li>
              <li>• {lang === "tr" ? "Uygulama: Sertleştirilmiş çelikler, takım çelikleri, yataklar" : "Application: Hardened steels, tool steels, bearings"}</li>
              <li>• HRC = 100 − (h / 0.002mm)</li>
            </ul>
          </div>

          {/* Vickers Section */}
          <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
            {lang === "tr" ? "2. Vickers Sertlik Testi" : "2. Vickers Hardness Test"}
          </h2>
          <p className="text-dark-200 text-base leading-relaxed mb-6">
            {lang === "tr"
              ? "Vickers testi (ASTM E92 / ISO 6507), 136° açılı elmas piramit uç kullanır. İz köşegen uzunluğu optik mikroskop ile ölçülür. Vickers'ın en büyük avantajı tek bir ölçeğin tüm sertlik aralığını kapsamasıdır — yumuşak bakır alaşımlarından sert seramiklere kadar. Mikrosertlik (HV0.01 - HV1) ve makrosertlik (HV1 - HV120) olarak ikiye ayrılır."
              : "The Vickers test (ASTM E92 / ISO 6507) uses a 136° diamond pyramid indenter. The indent diagonal length is measured optically. The main advantage of Vickers is that a single scale covers the entire hardness range — from soft copper alloys to hard ceramics. It is divided into micro-hardness (HV0.01 - HV1) and macro-hardness (HV1 - HV120)."}
          </p>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
            <VickersDiagram />
            <p className="text-xs text-dark-300 text-center mt-3 font-mono">
              {lang === "tr" ? "Şekil 2: Vickers sertlik testi — piramit uç ve iz köşegen ölçümü (d₁, d₂)" : "Figure 2: Vickers hardness test — pyramid indenter and diagonal measurement (d₁, d₂)"}
            </p>
          </div>

          {/* Brinell Section */}
          <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
            {lang === "tr" ? "3. Brinell Sertlik Testi" : "3. Brinell Hardness Test"}
          </h2>
          <p className="text-dark-200 text-base leading-relaxed mb-6">
            {lang === "tr"
              ? "Brinell testi (ASTM E10), 10mm çapında tungsten karbür bilye ile 3000 kgf yük uygulayarak iz çapını ölçer. Kaba taneli malzemelerde (dökme demir, döküm çelik) güvenilir sonuçlar verir çünkü iz büyüktür ve lokal heterojenliklerden daha az etkilenir. Dezavantajı sert malzemelerde (<450 HB) bilye deformasyonudur."
              : "The Brinell test (ASTM E10) applies 3000 kgf through a 10mm tungsten carbide ball and measures the indent diameter. It provides reliable results in coarse-grained materials (cast iron, cast steel) because the large indent averages out local heterogeneities. The disadvantage is ball deformation in hard materials (<450 HB)."}
          </p>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
            <BrinellDiagram />
            <p className="text-xs text-dark-300 text-center mt-3 font-mono">
              {lang === "tr" ? "Şekil 3: Brinell sertlik testi — bilye uç ve iz çapı ölçümü" : "Figure 3: Brinell hardness test — ball indenter and indent diameter measurement"}
            </p>
          </div>

          {/* Comparison Table */}
          <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
            {lang === "tr" ? "4. Karşılaştırma Tablosu" : "4. Comparison Table"}
          </h2>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
            <ComparisonTable lang={lang} />
          </div>

          {/* ASTM E140 Conversion */}
          <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
            {lang === "tr" ? "5. ASTM E140 Dönüşüm" : "5. ASTM E140 Conversion"}
          </h2>
          <p className="text-dark-200 text-base leading-relaxed mb-6">
            {lang === "tr"
              ? "ASTM E140 standardı, farklı sertlik ölçekleri arasında yaklaşık dönüşüm tabloları sağlar. Bu dönüşümler ampirik verilere dayalıdır ve tüm malzeme grupları için geçerli değildir. Standart, karbon ve alaşımlı çelikler, östenitik paslanmaz çelikler ve nikel alaşımları için ayrı tablolar içerir. Dönüşüm değerleri yaklaşıktır — kesişim noktaları dışında ±2 HRC veya ±10 HV sapma olabilir."
              : "ASTM E140 provides approximate conversion tables between different hardness scales. These conversions are based on empirical data and are not valid for all material groups. The standard contains separate tables for carbon and alloy steels, austenitic stainless steels, and nickel alloys. Conversion values are approximate — deviations of ±2 HRC or ±10 HV may occur outside intersection points."}
          </p>

          <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8">
            <div className="text-sm font-semibold text-gold-400 mb-2">{lang === "tr" ? "Yaklaşık Çekme Dayanımı İlişkisi" : "Approximate Tensile Strength Relationship"}</div>
            <p className="text-dark-200 text-sm mb-2">
              {lang === "tr"
                ? "Karbonlu ve düşük alaşımlı çelikler için:"
                : "For carbon and low-alloy steels:"}
            </p>
            <div className="font-mono text-gold-400 text-sm space-y-1">
              <div>UTS (MPa) ≈ 3.45 × HB ({lang === "tr" ? "Brinell için" : "for Brinell"})</div>
              <div>UTS (MPa) ≈ 3.18 × HV ({lang === "tr" ? "Vickers için" : "for Vickers"})</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-3">
              {lang === "tr" ? "Hemen Sertlik Çevirici'yi Kullanın" : "Try the Hardness Converter Now"}
            </h3>
            <p className="text-dark-300 text-sm mb-4">
              {lang === "tr"
                ? "HRC, HRB, HV, HB ve çekme dayanımı arasında anında dönüşüm yapın — ücretsiz, kayıt gerektirmez."
                : "Instantly convert between HRC, HRB, HV, HB and tensile strength — free, no registration required."}
            </p>
            <Link href="/tools/hardness" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">
              {lang === "tr" ? "Sertlik Çevirici →" : "Hardness Converter →"}
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
