'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Çekme Testi",
  badge: "ASTM E8/E8M · EN ISO 6892-1", counter: "01 / 06", h1: "Çekme Testi",
  lead: "Mühendislik malzemelerinin statik yük altında doğrusal elastik ve plastik deformasyon davranışını belirleyen temel karakterizasyon yöntemi.",
  s1h: "Temel Mekanik Parametreler", s2h: "Gerilme–Uzama Eğrisi ve Metalürjik Yorum",
  s2p1: "Mühendislik gerilme–uzama eğrisi σ = F/A₀ ve ε = ΔL/L₀ tanımları üzerine kurulur. Gerçek gerilme–uzama eğrisi ise σ_true = σ_eng(1 + ε_eng) dönüşümüyle elde edilir. Hollomon pekleşme denklemi ve Considère kriteri:",
  s2c1: "// Hollomon pekleşme denklemi", s2c2: "// Necking başlangıç kriteri (Considère)",
  s2p2: "Düşük karbonlu çeliklerde belirgin üst ve alt akma gerilmesi gözlemlenir. Bu olgu, çözünmüş C ve N atomlarının dislokasyon çizgilerini kilitlemesi (Cottrell atmosferi) ile açıklanır. Serbest kalan dislokasyonlar Lüders bandları olarak ilerler.",
  s2p3: "DP600 çeliklerinde ferrit–martenzit oranına bağlı olarak akma gerilmesi düşük (330–400 MPa), pekleşme üssü yüksek (n ≈ 0.16–0.20) seyreder; bu kombinasyon çekme şekillendirmede erken boyun atmayı geciktirir.",
  s3h: "Çelik Sınıfı Mekanik Özellik Referansı", tableHeaders: ["Sınıf", "ReH / Rp0.2 (MPa)", "Rm (MPa)", "A5 (%)", "Not"],
  s4h: "Sonuç Yorumlama ve Yaygın Hatalar",
  items: [
    { title: "Rp0.2 Reddi – Metalürjik Kök Neden", text: "S600MC gibi Nb-Ti çeliklerinde Rp0.2 düşüklüğü çoğunlukla bitiş hadde sıcaklığının Tnr üzerine çıkmasıyla ilişkilidir. Nb(C,N) çökelme kinetiklerinin yetersiz kalması dislokasyon yoğunluğunu azaltır. Hızlı soğutma hızı yetersizliği (< 15°C/s) ferrit tane irileşmesine yol açar." },
    { title: "Uzama Reddi – Lokalize Plastiklik", text: "A% düşüklüğü tek başına değil Z% ile birlikte yorumlanmalıdır. Z% normalken A% düşükse ölçüm uzunluğu seçimi araştırılmalıdır. Z% da düşükse inklüzyon bandlaşması veya segregasyon kaynaklı lokal gevreklik düşünülmelidir." },
    { title: "Rm/Re Oranı – Pipeline Güvenlik Kriteri", text: "API 5L PSL2 X65/X70 için Rm/Re ≤ 0.93 kriterleri mevcuttur. Rm/Re oranı < 1.15 ise malzeme plastik reserve kapasitesi sınırlıdır. Bu durum TMCP çeliklerinde aşırı Nb çökelti sertleşmesini işaret edebilir." },
  ],
  videoTitle: "Eğitim Videosu", videoDesc: "Çekme testi prosedürü, numune hazırlama, cihaz kurulumu ve sonuç yorumlama.",
  footerPrev: "← Tüm Testler", footerPrevHref: "/mechanical-tests",
  footerNext: "Darbe Testi →", footerNextHref: "/mechanical-tests/darbe-testi",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Tensile Test",
  badge: "ASTM E8/E8M · EN ISO 6892-1", counter: "01 / 06", h1: "Tensile Test",
  lead: "The fundamental characterization method for determining the linear elastic and plastic deformation behavior of engineering materials under static loading.",
  s1h: "Key Mechanical Parameters", s2h: "Stress–Strain Curve and Metallurgical Interpretation",
  s2p1: "The engineering stress–strain curve is based on σ = F/A₀ and ε = ΔL/L₀. True stress–strain is obtained via σ_true = σ_eng(1 + ε_eng). The Hollomon strain hardening equation and Considère necking criterion:",
  s2c1: "// Hollomon strain hardening equation", s2c2: "// Onset of necking (Considère criterion)",
  s2p2: "Low-carbon steels exhibit a distinct upper and lower yield point. This is attributed to locking of dislocations by interstitial C and N atoms (Cottrell atmosphere). Released dislocations propagate as Lüders bands.",
  s2p3: "In DP600 steels, yield strength is low (330–400 MPa) and strain hardening exponent is high (n ≈ 0.16–0.20) depending on ferrite–martensite ratio; this combination delays necking during stretch forming.",
  s3h: "Steel Grade Mechanical Property Reference", tableHeaders: ["Grade", "ReH / Rp0.2 (MPa)", "Rm (MPa)", "A5 (%)", "Note"],
  s4h: "Result Interpretation and Common Errors",
  items: [
    { title: "Rp0.2 Rejection – Metallurgical Root Cause", text: "Low Rp0.2 in Nb-Ti steels such as S600MC is often linked to the finish rolling temperature exceeding Tnr. Insufficient Nb(C,N) precipitation kinetics reduce dislocation density. Inadequate accelerated cooling rate (< 15°C/s) leads to ferrite grain coarsening." },
    { title: "Elongation Rejection – Localized Plasticity", text: "Low A% should not be interpreted alone—assess together with Z%. If Z% is normal but A% is low, review the gauge length selection. If both are low, consider inclusion banding or segregation-induced local embrittlement." },
    { title: "Rm/Re Ratio – Pipeline Safety Criterion", text: "API 5L PSL2 X65/X70 specifies Rm/Re ≤ 0.93. An Rm/Re ratio < 1.15 indicates limited plastic reserve. This may signal excessive Nb precipitation hardening in TMCP steels." },
  ],
  videoTitle: "Training Video", videoDesc: "Tensile test procedure, specimen preparation, machine setup and result interpretation.",
  footerPrev: "← All Tests", footerPrevHref: "/mechanical-tests",
  footerNext: "Impact Test →", footerNextHref: "/mechanical-tests/darbe-testi",
};

const propertiesTR = [
  { symbol: "Rp0.2 / Re", name: "Akma Dayanımı", unit: "MPa", description: "Kalıcı şekil değişiminin başladığı gerilme. Sürekli akma için 0,2% offset metodu." },
  { symbol: "Rm", name: "Çekme Dayanımı", unit: "MPa", description: "Gerilme–uzama eğrisindeki maksimum mühendislik gerilmesi (UTS)." },
  { symbol: "A%", name: "Kopma Uzaması", unit: "%", description: "Ölçüm uzunluğu (Lo = 5,65√So veya 80 mm) üzerinden kopma uzaması." },
  { symbol: "Z%", name: "Kesit Daralması", unit: "%", description: "Kopma noktasındaki kesit alanı azalma oranı. Tokluğun yerel göstergesi." },
  { symbol: "n", name: "Pekleşme Üssü", unit: "–", description: "σ = C·εⁿ (Hollomon). Sac şekillendirmede derin çekme kapasitesini belirler." },
  { symbol: "r (Lankford)", name: "Anizotropi Katsayısı", unit: "–", description: "r = εw/εt. IF çeliklerinde r̄ > 1.5 derin çekme kalitesini gösterir." },
];
const propertiesEN = [
  { symbol: "Rp0.2 / Re", name: "Yield Strength", unit: "MPa", description: "Stress at onset of permanent deformation. 0.2% offset method for continuous yielding." },
  { symbol: "Rm", name: "Tensile Strength", unit: "MPa", description: "Maximum engineering stress on the stress–strain curve (UTS)." },
  { symbol: "A%", name: "Elongation at Fracture", unit: "%", description: "Elongation over gauge length (Lo = 5.65√So or 80 mm)." },
  { symbol: "Z%", name: "Reduction of Area", unit: "%", description: "Cross-sectional area reduction ratio at fracture. Local indicator of toughness." },
  { symbol: "n", name: "Strain Hardening Exponent", unit: "–", description: "σ = C·εⁿ (Hollomon). Determines deep drawing capacity in sheet forming." },
  { symbol: "r (Lankford)", name: "Anisotropy Coefficient", unit: "–", description: "r = εw/εt. r̄ > 1.5 in IF steels indicates deep drawing quality." },
];

const steelGradesTR = [
  { grade: "S235 / St37", ys: "≥ 235", uts: "360–510", elong: "≥ 26", note: "Yapısal, düşük C" },
  { grade: "S355J2", ys: "≥ 355", uts: "470–630", elong: "≥ 22", note: "Mikroalaşımlı, Mn-Si" },
  { grade: "S600MC", ys: "≥ 600", uts: "650–820", elong: "≥ 16", note: "Nb-Ti-V termomekanik" },
  { grade: "S700MC", ys: "≥ 700", uts: "750–950", elong: "≥ 12", note: "TMCP, düşük C" },
  { grade: "API 5L X65", ys: "448–600", uts: "530–760", elong: "≥ 21", note: "Boru hattı, PSL2" },
  { grade: "DP600", ys: "330–400", uts: "600–700", elong: "≥ 20", note: "Ferrit+Martenzit, n≈0.18" },
  { grade: "IF (DDQ)", ys: "140–180", uts: "270–330", elong: "≥ 42", note: "Ti/Nb, r̄ > 1.8" },
];
const steelGradesEN = [
  { grade: "S235 / St37", ys: "≥ 235", uts: "360–510", elong: "≥ 26", note: "Structural, low C" },
  { grade: "S355J2", ys: "≥ 355", uts: "470–630", elong: "≥ 22", note: "Microalloyed, Mn-Si" },
  { grade: "S600MC", ys: "≥ 600", uts: "650–820", elong: "≥ 16", note: "Nb-Ti-V thermomechanical" },
  { grade: "S700MC", ys: "≥ 700", uts: "750–950", elong: "≥ 12", note: "TMCP, low C" },
  { grade: "API 5L X65", ys: "448–600", uts: "530–760", elong: "≥ 21", note: "Pipeline, PSL2" },
  { grade: "DP600", ys: "330–400", uts: "600–700", elong: "≥ 20", note: "Ferrite+Martensite, n≈0.18" },
  { grade: "IF (DDQ)", ys: "140–180", uts: "270–330", elong: "≥ 42", note: "Ti/Nb, r̄ > 1.8" },
];

function makeS(isDark) {
  const bg     = isDark ? "#030712" : "#f8fafc";
  const bg2    = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#1f2937" : "#e5e7eb";
  const text   = isDark ? "#f3f4f6" : "#111827";
  const sub    = isDark ? "#9ca3af" : "#6b7280";
  const body   = isDark ? "#d1d5db" : "#374151";
  const muted  = isDark ? "#6b7280" : "#9ca3af";
  const title  = isDark ? "#fff"    : "#0f172a";
  return {
    page: { minHeight: "100vh", backgroundColor: bg, color: text, transition: "background .2s" },
    breadcrumb: { borderBottom: `1px solid ${border}`, padding: "12px 24px", backgroundColor: bg },
    breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: muted },
    article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
    badge: { fontSize: "11px", fontFamily: "monospace", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)", backgroundColor: "rgba(96,165,250,0.05)", padding: "2px 8px", borderRadius: "4px" },
    h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: title, marginBottom: "16px" },
    lead: { color: sub, fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
    h2: { fontSize: "22px", fontWeight: "700", color: title, marginBottom: "8px" },
    divider: { width: "48px", height: "2px", backgroundColor: "#3b82f6", marginBottom: "24px" },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" },
    card: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "20px" },
    mono: { fontFamily: "monospace" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 16px", color: sub, fontFamily: "monospace", fontSize: "11px", borderBottom: `1px solid ${border}`, backgroundColor: bg2 },
    tdBlue: { padding: "12px 16px", fontFamily: "monospace", color: "#60a5fa", fontSize: "12px", fontWeight: "700" },
    td: { padding: "12px 16px", color: body, fontSize: "12px" },
    tdGray: { padding: "12px 16px", color: muted, fontSize: "12px" },
    leftBorder: { backgroundColor: bg2, borderLeft: "2px solid #3b82f6", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: `1px solid ${border}`, marginTop: "32px" },
    codeBlock: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" },
    codeComment: { color: muted },
    codeText: { color: "#93c5fd" },
    bodyText: { color: body, fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" },
    videoBox: { borderRadius: "14px", overflow: "hidden", border: `1px solid ${border}`, backgroundColor: bg2 },
    tableRow: (i) => ({ backgroundColor: i % 2 === 0 ? bg : bg2 }),
    unitBadge: { fontSize: "10px", fontFamily: "monospace", color: muted, border: `1px solid ${border}`, padding: "1px 6px", borderRadius: "3px" },
    cardName: { color: body, fontWeight: "600", fontSize: "13px", marginBottom: "4px" },
    cardDesc: { color: muted, fontSize: "13px", lineHeight: "1.5" },
    itemTitle: { fontWeight: "700", color: title, marginBottom: "8px", fontSize: "15px" },
    itemText: { color: sub, fontSize: "14px", lineHeight: "1.6" },
    footerLink: { fontSize: "13px", fontFamily: "monospace", color: muted, textDecoration: "none" },
    counterColor: muted,
  };
}

export default function TensileTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;
  const properties = lang === 'tr' ? propertiesTR : propertiesEN;
  const steelGrades = lang === 'tr' ? steelGradesTR : steelGradesEN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#60a5fa", textDecoration: "none" }}>{t.breadcrumb}</Link>
          <span>/</span>
          <span>{t.breadcrumbSub}</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>{t.badge}</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: s.counterColor }}>{t.counter}</span>
          </div>
          <h1 style={s.h1}>{t.h1}</h1>
          <p style={s.lead}>{t.lead}</p>
        </header>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.videoTitle}</h2>
          <div style={s.divider} />
          <p style={{ ...s.bodyText, marginBottom: "20px" }}>{t.videoDesc}</p>
          <div style={s.videoBox}>
            <video controls preload="metadata" style={{ width: "100%", display: "block", maxHeight: "520px", backgroundColor: "#000" }}>
              <source src="/cekme-testi.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s1h}</h2>
          <div style={s.divider} />
          <div style={s.grid2}>
            {properties.map((p) => (
              <div key={p.symbol} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "monospace", color: "#60a5fa", fontSize: "16px", fontWeight: "700" }}>{p.symbol}</span>
                  <span style={s.unitBadge}>{p.unit}</span>
                </div>
                <p style={s.cardName}>{p.name}</p>
                <p style={s.cardDesc}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <p style={s.bodyText}>{t.s2p1}</p>
          <div style={s.codeBlock}>
            <p style={s.codeComment}>{t.s2c1}</p>
            <p style={s.codeText}>σ_true = C · ε_true^n</p>
            <p style={{ ...s.codeComment, marginTop: "16px" }}>{t.s2c2}</p>
            <p style={s.codeText}>dσ_true/dε_true = σ_true → ε_uniform = n</p>
          </div>
          <p style={s.bodyText}>{t.s2p2}</p>
          <p style={s.bodyText}>{t.s2p3}</p>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}` }}>
            <table style={s.table}>
              <thead><tr>{t.tableHeaders.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {steelGrades.map((row, i) => (
                  <tr key={row.grade} style={s.tableRow(i)}>
                    <td style={s.tdBlue}>{row.grade}</td>
                    <td style={s.td}>{row.ys}</td>
                    <td style={s.td}>{row.uts}</td>
                    <td style={s.td}>{row.elong}</td>
                    <td style={s.tdGray}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s4h}</h2>
          <div style={s.divider} />
          {t.items.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={s.itemTitle}>{item.title}</h3>
              <p style={s.itemText}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href={t.footerPrevHref} style={s.footerLink}>{t.footerPrev}</Link>
          <Link href={t.footerNextHref} style={s.footerLink}>{t.footerNext}</Link>
        </footer>
      </article>
    </main>
  );
}
