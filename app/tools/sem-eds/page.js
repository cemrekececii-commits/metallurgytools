"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

const ELEMENTS = ["Ac","Ag","Al","Am","Ar","As","At","Au","B","Ba","Be","Bi","Bk","Br","C","Ca","Cd","Ce","Cf","Cl","Cm","Co","Cr","Cs","Cu","Dy","Er","Es","Eu","F","Fe","Fm","Fr","Ga","Gd","Ge","Hf","Hg","Ho","I","In","Ir","K","Kr","La","Li","Lr","Lu","Md","Mg","Mn","Mo","N","Na","Nb","Nd","Ne","Ni","No","Np","O","Os","P","Pa","Pb","Pd","Pm","Po","Pr","Pt","Pu","Ra","Rb","Re","Rh","Rn","Ru","S","Sb","Sc","Se","Si","Sm","Sn","Sr","Ta","Tb","Tc","Te","Th","Ti","Tl","Tm","U","V","W","Xe","Y","Yb","Zn","Zr"];

const RISK_TR = { Critical: "Kritik", High: "Yüksek", Moderate: "Orta", Low: "Düşük" };
const RISK_COLOR = { Critical: "bg-red-500/20 text-red-400 border-red-500/30", High: "bg-orange-500/20 text-orange-400 border-orange-500/30", Moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", Low: "bg-green-500/20 text-green-400 border-green-500/30" };
const scoreColor = (s) => s >= 80 ? "bg-red-500" : s >= 50 ? "bg-orange-500" : s >= 25 ? "bg-yellow-500" : "bg-green-500";

const TR = {
  title: "SEM-EDS Hasar Analizi Asistanı", subtitle: "Spektroskopi Çakışma & Metalürjik Yorumlama",
  manual: "Tekli Veri Girişi", image: "Spektrum Görüntü Analizi",
  element: "Hedef Element", energy: "Ölçülen Enerji (keV)", analyze: "Spektrumu Analiz Et",
  analyzeImg: "Görseli Analiz Et", analyzing: "Analiz Ediliyor...", reset: "Sıfırla",
  uploadTitle: "Görüntü Yüklemek İçin Tıklayın", uploadDesc: "PNG, JPG, JPEG (Maks. 5MB)",
  report: "Çakışma Analiz Raporu", imgReport: "Görüntü Üzerinden Tespit Edilen Riskler",
  target: "Hedef", noOverlap: "Önemli bir çakışma bulunamadı.",
  noOverlapImg: "Görsel üzerinde belirgin bir çakışma tespit edilemedi.",
  warnings: "Yüksek Riskli Yanlış Yorumlama Uyarıları", whyDangerous: "Neden Tehlikeli",
  riskIncreases: "Risk Şu Durumlarda Artar", metallurgical: "Metalürjik Bağlam",
  countermeasures: "Uzman Önlemleri/Tavsiyeleri", inputError: "Hatalı Veri Girişi",
  imgError: "Görüntü Analiz Hatası", errBoth: "Lütfen hem element hem enerji giriniz.",
  errImg: "Lütfen bir spektrum görüntüsü yükleyiniz.",
  colElement: "Element / Pik", colLine: "X-ışını Hattı", colRef: "Ref. Enerji (keV)",
  colDelta: "ΔE (keV)", colProb: "Hata Olasılığı",
  free: "ÜCRETSİZ",
};
const EN = {
  title: "SEM-EDS Failure Analysis Assistant", subtitle: "Spectroscopy Overlap & Metallurgical Interpretation",
  manual: "Manual Input", image: "Spectrum Image Analysis",
  element: "Target Element", energy: "Measured Energy (keV)", analyze: "Analyze Spectrum",
  analyzeImg: "Analyze Image", analyzing: "Analyzing...", reset: "Reset",
  uploadTitle: "Click to Upload Image", uploadDesc: "PNG, JPG, JPEG (Max 5MB)",
  report: "Overlap Analysis Report", imgReport: "Risks Detected from Image",
  target: "Target", noOverlap: "No significant overlap found within ±0.10 keV.",
  noOverlapImg: "No significant overlap or anomaly detected in the image.",
  warnings: "High-Risk Misinterpretation Warnings", whyDangerous: "Why Dangerous",
  riskIncreases: "Risk Increases When", metallurgical: "Metallurgical Context",
  countermeasures: "Expert Recommendations", inputError: "Invalid Input",
  imgError: "Image Analysis Error", errBoth: "Please enter both element and energy.",
  errImg: "Please upload a spectrum image.",
  colElement: "Element / Peak", colLine: "X-ray Line", colRef: "Ref. Energy (keV)",
  colDelta: "ΔE (keV)", colProb: "Error Probability",
  free: "FREE",
};

export default function SemEdsAnalyzer() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [tab, setTab] = useState("manual");
  const [element, setElement] = useState("");
  const [energy, setEnergy] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleReset = () => {
    setElement(""); setEnergy(""); setImagePreview(null); setImageData(null);
    setResult(null); setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Geçerli bir resim dosyası yükleyin."); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      setImageData({ base64: dataUrl.split(",")[1], mimeType: file.type });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (tab === "manual" && (!element || !energy)) { setError(t.errBoth); return; }
    if (tab === "image" && !imageData) { setError(t.errImg); return; }
    setLoading(true); setError(""); setResult(null);

    try {
      const body = tab === "manual"
        ? { mode: "manual", element, energy }
        : { mode: "image", imageBase64: imageData.base64, imageMimeType: imageData.mimeType };

      const res = await fetch("/api/sem-eds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setResult(data); }
    } catch (err) {
      setError("Analiz sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-dark-200 text-sm">🔬 SEM-EDS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/10">
            <button onClick={() => switchLang("tr")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "tr" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>TR</button>
            <button onClick={() => switchLang("en")} className={`px-2.5 py-1 rounded-full text-xs font-medium border-none cursor-pointer font-sans ${lang === "en" ? "bg-gold-400 text-dark-800" : "bg-transparent text-dark-300"}`}>EN</button>
          </div>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">{t.free}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
          <p className="text-dark-300 text-sm">{t.subtitle}</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.06]">
            <button onClick={() => { setTab("manual"); setResult(null); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border-none cursor-pointer font-sans transition-all ${tab === "manual" ? "bg-white/[0.05] text-gold-400 border-b-2 border-gold-400" : "bg-transparent text-dark-300 hover:text-dark-100"}`}>
              ⚡ {t.manual}
            </button>
            <button onClick={() => { setTab("image"); setResult(null); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-medium flex items-center justify-center gap-2 border-none cursor-pointer font-sans transition-all ${tab === "image" ? "bg-white/[0.05] text-gold-400 border-b-2 border-gold-400" : "bg-transparent text-dark-300 hover:text-dark-100"}`}>
              🖼️ {t.image}
            </button>
          </div>

          <div className="p-6">
            {tab === "manual" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                <div>
                  <label className="text-xs text-dark-300 block mb-1.5 font-semibold uppercase tracking-wider">{t.element}</label>
                  <div className="relative">
                    <input list="el-opts" value={element} onChange={e => setElement(e.target.value)}
                      placeholder="Örn: Fe" className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
                    <datalist id="el-opts">{ELEMENTS.map(el => <option key={el} value={el} />)}</datalist>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-dark-300 block mb-1.5 font-semibold uppercase tracking-wider">{t.energy}</label>
                  <input type="number" step="0.01" value={energy} onChange={e => setEnergy(e.target.value)}
                    placeholder="Örn: 2.31" className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAnalyze} disabled={loading}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer font-sans bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 disabled:opacity-40 disabled:cursor-not-allowed">
                    {loading ? t.analyzing : t.analyze}
                  </button>
                  <button onClick={handleReset} disabled={loading}
                    className="px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10 disabled:opacity-40">↺</button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${imagePreview ? "border-gold-400/30 bg-gold-400/5" : "border-white/10 hover:border-white/20"}`}
                  onClick={() => fileRef.current?.click()}>
                  {!imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-3xl opacity-40">📤</div>
                      <p className="text-sm text-dark-200">{t.uploadTitle}</p>
                      <p className="text-xs text-dark-300">{t.uploadDesc}</p>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg border border-white/10" />
                      <button onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-none cursor-pointer hover:bg-red-600">✕</button>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleAnalyze} disabled={loading || !imageData}
                    className="py-2.5 px-6 rounded-lg text-sm font-semibold border-none cursor-pointer font-sans bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                    {loading ? <><span className="w-4 h-4 border-2 border-dark-800/30 border-t-dark-800 rounded-full animate-spin inline-block" /> {t.analyzing}</> : <>{t.analyzeImg}</>}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                ⚠ {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Validation Error */}
            {result.inputValidation && !result.inputValidation.isValid && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-5 rounded-r-xl flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <h3 className="text-lg font-bold text-red-400">{tab === "manual" ? t.inputError : t.imgError}</h3>
                  <p className="text-red-300 text-sm mt-1">{result.inputValidation.message}</p>
                </div>
              </div>
            )}

            {/* Overlap Table */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-dark-50 flex items-center gap-2">📋 {tab === "manual" ? t.report : t.imgReport}</h2>
                {tab === "manual" && <span className="text-[10px] font-mono text-dark-300 bg-dark-800 px-2 py-0.5 rounded">{t.target}: {element} @ {energy} keV</span>}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-dark-300 bg-dark-800">
                    <tr>
                      <th className="px-5 py-2.5">{t.colElement}</th>
                      <th className="px-5 py-2.5">{t.colLine}</th>
                      <th className="px-5 py-2.5">{t.colRef}</th>
                      <th className="px-5 py-2.5">{t.colDelta}</th>
                      <th className="px-5 py-2.5 w-56">{t.colProb}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.overlaps || []).map((ov, i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-5 py-3">
                          <div className="font-medium text-dark-50">{ov.element}</div>
                          <span className={`text-[10px] mt-1 inline-flex px-1.5 py-0.5 rounded border ${RISK_COLOR[ov.riskLevel] || RISK_COLOR.Low}`}>
                            {RISK_TR[ov.riskLevel] || ov.riskLevel} Risk
                          </span>
                        </td>
                        <td className="px-5 py-3 text-dark-200">{ov.line || "—"}</td>
                        <td className="px-5 py-3 text-dark-300 font-mono">{ov.referenceEnergy != null ? ov.referenceEnergy.toFixed(3) : "N/A"}</td>
                        <td className="px-5 py-3 text-dark-300 font-mono">{ov.difference != null ? `${ov.difference > 0 ? "+" : ""}${ov.difference.toFixed(3)}` : "N/A"}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-between text-xs mb-1"><span className="text-dark-200 font-medium">%{ov.probabilityScore}</span></div>
                          <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${scoreColor(ov.probabilityScore)}`} style={{ width: `${ov.probabilityScore}%` }} />
                          </div>
                          <p className="text-[11px] text-dark-300 mt-1">{ov.probabilityReason}</p>
                        </td>
                      </tr>
                    ))}
                    {(!result.overlaps || !result.overlaps.length) && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-dark-300">{tab === "manual" ? t.noOverlap : t.noOverlapImg}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warnings */}
            {(result.highRiskWarnings || []).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-3">⚠ {t.warnings}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {result.highRiskWarnings.map((w, i) => (
                    <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
                      <h4 className="font-bold text-red-300 mb-3">{w.warningTitle}</h4>
                      <div className="space-y-2.5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold mb-0.5">{t.whyDangerous}</p>
                          <p className="text-dark-200 text-sm leading-relaxed">{w.whyDangerous}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold mb-0.5">{t.riskIncreases}</p>
                          <ul className="space-y-0.5">
                            {(w.errorConditions || []).map((c, j) => (
                              <li key={j} className="text-dark-200 text-sm flex items-start gap-1.5">
                                <span className="text-red-400 mt-0.5">•</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interpretation + Countermeasures */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">ℹ️ {t.metallurgical}</h3>
                <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{result.metallurgicalInterpretation}</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">✅ {t.countermeasures}</h3>
                <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                  <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">{result.practicalCountermeasures}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
