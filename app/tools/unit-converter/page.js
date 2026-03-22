"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const CATEGORIES = {
  stress: { nameKey: "catStress", icon: "💪", units: { mpa: { label: "Megapascal (MPa)", factor: 1 }, ksi: { label: "ksi (kip/in²)", factor: 6.89476 }, nmm2: { label: "N/mm²", factor: 1 }, kgfmm2: { label: "kgf/mm²", factor: 9.80665 }, gpa: { label: "Gigapascal (GPa)", factor: 1000 } }, base: "mpa" },
  force: { nameKey: "catForce", icon: "⚡", units: { n: { label: "Newton (N)", factor: 1 }, kn: { label: "Kilonewton (kN)", factor: 1000 }, kgf: { label: "kgf", factor: 9.80665 }, lbf: { label: "lbf", factor: 4.44822 }, mn: { label: "Meganewton (MN)", factor: 1000000 } }, base: "n" },
  energy: { nameKey: "catEnergy", icon: "💥", units: { j: { label: "Joule (J)", factor: 1 }, ftlb: { label: "ft·lb", factor: 1.35582 }, kgfm: { label: "kgf·m", factor: 9.80665 }, kj: { label: "kJ", factor: 1000 }, cal: { label: "cal", factor: 4.184 } }, base: "j" },
  temperature: { nameKey: "catTemp", icon: "🌡️", units: { celsius: { label: "°C" }, fahrenheit: { label: "°F" }, kelvin: { label: "K" } }, custom: true },
  pressure: { nameKey: "catPressure", icon: "🔴", units: { mpa: { label: "MPa", factor: 1 }, psi: { label: "psi", factor: 0.00689476 }, bar: { label: "Bar", factor: 0.1 }, kgfcm2: { label: "kgf/cm²", factor: 0.0980665 }, atm: { label: "atm", factor: 0.101325 } }, base: "mpa" },
  length: { nameKey: "catLength", icon: "📏", units: { mm: { label: "mm", factor: 1 }, cm: { label: "cm", factor: 10 }, m: { label: "m", factor: 1000 }, um: { label: "μm", factor: 0.001 }, inch: { label: "in", factor: 25.4 }, ft: { label: "ft", factor: 304.8 } }, base: "mm" },
  area: { nameKey: "catArea", icon: "⬜", units: { mm2: { label: "mm²", factor: 1 }, cm2: { label: "cm²", factor: 100 }, m2: { label: "m²", factor: 1000000 }, in2: { label: "in²", factor: 645.16 } }, base: "mm2" },
  mass: { nameKey: "catMass", icon: "⚖️", units: { g: { label: "g", factor: 1 }, kg: { label: "kg", factor: 1000 }, mg: { label: "mg", factor: 0.001 }, ton: { label: "t", factor: 1000000 }, lb: { label: "lb", factor: 453.592 } }, base: "g" },
};

function convTemp(v, f, to) { let c = f === "celsius" ? v : f === "fahrenheit" ? (v-32)*5/9 : v-273.15; return to === "celsius" ? c : to === "fahrenheit" ? c*9/5+32 : c+273.15; }
function conv(v, f, to, cat) { const c = CATEGORIES[cat]; return (v * c.units[f].factor) / c.units[to].factor; }
function fmt(n) { if (Math.abs(n) >= 1e6) return n.toExponential(3); if (Math.abs(n) >= 100) return n.toFixed(2); if (Math.abs(n) >= 1) return n.toFixed(4); return n.toExponential(3); }

export default function UnitConverter() {
  const [category, setCategory] = useState("stress");
  const [fromUnit, setFromUnit] = useState("mpa");
  const [inputValue, setInputValue] = useState("");
  const [allResults, setAllResults] = useState(null);
  const { t, lang, switchLang } = useLang();

  const cat = CATEGORIES[category];
  const unitKeys = Object.keys(cat.units);

  const handleCategoryChange = (c) => { setCategory(c); setFromUnit(Object.keys(CATEGORIES[c].units)[0]); setInputValue(""); setAllResults(null); };
  const handleConvert = () => { const v = parseFloat(inputValue); if (isNaN(v)) return; const r = {}; unitKeys.forEach(k => { r[k] = cat.custom ? convTemp(v, fromUnit, k) : conv(v, fromUnit, k, category); }); setAllResults(r); };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">📐 {t.unitConverterShort}</span>
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">{t.unitTitle}</h1>
        <p className="text-dark-300 text-sm mb-8">{t.unitSubtitle}</p>

        <div className="flex gap-2 mb-6 overflow-x-auto flex-wrap">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <button key={key} onClick={() => handleCategoryChange(key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer border font-sans ${category === key ? "bg-gold-400/15 border-gold-400/40 text-gold-400" : "bg-white/[0.03] border-white/[0.08] text-dark-200 hover:border-white/20"}`}>
              <span>{c.icon}</span>{t[c.nameKey]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">{t.input} — {t[cat.nameKey]}</h2>
            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">{t.sourceUnit}</label>
              <select value={fromUnit} onChange={(e) => { setFromUnit(e.target.value); setAllResults(null); }}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                {unitKeys.map((k) => (<option key={k} value={k}>{cat.units[k].label}</option>))}
              </select>
            </div>
            <div className="mb-6">
              <label className="text-xs text-dark-300 block mb-1">{t.value}</label>
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                placeholder="..." className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-lg text-dark-50 focus:border-gold-400/50 focus:outline-none font-mono" />
            </div>
            <button onClick={handleConvert} disabled={!inputValue}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all font-sans border-none ${inputValue ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20" : "bg-white/5 text-dark-300 cursor-not-allowed"}`}>{t.convert}</button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">{t.allUnits}</h2>
            {allResults ? (
              <div className="space-y-2 animate-fade-in">
                {unitKeys.map((k) => (<div key={k} className={`rounded-lg p-3 flex justify-between items-center ${k === fromUnit ? "bg-gold-400/10 border border-gold-400/20" : "bg-dark-800"}`}>
                  <div className="text-xs text-dark-300">{cat.units[k].label}</div>
                  <div className={`text-lg font-bold font-mono ${k === fromUnit ? "text-gold-400" : "text-dark-50"}`}>{fmt(allResults[k])}</div>
                </div>))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">{cat.icon}</div><div className="text-sm">{t.enterAndConvert}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-3">{t.commonConversions}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-dark-300">
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">{t.catStress}</div>1 MPa = 0.145 ksi = 1 N/mm²</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">{t.catEnergy}</div>1 J = 0.738 ft·lb = 0.102 kgf·m</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">{t.catTemp}</div>°F = °C × 9/5 + 32 | K = °C + 273.15</div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">{t.wantMore}</h3>
          <p className="text-dark-300 text-sm mb-4">{t.wantMoreDesc}</p>
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">{t.viewPlans}</Link>
        </div>
      </div>
    </div>
  );
}
