"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";
import { convertHardness, convertMpaToPsi } from "@/lib/hardnessData";

const SCALES = [
  { key: "hbw", label: "Brinell (HBW)" },
  { key: "hv", label: "Vickers (HV)" },
  { key: "hrc", label: "Rockwell C (HRC)" },
  { key: "hrb", label: "Rockwell B (HRB)" },
  { key: "hrf", label: "Rockwell F (HRF)" },
  { key: "hra", label: "Rockwell A (HRA)" },
  { key: "hrd", label: "Rockwell D (HRD)" },
  { key: "hr15n", label: "Superficial 15N (HR15N)" },
  { key: "hr30n", label: "Superficial 30N (HR30N)" },
  { key: "hr45n", label: "Superficial 45N (HR45N)" },
];

const MATERIAL_GROUPS_EN = [
  { key: "carbon_steel", label: "Carbon Steel (Table A.1)" },
  { key: "low_alloy_steel", label: "Low Alloy Steel" },
  { key: "structural_steel", label: "Structural Steel" },
  { key: "qt_steel_qt_condition", label: "Q&T Steel — Q&T Condition (Table B.2)" },
  { key: "qt_steel_untreated_condition", label: "Q&T Steel — Untreated/Normalized (Table B.3)" },
  { key: "unsupported", label: "Other / Unsupported" },
];
const MATERIAL_GROUPS_TR = [
  { key: "carbon_steel", label: "Karbon Çeliği (Tablo A.1)" },
  { key: "low_alloy_steel", label: "Düşük Alaşımlı Çelik" },
  { key: "structural_steel", label: "Yapı Çeliği" },
  { key: "qt_steel_qt_condition", label: "SV&T Çelik — SV&T Durumu (Tablo B.2)" },
  { key: "qt_steel_untreated_condition", label: "SV&T Çelik — İşlemsiz/Normalize (Tablo B.3)" },
  { key: "unsupported", label: "Diğer / Desteklenmeyen" },
];

const STATUS_COLORS = {
  exact: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  interpolated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  out_of_range: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  unsupported: "bg-white/5 text-dark-300 border-white/10",
};

const T = {
  tr: {
    title: "Sertlik Dönüşümü ve Mukavemet Referansı",
    subtitle: "Sertlik skalası karşılaştırması ve sınırlı mukavemet tahmini için mühendislik referans aracı",
    badge: "Standartlara Dayalı | Kapsamı Sınırlı | Mühendislik Kullanımı",
    inputTitle: "Girdi Parametreleri",
    hardnessValue: "Sertlik Değeri",
    inputScale: "Girdi Skalası",
    materialGroup: "Malzeme Grubu",
    showStrength: "Çekme mukavemeti referansını göster",
    displayUnits: "Birimler",
    convert: "Dönüştür",
    reset: "Sıfırla",
    results: "Dönüşüm Sonuçları",
    awaiting: "Girdi Bekleniyor",
    awaitingDesc: "Dönüşüm sonuçlarını görmek için soldaki panelden parametreleri seçin.",
    uts: "Çekme Mukavemeti (UTS)",
    approx: "Yalnızca yaklaşık referans",
    utsWarn: "Bu değer çekme testinin yerine geçmez.",
    exact: "Tam Eşleşme",
    interpolated: "İnterpolasyonlu",
    out_of_range: "Aralık Dışı",
    unsupported: "Mevcut Değil",
    warningTitle: "Mühendislik Geçerliliği ve Sınırlamalar",
    w1: "Sertlik dönüşüm değerleri, tablolanmış bir noktayla doğrudan eşleşmediği sürece yaklaşıktır.",
    w2: "Dönüşümler alaşım sistemine, mikroyapıya ve metalürjik duruma bağlıdır.",
    w3: "Çekme mukavemeti eşdeğerliği yalnızca sınırlı çelik grupları için referans tahmini olarak geçerlidir.",
    w4: "Sertifikasyon veya tasarıma yönelik kritik kararlar için orijinal test yöntemini kullanın.",
    notesTitle: "Teknik Notlar",
    n1t: "İz Bırakma Yöntemleri", n1: "Farklı sertlik skalaları farklı iz bırakıcılar ve yükler kullanır. Plastik deformasyona karşı farklı fiziksel tepkileri ölçerler.",
    n2t: "Mikroyapı Etkisi", n2: "Sertlik-mukavemet ilişkisi mikroyapıya bağlıdır. SV&T çelikler genellikle normalize çeliklerden farklı dönüşüm eğrileri gösterir.",
    n3t: "Soğuk İşlem ve Isıl İşlem", n3: "Ağır soğuk işlem sertlik-mukavemet ilişkisini bozar. Dönüşümler östenitik olmayan çelikler için en güvenilirdir.",
    refTitle: "Referans Temeli",
    refDesc: "Bu araç kabul görmüş standartları takip eder. Nihai uygulama lisanslı referanslara karşı kontrol edilmelidir.",
    disclaimer: "Bu araç yalnızca belirtilen kapsam dahilinde mühendislik referans değerleri sağlar. Onaylı test sonuçlarının yerine geçmez.",
    mpa: "MPa", psi: "psi", both: "Her İkisi (MPa / psi)",
    free: "ÜCRETSİZ", upgrade: "Yükselt →",
    wantMore: "Daha fazla araç mı istiyorsunuz?",
    viewPlans: "Planları İncele →",
    copy: "Sonuçları Kopyala", copied: "Kopyalandı!",
    scaleHelp: "HBW = Brinell (Tungsten Karbür Bilye) | HV = Vickers (Elmas Piramit) | HRC/HRB = Rockwell",
  },
  en: {
    title: "Hardness Conversion and Strength Reference",
    subtitle: "Engineering reference tool for hardness scale comparison and limited strength estimation",
    badge: "Standards-based | Scope-limited | Engineering use",
    inputTitle: "Input Parameters",
    hardnessValue: "Hardness Value",
    inputScale: "Input Scale",
    materialGroup: "Material Group",
    showStrength: "Show approximate tensile strength reference",
    displayUnits: "Display Units",
    convert: "Convert",
    reset: "Reset",
    results: "Conversion Results",
    awaiting: "Awaiting Input",
    awaitingDesc: "Enter a hardness value and select parameters on the left to view conversion results.",
    uts: "Tensile Strength (UTS)",
    approx: "Approximate reference only",
    utsWarn: "This value is not a substitute for tensile testing.",
    exact: "Exact Match",
    interpolated: "Interpolated",
    out_of_range: "Out of Range",
    unsupported: "Not Available",
    warningTitle: "Engineering Validity & Limitations",
    w1: "Hardness conversion values are approximate unless directly matched to a tabulated point.",
    w2: "Conversions depend heavily on alloy system, microstructure, and metallurgical condition.",
    w3: "Tensile strength equivalence is valid only for limited steel groups and only as a reference estimate.",
    w4: "For certification or design-critical decisions, use the original test method and applicable standard.",
    notesTitle: "Technical Notes",
    n1t: "Indentation Methods", n1: "Different hardness scales use different indenters and loads. They measure different physical responses to plastic deformation.",
    n2t: "Microstructure Influence", n2: "The hardness-strength relationship changes depending on whether the microstructure is ferrite-pearlite, bainite, or tempered martensite.",
    n3t: "Cold Work & Heat Treatment", n3: "Heavy cold work distorts the hardness-to-strength relationship. Conversions are generally most reliable for non-austenitic steels.",
    refTitle: "Reference Basis",
    refDesc: "This tool is structured to follow recognized standards. Final implementation should be checked against licensed references.",
    disclaimer: "This tool provides engineering reference values only within stated scope. It is not a replacement for certified test results.",
    mpa: "MPa", psi: "psi", both: "Both (MPa / psi)",
    free: "FREE", upgrade: "Upgrade →",
    wantMore: "Want more tools?",
    viewPlans: "View Plans →",
    copy: "Copy Results", copied: "Copied!",
    scaleHelp: "HBW = Brinell (WC Ball) | HV = Vickers (Diamond Pyramid) | HRC/HRB = Rockwell Scales",
  },
};

export default function HardnessConverter() {
  const { lang, switchLang } = useLang();
  const t = T[lang] || T.en;
  const matGroups = lang === "tr" ? MATERIAL_GROUPS_TR : MATERIAL_GROUPS_EN;

  const [inputScale, setInputScale] = useState("hv");
  const [inputValue, setInputValue] = useState("");
  const [material, setMaterial] = useState("carbon_steel");
  const [showStrength, setShowStrength] = useState(true);
  const [units, setUnits] = useState("both");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) return;
    setResult(convertHardness(val, inputScale, material));
  };

  const handleReset = () => { setResult(null); setInputValue(""); };

  const handleCopy = () => {
    if (!result) return;
    const lines = SCALES.map(s => `${s.label}: ${result[s.key]?.value ?? "—"}`);
    if (result.uts_mpa?.value) lines.push(`UTS: ${result.uts_mpa.value} MPa`);
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusLabel = (status) => t[status] || status;

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
          <span className="text-dark-200 text-sm">🔧</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
        <p className="text-dark-300 text-sm mb-2">{t.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 mb-6">
          <span>✓</span> {t.badge}
        </div>

        {/* Warning */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-orange-400 mb-3">⚠ {t.warningTitle}</h3>
          <div className="space-y-1.5 text-xs text-dark-200">
            <p>• {t.w1}</p><p>• {t.w2}</p><p>• {t.w3}</p>
            <p className="text-orange-400 font-medium mt-2">• {t.w4}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Input Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 sticky top-20">
              <h2 className="text-sm font-semibold text-dark-100 mb-5">{t.inputTitle}</h2>

              <div className="mb-4">
                <label className="text-xs text-dark-300 block mb-1">{t.inputScale}</label>
                <select value={inputScale} onChange={e => { setInputScale(e.target.value); setResult(null); }}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                  {SCALES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="text-xs text-dark-300 block mb-1">{t.hardnessValue}</label>
                <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleConvert()}
                  placeholder="e.g. 250" className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none font-mono" />
              </div>

              <div className="mb-4">
                <label className="text-xs text-dark-300 block mb-1">{t.materialGroup}</label>
                <select value={material} onChange={e => setMaterial(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-dark-50 focus:border-gold-400/50 focus:outline-none">
                  {matGroups.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={showStrength} onChange={e => setShowStrength(e.target.checked)}
                  className="accent-yellow-500" />
                <span className="text-xs text-dark-200">{t.showStrength}</span>
              </label>

              <div className="mb-5">
                <label className="text-xs text-dark-300 block mb-1">{t.displayUnits}</label>
                <div className="flex gap-2">
                  {[["mpa",t.mpa],["psi",t.psi],["both",t.both]].map(([k,l]) => (
                    <button key={k} onClick={() => setUnits(k)}
                      className={`px-3 py-1.5 rounded text-xs border cursor-pointer font-sans transition-all ${units === k ? "bg-gold-400/15 border-gold-400/40 text-gold-400" : "bg-white/[0.03] border-white/[0.08] text-dark-300"}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleConvert} disabled={!inputValue}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all font-sans border-none ${inputValue ? "bg-gradient-to-r from-gold-400 to-gold-500 text-dark-800 cursor-pointer" : "bg-white/5 text-dark-300 cursor-not-allowed"}`}>{t.convert}</button>
                <button onClick={handleReset}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-white/5 text-dark-200 border border-white/10 cursor-pointer font-sans hover:bg-white/10">{t.reset}</button>
              </div>

              <p className="text-[10px] text-dark-300 mt-4 font-mono">{t.scaleHelp}</p>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-sm font-semibold text-dark-100">{t.results}</h2>
                  <button onClick={handleCopy}
                    className="px-3 py-1.5 rounded text-xs bg-white/5 border border-white/10 text-dark-200 cursor-pointer font-sans hover:bg-white/10">
                    {copied ? "✓ " + t.copied : t.copy}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {SCALES.map(s => {
                    const r = result[s.key];
                    if (!r) return null;
                    const isInput = s.key === inputScale;
                    return (
                      <div key={s.key} className={`rounded-lg p-3.5 border ${isInput ? "bg-gold-400/10 border-gold-400/30" : "bg-dark-800 border-white/[0.06]"}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-dark-300">{s.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[r.status]}`}>{statusLabel(r.status)}</span>
                        </div>
                        <div className={`text-xl font-bold font-mono ${isInput ? "text-gold-400" : r.value !== null ? "text-dark-50" : "text-dark-300"}`}>
                          {r.value !== null ? r.value : "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* UTS */}
                {showStrength && (
                  <div className="border-t border-white/[0.06] pt-5">
                    <h3 className="text-sm font-semibold text-dark-100 mb-3">{t.uts}</h3>
                    {result.uts_mpa?.value ? (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-baseline gap-3 mb-2">
                          {(units === "mpa" || units === "both") && (
                            <span className="text-2xl font-bold font-mono text-blue-400">{result.uts_mpa.value} MPa</span>
                          )}
                          {(units === "psi" || units === "both") && (
                            <span className={`font-bold font-mono ${units === "both" ? "text-lg text-dark-200" : "text-2xl text-blue-400"}`}>
                              {units === "both" ? "/ " : ""}{convertMpaToPsi(result.uts_mpa.value).toLocaleString()} psi
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[result.uts_mpa.status]}`}>{statusLabel(result.uts_mpa.status)}</span>
                        <p className="text-xs text-dark-300 mt-2">⚠ {t.approx}. {t.utsWarn}</p>
                      </div>
                    ) : (
                      <div className="bg-dark-800 rounded-lg p-4 text-dark-300 text-sm">
                        {t.unsupported}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-12 flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold text-dark-300 mb-2">{t.awaiting}</h3>
                <p className="text-dark-300 text-sm max-w-sm">{t.awaitingDesc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Technical Notes */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-4">{t.notesTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[[t.n1t,t.n1],[t.n2t,t.n2],[t.n3t,t.n3]].map(([title,content],i) => (
              <div key={i} className="bg-dark-800 rounded-lg p-4">
                <div className="text-gold-400 text-xs font-semibold mb-2">{title}</div>
                <div className="text-dark-300 text-xs leading-relaxed">{content}</div>
              </div>
            ))}
          </div>
        </div>

        
          {/* How-to Briefing */}
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Sertlik Skalası Seç", desc: "Kaynak skalayı seç: HRC, HV, HB (Brinell), HRB veya çekme mukavemeti (MPa)." },
              { icon: "②", color: "#f59e0b", title: "Değeri Gir", desc: "Bilinen sertlik veya mukavemet değerini sayısal olarak gir." },
              { icon: "③", color: "#10b981", title: "Sonuçları Oku", desc: "Tüm skalalara (HRC, HV, HB, HRB, MPa, ksi) otomatik dönüşüm tablosu görüntülenir." }]
              : [{ icon: "①", color: "#3b82f6", title: "Select Hardness Scale", desc: "Choose source scale: HRC, HV, HB (Brinell), HRB or tensile strength (MPa)." },
              { icon: "②", color: "#f59e0b", title: "Enter Value", desc: "Input the known hardness or strength value numerically." },
              { icon: "③", color: "#10b981", title: "Read Results", desc: "Automatic conversion table to all scales (HRC, HV, HB, HRB, MPa, ksi) is displayed." }]
            }
            formulas={[{ label: "ASTM E140 Conversion Tables", color: "#60a5fa" }, { label: "ISO 18265 Cross-Reference", color: "#34d399" }]}
          />

          {/* References */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-dark-100 mb-2">{t.refTitle}</h3>
          <p className="text-dark-300 text-xs mb-3">{t.refDesc}</p>
          <div className="text-xs text-dark-200 space-y-1 font-mono">
            <div>• ASTM E140 — Standard Hardness Conversion Tables for Metals</div>
            <div>• ISO 18265 — Metallic materials — Conversion of hardness values</div>
            <div>• ASTM E10 / E18 / E92 / E384 — Relevant test method references</div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="text-center text-xs text-dark-300 py-4 border-t border-white/[0.06]">
          <p className="font-medium mb-1">{t.disclaimer}</p>
          <p className="text-dark-400">© {new Date().getFullYear()} MetallurgyTools. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
