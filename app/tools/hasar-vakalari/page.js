"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { CASES, CATEGORIES } from "@/components/hasar/CaseData";
import { useLang } from "@/lib/LanguageContext";
import ToolBriefing from "@/components/ToolBriefing";
import { useTheme } from "@/lib/ThemeContext";

// ── translations ──────────────────────────────────────────────
const T = {
  tr: {
    home: "Ana Sayfa", tools: "Araçlar", section: "Hasar Vakaları",
    title: "Failure Analysis", subtitle: "Hasar Vakaları — Üretim Kusurları Atlası",
    desc: "Kangal (wire rod) ve bobin (coil) ürünlerinde müşteri şikayetlerine konu olan",
    descBold: "25 gerçek üretim kusuru vakası",
    descEnd: "Her vaka optik mikroskop, SEM-EDS ve mekanik test verileri ile karakterize edilmiş; oluşum mekanizması, kök neden analizi ve proses kontrolleri dokümante edilmiştir.",
    statTotal: "Toplam Vaka", statWire: "Wire Rod / Kangal", statFlat: "Flat / Bobin", statImg: "Görüntülü Vaka",
    filterAll: (n) => `Tümü (${n})`, filterWire: (n) => `Kangal / Wire Rod (${n})`, filterFlat: (n) => `Bobin / Coil (${n})`,
    searchPlaceholder: "Ara: white layer, GBC, chevron, tufal…",
    wireTitle: "Uzun Mamul — Wire Rod / Kangal", wireRange: (n) => `Vakalar 1–${n}`,
    flatTitle: "Yassı Mamul — Flat Product / Bobin", flatRange: (s, e) => `Vakalar ${s}–${e}`,
    noResult: "Arama kriterine uyan vaka bulunamadı.",
    imgCount: (n) => `${n} görüntü`, noImg: "Görüntü yok", detail: "Detay →",
    catWire: "KANGAL", catFlat: "BOBİN",
  },
  en: {
    home: "Home", tools: "Tools", section: "Failure Analysis",
    title: "Failure Analysis", subtitle: "Production Defect Case Atlas",
    desc: "25 real production defect cases from wire rod and coil products —",
    descBold: "25 real production defect cases",
    descEnd: "Each case is characterized by optical microscopy, SEM-EDS and mechanical test data; formation mechanism, root cause analysis and process controls are documented.",
    statTotal: "Total Cases", statWire: "Wire Rod", statFlat: "Flat / Coil", statImg: "Cases with Images",
    filterAll: (n) => `All (${n})`, filterWire: (n) => `Wire Rod (${n})`, filterFlat: (n) => `Coil / Flat (${n})`,
    searchPlaceholder: "Search: white layer, GBC, chevron, scale…",
    wireTitle: "Long Product Defects — Wire Rod", wireRange: (n) => `Cases 1–${n}`,
    flatTitle: "Flat Product Defects — Coil", flatRange: (s, e) => `Cases ${s}–${e}`,
    noResult: "No cases match your search criteria.",
    imgCount: (n) => `${n} images`, noImg: "No images", detail: "Detail →",
    catWire: "WIRE ROD", catFlat: "COIL",
  },
  zh: {
    home: "首页", tools: "工具", section: "失效分析",
    title: "失效分析", subtitle: "生产缺陷案例图谱",
    desc: "线材和卷材产品中的", descBold: "25个真实生产缺陷案例",
    descEnd: "每个案例均通过光学显微镜、SEM-EDS和力学测试数据进行表征，记录了形成机理、根本原因分析和工艺控制措施。",
    statTotal: "总案例", statWire: "线材", statFlat: "卷材", statImg: "含图案例",
    filterAll: (n) => `全部 (${n})`, filterWire: (n) => `线材 (${n})`, filterFlat: (n) => `卷材 (${n})`,
    searchPlaceholder: "搜索：白层、GBC、人字裂纹、氧化铁皮…",
    wireTitle: "长材缺陷 — 线材", wireRange: (n) => `案例 1–${n}`,
    flatTitle: "扁平材缺陷 — 卷材", flatRange: (s, e) => `案例 ${s}–${e}`,
    noResult: "未找到匹配的案例。",
    imgCount: (n) => `${n} 张图片`, noImg: "无图片", detail: "详情 →",
    catWire: "线材", catFlat: "卷材",
  },
  ja: {
    home: "ホーム", tools: "ツール", section: "破損分析",
    title: "破損分析", subtitle: "生産欠陥事例アトラス",
    desc: "線材とコイル製品の", descBold: "25件の実生産欠陥事例",
    descEnd: "各事例は光学顕微鏡、SEM-EDS、機械試験データで特性評価され、生成メカニズム、根本原因分析、プロセス管理が文書化されています。",
    statTotal: "総事例数", statWire: "線材", statFlat: "コイル", statImg: "画像付き事例",
    filterAll: (n) => `すべて (${n})`, filterWire: (n) => `線材 (${n})`, filterFlat: (n) => `コイル (${n})`,
    searchPlaceholder: "検索：ホワイトレイヤー、GBC、シェブロン…",
    wireTitle: "長尺材欠陥 — 線材", wireRange: (n) => `事例 1–${n}`,
    flatTitle: "平板材欠陥 — コイル", flatRange: (s, e) => `事例 ${s}–${e}`,
    noResult: "検索条件に一致する事例が見つかりません。",
    imgCount: (n) => `${n} 枚`, noImg: "画像なし", detail: "詳細 →",
    catWire: "線材", catFlat: "コイル",
  },
};

function getStyles(isDark) {
  return {
    page:    { background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh", transition: "background .2s" },
    hero:    { background: isDark
      ? "linear-gradient(135deg,#0f1e3a 0%,#091225 60%,#0a0a0a 100%)"
      : "linear-gradient(135deg,#dbeafe 0%,#eff6ff 60%,#f1f5f9 100%)" },
    card:    { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" },
    cardHov: { background: isDark ? "#1a2540" : "#eff6ff", border: "1px solid #2563eb" },
    badge_w: { background: isDark ? "#1e3a6e" : "#dbeafe", color: isDark ? "#60a5fa" : "#1d4ed8", border: "1px solid #2563eb" },
    badge_f: { background: isDark ? "#3b0a0a" : "#fee2e2", color: isDark ? "#f87171" : "#b91c1c", border: "1px solid #dc2626" },
    tag:     { background: isDark ? "#1e293b" : "#e2e8f0", color: isDark ? "#94a3b8" : "#475569" },
    imgBox:  { background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" },
    filterBar: { background: isDark ? "#0d1117" : "#f8fafc", borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" },
    filterBtn: (active) => ({
      background: active ? "#1e40af" : (isDark ? "#111827" : "#ffffff"),
      border: `1px solid ${active ? "#3b82f6" : (isDark ? "#1e293b" : "#e2e8f0")}`,
      color: active ? "#bfdbfe" : (isDark ? "#64748b" : "#475569"),
      borderRadius: 8, padding: "6px 16px", fontSize: 13, cursor: "pointer", transition: "all .15s",
    }),
    searchInput: {
      background: isDark ? "#111827" : "#ffffff",
      border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      color: isDark ? "#e2e8f0" : "#1e293b",
      borderRadius: 8, padding: "6px 14px", fontSize: 13, outline: "none", marginLeft: "auto", width: 300,
    },
    statCard: { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 10, padding: "10px 18px", minWidth: 100 },
    titleColor: isDark ? "#f1f5f9" : "#0f172a",
    subColor: isDark ? "#64748b" : "#64748b",
    textColor: isDark ? "#94a3b8" : "#475569",
    contentTitle: isDark ? "#e2e8f0" : "#1e293b",
    footerBorder: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
    footerText: isDark ? "#475569" : "#64748b",
    linkColor: isDark ? "#475569" : "#64748b",
    noResults: isDark ? "#475569" : "#94a3b8",
  };
}

function CaseCard({ c, t, isDark }) {
  const [hov, setHov] = useState(false);
  const S = getStyles(isDark);
  const thumb = c.images[0] ? `/atlas/${c.images[0]}` : null;

  return (
    <Link
      href={`/tools/hasar-vakalari/${c.slug}`}
      style={hov ? S.cardHov : S.card}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rounded-xl overflow-hidden no-underline flex flex-col transition-all duration-200 group"
    >
      <div style={{ ...S.imgBox, height: 180, position: "relative", overflow: "hidden" }}>
        {thumb ? (
          <Image src={thumb} alt={c.tr} fill
            style={{ objectFit: "cover", opacity: hov ? 1 : 0.85, transition: "opacity .2s" }}
            sizes="(max-width: 768px) 100vw, 360px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: 48, opacity: 0.18 }}>🔬</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10, background: "#000000cc", borderRadius: 6, padding: "2px 10px", fontFamily: "monospace", fontSize: 13, color: "#94a3b8", fontWeight: 700 }}>
          #{c.no.toString().padStart(2,"0")}
        </div>
        <div style={{ position: "absolute", top: 10, right: 10, ...(c.category === "wire" ? S.badge_w : S.badge_f), borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>
          {c.category === "wire" ? t.catWire : t.catFlat}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div style={{ fontWeight: 700, color: S.contentTitle, fontSize: 14, lineHeight: 1.4 }}>{c.tr}</div>
        <div style={{ color: S.subColor, fontSize: 12, fontStyle: "italic" }}>{c.en}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {c.tags.slice(0, 4).map(tag => (
            <span key={tag} style={{ ...S.tag, borderRadius: 4, padding: "1px 7px", fontSize: 11 }}>{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: S.footerBorder }}>
          <span style={{ fontSize: 12, color: S.footerText }}>
            {c.images.length > 0 ? t.imgCount(c.images.length) : t.noImg}
          </span>
          <span style={{ fontSize: 12, color: "#3b82f6" }}>{t.detail}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HasarVakalariPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const S = getStyles(isDark);
  const t = T[lang] || T.tr;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = CASES;
    if (filter !== "all") list = list.filter(c => c.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.tr.toLowerCase().includes(q) ||
        c.en.toLowerCase().includes(q) ||
        c.tags.some(tag => tag.toLowerCase().includes(q)) ||
        c.sikayet.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const wireCnt = CASES.filter(c => c.category === "wire").length;
  const flatCnt = CASES.filter(c => c.category === "flat").length;

  return (
    <div style={S.page}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={S.hero} className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div style={{ color: S.linkColor, fontSize: 13, marginBottom: 16 }}>
            <Link href="/" style={{ color: S.linkColor }}>{t.home}</Link>
            {" → "}
            <Link href="/tools" style={{ color: S.linkColor }}>{t.tools}</Link>
            {" → "}
            <span style={{ color: S.textColor }}>{t.section}</span>
          </div>

          <div className="flex flex-col gap-4">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg,#1e40af,#1e3a8a)", border: "1px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🔬</div>
              <div>
                <h1 style={{ color: S.titleColor, fontWeight: 800, fontSize: 28, margin: 0 }}>{t.title}</h1>
                <div style={{ color: S.subColor, fontSize: 14, marginTop: 2 }}>{t.subtitle}</div>
              </div>
            </div>

            <p style={{ color: S.textColor, fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
              {t.desc}{" "}
              <strong style={{ color: "#3b82f6" }}>{t.descBold}</strong>.{" "}
              {t.descEnd}
            </p>

            <div className="flex gap-4 flex-wrap">
              {[
                { label: t.statTotal, val: CASES.length, color: "#3b82f6" },
                { label: t.statWire, val: wireCnt, color: "#3b82f6" },
                { label: t.statFlat, val: flatCnt, color: "#ef4444" },
                { label: t.statImg, val: CASES.filter(c=>c.images.length>0).length, color: "#10b981" },
              ].map(({ label, val, color }) => (
                <div key={label} style={S.statCard}>
                  <div style={{ color, fontSize: 22, fontWeight: 800 }}>{val}</div>
                  <div style={{ color: S.subColor, fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTERS + SEARCH ── */}
      <div style={S.filterBar}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 items-center">
          {[
            { id: "all",  label: t.filterAll(CASES.length) },
            { id: "wire", label: t.filterWire(wireCnt) },
            { id: "flat", label: t.filterFlat(flatCnt) },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setFilter(id)} style={S.filterBtn(filter === id)}>{label}</button>
          ))}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={S.searchInput}
          />
        </div>
      </div>

      {/* ── CASE GRID ── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div style={{ color: S.noResults, textAlign: "center", padding: "60px 0", fontSize: 15 }}>{t.noResult}</div>
        ) : (
          <>
            {(filter === "all" || filter === "wire") && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 4, height: 28, background: "#2563eb", borderRadius: 2 }} />
                  <div>
                    <h2 style={{ color: S.contentTitle, fontWeight: 700, fontSize: 18, margin: 0 }}>{t.wireTitle}</h2>
                    <div style={{ color: S.subColor, fontSize: 13 }}>{t.wireRange(wireCnt)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.filter(c => c.category === "wire").map(c => (
                    <CaseCard key={c.slug} c={c} t={t} isDark={isDark} />
                  ))}
                </div>
              </section>
            )}

            {(filter === "all" || filter === "flat") && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 4, height: 28, background: "#dc2626", borderRadius: 2 }} />
                  <div>
                    <h2 style={{ color: S.contentTitle, fontWeight: 700, fontSize: 18, margin: 0 }}>{t.flatTitle}</h2>
                    <div style={{ color: S.subColor, fontSize: 13 }}>{t.flatRange(wireCnt + 1, CASES.length)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.filter(c => c.category === "flat").map(c => (
                    <CaseCard key={c.slug} c={c} t={t} isDark={isDark} />
                  ))}
                </div>
              </section>
            )}

            {/* How-to Briefing */}
            <div className="mt-10 max-w-6xl mx-auto px-4">
              <ToolBriefing
                title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
                steps={lang === "tr"
                  ? [{ icon: "①", color: "#3b82f6", title: "Hasar Vakası Seç", desc: "Listeden incelemek istediğin hasar analizi vakasını seç." },
                  { icon: "②", color: "#f59e0b", title: "Makro ve Mikro Bulguları İncele", desc: "Makroskopik görünüm, metalografik kesitler ve SEM görüntülerini incele." },
                  { icon: "③", color: "#8b5cf6", title: "Kök Neden Analizini Oku", desc: "Hasarın metalürjik kök nedeni, kırılma mekanizması ve proses ilişkisi açıklanır." },
                  { icon: "④", color: "#10b981", title: "Önlemleri Değerlendir", desc: "Tekrarlanmaması için önerilen proses ve kalite kontrol düzeltici faaliyetler listelenir." }]
                  : [{ icon: "①", color: "#3b82f6", title: "Select Failure Case", desc: "Choose the failure analysis case you want to review from the list." },
                  { icon: "②", color: "#f59e0b", title: "Review Macro and Micro Findings", desc: "Examine macroscopic appearance, metallographic sections and SEM images." },
                  { icon: "③", color: "#8b5cf6", title: "Read Root Cause Analysis", desc: "Metallurgical root cause, fracture mechanism and process relationship are explained." },
                  { icon: "④", color: "#10b981", title: "Evaluate Corrective Actions", desc: "Recommended process and quality control corrective actions to prevent recurrence are listed." }]
                }
                formulas={[]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
