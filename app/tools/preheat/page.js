"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";

// ─── CE FORMULAS ────────────────────────────────────────
function ceIIW(c) { return c.C + c.Mn/6 + (c.Cr+c.Mo+c.V)/5 + (c.Ni+c.Cu)/15; }
function ceCET(c) { return c.C + (c.Mn+c.Mo)/10 + (c.Cr+c.Cu)/20 + c.Ni/40; }

// ─── PREHEAT CALCULATION METHODS ────────────────────────
// Method A: EN 1011-2 (CE_IIW based table lookup)
function preheatMethodA(ceiiw, thickness, hdLevel, heatInput) {
  // Simplified EN 1011-2 Method A lookup
  if (ceiiw < 0.30) return 0;
  if (ceiiw < 0.40) return thickness > 30 && hdLevel >= 2 ? 75 : 0;
  if (ceiiw < 0.50) {
    if (thickness <= 30) return 75;
    if (hdLevel >= 2) return 100;
    return 75;
  }
  if (ceiiw < 0.60) {
    if (thickness <= 30) return 100;
    if (thickness <= 60) return 150;
    return 200;
  }
  return Math.min(250, 150 + (ceiiw - 0.60) * 100);
}

// Method B: EN 1011-2 Formula (CET based)
// Tp = 697×CET + 160×tanh(d/35) + 62×HD^0.35 + (53×CET - 32)×Q - 328
function preheatMethodB(c, thickness, hdContent, heatInput) {
  const cet = ceCET(c);
  const d = thickness;
  const hd = hdContent;
  const q = heatInput;

  let tp = 697 * cet + 160 * Math.tanh(d / 35) + 62 * Math.pow(hd, 0.35) + (53 * cet - 32) * q - 328;
  return Math.max(0, Math.round(tp));
}

// Method C: AWS D1.1 (CE_IIW based)
function preheatMethodC(ceiiw, thickness) {
  if (ceiiw < 0.30) return 0;
  if (ceiiw < 0.35) return thickness > 25 ? 50 : 0;
  if (ceiiw < 0.40) return thickness > 25 ? 100 : 50;
  if (ceiiw < 0.45) return thickness > 25 ? 150 : 100;
  if (ceiiw < 0.50) return thickness > 25 ? 200 : 150;
  if (ceiiw < 0.55) return 200;
  return 250;
}

// ─── HYDROGEN LEVEL CONVERSION ──────────────────────────
const HYDROGEN_SCALES = {
  A: { range: ">15", content: 20, level: 5 },
  B: { range: "10-15", content: 12.5, level: 4 },
  C: { range: "5-10", content: 7.5, level: 3 },
  D: { range: "3-5", content: 4, level: 2 },
  E: { range: "<3", content: 2, level: 1 },
};

// ─── PRESETS ────────────────────────────────────────────
const PRESETS = {
  "Custom": { C:0.10, Si:0.25, Mn:1.20, Ni:0.05, Cr:0.05, Mo:0.01, V:0.005, Cu:0.02, Nb:0.02, B:0.0000 },
  "S235JR": { C:0.17, Si:0.25, Mn:1.40, Ni:0.02, Cr:0.03, Mo:0.01, V:0.003, Cu:0.02, Nb:0.005, B:0.0000 },
  "S355J2": { C:0.16, Si:0.35, Mn:1.40, Ni:0.02, Cr:0.05, Mo:0.01, V:0.005, Cu:0.02, Nb:0.025, B:0.0000 },
  "S460N": { C:0.16, Si:0.40, Mn:1.50, Ni:0.30, Cr:0.10, Mo:0.01, V:0.060, Cu:0.02, Nb:0.040, B:0.0000 },
  "S690Q": { C:0.16, Si:0.30, Mn:1.40, Ni:0.50, Cr:0.50, Mo:0.30, V:0.060, Cu:0.10, Nb:0.030, B:0.0020 },
  "S700MC": { C:0.07, Si:0.20, Mn:1.80, Ni:0.05, Cr:0.05, Mo:0.10, V:0.080, Cu:0.02, Nb:0.060, B:0.0000 },
  "X65 (API)": { C:0.08, Si:0.25, Mn:1.45, Ni:0.15, Cr:0.05, Mo:0.10, V:0.050, Cu:0.05, Nb:0.050, B:0.0000 },
  "X70 (API)": { C:0.07, Si:0.25, Mn:1.55, Ni:0.20, Cr:0.05, Mo:0.15, V:0.060, Cu:0.10, Nb:0.060, B:0.0000 },
  "A516 Gr.70": { C:0.22, Si:0.30, Mn:1.20, Ni:0.02, Cr:0.03, Mo:0.01, V:0.003, Cu:0.02, Nb:0.005, B:0.0000 },
  "P91 (CSEF)": { C:0.10, Si:0.30, Mn:0.45, Ni:0.20, Cr:8.50, Mo:0.95, V:0.200, Cu:0.05, Nb:0.060, B:0.0000 },
};

// ─── TRANSLATIONS ───────────────────────────────────────
const TR = {
  title: "Kaynak Ön Isıtma Hesaplayıcı",
  subtitle: "EN 1011-2 ve AWS D1.1 bazlı kaynak ön ısıtma sıcaklığı tahmini.",
  composition: "Kimyasal Bileşim (ağ.%)",
  preset: "Çelik Kalitesi",
  params: "Kaynak Parametreleri",
  thickness: "Toplam Et Kalınlığı",
  heatInput: "Isı Girdisi",
  hydrogenLevel: "Hidrojen Seviyesi",
  jointType: "Birleştirme Tipi",
  results: "Ön Isıtma Sonuçları",
  recommended: "Önerilen Ön Isıtma",
  comparison: "Yöntem Karşılaştırması",
  methodA: "EN 1011-2 Method A (CE IIW Tabloları)",
  methodB: "EN 1011-2 Method B (CET Formülü)",
  methodC: "AWS D1.1",
  maxInterpass: "Maksimum Ara Pas Sıcaklığı",
  pwht: "Ön Isıtma Sonrası Isıl İşlem (PWHT)",
  warnings: "Mühendislik Uyarıları",
  exportTxt: "Rapor (TXT)",
  free: "ÜCRETSİZ",
  references: "Referanslar",
  butt: "Alın Kaynağı",
  fillet: "Köşe Kaynağı",
  tJoint: "T-Birleştirmesi",
  yes: "Evet",
  no: "Hayır",
  scale: "Ölçek",
};

const EN = {
  title: "Weld Preheat Calculator",
  subtitle: "Preheat temperature estimation based on EN 1011-2 and AWS D1.1 standards.",
  composition: "Chemical Composition (wt%)",
  preset: "Steel Grade",
  params: "Welding Parameters",
  thickness: "Combined Thickness",
  heatInput: "Heat Input",
  hydrogenLevel: "Hydrogen Level",
  jointType: "Joint Type",
  results: "Preheat Results",
  recommended: "Recommended Preheat",
  comparison: "Method Comparison",
  methodA: "EN 1011-2 Method A (CE IIW Tables)",
  methodB: "EN 1011-2 Method B (CET Formula)",
  methodC: "AWS D1.1",
  maxInterpass: "Max Interpass Temperature",
  pwht: "Post-Weld Heat Treatment (PWHT)",
  warnings: "Engineering Warnings",
  exportTxt: "Report (TXT)",
  free: "FREE",
  references: "References",
  butt: "Butt Weld",
  fillet: "Fillet Weld",
  tJoint: "T-Joint",
  yes: "Yes",
  no: "No",
  scale: "Scale",
};

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

// ─── PREHEAT TEMPERATURE BAR ────────────────────────────
function PreheatBar({ method, temp, ceiiw }) {
  const getColor = () => {
    if (temp < 75) return "bg-green-500";
    if (temp < 100) return "bg-blue-500";
    if (temp < 150) return "bg-yellow-500";
    if (temp < 200) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (temp < 75) return "text-green-400";
    if (temp < 100) return "text-blue-400";
    if (temp < 150) return "text-yellow-400";
    if (temp < 200) return "text-orange-400";
    return "text-red-400";
  };

  const maxVal = 300;
  const pct = Math.min(100, (temp / maxVal) * 100);

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-white/[0.06]">
      <div className="flex justify-between items-start mb-1">
        <div className="text-sm font-bold text-dark-50">{method}</div>
        <div className={`text-2xl font-black font-mono ${getTextColor()}`}>{temp}°C</div>
      </div>
      <div className="w-full bg-dark-800 rounded-full h-2.5 mt-3 border border-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all ${getColor()}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] text-dark-300">
        <span>0°C</span>
        <span>100°C</span>
        <span>200°C</span>
        <span>300°C</span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────
export default function PreheatCalc() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [preset, setPreset] = useState("S355J2");
  const [data, setData] = useState({ ...PRESETS["S355J2"] });
  const [params, setParams] = useState({
    thickness: 25,
    heatInput: 2.0,
    hydrogenScale: "C",
    jointType: "butt",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setData(p => ({ ...p, [name]: parseFloat(value) || 0 }));
  };

  const onParamsChange = (e) => {
    const { name, value } = e.target;
    setParams(p => ({
      ...p,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handlePreset = (e) => {
    const key = e.target.value;
    setPreset(key);
    if (PRESETS[key]) setData({ ...PRESETS[key] });
  };

  const results = useMemo(() => {
    const ceiiw = ceIIW(data);
    const cet = ceCET(data);
    const hdScale = HYDROGEN_SCALES[params.hydrogenScale];
    const hdContent = hdScale.content;
    const hdLevel = hdScale.level;

    const tempA = preheatMethodA(ceiiw, params.thickness, hdLevel, params.heatInput);
    const tempB = preheatMethodB(data, params.thickness, hdContent, params.heatInput);
    const tempC = preheatMethodC(ceiiw, params.thickness);

    const recommended = Math.max(tempA, tempB, tempC);
    const maxInterpass = Math.min(250, recommended + 80);
    const needsPWHT = params.thickness > 60 || ceiiw > 0.50;

    return {
      ceiiw,
      cet,
      tempA,
      tempB,
      tempC,
      recommended,
      maxInterpass,
      needsPWHT,
      hdContent,
    };
  }, [data, params]);

  const generateWarnings = () => {
    const warnings = [];
    if (results.recommended > 200) {
      warnings.push("🔥 " + (lang === "tr" ? "200°C üzeri ön ısıtma: Düşük hidrojen kaynak tüketici malzemeleri kullanın" : "Preheat >200°C: Consider using lower hydrogen consumables"));
    }
    if (results.ceiiw > 0.55) {
      warnings.push("⚠️ " + (lang === "tr" ? "Yüksek CE (>0.55): Hidrojen çatlaması riski yüksek" : "High CE (>0.55): High risk of hydrogen-induced cracking"));
    }
    if (params.thickness > 60) {
      warnings.push("⚠️ " + (lang === "tr" ? "Kalın malzeme (>60mm): CE ne olursa olsun PWHT önerilir" : "Thick material (>60mm): PWHT recommended regardless of CE"));
    }
    if (data.B > 0.001) {
      warnings.push("⚠️ " + (lang === "tr" ? "Bor içeren çelik: Gerçek WPS ile doğrulayın" : "Boron-containing steel: Verify with actual WPS"));
    }
    return warnings;
  };

  const exportReport = () => {
    const warnings = generateWarnings();
    const txt = `WELD PREHEAT REPORT\n${"=".repeat(50)}\n\nGRADE: ${preset}\nComposition: C=${data.C} Si=${data.Si} Mn=${data.Mn} Ni=${data.Ni} Cr=${data.Cr} Mo=${data.Mo} V=${data.V} Cu=${data.Cu} Nb=${data.Nb} B=${data.B}\n\nWELDING PARAMETERS\n─────────────────\nCombined Thickness: ${params.thickness} mm\nHeat Input: ${params.heatInput} kJ/mm\nHydrogen Level: Scale ${params.hydrogenScale} (${HYDROGEN_SCALES[params.hydrogenScale].range} ml/100g)\nJoint Type: ${params.jointType}\n\nCARBON EQUIVALENT\n─────────────────\nCE(IIW): ${results.ceiiw.toFixed(3)}\nCET: ${results.cet.toFixed(3)}\n\nPREHEAT TEMPERATURE RESULTS\n──────────────────────────\nEN 1011-2 Method A: ${results.tempA}°C\nEN 1011-2 Method B: ${results.tempB}°C\nAWS D1.1: ${results.tempC}°C\n\nRECOMMENDED PREHEAT: ${results.recommended}°C\nMax Interpass Temp: ${results.maxInterpass}°C\nPWHT Required: ${results.needsPWHT ? "Yes" : "No"}\n\nWARNINGS\n────────\n${warnings.length > 0 ? warnings.join("\n") : "None"}\n\nSTANDARDS REFERENCE\nEN 1011-2:2001, AWS D1.1, ISO 15609-1\n`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "preheat_report.txt";
    a.click();
  };

  const warnings = generateWarnings();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">🔥 Preheat</span>
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
            {/* Grade Preset */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1.5 block">{t.preset}</label>
              <select value={preset} onChange={handlePreset}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                {Object.keys(PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* Chemical Composition */}
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
              </div>
            </div>

            {/* Welding Parameters */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">⚡ {t.params}</h2>
              </div>
              <div className="p-4 space-y-3">
                <InputField label={t.thickness} name="thickness" value={params.thickness} unit="mm" step="1" onChange={onParamsChange} />
                <InputField label={t.heatInput} name="heatInput" value={params.heatInput} unit="kJ/mm" step="0.1" onChange={onParamsChange} />

                <div>
                  <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{t.hydrogenLevel}</label>
                  <select name="hydrogenScale" value={params.hydrogenScale} onChange={onParamsChange}
                    className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                    <option value="A">Scale A: &gt;15 ml/100g (High)</option>
                    <option value="B">Scale B: 10-15 ml/100g (Medium)</option>
                    <option value="C">Scale C: 5-10 ml/100g (Low)</option>
                    <option value="D">Scale D: 3-5 ml/100g (Very Low)</option>
                    <option value="E">Scale E: &lt;3 ml/100g (Ultra Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{t.jointType}</label>
                  <select name="jointType" value={params.jointType} onChange={onParamsChange}
                    className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                    <option value="butt">{t.butt}</option>
                    <option value="fillet">{t.fillet}</option>
                    <option value="tJoint">{t.tJoint}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6">
              <div className="text-[10px] uppercase font-bold tracking-wider mb-2 text-dark-300">{t.recommended}</div>
              <div className="text-5xl font-black font-mono mb-1">
                <span className={results.recommended < 75 ? "text-green-400" : results.recommended < 150 ? "text-yellow-400" : results.recommended < 200 ? "text-orange-400" : "text-red-400"}>
                  {results.recommended}°C
                </span>
              </div>
              <div className="text-sm text-dark-300 mt-2">
                CE(IIW): {results.ceiiw.toFixed(3)} | Max Interpass: {results.maxInterpass}°C
              </div>
            </div>

            {/* Method Comparison */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-dark-100">📊 {t.comparison}</h2>
              </div>
              <div className="p-5 space-y-4">
                <PreheatBar method={t.methodA} temp={results.tempA} ceiiw={results.ceiiw} />
                <PreheatBar method={t.methodB} temp={results.tempB} ceiiw={results.ceiiw} />
                <PreheatBar method={t.methodC} temp={results.tempC} ceiiw={results.ceiiw} />
              </div>
            </div>

            {/* PWHT and Interpass */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-dark-300">{t.maxInterpass}</div>
                <div className="text-3xl font-black font-mono text-blue-400">{results.maxInterpass}°C</div>
                <div className="text-[10px] text-dark-300 mt-2">(Preheat + 80°C)</div>
              </div>

              <div className={`rounded-xl p-5 border ${results.needsPWHT ? "bg-orange-500/10 border-orange-500/20" : "bg-green-500/10 border-green-500/20"}`}>
                <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-dark-300">{t.pwht}</div>
                <div className={`text-2xl font-black ${results.needsPWHT ? "text-orange-400" : "text-green-400"}`}>
                  {results.needsPWHT ? t.yes : t.no}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-2">
                <div className="text-xs font-semibold text-red-400 uppercase">{t.warnings}</div>
                {warnings.map((w, i) => (
                  <div key={i} className="text-xs text-dark-300">{w}</div>
                ))}
              </div>
            )}

            
          {/* How-to Briefing */}
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Standart Seç", desc: "EN 1011-2 veya AWS D1.1 standardını seç." },
              { icon: "②", color: "#f59e0b", title: "Kimyasal Bileşimi Gir", desc: "C, Si, Mn, Ni, Cr, Mo, V, Cu, Nb, B değerlerini gir." },
              { icon: "③", color: "#8b5cf6", title: "Kaynak Parametrelerini Belirle", desc: "Et kalınlığı, ısı girdisi (kJ/mm) ve hidrojen seviyesini ayarla." },
              { icon: "④", color: "#10b981", title: "Sonuçları Değerlendir", desc: "Minimum ön ısıtma sıcaklığı, CE değerleri ve PWHT gerekliliği hesaplanır." }]
              : [{ icon: "①", color: "#3b82f6", title: "Select Standard", desc: "Choose between EN 1011-2 or AWS D1.1 standard." },
              { icon: "②", color: "#f59e0b", title: "Enter Chemical Composition", desc: "Input C, Si, Mn, Ni, Cr, Mo, V, Cu, Nb, B values." },
              { icon: "③", color: "#8b5cf6", title: "Set Welding Parameters", desc: "Set wall thickness, heat input (kJ/mm) and hydrogen level." },
              { icon: "④", color: "#10b981", title: "Evaluate Results", desc: "Minimum preheat temperature, CE values and PWHT requirement are computed." }]
            }
            formulas={[{ label: "EN 1011-2 Annex C/D", color: "#60a5fa" }, { label: "AWS D1.1 Table 3.2", color: "#34d399" }, { label: "Tp = f(CET, t, HD, Q)", color: "#a78bfa" }]}
          />

          {/* References */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[10px] text-dark-300 font-bold uppercase mb-1">{t.references}</div>
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>• EN 1011-2:2001 — Welding of metallic materials</div>
                <div>• AWS D1.1:2023 — Structural Welding Code-Steel</div>
                <div>• ISO 15609-1 — Qualification of welding procedures</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
