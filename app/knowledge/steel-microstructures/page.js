"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

function MicrostructureSVG() {
  return (
    <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
      {/* Ferrite */}
      <rect x="10" y="20" width="130" height="130" rx="8" fill="#1F2937" stroke="#374151" />
      <circle cx="75" cy="70" r="25" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
      <circle cx="50" cy="95" r="20" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="18" fill="none" stroke="#60A5FA" strokeWidth="1.5" />
      <text x="75" y="165" textAnchor="middle" fill="#60A5FA" fontSize="11" fontWeight="600">Ferrit (α)</text>
      <text x="75" y="180" textAnchor="middle" fill="#6B7280" fontSize="9">~80-200 HV</text>
      {/* Pearlite */}
      <rect x="160" y="20" width="130" height="130" rx="8" fill="#1F2937" stroke="#374151" />
      {[30,40,50,60,70,80,90,100,110].map((y,i) => (<line key={i} x1="175" y1={y} x2="275" y2={y} stroke={i%2===0?"#D4AF37":"#60A5FA"} strokeWidth="1.5" />))}
      <text x="225" y="165" textAnchor="middle" fill="#D4AF37" fontSize="11" fontWeight="600">Perlit (α+Fe₃C)</text>
      <text x="225" y="180" textAnchor="middle" fill="#6B7280" fontSize="9">~200-300 HV</text>
      {/* Bainite */}
      <rect x="310" y="20" width="130" height="130" rx="8" fill="#1F2937" stroke="#374151" />
      {[0,1,2,3,4,5,6,7].map((i) => (<line key={i} x1={325+i*15} y1="35" x2={335+i*8} y2="135" stroke="#10B981" strokeWidth="1.5" />))}
      <text x="375" y="165" textAnchor="middle" fill="#10B981" fontSize="11" fontWeight="600">Beynit</text>
      <text x="375" y="180" textAnchor="middle" fill="#6B7280" fontSize="9">~300-550 HV</text>
      {/* Martensite */}
      <rect x="460" y="20" width="130" height="130" rx="8" fill="#1F2937" stroke="#374151" />
      {[0,1,2,3,4,5].map((i) => (<><line key={`a${i}`} x1={475+i*20} y1={30+i*5} x2={490+i*15} y2={140-i*8} stroke="#EF4444" strokeWidth="1.5" /><line key={`b${i}`} x1={480+i*18} y1={140-i*10} x2={570-i*12} y2={40+i*12} stroke="#EF4444" strokeWidth="1" /></>))}
      <text x="525" y="165" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="600">Martenzit</text>
      <text x="525" y="180" textAnchor="middle" fill="#6B7280" fontSize="9">~550-700+ HV</text>
    </svg>
  );
}

export default function SteelMicrostructures() {
  const { lang } = useLang();
  const tr = lang === "tr";

  const phases = [
    { name: "Ferrit (α)", color: "text-blue-400", hv: "80-200 HV", structure: "BCC",
      descTR: "Saf demirin oda sıcaklığındaki kararlı fazı. Düşük karbon çözünürlüğü (%0.022 maks). Yumuşak, sünek ve manyetik. Eş eksenli taneler halinde bulunur. Çekme dayanımı düşük (~280 MPa) ancak tokluk yüksektir.",
      descEN: "Stable phase of pure iron at room temperature. Low carbon solubility (0.022% max). Soft, ductile and magnetic. Found as equiaxed grains. Low tensile strength (~280 MPa) but high toughness." },
    { name: "Perlit (α + Fe₃C)", color: "text-gold-400", hv: "200-300 HV", structure: "Lamellar",
      descTR: "Ferrit ve sementit lamelllerinin ötektoid karışımı. 727°C'de östenitin eş zamanlı dönüşümüyle oluşur. Lameller arası mesafe soğuma hızına bağlıdır — hızlı soğuma ince perlit (daha sert), yavaş soğuma kaba perlit (daha yumuşak) verir.",
      descEN: "Eutectoid mixture of ferrite and cementite lamellae. Forms by simultaneous transformation of austenite at 727°C. Inter-lamellar spacing depends on cooling rate — fast cooling gives fine pearlite (harder), slow cooling gives coarse pearlite (softer)." },
    { name: "Beynit", color: "text-emerald-400", hv: "300-550 HV", structure: "Acicular",
      descTR: "Östenitin orta sıcaklıklarda (250-550°C) difüzyonla kontrollü dönüşüm ürünü. Üst beynit (iğnemsi ferrit + karbürler) ve alt beynit (plaka ferrit + ince karbürler) olmak üzere ikiye ayrılır. Perlitten sert, martenzitten tok.",
      descEN: "Diffusion-controlled transformation product of austenite at intermediate temperatures (250-550°C). Divided into upper bainite (acicular ferrite + carbides) and lower bainite (plate ferrite + fine carbides). Harder than pearlite, tougher than martensite." },
    { name: "Martenzit", color: "text-red-400", hv: "550-700+ HV", structure: "BCT",
      descTR: "Östenitin hızlı soğumasıyla (su verme) oluşan difüzyonsuz dönüşüm ürünü. BCT (gövde merkezli tetragonal) yapıda. Çok sert ve gevrek. Karbon atomları kafes içinde hapsolur ve katı çözelti sertleşmesi yaratır. Menevişle tokluğu artırılır.",
      descEN: "Diffusionless transformation product formed by rapid cooling (quenching) of austenite. BCT (body-centered tetragonal) structure. Very hard and brittle. Carbon atoms are trapped in the lattice creating solid solution strengthening. Tempering improves toughness." },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="flex items-center gap-2 text-sm text-dark-300 mb-8">
          <Link href="/knowledge" className="hover:text-gold-400 no-underline text-dark-300">{tr ? "Bilgi Bankası" : "Knowledge Base"}</Link>
          <span>/</span><span className="text-dark-100">{tr ? "Çelik Mikroyapıları" : "Steel Microstructures"}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {tr ? "Çelik Mikroyapıları: Ferrit, Perlit, Beynit, Martenzit" : "Steel Microstructures: Ferrite, Pearlite, Bainite, Martensite"}
        </h1>
        <div className="flex items-center gap-4 text-sm text-dark-300 mb-12">
          <span>🔬 {tr ? "Metalografi" : "Metallography"}</span><span>•</span><span>{tr ? "15 dk okuma" : "15 min read"}</span>
        </div>

        <p className="text-dark-200 text-base leading-relaxed mb-8">
          {tr ? "Çeliklerin mekanik özellikleri doğrudan mikroyapılarıyla belirlenir. Östenitin soğuma hızına ve alaşım bileşimine bağlı olarak farklı fazlar oluşur. Bu fazların morfolojisi, dağılımı ve hacim fraksiyonu; sertlik, dayanım, tokluk ve sünekliği kontrol eder."
             : "The mechanical properties of steels are directly determined by their microstructures. Different phases form depending on the cooling rate of austenite and alloy composition. The morphology, distribution, and volume fraction of these phases control hardness, strength, toughness, and ductility."}
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-10">
          <MicrostructureSVG />
          <p className="text-xs text-dark-300 text-center mt-3 font-mono">
            {tr ? "Şekil 1: Temel çelik mikroyapıları — şematik gösterim ve sertlik aralıkları" : "Figure 1: Fundamental steel microstructures — schematic representation and hardness ranges"}
          </p>
        </div>

        {phases.map((phase, i) => (
          <div key={i} className="mb-8">
            <h2 className={`text-2xl font-bold ${phase.color} mb-3`}>{i + 1}. {phase.name}</h2>
            <div className="flex gap-4 mb-3 text-xs">
              <span className="bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1 text-dark-200">{phase.hv}</span>
              <span className="bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1 text-dark-200">{phase.structure}</span>
            </div>
            <p className="text-dark-200 text-base leading-relaxed">
              {tr ? phase.descTR : phase.descEN}
            </p>
          </div>
        ))}

        <h2 className="text-2xl font-bold text-gold-400 mb-4 mt-12">
          {tr ? "Soğuma Hızı ve Mikroyapı İlişkisi" : "Cooling Rate and Microstructure Relationship"}
        </h2>
        <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-5 mb-8">
          <div className="space-y-2 text-sm text-dark-200">
            <div>🐌 {tr ? "Çok yavaş soğuma (fırında):" : "Very slow cooling (furnace):"} <span className="text-blue-400">Kaba ferrit + kaba perlit</span></div>
            <div>🚶 {tr ? "Yavaş soğuma (havada):" : "Slow cooling (air):"} <span className="text-gold-400">İnce ferrit + ince perlit</span></div>
            <div>🏃 {tr ? "Orta hızda soğuma (yağda):" : "Medium cooling (oil):"} <span className="text-emerald-400">Beynit</span></div>
            <div>⚡ {tr ? "Çok hızlı soğuma (suda):" : "Very fast cooling (water):"} <span className="text-red-400">Martenzit</span></div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">{tr ? "İlgili Araçlar" : "Related Tools"}</h3>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/tools/hardness" className="bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-5 py-2 text-sm font-semibold no-underline">{tr ? "Sertlik Çevirici →" : "Hardness Converter →"}</Link>
            <Link href="/knowledge/fe-c-phase-diagram" className="border border-white/15 text-dark-50 rounded-lg px-5 py-2 text-sm font-medium no-underline hover:border-gold-400/40">{tr ? "Fe-C Faz Diyagramı →" : "Fe-C Phase Diagram →"}</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
