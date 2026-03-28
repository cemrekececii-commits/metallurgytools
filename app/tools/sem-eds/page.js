"use client";
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

// ─── X-RAY ENERGY DATABASE (keV) ───────────────────────
// Source: Bearden, J.A. (1967) Rev. Mod. Phys. 39, 78-124
// Covers Z=3 to Z=92 for common analytical lines
const XRAY_DB = {
  Li:{Ka:0.054},B:{Ka:0.183},C:{Ka:0.277},N:{Ka:0.392},O:{Ka:0.525},F:{Ka:0.677},
  Na:{Ka:1.041,Kb:1.071},Mg:{Ka:1.254,Kb:1.302},Al:{Ka:1.487,Kb:1.557},
  Si:{Ka:1.740,Kb:1.836},P:{Ka:2.013,Kb:2.139},S:{Ka:2.307,Kb:2.464},
  Cl:{Ka:2.622,Kb:2.816},Ar:{Ka:2.958,Kb:3.190},K:{Ka:3.314,Kb:3.590},
  Ca:{Ka:3.692,Kb:4.013},Sc:{Ka:4.091,Kb:4.461},Ti:{Ka:4.511,Kb:4.932},
  V:{Ka:4.952,Kb:5.427},Cr:{Ka:5.415,Kb:5.947},Mn:{Ka:5.899,Kb:6.490},
  Fe:{Ka:6.404,Kb:7.058},Co:{Ka:6.930,Kb:7.649},Ni:{Ka:7.478,Kb:8.265},
  Cu:{Ka:8.048,Kb:8.905},Zn:{Ka:8.639,Kb:9.572},Ga:{Ka:9.252,Kb:10.264},
  Ge:{Ka:9.886,Kb:10.982},As:{Ka:10.544,Kb:11.726},Se:{Ka:11.222,Kb:12.496},
  Br:{Ka:11.924,Kb:13.292},Kr:{Ka:12.649,Kb:14.112},Rb:{Ka:13.395,Kb:14.961},
  Sr:{Ka:14.165,Kb:15.836},Y:{Ka:14.958,Kb:16.738},Zr:{Ka:15.775,Kb:17.668},
  Nb:{Ka:16.615,Kb:18.623},Mo:{Ka:17.479,Kb:19.608,La:2.293,Lb:2.395},
  Ru:{Ka:19.279,La:2.559},Rh:{Ka:20.216,La:2.697},Pd:{Ka:21.177,La:2.838},
  Ag:{Ka:22.163,La:2.984,Lb:3.151},Cd:{Ka:23.174,La:3.133,Lb:3.316},
  In:{Ka:24.210,La:3.287,Lb:3.487},Sn:{Ka:25.271,La:3.444,Lb:3.663},
  Sb:{Ka:26.359,La:3.605,Lb:3.843},Te:{Ka:27.472,La:3.769,Lb:4.030},
  I:{Ka:28.612,La:3.938,Lb:4.221},Ba:{La:4.466,Lb:4.828,Ma:0.780},
  La:{La:4.651,Lb:5.042,Ma:0.833},Ce:{La:4.840,Lb:5.262,Ma:0.883},
  Pr:{La:5.034,Lb:5.489,Ma:0.929},Nd:{La:5.230,Lb:5.722,Ma:0.978},
  Sm:{La:5.636,Lb:6.206},Eu:{La:5.846,Lb:6.456},Gd:{La:6.057,Lb:6.714},
  Tb:{La:6.273,Lb:6.978},Dy:{La:6.495,Lb:7.248},Ho:{La:6.720,Lb:7.526},
  Er:{La:6.949,Lb:7.811},Tm:{La:7.180,Lb:8.101},Yb:{La:7.416,Lb:8.402},
  Lu:{La:7.655,Lb:8.709},Hf:{La:7.899,Lb:9.023,Ma:1.645},
  Ta:{La:8.146,Lb:9.343,Ma:1.710},W:{La:8.398,Lb:9.672,Ma:1.775},
  Re:{La:8.653,Lb:10.010},Os:{La:8.912,Lb:10.355},Ir:{La:9.175,Lb:10.708},
  Pt:{La:9.442,Lb:11.071},Au:{La:9.713,Lb:11.443,Ma:2.123},
  Hg:{La:9.989,Lb:11.824},Tl:{La:10.269,Lb:12.213},Pb:{La:10.552,Lb:12.614,Ma:2.346},
  Bi:{La:10.839,Lb:13.023,Ma:2.423},Th:{La:12.968,Lb:16.202,Ma:2.996},
  U:{La:13.614,Lb:17.220,Ma:3.171},
};

// ─── KNOWN CRITICAL OVERLAPS IN STEEL METALLURGY ───────
const KNOWN_OVERLAPS = [
  { pair: ["Mn","Cr"], lines: ["Mn Kα","Cr Kβ"], delta: 0.048, risk: "Critical", reason: "Mn Kα (5.899) ile Cr Kβ (5.947) arasında sadece 48 eV fark var. Çelik analizinde en sık karşılaşılan çakışma." },
  { pair: ["Fe","Mn"], lines: ["Fe Kα","Mn Kβ"], delta: 0.086, risk: "High", reason: "Fe Kα (6.404) ile Mn Kβ (6.490) yakın. Yüksek Fe matrisinde Mn tespiti zorlaşır." },
  { pair: ["S","Mo"], lines: ["S Kα","Mo Lα"], delta: 0.014, risk: "Critical", reason: "S Kα (2.307) ile Mo Lα (2.293) arasında sadece 14 eV fark. MnS inklüzyonu ile Mo karışabilir." },
  { pair: ["S","Pb"], lines: ["S Kα","Pb Mα"], delta: 0.039, risk: "Critical", reason: "S Kα (2.307) ile Pb Mα (2.346) yakın. Serbest işleme çeliklerinde S/Pb ayrımı kritik." },
  { pair: ["Ti","Ba"], lines: ["Ti Kα","Ba Lα"], delta: 0.045, risk: "High", reason: "Ti Kα (4.511) ile Ba Lα (4.466) yakın. TiN inklüzyonları yanlış tanımlanabilir." },
  { pair: ["Ti","N"], lines: ["Ti Kα","N Kα"], delta: 4.119, risk: "Low", reason: "Enerji farkı büyük ama TiN analizi bağlamında her ikisi birlikte değerlendirilmeli." },
  { pair: ["Mo","S"], lines: ["Mo Lβ","S Kβ"], delta: 0.069, risk: "High", reason: "Mo Lβ (2.395) ile S Kβ (2.464) yakın. Mo-S ayrımı için Kα/Lα oranları kontrol edilmeli." },
  { pair: ["Si","Sr"], lines: ["Si Kα","Sr Lα"], delta: 0.096, risk: "Moderate", reason: "Si Kα (1.740) bölgesinde Sr Lα pikinin etkisi. Cüruf analizinde dikkat." },
  { pair: ["Ni","Fe"], lines: ["Ni Lα","Fe Lα"], delta: 0.147, risk: "Moderate", reason: "Düşük enerjide Ni ve Fe L hatları çakışabilir." },
  { pair: ["Cr","V"], lines: ["Cr Kα","V Kβ"], delta: 0.012, risk: "Critical", reason: "Cr Kα (5.415) ile V Kβ (5.427) arasında sadece 12 eV. V-Cr ayrımı çok zor." },
  { pair: ["Ca","Sb"], lines: ["Ca Kα","Sb Lα"], delta: 0.087, risk: "Moderate", reason: "Ca Kα (3.692) ile Sb Lα (3.605) arası 87 eV. Cüruf/oksit analizinde karışabilir." },
  { pair: ["P","Zr"], lines: ["P Kα","Zr Lα"], delta: 0.068, risk: "Moderate", reason: "P Kα (2.013) bölgesinde Zr L hatları etkili olabilir." },
  { pair: ["As","Pb"], lines: ["As Kα","Pb Lα"], delta: 0.008, risk: "Critical", reason: "As Kα (10.544) ile Pb Lα (10.552) arasında sadece 8 eV. Tanım ayrımı neredeyse imkansız." },
  { pair: ["Cu","Zn"], lines: ["Cu Kβ","Zn Kα"], delta: 0.266, risk: "Low", reason: "Cu Kβ (8.905) ile Zn Kα (8.639) arası 266 eV. Modern detektörlerle ayrılabilir." },
  { pair: ["Al","Br"], lines: ["Al Kα","Br Lα"], delta: 0.093, risk: "Moderate", reason: "Al Kα (1.487) bölgesinde Br L hattı etkisi." },
  { pair: ["Nb","Mo"], lines: ["Nb Kα","Mo Kα"], delta: 0.864, risk: "Low", reason: "K hatları ayrılır ama Nb Lβ/Mo Lα çakışması dikkat gerektirir." },
];

// ─── METALLURGICAL CONTEXT RULES ────────────────────────
const CONTEXT_RULES = {
  "Mn-Cr": "Çelik matrisinde Mn ve Cr birlikte bulunması yaygındır. Mn Kα / Cr Kβ çakışması, özellikle düşük Cr içerikli çeliklerde (<%0.5 Cr) Cr varlığının yanlış pozitif tespitine yol açabilir. Ters olarak, yüksek Cr çeliklerinde (paslanmaz) Mn miktarı olduğundan yüksek hesaplanabilir.",
  "S-Mo": "MnS tipi sülfür inklüzyonlarında Mo Lα piki S Kα ile çakışır. Bu durum, Mo içermeyen çeliklerde bile inklüzyon analizinde 'Mo tespit edildi' şeklinde yanlış sonuç verebilir. Mutlaka Mo Kα (17.48 keV) hattı kontrol edilmelidir.",
  "S-Pb": "Serbest işleme çeliklerinde Pb ve S birlikte bulunabilir. Pb Mα / S Kα çakışması nedeniyle kantitatif analiz güvenilmez olabilir. WDS veya Pb Lα (10.55 keV) hattı ile doğrulama gerekir.",
  "Ti-Ba": "TiN inklüzyonlarında Ti Kα piki Ba Lα ile çakışır. Çelikte Ba beklenmez; Ba tespit ediliyorsa büyük olasılıkla Ti'dir. Ti Kβ (4.93 keV) doğrulama hattı olarak kullanılmalıdır.",
  "Cr-V": "V-Cr mikro alaşımlı çeliklerde Cr Kα / V Kβ çakışması kritiktir. V içeriği genellikle düşük olduğundan (%0.01-0.15) Cr piki altında kaybolabilir. V Kα (4.95 keV) ile doğrulama yapılmalıdır.",
  "As-Pb": "As ve Pb birlikte eski çeliklerde veya hurda bazlı üretimlerde bulunabilir. Kα/Lα çakışması nedeniyle ayrım neredeyse imkansızdır. WDS zorunludur.",
};

const COUNTERMEASURES = {
  "Critical": "1) WDS (Wavelength Dispersive Spectroscopy) ile doğrulama yapın\n2) Alternatif X-ray hatlarını kontrol edin (Kα yerine Kβ veya L/M hatları)\n3) Element haritalama (mapping) ile dağılım kontrolü yapın\n4) Deconvolution yazılımı kullanarak pik ayrıştırma uygulayın\n5) Standart referans numunelerle karşılaştırma yapın",
  "High": "1) Alternatif hatları kontrol edin\n2) Pik/arka plan oranını değerlendirin\n3) Element haritalama ile lokalizasyon kontrolü yapın\n4) Hızlandırma gerilimini optimize edin (daha düşük kV düşük enerjili pikleri iyileştirir)",
  "Moderate": "1) Pik şeklini ve simetrisini inceleyin (asimetri çakışma göstergesi)\n2) Birden fazla analiz noktasından ölçüm alın\n3) Kantitatif sonuçları dikkatle değerlendirin",
  "Low": "1) Modern SDD dedektörlerle yeterli çözünürlük sağlanabilir\n2) Rutin doğrulama yeterlidir",
};

// ─── OVERLAP FINDER ─────────────────────────────────────
function findOverlaps(targetEl, measuredKeV, tolerance = 0.12) {
  const overlaps = [];
  const targetData = XRAY_DB[targetEl];
  if (!targetData) return { overlaps: [], validation: { isValid: false, message: `${targetEl} veritabanında bulunamadı.` } };

  // Validate input
  const allEnergies = Object.values(targetData);
  const closest = allEnergies.reduce((min, e) => Math.abs(e - measuredKeV) < Math.abs(min - measuredKeV) ? e : min);
  if (Math.abs(closest - measuredKeV) > closest * 0.15) {
    return { overlaps: [], validation: { isValid: false, message: `${measuredKeV} keV değeri ${targetEl} elementinin bilinen hatlarıyla uyuşmuyor. En yakın hat: ${closest.toFixed(3)} keV.` } };
  }

  // Find all elements with lines near measuredKeV
  for (const [el, lines] of Object.entries(XRAY_DB)) {
    if (el === targetEl) continue;
    for (const [line, energy] of Object.entries(lines)) {
      const diff = Math.abs(energy - measuredKeV);
      if (diff <= tolerance) {
        let risk = "Low";
        let score = Math.max(0, Math.round((1 - diff / tolerance) * 100));
        if (diff <= 0.02) { risk = "Critical"; score = Math.max(score, 90); }
        else if (diff <= 0.05) { risk = "High"; score = Math.max(score, 70); }
        else if (diff <= 0.08) { risk = "Moderate"; score = Math.max(score, 40); }

        // Check known overlaps for boosted risk
        const known = KNOWN_OVERLAPS.find(k =>
          (k.pair.includes(targetEl) && k.pair.includes(el)) ||
          (k.pair[0] === el && k.pair[1] === targetEl) ||
          (k.pair[0] === targetEl && k.pair[1] === el)
        );
        let reason = `${el} ${line} (${energy.toFixed(3)} keV) ile ${targetEl} arasında ${(diff * 1000).toFixed(0)} eV fark.`;
        if (known) {
          risk = known.risk;
          reason = known.reason;
          if (known.risk === "Critical") score = Math.max(score, 95);
          else if (known.risk === "High") score = Math.max(score, 75);
        }

        overlaps.push({
          element: el, line: line.replace("a", "α").replace("b", "β"),
          referenceEnergy: energy, difference: energy - measuredKeV,
          riskLevel: risk, probabilityScore: score, probabilityReason: reason,
        });
      }
    }
  }

  overlaps.sort((a, b) => b.probabilityScore - a.probabilityScore);
  return { overlaps, validation: { isValid: true, message: "OK" } };
}

function getMetallurgicalContext(targetEl, overlaps) {
  const contexts = [];
  for (const ov of overlaps) {
    const key1 = `${targetEl}-${ov.element}`, key2 = `${ov.element}-${targetEl}`;
    if (CONTEXT_RULES[key1]) contexts.push(CONTEXT_RULES[key1]);
    else if (CONTEXT_RULES[key2]) contexts.push(CONTEXT_RULES[key2]);
  }
  if (!contexts.length) return "Bu element kombinasyonu için özel metalürjik bağlam bilgisi bulunmamaktadır. Genel EDS analiz prensiplerine göre değerlendirme yapılmalıdır.";
  return contexts.join("\n\n");
}

function getCountermeasures(overlaps) {
  const maxRisk = overlaps.reduce((max, o) => {
    const order = { Critical: 4, High: 3, Moderate: 2, Low: 1 };
    return (order[o.riskLevel] || 0) > (order[max] || 0) ? o.riskLevel : max;
  }, "Low");
  return COUNTERMEASURES[maxRisk] || COUNTERMEASURES["Low"];
}

// ─── Translations ───────────────────────────────────────
const RISK_TR = { Critical: "Kritik", High: "Yüksek", Moderate: "Orta", Low: "Düşük" };
const RISK_COLOR = { Critical: "bg-red-500/20 text-red-400 border-red-500/30", High: "bg-orange-500/20 text-orange-400 border-orange-500/30", Moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", Low: "bg-green-500/20 text-green-400 border-green-500/30" };
const scoreColor = (s) => s >= 80 ? "bg-red-500" : s >= 50 ? "bg-orange-500" : s >= 25 ? "bg-yellow-500" : "bg-green-500";

const ELEMENTS = Object.keys(XRAY_DB).sort();

const TR = {
  title: "SEM-EDS Pik Çakışma Analizörü", subtitle: "Statik X-ray enerji veritabanı ile pik çakışma tespiti — API bağımlılığı yok, anında sonuç.",
  element: "Hedef Element", energy: "Ölçülen Enerji (keV)", analyze: "Analiz Et", reset: "Sıfırla",
  report: "Çakışma Analiz Raporu", target: "Hedef", noOverlap: "±120 eV aralığında önemli bir çakışma bulunamadı.",
  warnings: "Metalürjik Uyarılar", metallurgical: "Metalürjik Bağlam", countermeasures: "Uzman Önlemleri",
  colElement: "Element / Pik", colLine: "X-ışını Hattı", colRef: "Ref. Enerji (keV)", colDelta: "ΔE (eV)", colProb: "Çakışma Riski",
  free: "ÜCRETSİZ", dbInfo: "Veritabanı: Z=3 (Li) → Z=92 (U) | Kα, Kβ, Lα, Lβ, Mα hatları",
  errInput: "Lütfen hem element hem enerji değeri giriniz.",
  inputError: "Hatalı Veri Girişi",
};
const EN = {
  title: "SEM-EDS Peak Overlap Analyzer", subtitle: "Static X-ray energy database for peak overlap detection — no API dependency, instant results.",
  element: "Target Element", energy: "Measured Energy (keV)", analyze: "Analyze", reset: "Reset",
  report: "Overlap Analysis Report", target: "Target", noOverlap: "No significant overlap found within ±120 eV.",
  warnings: "Metallurgical Warnings", metallurgical: "Metallurgical Context", countermeasures: "Expert Recommendations",
  colElement: "Element / Peak", colLine: "X-ray Line", colRef: "Ref. Energy (keV)", colDelta: "ΔE (eV)", colProb: "Overlap Risk",
  free: "FREE", dbInfo: "Database: Z=3 (Li) → Z=92 (U) | Kα, Kβ, Lα, Lβ, Mα lines",
  errInput: "Please enter both element and energy value.",
  inputError: "Invalid Input",
};

// ─── Main Component ─────────────────────────────────────
export default function SemEdsAnalyzer() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [element, setElement] = useState("");
  const [energy, setEnergy] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleReset = () => { setElement(""); setEnergy(""); setResult(null); setError(""); };

  const handleAnalyze = () => {
    if (!element || !energy) { setError(t.errInput); return; }
    setError("");
    const keV = parseFloat(energy);
    if (isNaN(keV) || keV <= 0) { setError("Geçerli bir enerji değeri giriniz."); return; }

    const { overlaps, validation } = findOverlaps(element.trim(), keV);

    if (!validation.isValid) {
      setResult({ validation, overlaps: [], context: "", countermeasures: "" });
      return;
    }

    const context = getMetallurgicalContext(element.trim(), overlaps);
    const counter = overlaps.length > 0 ? getCountermeasures(overlaps) : "";

    // Generate warnings from known overlaps
    const knownWarnings = [];
    for (const ov of overlaps) {
      const known = KNOWN_OVERLAPS.find(k => k.pair.includes(element.trim()) && k.pair.includes(ov.element));
      if (known && (known.risk === "Critical" || known.risk === "High")) {
        knownWarnings.push({ title: `${known.pair[0]} / ${known.pair[1]} Çakışması`, reason: known.reason, risk: known.risk });
      }
    }

    setResult({ validation, overlaps, context, countermeasures: counter, warnings: knownWarnings });
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">{"\ud83d\udd2c"} SEM-EDS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
          <p className="text-dark-300 text-sm">{t.subtitle}</p>
        </div>

        {/* Input */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
              <label className="text-xs text-dark-300 block mb-1.5 font-semibold uppercase tracking-wider">{t.element}</label>
              <input list="el-opts" value={element} onChange={e => setElement(e.target.value)}
                placeholder="Fe, Mn, Cr..." className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
              <datalist id="el-opts">{ELEMENTS.map(el => <option key={el} value={el} />)}</datalist>
            </div>
            <div>
              <label className="text-xs text-dark-300 block mb-1.5 font-semibold uppercase tracking-wider">{t.energy}</label>
              <input type="number" step="0.001" value={energy} onChange={e => setEnergy(e.target.value)}
                placeholder="5.899" className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAnalyze}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer font-sans bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800">{t.analyze}</button>
              <button onClick={handleReset}
                className="px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">{"\u21ba"}</button>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-dark-300 font-mono">{t.dbInfo}</div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              {"\u26a0"} {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Validation Error */}
            {!result.validation.isValid && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-5 rounded-r-xl flex items-start gap-3">
                <span className="text-2xl">{"\ud83d\udeab"}</span>
                <div>
                  <h3 className="text-lg font-bold text-red-400">{t.inputError}</h3>
                  <p className="text-red-300 text-sm mt-1">{result.validation.message}</p>
                </div>
              </div>
            )}

            {/* Overlap Table */}
            {result.validation.isValid && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-dark-50 flex items-center gap-2">{"\ud83d\udccb"} {t.report}</h2>
                  <span className="text-[10px] font-mono text-dark-300 bg-dark-800 px-2 py-0.5 rounded">{t.target}: {element} @ {energy} keV</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-dark-300 bg-dark-800">
                      <tr>
                        <th className="px-5 py-2.5">{t.colElement}</th>
                        <th className="px-5 py-2.5">{t.colLine}</th>
                        <th className="px-5 py-2.5">{t.colRef}</th>
                        <th className="px-5 py-2.5">{t.colDelta}</th>
                        <th className="px-5 py-2.5 w-56">{t.colProb}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.overlaps.map((ov, i) => (
                        <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="px-5 py-3">
                            <div className="font-medium text-dark-50">{ov.element}</div>
                            <span className={`text-[10px] mt-1 inline-flex px-1.5 py-0.5 rounded border ${RISK_COLOR[ov.riskLevel] || RISK_COLOR.Low}`}>
                              {RISK_TR[ov.riskLevel] || ov.riskLevel} Risk
                            </span>
                          </td>
                          <td className="px-5 py-3 text-dark-200">{ov.line}</td>
                          <td className="px-5 py-3 text-dark-300 font-mono">{ov.referenceEnergy.toFixed(3)}</td>
                          <td className="px-5 py-3 text-dark-300 font-mono">{(ov.difference * 1000).toFixed(0)} eV</td>
                          <td className="px-5 py-3">
                            <div className="flex justify-between text-xs mb-1"><span className="text-dark-200 font-medium">%{ov.probabilityScore}</span></div>
                            <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${scoreColor(ov.probabilityScore)}`} style={{ width: `${ov.probabilityScore}%` }} />
                            </div>
                            <p className="text-[11px] text-dark-300 mt-1">{ov.probabilityReason}</p>
                          </td>
                        </tr>
                      ))}
                      {!result.overlaps.length && (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-dark-300">{t.noOverlap}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.warnings?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">{"\u26a0"} {t.warnings}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
                      <h4 className="font-bold text-red-300 mb-2">{w.title}</h4>
                      <p className="text-dark-200 text-sm leading-relaxed">{w.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Context + Countermeasures */}
            {result.validation.isValid && result.overlaps.length > 0 && (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">{"\u2139\ufe0f"} {t.metallurgical}</h3>
                  <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{result.context}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">{"\u2705"} {t.countermeasures}</h3>
                  <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                    <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{result.countermeasures}</p>
                  </div>
                </div>
              </div>
            )}

            {/* References */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>{"\u2022"} Bearden, J.A. (1967) Rev. Mod. Phys. 39, 78-124 — X-ray Energies</div>
                <div>{"\u2022"} Goldstein et al. Scanning Electron Microscopy and X-Ray Microanalysis</div>
                <div>{"\u2022"} ASTM E1508 — Standard Guide for EDS Analysis</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
