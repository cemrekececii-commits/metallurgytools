"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CASE_BY_SLUG, CASES } from "@/components/hasar/CaseData";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

// ── translations ──────────────────────────────────────────────
const T = {
  tr: {
    home: "Ana Sayfa", section: "Failure Analysis",
    caseLabel: "Vaka", notFound: "Vaka bulunamadı.", backAll: "← Tüm vakalara dön",
    catWire: "KANGAL / WIRE ROD", catFlat: "BOBİN / FLAT PRODUCT",
    complaint: "Şikâyet Konusu",
    findings: "Tespitler — Findings", causes: "Nedenler — Root Causes",
    prevention: "Proses Kontrolleri / Önleme", references: "Kaynaklar — References",
    gallery: "Metalografik Görüntüler — Micrographs",
    noImage: "Bu vaka için görüntü mevcut değildir.",
    allCases: "☰ Tüm Vakalar",
    imgLabel: (i, total) => `${i} / ${total}`,
  },
  en: {
    home: "Home", section: "Failure Analysis",
    caseLabel: "Case", notFound: "Case not found.", backAll: "← Back to all cases",
    catWire: "WIRE ROD", catFlat: "FLAT PRODUCT / COIL",
    complaint: "Complaint",
    findings: "Findings", causes: "Root Causes",
    prevention: "Process Controls / Prevention", references: "References",
    gallery: "Micrographs",
    noImage: "No images available for this case.",
    allCases: "☰ All Cases",
    imgLabel: (i, total) => `${i} / ${total}`,
  },
  zh: {
    home: "首页", section: "失效分析",
    caseLabel: "案例", notFound: "未找到案例。", backAll: "← 返回所有案例",
    catWire: "线材", catFlat: "扁平材/卷材",
    complaint: "投诉内容",
    findings: "检测结果", causes: "根本原因",
    prevention: "工艺控制 / 预防", references: "参考文献",
    gallery: "金相图像",
    noImage: "此案例无图像。",
    allCases: "☰ 所有案例",
    imgLabel: (i, total) => `${i} / ${total}`,
  },
  ja: {
    home: "ホーム", section: "破損分析",
    caseLabel: "事例", notFound: "事例が見つかりません。", backAll: "← 全事例に戻る",
    catWire: "線材", catFlat: "平板材/コイル",
    complaint: "苦情内容",
    findings: "検査結果", causes: "根本原因",
    prevention: "プロセス管理 / 予防", references: "参考文献",
    gallery: "金属組織写真",
    noImage: "この事例の画像はありません。",
    allCases: "☰ 全事例",
    imgLabel: (i, total) => `${i} / ${total}`,
  },
};

function getStyles(isDark) {
  return {
    page:      { background: isDark ? "#0a0a0a" : "#f1f5f9", minHeight: "100vh", transition: "background .2s" },
    hero:      { background: isDark
      ? "linear-gradient(135deg,#0f1e3a 0%,#091225 70%,#0a0a0a 100%)"
      : "linear-gradient(135deg,#dbeafe 0%,#eff6ff 70%,#f1f5f9 100%)" },
    section:   { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 12 },
    sectionBtn: (open) => ({
      width: "100%", padding: "14px 20px", background: "none", border: "none",
      cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
      borderBottom: open ? (isDark ? "1px solid #1e293b" : "1px solid #e2e8f0") : "none",
    }),
    sectionTitle: { color: isDark ? "#e2e8f0" : "#1e293b", fontWeight: 700, fontSize: 15, flex: 1, textAlign: "left" },
    sectionArrow: { color: isDark ? "#475569" : "#94a3b8", fontSize: 16 },
    bullet:    { color: isDark ? "#94a3b8" : "#475569", fontSize: 14, lineHeight: 1.7 },
    tag:       { background: isDark ? "#1e293b" : "#e2e8f0", color: isDark ? "#94a3b8" : "#475569", borderRadius: 5, padding: "2px 8px", fontSize: 12 },
    badge_w:   { background: isDark ? "#1e3a6e" : "#dbeafe", color: isDark ? "#60a5fa" : "#1d4ed8", border: "1px solid #2563eb" },
    badge_f:   { background: isDark ? "#3b0a0a" : "#fee2e2", color: isDark ? "#f87171" : "#b91c1c", border: "1px solid #dc2626" },
    numBadge:  { background: isDark ? "#1e293b" : "#e2e8f0", color: isDark ? "#64748b" : "#475569", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontFamily: "monospace" },
    navBtn:    { background: isDark ? "#111827" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: isDark ? "#64748b" : "#475569", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 },
    imgViewer: { position: "relative", borderRadius: 12, overflow: "hidden", background: isDark ? "#0a0a0a" : "#f8fafc", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", marginBottom: 12, height: 420 },
    imgThumb: (active) => ({ borderRadius: 8, overflow: "hidden", background: isDark ? "#0f172a" : "#f1f5f9", border: active ? "2px solid #3b82f6" : (isDark ? "1px solid #1e293b" : "1px solid #e2e8f0"), cursor: "pointer", width: 72, height: 54, position: "relative", flexShrink: 0, padding: 0 }),
    sikayet:   { background: isDark ? "#0f172a" : "#eff6ff", border: isDark ? "1px solid #1e293b" : "1px solid #bfdbfe", borderRadius: 8, padding: "10px 14px", fontSize: 13 },
    sikyetText: { color: isDark ? "#94a3b8" : "#475569" },
    linkColor: isDark ? "#475569" : "#64748b",
    breadcrumb: isDark ? "#94a3b8" : "#6b7280",
    titleColor: isDark ? "#f1f5f9" : "#0f172a",
    subColor:   isDark ? "#475569" : "#64748b",
    refText:    isDark ? "#64748b" : "#6b7280",
    divider:    isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
    galleryLabel: isDark ? "#3b82f6" : "#2563eb",
    noImgText:  isDark ? "#475569" : "#94a3b8",
  };
}

function Section({ title, icon, children, isDark }) {
  const [open, setOpen] = useState(true);
  const S = getStyles(isDark);
  return (
    <div style={S.section} className="overflow-hidden">
      <button onClick={() => setOpen(v => !v)} style={S.sectionBtn(open)}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={S.sectionTitle}>{title}</span>
        <span style={S.sectionArrow}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "16px 20px" }}>{children}</div>}
    </div>
  );
}

function BulletList({ items, color, isDark }) {
  const S = getStyles(isDark);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <span style={{ color: color || "#3b82f6", marginTop: 3, flexShrink: 0 }}>•</span>
          <span style={S.bullet}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ImageGallery({ images, labels, isDark, t }) {
  const [active, setActive] = useState(0);
  const S = getStyles(isDark);

  if (!images || images.length === 0) return (
    <div style={{ ...S.section, padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.3 }}>🔬</div>
      <div style={{ color: S.noImgText, fontSize: 14 }}>{t.noImage}</div>
    </div>
  );

  return (
    <div>
      <div style={S.imgViewer}>
        <Image src={`/atlas/${images[active]}`} alt={labels[active] || `${active + 1}`} fill style={{ objectFit: "contain" }} sizes="900px" priority />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, #000000cc)", padding: "20px 16px 12px" }}>
          <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{labels[active] || `${active + 1}`}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>{t.imgLabel(active + 1, images.length)}</div>
        </div>
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(a => Math.max(0, a - 1))} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "#00000088", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>‹</button>
            <button onClick={() => setActive(a => Math.min(images.length - 1, a + 1))} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#00000088", border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>›</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button key={img} onClick={() => setActive(i)} style={S.imgThumb(i === active)}>
              <Image src={`/atlas/${img}`} alt={labels[i] || `${i+1}`} fill style={{ objectFit: "cover", opacity: i === active ? 1 : 0.6 }} sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaseDetailPage() {
  const { slug } = useParams();
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const S = getStyles(isDark);
  const t = T[lang] || T.tr;
  const c = CASE_BY_SLUG[slug];

  if (!c) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={{ paddingTop: 120, textAlign: "center", color: S.noImgText }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ marginTop: 16, fontSize: 16 }}>{t.notFound}</div>
          <Link href="/tools/hasar-vakalari" style={{ color: "#3b82f6", marginTop: 12, display: "block" }}>
            {t.backAll}
          </Link>
        </div>
      </div>
    );
  }

  const idx  = CASES.findIndex(x => x.slug === slug);
  const prev = idx > 0 ? CASES[idx - 1] : null;
  const next = idx < CASES.length - 1 ? CASES[idx + 1] : null;
  const isBadge = c.category === "wire" ? S.badge_w : S.badge_f;

  // Language-aware content selection
  const sikayet   = (lang !== 'tr' && c.sikayet_en)   ? c.sikayet_en   : c.sikayet;
  const tespitler = (lang !== 'tr' && c.tespitler_en) ? c.tespitler_en : c.tespitler;
  const nedenler  = (lang !== 'tr' && c.nedenler_en)  ? c.nedenler_en  : c.nedenler;
  const onleme    = (lang !== 'tr' && c.onleme_en)    ? c.onleme_en    : c.onleme;
  const imgLabels = (lang !== 'tr' && c.imgLabels_en) ? c.imgLabels_en : c.imgLabels;
  const caseTitle = (lang !== 'tr' && c.en)           ? c.en           : c.tr;

  return (
    <div style={S.page}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={S.hero} className="pt-16">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div style={{ color: S.linkColor, fontSize: 13, marginBottom: 14 }}>
            <Link href="/" style={{ color: S.linkColor }}>{t.home}</Link>
            {" → "}
            <Link href="/tools/hasar-vakalari" style={{ color: S.linkColor }}>{t.section}</Link>
            {" → "}
            <span style={{ color: S.breadcrumb }}>{t.caseLabel} #{c.no}</span>
          </div>

          <div className="flex flex-wrap items-start gap-4">
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ ...isBadge, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                  {c.category === "wire" ? t.catWire : t.catFlat}
                </span>
                <span style={S.numBadge}>{t.caseLabel.toUpperCase()} #{c.no.toString().padStart(2,"0")}</span>
              </div>

              <h1 style={{ color: S.titleColor, fontWeight: 800, fontSize: 24, margin: "0 0 4px" }}>{caseTitle}</h1>
              <div style={{ color: S.subColor, fontSize: 14, fontStyle: "italic", marginBottom: 12 }}>{lang === 'tr' ? c.en : c.tr}</div>

              <div className="flex flex-wrap gap-1 mb-4">
                {c.tags.map(tag => <span key={tag} style={S.tag}>{tag}</span>)}
              </div>

              <div style={S.sikayet}>
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>{t.complaint}: </span>
                <span style={S.sikyetText}>{sikayet}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="flex flex-col gap-4">
            <Section title={t.findings} icon="🔎" isDark={isDark}>
              <BulletList items={tespitler} color="#60a5fa" isDark={isDark} />
            </Section>
            <Section title={t.causes} icon="⚙️" isDark={isDark}>
              <BulletList items={nedenler} color="#f87171" isDark={isDark} />
            </Section>
            <Section title={t.prevention} icon="🛡️" isDark={isDark}>
              <BulletList items={onleme} color="#34d399" isDark={isDark} />
            </Section>
            {c.kaynak && (
              <Section title={t.references} icon="📚" isDark={isDark}>
                <p style={{ color: S.refText, fontSize: 13, margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>{c.kaynak}</p>
              </Section>
            )}
          </div>

          <div>
            <div style={{ color: S.galleryLabel, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              {t.gallery}
            </div>
            <ImageGallery images={c.images} labels={imgLabels} isDark={isDark} t={t} />
          </div>
        </div>

        {/* ── PREV / NEXT ── */}
        <div className="flex gap-3 mt-10 pt-8" style={{ borderTop: S.divider }}>
          {prev && (
            <Link href={`/tools/hasar-vakalari/${prev.slug}`} style={S.navBtn}>
              ← #{prev.no} {prev.tr.split(" ").slice(0,3).join(" ")}…
            </Link>
          )}
          <Link href="/tools/hasar-vakalari" style={{ ...S.navBtn, marginLeft: "auto", marginRight: "auto" }}>
            {t.allCases}
          </Link>
          {next && (
            <Link href={`/tools/hasar-vakalari/${next.slug}`} style={{ ...S.navBtn, marginLeft: "auto" }}>
              #{next.no} {next.tr.split(" ").slice(0,3).join(" ")}… →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
