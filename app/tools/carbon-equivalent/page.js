"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";

// ─── CE FORMULAS ────────────────────────────────────────
// IIW: CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
function ceIIW(c) { return c.C + c.Mn/6 + (c.Cr+c.Mo+c.V)/5 + (c.Ni+c.Cu)/15; }

// CET (EN 1011-2): CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40
function ceCET(c) { return c.C + (c.Mn+c.Mo)/10 + (c.Cr+c.Cu)/20 + c.Ni/40; }

// Pcm (Ito-Bessyo): Pcm = C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B
function cePcm(c) { return c.C + c.Si/30 + (c.Mn+c.Cu+c.Cr)/20 + c.Ni/60 + c.Mo/15 + c.V/10 + 5*c.B; }

// CEN (Yurioka): CEN = C + A(C) × [Si/24 + Mn/6 + Cu/15 + Ni/20 + (Cr+Mo+V+Nb)/5 + 5B]
// where A(C) = 0.75 + 0.25 × tanh[20×(C-0.12)]
function ceCEN(c) {
  const AC = 0.75 + 0.25 * Math.tanh(20 * (c.C - 0.12));
  return c.C + AC * (c.Si/24 + c.Mn/6 + c.Cu/15 + c.Ni/20 + (c.Cr+c.Mo+c.V+c.Nb)/5 + 5*c.B);
}

// ─── PREHEAT ESTIMATION ─────────────────────────────────
// AWS D1.1 based preheat estimation from CE_IIW
function preheatFromCE(ceiiw, thickness) {
  if (ceiiw < 0.30) return { temp: 0, level: "none" };
  if (ceiiw < 0.35) return { temp: thickness > 25 ? 50 : 0, level: "low" };
  if (ceiiw < 0.40) return { temp: thickness > 25 ? 100 : 50, level: "moderate" };
  if (ceiiw < 0.45) return { temp: thickness > 25 ? 150 : 100, level: "moderate" };
  if (ceiiw < 0.50) return { temp: thickness > 25 ? 200 : 150, level: "high" };
  if (ceiiw < 0.55) return { temp: 200, level: "high" };
  return { temp: 250, level: "critical" };
}

// ─── WELDABILITY RATING ─────────────────────────────────
function weldabilityRating(ceiiw, pcm) {
  if (ceiiw < 0.35 && pcm < 0.20) return { rating: "Excellent", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" };
  if (ceiiw < 0.40 && pcm < 0.25) return { rating: "Good", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
  if (ceiiw < 0.45 && pcm < 0.30) return { rating: "Fair", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" };
  if (ceiiw < 0.55 && pcm < 0.35) return { rating: "Poor", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
  return { rating: "Very Poor", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
}

// ─── PRESETS ────────────────────────────────────────────
const PRESETS = {
  "Custom": { C:0.10, Si:0.25, Mn:1.20, Ni:0.05, Cr:0.05, Mo:0.01, V:0.005, Cu:0.02, Nb:0.02, B:0.0000, t:20 },
  "S235JR": { C:0.17, Si:0.25, Mn:1.40, Ni:0.02, Cr:0.03, Mo:0.01, V:0.003, Cu:0.02, Nb:0.005, B:0.0000, t:16 },
  "S355J2": { C:0.16, Si:0.35, Mn:1.40, Ni:0.02, Cr:0.05, Mo:0.01, V:0.005, Cu:0.02, Nb:0.025, B:0.0000, t:25 },
  "S460N": { C:0.16, Si:0.40, Mn:1.50, Ni:0.30, Cr:0.10, Mo:0.01, V:0.060, Cu:0.02, Nb:0.040, B:0.0000, t:30 },
  "S690Q": { C:0.16, Si:0.30, Mn:1.40, Ni:0.50, Cr:0.50, Mo:0.30, V:0.060, Cu:0.10, Nb:0.030, B:0.0020, t:25 },
  "S700MC": { C:0.07, Si:0.20, Mn:1.80, Ni:0.05, Cr:0.05, Mo:0.10, V:0.080, Cu:0.02, Nb:0.060, B:0.0000, t:12 },
  "X65 (API)": { C:0.08, Si:0.25, Mn:1.45, Ni:0.15, Cr:0.05, Mo:0.10, V:0.050, Cu:0.05, Nb:0.050, B:0.0000, t:20 },
  "X70 (API)": { C:0.07, Si:0.25, Mn:1.55, Ni:0.20, Cr:0.05, Mo:0.15, V:0.060, Cu:0.10, Nb:0.060, B:0.0000, t:20 },
  "A516 Gr.70": { C:0.22, Si:0.30, Mn:1.20, Ni:0.02, Cr:0.03, Mo:0.01, V:0.003, Cu:0.02, Nb:0.005, B:0.0000, t:30 },
  "P91 (CSEF)": { C:0.10, Si:0.30, Mn:0.45, Ni:0.20, Cr:8.50, Mo:0.95, V:0.200, Cu:0.05, Nb:0.060, B:0.0000, t:40 },
};

// ─── TRANSLATIONS ───────────────────────────────────────
const TR = {
  title: "Karbon Eşdeğeri Hesaplayıcı",
  subtitle: "CE(IIW), CET, Pcm ve CEN formülleri ile kaynak kabiliyeti değerlendirmesi ve ön ısıtma tahmini.",
  composition: "Kimyasal Bileşim (ağ.%)", preset: "Kalite Seçin", thickness: "Et Kalınlığı",
  results: "Karbon Eşdeğeri Sonuçları", weldability: "Kaynak Kabiliyeti",
  preheat: "Tahmini Ön Isıtma", preheatNote: "AWS D1.1 bazlı tahmin. Gerçek ön ısıtma EN 1011-2 veya ilgili WPS'e göre belirlenmelidir.",
  formula: "Formül", value: "Değer", application: "Uygulama Alanı",
  ceIIW_app: "Genel amaçlı. C > 0.12% çelikler. EN 1011-2 Method A.",
  ceCET_app: "EN 1011-2 Method B. Düşük alaşımlı çelikler.",
  pcm_app: "Düşük karbonlu çelikler (C < 0.12%). Japon standardı.",
  cen_app: "Geniş bileşim aralığı. CE(IIW) ve Pcm arası geçiş.",
  interpretation: "Yorumlama Kılavuzu",
  interp_ceiiw: "CE(IIW) < 0.35: Mükemmel | 0.35-0.45: İyi/Orta | > 0.45: Ön ısıtma gerekli",
  interp_pcm: "Pcm < 0.20: Mükemmel | 0.20-0.25: İyi | > 0.25: Dikkatli olun",
  exportTxt: "Rapor (TXT)", free: "ÜCRETSİZ",
  none: "Gerekli değil", low: "Düşük", moderate: "Orta", high: "Yüksek", critical: "Kritik",
  references: "Referanslar",
  excellent: "Mükemmel", good: "İyi", fair: "Orta", poor: "Zayıf", veryPoor: "Çok Zayıf",
};
const EN = {
  title: "Carbon Equivalent Calculator",
  subtitle: "Weldability assessment and preheat estimation using CE(IIW), CET, Pcm and CEN formulas.",
  composition: "Chemical Composition (wt%)", preset: "Select Grade", thickness: "Wall Thickness",
  results: "Carbon Equivalent Results", weldability: "Weldability Rating",
  preheat: "Estimated Preheat", preheatNote: "AWS D1.1 based estimate. Actual preheat should be determined per EN 1011-2 or applicable WPS.",
  formula: "Formula", value: "Value", application: "Application",
  ceIIW_app: "General purpose. C > 0.12% steels. EN 1011-2 Method A.",
  ceCET_app: "EN 1011-2 Method B. Low-alloy steels.",
  pcm_app: "Low carbon steels (C < 0.12%). Japanese standard.",
  cen_app: "Wide composition range. Transition between CE(IIW) and Pcm.",
  interpretation: "Interpretation Guide",
  interp_ceiiw: "CE(IIW) < 0.35: Excellent | 0.35-0.45: Good/Fair | > 0.45: Preheat required",
  interp_pcm: "Pcm < 0.20: Excellent | 0.20-0.25: Good | > 0.25: Caution needed",
  exportTxt: "Report (TXT)", free: "FREE",
  none: "Not required", low: "Low", moderate: "Moderate", high: "High", critical: "Critical",
  references: "References",
  excellent: "Excellent", good: "Good", fair: "Fair", poor: "Poor", veryPoor: "Very Poor",
};

const WELD_TR = { Excellent: "Mükemmel", Good: "İyi", Fair: "Orta", Poor: "Zayıf", "Very Poor": "Çok Zayıf" };

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

// ─── CE BAR VISUALIZATION ───────────────────────────────
function CEBar({ label, value, zones, formula }) {
  const maxVal = Math.max(0.7, value + 0.1);
  const pct = Math.min(100, (value / maxVal) * 100);
  let barColor = "bg-green-500";
  if (value >= 0.45) barColor = "bg-red-500";
  else if (value >= 0.35) barColor = "bg-yellow-500";

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-white/[0.06]">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="text-sm font-bold text-dark-50">{label}</div>
          <div className="text-[10px] text-dark-300 font-mono mt-0.5">{formula}</div>
        </div>
        <div className="text-2xl font-black font-mono text-dark-50">{value.toFixed(3)}</div>
      </div>
      <div className="w-full bg-dark-800 rounded-full h-2.5 mt-3 border border-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      {zones && (
        <div className="flex justify-between mt-1.5 text-[9px] text-dark-300">
          {zones.map((z, i) => <span key={i}>{z}</span>)}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────
export default function CarbonEquivalentCalc() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [preset, setPreset] = useState("S355J2");
  const [data, setData] = useState({ ...PRESETS["S355J2"] });

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
    const iiw = ceIIW(data);
    const cet = ceCET(data);
    const pcm = cePcm(data);
    const cen = ceCEN(data);
    const ph = preheatFromCE(iiw, data.t);
    const weld = weldabilityRating(iiw, pcm);
    return { iiw, cet, pcm, cen, ph, weld };
  }, [data]);

  const phLevelTR = { none: t.none, low: t.low, moderate: t.moderate, high: t.high, critical: t.critical };
  const phColor = { none: "text-green-400", low: "text-blue-400", moderate: "text-yellow-400", high: "text-orange-400", critical: "text-red-400" };

  const exportReport = () => {
    const txt = `CARBON EQUIVALENT REPORT\n${"=".repeat(40)}\nGrade: ${preset}\nComposition: C=${data.C} Si=${data.Si} Mn=${data.Mn} Ni=${data.Ni} Cr=${data.Cr} Mo=${data.Mo} V=${data.V} Cu=${data.Cu} Nb=${data.Nb} B=${data.B}\nThickness: ${data.t} mm\n\nRESULTS\n-------\nCE(IIW): ${results.iiw.toFixed(3)}\nCET: ${results.cet.toFixed(3)}\nPcm: ${results.pcm.toFixed(3)}\nCEN: ${results.cen.toFixed(3)}\n\nWeldability: ${results.weld.rating}\nPreheat: ${results.ph.temp > 0 ? results.ph.temp + " °C" : "Not required"}\n`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "carbon_equivalent_report.txt"; a.click();
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
          <span className="text-dark-200 text-sm">🔥 CE Calc</span>
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
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1.5 block">{t.preset}</label>
              <select value={preset} onChange={handlePreset}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                {Object.keys(PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">🧪 {t.composition}</h2>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                <InputField label="C" name="C" value={data.C} unit="%" step="0.001" onChange={onChange} />
                <InputField label="Si" name="Si" value={data.Si} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Mn" name="Mn" value={data.Mn} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Ni" name="Ni" value={data.Ni} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Cr" name="Cr" value={data.Cr} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Mo" name="Mo" value={data.Mo} unit="%" step="0.01" onChange={onChange} />
                <InputField label="V" name="V" value={data.V} unit="%" step="0.001" onChange={onChange} />
                <InputField label="Cu" name="Cu" value={data.Cu} unit="%" step="0.01" onChange={onChange} />
                <InputField label="Nb" name="Nb" value={data.Nb} unit="%" step="0.001" onChange={onChange} />
                <InputField label="B" name="B" value={data.B} unit="%" step="0.0001" onChange={onChange} />
                <InputField label={t.thickness} name="t" value={data.t} unit="mm" step="1" onChange={onChange} />
              </div>
            </div>

            {/* Interpretation Guide */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <h3 className="text-xs font-semibold text-dark-100 mb-3">📖 {t.interpretation}</h3>
              <div className="space-y-2 text-[11px] text-dark-300">
                <p>{t.interp_ceiiw}</p>
                <p>{t.interp_pcm}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-5">
            {/* CE Results */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-gold-400/10 px-5 py-3 border-b border-gold-400/20">
                <h2 className="text-sm font-semibold text-gold-400">📊 {t.results}</h2>
              </div>
              <div className="p-5 space-y-4">
                <CEBar label="CE (IIW)" value={results.iiw}
                  formula="C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15"
                  zones={["0", "0.35", "0.45", "0.55", "0.70"]} />
                <CEBar label="CET" value={results.cet}
                  formula="C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40"
                  zones={["0", "0.25", "0.35", "0.45"]} />
                <CEBar label="Pcm" value={results.pcm}
                  formula="C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B"
                  zones={["0", "0.20", "0.25", "0.35"]} />
                <CEBar label="CEN (Yurioka)" value={results.cen}
                  formula="C + A(C)×[Si/24 + Mn/6 + Cu/15 + Ni/20 + (Cr+Mo+V+Nb)/5 + 5B]"
                  zones={["0", "0.30", "0.40", "0.50"]} />
              </div>
            </div>

            {/* Weldability + Preheat */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-5 border ${results.weld.bg}`}>
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-dark-300">{t.weldability}</div>
                <div className={`text-3xl font-black ${results.weld.color}`}>
                  {lang === "tr" ? (WELD_TR[results.weld.rating] || results.weld.rating) : results.weld.rating}
                </div>
                <div className="text-[10px] text-dark-300 mt-2">
                  CE(IIW): {results.iiw.toFixed(3)} | Pcm: {results.pcm.toFixed(3)}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-dark-300">{t.preheat}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black font-mono ${phColor[results.ph.level]}`}>
                    {results.ph.temp > 0 ? `${results.ph.temp}°C` : "—"}
                  </span>
                </div>
                <div className={`text-xs mt-1 font-semibold ${phColor[results.ph.level]}`}>
                  {phLevelTR[results.ph.level]}
                </div>
                <div className="text-[10px] text-dark-300 mt-2">{t.thickness}: {data.t} mm</div>
              </div>
            </div>

            {/* Preheat Note */}
            <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4 text-xs text-dark-300 flex items-start gap-2">
              <span className="shrink-0">⚠️</span>
              <p className="leading-relaxed">{t.preheatNote}</p>
            </div>

            {/* Formula Details Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-dark-100">📋 {t.formula} Detayları</h2>
              </div>
              <table className="w-full text-xs">
                <thead className="text-dark-300 bg-dark-800">
                  <tr>
                    <th className="px-4 py-2 text-left">{t.formula}</th>
                    <th className="px-4 py-2 text-center">{t.value}</th>
                    <th className="px-4 py-2 text-left">{t.application}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-2 text-dark-50 font-semibold">CE (IIW)</td>
                    <td className="px-4 py-2 text-center font-mono font-bold text-dark-50">{results.iiw.toFixed(3)}</td>
                    <td className="px-4 py-2 text-dark-300">{t.ceIIW_app}</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-2 text-dark-50 font-semibold">CET</td>
                    <td className="px-4 py-2 text-center font-mono font-bold text-dark-50">{results.cet.toFixed(3)}</td>
                    <td className="px-4 py-2 text-dark-300">{t.ceCET_app}</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="px-4 py-2 text-dark-50 font-semibold">Pcm</td>
                    <td className="px-4 py-2 text-center font-mono font-bold text-dark-50">{results.pcm.toFixed(3)}</td>
                    <td className="px-4 py-2 text-dark-300">{t.pcm_app}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-dark-50 font-semibold">CEN</td>
                    <td className="px-4 py-2 text-center font-mono font-bold text-dark-50">{results.cen.toFixed(3)}</td>
                    <td className="px-4 py-2 text-dark-300">{t.cen_app}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            
          {/* How-to Briefing */}
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Çelik Kalitesi Seç veya Manuel Gir", desc: "Hazır çelik kalitelerinden (S235JR, S355J2, X65 vb.) birini seç veya "Custom" ile kendi bileşimini gir." },
              { icon: "②", color: "#f59e0b", title: "Kimyasal Bileşimi Kontrol Et", desc: "C, Si, Mn, Ni, Cr, Mo, V, Cu, Nb, B değerlerini yüzde ağırlık olarak gir. Et kalınlığını (mm) belirle." },
              { icon: "③", color: "#8b5cf6", title: "Hesapla Butonuna Bas", desc: "CE(IIW), CET, Pcm ve CEN değerleri otomatik hesaplanır." },
              { icon: "④", color: "#10b981", title: "Sonuçları Değerlendir", desc: "Kaynak kabiliyeti derecelendirmesi, önerilen ön ısıtma sıcaklığı ve HAZ sertlik tahmini görüntülenir." }]
              : [{ icon: "①", color: "#3b82f6", title: "Select Steel Grade or Enter Manually", desc: "Choose from preset grades (S235JR, S355J2, X65 etc.) or select "Custom" to enter your own composition." },
              { icon: "②", color: "#f59e0b", title: "Check Chemical Composition", desc: "Enter C, Si, Mn, Ni, Cr, Mo, V, Cu, Nb, B values in weight percent. Set wall thickness (mm)." },
              { icon: "③", color: "#8b5cf6", title: "Click Calculate", desc: "CE(IIW), CET, Pcm and CEN values are computed automatically." },
              { icon: "④", color: "#10b981", title: "Evaluate Results", desc: "Weldability rating, recommended preheat temperature and HAZ hardness estimate are displayed." }]
            }
            formulas={[{ label: "CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", color: "#60a5fa" }, { label: "Pcm = C + Si/30 + (Mn+Cu+Cr)/20 + ...", color: "#34d399" }, { label: "CET = C + (Mn+Mo)/10 + (Cr+Cu)/20 + Ni/40", color: "#a78bfa" }]}
          />

          {/* References */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[10px] text-dark-300 font-bold uppercase mb-1">{t.references}</div>
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>• IIW Doc. IX-535-67 — Carbon Equivalent Formula</div>
                <div>• EN 1011-2:2001 — Welding of metallic materials, Annex C/D</div>
                <div>• Ito, Y. & Bessyo, K. (1968) — Pcm Formula (JWS)</div>
                <div>• Yurioka, N. et al. (1983) — CEN Formula (HW Vol.24)</div>
                <div>• AWS D1.1 — Structural Welding Code — Steel</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
