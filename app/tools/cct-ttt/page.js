"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const TR = {
  title: "CCT/TTT Diyagramı Yorumlayıcısı",
  subtitle: "Soğuma hızı analizi, kritik sıcaklıklar, faz dönüşümleri ve mikro yapı tahmini",
  badge: "Ampirik Formüller | Eğitim & Mühendislik",
  inputTitle: "Girdi Parametreleri",
  composition: "Kimyasal Bileşim (ağ.%)",
  steelGrade: "Çelik Standardı",
  custom: "Özel",
  ausTemp: "Östenitizasyon Sıcaklığı (°C)",
  ausGrain: "Önceki Östenit Tane Boyutu (ASTM)",
  coolingRate: "Soğuma Hızı (°C/s)",
  calculate: "Hesapla",
  reset: "Sıfırla",
  results: "Sonuçlar",
  criticalTemps: "Kritik Sıcaklıklar",
  ae3: "Ae3",
  ae1: "Ae1",
  ms: "Ms (Martensite Start)",
  mf: "Mf (Martensite Finish)",
  bs: "Bs (Bainite Start)",
  bf: "Bf (Bainite Finish)",
  microstructure: "Tahmini Mikroyapı",
  phaseComposition: "Faz Bileşimi",
  ferrite: "Ferrit",
  pearlite: "Perlit",
  bainite: "Bainit",
  martensite: "Martensit",
  hardness: "Sertlik",
  estimatedHV: "Tahmini HV",
  notes: "Metalurjik Notlar",
  warning: "⚠ Uyarı",
  warningText: "Bu araç ampirik formüller ve basitleştirilmiş dönüşüm modelleri kullanır. Gerçek sonuçlar alaşım sistemi, çekirdekleme koşulları ve soğutma ortamı bağlı olarak değişebilir. Denge koşulları varsayılmaktadır; gerçek mikroyapılar soğuma kinetiklerine taraf dır.",
  export: "TXT Rapor İndir",
  free: "ÜCRETSİZ",
  upgrade: "Yükselt →",
  wantMore: "Daha fazla araç mı istiyorsunuz?",
  viewPlans: "Planları İncele →",
};

const EN = {
  title: "CCT/TTT Diagram Interpreter",
  subtitle: "Cooling rate analysis, critical temperatures, phase transformations, and microstructure prediction",
  badge: "Empirical Formulas | Education & Engineering",
  inputTitle: "Input Parameters",
  composition: "Chemical Composition (wt%)",
  steelGrade: "Steel Grade",
  custom: "Custom",
  ausTemp: "Austenitizing Temperature (°C)",
  ausGrain: "Prior Austenite Grain Size (ASTM)",
  coolingRate: "Cooling Rate (°C/s)",
  calculate: "Calculate",
  reset: "Reset",
  results: "Results",
  criticalTemps: "Critical Temperatures",
  ae3: "Ae3",
  ae1: "Ae1",
  ms: "Ms (Martensite Start)",
  mf: "Mf (Martensite Finish)",
  bs: "Bs (Bainite Start)",
  bf: "Bf (Bainite Finish)",
  microstructure: "Predicted Microstructure",
  phaseComposition: "Phase Composition",
  ferrite: "Ferrite",
  pearlite: "Pearlite",
  bainite: "Bainite",
  martensite: "Martensite",
  hardness: "Hardness",
  estimatedHV: "Estimated HV",
  notes: "Metallurgical Notes",
  warning: "⚠ Warning",
  warningText: "This tool uses empirical formulas and simplified transformation models. Real outcomes vary with alloy system, nucleation conditions, and cooling medium. Equilibrium conditions assumed; actual microstructures depend on cooling kinetics.",
  export: "Download TXT Report",
  free: "FREE",
  upgrade: "Upgrade →",
  wantMore: "Want more tools?",
  viewPlans: "View Plans →",
};

const STEEL_PRESETS = {
  "Custom": { C: 0.4, Si: 0.2, Mn: 0.7, Ni: 0, Cr: 0, Mo: 0, V: 0, Cu: 0, Nb: 0, Al: 0, N: 0, B: 0 },
  "S355J2": { C: 0.2, Si: 0.4, Mn: 1.2, Ni: 0.05, Cr: 0.05, Mo: 0, V: 0, Cu: 0.2, Nb: 0, Al: 0.03, N: 0.01, B: 0 },
  "API 5L X65": { C: 0.24, Si: 0.3, Mn: 1.4, Ni: 0.1, Cr: 0.05, Mo: 0.05, V: 0, Cu: 0.15, Nb: 0.04, Al: 0.02, N: 0.008, B: 0 },
  "API 5L X70": { C: 0.27, Si: 0.35, Mn: 1.6, Ni: 0.15, Cr: 0.08, Mo: 0.08, V: 0, Cu: 0.2, Nb: 0.05, Al: 0.025, N: 0.01, B: 0 },
  "S700MC": { C: 0.2, Si: 1.8, Mn: 2.2, Ni: 0, Cr: 0, Mo: 0, V: 0, Cu: 0, Nb: 0.08, Al: 0.05, N: 0.004, B: 0 },
  "DP600": { C: 0.15, Si: 1.5, Mn: 1.8, Ni: 0, Cr: 0, Mo: 0, V: 0, Cu: 0, Nb: 0, Al: 0.03, N: 0.005, B: 0 },
  "42CrMo4": { C: 0.42, Si: 0.3, Mn: 0.75, Ni: 0.1, Cr: 1.05, Mo: 0.25, V: 0, Cu: 0.1, Nb: 0, Al: 0.01, N: 0.004, B: 0 },
  "AISI 4140": { C: 0.4, Si: 0.3, Mn: 0.85, Ni: 0.15, Cr: 1.0, Mo: 0.2, V: 0, Cu: 0.1, Nb: 0, Al: 0.01, N: 0.004, B: 0 },
  "16MnCr5": { C: 0.16, Si: 0.25, Mn: 1.2, Ni: 1.3, Cr: 0.95, Mo: 0.15, V: 0, Cu: 0, Nb: 0, Al: 0.01, N: 0.004, B: 0.001 },
};

function calculateCriticalTemperatures(comp) {
  const { C, Si, Mn, Ni, Cr, Mo, V, W = 0, Cu, P = 0, Al, As = 0, Ti = 0 } = comp;
  const Ae3 = 910 - 203*Math.sqrt(C) - 15.2*Ni + 44.7*Si + 104*V + 31.5*Mo + 13.1*(W||0) - 30*Mn - 11*Cr - 20*Cu + 700*(P||0) + 400*(Al||0) + 120*(As||0) + 400*(Ti||0);
  const Ae1 = 723 - 10.7*Mn - 16.9*Ni + 29.1*Si + 16.9*Cr + 290*(As||0) + 6.38*(W||0);
  const Ms = C < 0.6 ? 539 - 423*C - 30.4*Mn - 17.7*Ni - 12.1*Cr - 7.5*Mo - 7.5*Si : 539 - 423*0.6 - 30.4*Mn - 17.7*Ni - 12.1*Cr - 7.5*Mo - 7.5*Si;
  const Mf = Ms - 215;
  const Bs = 830 - 270*C - 90*Mn - 37*Ni - 70*Cr - 83*Mo;
  const Bf = Bs - 120;
  return { Ae3: Math.round(Ae3), Ae1: Math.round(Ae1), Ms: Math.round(Ms), Mf: Math.round(Mf), Bs: Math.round(Bs), Bf: Math.round(Bf) };
}

function predictMicrostructure(comp, coolingRate, temps) {
  const { C, Mn, Ni, Cr, Mo, Cu = 0 } = comp;
  const CE = C + Mn/6 + (Ni + Cu)/15 + (Cr + Mo)/5;
  let fFerrite = 0, fPearlite = 0, fBainite = 0, fMartensite = 0;

  if (coolingRate < 0.5) {
    fFerrite = 70 - CE*20; fPearlite = 30 + CE*20;
  } else if (coolingRate < 2) {
    fFerrite = 50 - CE*25; fPearlite = 35 + CE*20; fBainite = 15 + CE*5;
  } else if (coolingRate < 10) {
    fFerrite = 20 - CE*10; fPearlite = 10; fBainite = 70 + CE*10;
  } else if (coolingRate < 30) {
    fBainite = 40 + CE*10; fMartensite = 60 - CE*10;
  } else {
    fMartensite = 85 + CE*15; fBainite = 15 - CE*15;
  }
  fFerrite = Math.max(0, Math.min(100, fFerrite));
  fPearlite = Math.max(0, Math.min(100-fFerrite, fPearlite));
  fBainite = Math.max(0, Math.min(100-fFerrite-fPearlite, fBainite));
  fMartensite = Math.max(0, 100 - fFerrite - fPearlite - fBainite);

  const HV = 65 * (fMartensite/100) * (1 + C*10) + 3 * (fBainite/100) * (280 + 750*C) + (fPearlite/100) * (200 + 500*C) + (fFerrite/100) * (80 + 500*C);
  return { fFerrite, fPearlite, fBainite, fMartensite, HV: Math.round(HV) };
}

function CCTDiagram({ comp, coolingRate, temps }) {
  const width = 600, height = 400;
  const margin = { t: 40, r: 30, b: 60, l: 70 };
  const plotW = width - margin.l - margin.r;
  const plotH = height - margin.t - margin.b;

  const xScale = (time) => margin.l + (Math.log10(Math.max(1, time)) / 5) * plotW;
  const yScale = (temp) => margin.t + ((900 - temp) / 900) * plotH;

  const paths = [];
  const timeRange = [1, 10, 100, 1000, 10000, 100000];

  const { Ae3, Ae1, Ms, Mf, Bs, Bf } = temps;

  paths.push({ d: `M${xScale(1)} ${yScale(Ms)} L${xScale(100000)} ${yScale(Ms)}`, stroke: "#ef4444", label: "Ms" });
  paths.push({ d: `M${xScale(1)} ${yScale(Mf)} L${xScale(100000)} ${yScale(Mf)}`, stroke: "#ef4444", label: "Mf", dashed: true });
  paths.push({ d: `M${xScale(1)} ${yScale(Bs)} L${xScale(100000)} ${yScale(Bs)}`, stroke: "#3b82f6", label: "Bs" });
  paths.push({ d: `M${xScale(1)} ${yScale(Bf)} L${xScale(100000)} ${yScale(Bf)}`, stroke: "#3b82f6", label: "Bf", dashed: true });

  const ferriteCurve = `M${xScale(0.1)} ${yScale(Ae3)} Q${xScale(100)} ${yScale(Ae3-50)}, ${xScale(10000)} ${yScale(Ae1+50)}`;
  paths.push({ d: ferriteCurve, stroke: "#f5f5f5", label: "Ferrite start" });

  const perliteCurve = `M${xScale(0.5)} ${yScale(Ae1-30)} Q${xScale(500)} ${yScale(Ae1-60)}, ${xScale(50000)} ${yScale(Ae1-100)}`;
  paths.push({ d: perliteCurve, stroke: "#a0a0a0", label: "Pearlite start" });

  const bainiteCurve = `M${xScale(10)} ${yScale(Bs)} Q${xScale(1000)} ${yScale(Bs-40)}, ${xScale(100000)} ${yScale(Bs-80)}`;
  paths.push({ d: bainiteCurve, stroke: "#60a5fa", label: "Bainite start" });

  const coolingCurve = [];
  const tempStep = 5;
  let currentTemp = 900;
  let currentTime = 0.1;
  while (currentTemp > 0) {
    coolingCurve.push([currentTime, currentTemp]);
    currentTime += (tempStep / coolingRate) * 0.01;
    currentTemp -= tempStep;
  }
  const coolingPath = coolingCurve.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p[0])},${yScale(p[1])}`).join(" ");
  paths.push({ d: coolingPath, stroke: "#fbbf24", label: "Cooling", width: 3 });

  return (
    <svg width={width} height={height} className="bg-dark-800 border border-white/10 rounded-lg">
      <defs>
        <linearGradient id="ferriteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={margin.l} y={margin.t} width={plotW} height={plotH} fill="#ffffff" fillOpacity="0.02" />
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.width || 1.5} fill="none" strokeDasharray={p.dashed ? "5,5" : "0"} opacity={0.8} />
      ))}
      <line x1={margin.l} y1={margin.t} x2={margin.l} y2={margin.t + plotH} stroke="white" strokeWidth="1.5" opacity="0.3" />
      <line x1={margin.l} y1={margin.t + plotH} x2={margin.l + plotW} y2={margin.t + plotH} stroke="white" strokeWidth="1.5" opacity="0.3" />
      {timeRange.map((t, i) => (
        <g key={`time-${i}`}>
          <line x1={xScale(t)} y1={margin.t + plotH} x2={xScale(t)} y2={margin.t + plotH + 5} stroke="white" strokeWidth="1" opacity="0.3" />
          <text x={xScale(t)} y={margin.t + plotH + 18} textAnchor="middle" className="text-xs" fill="#8b8b8b">{t.toExponential(0).replace('+','')}s</text>
        </g>
      ))}
      {[900, 700, 500, 300, 100].map((temp, i) => (
        <g key={`temp-${i}`}>
          <line x1={margin.l - 5} y1={yScale(temp)} x2={margin.l} y2={yScale(temp)} stroke="white" strokeWidth="1" opacity="0.3" />
          <text x={margin.l - 10} y={yScale(temp) + 4} textAnchor="end" className="text-xs" fill="#8b8b8b">{temp}</text>
        </g>
      ))}
      <text x={width / 2} y={height - 10} textAnchor="middle" className="text-xs" fill="#8b8b8b">Time (s, log scale)</text>
      <text x={20} y={height / 2} textAnchor="middle" transform={`rotate(-90 20 ${height/2})`} className="text-xs" fill="#8b8b8b">Temperature (°C)</text>
    </svg>
  );
}

export default function CCTTTInterpreter() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [steelGrade, setSteelGrade] = useState("Custom");
  const [composition, setComposition] = useState(STEEL_PRESETS["Custom"]);
  const [ausTemp, setAusTemp] = useState(900);
  const [ausGrain, setAusGrain] = useState(8);
  const [coolingRate, setCoolingRate] = useState(5);
  const [results, setResults] = useState(null);

  const handleGradeChange = (grade) => {
    setSteelGrade(grade);
    setComposition(STEEL_PRESETS[grade]);
  };

  const handleElementChange = (element, value) => {
    setComposition({ ...composition, [element]: parseFloat(value) || 0 });
  };

  const handleCalculate = () => {
    const temps = calculateCriticalTemperatures(composition);
    const micro = predictMicrostructure(composition, coolingRate, temps);
    setResults({ composition, temps, micro, ausTemp, ausGrain, coolingRate });
  };

  const handleExport = () => {
    if (!results) return;
    const { composition, temps, micro, ausTemp, ausGrain, coolingRate } = results;
    const lines = [
      "CCT/TTT DIAGRAM INTERPRETER REPORT",
      "=".repeat(50),
      "",
      "INPUT PARAMETERS:",
      `Austenitizing Temperature: ${ausTemp}°C`,
      `Prior Austenite Grain Size (ASTM): ${ausGrain}`,
      `Cooling Rate: ${coolingRate}°C/s`,
      "",
      "CHEMICAL COMPOSITION (wt%):",
      Object.entries(composition).map(([k, v]) => `  ${k}: ${v.toFixed(2)}%`).join("\n"),
      "",
      "CRITICAL TEMPERATURES (°C):",
      `  Ae3: ${temps.Ae3}°C`,
      `  Ae1: ${temps.Ae1}°C`,
      `  Ms:  ${temps.Ms}°C`,
      `  Mf:  ${temps.Mf}°C`,
      `  Bs:  ${temps.Bs}°C`,
      `  Bf:  ${temps.Bf}°C`,
      "",
      "PREDICTED MICROSTRUCTURE:",
      `  Ferrite: ${micro.fFerrite.toFixed(1)}%`,
      `  Pearlite: ${micro.fPearlite.toFixed(1)}%`,
      `  Bainite: ${micro.fBainite.toFixed(1)}%`,
      `  Martensite: ${micro.fMartensite.toFixed(1)}%`,
      `  Estimated Hardness: ${micro.HV} HV`,
      "",
      "NOTES:",
      "- Empirical formulas used for critical temperatures",
      "- Phase fractions based on simplified transformation models",
      "- Actual microstructures depend on cooling kinetics and prior structure",
      "- Use for education and preliminary engineering estimates only",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cct-ttt-report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <span className="text-dark-200 text-sm">⚡</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-2">{t.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 mb-6">
          <span>✓</span> {t.badge}
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-orange-400 mb-2">{t.warning}</h3>
          <p className="text-xs text-dark-200">{t.warningText}</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-gold-400">{t.inputTitle}</h2>

              {/* Steel Grade Selector */}
              <div className="mb-5">
                <label className="text-xs font-medium text-dark-300 mb-2 block">{t.steelGrade}</label>
                <select value={steelGrade} onChange={(e) => handleGradeChange(e.target.value)} className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400">
                  {Object.keys(STEEL_PRESETS).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Composition Grid */}
              <div className="mb-5">
                <label className="text-xs font-medium text-dark-300 mb-3 block">{t.composition}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['C', 'Si', 'Mn', 'Ni', 'Cr', 'Mo', 'V', 'Cu', 'Nb', 'Al', 'N', 'B'].map(elem => (
                    <div key={elem}>
                      <label className="text-xs text-dark-400 mb-1 block">{elem}</label>
                      <input type="number" step="0.01" min="0" max="10" value={composition[elem] || 0} onChange={(e) => handleElementChange(elem, e.target.value)} className="w-full bg-dark-800 border border-white/[0.08] rounded px-2 py-1.5 text-xs text-dark-50 focus:outline-none focus:border-gold-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Austenitizing */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-xs font-medium text-dark-300 mb-2 block">{t.ausTemp}</label>
                  <input type="number" min="700" max="1200" value={ausTemp} onChange={(e) => setAusTemp(parseInt(e.target.value))} className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-dark-300 mb-2 block">{t.ausGrain}</label>
                  <input type="number" min="1" max="12" value={ausGrain} onChange={(e) => setAusGrain(parseInt(e.target.value))} className="w-full bg-dark-800 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-dark-50 focus:outline-none focus:border-gold-400" />
                </div>
              </div>

              {/* Cooling Rate */}
              <div className="mb-6">
                <label className="text-xs font-medium text-dark-300 mb-2 block">{t.coolingRate}: {coolingRate.toFixed(1)} °C/s</label>
                <input type="range" min="-1" max="2" step="0.1" value={Math.log10(coolingRate)} onChange={(e) => setCoolingRate(Math.pow(10, parseFloat(e.target.value)))} className="w-full" />
                <div className="text-xs text-dark-400 mt-1">0.1 — 100 °C/s (log scale)</div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={handleCalculate} className="flex-1 bg-gold-400/20 text-gold-400 px-4 py-2 rounded-lg text-sm font-semibold border border-gold-400/30 cursor-pointer hover:bg-gold-400/30 font-sans">{t.calculate}</button>
                <button onClick={() => { setResults(null); setSteelGrade("Custom"); setComposition(STEEL_PRESETS["Custom"]); setCoolingRate(5); }} className="flex-1 bg-white/[0.05] text-dark-300 px-4 py-2 rounded-lg text-sm font-semibold border border-white/[0.08] cursor-pointer hover:bg-white/[0.08] font-sans">{t.reset}</button>
              </div>

              {results && (
                <button onClick={handleExport} className="w-full mt-3 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 font-sans">{t.export}</button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Critical Temperatures */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gold-400">{t.criticalTemps}</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.ae3}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Ae3}°C</div>
                    </div>
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.ae1}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Ae1}°C</div>
                    </div>
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.ms}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Ms}°C</div>
                    </div>
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.mf}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Mf}°C</div>
                    </div>
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.bs}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Bs}°C</div>
                    </div>
                    <div className="bg-dark-800 rounded px-3 py-2">
                      <div className="text-dark-400 text-xs">{t.bf}</div>
                      <div className="text-dark-50 font-mono font-bold">{results.temps.Bf}°C</div>
                    </div>
                  </div>
                </div>

                {/* Microstructure */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gold-400">{t.microstructure}</h2>
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-dark-300">{t.ferrite}</span>
                        <span className="text-xs font-mono text-dark-50">{results.micro.fFerrite.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-white h-2 rounded-full" style={{ width: `${results.micro.fFerrite}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-dark-300">{t.pearlite}</span>
                        <span className="text-xs font-mono text-dark-50">{results.micro.fPearlite.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${results.micro.fPearlite}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-dark-300">{t.bainite}</span>
                        <span className="text-xs font-mono text-dark-50">{results.micro.fBainite.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${results.micro.fBainite}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-dark-300">{t.martensite}</span>
                        <span className="text-xs font-mono text-dark-50">{results.micro.fMartensite.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: `${results.micro.fMartensite}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-800 rounded-lg px-4 py-3 border border-white/[0.08]">
                    <div className="text-xs text-dark-400 mb-1">{t.estimatedHV}</div>
                    <div className="text-2xl font-bold text-gold-400 font-mono">{results.micro.HV} HV</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-12 text-center">
                <div className="text-dark-400 text-sm">{t.results}</div>
              </div>
            )}
          </div>
        </div>

        {/* CCT Diagram */}
        {results && (
          <div className="mt-8">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-gold-400">CCT Diagram (Schematic)</h2>
              <div className="flex justify-center">
                <CCTDiagram comp={results.composition} coolingRate={results.coolingRate} temps={results.temps} />
              </div>
              <p className="text-xs text-dark-400 mt-4 text-center">Schematic representation — actual curves depend on detailed alloy system data</p>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center">
          <p className="text-sm text-dark-200 mb-3">{t.wantMore}</p>
          <Link href="/pricing" className="inline-block bg-gold-400/20 text-gold-400 px-6 py-2 rounded-lg text-sm font-semibold border border-gold-400/30 no-underline hover:bg-gold-400/30">{t.viewPlans}</Link>
        </div>
      </div>
    </div>
  );
}
