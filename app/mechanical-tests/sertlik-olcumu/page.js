'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Sertlik Ölçümü",
  badge: "ASTM E10 · E18 · E92 · ISO 18265", counter: "03 / 06",
  h1: "Sertlik Ölçümü",
  lead: "Sertlik, malzemenin lokal plastik deformasyona gösterdiği direnci ölçer. Çekme dayanımı ile doğrusal korelasyonu, hızlı üretim kontrolü ve HAZ karakterizasyonu için endüstriyel açıdan kritiktir.",
  s1h: "Sertlik Ölçüm Yöntemleri",
  methods: [
    { name: "Vickers (HV)", standard: "ASTM E92 · EN ISO 6507", indenter: "Kare tabanlı elmas piramit, 136°", load: "HV1 (9.81 N) – HV30 (294 N)", formula: "HV = 1.8544 × F / d²", notes: "Geniş sertlik aralığında geçerli. Mikro-HV (HV0.01–HV0.5): HAZ, ince kaplama, kaynak.", accent: "#94a3b8", indLabel: "İNDENTÖR", loadLabel: "YÜK ARALIĞI" },
    { name: "Brinell (HBW)", standard: "ASTM E10 · EN ISO 6506", indenter: "Tungsten karbür bilye, Ø 10 / 5 / 2.5 mm", load: "187.5 – 3000 kgf", formula: "HBW = 0.204 × F / (D·(D−√(D²−d²)))", notes: "Kaba mikroyapılı malzeme için uygundur. HBW > 450 önerilmez.", accent: "#60a5fa", indLabel: "İNDENTÖR", loadLabel: "YÜK ARALIĞI" },
    { name: "Rockwell (HRC / HRB)", standard: "ASTM E18 · EN ISO 6508", indenter: "HRC: Elmas konus 120° / HRB: Ø 1/16 bilye", load: "HRC: 150 kgf / HRB: 100 kgf", formula: "HR = N − (h/S)", notes: "Hızlı, tek değer. Düzgün yüzey şarttır. Kalın malzeme > 0.5 mm önerilir.", accent: "#34d399", indLabel: "İNDENTÖR", loadLabel: "YÜK ARALIĞI" },
  ],
  s2h: "UTS–Sertlik Korelasyonu",
  s2p: "Düşük–orta karbonlu çeliklerde HV ve HBW'nin Rm ile doğrusal ilişkisi pratik kullanımda yaygındır:",
  s2c1: "// HV → Rm (carbon steel)",
  s2c2: "// Brinell için",
  s2note: "* Geçerlilik: HV 90–350. Martenzitik çeliklerde sapma artar.",
  s3h: "Sertlik Dönüşüm Tablosu (ISO 18265)",
  tableHeaders: ["HV", "HBW", "HRC", "HRB", "Rm (MPa) ~"],
  tableNote: "* ISO 18265:2013 Tablo A.1'den seçilmiş değerler.",
  s4h: "Mikrohardness HAZ Haritalama",
  hazItems: [
    { title: "HAZ Sertlik Kriteri – NACE/ISO", text: "NACE MR0175/ISO 15156'ya göre H₂S ortamında karbon çelik bileşenlerinde kaynak HAZ dahil maksimum 250 HV10 sınırı uygulanır. Bu sınırın aşılması HIC/SSC riskini artırır." },
    { title: "Ölçüm Noktası Deseni", text: "Kaynak metalinden baz metale doğru minimum 1 mm aralıklı izler alınır. Tane büyümüş HAZ (CGHAZ), tane incelmiş HAZ (FGHAZ) ve interkritik HAZ (ICHAZ) bölgelerinin ayrı ayrı tanımlanması gerekir." },
    { title: "Yük Seçimi", text: "HV0.1–HV0.5 ince kaplama ve difüzyon bölgelerinde; HV1–HV5 kaynak HAZ için standart aralıktır. HV10 kaba taneli, heterojen yapılarda temsilcilik açısından tercih edilir." },
  ],
  footerPrev: "← Darbe Testi", footerPrevHref: "/mechanical-tests/darbe-testi",
  footerNext: "Katlama / Eğme →", footerNextHref: "/mechanical-tests/katlama-egme-testi",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Hardness Testing",
  badge: "ASTM E10 · E18 · E92 · ISO 18265", counter: "03 / 06",
  h1: "Hardness Testing",
  lead: "Hardness measures a material's resistance to local plastic deformation. Its linear correlation with tensile strength makes it critically important for rapid production control and HAZ characterization.",
  s1h: "Hardness Testing Methods",
  methods: [
    { name: "Vickers (HV)", standard: "ASTM E92 · EN ISO 6507", indenter: "Square-base diamond pyramid, 136°", load: "HV1 (9.81 N) – HV30 (294 N)", formula: "HV = 1.8544 × F / d²", notes: "Valid across wide hardness range. Micro-HV (HV0.01–HV0.5): HAZ, thin coatings, welds.", accent: "#94a3b8", indLabel: "INDENTER", loadLabel: "LOAD RANGE" },
    { name: "Brinell (HBW)", standard: "ASTM E10 · EN ISO 6506", indenter: "Tungsten carbide ball, Ø 10 / 5 / 2.5 mm", load: "187.5 – 3000 kgf", formula: "HBW = 0.204 × F / (D·(D−√(D²−d²)))", notes: "Suitable for coarse microstructure materials. HBW > 450 not recommended.", accent: "#60a5fa", indLabel: "INDENTER", loadLabel: "LOAD RANGE" },
    { name: "Rockwell (HRC / HRB)", standard: "ASTM E18 · EN ISO 6508", indenter: "HRC: Diamond cone 120° / HRB: Ø 1/16 ball", load: "HRC: 150 kgf / HRB: 100 kgf", formula: "HR = N − (h/S)", notes: "Fast, single value. Smooth surface required. Thick material > 0.5 mm recommended.", accent: "#34d399", indLabel: "INDENTER", loadLabel: "LOAD RANGE" },
  ],
  s2h: "UTS–Hardness Correlation",
  s2p: "A linear relationship between HV/HBW and Rm is widely used in practice for low-to-medium carbon steels:",
  s2c1: "// HV → Rm (carbon steel)",
  s2c2: "// For Brinell",
  s2note: "* Validity: HV 90–350. Deviation increases in martensitic steels.",
  s3h: "Hardness Conversion Table (ISO 18265)",
  tableHeaders: ["HV", "HBW", "HRC", "HRB", "Rm (MPa) ~"],
  tableNote: "* Selected values from ISO 18265:2013 Table A.1.",
  s4h: "Microhardness HAZ Mapping",
  hazItems: [
    { title: "HAZ Hardness Criterion – NACE/ISO", text: "Per NACE MR0175/ISO 15156, a maximum of 250 HV10 applies to carbon steel components including weld HAZ in H₂S environments. Exceeding this limit increases HIC/SSC risk." },
    { title: "Measurement Point Pattern", text: "Traverses are taken at minimum 1 mm intervals from weld metal to base metal. The coarse-grained HAZ (CGHAZ), fine-grained HAZ (FGHAZ) and intercritical HAZ (ICHAZ) regions must be identified separately." },
    { title: "Load Selection", text: "HV0.1–HV0.5 for thin coatings and diffusion zones; HV1–HV5 is the standard range for weld HAZ. HV10 is preferred for representativeness in coarse-grained, heterogeneous structures." },
  ],
  footerPrev: "← Impact Test", footerPrevHref: "/mechanical-tests/darbe-testi",
  footerNext: "Bend Test →", footerNextHref: "/mechanical-tests/katlama-egme-testi",
};

const conversions = [
  { hv: 120, hbw: 114, hrc: "–", hrb: 67, rm: 405 },
  { hv: 160, hbw: 152, hrc: "–", hrb: 83, rm: 540 },
  { hv: 200, hbw: 190, hrc: "~14", hrb: 93, rm: 675 },
  { hv: 250, hbw: 238, hrc: "~22", hrb: 99, rm: 845 },
  { hv: 300, hbw: 285, hrc: "~29", hrb: "–", rm: 1010 },
  { hv: 350, hbw: 333, hrc: "~35", hrb: "–", rm: 1180 },
  { hv: 400, hbw: 380, hrc: "~40", hrb: "–", rm: 1350 },
  { hv: 450, hbw: 428, hrc: "~45", hrb: "–", rm: 1515 },
];


function makeS(isDark) {
  const bg = isDark ? "#030712" : "#f8fafc", bg2 = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#1f2937" : "#e5e7eb", title = isDark ? "#fff" : "#0f172a";
  const sub = isDark ? "#9ca3af" : "#6b7280", body = isDark ? "#d1d5db" : "#374151";
  const muted = isDark ? "#6b7280" : "#9ca3af", text = isDark ? "#f3f4f6" : "#111827";
  return {
    page: { minHeight: "100vh", backgroundColor: bg, color: text, transition: "background .2s" },
    breadcrumb: { borderBottom: `1px solid ${border}`, padding: "12px 24px", backgroundColor: bg },
    breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: muted },
    article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
    h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: title, marginBottom: "16px" },
    lead: { color: sub, fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
    h2: { fontSize: "22px", fontWeight: "700", color: title, marginBottom: "8px" },
    divider: { width: "48px", height: "2px", marginBottom: "24px" },
    card: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "20px" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 16px", color: sub, fontFamily: "monospace", fontSize: "11px", borderBottom: `1px solid ${border}`, backgroundColor: bg2 },
    td: { padding: "12px 16px", color: body, fontSize: "12px" },
    tdAccent: { padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", fontWeight: "700" },
    tdGray: { padding: "12px 16px", color: muted, fontSize: "12px" },
    leftBorder: { backgroundColor: bg2, borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: `1px solid ${border}`, marginTop: "32px" },
    codeBlock: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" },
    codeComment: { color: muted, marginBottom: "8px" },
    tableRow: (i) => ({ backgroundColor: i % 2 === 0 ? bg : bg2 }),
    footerLink: { fontSize: "13px", fontFamily: "monospace", color: muted, textDecoration: "none" },
    counterColor: muted,
    itemTitle: { fontWeight: "700", color: title, marginBottom: "8px", fontSize: "15px" },
    itemText: { color: sub, fontSize: "14px", lineHeight: "1.6" },
    bodyText: { color: body, fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" },
    border, body, sub, bg, bg2, title,
  };
}


export default function HardnessTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.breadcrumb}</Link>
          <span>/</span>
          <span style={{ color: s.body }}>{t.breadcrumbSub}</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>{t.badge}</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>{t.counter}</span>
          </div>
          <h1 style={s.h1}>{t.h1}</h1>
          <p style={s.lead}>{t.lead}</p>
        </header>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s1h}</h2>
          <div style={s.divider} />
          {t.methods.map((m) => (
            <div key={m.name} style={s.card}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: m.accent }}>{m.name}</h3>
                  <p style={{ fontSize: "11px", fontFamily: "monospace", color: s.muted, marginTop: "4px" }}>{m.standard}</p>
                </div>
                <code style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#1f2937", color: s.body, padding: "6px 12px", borderRadius: "6px", border: "1px solid #374151" }}>{m.formula}</code>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px", color: s.sub, marginBottom: "16px" }}>
                <div><p style={{ color: "#4b5563", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>{m.indLabel}</p><p>{m.indenter}</p></div>
                <div><p style={{ color: "#4b5563", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>{m.loadLabel}</p><p>{m.load}</p></div>
              </div>
              <p style={{ fontSize: "13px", color: s.muted, lineHeight: "1.5", borderTop: `1px solid ${s.border}`, paddingTop: "12px" }}>{m.notes}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>{t.s2p}</p>
          <div style={{ backgroundColor: s.bg2, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: s.muted, marginBottom: "8px" }}>{t.s2c1}</p>
            <p style={{ color: "#cbd5e1" }}>Rm (MPa) ≈ 3.4 × HV</p>
            <p style={{ color: s.muted, marginTop: "12px", marginBottom: "8px" }}>{t.s2c2}</p>
            <p style={{ color: "#cbd5e1" }}>Rm (MPa) ≈ 3.45 × HBW</p>
            <p style={{ color: s.muted, marginTop: "12px", fontSize: "12px" }}>{t.s2note}</p>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${s.border}` }}>
            <table style={s.table}>
              <thead><tr>{t.tableHeaders.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {conversions.map((row, i) => (
                  <tr key={i} style={s.tableRow(i)}>
                    <td style={s.tdSlate}>{row.hv}</td>
                    <td style={s.td}>{row.hbw}</td>
                    <td style={s.td}>{row.hrc}</td>
                    <td style={s.td}>{row.hrb}</td>
                    <td style={s.tdGray}>{row.rm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace", marginTop: "12px" }}>{t.tableNote}</p>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s4h}</h2>
          <div style={s.divider} />
          {t.hazItems.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: s.sub, fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href={t.footerPrevHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerPrev}</Link>
          <Link href={t.footerNextHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerNext}</Link>
        </footer>
      </article>
    </main>
  );
}
