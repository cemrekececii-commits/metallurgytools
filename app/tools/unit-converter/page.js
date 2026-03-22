"use client";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = {
  stress: { name: "Gerilme / Dayanım", icon: "💪",
    units: { mpa: { label: "Megapascal (MPa)", factor: 1 }, ksi: { label: "ksi (kip/in²)", factor: 6.89476 }, nmm2: { label: "N/mm²", factor: 1 }, kgfmm2: { label: "kgf/mm²", factor: 9.80665 }, gpa: { label: "Gigapascal (GPa)", factor: 1000 } }, base: "mpa" },
  force: { name: "Kuvvet", icon: "⚡",
    units: { n: { label: "Newton (N)", factor: 1 }, kn: { label: "Kilonewton (kN)", factor: 1000 }, kgf: { label: "Kilogram-kuvvet (kgf)", factor: 9.80665 }, lbf: { label: "Pound-kuvvet (lbf)", factor: 4.44822 }, mn: { label: "Meganewton (MN)", factor: 1000000 } }, base: "n" },
  energy: { name: "Enerji (Darbe)", icon: "💥",
    units: { j: { label: "Joule (J)", factor: 1 }, ftlb: { label: "Foot-pound (ft·lb)", factor: 1.35582 }, kgfm: { label: "kgf·m", factor: 9.80665 }, kj: { label: "Kilojoule (kJ)", factor: 1000 }, cal: { label: "Kalori (cal)", factor: 4.184 } }, base: "j" },
  temperature: { name: "Sıcaklık", icon: "🌡️",
    units: { celsius: { label: "Celsius (°C)" }, fahrenheit: { label: "Fahrenheit (°F)" }, kelvin: { label: "Kelvin (K)" } }, custom: true },
  pressure: { name: "Basınç", icon: "🔴",
    units: { mpa: { label: "Megapascal (MPa)", factor: 1 }, psi: { label: "psi", factor: 0.00689476 }, bar: { label: "Bar", factor: 0.1 }, kgfcm2: { label: "kgf/cm²", factor: 0.0980665 }, atm: { label: "Atmosfer (atm)", factor: 0.101325 }, kpa: { label: "Kilopascal (kPa)", factor: 0.001 } }, base: "mpa" },
  length: { name: "Uzunluk", icon: "📏",
    units: { mm: { label: "Milimetre (mm)", factor: 1 }, cm: { label: "Santimetre (cm)", factor: 10 }, m: { label: "Metre (m)", factor: 1000 }, um: { label: "Mikrometre (μm)", factor: 0.001 }, inch: { label: "İnç (in)", factor: 25.4 }, ft: { label: "Feet (ft)", factor: 304.8 } }, base: "mm" },
  area: { name: "Alan", icon: "⬜",
    units: { mm2: { label: "mm²", factor: 1 }, cm2: { label: "cm²", factor: 100 }, m2: { label: "m²", factor: 1000000 }, in2: { label: "in²", factor: 645.16 }, ft2: { label: "ft²", factor: 92903 } }, base: "mm2" },
  mass: { name: "Kütle", icon: "⚖️",
    units: { g: { label: "Gram (g)", factor: 1 }, kg: { label: "Kilogram (kg)", factor: 1000 }, mg: { label: "Miligram (mg)", factor: 0.001 }, ton: { label: "Metrik Ton (t)", factor: 1000000 }, lb: { label: "Pound (lb)", factor: 453.592 }, oz: { label: "Ounce (oz)", factor: 28.3495 } }, base: "g" },
};

function convertTemperature(value, from, to) {
  let c;
  if (from === "celsius") c = value;
  else if (from === "fahrenheit") c = (value - 32) * 5 / 9;
  else c = value - 273.15;
  if (to === "celsius") return c;
  if (to === "fahrenheit") return c * 9 / 5 + 32;
  return c + 273.15;
}

function convertStandard(value, fromUnit, toUnit, category) {
  const cat = CATEGORIES[category];
  return (value * cat.units[fromUnit].factor) / cat.units[toUnit].factor;
}

export default function UnitConverter() {
  const [category, setCategory] = useState("stress");
  const [fromUnit, setFromUnit] = useState("mpa");
  const [inputValue, setInputValue] = useState("");
  const [allResults, setAllResults] = useState(null);

  const cat = CATEGORIES[category];
  const unitKeys = Object.keys(cat.units);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const keys = Object.keys(CATEGORIES[newCat].units);
    setFromUnit(keys[0]);
    setInputValue("");
    setAllResults(null);
  };

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;
    const results = {};
    for (const key of unitKeys) {
      results[key] = cat.custom ? convertTemperature(val, fromUnit, key) : convertStandard(val, fromUnit, key, category);
    }
    setAllResults(results);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleConvert(); };

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1000000) return num.toExponential(3);
    if (Math.abs(num) >= 100) return num.toFixed(2);
    if (Math.abs(num) >= 1) return num.toFixed(4);
    if (Math.abs(num) >= 0.001) return num.toFixed(6);
    return num.toExponential(3);
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
          <span className="text-dark-200 text-sm">📐 Unit Converter</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">FREE</span>
          <Link href="/pricing" className="text-gold-400 text-sm no-underline hover:underline">Upgrade →</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Engineering Unit Converter</h1>
        <p className="text-dark-300 text-sm mb-8">
          Metalurji ve malzeme mühendisliğinde kullanılan birimler arası dönüşüm. Gerilme, kuvvet, enerji, sıcaklık ve daha fazlası.
        </p>

        <div className="flex gap-2 mb-6 overflow-x-auto flex-wrap">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <button key={key} onClick={() => handleCategoryChange(key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer border font-sans ${category === key ? "bg-gold-400/15 border-gold-400/40 text-gold-400" : "bg-white/[0.03] border-white/[0.08] text-dark-200 hover:border-white/20"}`}>
              <span>{c.icon}</span>{c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">GİRİŞ — {cat.name}</h2>
            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">Kaynak Birim</label>
              <select value={fromUnit} onChange={(e) => { setFromUnit(e.target.value); setAllResults(null); }}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                {unitKeys.map((key) => (<option key={key} value={key}>{cat.units[key].label}</option>))}
              </select>
            </div>
            <div className="mb-6">
              <label className="text-xs text-dark-300 block mb-1">Değer</label>
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Değer girin..." className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-lg text-dark-50 focus:border-gold-400/50 focus:outline-none font-mono" />
            </div>
            <button onClick={handleConvert} disabled={!inputValue}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all font-sans border-none ${inputValue ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20" : "bg-white/5 text-dark-300 cursor-not-allowed"}`}>
              Çevir
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">TÜM BİRİMLER</h2>
            {allResults ? (
              <div className="space-y-2 animate-fade-in">
                {unitKeys.map((key) => {
                  const isSource = key === fromUnit;
                  return (
                    <div key={key} className={`rounded-lg p-3 flex justify-between items-center ${isSource ? "bg-gold-400/10 border border-gold-400/20" : "bg-dark-800"}`}>
                      <div className="text-xs text-dark-300 max-w-[140px]">{cat.units[key].label}</div>
                      <div className={`text-lg font-bold font-mono ${isSource ? "text-gold-400" : "text-dark-50"}`}>{formatNumber(allResults[key])}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="text-sm">Değer girin ve Çevir'e tıklayın</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-3">Sık Kullanılan Dönüşümler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-dark-300">
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Gerilme</div>1 MPa = 0.145 ksi = 1 N/mm²</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Darbe Enerjisi</div>1 J = 0.738 ft·lb = 0.102 kgf·m</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Sıcaklık</div>°F = °C × 9/5 + 32 | K = °C + 273.15</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Uzunluk</div>1 inch = 25.4 mm | 1 ft = 304.8 mm</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Basınç</div>1 MPa = 145 psi = 10 bar</div>
            <div className="bg-dark-800 rounded-lg p-3"><div className="text-dark-100 font-medium mb-1">Kuvvet</div>1 kN = 101.97 kgf = 224.81 lbf</div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Daha fazla araç mı istiyorsunuz?</h3>
          <p className="text-dark-300 text-sm mb-4">Grain Size Analyzer, Corrosion Calculator, Fe-C Phase Diagram ve daha fazlası için üye olun.</p>
          <Link href="/pricing" className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 rounded-lg px-6 py-2.5 text-sm font-semibold no-underline hover:shadow-lg hover:shadow-gold-400/20 transition-all">
            Planları İncele →
          </Link>
        </div>
      </div>
    </div>
  );
}
