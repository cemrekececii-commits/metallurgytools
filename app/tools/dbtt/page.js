"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

// ─── DBTT CORRELATIONS ──────────────────────────────────
// Pickering-Gladman (1963): DBTT = f(composition, grain size)
// Mintz et al. (1979): Modified for microalloyed steels
// Empirical API 5L / EN 10025 correlations

function pickering(C, Mn, Si, Ni, Cr, Mo, N, G, pearlitePct) {
  // Pickering-Gladman: DBTT (°C) for ferrite-pearlite steels
  // DBTT = -19 + 44×Si + 700×√N_free + 2.2×Pearlite% - 11.5×√d
  // where d = grain diameter in mm = 1/√(2^(G-1) × 645) for ASTM G
  const d_mm = 1 / Math.sqrt(Math.pow(2, G - 1) * 645); // ASTM E112
  const d_um = d_mm * 1000;
  const N_free = Math.max(0, N - 0.004); // Free nitrogen (total - combined with Al/Ti)
  
  let DBTT = -19;
  DBTT += 44 * Si;
  DBTT += 700 * Math.sqrt(N_free > 0 ? N_free : 0);
  DBTT += 2.2 * pearlitePct;
  DBTT -= 11.5 * Math.sqrt(d_mm);
  
  return { DBTT: Math.round(DBTT), model: "Pickering-Gladman", d_um: +d_um.toFixed(1), N_free: +(N_free * 10000).toFixed(1) };
}

function mintz(C, Mn, Si, Ni, Cr, Mo, Nb, V, Ti, N, G) {
  // Mintz et al. modified correlation for HSLA steels
  // DBTT = -46 + 28×Si - 4×Mn + 23×√(%Nb) + 700×√N_free - 11.5×√d + 3×%Pearlite
  const d_mm = 1 / Math.sqrt(Math.pow(2, G - 1) * 645);
  const pearlitePct = Math.min(100, (C / 0.76) * 100); // Approximate
  const N_free = Math.max(0, N - 3.42 * Ti - 1.93 * Nb); // N consumed by TiN, NbN
  
  let DBTT = -46;
  DBTT += 28 * Si;
  DBTT -= 4 * Mn;
  DBTT += 23 * Math.sqrt(Nb > 0 ? Nb : 0);
  DBTT += 700 * Math.sqrt(N_free > 0 ? N_free : 0);
  DBTT -= 11.5 * Math.sqrt(d_mm);
  DBTT += 3 * pearlitePct;
  
  return { DBTT: Math.round(DBTT), model: "Mintz (HSLA)", N_free: +(N_free * 10000).toFixed(1), pearlitePct: +pearlitePct.toFixed(1) };
}

function empiricalAPI(C, Mn, Si, Ni, Cr, Mo, Cu, Nb, V, Ti, N, G) {
  // Empirical correlation for API 5L pipeline steels
  // Based on: Gladman, The Physical Metallurgy of Microalloyed Steels
  const d_mm = 1 / Math.sqrt(Math.pow(2, G - 1) * 645);
  
  let DBTT = -32;
  DBTT += 55 * C;
  DBTT += 16 * Si;
  DBTT -= 10 * Mn;
  DBTT -= 12 * Ni;
  DBTT += 8 * Cr;
  DBTT += 15 * Mo;
  DBTT -= 5 * Cu;
  DBTT += 20 * Math.sqrt(Nb > 0 ? Nb : 0);
  DBTT += 700 * Math.sqrt(Math.max(0, N - 3.42 * Ti));
  DBTT -= 11.5 * Math.sqrt(d_mm);
  
  return { DBTT: Math.round(DBTT), model: "Empirical (API/Pipeline)" };
}

// ─── CHARPY ENERGY ESTIMATION ───────────────────────────
function charpyAtTemp(DBTT, temp, upperShelf) {
  // Hyperbolic tangent model: KV = (USE/2) × [1 + tanh((T - DBTT) / C)]
  // C ≈ 25-35°C transition width
  const C_width = 30;
  const KV = (upperShelf / 2) * (1 + Math.tanh((temp - DBTT) / C_width));
  return Math.max(0, Math.round(KV));
}

// ─── ACCEPTANCE CRITERIA ────────────────────────────────
const CRITERIA = [
  { name: "EN 10025-2 S355J2", tempC: -20, minJ: 27, grade: "S355J2" },
  { name: "EN 10025-2 S355K2", tempC: -20, minJ: 40, grade: "S355K2" },
  { name: "EN 10025-3 S460N", tempC: -20, minJ: 40, grade: "S460N" },
  { name: "EN 10025-3 S460NL", tempC: -50, minJ: 27, grade: "S460NL" },
  { name: "API 5L X65 (PSL2)", tempC: -20, minJ: 27, grade: "X65" },
  { name: "API 5L X70 (PSL2)", tempC: -20, minJ: 27, grade: "X70" },
  { name: "API 5L X80 (PSL2)", tempC: -20, minJ: 27, grade: "X80" },
  { name: "ASTM A516 Gr.70", tempC: -30, minJ: 20, grade: "A516-70" },
  { name: "EN 10149-2 S700MC", tempC: -20, minJ: 40, grade: "S700MC" },
];

// ─── PRESETS ────────────────────────────────────────────
const PRESETS = {
  "S355J2": { C: 0.16, Mn: 1.40, Si: 0.35, Ni: 0.02, Cr: 0.05, Mo: 0.01, Cu: 0.02, Nb: 0.025, V: 0.005, Ti: 0.002, N: 0.008, G: 8, USE: 180 },
  "S460N": { C: 0.16, Mn: 1.50, Si: 0.40, Ni: 0.30, Cr: 0.10, Mo: 0.01, Cu: 0.02, Nb: 0.040, V: 0.060, Ti: 0.015, N: 0.012, G: 9, USE: 200 },
  "X65": { C: 0.08, Mn: 1.45, Si: 0.25, Ni: 0.15, Cr: 0.05, Mo: 0.10, Cu: 0.05, Nb: 0.050, V: 0.050, Ti: 0.015, N: 0.006, G: 10, USE: 250 },
  "X70": { C: 0.07, Mn: 1.55, Si: 0.25, Ni: 0.20, Cr: 0.05, Mo: 0.15, Cu: 0.10, Nb: 0.060, V: 0.060, Ti: 0.015, N: 0.005, G: 11, USE: 280 },
  "S700MC": { C: 0.07, Mn: 1.80, Si: 0.20, Ni: 0.05, Cr: 0.05, Mo: 0.10, Cu: 0.02, Nb: 0.060, V: 0.080, Ti: 0.120, N: 0.010, G: 12, USE: 200 },
  "Custom": { C: 0.10, Mn: 1.20, Si: 0.30, Ni: 0.05, Cr: 0.05, Mo: 0.01, Cu: 0.02, Nb: 0.030, V: 0.010, Ti: 0.010, N: 0.008, G: 8, USE: 180 },
};

// ─── TRANSLATIONS ───────────────────────────────────────
const TR = {
  title: "DBTT Tahmin Motoru", subtitle: "Pickering-Gladman, Mintz ve ampirik korelasyonlarla sünek-gevrek geçiş sıcaklığı tahmini.",
  composition: "Kimyasal Bileşim (ağ.%)", microstructure: "Mikroyapı", results: "Tahmin Sonuçları",
  grainSize: "ASTM Tane Boyutu (G)", upperShelf: "Üst Şelf Enerjisi (J)", preset: "Kalite Seçin",
  dbttResult: "Tahmini DBTT", charpyCurve: "Charpy Geçiş Eğrisi", acceptance: "Kabul Kriterleri Kontrolü",
  model: "Model", temperature: "Sıcaklık", energy: "Enerji", testTemp: "Test Sıcaklığı",
  minReq: "Min. Gerekli", estimated: "Tahmini KV", status: "Durum",
  pass: "GEÇTİ", fail: "KALDI", free: "ÜCRETSİZ", freeN: "Serbest N",
  factors: "Etkileyen Faktörler", exportTxt: "Rapor (TXT)",
  pearlite: "Perlit", grainDiam: "Tane Çapı",
  warningN: "Serbest azot yüksek — DBTT'yi önemli ölçüde artırır. Ti/Al ile azot bağlama kontrol edin.",
  warningCoarse: "Kaba tane yapısı (G < 7) — Hall-Petch etkisiyle DBTT yükselir. Normalizasyon düşünün.",
  warningC: "Karbon > 0.15% — perlit oranı artar, DBTT yükselir. Düşük karbonlu tasarım tercih edin.",
  okMsg: "DBTT tahminleri kabul edilebilir aralıkta. Standart muayene prosedürlerini uygulayın.",
  references: "Referanslar",
};
const EN = {
  title: "DBTT Prediction Engine", subtitle: "Ductile-to-brittle transition temperature prediction using Pickering-Gladman, Mintz and empirical correlations.",
  composition: "Chemical Composition (wt%)", microstructure: "Microstructure", results: "Prediction Results",
  grainSize: "ASTM Grain Size (G)", upperShelf: "Upper Shelf Energy (J)", preset: "Select Grade",
  dbttResult: "Predicted DBTT", charpyCurve: "Charpy Transition Curve", acceptance: "Acceptance Criteria Check",
  model: "Model", temperature: "Temperature", energy: "Energy", testTemp: "Test Temp.",
  minReq: "Min. Required", estimated: "Estimated KV", status: "Status",
  pass: "PASS", fail: "FAIL", free: "FREE", freeN: "Free N",
  factors: "Contributing Factors", exportTxt: "Report (TXT)",
  pearlite: "Pearlite", grainDiam: "Grain Diameter",
  warningN: "Free nitrogen is high — significantly increases DBTT. Check N binding with Ti/Al.",
  warningCoarse: "Coarse grain structure (G < 7) — DBTT increases via Hall-Petch. Consider normalization.",
  warningC: "Carbon > 0.15% — pearlite fraction increases, DBTT rises. Prefer low-carbon design.",
  okMsg: "DBTT predictions are within acceptable range. Apply standard inspection procedures.",
  references: "References",
};

// ─── SVG CHARPY CURVE ───────────────────────────────────
function CharpyCurveSVG({ DBTT, USE, criteria }) {
  const W = 600, H = 250, PL = 55, PR = 20, PT = 15, PB = 40;
  const cw = W - PL - PR, ch = H - PT - PB;
  const minT = -80, maxT = 60;
  const maxE = Math.max(USE + 30, 300);

  const toX = (temp) => PL + ((temp - minT) / (maxT - minT)) * cw;
  const toY = (e) => PT + ((maxE - e) / maxE) * ch;

  // Generate curve points
  const pts = [];
  for (let temp = minT; temp <= maxT; temp += 2) {
    const kv = charpyAtTemp(DBTT, temp, USE);
    pts.push(`${toX(temp).toFixed(1)},${toY(kv).toFixed(1)}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Grid */}
      {[-60, -40, -20, 0, 20, 40, 60].map(temp => {
        const x = toX(temp);
        if (x < PL || x > W - PR) return null;
        return <g key={temp}><line x1={x} y1={PT} x2={x} y2={H - PB} stroke="#334155" strokeDasharray="2,4" /><text x={x} y={H - PB + 15} textAnchor="middle" fill="#94a3b8" fontSize="9">{temp}°C</text></g>;
      })}
      {[0, 50, 100, 150, 200, 250, 300].filter(e => e <= maxE).map(e => {
        const y = toY(e);
        return <g key={e}><line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#334155" strokeDasharray="2,4" /><text x={PL - 5} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="9">{e}</text></g>;
      })}

      {/* Curve */}
      <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={pts.join(" ")} />

      {/* DBTT vertical line */}
      <line x1={toX(DBTT)} y1={PT} x2={toX(DBTT)} y2={H - PB} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={toX(DBTT)} y={PT - 3} textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">DBTT={DBTT}°C</text>

      {/* USE line */}
      <line x1={PL} y1={toY(USE)} x2={W - PR} y2={toY(USE)} stroke="#4ade80" strokeWidth="1" strokeDasharray="4,4" />
      <text x={W - PR + 2} y={toY(USE) + 3} fill="#4ade80" fontSize="8">USE={USE}J</text>

      {/* 27J line */}
      <line x1={PL} y1={toY(27)} x2={W - PR} y2={toY(27)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <text x={W - PR + 2} y={toY(27) + 3} fill="#f59e0b" fontSize="8">27J</text>

      {/* Criteria markers */}
      {criteria.map((c, i) => {
        const kv = charpyAtTemp(DBTT, c.tempC, USE);
        const pass = kv >= c.minJ;
        return (
          <g key={i}>
            <circle cx={toX(c.tempC)} cy={toY(kv)} r="4" fill={pass ? "#4ade80" : "#ef4444"} stroke="white" strokeWidth="1.5" />
            <text x={toX(c.tempC)} y={toY(kv) - 8} textAnchor="middle" fill={pass ? "#4ade80" : "#ef4444"} fontSize="7" fontWeight="bold">{c.grade}</text>
          </g>
        );
      })}

      {/* Axes */}
      <text x={W / 2} y={H - 3} textAnchor="middle" fill="#94a3b8" fontSize="10">Temperature (°C)</text>
      <text x={8} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize="10" transform={`rotate(-90,8,${H / 2})`}>KV (J)</text>
    </svg>
  );
}

function InputField({ label, name, value, unit, step = "any", onChange }) {
  return (
    <div>
      <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <input type="number" name={name} value={value} onChange={onChange} step={step}
          className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 font-mono focus:border-gold-400/50 focus:outline-none" />
        {unit && <span className="absolute right-2 top-2 text-dark-300 text-[10px]">{unit}</span>}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────
export default function DBTTEngine() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [preset, setPreset] = useState("S355J2");
  const [data, setData] = useState(PRESETS["S355J2"]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData(p => ({ ...p, [name]: parseFloat(value) || 0 }));
  };

  const handlePreset = (e) => {
    const key = e.target.value;
    setPreset(key);
    if (PRESETS[key]) setData({ ...PRESETS[key] });
  };

  const results = useMemo(() => {
    const pearlitePct = Math.min(100, (data.C / 0.76) * 100);
    const pg = pickering(data.C, data.Mn, data.Si, data.Ni, data.Cr, data.Mo, data.N, data.G, pearlitePct);
    const mz = mintz(data.C, data.Mn, data.Si, data.Ni, data.Cr, data.Mo, data.Nb, data.V, data.Ti, data.N, data.G);
    const emp = empiricalAPI(data.C, data.Mn, data.Si, data.Ni, data.Cr, data.Mo, data.Cu, data.Nb, data.V, data.Ti, data.N, data.G);

    const avgDBTT = Math.round((pg.DBTT + mz.DBTT + emp.DBTT) / 3);

    const warnings = [];
    if (mz.N_free > 40) warnings.push({ type: "critical", msg: t.warningN });
    if (data.G < 7) warnings.push({ type: "warning", msg: t.warningCoarse });
    if (data.C > 0.15) warnings.push({ type: "warning", msg: t.warningC });
    if (!warnings.length) warnings.push({ type: "ok", msg: t.okMsg });

    const criteriaResults = CRITERIA.map(c => {
      const kv = charpyAtTemp(avgDBTT, c.tempC, data.USE);
      return { ...c, estimatedKV: kv, pass: kv >= c.minJ };
    });

    return { pg, mz, emp, avgDBTT, pearlitePct: +pearlitePct.toFixed(1), warnings, criteriaResults };
  }, [data, t]);

  const exportReport = () => {
    const txt = `DBTT PREDICTION REPORT\n${"=".repeat(40)}\n\nComposition: C=${data.C} Mn=${data.Mn} Si=${data.Si} Ni=${data.Ni} Cr=${data.Cr} Mo=${data.Mo} Cu=${data.Cu} Nb=${data.Nb} V=${data.V} Ti=${data.Ti} N=${data.N}\nASTM G: ${data.G} | USE: ${data.USE} J\n\nPREDICTIONS\n-----------\n${results.pg.model}: ${results.pg.DBTT} °C\n${results.mz.model}: ${results.mz.DBTT} °C\n${results.emp.model}: ${results.emp.DBTT} °C\nAverage DBTT: ${results.avgDBTT} °C\n\nACCEPTANCE\n----------\n${results.criteriaResults.map(c => `${c.name} @ ${c.tempC}°C: ${c.estimatedKV}J vs ${c.minJ}J min → ${c.pass ? "PASS" : "FAIL"}`).join("\n")}`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "dbtt_report.txt"; a.click();
  };

  const warnStyle = { critical: "bg-red-500/10 border-red-500/20 text-red-400", warning: "bg-orange-500/10 border-orange-500/20 text-orange-400", ok: "bg-green-500/10 border-green-500/20 text-green-400" };
  const warnIcon = { critical: "🚨", warning: "⚠️", ok: "✅" };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">❄️ DBTT</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportReport} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">📄 {t.exportTxt}</button>
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-6">{t.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-5 space-y-5">
            {/* Preset */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1.5 block">{t.preset}</label>
              <select value={preset} onChange={handlePreset}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                {Object.keys(PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* Composition */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">🧪 {t.composition}</h2>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                <InputField label="C" name="C" value={data.C} unit="%" step="0.001" onChange={onChange} />
                <InputField label="Mn" name="Mn" value={data.Mn} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Si" name="Si" value={data.Si} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Ni" name="Ni" value={data.Ni} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Cr" name="Cr" value={data.Cr} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Mo" name="Mo" value={data.Mo} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Cu" name="Cu" value={data.Cu} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Nb" name="Nb" value={data.Nb} unit="%" step="0.001" onChange={onChange} />
                <InputField label="V" name="V" value={data.V} unit="%" step="0.001" onChange={onChange} />
                <InputField label="Ti" name="Ti" value={data.Ti} unit="%" step="0.001" onChange={onChange} />
                <InputField label="N" name="N" value={data.N} unit="%" step="0.001" onChange={onChange} />
              </div>
            </div>

            {/* Microstructure */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">🔬 {t.microstructure}</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <InputField label={t.grainSize} name="G" value={data.G} step="0.5" onChange={onChange} />
                <InputField label={t.upperShelf} name="USE" value={data.USE} unit="J" step="1" onChange={onChange} />
              </div>
            </div>

            {/* Warnings */}
            <div className="space-y-2">
              {results.warnings.map((w, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-start gap-2 ${warnStyle[w.type]}`}>
                  <span className="shrink-0">{warnIcon[w.type]}</span>
                  <p className="text-sm leading-relaxed">{w.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-5">
            {/* DBTT Results */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-gold-400/10 px-5 py-3 border-b border-gold-400/20">
                <h2 className="text-sm font-semibold text-gold-400">📊 {t.dbttResult}</h2>
              </div>
              <div className="p-5">
                {/* Average DBTT */}
                <div className="bg-blue-500/10 rounded-xl p-5 border border-blue-500/20 mb-5 text-center">
                  <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">{t.dbttResult} (Ortalama)</div>
                  <div className="text-5xl font-black font-mono text-blue-400">{results.avgDBTT}°C</div>
                </div>

                {/* Model comparison */}
                <div className="grid grid-cols-3 gap-3">
                  {[results.pg, results.mz, results.emp].map((r, i) => (
                    <div key={i} className="bg-dark-800 rounded-lg p-3 border border-white/[0.06] text-center">
                      <div className="text-[9px] text-dark-300 uppercase font-bold mb-1">{r.model}</div>
                      <div className="text-xl font-bold font-mono text-dark-50">{r.DBTT}°C</div>
                    </div>
                  ))}
                </div>

                {/* Factors */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-dark-800 rounded-lg p-2.5 border border-white/[0.06]">
                    <div className="text-[9px] text-dark-300 uppercase">{t.pearlite}</div>
                    <div className="text-sm font-mono text-dark-50">{results.pearlitePct}%</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-2.5 border border-white/[0.06]">
                    <div className="text-[9px] text-dark-300 uppercase">{t.grainDiam}</div>
                    <div className="text-sm font-mono text-dark-50">{results.pg.d_um} µm</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-2.5 border border-white/[0.06]">
                    <div className="text-[9px] text-dark-300 uppercase">{t.freeN}</div>
                    <div className="text-sm font-mono text-dark-50">{results.mz.N_free} ppm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charpy Curve */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-dark-100">📈 {t.charpyCurve}</h2>
              </div>
              <div className="p-4">
                <CharpyCurveSVG DBTT={results.avgDBTT} USE={data.USE} criteria={results.criteriaResults} />
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-dark-100">✅ {t.acceptance}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-dark-300 bg-dark-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Standard</th>
                      <th className="px-4 py-2 text-center">{t.testTemp}</th>
                      <th className="px-4 py-2 text-center">{t.minReq}</th>
                      <th className="px-4 py-2 text-center">{t.estimated}</th>
                      <th className="px-4 py-2 text-center">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.criteriaResults.map((c, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        <td className="px-4 py-2 text-dark-100 font-medium">{c.name}</td>
                        <td className="px-4 py-2 text-center text-dark-200 font-mono">{c.tempC}°C</td>
                        <td className="px-4 py-2 text-center text-dark-200 font-mono">{c.minJ} J</td>
                        <td className="px-4 py-2 text-center text-dark-50 font-mono font-bold">{c.estimatedKV} J</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.pass ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {c.pass ? t.pass : t.fail}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* References */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[10px] text-dark-300 font-bold uppercase mb-1">{t.references}</div>
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>• Pickering, F.B. & Gladman, T. (1963) ISI Spec. Rep. 81</div>
                <div>• Mintz, B. et al. (1979) Int. Met. Rev. 24, 1-20</div>
                <div>• Gladman, T. The Physical Metallurgy of Microalloyed Steels</div>
                <div>• API 5L 46th Ed. / EN 10025-2:2019 / EN 10149-2:2013</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
