'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Darbe Testi",
  badge: "ISO 148-1 · ASTM E23", counter: "02 / 06",
  h1: "Darbe Testi",
  lead: "Charpy V-çentik (CVN) testi, BCC kafesli çeliklerin kırılma geçiş davranışını karakterize eden temel yöntemdir. DBTT ve üst plato enerjisi (USE) belirlenir.",
  s1h: "Kırılma Geçiş Davranışı",
  s1p: "BCC kafesli demir ve çeliklerde dislokasyon hareketi düşük sıcaklıkta kovalent bağ karakterine yaklaşır. FCC kafesli malzemelerde bu geçiş gözlemlenmez. Enerji–sıcaklık eğrisinde üç bölge tanımlanır: üst plato (USE), geçiş bölgesi ve alt plato.",
  s1c: "// DBTT tahmin korelasyonu (Pickering–Gladman)",
  s1note: "d: ferrit tane çapı (mm), Nf: serbest N (%), Pf: ince perlitik yapı oranı",
  s2h: "DBTT'yi Etkileyen Metalürjik Parametreler",
  factors: [
    { factor: "Tane Boyutu (d)", effect: "d↑ → DBTT↑", mechanism: "Hall-Petch: daha iri tane çatlak çekirdeklenme enerjisini düşürür. d'yi yarıya indirmek DBTT'yi ~15°C düşürür." },
    { factor: "Karbon İçeriği", effect: "C↑ → DBTT↑", mechanism: "Perlitik yapı sementit film oluşumunu artırır; düşük C (< 0.10%) ve yeterli Mn esastır." },
    { factor: "Mn/C Oranı", effect: "Mn↑ → DBTT↓", mechanism: "Mn ostenit alanını genişletir, ferrit ve bainit oluşumunu rafine eder. Mn/C > 5 önerilir." },
    { factor: "Nb, Ti, V", effect: "Çökelti rafine eder → DBTT↓", mechanism: "Tane büyümesini engeller (TiN çözünmez < 1300°C), γ→α dönüşümünde ferrit tanesini rafine eder." },
    { factor: "N Serbest", effect: "N↑ → DBTT↑", mechanism: "Serbest N BCC kafeste interstisyel katı çözelti sertleşmesi yapar; Al ile AlN olarak bağlanması kritiktir." },
    { factor: "İnklüzyon (MnS)", effect: "MnS↑ → DBTT↑", mechanism: "Hadde yönünde uzayan MnS bantları T yönünde anizotropi yaratır ve kırık yolunu kolaylaştırır." },
  ],
  s3h: "Kırık Yüzeyi Analizi",
  fracture: [
    { title: "Lifli (Fibrous / Shear) Kırık", items: ["Mat, koyu, pürüzlü görünüm", "Yüksek plastik deformasyon", "SEM'de dimple (çukurcuk) morfolojisi", "Mikro-boşluk birleşimi (MVC) mekanizması", "Yüksek tokluğu işaret eder"] },
    { title: "Yarılma (Cleavage) Kırık", items: ["{100} düzlemleri boyunca kırılma", "Parlak, granüler, kristalografik görünüm", "SEM'de nehir işaretleri (river marks)", "Düşük tokluğu işaret eder", "Fan motifi çatlak kaynak tanesini gösterir"] },
  ],
  s4h: "Standart Enerji Gereksinimleri",
  tableHeaders: ["Test Sıcaklığı", "Çelik Sınıfı", "Min. Enerji", "Uygulama"],
  s5h: "Test Prosedürü ve Yaygın Hatalar",
  procedureItems: [
    { title: "Numune Sıcaklık Kontrolü", text: "ISO 148-2'ye göre numune transferi 5 saniye içinde tamamlanmalıdır. Transfer süresi uzarsa numune yüzeyi ısınır ve özellikle geçiş bölgesinde sonuç sapması yaşanır. Transferde −7/+0°C toleransı uygulanır." },
    { title: "Çentik Geometrisi Hassasiyeti", text: "V-çentik açısı 45° ± 1°, derinlik 2.00 ± 0.025 mm, taban yarıçapı 0.25 ± 0.025 mm. ISO 148-2 kalibre numuneleri ile düzenli kalibrasyon zorunludur." },
    { title: "Subsize Numune Kullanımı", text: "7,5 × 10 mm subsize numuneler için doğrusal ölçek faktörü kullanılır (× 1,33). Bu dönüşüm tahminidir ve özellikle geçiş bölgesinde yüksek hata içerebilir." },
  ],
  footerPrev: "← Çekme Testi", footerPrevHref: "/mechanical-tests/cekme-testi",
  footerNext: "Sertlik Ölçümü →", footerNextHref: "/mechanical-tests/sertlik-olcumu",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Impact Test",
  badge: "ISO 148-1 · ASTM E23", counter: "02 / 06",
  h1: "Impact Test",
  lead: "The Charpy V-notch (CVN) test is the primary method for characterizing the fracture transition behavior of BCC-lattice steels. DBTT and upper shelf energy (USE) are determined.",
  s1h: "Ductile-to-Brittle Transition Behavior",
  s1p: "In BCC iron and steels, dislocation motion approaches covalent bond character at low temperatures. This transition is not observed in FCC materials. Three regions are identified on the energy–temperature curve: upper shelf (USE), transition zone, and lower shelf.",
  s1c: "// DBTT prediction correlation (Pickering–Gladman)",
  s1note: "d: ferrite grain diameter (mm), Nf: free N (%), Pf: fraction of fine pearlitic structure",
  s2h: "Metallurgical Parameters Affecting DBTT",
  factors: [
    { factor: "Grain Size (d)", effect: "d↑ → DBTT↑", mechanism: "Hall-Petch: coarser grains reduce crack nucleation energy. Halving d reduces DBTT by ~15°C." },
    { factor: "Carbon Content", effect: "C↑ → DBTT↑", mechanism: "Pearlitic structure increases cementite film formation; low C (< 0.10%) and adequate Mn are essential." },
    { factor: "Mn/C Ratio", effect: "Mn↑ → DBTT↓", mechanism: "Mn expands the austenite field, refining ferrite and bainite formation. Mn/C > 5 is recommended." },
    { factor: "Nb, Ti, V", effect: "Precipitate refines → DBTT↓", mechanism: "Inhibits grain growth (TiN insoluble below 1300°C), refines ferrite grain during γ→α transformation." },
    { factor: "Free N", effect: "N↑ → DBTT↑", mechanism: "Free N causes interstitial solid solution hardening in BCC lattice; binding as AlN with Al is critical." },
    { factor: "Inclusion (MnS)", effect: "MnS↑ → DBTT↑", mechanism: "MnS stringers elongated in rolling direction create anisotropy in T-direction and facilitate fracture path." },
  ],
  s3h: "Fracture Surface Analysis",
  fracture: [
    { title: "Fibrous / Shear Fracture", items: ["Dull, dark, rough appearance", "High plastic deformation", "Dimple morphology in SEM", "Microvoid coalescence (MVC) mechanism", "Indicates high toughness"] },
    { title: "Cleavage Fracture", items: ["Fracture along {100} planes", "Bright, granular, crystallographic appearance", "River marks in SEM", "Indicates low toughness", "Fan pattern marks crack source grain"] },
  ],
  s4h: "Standard Energy Requirements",
  tableHeaders: ["Test Temperature", "Steel Grade", "Min. Energy", "Application"],
  s5h: "Test Procedure and Common Errors",
  procedureItems: [
    { title: "Specimen Temperature Control", text: "Per ISO 148-2, specimen transfer must be completed within 5 seconds. Longer transfer times allow surface warming, causing result deviation especially in the transition zone. A −7/+0°C transfer tolerance applies." },
    { title: "Notch Geometry Precision", text: "V-notch angle 45° ± 1°, depth 2.00 ± 0.025 mm, root radius 0.25 ± 0.025 mm. Regular calibration with ISO 148-2 reference specimens is mandatory." },
    { title: "Subsize Specimen Use", text: "A linear scale factor (× 1.33) is used for 7.5 × 10 mm subsize specimens. This conversion is an estimate and may contain significant error, particularly in the transition zone." },
  ],
  footerPrev: "← Tensile Test", footerPrevHref: "/mechanical-tests/cekme-testi",
  footerNext: "Hardness Testing →", footerNextHref: "/mechanical-tests/sertlik-olcumu",
};

const energyLevels = [
  { temp: "+20°C", grade: "S355J2", energy: "≥ 27 J", note: "Structural minimum" },
  { temp: "0°C", grade: "S355J0", energy: "≥ 27 J", note: "" },
  { temp: "−20°C", grade: "S355J2", energy: "≥ 27 J", note: "" },
  { temp: "−40°C", grade: "S355NL", energy: "≥ 40 J", note: "Offshore structures" },
  { temp: "−46°C", grade: "API 5L X65 PSL2", energy: "≥ 27 J", note: "Pipeline" },
  { temp: "−60°C", grade: "S460NL", energy: "≥ 40 J", note: "Arctic applications" },
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
    badge: { fontSize: "11px", fontFamily: "monospace", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", backgroundColor: "rgba(251,146,60,0.05)", padding: "2px 8px", borderRadius: "4px" },
    h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: title, marginBottom: "16px" },
    lead: { color: sub, fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
    h2: { fontSize: "22px", fontWeight: "700", color: title, marginBottom: "8px" },
    divider: { width: "48px", height: "2px", backgroundColor: "#f97316", marginBottom: "24px" },
    card: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "20px" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px 16px", color: sub, fontFamily: "monospace", fontSize: "11px", borderBottom: `1px solid ${border}`, backgroundColor: bg2 },
    tdOrange: { padding: "12px 16px", fontFamily: "monospace", color: "#fb923c", fontSize: "12px", fontWeight: "700" },
    td: { padding: "12px 16px", color: body, fontSize: "12px" },
    tdGray: { padding: "12px 16px", color: muted, fontSize: "12px" },
    leftBorder: { backgroundColor: bg2, borderLeft: "2px solid #f97316", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: `1px solid ${border}`, marginTop: "32px" },
    bodyText: { color: body, fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" },
    codeBlock: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" },
    codeComment: { color: muted, marginBottom: "8px" }, codeNote: { color: muted, marginTop: "12px", fontSize: "12px" },
    tableRow: (i) => ({ backgroundColor: i % 2 === 0 ? bg : bg2 }),
    footerLink: { fontSize: "13px", fontFamily: "monospace", color: muted, textDecoration: "none" },
    counterColor: muted, itemTitle: { fontWeight: "700", color: title, marginBottom: "8px", fontSize: "15px" },
    itemText: { color: sub, fontSize: "14px", lineHeight: "1.6" }, body, sub, border, bg, bg2,
  };
}

export default function ImpactTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const t = lang === 'tr' ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#fb923c", textDecoration: "none" }}>{t.breadcrumb}</Link>
          <span>/</span>
          <span style={{ color: s.body }}>{t.breadcrumbSub}</span>
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
          <h2 style={s.h2}>{t.s1h}</h2>
          <div style={s.divider} />
          <p style={s.bodyText}>{t.s1p}</p>
          <div style={s.codeBlock}>
            <p style={s.codeComment}>{t.s1c}</p>
            <p style={{ color: "#fdba74" }}>DBTT (°C) = −11 + 44(%Si) + 700(√%Nf) + 2.2(%Pf) − 11.5(d^−1/2)</p>
            <p style={s.codeNote}>{t.s1note}</p>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {t.factors.map((item) => (
              <div key={item.factor} style={{ ...s.card, display: "grid", gridTemplateColumns: "160px 140px 1fr", gap: "12px", alignItems: "start" }}>
                <p style={{ fontFamily: "monospace", color: "#fb923c", fontWeight: "700", fontSize: "13px" }}>{item.factor}</p>
                <span style={{ fontSize: "11px", fontFamily: "monospace", backgroundColor: s.border, color: s.body, padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>{item.effect}</span>
                <p style={{ color: s.sub, fontSize: "13px", lineHeight: "1.5" }}>{item.mechanism}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {t.fracture.map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={s.itemTitle}>{card.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ color: s.sub, fontSize: "13px", marginBottom: "6px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#fb923c" }}>·</span>{item}
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
          <div style={{ overflowX: "auto", borderRadius: "12px", border: `1px solid ${s.border}` }}>
            <table style={s.table}>
              <thead><tr>{t.tableHeaders.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {energyLevels.map((row, i) => (
                  <tr key={i} style={s.tableRow(i)}>
                    <td style={s.tdOrange}>{row.temp}</td>
                    <td style={s.td}>{row.grade}</td>
                    <td style={{ ...s.td, fontWeight: "700" }}>{row.energy}</td>
                    <td style={s.tdGray}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s5h}</h2>
          <div style={s.divider} />
          {t.procedureItems.map((item) => (
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
