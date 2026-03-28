"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

// ─── Calculations ───────────────────────────────────────
function calcTmin(P, D, S, E, W, Y) {
  const den = 2 * (S * E * W) + P * Y;
  return den > 0 ? (P * D) / den : 0;
}

function calcCorrosionRates(tOrig, tPrev, tCurr, installDate, prevDate, currDate) {
  const yrsService = Math.max(0, (currDate - installDate) / (365.25 * 86400000));
  const yrsBetween = Math.max(0, (currDate - prevDate) / (365.25 * 86400000));
  const ltcr = yrsService > 0 ? (tOrig - tCurr) / yrsService : 0;
  const stcr = yrsBetween > 0 ? (tPrev - tCurr) / yrsBetween : 0;
  return { ltcr, stcr, yrsService, yrsBetween };
}

function calcRemainingLife(tCurr, tMin, cr, ca) {
  if (tCurr < tMin + ca) return 0;
  if (cr <= 0) return 999;
  return (tCurr - (tMin + ca)) / cr;
}

// ─── Translations ───────────────────────────────────────
const TR = {
  title: "Korozyon Hızı ve Kalan Ömür Hesaplayıcı",
  subtitle: "API 570 / ASME B31.3 / API 579 Değerlendirme Aracı",
  designData: "Tasarım ve Malzeme Verileri", inspectionData: "Muayene ve Kalınlık Verileri",
  results: "Hesaplama Sonuçları", warnings: "Mühendislik Uyarıları",
  trendChart: "Korozyon Trendi ve Ömür Projeksiyonu",
  diameter: "Dış Çap (D)", pressure: "Tasarım Basıncı (P)", stress: "İzin Verilen Gerilme (S)",
  efficiency: "Kaynak Dikiş Verimi (E)", weldFactor: "Kaynak Dayanım Faktörü (W)",
  yCoeff: "Y Katsayısı", ca: "Korozyon Payı",
  tOrig: "Orijinal Kalınlık", tPrev: "Önceki Kalınlık", tCurr: "Mevcut Kalınlık",
  installDate: "Kurulum Tarihi", prevDate: "Önceki Muayene Tarihi", currDate: "Mevcut Muayene Tarihi",
  nextInterval: "Hedef Muayene Aralığı",
  tmin: "Min. Gerekli Kalınlık (t_min)", ltcr: "Uzun Dönem KH", stcr: "Kısa Dönem KH",
  remainingLife: "Kalan Ömür", govRate: "Geçerli Korozyon Hızı",
  reset: "Temizle", exportTxt: "Rapor (TXT)", help: "Bilgi",
  free: "ÜCRETSİZ", year: "yıl", mmYear: "mm/yıl",
  disclaimer: "Bu değerlendirme, işletme tarafından yazılı olarak beyan edilen hat bilgileri ile TS EN ISO 9712 Level 2 yetkinliğindeki NDT personeli tarafından gerçekleştirilen ultrasonik et kalınlığı ölçüm verileri esas alınarak gerçekleştirilmiştir.",
  criticalMsg: "Acil onarım veya değişim gereklidir. Mevcut kalınlık, minimum gerekli kalınlık + korozyon payı sınırının altındadır.",
  warnInterval: "Muayene sıklığını artırın. Kalan ömür, planlanan muayene aralığından daha azdır.",
  warnLocalized: "Olası lokalize korozyon veya proses değişikliği. STCR, LTCR'den önemli ölçüde yüksektir.",
  warnThickness: "Mevcut kalınlık önceki kalınlıktan daha büyük. Ölçüm doğruluğunu kontrol edin.",
  okMsg: "Boru hattı hizmete devam etmek için uygundur. Kritik bir uyarı tespit edilmedi.",
  helpTitle: "Hesaplama Standartları",
  measurement: "Ölçüm", forecast: "Tahmin", minThickness: "Min. Kalınlık",
};
const EN = {
  title: "Corrosion Rate & Remaining Life Calculator",
  subtitle: "API 570 / ASME B31.3 / API 579 Assessment Tool",
  designData: "Design & Material Data", inspectionData: "Inspection & Thickness Data",
  results: "Calculation Results", warnings: "Engineering Warnings",
  trendChart: "Corrosion Trend & Life Projection",
  diameter: "Outer Diameter (D)", pressure: "Design Pressure (P)", stress: "Allowable Stress (S)",
  efficiency: "Weld Joint Efficiency (E)", weldFactor: "Weld Strength Factor (W)",
  yCoeff: "Y Coefficient", ca: "Corrosion Allowance",
  tOrig: "Original Thickness", tPrev: "Previous Thickness", tCurr: "Current Thickness",
  installDate: "Installation Date", prevDate: "Previous Inspection Date", currDate: "Current Inspection Date",
  nextInterval: "Target Inspection Interval",
  tmin: "Min. Required Thickness (t_min)", ltcr: "Long Term CR", stcr: "Short Term CR",
  remainingLife: "Remaining Life", govRate: "Governing Corrosion Rate",
  reset: "Reset", exportTxt: "Report (TXT)", help: "Info",
  free: "FREE", year: "years", mmYear: "mm/year",
  disclaimer: "This assessment is based on pipeline data declared in writing by the operator and ultrasonic thickness measurement data performed by NDT personnel with TS EN ISO 9712 Level 2 competence.",
  criticalMsg: "Immediate repair or replacement required. Current thickness is below t_min + CA limit.",
  warnInterval: "Increase inspection frequency. Remaining life is less than planned inspection interval.",
  warnLocalized: "Possible localized corrosion or process change. STCR is significantly higher than LTCR.",
  warnThickness: "Current thickness is greater than previous. Check measurement accuracy.",
  okMsg: "Pipeline is fit for continued service. No critical warnings detected.",
  helpTitle: "Calculation Standards",
  measurement: "Measurement", forecast: "Forecast", minThickness: "Min. Thickness",
};

const defaults = {
  diameter: 219.1, pressure: 1.5, stress: 138, efficiency: 0.85, weldFactor: 1.0,
  yCoefficient: 0.72, tOriginal: 7.1, tPrevious: 6.9, tCurrent: 6.3, corrosionAllowance: 1,
  installationDate: "1977-01-01", previousDate: "2021-01-01", currentDate: "2026-01-01",
  nextInspectionInterval: 5,
};

function InputField({ label, name, value, unit, type = "number", step = "any", onChange }) {
  return (
    <div>
      <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <input type={type} name={name} value={value} onChange={onChange} step={step}
          className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 font-mono focus:border-gold-400/50 focus:outline-none" />
        {unit && <span className="absolute right-2.5 top-2 text-dark-300 text-xs">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Simple SVG Chart ───────────────────────────────────
function TrendChart({ data, tMin, t }) {
  if (!data.length) return null;
  const W = 600, H = 200, PL = 50, PR = 20, PT = 15, PB = 35;
  const cw = W - PL - PR, ch = H - PT - PB;

  const allY = data.map(d => d.val).concat([tMin]);
  const minY = Math.min(...allY) - 0.5;
  const maxY = Math.max(...allY) + 0.5;

  const toX = (i) => PL + (i / (data.length - 1)) * cw;
  const toY = (v) => PT + ((maxY - v) / (maxY - minY)) * ch;

  const measured = data.filter(d => d.type === "measured");
  const forecast = data.filter(d => d.type === "forecast");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Grid */}
      {[0, 1, 2, 3, 4].map(i => {
        const y = PT + (i / 4) * ch;
        const val = maxY - (i / 4) * (maxY - minY);
        return <g key={i}><line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#334155" strokeDasharray="3,3" /><text x={PL - 5} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="9">{val.toFixed(1)}</text></g>;
      })}

      {/* t_min line */}
      <line x1={PL} y1={toY(tMin)} x2={W - PR} y2={toY(tMin)} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={W - PR + 2} y={toY(tMin) + 3} fill="#ef4444" fontSize="8">t_min</text>

      {/* Measured line */}
      {measured.length > 1 && <polyline fill="none" stroke="#4ade80" strokeWidth="2.5"
        points={measured.map((d, i) => `${toX(data.indexOf(d))},${toY(d.val)}`).join(" ")} />}

      {/* Forecast dashed line */}
      {forecast.length > 0 && measured.length > 0 && (
        <line x1={toX(data.indexOf(measured[measured.length - 1]))} y1={toY(measured[measured.length - 1].val)}
          x2={toX(data.indexOf(forecast[forecast.length - 1]))} y2={toY(forecast[forecast.length - 1].val)}
          stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" />
      )}

      {/* Points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.val)} r="4" fill={d.type === "measured" ? "#4ade80" : "#94a3b8"} stroke="white" strokeWidth="1.5" />
          <text x={toX(i)} y={H - 5} textAnchor="middle" fill="#94a3b8" fontSize="8">{d.label}</text>
          <text x={toX(i)} y={toY(d.val) - 8} textAnchor="middle" fill={d.type === "measured" ? "#4ade80" : "#94a3b8"} fontSize="8" fontWeight="bold">{d.val.toFixed(1)}</text>
        </g>
      ))}

      {/* Axis labels */}
      <text x={5} y={H / 2} textAnchor="middle" fill="#94a3b8" fontSize="9" transform={`rotate(-90,10,${H / 2})`}>mm</text>
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function CorrosionCalculator() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;
  const [data, setData] = useState(defaults);
  const [showHelp, setShowHelp] = useState(false);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setData(p => ({ ...p, [name]: type === "number" ? parseFloat(value) || 0 : value }));
  };

  const results = useMemo(() => {
    const tMin = calcTmin(data.pressure, data.diameter, data.stress, data.efficiency, data.weldFactor, data.yCoefficient);
    const installD = new Date(data.installationDate), prevD = new Date(data.previousDate), currD = new Date(data.currentDate);
    const { ltcr, stcr, yrsService, yrsBetween } = calcCorrosionRates(data.tOriginal, data.tPrevious, data.tCurrent, installD, prevD, currD);
    const cr = Math.max(ltcr, stcr, 0);
    const rl = calcRemainingLife(data.tCurrent, tMin, cr, data.corrosionAllowance);

    const warnings = [];
    if (data.tCurrent < tMin + data.corrosionAllowance)
      warnings.push({ type: "critical", msg: `${t.criticalMsg} (${(tMin + data.corrosionAllowance).toFixed(3)} mm)` });
    if (rl < data.nextInspectionInterval && rl > 0)
      warnings.push({ type: "warning", msg: `${t.warnInterval} (${rl.toFixed(1)} < ${data.nextInspectionInterval} ${t.year})` });
    if (stcr > ltcr * 1.5 && stcr > 0.05)
      warnings.push({ type: "warning", msg: t.warnLocalized });
    if (data.tCurrent > data.tPrevious)
      warnings.push({ type: "info", msg: t.warnThickness });
    if (!warnings.length)
      warnings.push({ type: "ok", msg: t.okMsg });

    return { tMin, ltcr, stcr, cr, rl, yrsService, yrsBetween, warnings };
  }, [data, t]);

  const chartData = useMemo(() => {
    const pts = [
      { label: new Date(data.installationDate).getFullYear().toString(), val: data.tOriginal, type: "measured" },
      { label: new Date(data.previousDate).getFullYear().toString(), val: data.tPrevious, type: "measured" },
      { label: new Date(data.currentDate).getFullYear().toString(), val: data.tCurrent, type: "measured" },
    ];
    if (results.rl > 0 && results.rl < 999) {
      const projYear = Math.round(new Date(data.currentDate).getFullYear() + results.rl);
      pts.push({ label: `${projYear}`, val: +results.tMin.toFixed(2), type: "forecast" });
    }
    return pts;
  }, [data, results]);

  const exportReport = () => {
    const txt = `${lang === "tr" ? "BORU BÜTÜNLÜĞÜ DEĞERLENDİRME RAPORU" : "PIPE INTEGRITY ASSESSMENT REPORT"}\n${"=".repeat(40)}\n${t.subtitle}\n\n${t.designData}\n${"-".repeat(30)}\n${t.diameter}: ${data.diameter} mm\n${t.pressure}: ${data.pressure} MPa\n${t.stress}: ${data.stress} MPa\n${t.efficiency}: ${data.efficiency}\n${t.weldFactor}: ${data.weldFactor}\n${t.yCoeff}: ${data.yCoefficient}\n${t.ca}: ${data.corrosionAllowance} mm\n\n${t.inspectionData}\n${"-".repeat(30)}\n${t.tOrig}: ${data.tOriginal} mm (${data.installationDate})\n${t.tPrev}: ${data.tPrevious} mm (${data.previousDate})\n${t.tCurr}: ${data.tCurrent} mm (${data.currentDate})\n\n${t.results}\n${"-".repeat(30)}\n${t.tmin}: ${results.tMin.toFixed(3)} mm\n${t.ltcr}: ${results.ltcr.toFixed(4)} ${t.mmYear}\n${t.stcr}: ${results.stcr.toFixed(4)} ${t.mmYear}\n${t.govRate}: ${results.cr.toFixed(4)} ${t.mmYear}\n${t.remainingLife}: ${results.rl === 999 ? "> 1000" : results.rl.toFixed(1)} ${t.year}\n\n${t.warnings}\n${"-".repeat(30)}\n${results.warnings.map(w => `[${w.type.toUpperCase()}] ${w.msg}`).join("\n")}\n\n${t.disclaimer}`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "corrosion_report.txt"; a.click();
  };

  const warnStyle = { critical: "bg-red-500/10 border-red-500/20 text-red-400", warning: "bg-orange-500/10 border-orange-500/20 text-orange-400", info: "bg-blue-500/10 border-blue-500/20 text-blue-400", ok: "bg-green-500/10 border-green-500/20 text-green-400" };
  const warnIcon = { critical: "🚨", warning: "⚠️", info: "ℹ️", ok: "✅" };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/[0.06] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 no-underline text-dark-50">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md flex items-center justify-center text-lg font-bold text-dark-800 font-mono">M</div>
            <span className="font-semibold text-lg tracking-tight">MetallurgyTools</span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-dark-200 text-sm">⚗️ Corrosion</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowHelp(true)} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">📖 {t.help}</button>
          <button onClick={() => setData(defaults)} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">↺ {t.reset}</button>
          <button onClick={exportReport} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">📄 {t.exportTxt}</button>
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-6">{t.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Design Data */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <span>⚙️</span><h2 className="text-sm font-semibold text-dark-100">{t.designData}</h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <InputField label={t.diameter} name="diameter" value={data.diameter} unit="mm" onChange={onChange} />
                <InputField label={t.pressure} name="pressure" value={data.pressure} unit="MPa" onChange={onChange} />
                <InputField label={t.stress} name="stress" value={data.stress} unit="MPa" onChange={onChange} />
                <InputField label={t.efficiency} name="efficiency" value={data.efficiency} unit="—" onChange={onChange} />
                <InputField label={t.weldFactor} name="weldFactor" value={data.weldFactor} unit="—" onChange={onChange} />
                <InputField label={t.yCoeff} name="yCoefficient" value={data.yCoefficient} unit="—" onChange={onChange} />
                <InputField label={t.ca} name="corrosionAllowance" value={data.corrosionAllowance} unit="mm" onChange={onChange} />
              </div>
            </div>

            {/* Inspection Data */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <span>📏</span><h2 className="text-sm font-semibold text-dark-100">{t.inspectionData}</h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <InputField label={t.tOrig} name="tOriginal" value={data.tOriginal} unit="mm" onChange={onChange} />
                <InputField label={t.installDate} name="installationDate" value={data.installationDate} type="date" onChange={onChange} />
                <div />
                <InputField label={t.tPrev} name="tPrevious" value={data.tPrevious} unit="mm" onChange={onChange} />
                <InputField label={t.prevDate} name="previousDate" value={data.previousDate} type="date" onChange={onChange} />
                <div />
                <InputField label={t.tCurr} name="tCurrent" value={data.tCurrent} unit="mm" onChange={onChange} />
                <InputField label={t.currDate} name="currentDate" value={data.currentDate} type="date" onChange={onChange} />
                <InputField label={t.nextInterval} name="nextInspectionInterval" value={data.nextInspectionInterval} unit={t.year} onChange={onChange} />
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-gold-400/10 px-5 py-3 border-b border-gold-400/20 flex items-center gap-2">
                <span>📊</span><h2 className="text-sm font-semibold text-gold-400">{t.results}</h2>
              </div>
              <div className="p-5 space-y-4">
                {/* t_min */}
                <div className="bg-dark-800 rounded-xl p-4 border border-white/[0.06]">
                  <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-0.5">{t.tmin}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-dark-50">{results.tMin.toFixed(3)}</span>
                    <span className="text-dark-300 text-sm">mm</span>
                  </div>
                </div>

                {/* LTCR / STCR */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-800 rounded-lg p-3 border border-white/[0.06]">
                    <div className="text-[10px] text-dark-300 uppercase font-bold mb-0.5">{t.ltcr}</div>
                    <div className="text-lg font-bold font-mono text-dark-50">{results.ltcr.toFixed(4)}</div>
                    <div className="text-[10px] text-dark-300">{t.mmYear}</div>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-3 border border-white/[0.06]">
                    <div className="text-[10px] text-dark-300 uppercase font-bold mb-0.5">{t.stcr}</div>
                    <div className="text-lg font-bold font-mono text-dark-50">{results.stcr.toFixed(4)}</div>
                    <div className="text-[10px] text-dark-300">{t.mmYear}</div>
                  </div>
                </div>

                {/* Remaining Life */}
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-0.5">{t.remainingLife}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-blue-400">{results.rl === 999 ? "> 1000" : results.rl.toFixed(1)}</span>
                    <span className="text-blue-300 font-medium">{t.year}</span>
                  </div>
                  <div className="text-[10px] text-blue-300 mt-1">{t.govRate}: {results.cr.toFixed(4)} {t.mmYear}</div>
                </div>
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
        </div>

        {/* Chart */}
        <div className="mt-6 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
          <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
            <span>📉</span><h2 className="text-sm font-semibold text-dark-100">{t.trendChart}</h2>
          </div>
          <div className="p-5">
            <TrendChart data={chartData} tMin={results.tMin} t={t} />
            <div className="flex gap-6 justify-center mt-3 text-xs text-dark-300">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-400 inline-block rounded" /> {t.measurement}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-dark-300 inline-block rounded" style={{ borderTop: "2px dashed" }} /> {t.forecast}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" style={{ borderTop: "2px dashed" }} /> {t.minThickness}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-xs text-dark-300 flex items-start gap-2">
          <span className="shrink-0">ℹ️</span>
          <p className="leading-relaxed">{t.disclaimer}</p>
        </div>

        {/* References */}
        <div className="mt-3 bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
          <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
            <div>• ASME B31.3 — Process Piping</div>
            <div>• API 570 — Piping Inspection Code</div>
            <div>• API 579-1/ASME FFS-1 — Fitness-For-Service</div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="bg-dark-800 border border-white/10 rounded-xl p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-dark-50">📖 {t.helpTitle}</h3>
              <button onClick={() => setShowHelp(false)} className="text-dark-300 hover:text-dark-50 cursor-pointer bg-transparent border-none text-lg font-bold font-sans">✕</button>
            </div>
            <div className="space-y-4 text-sm text-dark-200 leading-relaxed">
              <div>
                <h4 className="text-gold-400 font-bold mb-1">ASME B31.3</h4>
                <p>t = (P × D) / (2 × (S × E × W + P × Y))</p>
              </div>
              <div>
                <h4 className="text-gold-400 font-bold mb-1">API 570 — Corrosion Rates</h4>
                <p>LTCR = (t_original − t_current) / Service Years</p>
                <p>STCR = (t_previous − t_current) / Inspection Interval</p>
              </div>
              <div>
                <h4 className="text-gold-400 font-bold mb-1">Remaining Life</h4>
                <p>RL = (t_current − (t_min + CA)) / Max(LTCR, STCR)</p>
              </div>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-5 w-full py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-semibold border border-gold-400/30 cursor-pointer font-sans hover:bg-gold-400/30">
              {lang === "tr" ? "Kapat" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}