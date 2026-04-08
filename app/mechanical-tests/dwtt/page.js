'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "DWTT",
  badge: "API 5L Annex G · ASTM E436", counter: "05 / 06",
  h1: "DWTT Testi",
  lead: "Drop Weight Tear Test, büyük çaplı boru hatlarında uzun mesafeli kırılma yayılımını (running fracture) önlemeye yönelik tokluğun belirlenmesinde kullanılan birincil kırılma mekanik testidir.",
  s1h: "Neden DWTT? Charpy ile Fark",
  s1p: "Charpy CVN testi küçük numune geometrisi (10×10×55 mm) nedeniyle yüksek mukavemetli boru çeliklerinin (X65, X70, X80) gerçek kırılma yayılım davranışını temsil etmekte yetersiz kalır. DWTT tam et kalınlığında, büyük format numune kullanır.",
  comparison: [
    { label: "CHARPY CVN", items: ["10×10×55 mm numune", "V-çentik, 2 mm derinlik", "Sonuç: Joule enerji", "Subsize gerektirebilir"] },
    { label: "DWTT", items: ["305×76 mm, tam et kalınlığı", "Pressed notch veya EB notch", "Sonuç: % kesme yüzeyi (SA)", "Full-scale simülasyon"] },
  ],
  s2h: "%85 Kesme Yüzeyi Kriteri",
  s2p: "API 5L Annex G, DWTT için tasarım sıcaklığında %85 minimum kesme yüzeyi (% shear area) kriterini zorunlu kılar. Bu kriter Battelle Columbus Laboratories deneylerine dayanır: %85 SA eşiğinin altında kırılma yayılımı sürdürülebilir hale gelir.",
  s2c: "// SA hesabı",
  s2note: "A_total: Net kesit alanı = (W − 2×w_notch) × t",
  s3h: "Çentik Geometrisi",
  notches: [
    { title: "Pressed Notch (PN)", desc: "Zımba ile oluşturulan küt çentik. Standart API 5L DWTT yöntemi. Çentik önünde kısa plastik deformasyon bölgesi oluşur. PN sonuçları EB'ye göre daha tutucu olabilir.", use: "API 5L PSL1 ve PSL2" },
    { title: "Electron Beam (EB) Notch", desc: "Elektron demeti ile oluşturulan keskin çentik. Çentik ucu yarıçapı ≈ 0.01 mm. Pressed notch ile karşılaştırıldığında daha düşük %SA verebilir.", use: "Araştırma, X80/X100" },
  ],
  notchUseLabel: "Kullanım: ",
  s4h: "DWTT Reddi – Metalürjik Kök Neden",
  rootCauses: [
    { title: "İri Kolonyal Tane – Segregasyon Etkisi", text: "Sürekli döküm slab merkez segregasyonu (C, Mn, P, S zenginleşmesi) hadde sonrasında bantlaşmış martenzit/bainit adacıkları oluşturur. Bu adacıklar DWTT numunesinde yarılma çekirdeklenmesi noktaları olarak işlev görür." },
    { title: "Yetersiz TMCP – Ar3 Altı Haddeleme", text: "Bitiş hadde sıcaklığının Ar3 altına düşmesi deformasyon bandlaşmış ferrit oluşturur. X65/X70 üretiminde FRT penceresi tipik olarak 780–850°C aralığında tutulur." },
    { title: "Hızlı Soğutma – Sert Faz", text: "ACC soğutma hızı kontrolsüz arttığında bainit/martenzit oranı yükselir. Ferrit–sert faz ara yüzeylerinde gerilim konsantrasyonu yaratır ve düşük test sıcaklıklarında erken yarılma tetikler." },
  ],
  s5h: "API 5L PSL2 DWTT Gereksinimleri",
  tableHeaders: ["Sınıf", "Kalınlık (mm)", "Test Sıcaklığı", "Min. %SA", "Not"],
  footerPrev: "← Katlama / Eğme", footerPrevHref: "/mechanical-tests/katlama-egme-testi",
  footerNext: "Basma Testi →", footerNextHref: "/mechanical-tests/basma-testi",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "DWTT",
  badge: "API 5L Annex G · ASTM E436", counter: "05 / 06",
  h1: "DWTT Test",
  lead: "The Drop Weight Tear Test is the primary fracture mechanics test used to determine the toughness required to prevent long-range fracture propagation (running fracture) in large-diameter pipelines.",
  s1h: "Why DWTT? Difference from Charpy",
  s1p: "The Charpy CVN test is inadequate for representing the actual fracture propagation behavior of high-strength pipeline steels (X65, X70, X80) due to its small specimen geometry (10×10×55 mm). DWTT uses a full wall thickness, large-format specimen.",
  comparison: [
    { label: "CHARPY CVN", items: ["10×10×55 mm specimen", "V-notch, 2 mm depth", "Result: Joule energy", "May require subsize"] },
    { label: "DWTT", items: ["305×76 mm, full wall thickness", "Pressed notch or EB notch", "Result: % shear area (SA)", "Full-scale simulation"] },
  ],
  s2h: "85% Shear Area Criterion",
  s2p: "API 5L Annex G mandates a minimum 85% shear area (% SA) at design temperature for DWTT. This criterion is based on Battelle Columbus Laboratories experiments: below the 85% SA threshold, fracture propagation becomes self-sustaining.",
  s2c: "// SA calculation",
  s2note: "A_total: Net cross-sectional area = (W − 2×w_notch) × t",
  s3h: "Notch Geometry",
  notches: [
    { title: "Pressed Notch (PN)", desc: "Blunt notch formed by punch. Standard API 5L DWTT method. Creates a short plastic deformation zone ahead of notch. PN results may be more conservative than EB.", use: "API 5L PSL1 and PSL2" },
    { title: "Electron Beam (EB) Notch", desc: "Sharp notch formed by electron beam. Notch tip radius ≈ 0.01 mm. May produce lower %SA compared to pressed notch.", use: "Research, X80/X100" },
  ],
  notchUseLabel: "Application: ",
  s4h: "DWTT Rejection – Metallurgical Root Cause",
  rootCauses: [
    { title: "Coarse Columnar Grain – Segregation Effect", text: "Continuous cast slab centerline segregation (C, Mn, P, S enrichment) produces banded martensite/bainite islands after rolling. These islands act as cleavage nucleation sites in the DWTT specimen." },
    { title: "Inadequate TMCP – Sub-Ar3 Rolling", text: "Finish rolling temperature dropping below Ar3 creates deformation-banded ferrite. For X65/X70 production, the FRT window is typically maintained at 780–850°C." },
    { title: "Rapid Cooling – Hard Phase", text: "Uncontrolled increase in ACC cooling rate raises the bainite/martensite fraction. Creates stress concentration at ferrite–hard phase interfaces, triggering early cleavage at low test temperatures." },
  ],
  s5h: "API 5L PSL2 DWTT Requirements",
  tableHeaders: ["Grade", "Thickness (mm)", "Test Temperature", "Min. %SA", "Note"],
  footerPrev: "← Bend Test", footerPrevHref: "/mechanical-tests/katlama-egme-testi",
  footerNext: "Compression Test →", footerNextHref: "/mechanical-tests/basma-testi",
};

const dwttTable = [
  { g: "X52 PSL2", t: "≥ 6.0", temp: "Design temp.", sa: "≥ 85%", n: "Charpy may be sufficient" },
  { g: "X60 PSL2", t: "≥ 6.0", temp: "Design temp.", sa: "≥ 85%", n: "DWTT mandatory" },
  { g: "X65 PSL2", t: "≥ 6.0", temp: "Design temp.", sa: "≥ 85%", n: "DWTT mandatory" },
  { g: "X70 PSL2", t: "≥ 6.0", temp: "Design temp.", sa: "≥ 85%", n: "DWTT mandatory" },
  { g: "X80 PSL2", t: "≥ 6.0", temp: "Design temp.", sa: "≥ 85%", n: "EB or PN" },
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


export default function DWTTPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#f87171", textDecoration: "none" }}>{t.breadcrumb}</Link>
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
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>{t.s1p}</p>
          <div style={{ backgroundColor: s.bg2, border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "24px" }}>
            {t.comparison.map((col) => (
              <div key={col.label}>
                <p style={{ color: "#f87171", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", marginBottom: "12px" }}>{col.label}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.items.map((item) => (
                    <li key={item} style={{ color: s.sub, fontSize: "13px", marginBottom: "6px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#f87171" }}>·</span>{item}
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
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>{t.s2p}</p>
          <div style={{ backgroundColor: s.bg2, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: s.muted, marginBottom: "8px" }}>{t.s2c}</p>
            <p style={{ color: "#fca5a5" }}>% SA = [(A_total − A_cleavage) / A_total] × 100</p>
            <p style={{ color: s.muted, marginTop: "12px", fontSize: "12px" }}>{t.s2note}</p>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {t.notches.map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "12px", fontSize: "15px" }}>{card.title}</h3>
                <p style={{ color: s.sub, fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>{card.desc}</p>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#f87171" }}>{t.notchUseLabel}{card.use}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s4h}</h2>
          <div style={s.divider} />
          {t.rootCauses.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: s.sub, fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s5h}</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${s.border}` }}>
            <table style={s.table}>
              <thead><tr>{t.tableHeaders.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {dwttTable.map((row, i) => (
                  <tr key={i} style={s.tableRow(i)}>
                    <td style={s.tdRed}>{row.g}</td>
                    <td style={s.td}>{row.t}</td>
                    <td style={s.td}>{row.temp}</td>
                    <td style={{ ...s.td, fontWeight: "700", color: s.title }}>{row.sa}</td>
                    <td style={s.tdGray}>{row.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer style={s.footer}>
          <Link href={t.footerPrevHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerPrev}</Link>
          <Link href={t.footerNextHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerNext}</Link>
        </footer>
      </article>
    </main>
  );
}
