"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";

const TR = {
  title: "Çekme Numunesi L₀ Hesaplayıcısı",
  subtitle: "EN ISO 6892-1 ve ASTM E8/E8M göre ölçüm uzunluğu, paralel uzunluk ve toplam uzunluk",
  badge: "EN ISO 6892-1 · ASTM E8/E8M",
  free: "ÜCRETSİZ",
  upgrade: "Yükselt →",
  inputTitle: "Numune Parametreleri",
  standard: "Standart",
  specimenType: "Numune Tipi",
  round: "Silindirik (Yuvarlak)",
  flat: "Dikdörtgen (Sac / Levha)",
  diameter: "Çap — d (mm)",
  width: "Genişlik — b (mm)",
  thickness: "Kalınlık — a (mm)",
  gaugeType: "Ölçüm Uzunluğu Tipi",
  proportional: "Orantılı — L₀ = 5.65√S₀",
  proportional_long: "Uzun Orantılı — L₀ = 11.3√S₀",
  fixed80: "Sabit — L₀ = 80 mm",
  fixed50: "Sabit — L₀ = 50 mm",
  calculate: "Hesapla",
  reset: "Sıfırla",
  resultsTitle: "Hesaplama Sonuçları",
  s0: "Kesit Alanı — S₀",
  l0: "Ölçüm Uzunluğu — L₀",
  lc: "Paralel Uzunluk — Lc",
  lt: "Tavsiye Edilen Toplam Uzunluk — Lt",
  lcNote: "Lc min. değeri",
  formulaTitle: "Kullanılan Formüller",
  diagramTitle: "Numune Şeması",
  notesTitle: "Uygulama Notları",
  warningTitle: "⚠ Dikkat",
  notes: [
    "L₀ işaretleme hassasiyeti ±0,5 mm olmalıdır (EN ISO 6892-1 Madde 7.1).",
    "Paralel uzunluk Lc, L₀ üzerinde hatasız olmalı; grip geçiş radyusu yeterli olmalıdır.",
    "Kopma noktası L₀ sınırının 1/4'ünden daha yakınsa uzama sonucu geçersizdir (ASTM E8 Note 6).",
    "Subsize numunelerde ölçek faktörü uygulanmaz — tam boyut numunesiyle eşdeğer L₀ korunur.",
    "IF çeliği ve yüksek n-değerli malzemelerde diffuse necking uzun Lc gerektirir.",
  ],
  warningText: "Bu araç standartlara göre hesaplama yapar; ancak makine kapasitesi, mandrel boyutu ve grip tipi nedeniyle pratik uzunluk kısıtlamaları oluşabilir. Nihai numune boyutları ilgili test standardı ile uyumlu olmalıdır.",
};

const EN = {
  title: "Tensile Specimen L₀ Calculator",
  subtitle: "Gauge length, parallel length and total length per EN ISO 6892-1 and ASTM E8/E8M",
  badge: "EN ISO 6892-1 · ASTM E8/E8M",
  free: "FREE",
  upgrade: "Upgrade →",
  inputTitle: "Specimen Parameters",
  standard: "Standard",
  specimenType: "Specimen Type",
  round: "Round (Cylindrical)",
  flat: "Flat (Sheet / Plate)",
  diameter: "Diameter — d (mm)",
  width: "Width — b (mm)",
  thickness: "Thickness — a (mm)",
  gaugeType: "Gauge Length Type",
  proportional: "Proportional — L₀ = 5.65√S₀",
  proportional_long: "Long Proportional — L₀ = 11.3√S₀",
  fixed80: "Fixed — L₀ = 80 mm",
  fixed50: "Fixed — L₀ = 50 mm",
  calculate: "Calculate",
  reset: "Reset",
  resultsTitle: "Calculation Results",
  s0: "Cross-Sectional Area — S₀",
  l0: "Gauge Length — L₀",
  lc: "Parallel Length — Lc",
  lt: "Recommended Total Length — Lt",
  lcNote: "Lc minimum value",
  formulaTitle: "Formulas Applied",
  diagramTitle: "Specimen Schematic",
  notesTitle: "Application Notes",
  warningTitle: "⚠ Note",
  notes: [
    "L₀ gauge marking precision should be ±0.5 mm (EN ISO 6892-1 Clause 7.1).",
    "Parallel length Lc must contain L₀ without error; transition radius to grip must be adequate.",
    "If fracture occurs within 1/4 of L₀ from the end, the elongation result is invalid (ASTM E8 Note 6).",
    "Scale factors are NOT applied to subsize specimens — equivalent L₀ proportions must be preserved.",
    "High n-value materials (IF steel, DP600) require longer Lc to accommodate diffuse necking.",
  ],
  warningText: "This tool performs calculations per standards; however, practical length constraints may arise from machine capacity, mandrel dimensions, and grip type. Final specimen dimensions must conform to the applicable test standard.",
};

function SpecimenSVG({ type, d, b, a, L0, Lc, Lt }) {
  const W = 520, H = 200;
  if (type === "round") {
    // Side view of round specimen (dogbone profile)
    const totalLen = Math.min(Lt || 160, 400);
    const scale = 380 / (totalLen || 160);
    const scaledLt = 380;
    const scaledLc = Lc * scale;
    const scaledL0 = L0 * scale;
    const scaledD = Math.min((d || 12) * scale * 2, 60);
    const gripD = scaledD * 1.6;
    const ox = 70, cy = H / 2;
    const lcStart = ox + (scaledLt - scaledLc) / 2;
    const l0Start = ox + (scaledLt - scaledL0) / 2;

    return (
      <svg width={W} height={H} className="w-full max-w-xl">
        {/* Grip left */}
        <rect x={ox} y={cy - gripD / 2} width={(scaledLt - scaledLc) / 2} height={gripD} rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
        {/* Parallel section */}
        <rect x={lcStart} y={cy - scaledD / 2} width={scaledLc} height={scaledD} rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        {/* Grip right */}
        <rect x={lcStart + scaledLc} y={cy - gripD / 2} width={(scaledLt - scaledLc) / 2} height={gripD} rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
        {/* L0 marker */}
        <line x1={l0Start} y1={cy - scaledD / 2 - 10} x2={l0Start + scaledL0} y2={cy - scaledD / 2 - 10} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={l0Start} y1={cy - scaledD / 2 - 14} x2={l0Start} y2={cy - scaledD / 2 - 6} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={l0Start + scaledL0} y1={cy - scaledD / 2 - 14} x2={l0Start + scaledL0} y2={cy - scaledD / 2 - 6} stroke="#fbbf24" strokeWidth="1.5" />
        <text x={(l0Start + l0Start + scaledL0) / 2} y={cy - scaledD / 2 - 18} textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace">L₀ = {L0 ? L0.toFixed(1) : "–"} mm</text>
        {/* Lc marker */}
        <line x1={lcStart} y1={cy + scaledD / 2 + 10} x2={lcStart + scaledLc} y2={cy + scaledD / 2 + 10} stroke="#60a5fa" strokeWidth="1.5" />
        <line x1={lcStart} y1={cy + scaledD / 2 + 6} x2={lcStart} y2={cy + scaledD / 2 + 14} stroke="#60a5fa" strokeWidth="1.5" />
        <line x1={lcStart + scaledLc} y1={cy + scaledD / 2 + 6} x2={lcStart + scaledLc} y2={cy + scaledD / 2 + 14} stroke="#60a5fa" strokeWidth="1.5" />
        <text x={(2 * lcStart + scaledLc) / 2} y={cy + scaledD / 2 + 26} textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="monospace">Lc = {Lc ? Lc.toFixed(1) : "–"} mm</text>
        {/* Lt total */}
        <line x1={ox} y1={cy + gripD / 2 + 14} x2={ox + scaledLt} y2={cy + gripD / 2 + 14} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,3" />
        <text x={ox + scaledLt / 2} y={cy + gripD / 2 + 26} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace">Lt ≈ {Lt ? Lt.toFixed(0) : "–"} mm</text>
        {/* d label */}
        <line x1={ox + scaledLt / 2 - 3} y1={cy - scaledD / 2} x2={ox + scaledLt / 2 - 3} y2={cy + scaledD / 2} stroke="#34d399" strokeWidth="1.5" />
        <text x={ox + scaledLt / 2 + 6} y={cy + 4} fill="#34d399" fontSize="10" fontFamily="monospace">d={d || "–"}mm</text>
      </svg>
    );
  } else {
    // Flat specimen
    const totalLen = Math.min(Lt || 200, 400);
    const scale = 380 / (totalLen || 200);
    const scaledLt = 380;
    const scaledLc = Lc * scale;
    const scaledL0 = L0 * scale;
    const scaledB = Math.min((b || 20) * scale * 1.5, 50);
    const gripB = scaledB * 1.8;
    const ox = 70, cy = H / 2;
    const lcStart = ox + (scaledLt - scaledLc) / 2;
    const l0Start = ox + (scaledLt - scaledL0) / 2;

    return (
      <svg width={W} height={H} className="w-full max-w-xl">
        <rect x={ox} y={cy - gripB / 2} width={(scaledLt - scaledLc) / 2} height={gripB} rx="3" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
        <rect x={lcStart} y={cy - scaledB / 2} width={scaledLc} height={scaledB} fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x={lcStart + scaledLc} y={cy - gripB / 2} width={(scaledLt - scaledLc) / 2} height={gripB} rx="3" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
        <line x1={l0Start} y1={cy - scaledB / 2 - 10} x2={l0Start + scaledL0} y2={cy - scaledB / 2 - 10} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={l0Start} y1={cy - scaledB / 2 - 14} x2={l0Start} y2={cy - scaledB / 2 - 6} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1={l0Start + scaledL0} y1={cy - scaledB / 2 - 14} x2={l0Start + scaledL0} y2={cy - scaledB / 2 - 6} stroke="#fbbf24" strokeWidth="1.5" />
        <text x={(l0Start + l0Start + scaledL0) / 2} y={cy - scaledB / 2 - 18} textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="monospace">L₀ = {L0 ? L0.toFixed(1) : "–"} mm</text>
        <line x1={lcStart} y1={cy + scaledB / 2 + 10} x2={lcStart + scaledLc} y2={cy + scaledB / 2 + 10} stroke="#60a5fa" strokeWidth="1.5" />
        <line x1={lcStart} y1={cy + scaledB / 2 + 6} x2={lcStart} y2={cy + scaledB / 2 + 14} stroke="#60a5fa" strokeWidth="1.5" />
        <line x1={lcStart + scaledLc} y1={cy + scaledB / 2 + 6} x2={lcStart + scaledLc} y2={cy + scaledB / 2 + 14} stroke="#60a5fa" strokeWidth="1.5" />
        <text x={(2 * lcStart + scaledLc) / 2} y={cy + scaledB / 2 + 26} textAnchor="middle" fill="#60a5fa" fontSize="11" fontFamily="monospace">Lc = {Lc ? Lc.toFixed(1) : "–"} mm</text>
        <line x1={ox} y1={cy + gripB / 2 + 14} x2={ox + scaledLt} y2={cy + gripB / 2 + 14} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,3" />
        <text x={ox + scaledLt / 2} y={cy + gripB / 2 + 26} textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace">Lt ≈ {Lt ? Lt.toFixed(0) : "–"} mm</text>
        <text x={ox + scaledLt / 2 + 6} y={cy + 4} fill="#34d399" fontSize="10" fontFamily="monospace">b={b || "–"}mm</text>
      </svg>
    );
  }
}

function calculate({ standard, type, d, b, a, gaugeType }) {
  let S0, L0, Lc, Lt, formulaL0, formulaLc;

  if (type === "round") {
    S0 = Math.PI * (d ** 2) / 4;
    if (standard === "EN") {
      L0 = gaugeType === "long" ? 11.3 * Math.sqrt(S0) : 5.65 * Math.sqrt(S0);
      formulaL0 = gaugeType === "long" ? "L₀ = 11.3 × √S₀" : "L₀ = 5.65 × √S₀  (= 5d)";
      Lc = L0 + d;
      formulaLc = "Lc ≥ L₀ + d";
      Lt = Lc + 4 * d;
    } else {
      // ASTM E8: L0 = 4d, fixed
      L0 = 4 * d;
      formulaL0 = "L₀ = 4d (ASTM E8/E8M)";
      Lc = L0 + d / 2;
      formulaLc = "Lc ≥ L₀ + d/2";
      Lt = Lc + 4 * d;
    }
  } else {
    // Flat
    S0 = b * a;
    if (standard === "EN") {
      if (gaugeType === "proportional") {
        L0 = 5.65 * Math.sqrt(S0);
        formulaL0 = "L₀ = 5.65 × √S₀";
      } else if (gaugeType === "long") {
        L0 = 11.3 * Math.sqrt(S0);
        formulaL0 = "L₀ = 11.3 × √S₀ (uzun orantılı)";
      } else if (gaugeType === "fixed80") {
        L0 = 80;
        formulaL0 = "L₀ = 80 mm (sabit, EN ISO 6892-1)";
      } else {
        L0 = 50;
        formulaL0 = "L₀ = 50 mm (sabit)";
      }
      Lc = L0 + b;
      formulaLc = "Lc ≥ L₀ + b";
      Lt = Lc + 2 * b;
    } else {
      // ASTM E8 flat: common sizes
      if (gaugeType === "fixed50") {
        L0 = 50;
        formulaL0 = "L₀ = 50 mm (ASTM E8 sheet-type)";
      } else if (gaugeType === "fixed200") {
        L0 = 200;
        formulaL0 = "L₀ = 200 mm (ASTM E8 plate-type)";
      } else {
        L0 = 5.65 * Math.sqrt(S0);
        formulaL0 = "L₀ = 5.65 × √S₀ (proportional)";
      }
      Lc = L0 + b / 2;
      formulaLc = "Lc ≥ L₀ + b/2";
      Lt = Lc + 2 * b;
    }
  }

  return { S0, L0, Lc, Lt, formulaL0, formulaLc };
}

export default function TensileSpecimenPage() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [standard, setStandard] = useState("EN");
  const [type, setType] = useState("round");
  const [d, setD] = useState(12.5);
  const [b, setB] = useState(20);
  const [a, setA] = useState(6);
  const [gaugeType, setGaugeType] = useState("proportional");
  const [results, setResults] = useState(null);

  const gaugeOptions = useMemo(() => {
    if (type === "round") {
      return standard === "EN"
        ? [{ v: "proportional", label: t.proportional }, { v: "long", label: t.proportional_long }]
        : [{ v: "proportional", label: "L₀ = 4d (ASTM E8)" }];
    } else {
      return standard === "EN"
        ? [
            { v: "proportional", label: t.proportional },
            { v: "long", label: t.proportional_long },
            { v: "fixed80", label: t.fixed80 },
          ]
        : [
            { v: "fixed50", label: "L₀ = 50 mm — Sheet type (ASTM E8)" },
            { v: "fixed200", label: "L₀ = 200 mm — Plate type (ASTM E8)" },
            { v: "proportional", label: "L₀ = 5.65√S₀ — Proportional" },
          ];
    }
  }, [type, standard, lang]);

  const handleCalculate = () => {
    const inputs = { standard, type, d: +d, b: +b, a: +a, gaugeType };
    const res = calculate(inputs);
    setResults(res);
  };

  const handleReset = () => {
    setResults(null);
    setD(12.5); setB(20); setA(6);
    setStandard("EN"); setType("round"); setGaugeType("proportional");
  };

  const handleExport = () => {
    if (!results) return;
    const lines = [
      "TENSILE SPECIMEN Lo CALCULATOR — MetallurgyTools",
      "=".repeat(50),
      `Standard: ${standard === "EN" ? "EN ISO 6892-1" : "ASTM E8/E8M"}`,
      `Specimen Type: ${type === "round" ? "Round" : "Flat"}`,
      type === "round" ? `Diameter d: ${d} mm` : `Width b: ${b} mm  |  Thickness a: ${a} mm`,
      `Gauge Length Type: ${gaugeType}`,
      "",
      "RESULTS:",
      `  S₀ (Cross-Section): ${results.S0.toFixed(2)} mm²`,
      `  L₀ (Gauge Length):  ${results.L0.toFixed(2)} mm`,
      `  Lc (Parallel Length, min): ${results.Lc.toFixed(2)} mm`,
      `  Lt (Recommended Total): ${results.Lt.toFixed(0)} mm`,
      "",
      "FORMULAS:",
      `  ${results.formulaL0}`,
      `  ${results.formulaLc}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement("a");
    a2.href = url; a2.download = "tensile-specimen-lo.txt";
    document.body.appendChild(a2); a2.click();
    document.body.removeChild(a2); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">↕</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
          <Link href="/pricing" className="text-gold-400 text-sm no-underline hover:underline">{t.upgrade}</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-2">{t.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 mb-8">
          <span>✓</span> {t.badge}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Inputs ── */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gold-400">{t.inputTitle}</h2>

            {/* Standard */}
            <div>
              <label className="text-xs font-medium text-dark-300 mb-2 block">{t.standard}</label>
              <div className="flex gap-2">
                {[{ v: "EN", label: "EN ISO 6892-1" }, { v: "ASTM", label: "ASTM E8/E8M" }].map(({ v, label }) => (
                  <button key={v} onClick={() => { setStandard(v); setResults(null); setGaugeType("proportional"); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer font-sans transition-all ${standard === v ? "bg-gold-400/20 border-gold-400/40 text-gold-400" : "bg-white/[0.03] border-white/[0.08] text-dark-300 hover:border-white/20"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen type */}
            <div>
              <label className="text-xs font-medium text-dark-300 mb-2 block">{t.specimenType}</label>
              <div className="flex gap-2">
                {[{ v: "round", label: t.round, icon: "◯" }, { v: "flat", label: t.flat, icon: "▬" }].map(({ v, label, icon }) => (
                  <button key={v} onClick={() => { setType(v); setResults(null); setGaugeType("proportional"); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer font-sans transition-all flex items-center justify-center gap-2 ${type === v ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-white/[0.03] border-white/[0.08] text-dark-300 hover:border-white/20"}`}>
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div>
              {type === "round" ? (
                <div>
                  <label className="text-xs font-medium text-dark-300 mb-2 block">{t.diameter}</label>
                  <input type="number" step="0.5" min="1" max="50" value={d}
                    onChange={(e) => { setD(e.target.value); setResults(null); }}
                    className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400" />
                  <p className="text-xs text-dark-400 mt-1">
                    {lang === "tr" ? "Yaygın: 6, 8, 10, 12.5, 14 mm (EN 6892-1 Annex B)" : "Common: 6, 8, 10, 12.5, 14 mm (EN 6892-1 Annex B)"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-dark-300 mb-2 block">{t.width}</label>
                    <input type="number" step="0.5" min="5" max="100" value={b}
                      onChange={(e) => { setB(e.target.value); setResults(null); }}
                      className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark-300 mb-2 block">{t.thickness}</label>
                    <input type="number" step="0.1" min="0.5" max="50" value={a}
                      onChange={(e) => { setA(e.target.value); setResults(null); }}
                      className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Gauge type */}
            <div>
              <label className="text-xs font-medium text-dark-300 mb-2 block">{t.gaugeType}</label>
              <select value={gaugeType} onChange={(e) => { setGaugeType(e.target.value); setResults(null); }}
                className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400">
                {gaugeOptions.map(({ v, label }) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button onClick={handleCalculate}
                className="flex-1 bg-gold-400/20 text-gold-400 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gold-400/30 cursor-pointer hover:bg-gold-400/30 font-sans">
                {t.calculate}
              </button>
              <button onClick={handleReset}
                className="flex-1 bg-white/[0.05] text-dark-300 px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/[0.08] cursor-pointer hover:bg-white/[0.08] font-sans">
                {t.reset}
              </button>
            </div>
            {results && (
              <button onClick={handleExport}
                className="w-full bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 font-sans">
                {lang === "tr" ? "TXT Rapor İndir" : "Download TXT Report"}
              </button>
            )}
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Numbers */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gold-400 mb-5">{t.resultsTitle}</h2>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: t.s0, val: `${results.S0.toFixed(2)} mm²`, color: "text-dark-50" },
                      { label: t.l0, val: `${results.L0.toFixed(2)} mm`, color: "text-yellow-400" },
                      { label: `${t.lc} (${t.lcNote})`, val: `${results.Lc.toFixed(2)} mm`, color: "text-blue-400" },
                      { label: t.lt, val: `${results.Lt.toFixed(0)} mm`, color: "text-dark-300" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="bg-dark-800 rounded-lg p-3">
                        <div className="text-xs text-dark-400 mb-1 leading-tight">{label}</div>
                        <div className={`font-mono font-bold text-lg ${color}`}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Formulas used */}
                  <div className="bg-dark-800/60 border border-white/[0.05] rounded-lg p-3">
                    <p className="text-xs text-dark-400 mb-2 font-semibold uppercase tracking-wider">{t.formulaTitle}</p>
                    <p className="font-mono text-xs text-blue-300 mb-1">{results.formulaL0}</p>
                    <p className="font-mono text-xs text-blue-300">{results.formulaLc}</p>
                    <p className="font-mono text-xs text-dark-400 mt-1">S₀ = {results.S0.toFixed(2)} mm²  →  √S₀ = {Math.sqrt(results.S0).toFixed(3)} mm</p>
                  </div>
                </div>

                {/* Diagram */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                  <h2 className="text-sm font-semibold text-dark-300 mb-4">{t.diagramTitle}</h2>
                  <SpecimenSVG type={type} d={+d} b={+b} a={+a} L0={results.L0} Lc={results.Lc} Lt={results.Lt} />
                  <div className="flex gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-yellow-400" /><span className="text-xs text-dark-400">L₀</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-400" /><span className="text-xs text-dark-400">Lc</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-px bg-dark-300" style={{ borderTop: "1px dashed" }} /><span className="text-xs text-dark-400">Lt</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-400" /><span className="text-xs text-dark-400">{type === "round" ? "d" : "b"}</span></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-48">
                <span className="text-4xl mb-3">↕</span>
                <p className="text-dark-300 text-sm">
                  {lang === "tr"
                    ? "Numune boyutlarını girin ve Hesapla'ya tıklayın."
                    : "Enter specimen dimensions and click Calculate."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-dark-100 mb-4">{t.notesTitle}</h3>
            <ul className="space-y-2">
              {t.notes.map((note, i) => (
                <li key={i} className="flex gap-2 text-xs text-dark-300 leading-relaxed">
                  <span className="text-gold-400 mt-0.5 shrink-0">·</span>{note}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-orange-400 mb-3">{t.warningTitle}</h3>
            <p className="text-xs text-dark-200 leading-relaxed">{t.warningText}</p>

            {/* Quick reference table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-dark-400 border-b border-white/[0.06]">
                    <th className="text-left py-1 pr-3">{lang === "tr" ? "d (mm)" : "d (mm)"}</th>
                    <th className="text-left py-1 pr-3">S₀ (mm²)</th>
                    <th className="text-left py-1 pr-3">L₀ EN (mm)</th>
                    <th className="text-left py-1">L₀ ASTM (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[6, 8, 10, 12.5, 14, 20].map((dv) => {
                    const s = Math.PI * dv ** 2 / 4;
                    return (
                      <tr key={dv} className="border-b border-white/[0.04] text-dark-300">
                        <td className="py-1 pr-3 text-blue-400">{dv}</td>
                        <td className="py-1 pr-3">{s.toFixed(1)}</td>
                        <td className="py-1 pr-3 text-yellow-400">{(5 * dv).toFixed(1)}</td>
                        <td className="py-1 text-green-400">{(4 * dv).toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        
          {/* How-to Briefing */}
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Standart Seç", desc: "EN ISO 6892-1 veya ASTM E8/E8M standardını seç." },
              { icon: "②", color: "#f59e0b", title: "Numune Tipini Belirle", desc: "Yuvarlak (silindirik) veya yassı (dikdörtgen kesitli) numune tipini seç." },
              { icon: "③", color: "#8b5cf6", title: "Boyutları Gir", desc: "Çap veya genişlik/kalınlık değerlerini mm olarak gir." },
              { icon: "④", color: "#10b981", title: "Sonuçları Oku", desc: "L₀ (ölçüm uzunluğu), Lc (paralel uzunluk), Lt (toplam uzunluk) ve S₀ (kesit alanı) hesaplanır." }]
              : [{ icon: "①", color: "#3b82f6", title: "Select Standard", desc: "Choose between EN ISO 6892-1 or ASTM E8/E8M standard." },
              { icon: "②", color: "#f59e0b", title: "Select Specimen Type", desc: "Choose round (cylindrical) or flat (rectangular cross-section) specimen type." },
              { icon: "③", color: "#8b5cf6", title: "Enter Dimensions", desc: "Input diameter or width/thickness values in mm." },
              { icon: "④", color: "#10b981", title: "Read Results", desc: "L₀ (gauge length), Lc (parallel length), Lt (total length) and S₀ (cross-section area) are computed." }]
            }
            formulas={[{ label: "L₀ = k × √S₀ (k=5.65)", color: "#60a5fa" }, { label: "EN ISO 6892-1:2016", color: "#34d399" }, { label: "ASTM E8/E8M-22", color: "#a78bfa" }]}
          />

<div className="mt-6 text-center">
          <p className="text-xs text-dark-400 font-mono">
            {lang === "tr"
              ? "MetallurgyTools · EN ISO 6892-1:2016 · ASTM E8/E8M-22"
              : "MetallurgyTools · EN ISO 6892-1:2016 · ASTM E8/E8M-22"}
          </p>
        </div>
      </div>
    </div>
  );
}
