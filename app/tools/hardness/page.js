"use client";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

// ASTM E140 approximate conversion table (simplified)
const HARDNESS_TABLE = [
  { hrc: 68, hv: 940, hb: null, hrb: null, mpa: null },
  { hrc: 67, hv: 900, hb: null, hrb: null, mpa: null },
  { hrc: 66, hv: 865, hb: null, hrb: null, mpa: null },
  { hrc: 65, hv: 832, hb: null, hrb: null, mpa: 2393 },
  { hrc: 64, hv: 800, hb: null, hrb: null, mpa: 2324 },
  { hrc: 63, hv: 772, hb: null, hrb: null, mpa: 2255 },
  { hrc: 62, hv: 746, hb: null, hrb: null, mpa: 2186 },
  { hrc: 61, hv: 720, hb: null, hrb: null, mpa: 2117 },
  { hrc: 60, hv: 697, hb: null, hrb: null, mpa: 2048 },
  { hrc: 59, hv: 674, hb: null, hrb: null, mpa: 1979 },
  { hrc: 58, hv: 653, hb: null, hrb: null, mpa: 1924 },
  { hrc: 57, hv: 633, hb: null, hrb: null, mpa: 1855 },
  { hrc: 56, hv: 613, hb: null, hrb: null, mpa: 1800 },
  { hrc: 55, hv: 595, hb: null, hrb: null, mpa: 1744 },
  { hrc: 54, hv: 577, hb: null, hrb: null, mpa: 1689 },
  { hrc: 53, hv: 560, hb: null, hrb: null, mpa: 1634 },
  { hrc: 52, hv: 544, hb: null, hrb: null, mpa: 1579 },
  { hrc: 51, hv: 528, hb: null, hrb: null, mpa: 1531 },
  { hrc: 50, hv: 513, hb: null, hrb: null, mpa: 1482 },
  { hrc: 49, hv: 498, hb: null, hrb: null, mpa: 1434 },
  { hrc: 48, hv: 484, hb: null, hrb: null, mpa: 1386 },
  { hrc: 47, hv: 471, hb: null, hrb: null, mpa: 1338 },
  { hrc: 46, hv: 458, hb: null, hrb: null, mpa: 1296 },
  { hrc: 45, hv: 446, hb: 421, hrb: null, mpa: 1255 },
  { hrc: 44, hv: 434, hb: 409, hrb: null, mpa: 1214 },
  { hrc: 43, hv: 423, hb: 400, hrb: null, mpa: 1172 },
  { hrc: 42, hv: 412, hb: 390, hrb: null, mpa: 1131 },
  { hrc: 41, hv: 402, hb: 381, hrb: null, mpa: 1096 },
  { hrc: 40, hv: 392, hb: 371, hrb: null, mpa: 1062 },
  { hrc: 39, hv: 382, hb: 362, hrb: null, mpa: 1027 },
  { hrc: 38, hv: 372, hb: 353, hrb: null, mpa: 1000 },
  { hrc: 37, hv: 363, hb: 344, hrb: null, mpa: 972 },
  { hrc: 36, hv: 354, hb: 336, hrb: null, mpa: 951 },
  { hrc: 35, hv: 345, hb: 327, hrb: null, mpa: 930 },
  { hrc: 34, hv: 337, hb: 319, hrb: null, mpa: 903 },
  { hrc: 33, hv: 329, hb: 311, hrb: null, mpa: 882 },
  { hrc: 32, hv: 321, hb: 301, hrb: null, mpa: 862 },
  { hrc: 31, hv: 313, hb: 294, hrb: null, mpa: 841 },
  { hrc: 30, hv: 306, hb: 286, hrb: null, mpa: 820 },
  { hrc: 29, hv: 299, hb: 279, hrb: null, mpa: 800 },
  { hrc: 28, hv: 292, hb: 271, hrb: null, mpa: 779 },
  { hrc: 27, hv: 285, hb: 264, hrb: null, mpa: 758 },
  { hrc: 26, hv: 278, hb: 258, hrb: null, mpa: 738 },
  { hrc: 25, hv: 272, hb: 253, hrb: null, mpa: 717 },
  { hrc: 24, hv: 266, hb: 247, hrb: 99.5, mpa: 696 },
  { hrc: 23, hv: 260, hb: 243, hrb: 99, mpa: 683 },
  { hrc: 22, hv: 254, hb: 237, hrb: 98.5, mpa: 669 },
  { hrc: 21, hv: 248, hb: 231, hrb: 98, mpa: 655 },
  { hrc: 20, hv: 243, hb: 226, hrb: 97, mpa: 641 },
  { hrc: null, hv: 238, hb: 222, hrb: 96.5, mpa: 634 },
  { hrc: null, hv: 230, hb: 217, hrb: 95.5, mpa: 614 },
  { hrc: null, hv: 222, hb: 212, hrb: 94.5, mpa: 593 },
  { hrc: null, hv: 213, hb: 207, hrb: 93.5, mpa: 579 },
  { hrc: null, hv: 204, hb: 201, hrb: 92, mpa: 558 },
  { hrc: null, hv: 196, hb: 197, hrb: 91, mpa: 538 },
  { hrc: null, hv: 188, hb: 190, hrb: 89.5, mpa: 517 },
  { hrc: null, hv: 180, hb: 183, hrb: 87.5, mpa: 503 },
  { hrc: null, hv: 173, hb: 176, hrb: 86, mpa: 482 },
  { hrc: null, hv: 166, hb: 170, hrb: 84, mpa: 462 },
  { hrc: null, hv: 160, hb: 163, hrb: 82, mpa: 448 },
  { hrc: null, hv: 154, hb: 156, hrb: 79.5, mpa: 434 },
  { hrc: null, hv: 148, hb: 149, hrb: 77, mpa: 414 },
  { hrc: null, hv: 142, hb: 143, hrb: 74.5, mpa: 393 },
  { hrc: null, hv: 137, hb: 137, hrb: 72, mpa: 379 },
  { hrc: null, hv: 131, hb: 131, hrb: 69, mpa: 365 },
  { hrc: null, hv: 126, hb: 126, hrb: 66.5, mpa: 352 },
  { hrc: null, hv: 121, hb: 121, hrb: 64, mpa: 338 },
  { hrc: null, hv: 116, hb: 116, hrb: 61, mpa: 324 },
  { hrc: null, hv: 111, hb: 111, hrb: 58, mpa: 310 },
];

function findClosest(value, key) {
  const valid = HARDNESS_TABLE.filter((r) => r[key] !== null);
  let closest = valid[0];
  let minDiff = Math.abs(valid[0][key] - value);
  for (const row of valid) {
    const diff = Math.abs(row[key] - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }
  return closest;
}

const SCALES = [
  { key: "hrc", label: "HRC (Rockwell C)", unit: "HRC", min: 20, max: 68 },
  { key: "hrb", label: "HRB (Rockwell B)", unit: "HRB", min: 58, max: 100 },
  { key: "hv", label: "HV (Vickers)", unit: "HV", min: 111, max: 940 },
  { key: "hb", label: "HB (Brinell)", unit: "HB", min: 111, max: 421 },
  { key: "mpa", label: "Çekme Dayanımı (Approx.)", unit: "MPa", min: 310, max: 2393 },
];

export default function HardnessConverter() {
  const [fromScale, setFromScale] = useState("hrc");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    const row = findClosest(val, fromScale);
    setResult(row);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConvert();
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-dark-200 hover:text-gold-400 transition-colors text-sm no-underline">← Dashboard</Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-semibold">🔧 Hardness Converter</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Hardness Converter</h1>
        <p className="text-dark-300 text-sm mb-8">
          ASTM E140 standardına uygun sertlik ölçeği dönüşümü. HRC, HRB, HV, HB ve yaklaşık çekme dayanımı arasında çeviri yapın.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">GİRİŞ</h2>

            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">Kaynak Ölçek</label>
              <select
                value={fromScale}
                onChange={(e) => { setFromScale(e.target.value); setResult(null); }}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none"
              >
                {SCALES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs text-dark-300 block mb-1">
                Değer ({SCALES.find((s) => s.key === fromScale)?.unit})
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Örn: ${fromScale === "hrc" ? "45" : fromScale === "hv" ? "450" : fromScale === "hb" ? "200" : fromScale === "hrb" ? "85" : "800"}`}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none"
              />
            </div>

            <div className="mb-6 text-xs text-dark-300">
              Geçerli aralık: {SCALES.find((s) => s.key === fromScale)?.min} – {SCALES.find((s) => s.key === fromScale)?.max} {SCALES.find((s) => s.key === fromScale)?.unit}
            </div>

            <button
              onClick={handleConvert}
              disabled={!inputValue}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all font-sans border-none ${
                inputValue
                  ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer hover:shadow-lg hover:shadow-gold-400/20"
                  : "bg-white/5 text-dark-300 cursor-not-allowed"
              }`}
            >
              Çevir
            </button>
          </div>

          {/* Results */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark-100 mb-4">SONUÇLAR</h2>

            {result ? (
              <div className="space-y-3 animate-fade-in">
                {SCALES.map((s) => {
                  const val = result[s.key];
                  const isSource = s.key === fromScale;
                  return (
                    <div
                      key={s.key}
                      className={`rounded-lg p-4 flex justify-between items-center ${
                        isSource
                          ? "bg-gold-400/10 border border-gold-400/20"
                          : "bg-dark-800"
                      }`}
                    >
                      <div>
                        <div className="text-xs text-dark-300">{s.label}</div>
                      </div>
                      <div className={`text-xl font-bold font-mono ${
                        isSource ? "text-gold-400" : val !== null ? "text-dark-50" : "text-dark-300"
                      }`}>
                        {val !== null ? val : "—"}
                        <span className="text-xs ml-1 font-normal text-dark-300">{val !== null ? s.unit : ""}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 p-3 bg-dark-800 rounded-lg">
                  <div className="text-xs text-dark-300 font-mono">
                    ⚠ Yaklaşık değerlerdir. ASTM E140 dönüşüm tablosuna dayalıdır.
                    Farklı malzeme gruplarında (östenitik çelikler, dökme demir vb.) sapma olabilir.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-dark-300">
                <div className="text-4xl mb-3">🔧</div>
                <div className="text-sm">Bir sertlik değeri girin ve Çevir'e tıklayın</div>
                <div className="text-xs text-dark-300 mt-1">Tüm ölçekler aynı anda gösterilir</div>
              </div>
            )}
          </div>
        </div>

        {/* Reference info */}
        <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-3">Referans Bilgisi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-300">
            <div>
              <span className="text-dark-100 font-medium">HRC (Rockwell C):</span> Sertleştirilmiş çelikler, 20-68 HRC aralığı. 150 kgf yük, elmas konik uç.
            </div>
            <div>
              <span className="text-dark-100 font-medium">HRB (Rockwell B):</span> Yumuşak çelikler ve bakır alaşımları, 58-100 HRB. 100 kgf yük, 1/16" çelik bilye.
            </div>
            <div>
              <span className="text-dark-100 font-medium">HV (Vickers):</span> Tüm malzemeler, mikro ve makro sertlik. Elmas piramit uç, iz köşegeni ölçümü.
            </div>
            <div>
              <span className="text-dark-100 font-medium">HB (Brinell):</span> Döküm ve yumuşak çelikler, 10mm tungsten karbür bilye. ASTM E10.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
