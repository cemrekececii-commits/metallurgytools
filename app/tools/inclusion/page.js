"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";

// ─── ACCEPTANCE CRITERIA ────────────────────────────────────
const ACCEPTANCE_CRITERIA = {
  "General Purpose": { A: { T: 2.0, H: 1.5 }, B: { T: 1.5, H: 1.0 }, C: { T: 1.5, H: 1.0 }, D: { T: 1.5, H: 1.0 } },
  "API 5L (X42-X70)": { A: { T: 1.5, H: 1.0 }, B: { T: 1.5, H: 1.0 }, C: { T: 1.0, H: 0.5 }, D: { T: 1.5, H: 1.0 } },
  "S700MC": { A: { T: 1.0, H: 0.5 }, B: { T: 1.0, H: 0.5 }, C: { T: 0.5, H: 0.5 }, D: { T: 1.0, H: 0.5 } },
  "DP600": { A: { T: 1.5, H: 1.0 }, B: { T: 1.5, H: 1.0 }, C: { T: 1.0, H: 0.5 }, D: { T: 1.5, H: 1.0 } },
  "IF Steel": { A: { T: 1.0, H: 0.5 }, B: { T: 1.0, H: 0.5 }, C: { T: 0.5, H: 0.5 }, D: { T: 1.0, H: 0.5 } },
  "Bearing Steel": { A: { T: 0.5, H: 0.0 }, B: { T: 0.5, H: 0.0 }, C: { T: 0.0, H: 0.0 }, D: { T: 0.5, H: 0.0 } },
};

const RATING_OPTIONS = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

const INCLUSION_INFO = {
  A: { composition: "MnS (Manganese Sulfide)", morphology: "Elongated, parallel to rolling direction", significance: "Reduces toughness in transverse direction. Affects impact properties especially at low temperature." },
  B: { composition: "Al₂O₃ (Alumina)", morphology: "Irregular clusters, brittle facets", significance: "Initiates fatigue cracks. Critical for rolling contact applications and fatigue-prone components." },
  C: { composition: "Silicates (SiO₂-based)", morphology: "Complex angular, forms stringers", significance: "Reduces ductility. Affects formability and surface quality in deep-drawn parts." },
  D: { composition: "Globular oxides (CaO-Al₂O₃)", morphology: "Spherical to rounded, calcium aluminates", significance: "Generally benign if globular. Improves transverse toughness vs. Type A sulfides." },
};

// ─── TRANSLATIONS ───────────────────────────────────────
const TR = {
  title: "ASTM E45 İçerme Sınıflandırması",
  subtitle: "Çelik kalitesi kontrolü için Method A (En Kötü Alan Derecelendirmesi) ile mikroyapı içermelerini sınıflandırın.",
  methodSelection: "Yöntem Seçimi",
  methodA: "Method A - En Kötü Alan Derecelendirmesi (Standart)",
  inputMethod: "Giriş Yöntemi",
  multipleFields: "Çoklu Alanlar (6 alan tipik)",
  worstFieldDirect: "En Kötü Alanı Doğrudan Girin",
  steelGrade: "Çelik Kalitesi Seçin",
  inclusionType: "İçerme Tipi",
  thin: "İnce (ince)",
  heavy: "Ağır (kalın)",
  rating: "Derecelendirme",
  acceptanceCriteria: "Kabul Kriterleri",
  results: "Sonuçlar",
  verdictPass: "KABUL",
  verdictFail: "RED",
  overall: "Genel Sonuç",
  info: "İçerme Tipi Bilgisi",
  composition: "Bileşim",
  morphology: "Morfoloji",
  significance: "Metalurjik Önemi",
  exportTxt: "Rapor (TXT)",
  free: "ÜCRETSİZ",
  references: "Referanslar",
  note: "Not",
  methodANote: "ASTM E45 Method A, en kötü görülen alanın derecelendirmesini kullanır. Bu, kalite kontrol ve kabul kriterlerinin en katı uygulanmasını temsil eder.",
};

const EN = {
  title: "ASTM E45 Inclusion Classification",
  subtitle: "Classify steel microstructural inclusions using Method A (Worst Field Rating) for quality control.",
  methodSelection: "Method Selection",
  methodA: "Method A - Worst Field Rating (Standard)",
  inputMethod: "Input Method",
  multipleFields: "Multiple Fields (6 typical)",
  worstFieldDirect: "Enter Worst Field Directly",
  steelGrade: "Select Steel Grade",
  inclusionType: "Inclusion Type",
  thin: "Thin",
  heavy: "Heavy",
  rating: "Rating",
  acceptanceCriteria: "Acceptance Criteria",
  results: "Results",
  verdictPass: "PASS",
  verdictFail: "FAIL",
  overall: "Overall Verdict",
  info: "Inclusion Type Information",
  composition: "Composition",
  morphology: "Morphology",
  significance: "Metallurgical Significance",
  exportTxt: "Report (TXT)",
  free: "FREE",
  references: "References",
  note: "Note",
  methodANote: "ASTM E45 Method A uses the worst field rating observed. This represents the strictest application of quality control and acceptance criteria.",
};

function InputField({ label, name, value, unit, onChange, children }) {
  return (
    <div>
      <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{label}</label>
      {children || (
        <div className="relative">
          <input type="number" name={name} value={value} onChange={onChange} step="0.5" min="0" max="3"
            className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 font-mono focus:border-gold-400/50 focus:outline-none" />
          {unit && <span className="absolute right-2 top-2 text-dark-300 text-[10px]">{unit}</span>}
        </div>
      )}
    </div>
  );
}

function RatingSelect({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
        {RATING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toFixed(1)}</option>)}
      </select>
    </div>
  );
}

// ─── VERDICT BADGE ──────────────────────────────────────
function VerdictBadge({ pass, label }) {
  const bg = pass ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-red-500/20 border-red-500/30 text-red-400";
  const text = pass ? "PASS" : "FAIL";
  return (
    <div className={`rounded-lg border px-3 py-2 text-center text-sm font-bold ${bg}`}>
      <div className="text-[10px] text-dark-300 uppercase font-semibold mb-0.5">{label}</div>
      <div className="text-lg font-black">{text}</div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────
export default function InclusionClassification() {
  const { lang, switchLang } = useLang();
  const t = lang === "tr" ? TR : EN;

  const [steelGrade, setSteelGrade] = useState("General Purpose");
  const [inputMode, setInputMode] = useState("multiple"); // "multiple" or "worst"
  const [numFields, setNumFields] = useState(6);
  const [ratings, setRatings] = useState({
    A_T: Array(6).fill(0),
    A_H: Array(6).fill(0),
    B_T: Array(6).fill(0),
    B_H: Array(6).fill(0),
    C_T: Array(6).fill(0),
    C_H: Array(6).fill(0),
    D_T: Array(6).fill(0),
    D_H: Array(6).fill(0),
  });
  const [worstRatings, setWorstRatings] = useState({
    A_T: 0, A_H: 0, B_T: 0, B_H: 0, C_T: 0, C_H: 0, D_T: 0, D_H: 0,
  });

  const handleFieldChange = (type, index, value) => {
    setRatings(prev => ({
      ...prev,
      [type]: prev[type].map((v, i) => i === index ? parseFloat(value) || 0 : v)
    }));
  };

  const handleWorstChange = (type, value) => {
    setWorstRatings(prev => ({ ...prev, [type]: parseFloat(value) || 0 }));
  };

  const handleNumFieldsChange = (e) => {
    const n = parseInt(e.target.value) || 1;
    setNumFields(Math.max(1, Math.min(10, n)));
    setRatings(prev => ({
      ...prev,
      A_T: Array(n).fill(0),
      A_H: Array(n).fill(0),
      B_T: Array(n).fill(0),
      B_H: Array(n).fill(0),
      C_T: Array(n).fill(0),
      C_H: Array(n).fill(0),
      D_T: Array(n).fill(0),
      D_H: Array(n).fill(0),
    }));
  };

  // Determine worst field for each type
  const worstFields = useMemo(() => {
    if (inputMode === "worst") {
      return worstRatings;
    }
    return {
      A_T: Math.max(...ratings.A_T),
      A_H: Math.max(...ratings.A_H),
      B_T: Math.max(...ratings.B_T),
      B_H: Math.max(...ratings.B_H),
      C_T: Math.max(...ratings.C_T),
      C_H: Math.max(...ratings.C_H),
      D_T: Math.max(...ratings.D_T),
      D_H: Math.max(...ratings.D_H),
    };
  }, [ratings, worstRatings, inputMode]);

  // Check pass/fail
  const results = useMemo(() => {
    const criteria = ACCEPTANCE_CRITERIA[steelGrade];
    const checks = {
      A: worstFields.A_T <= criteria.A.T && worstFields.A_H <= criteria.A.H,
      B: worstFields.B_T <= criteria.B.T && worstFields.B_H <= criteria.B.H,
      C: worstFields.C_T <= criteria.C.T && worstFields.C_H <= criteria.C.H,
      D: worstFields.D_T <= criteria.D.T && worstFields.D_H <= criteria.D.H,
    };
    const overall = checks.A && checks.B && checks.C && checks.D;
    return { checks, overall, criteria };
  }, [worstFields, steelGrade]);

  const exportReport = () => {
    const worstA_T = worstFields.A_T.toFixed(1), worstA_H = worstFields.A_H.toFixed(1);
    const worstB_T = worstFields.B_T.toFixed(1), worstB_H = worstFields.B_H.toFixed(1);
    const worstC_T = worstFields.C_T.toFixed(1), worstC_H = worstFields.C_H.toFixed(1);
    const worstD_T = worstFields.D_T.toFixed(1), worstD_H = worstFields.D_H.toFixed(1);

    const crit = results.criteria;
    const txt = `ASTM E45 INCLUSION CLASSIFICATION REPORT\n${"=".repeat(60)}\nGrade: ${steelGrade}\nMethod: A (Worst Field Rating)\n\nWORST FIELD RATINGS\n${"-".repeat(60)}\nType A (Sulfides):  Thin=${worstA_T}  Heavy=${worstA_H}\nType B (Alumina):   Thin=${worstB_T}  Heavy=${worstB_H}\nType C (Silicates): Thin=${worstC_T}  Heavy=${worstC_H}\nType D (Oxides):    Thin=${worstD_T}  Heavy=${worstD_H}\n\nACCEPTANCE CRITERIA\n${"-".repeat(60)}\nType A: Thin≤${crit.A.T}  Heavy≤${crit.A.H}  → ${results.checks.A ? "PASS" : "FAIL"}\nType B: Thin≤${crit.B.T}  Heavy≤${crit.B.H}  → ${results.checks.B ? "PASS" : "FAIL"}\nType C: Thin≤${crit.C.T}  Heavy≤${crit.C.H}  → ${results.checks.C ? "PASS" : "FAIL"}\nType D: Thin≤${crit.D.T}  Heavy≤${crit.D.H}  → ${results.checks.D ? "PASS" : "FAIL"}\n\nOVERALL VERDICT: ${results.overall ? "ACCEPT" : "REJECT"}\n`;
    const blob = new Blob([txt], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "astm_e45_inclusion_report.txt";
    a.click();
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
          <span className="text-dark-200 text-sm">🔬 ASTM E45</span>
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
            {/* Steel Grade Selection */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1.5 block">{t.steelGrade}</label>
              <select value={steelGrade} onChange={(e) => setSteelGrade(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none cursor-pointer">
                {Object.keys(ACCEPTANCE_CRITERIA).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* Method Selection */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">⚙️ {t.methodSelection}</h2>
              </div>
              <div className="p-4">
                <div className="text-xs text-dark-300 mb-3 p-2.5 bg-dark-800 rounded border border-white/[0.06]">
                  {t.methodANote}
                </div>
                <div className="text-xs font-semibold text-dark-50 mb-2">{t.methodA}</div>
              </div>
            </div>

            {/* Input Mode Selection */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <label className="text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-2 block">{t.inputMethod}</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="inputMode" value="multiple" checked={inputMode === "multiple"} onChange={(e) => setInputMode(e.target.value)}
                    className="w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-dark-50">{t.multipleFields}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="inputMode" value="worst" checked={inputMode === "worst"} onChange={(e) => setInputMode(e.target.value)}
                    className="w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-dark-50">{t.worstFieldDirect}</span>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            {inputMode === "multiple" ? (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                  <h2 className="text-xs font-semibold text-dark-100">📊 {t.multipleFields}</h2>
                </div>
                <div className="p-4 space-y-4">
                  <InputField label="Number of Fields" name="numFields" value={numFields} onChange={handleNumFieldsChange} />
                  {["A", "B", "C", "D"].map(type => (
                    <div key={type} className="border-t border-white/[0.04] pt-3">
                      <div className="font-semibold text-sm text-dark-50 mb-2">Type {type}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{t.thin} ({type}_T)</label>
                          <div className="space-y-1">
                            {Array(numFields).fill(0).map((_, i) => (
                              <input key={i} type="number" value={ratings[`${type}_T`][i] || 0} onChange={(e) => handleFieldChange(`${type}_T`, i, e.target.value)}
                                step="0.5" min="0" max="3" placeholder={`Field ${i + 1}`}
                                className="w-full bg-dark-800 border border-white/10 rounded px-2 py-1 text-xs text-dark-50 font-mono focus:border-gold-400/50 focus:outline-none" />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-dark-300 font-bold uppercase tracking-wider mb-1">{t.heavy} ({type}_H)</label>
                          <div className="space-y-1">
                            {Array(numFields).fill(0).map((_, i) => (
                              <input key={i} type="number" value={ratings[`${type}_H`][i] || 0} onChange={(e) => handleFieldChange(`${type}_H`, i, e.target.value)}
                                step="0.5" min="0" max="3" placeholder={`Field ${i + 1}`}
                                className="w-full bg-dark-800 border border-white/10 rounded px-2 py-1 text-xs text-dark-50 font-mono focus:border-gold-400/50 focus:outline-none" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                  <h2 className="text-xs font-semibold text-dark-100">📋 {t.worstFieldDirect}</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {["A", "B", "C", "D"].map(type => (
                    <div key={type} className="space-y-2">
                      <div className="text-sm font-semibold text-dark-50">Type {type}</div>
                      <RatingSelect label={t.thin} value={worstRatings[`${type}_T`]} onChange={(e) => handleWorstChange(`${type}_T`, e.target.value)} />
                      <RatingSelect label={t.heavy} value={worstRatings[`${type}_H`]} onChange={(e) => handleWorstChange(`${type}_H`, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acceptance Criteria Display */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                <h2 className="text-xs font-semibold text-dark-100">✓ {t.acceptanceCriteria}</h2>
              </div>
              <div className="p-4 space-y-2 text-xs">
                {["A", "B", "C", "D"].map(type => {
                  const c = results.criteria[type];
                  return (
                    <div key={type} className="flex justify-between items-center p-2 bg-dark-800 rounded border border-white/[0.06]">
                      <span className="font-semibold text-dark-50">Type {type}</span>
                      <span className="text-dark-300 font-mono">T≤{c.T.toFixed(1)} | H≤{c.H.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7 space-y-5">
            {/* Results Panel */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-gold-400/10 px-5 py-3 border-b border-gold-400/20">
                <h2 className="text-sm font-semibold text-gold-400">📊 {t.results}</h2>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                <VerdictBadge pass={results.checks.A} label="Type A (Sulfides)" />
                <VerdictBadge pass={results.checks.B} label="Type B (Alumina)" />
                <VerdictBadge pass={results.checks.C} label="Type C (Silicates)" />
                <VerdictBadge pass={results.checks.D} label="Type D (Oxides)" />
              </div>
            </div>

            {/* Overall Verdict */}
            <div className={`rounded-xl p-5 border ${results.overall ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
              <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-dark-300">{t.overall}</div>
              <div className={`text-3xl font-black ${results.overall ? "text-green-400" : "text-red-400"}`}>
                {results.overall ? t.verdictPass : t.verdictFail}
              </div>
              <div className="text-xs text-dark-300 mt-2">
                {results.overall ? "All inclusion types meet acceptance criteria." : "One or more inclusion types exceed acceptance criteria."}
              </div>
            </div>

            {/* Worst Field Summary */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-dark-100">📐 Worst Field Ratings</h2>
              </div>
              <table className="w-full text-xs">
                <thead className="text-dark-300 bg-dark-800">
                  <tr>
                    <th className="px-4 py-2 text-left">{t.inclusionType}</th>
                    <th className="px-4 py-2 text-center">{t.thin}</th>
                    <th className="px-4 py-2 text-center">{t.heavy}</th>
                  </tr>
                </thead>
                <tbody>
                  {["A", "B", "C", "D"].map(type => (
                    <tr key={type} className="border-b border-white/[0.04]">
                      <td className="px-4 py-2 font-semibold text-dark-50">Type {type}</td>
                      <td className="px-4 py-2 text-center font-mono text-dark-50">{worstFields[`${type}_T`].toFixed(1)}</td>
                      <td className="px-4 py-2 text-center font-mono text-dark-50">{worstFields[`${type}_H`].toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inclusion Info Tabs */}
            <div className="space-y-3">
              {["A", "B", "C", "D"].map(type => {
                const info = INCLUSION_INFO[type];
                return (
                  <div key={type} className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="bg-white/[0.02] px-4 py-2.5 border-b border-white/[0.06]">
                      <h3 className="text-xs font-semibold text-dark-100">Type {type}</h3>
                    </div>
                    <div className="p-4 space-y-2 text-xs text-dark-300">
                      <div>
                        <span className="font-semibold text-dark-50">{t.composition}:</span> {info.composition}
                      </div>
                      <div>
                        <span className="font-semibold text-dark-50">{t.morphology}:</span> {info.morphology}
                      </div>
                      <div>
                        <span className="font-semibold text-dark-50">{t.significance}:</span> {info.significance}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            
          {/* How-to Briefing */}
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Kimyasal Analizi Gir", desc: "Çeliğin C, Si, Mn, Al, Ca, S, O, N, Ti bileşimini ağırlık yüzdesi olarak gir." },
              { icon: "②", color: "#f59e0b", title: "Proses Parametrelerini Belirle", desc: "Deoksidasyon tipi (Al-killed, Si-killed vb.) ve kalsiyum işlemi durumunu seç." },
              { icon: "③", color: "#8b5cf6", title: "Analiz Et", desc: "Beklenen inklüzyon tipi, morfoloji, bileşim ve proses kaynağı tahmin edilir." },
              { icon: "④", color: "#10b981", title: "Metalürjik Değerlendirme", desc: "ASTM E45 sınıflandırması ve inklüzyon kontrol önerileri sunulur." }]
              : [{ icon: "①", color: "#3b82f6", title: "Enter Chemical Analysis", desc: "Input steel composition: C, Si, Mn, Al, Ca, S, O, N, Ti in weight percent." },
              { icon: "②", color: "#f59e0b", title: "Set Process Parameters", desc: "Select deoxidation type (Al-killed, Si-killed etc.) and calcium treatment status." },
              { icon: "③", color: "#8b5cf6", title: "Analyze", desc: "Expected inclusion type, morphology, composition and process source are predicted." },
              { icon: "④", color: "#10b981", title: "Metallurgical Assessment", desc: "ASTM E45 classification and inclusion control recommendations are provided." }]
            }
            formulas={[{ label: "ASTM E45 — Inclusion Rating", color: "#60a5fa" }, { label: "Ca/S Ratio → Inclusion Morphology", color: "#34d399" }, { label: "Al₂O₃ → CaO·Al₂O₃ Modification", color: "#a78bfa" }]}
          />

          {/* References */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[10px] text-dark-300 font-bold uppercase mb-1">{t.references}</div>
              <div className="text-[11px] text-dark-300 space-y-0.5 font-mono">
                <div>• ASTM E45 — Recommended Practice for Determining Inclusion Content in Steel</div>
                <div>• EN 10247 — Micrographic examination of steel microstructure</div>
                <div>• ISO 4967 — Steel — Determination of non-metallic inclusions</div>
                <div>• EN 1011-2 — Welding steels for steel welding — Classification</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
