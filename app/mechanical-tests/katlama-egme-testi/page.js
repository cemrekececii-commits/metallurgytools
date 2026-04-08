'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Katlama / Eğme Testi",
  badge: "EN ISO 7438 · ASTM E290", counter: "04 / 06",
  h1: "Katlama / Eğme Testi",
  lead: "Eğme testi, malzemenin sünek deformasyon kapasitesini ve yüzey bütünlüğünü belirler. Sac malzeme şekillendirilebilirliği ve kaynak dikiş yeterliliğinin doğrulanmasında birincil yöntemdir.",
  s1h: "Test Konfigürasyonları",
  configs: [
    { title: "Kılavuzlu Eğme", sub: "Guided Bend", desc: "Belirli mandrel çapı etrafında sabit açıya kadar eğme. EN ISO 7438 ve ASTM E290 temel konfigürasyonu. Kaynak testlerinde (ASME IX, ISO 15614-1) uygulanır.", items: ["Zımba-kalıp seti", "d/t oranı kritik", "Convex/concave yüzey"] },
    { title: "Serbest Eğme", sub: "Free Bend", desc: "Sabit mesafeli iki destek üzerinde ortadan yük. Üç noktalı eğme düzeneğinde eğme açısı ve mandrel çapı ilişkisi belirlenir.", items: ["L/d oranı kontrolü", "Sac formability testi", "VDA 238-100 uyumlu"] },
    { title: "Sarma Testi", sub: "Wrap-Around Bend", desc: "Numune belirli çaplı silindir etrafına sarılır. İnce saclar ve kaplı malzemeler için uygundur.", items: ["EN ISO 8491 tel ürünler", "Spiral eğme teli", "Kaplama bütünlüğü"] },
  ],
  s2h: "Mandrel Çapı Gereksinimleri",
  tableHeaders: ["Çelik Sınıfı", "Kalınlık", "d/t Oranı", "Eğme Açısı", "Standart"],
  tableNote: "* t = numune kalınlığı, d = mandrel çapı.",
  s3h: "Kırılma Metalürjisi ve Ret Kriterleri",
  s3p: "Eğme numunesi dış yüzeyi çekme gerilmesi altında, iç yüzeyi basma altında kalır. Dış yarıçaptaki maksimum gerinim:",
  s3c: "// Dış yüzey maksimum gerinim",
  s3ex: "Örnek: t = 5 mm, d = 10 mm → ε_max = 5/15 = 0.333 (%33,3)",
  rejectItems: [
    { title: "Laminasyon ve Bantlaşma", text: "Hadde ürününde çift yönlü segregasyon bantları eğme sırasında delamination ile kendini gösterir. MnS bandlaşması kalınlık yönünde düktilitesi olan malzemelerde (Z35 kalitesi) kontrol edilir." },
    { title: "Kaynak Eğme Testi Reddi", text: "ASME IX QW-163'e göre 3,2 mm'nin üzerindeki herhangi bir çatlak red kriteri oluşturur. HAZ çatlakları; CGHAZ'da martenzit oluşumunu ve H₂ kırılganlığını düşündürmelidir." },
  ],
  footerPrev: "← Sertlik Ölçümü", footerPrevHref: "/mechanical-tests/sertlik-olcumu",
  footerNext: "DWTT →", footerNextHref: "/mechanical-tests/dwtt",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Bend Test",
  badge: "EN ISO 7438 · ASTM E290", counter: "04 / 06",
  h1: "Bend Test",
  lead: "The bend test determines the ductile deformation capacity and surface integrity of materials. It is the primary method for verifying sheet material formability and weld seam qualification.",
  s1h: "Test Configurations",
  configs: [
    { title: "Guided Bend", sub: "Guided Bend", desc: "Bending to a fixed angle around a specified mandrel diameter. Basic configuration of EN ISO 7438 and ASTM E290. Applied in weld tests (ASME IX, ISO 15614-1).", items: ["Punch-die set", "d/t ratio critical", "Convex/concave face"] },
    { title: "Free Bend", sub: "Free Bend", desc: "Load applied at center over two fixed-distance supports. The relationship between bend angle and mandrel diameter is determined in a three-point bending setup.", items: ["L/d ratio control", "Sheet formability test", "VDA 238-100 compliant"] },
    { title: "Wrap-Around Bend", sub: "Wrap-Around Bend", desc: "Specimen is wrapped around a cylinder of specified diameter. Suitable for thin sheets and coated materials.", items: ["EN ISO 8491 wire products", "Spiral wire bending", "Coating integrity"] },
  ],
  s2h: "Mandrel Diameter Requirements",
  tableHeaders: ["Steel Grade", "Thickness", "d/t Ratio", "Bend Angle", "Standard"],
  tableNote: "* t = specimen thickness, d = mandrel diameter.",
  s3h: "Fracture Metallurgy and Rejection Criteria",
  s3p: "The outer face of the bend specimen is under tensile stress, the inner face under compression. Maximum strain at the outer radius:",
  s3c: "// Maximum outer surface strain",
  s3ex: "Example: t = 5 mm, d = 10 mm → ε_max = 5/15 = 0.333 (33.3%)",
  rejectItems: [
    { title: "Lamination and Banding", text: "Biaxial segregation bands in rolled product manifest as delamination during bending. MnS banding is monitored in materials requiring through-thickness ductility (Z35 grade)." },
    { title: "Weld Bend Test Rejection", text: "Per ASME IX QW-163, any crack exceeding 3.2 mm constitutes a rejection criterion. HAZ cracks should raise suspicion of martensite formation in CGHAZ and hydrogen embrittlement." },
  ],
  footerPrev: "← Hardness Testing", footerPrevHref: "/mechanical-tests/sertlik-olcumu",
  footerNext: "DWTT →", footerNextHref: "/mechanical-tests/dwtt",
};

const mandrelTable = [
  { grade: "S235 / St37", t: "≤ 16 mm", ratio: "d = 1.0t", angle: "180°", standard: "EN 10025" },
  { grade: "S355J2", t: "≤ 16 mm", ratio: "d = 1.5t", angle: "180°", standard: "EN 10025" },
  { grade: "S420 / S460", t: "≤ 16 mm", ratio: "d = 2.0t", angle: "180°", standard: "EN 10025-4" },
  { grade: "S600MC / S700MC", t: "≤ 8 mm", ratio: "d = 3.0t", angle: "90°", standard: "EN 10149-2" },
  { grade: "API 5L X65 PSL2", t: "WT", ratio: "d = 3.0t", angle: "180°", standard: "API 5L Sec. 9" },
  { grade: "DP600", t: "≤ 2 mm", ratio: "d = 1.0t", angle: "180°", standard: "VDA 238-100" },
  { grade: "Weld (WPS)", t: "2t", ratio: "d = 2t specific", angle: "180°", standard: "ASME IX QW-160" },
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


export default function BendTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#34d399", textDecoration: "none" }}>{t.breadcrumb}</Link>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
            {t.configs.map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "2px", fontSize: "15px" }}>{card.title}</h3>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: s.muted, marginBottom: "10px" }}>{card.sub}</p>
                <p style={{ color: s.sub, fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>{card.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ color: s.muted, fontSize: "12px", fontFamily: "monospace", marginBottom: "4px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#34d399" }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${s.border}` }}>
            <table style={s.table}>
              <thead><tr>{t.tableHeaders.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {mandrelTable.map((row, i) => (
                  <tr key={i} style={s.tableRow(i)}>
                    <td style={s.tdGreen}>{row.grade}</td>
                    <td style={s.td}>{row.t}</td>
                    <td style={{ ...s.td, fontWeight: "700" }}>{row.ratio}</td>
                    <td style={s.td}>{row.angle}</td>
                    <td style={s.tdGray}>{row.standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace", marginTop: "12px" }}>{t.tableNote}</p>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>{t.s3p}</p>
          <div style={{ backgroundColor: s.bg2, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: s.muted, marginBottom: "8px" }}>{t.s3c}</p>
            <p style={{ color: "#6ee7b7" }}>ε_max = t / (t + d)</p>
            <p style={{ color: s.muted, marginTop: "12px", fontSize: "12px" }}>{t.s3ex}</p>
          </div>
          {t.rejectItems.map((item) => (
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
