"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const HARDNESS_TABLE = [
  { hrc: 68, hv: 940, hb: null, hrb: null, mpa: null },
  { hrc: 65, hv: 832, hb: null, hrb: null, mpa: 2393 },
  { hrc: 62, hv: 746, hb: null, hrb: null, mpa: 2186 },
  { hrc: 60, hv: 697, hb: null, hrb: null, mpa: 2048 },
  { hrc: 58, hv: 653, hb: null, hrb: null, mpa: 1924 },
  { hrc: 56, hv: 613, hb: null, hrb: null, mpa: 1800 },
  { hrc: 54, hv: 577, hb: null, hrb: null, mpa: 1689 },
  { hrc: 52, hv: 544, hb: null, hrb: null, mpa: 1579 },
  { hrc: 50, hv: 513, hb: null, hrb: null, mpa: 1482 },
  { hrc: 48, hv: 484, hb: null, hrb: null, mpa: 1386 },
  { hrc: 46, hv: 458, hb: null, hrb: null, mpa: 1296 },
  { hrc: 45, hv: 446, hb: 421, hrb: null, mpa: 1255 },
  { hrc: 43, hv: 423, hb: 400, hrb: null, mpa: 1172 },
  { hrc: 41, hv: 402, hb: 381, hrb: null, mpa: 1096 },
  { hrc: 40, hv: 392, hb: 371, hrb: null, mpa: 1062 },
  { hrc: 38, hv: 372, hb: 353, hrb: null, mpa: 1000 },
  { hrc: 36, hv: 354, hb: 336, hrb: null, mpa: 951 },
  { hrc: 34, hv: 337, hb: 319, hrb: null, mpa: 903 },
  { hrc: 32, hv: 321, hb: 301, hrb: null, mpa: 862 },
  { hrc: 30, hv: 306, hb: 286, hrb: null, mpa: 820 },
  { hrc: 28, hv: 292, hb: 271, hrb: null, mpa: 779 },
  { hrc: 26, hv: 278, hb: 258, hrb: null, mpa: 738 },
  { hrc: 24, hv: 266, hb: 247, hrb: 99.5, mpa: 696 },
  { hrc: 22, hv: 254, hb: 237, hrb: 98.5, mpa: 669 },
  { hrc: 20, hv: 243, hb: 226, hrb: 97, mpa: 641 },
  { hrc: null, hv: 230, hb: 217, hrb: 95.5, mpa: 614 },
  { hrc: null, hv: 213, hb: 207, hrb: 93.5, mpa: 579 },
  { hrc: null, hv: 196, hb: 197, hrb: 91, mpa: 538 },
  { hrc: null, hv: 180, hb: 183, hrb: 87.5, mpa: 503 },
  { hrc: null, hv: 166, hb: 170, hrb: 84, mpa: 462 },
  { hrc: null, hv: 154, hb: 156, hrb: 79.5, mpa: 434 },
  { hrc: null, hv: 142, hb: 143, hrb: 74.5, mpa: 393 },
  { hrc: null, hv: 131, hb: 131, hrb: 69, mpa: 365 },
  { hrc: null, hv: 121, hb: 121, hrb: 64, mpa: 338 },
  { hrc: null, hv: 111, hb: 111, hrb: 58, mpa: 310 },
];

function findClosest(value, key) {
  const valid = HARDNESS_TABLE.filter((r) => r[key] !== null);
  let closest = valid[0]; let minDiff = Math.abs(valid[0][key] - value);
  for (const row of valid) { const diff = Math.abs(row[key] - value); if (diff < minDiff) { minDiff = diff; closest = row; } }
  return closest;
}

const SCALES = [
  { key: "hrc", label: "HRC (Rockwell C)", unit: "HRC", min: 20, max: 68 },
  { key: "hrb", label: "HRB (Rockwell B)", unit: "HRB", min: 58, max: 100 },
  { key: "hv", label: "HV (Vickers)", unit: "HV", min: 111, max: 940 },
  { key: "hb", label: "HB (Brinell)", unit: "HB", min: 111, max: 421 },
  { key: "mpa", label: "Tensile Strength", unit: "MPa", min: 310, max: 2393 },
];

export default function HardnessConverter() {
  const [fromScale, setFromScale] = useState("hrc");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const { t, lang, switchLang } = useLang();

  const handleConvert = () => { const val = parseFloat(inputValue); if (!isNaN(val)) setResult(findClosest(val, fromScale)); };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">🔧 {t.hardnessShort}</span>
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
        <h1 className="text-2xl font-bold tracking-tight mb-2">{t.hardnessTitle}</h1>
        <p className="text-dark-300 text-sm mb-8">{t.hardnessSubtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">{t.input}</h2>
            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">{t.sourceScale}</label>
              <select value={fromScale} onChange={(e) => { setFromScale(e.target.value); setResult(null); }}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                {SCALES.map((s) => (<option key={s.key} value={s.key}>{s.label}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">{t.value} ({SCALES.find((s) => s.key === fromScale)?.unit})</label>
              <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                placeholder={fromScale === "hrc" ? "45" : fromScale === "hv" ? "450" : "200"}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
            </div>
            <div className="mb-6 text-xs text-dark-300">{t.validRange}: {SCALES.find((s) => s.key === fromScale)?.min} – {SCALES.find((s) => s.key === fromScale)?.max} {SCALES.find((s) => s.key === fromScale)?.unit}</div>
            <button onClick={handleConvert} disabled={!inputValue}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all font-sans border-none ${inputValue ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20" : "bg-white/5 text-dark-300 cursor-not-allowed"}`}>{t.convert}</button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">{t.results}</h2>
            {result ? (
              <div className="space-y-3 animate-fade-in">
                {SCALES.map((s) => {
                  const val = result[s.key]; const isSource = s.key === fromScale;
                  return (<div key={s.key} className={`rounded-lg p-4 flex justify-between items-center ${isSource ? "bg-gold-400/10 border border-gold-400/20" : "bg-dark-800"}`}>
                    <div className="text-xs text-dark-300">{s.label}</div>
                    <div className={`text-xl font-bold font-mono ${isSource ? "text-gold-400" : val !== null ? "text-dark-50" : "text-dark-300"}`}>{val !== null ? val : "—"}<span className="text-xs ml-1 font-normal text-dark-300">{val !== null ? s.unit : ""}</span></div>
                  </div>);
                })}
                <div className="mt-4 p-3 bg-dark-800 rounded-lg"><div className="text-xs text-dark-300 font-mono">⚠ {t.approxWarning}</div></div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">🔧</div><div className="text-sm">{t.enterValue}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-3">{t.refInfo}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-300">
            <div><span className="text-dark-100 font-medium">HRC:</span> {t.hrcRef}</div>
            <div><span className="text-dark-100 font-medium">HRB:</span> {t.hrbRef}</div>
            <div><span className="text-dark-100 font-medium">HV:</span> {t.hvRef}</div>
            <div><span className="text-dark-100 font-medium">HB:</span> {t.hbRef}</div>
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
