"use client";
import { useState } from "react";
import {
  Activity, Settings, Zap, ArrowDown, Weight,
  Calculator, ShieldAlert, Info, Play, X, Plus, Languages,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLang } from "@/lib/LanguageContext";

const G = 9.80665;        // m/s²
const MAX_ENERGY = 55000; // Joules — Pragya machine capacity

// ─── DS/EN 10274 DWTT Energy Estimation ──────────────────────────────────────
// Converts Charpy KV impact energy to required DWTT energy using cross-sectional
// area scaling per DS/EN 10274 (Drop Weight Tear Test standard).
//
// Formula:  E_req = 5.6 × KV × (A_dwtt / A_kv)
//   KV        = Charpy V-notch impact energy (J)
//   A_dwtt    = DWTT specimen net cross-section = dwttWidth × wallThickness (mm²)
//   A_kv      = Charpy specimen net cross-section = 10 × charpyThickness (mm²)
//   5.6       = empirical scaling factor (DS/EN 10274 / API 5L Annex G)
//   Target    = E_req × 1.5  (safety margin)
//
// Reference: DS/EN 10274:2017, API 5L 46th Ed. Annex G
function calcDWTTEnergy(kv, dwttWidth, wallThickness, charpyThickness) {
  const A_dwtt = dwttWidth * wallThickness;          // mm²
  const A_kv   = 10 * charpyThickness;               // mm²  (standard Charpy width = 10 mm)
  const E_req  = 5.6 * kv * (A_dwtt / A_kv);        // J
  return {
    E_req:    Math.round(E_req),
    E_target: Math.round(E_req * 1.5),               // recommended with 1.5× safety margin
    A_dwtt,
    A_kv,
  };
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  tr: {
    title: "DWTT SİMÜLASYON PANELİ",
    subtitle: "DS/EN 10274 Düşürme Ağırlığı Yırtılma Testi Arayüzü",
    systemStatus: "Sistem Durumu",
    sensorsOnline: "SENSÖRLER ÇEVRİMİÇİ",
    materialParams: "Malzeme Parametreleri",
    dwttWidth: "DWTT Numune Genişliği (mm)",
    wallThickness: "Et Kalınlığı (mm)",
    charpyEnergy: "Charpy Darbe Enerjisi KV (J)",
    charpyThickness: "Charpy Numune Kalınlığı (mm)",
    calcBtn: "DS/EN 10274 Enerji Hesapla",
    resultTitle: "Hesaplama Sonucu",
    eReq: "Gerekli DWTT Enerjisi (E_req)",
    eTarget: "Hedef Darbe Enerjisi (×1.5)",
    showFormula: "Formülü Göster",
    hideFormula: "Formülü Gizle",
    formulaNote: "DS/EN 10274 / API 5L Annex G — Alan ölçekleme faktörü: 5,6",
    machineConfig: "Makine Konfigürasyonu",
    heightSelection: "Yükseklik Sensörü Seçimi (m)",
    addSensor: "Sensör Ekle",
    fixedWeight: "Sabit Ağırlık (kg)",
    additionalWeight: "İlave Ağırlık Yüklemesi",
    total: "Toplam",
    liveTelemetry: "Canlı Telemetri",
    totalMass: "Toplam Kütle",
    impactVelocity: "Çarpma Hızı",
    impactEnergy: "Darbe Enerjisi",
    capacityUsage: "Kapasite Kullanımı",
    energySufficient: "ENERJİ YETERLİ",
    energyInsufficient: "YETERSİZ ENERJİ",
    targetExceeded: "Hedefin {val} J üzerinde",
    targetNeeded: "Hedefe ulaşmak için {val} J daha gerekli",
    waitingParams: "Test parametreleri bekleniyor...",
    startTest: "TESTİ BAŞLAT",
    formulaLine1: "E_req = 5,6 × KV × (A_dwtt / A_kv)",
    formulaLine2: "Hedef = E_req × 1,5",
    briefingTitle: "Nasıl Kullanılır?",
    briefingSteps: [
      {
        icon: "①",
        color: "#f59e0b",
        title: "Malzeme Parametrelerini Gir",
        desc: "DWTT numune genişliği (76,2 mm), boru et kalınlığı, Charpy KV enerjisi (J) ve Charpy numune kalınlığını gir.",
      },
      {
        icon: "②",
        color: "#3b82f6",
        title: "Enerji Hesapla",
        desc: "\"DS/EN 10274 Enerji Hesapla\" butonuna bas. E_req ve ×1,5 güvenlik marjlı hedef darbe enerjisi hesaplanır.",
      },
      {
        icon: "③",
        color: "#8b5cf6",
        title: "Yükseklik Sensörü Seç",
        desc: "Makine konfigürasyonundan istenen düşürme yüksekliğini seç (1,3 m – 3,77 m). Yeni sensör eklenebilir.",
      },
      {
        icon: "④",
        color: "#06b6d4",
        title: "Ağırlık Ayarla",
        desc: "Sabit ağırlık (562 kg) üzerine ilave ağırlık ekle. Kaydırıcı ile toplam kütleyi hassasça ayarla.",
      },
      {
        icon: "⑤",
        color: "#34d399",
        title: "Telemetriyi Kontrol Et",
        desc: "Çarpma hızı (√2gh) ve darbe enerjisi (m·g·h) anlık güncellenir. Kapasite çubuğu Pragya makinesi sınırını gösterir.",
      },
      {
        icon: "⑥",
        color: "#10b981",
        title: "Test Başlat",
        desc: "Makine enerjisi hedefe ulaştığında \"ENERJİ YETERLİ\" görünür ve TESTİ BAŞLAT butonu aktif hale gelir.",
      },
    ],
  },
  en: {
    title: "DWTT SIMULATION PANEL",
    subtitle: "DS/EN 10274 Drop-Weight Tear Test Interface",
    systemStatus: "System Status",
    sensorsOnline: "SENSORS ONLINE",
    materialParams: "Material Parameters",
    dwttWidth: "DWTT Specimen Width (mm)",
    wallThickness: "Wall Thickness (mm)",
    charpyEnergy: "Charpy Impact Energy KV (J)",
    charpyThickness: "Charpy Specimen Thickness (mm)",
    calcBtn: "Calculate DS/EN 10274 Energy",
    resultTitle: "Calculation Result",
    eReq: "Required DWTT Energy (E_req)",
    eTarget: "Target Impact Energy (×1.5)",
    showFormula: "Show Formula",
    hideFormula: "Hide Formula",
    formulaNote: "DS/EN 10274 / API 5L Annex G — Area scaling factor: 5.6",
    machineConfig: "Machine Configuration",
    heightSelection: "Height Sensor Selection (m)",
    addSensor: "Add Sensor",
    fixedWeight: "Fixed Weight (kg)",
    additionalWeight: "Additional Weight Loading",
    total: "Total",
    liveTelemetry: "Live Telemetry",
    totalMass: "Total Mass",
    impactVelocity: "Impact Velocity",
    impactEnergy: "Impact Energy",
    capacityUsage: "Capacity Usage",
    energySufficient: "ENERGY SUFFICIENT",
    energyInsufficient: "INSUFFICIENT ENERGY",
    targetExceeded: "{val} J above target",
    targetNeeded: "{val} J more needed to reach target",
    waitingParams: "Waiting for test parameters...",
    startTest: "START TEST",
    formulaLine1: "E_req = 5.6 × KV × (A_dwtt / A_kv)",
    formulaLine2: "Target = E_req × 1.5",
    briefingTitle: "How to Use",
    briefingSteps: [
      {
        icon: "①",
        color: "#f59e0b",
        title: "Enter Material Parameters",
        desc: "Input DWTT specimen width (76.2 mm), pipe wall thickness, Charpy KV energy (J), and Charpy specimen thickness.",
      },
      {
        icon: "②",
        color: "#3b82f6",
        title: "Calculate Energy",
        desc: "Click \"Calculate DS/EN 10274 Energy\". E_req and the target energy with 1.5× safety margin are computed.",
      },
      {
        icon: "③",
        color: "#8b5cf6",
        title: "Select Height Sensor",
        desc: "Choose the drop height from the machine config grid (1.3 m – 3.77 m). Custom sensor heights can be added.",
      },
      {
        icon: "④",
        color: "#06b6d4",
        title: "Adjust Weight",
        desc: "Add supplementary weight on top of the fixed 562 kg hammer. Use the slider for precise total mass control.",
      },
      {
        icon: "⑤",
        color: "#34d399",
        title: "Check Live Telemetry",
        desc: "Impact velocity (√2gh) and energy (m·g·h) update in real time. The capacity bar shows Pragya machine limits.",
      },
      {
        icon: "⑥",
        color: "#10b981",
        title: "Start Test",
        desc: "When machine energy meets the target, \"ENERGY SUFFICIENT\" is displayed and the START TEST button activates.",
      },
    ],
  },
};

export default function DWTTPage() {
  const { lang: siteLang } = useLang();
  const [lang, setLang] = useState(siteLang === "tr" ? "tr" : "en");
  const t = T[lang] || T.en;

  // ─── Material state (DS/EN 10274 inputs)
  const [dwttWidth,       setDwttWidth]       = useState(76.2);   // mm — standard DWTT specimen width
  const [wallThickness,   setWallThickness]   = useState(12.5);   // mm
  const [charpyEnergy,    setCharpyEnergy]    = useState(100);    // J — KV
  const [charpyThickness, setCharpyThickness] = useState(10);     // mm — full-size Charpy = 10×10

  // ─── UI state
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null);   // { E_req, E_target, A_dwtt, A_kv }
  const [showFormula,  setShowFormula]  = useState(false);

  // ─── Machine state
  const [fixedWeight,     setFixedWeight]     = useState(562);
  const [sensorHeights,   setSensorHeights]   = useState([1.3, 1.5, 1.88, 2.26, 2.64, 3.02, 3.39, 3.77]);
  const [newSensorValue,  setNewSensorValue]  = useState("");
  const [height,          setHeight]          = useState(1.3);
  const [additionalWeight,setAdditionalWeight]= useState(0);

  // ─── Sensor helpers
  const handleAddSensor = () => {
    const val = parseFloat(newSensorValue);
    if (!isNaN(val) && val > 0 && !sensorHeights.includes(val)) {
      const next = [...sensorHeights, val].sort((a, b) => a - b);
      setSensorHeights(next);
      setNewSensorValue("");
    }
  };
  const handleRemoveSensor = (h) => {
    const next = sensorHeights.filter((sh) => sh !== h);
    setSensorHeights(next);
    if (height === h && next.length > 0) setHeight(next[0]);
  };

  // ─── Physics (live)
  const totalWeight = fixedWeight + additionalWeight;
  const energy      = totalWeight * G * height;
  const velocity    = Math.sqrt(2 * G * height);

  // ─── Calculate handler
  const handleCalc = () => {
    setLoading(true);
    setTimeout(() => {
      const r = calcDWTTEnergy(charpyEnergy, dwttWidth, wallThickness, charpyThickness);
      setResult(r);
      setLoading(false);
    }, 500);
  };

  const energyDiff = result ? energy - result.E_target : null;

  // ─── Shared card style
  const card = {
    background: "rgb(15 23 42)",
    border: "1px solid #1e293b",
  };

  return (
    <div className="min-h-screen" style={{ background: "rgb(2 6 23)" }}>
      <Navbar />

      <div className="p-4 md:p-8" style={{ paddingTop: "80px", color: "#cbd5e1" }}>
        <div className="max-w-7xl mx-auto">

          {/* ─── Header ─── */}
          <header className="mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg" style={{ background: "rgba(59,130,246,0.1)" }}>
                <Activity className="w-8 h-8" style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">{t.title}</h1>
                <p className="text-sm mt-0.5 text-slate-500">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setLang(lang === "tr" ? "en" : "tr")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer font-sans transition-all"
                style={{ background: "rgb(15 23 42)", border: "1px solid #334155", color: "#cbd5e1" }}
              >
                <Languages className="w-4 h-4 text-blue-400" />
                {lang === "tr" ? "English" : "Türkçe"}
              </button>

              <div className="p-3 rounded-lg border text-left" style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(51,65,85,0.5)" }}>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.systemStatus}</div>
                <div className="text-xs flex items-center gap-2" style={{ color: "#34d399" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#34d399" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10b981" }} />
                  </span>
                  <span className="font-mono">{t.sensorsOnline}</span>
                </div>
              </div>
            </div>
          </header>

          {/* ─── Main Grid: 3 left + 9 right ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── LEFT COLUMN: Material Parameters ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Material Card */}
              <div className="relative rounded-xl p-6 overflow-hidden border" style={card}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <h2 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  {t.materialParams}
                </h2>

                <div className="space-y-4">
                  {/* DWTT Width */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{t.dwttWidth}</label>
                    <input
                      type="number" value={dwttWidth}
                      onChange={(e) => { setDwttWidth(Number(e.target.value)); setResult(null); }}
                      className="w-full rounded-lg p-2.5 text-slate-200 outline-none font-mono text-sm"
                      style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                    />
                  </div>

                  {/* Wall Thickness */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{t.wallThickness}</label>
                    <input
                      type="number" value={wallThickness}
                      onChange={(e) => { setWallThickness(Number(e.target.value)); setResult(null); }}
                      className="w-full rounded-lg p-2.5 text-slate-200 outline-none font-mono text-sm"
                      style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                    />
                  </div>

                  {/* Charpy Energy */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{t.charpyEnergy}</label>
                    <input
                      type="number" value={charpyEnergy}
                      onChange={(e) => { setCharpyEnergy(Number(e.target.value)); setResult(null); }}
                      className="w-full rounded-lg p-2.5 text-slate-200 outline-none font-mono text-sm"
                      style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                    />
                  </div>

                  {/* Charpy Thickness */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{t.charpyThickness}</label>
                    <input
                      type="number" value={charpyThickness}
                      onChange={(e) => { setCharpyThickness(Number(e.target.value)); setResult(null); }}
                      className="w-full rounded-lg p-2.5 text-slate-200 outline-none font-mono text-sm"
                      style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                    />
                  </div>

                  {/* Calculate Button */}
                  <button
                    onClick={handleCalc} disabled={loading}
                    className="w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2 cursor-pointer font-sans transition-all mt-2"
                    style={{ background: "rgb(30 41 59)", border: "1px solid #475569", color: "#e2e8f0" }}
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      : <Calculator className="w-4 h-4" />}
                    {t.calcBtn}
                  </button>
                </div>
              </div>

              {/* Result Card */}
              {result && (
                <div className="relative rounded-xl p-5 overflow-hidden border"
                  style={{ background: "rgba(6,78,59,0.2)", borderColor: "rgba(6,78,59,0.5)" }}>
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: "#10b981" }} />
                  <h3 className="font-semibold flex items-center gap-2 mb-4" style={{ color: "#34d399" }}>
                    <Info className="w-4 h-4" />
                    {t.resultTitle}
                  </h3>

                  {/* E_req */}
                  <div className="p-3 rounded-lg border mb-2" style={{ background: "rgba(6,78,59,0.3)", borderColor: "rgba(6,78,59,0.3)" }}>
                    <span className="text-xs block mb-1" style={{ color: "rgba(52,211,153,0.7)" }}>{t.eReq}</span>
                    <span className="text-xl font-mono font-bold" style={{ color: "#34d399" }}>
                      {result.E_req.toLocaleString()}
                      <span className="text-sm ml-1" style={{ color: "#059669" }}>J</span>
                    </span>
                  </div>

                  {/* E_target (×1.5) */}
                  <div className="p-3 rounded-lg border mb-3" style={{ background: "rgba(6,78,59,0.4)", borderColor: "rgba(6,78,59,0.3)" }}>
                    <span className="text-xs block mb-1" style={{ color: "rgba(52,211,153,0.7)" }}>{t.eTarget}</span>
                    <span className="text-2xl font-mono font-bold" style={{ color: "#34d399" }}>
                      {result.E_target.toLocaleString()}
                      <span className="text-base ml-1" style={{ color: "#059669" }}>J</span>
                    </span>
                  </div>

                  {/* Formula toggle */}
                  <button
                    onClick={() => setShowFormula(f => !f)}
                    className="w-full text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans transition-all mb-2"
                    style={{ background: "rgba(6,78,59,0.3)", border: "1px solid rgba(6,78,59,0.4)", color: "rgba(52,211,153,0.8)" }}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    {showFormula ? t.hideFormula : t.showFormula}
                  </button>

                  {showFormula && (
                    <div className="p-3 rounded-lg text-xs space-y-1.5" style={{ background: "rgba(2,6,23,0.5)", border: "1px solid rgba(6,78,59,0.4)" }}>
                      <div className="font-mono text-center py-1" style={{ color: "#34d399" }}>
                        {t.formulaLine1}
                      </div>
                      <div className="font-mono text-center py-1" style={{ color: "#34d399" }}>
                        {t.formulaLine2}
                      </div>
                      <div className="border-t pt-2 mt-2" style={{ borderColor: "rgba(6,78,59,0.3)" }}>
                        <div className="flex justify-between font-mono" style={{ color: "rgba(52,211,153,0.6)" }}>
                          <span>A_dwtt</span>
                          <span>{result.A_dwtt.toFixed(1)} mm²</span>
                        </div>
                        <div className="flex justify-between font-mono mt-1" style={{ color: "rgba(52,211,153,0.6)" }}>
                          <span>A_kv</span>
                          <span>{result.A_kv.toFixed(1)} mm²</span>
                        </div>
                        <div className="flex justify-between font-mono mt-1" style={{ color: "rgba(52,211,153,0.6)" }}>
                          <span>Ratio</span>
                          <span>{(result.A_dwtt / result.A_kv).toFixed(3)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] leading-relaxed pt-1" style={{ color: "rgba(52,211,153,0.5)" }}>
                        ℹ {t.formulaNote}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: Machine Config + Telemetry + Action ── */}
            <div className="lg:col-span-9 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Machine Config Card */}
                <div className="relative rounded-xl p-6 overflow-hidden border" style={card}>
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: "#334155" }} />
                  <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-400" />
                    {t.machineConfig}
                  </h2>

                  <div className="space-y-8">
                    {/* Height sensors */}
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <label className="text-sm font-medium text-slate-400">{t.heightSelection}</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number" step="0.01" value={newSensorValue}
                            onChange={(e) => setNewSensorValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddSensor()}
                            placeholder="0.00"
                            className="w-16 rounded p-1 text-xs text-slate-200 outline-none font-mono"
                            style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                          />
                          <button
                            onClick={handleAddSensor} title={t.addSensor}
                            className="p-1 rounded cursor-pointer transition-colors"
                            style={{ background: "rgb(30 41 59)", border: "1px solid #334155" }}
                          >
                            <Plus className="w-4 h-4 text-slate-300" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {sensorHeights.map((h) => (
                          <div key={h} className="relative group">
                            <button
                              onClick={() => setHeight(h)}
                              className="w-full py-2.5 rounded-lg font-mono text-sm cursor-pointer font-sans transition-all"
                              style={height === h
                                ? { background: "#2563eb", border: "1px solid #3b82f6", color: "white", boxShadow: "0 0 10px rgba(37,99,235,0.3)" }
                                : { background: "rgb(2 6 23)", border: "1px solid #1e293b", color: "#94a3b8" }}
                            >
                              {h}
                            </button>
                            <button
                              onClick={() => handleRemoveSensor(h)}
                              className="absolute -top-1.5 -right-1.5 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              style={{ background: "#ef4444" }}
                              title="Sensörü kaldır"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fixed weight */}
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <label className="text-sm font-medium text-slate-400">{t.fixedWeight}</label>
                        <input
                          type="number" value={fixedWeight}
                          onChange={(e) => setFixedWeight(Number(e.target.value))}
                          className="w-24 rounded-lg p-1.5 text-right text-slate-200 font-mono text-lg outline-none"
                          style={{ background: "rgb(2 6 23)", border: "1px solid #334155" }}
                        />
                      </div>
                    </div>

                    {/* Additional weight slider */}
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <label className="text-sm font-medium text-slate-400">{t.additionalWeight}</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono">+</span>
                          <input
                            type="number" min="0" max="1000" value={additionalWeight}
                            onChange={(e) => setAdditionalWeight(Number(e.target.value))}
                            className="w-24 rounded-lg p-1.5 text-right font-mono text-lg outline-none"
                            style={{ background: "rgb(2 6 23)", border: "1px solid #334155", color: "#60a5fa" }}
                          />
                          <span className="text-slate-500 font-mono">kg</span>
                        </div>
                      </div>
                      <input
                        type="range" min="0" max="1000" step="10" value={additionalWeight}
                        onChange={(e) => setAdditionalWeight(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        style={{ background: "rgb(2 6 23)" }}
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                        <span>0 kg</span>
                        <span>{t.total}: {totalWeight} kg</span>
                        <span>1000 kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Card */}
                <div className="relative rounded-xl p-6 overflow-hidden border flex flex-col" style={card}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                  <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    {t.liveTelemetry}
                  </h2>

                  <div className="space-y-4 flex-grow flex flex-col justify-center">
                    {/* Total mass */}
                    <div className="p-4 rounded-xl border flex justify-between items-center"
                      style={{ background: "rgb(2 6 23)", borderColor: "#1e293b" }}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: "rgb(15 23 42)" }}>
                          <Weight className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="font-medium text-slate-300">{t.totalMass}</span>
                      </div>
                      <span className="font-mono text-2xl text-slate-100">
                        {totalWeight} <span className="text-sm text-slate-500">kg</span>
                      </span>
                    </div>

                    {/* Impact velocity */}
                    <div className="p-4 rounded-xl border flex justify-between items-center"
                      style={{ background: "rgb(2 6 23)", borderColor: "#1e293b" }}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ background: "rgb(6 36 27)" }}>
                          <ArrowDown className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-medium text-slate-300">{t.impactVelocity}</span>
                      </div>
                      <span className="font-mono text-2xl text-emerald-400">
                        {velocity.toFixed(2)} <span className="text-sm" style={{ color: "rgba(52,211,153,0.7)" }}>m/s</span>
                      </span>
                    </div>

                    {/* Impact energy — highlighted */}
                    <div className="relative p-5 rounded-xl border flex justify-between items-center overflow-hidden"
                      style={{ background: "rgba(30,58,138,0.2)", borderColor: "rgba(30,58,138,0.4)" }}>
                      <div className="absolute right-0 top-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10"
                        style={{ background: "rgba(59,130,246,0.05)" }} />
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 rounded-lg" style={{ background: "rgba(30,58,138,0.5)" }}>
                          <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="font-medium text-blue-300">{t.impactEnergy}</span>
                      </div>
                      <span className="font-mono text-3xl font-bold text-blue-400 relative z-10">
                        {Math.round(energy).toLocaleString()}
                        <span className="text-base font-normal ml-1" style={{ color: "rgba(96,165,250,0.7)" }}>J</span>
                      </span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium uppercase tracking-wider">{t.capacityUsage}</span>
                      <span className="text-slate-400 font-mono">{Math.round((energy / MAX_ENERGY) * 100)}%</span>
                    </div>
                    <div className="w-full rounded-full h-2 border" style={{ background: "rgb(2 6 23)", borderColor: "#1e293b" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (energy / MAX_ENERGY) * 100)}%`,
                          background: "linear-gradient(to right, #2563eb, #60a5fa)",
                        }}
                      />
                    </div>
                    <div className="text-right text-[10px] text-slate-600 mt-1 font-mono">
                      MAX: {MAX_ENERGY.toLocaleString()} J (Pragya)
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Action Area ── */}
              <div className="rounded-xl p-6 border" style={card}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                  {/* Status indicator */}
                  <div className="w-full sm:w-auto">
                    {result ? (
                      (energyDiff ?? 0) >= 0 ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                          style={{ color: "#34d399", background: "rgba(6,78,59,0.3)", borderColor: "rgba(6,78,59,0.5)" }}>
                          <div className="w-2.5 h-2.5 rounded-full"
                            style={{ background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.8)" }} />
                          <div>
                            <div className="text-sm font-bold tracking-wide">{t.energySufficient}</div>
                            <div className="text-xs mt-0.5 font-mono" style={{ color: "rgba(52,211,153,0.8)" }}>
                              {t.targetExceeded.replace("{val}", Math.round(energyDiff ?? 0).toLocaleString())}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                          style={{ color: "#fbbf24", background: "rgba(120,53,15,0.3)", borderColor: "rgba(120,53,15,0.5)" }}>
                          <div className="w-2.5 h-2.5 rounded-full"
                            style={{ background: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.8)" }} />
                          <div>
                            <div className="text-sm font-bold tracking-wide">{t.energyInsufficient}</div>
                            <div className="text-xs mt-0.5 font-mono" style={{ color: "rgba(251,191,36,0.8)" }}>
                              {t.targetNeeded.replace("{val}", Math.abs(Math.round(energyDiff ?? 0)).toLocaleString())}
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                        style={{ color: "#64748b", background: "rgb(2 6 23)", borderColor: "#1e293b" }}>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                        <div className="text-sm font-medium">{t.waitingParams}</div>
                      </div>
                    )}
                  </div>

                  {/* Start Test button */}
                  <button
                    className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold tracking-wider flex items-center justify-center gap-3 cursor-pointer font-sans transition-all"
                    style={result && (energyDiff ?? 0) >= 0
                      ? { background: "#2563eb", color: "white", boxShadow: "0 0 20px rgba(37,99,235,0.4)", border: "none" }
                      : { background: "rgb(30 41 59)", color: "#475569", border: "1px solid #334155", cursor: "not-allowed" }}
                  >
                    <Play className={`w-5 h-5 ${result && (energyDiff ?? 0) >= 0 ? "fill-white" : ""}`} />
                    {t.startTest}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Technical footnote ─── */}
          <div className="mt-6 text-xs text-slate-600 border-t border-slate-800 pt-4 font-mono">
            E_req = 5.6 × KV × (A_dwtt / A_kv) | Target = E_req × 1.5 | G = {G} m/s²
            | E_kinetic = m·g·h | v_impact = √(2·g·h) | Machine capacity: {MAX_ENERGY.toLocaleString()} J (Pragya DWTT)
          </div>

          {/* ─── How-to Briefing ─── */}
          <div className="mt-10 rounded-2xl overflow-hidden border" style={{ background: "rgb(15 23 42)", borderColor: "#1e293b" }}>
            {/* Header bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800"
              style={{ background: "rgba(30,41,59,0.6)" }}>
              <div className="p-1.5 rounded-lg" style={{ background: "rgba(59,130,246,0.15)" }}>
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-200 tracking-wide">{t.briefingTitle}</h3>
              <div className="ml-auto flex gap-1.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: t.briefingSteps[i].color, opacity: 0.7 }} />
                ))}
              </div>
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
              {t.briefingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-5 flex gap-4"
                  style={{
                    borderRight: (idx + 1) % 3 !== 0 ? "1px solid #1e293b" : "none",
                    borderBottom: idx < 3 ? "1px solid #1e293b" : "none",
                  }}
                >
                  {/* Subtle left accent */}
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ background: step.color, opacity: 0.5 }} />

                  {/* Icon circle */}
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
                    {step.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-200 mb-1">{step.title}</div>
                    <div className="text-xs leading-relaxed text-slate-400">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom formula strip */}
            <div className="px-6 py-3 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-center"
              style={{ background: "rgba(2,6,23,0.5)" }}>
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                E_req = 5.6 × KV × (A_dwtt / A_kv)
              </span>
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                Target = E_req × 1.5
              </span>
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>
                E_kinetic = m · g · h
              </span>
              <span className="font-mono text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(6,182,212,0.1)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.2)" }}>
                v = √(2·g·h)
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
