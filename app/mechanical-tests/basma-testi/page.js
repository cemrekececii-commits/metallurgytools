'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Basma Testi",
  badge: "ASTM E9 · EN ISO 604", counter: "06 / 06",
  h1: "Basma Testi",
  lead: "Basma testi, malzemenin basma yükü altındaki plastik akma davranışını ve akış gerilmesini belirler. Hadde yükü hesabı ve şekillendirme simülasyonu için temel girdi verilerini sağlar.",
  s1h: "Akış Gerilmesi ve Pekleşme",
  s1p: "Basma testinde numune silindirik olup boyuna yüklenir. En kritik çıktı akış gerilmesi eğrisi: σ_f = f(ε, ε̇, T). Zener-Hollomon parametresi Z = ε̇ · exp(Q/RT) ile farklı kombinasyonlar normalize edilir.",
  s1c1: "// Basma gerçek gerilme",
  s1c2: "// Gerçek gerinim (basma)",
  s1c3: "// Zener-Hollomon parametresi",
  s2h: "Fıçılaşma (Barreling) ve Sürtünme Düzeltmesi",
  s2p1: "Gerçek basma testinde plaka–numune temas yüzeyindeki sürtünme radyal akışı engeller, fıçılaşmaya neden olur. Sürtünme düzeltmesi yapılmadan elde edilen σ_f değerleri sistematik olarak yüksek hatalıdır.",
  s2c: "// Rastegaev sürtünme düzeltmesi",
  s2note: "μ: sürtünme katsayısı (yağlama 0.02–0.05, kuru 0.1–0.3)\nR: anlık numune yarıçapı, h: anlık yükseklik",
  s2p2: "Sürtünme etkisini azaltmak için: grafit + yağ karışımı, teflon disk, veya Rastegaev yöntemi (numune uç yüzeyine sığ konsantrik oluk) uygulanır. Gleeble sistemlerinde tantalum folyo standarttır.",
  s3h: "Numune Geometrisi – h/d Oranı",
  hdRatios: [
    { ratio: "h/d = 1.0", use: "Fıçılaşma çalışmaları", notes: ["Sürtünme etkisi belirgin", "Geniş ε aralığı", "Yüksek deformasyon kapasitesi"] },
    { ratio: "h/d = 1.5", use: "Standart basma testi", notes: ["ASTM E9 önerisi", "Denge: sürtünme vs burkulma", "Çoğu araştırma uygulaması"] },
    { ratio: "h/d ≥ 3.0", use: "Burkulma kritik", notes: ["Uzun ince numune", "Elastik burkulma riski", "Sadece çok düşük ε"] },
  ],
  s4h: "Hadde Simülasyonu ve Sıcak Basma Testleri",
  gleebleItems: [
    { title: "Gleeble Termal-Mekanik Simülatörü", text: "Gleeble, direnç ısıtması ile sıcaklık kontrolü sağlarken eş zamanlı mekanik yükleme yapabilir. Sıcak basma deneyleri; γ ve α bölgelerinde akış gerilmesi, yeniden kristalleşme kinetikleri (MFS – mean flow stress) ve CCT eğrisi oluşturma için kullanılır." },
    { title: "Akış Gerilmesi Eğrisi – Hadde Yükü Hesabı", text: "Sıcak hadde pass yükü: F = σ_f × A_contact × Q_p (baskı faktörü). Nb, V, Ti mikroalaşımlı çeliklerde T_nr sıcaklığının üzerinde her passta dinamik yeniden kristalleşme gerçekleşir; altında gerinim birikmesi başlar." },
    { title: "Soğuk Basma – FEM Girdi Verisi", text: "DP ve TRIP çeliklerinin şekillendirme simülasyonunda deformasyon kuvveti verisi basma testinden elde edilir. σ_f eğrisi Voce veya Swift modelleriyle fit edilir ve sonlu elemanlar analizine aktarılır." },
  ],
  warningTitle: "⚠ Basma Testinin Sınırlamaları",
  warningItems: [
    "Büyük deformasyonlarda fıçılaşma homojen deformasyonu bozar, σ_f gerçek değildir.",
    "Çekme testine kıyasla kırılma/tokluğun doğrudan ölçülmesi mümkün değildir.",
    "Bauchinger etkisi: çekme sonrası basma yüklemesinde akma gerilmesi düşer (kinematik pekleşme).",
    "Yüksek sıcaklık testinde oksidasyonu önlemek için koruyucu atmosfer (Ar, He) gerekebilir.",
  ],
  footerPrev: "← DWTT", footerPrevHref: "/mechanical-tests/dwtt",
  footerNext: "↑ Tüm Testler", footerNextHref: "/mechanical-tests",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Compression Test",
  badge: "ASTM E9 · EN ISO 604", counter: "06 / 06",
  h1: "Compression Test",
  lead: "The compression test determines the plastic flow behavior and flow stress of materials under compressive loading. It provides fundamental input data for rolling load calculations and forming simulations.",
  s1h: "Flow Stress and Strain Hardening",
  s1p: "In the compression test, the specimen is cylindrical and loaded axially. The most critical output is the flow stress curve: σ_f = f(ε, ε̇, T). The Zener-Hollomon parameter Z = ε̇ · exp(Q/RT) normalizes different strain rate and temperature combinations.",
  s1c1: "// True compressive stress",
  s1c2: "// True strain (compression)",
  s1c3: "// Zener-Hollomon parameter",
  s2h: "Barreling and Friction Correction",
  s2p1: "In real compression testing, friction at the platen–specimen interface restricts radial flow, causing barreling. σ_f values obtained without friction correction are systematically overestimated.",
  s2c: "// Rastegaev friction correction",
  s2note: "μ: friction coefficient (lubricated 0.02–0.05, dry 0.1–0.3)\nR: instantaneous specimen radius, h: instantaneous height",
  s2p2: "To reduce friction effects: graphite + oil mixture, Teflon disk, or Rastegaev method (shallow concentric groove on specimen end faces) are applied. Tantalum foil is standard in Gleeble systems.",
  s3h: "Specimen Geometry – h/d Ratio",
  hdRatios: [
    { ratio: "h/d = 1.0", use: "Barreling studies", notes: ["Pronounced friction effect", "Wide ε range", "High deformation capacity"] },
    { ratio: "h/d = 1.5", use: "Standard compression test", notes: ["ASTM E9 recommendation", "Balance: friction vs. buckling", "Most research applications"] },
    { ratio: "h/d ≥ 3.0", use: "Buckling critical", notes: ["Long slender specimen", "Elastic buckling risk", "Only very low ε"] },
  ],
  s4h: "Rolling Simulation and Hot Compression Tests",
  gleebleItems: [
    { title: "Gleeble Thermo-Mechanical Simulator", text: "Gleeble provides temperature control through resistance heating while simultaneously applying mechanical loading. Hot compression tests are used for flow stress in γ and α regions, recrystallization kinetics (MFS – mean flow stress), and CCT curve generation." },
    { title: "Flow Stress Curve – Rolling Load Calculation", text: "Hot rolling pass load: F = σ_f × A_contact × Q_p (pressure factor). In Nb, V, Ti microalloyed steels, dynamic recrystallization occurs in each pass above T_nr; below that, strain accumulation begins." },
    { title: "Cold Compression – FEM Input Data", text: "Deformation force data from compression testing is used in forming simulations of DP and TRIP steels. The σ_f curve is fitted with Voce or Swift models and transferred to finite element analysis." },
  ],
  warningTitle: "⚠ Limitations of Compression Testing",
  warningItems: [
    "At large deformations, barreling disrupts homogeneous deformation; σ_f is not truly uniform.",
    "Direct measurement of fracture/toughness is not possible, unlike tensile testing.",
    "Bauschinger effect: yield stress decreases under compression loading after tensile pre-straining (kinematic hardening).",
    "Protective atmosphere (Ar, He) may be required to prevent oxidation in high-temperature testing.",
  ],
  footerPrev: "← DWTT", footerPrevHref: "/mechanical-tests/dwtt",
  footerNext: "↑ All Tests", footerNextHref: "/mechanical-tests",
};


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


export default function CompressionTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#c084fc", textDecoration: "none" }}>{t.breadcrumb}</Link>
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
          <div style={{ backgroundColor: s.bg2, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px" }}>
            <p style={{ color: s.muted, marginBottom: "8px" }}>{t.s1c1}</p>
            <p style={{ color: "#d8b4fe" }}>sigma_true = F / A_true = F·h / (A₀·h₀)</p>
            <p style={{ color: s.muted, marginTop: "14px", marginBottom: "8px" }}>{t.s1c2}</p>
            <p style={{ color: "#d8b4fe" }}>epsilon_true = ln(h₀ / h)</p>
            <p style={{ color: s.muted, marginTop: "14px", marginBottom: "8px" }}>{t.s1c3}</p>
            <p style={{ color: "#d8b4fe" }}>Z = ε̇ · exp(Q / RT)</p>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>{t.s2p1}</p>
          <div style={{ backgroundColor: s.bg2, border: `1px solid ${s.border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: s.muted, marginBottom: "8px" }}>{t.s2c}</p>
            <p style={{ color: "#d8b4fe" }}>sigma_f = sigma_measured / (1 + 2μR/3h)</p>
            <p style={{ color: s.muted, marginTop: "12px", fontSize: "12px" }}>{t.s2note}</p>
          </div>
          <p style={{ color: s.body, fontSize: "15px", lineHeight: "1.7" }}>{t.s2p2}</p>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
            {t.hdRatios.map((card) => (
              <div key={card.ratio} style={s.card}>
                <p style={{ fontFamily: "monospace", color: "#c084fc", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>{card.ratio}</p>
                <p style={{ color: s.body, fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>{card.use}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.notes.map((n) => (
                    <li key={n} style={{ color: s.muted, fontSize: "12px", marginBottom: "4px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#a855f7" }}>·</span>{n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s4h}</h2>
          <div style={s.divider} />
          {t.gleebleItems.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: s.sub, fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: "56px" }}>
          <div style={{ backgroundColor: "rgba(88,28,135,0.2)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontWeight: "700", color: s.title, marginBottom: "12px" }}>{t.warningTitle}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {t.warningItems.map((item) => (
                <li key={item} style={{ color: s.body, fontSize: "13px", marginBottom: "8px", display: "flex", gap: "8px", lineHeight: "1.5" }}>
                  <span style={{ color: "#c084fc", marginTop: "2px" }}>·</span>{item}
                </li>
              ))}
            </ul>
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
