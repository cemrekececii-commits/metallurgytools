import Link from "next/link";

export const metadata = {
  title: "Darbe Testi (Charpy) | Mekanik Test Rehberi | MetallurgyTools",
  description: "ISO 148-1 ve ASTM E23 çerçevesinde Charpy darbe testi, DBTT tayini, üst plato enerjisi, kırık yüzeyi analizi ve çelik sınıfı uygulamaları.",
};

const dbttFactors = [
  { factor: "Tane Boyutu (d)", effect: "d↑ → DBTT↑", mechanism: "Hall-Petch: daha iri tane çatlak çekirdeklenme enerjisini düşürür. d'yi yarıya indirmek DBTT'yi ~15°C düşürür." },
  { factor: "Karbon İçeriği", effect: "C↑ → DBTT↑", mechanism: "Perlitik yapı sementit film oluşumunu artırır; düşük C (< 0.10%) ve yeterli Mn esastır." },
  { factor: "Mn/C Oranı", effect: "Mn↑ → DBTT↓", mechanism: "Mn ostenit alanını genişletir, ferrit ve bainit oluşumunu rafine eder. Mn/C > 5 önerilir." },
  { factor: "Nb, Ti, V", effect: "Çökelti rafine eder → DBTT↓", mechanism: "Tane büyümesini engeller (TiN çözünmez < 1300°C), γ→α dönüşümünde ferrit tanesini rafine eder." },
  { factor: "N Serbest", effect: "N↑ → DBTT↑", mechanism: "Serbest N BCC kafeste interstisyel katı çözelti sertleşmesi yapar; Al ile AlN olarak bağlanması kritiktir." },
  { factor: "İnklüzyon (MnS)", effect: "MnS↑ → DBTT↑", mechanism: "Hadde yönünde uzayan MnS bantları T yönünde anizotropi yaratır ve kırık yolunu kolaylaştırır." },
];

const energyLevels = [
  { temp: "+20°C", grade: "S355J2", energy: "≥ 27 J", note: "Yapısal çelik minimum" },
  { temp: "0°C", grade: "S355J0", energy: "≥ 27 J", note: "" },
  { temp: "−20°C", grade: "S355J2", energy: "≥ 27 J", note: "" },
  { temp: "−40°C", grade: "S355NL", energy: "≥ 40 J", note: "Ofşor yapılar" },
  { temp: "−46°C", grade: "API 5L X65 PSL2", energy: "≥ 27 J", note: "Boru hattı" },
  { temp: "−60°C", grade: "S460NL", energy: "≥ 40 J", note: "Arktik uygulamalar" },
];

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)", backgroundColor: "rgba(251,146,60,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#f97316", marginBottom: "24px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: "11px", borderBottom: "1px solid #1f2937", backgroundColor: "#111827" },
  tdOrange: { padding: "12px 16px", fontFamily: "monospace", color: "#fb923c", fontSize: "12px", fontWeight: "700" },
  td: { padding: "12px 16px", color: "#d1d5db", fontSize: "12px" },
  tdGray: { padding: "12px 16px", color: "#6b7280", fontSize: "12px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #f97316", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function ImpactTestPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#fb923c", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>Darbe Testi</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>ISO 148-1 · ASTM E23</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>02 / 06</span>
          </div>
          <h1 style={s.h1}>Darbe Testi</h1>
          <p style={s.lead}>Charpy V-çentik (CVN) testi, BCC kafesli çeliklerin kırılma geçiş davranışını karakterize eden temel yöntemdir. DBTT ve üst plato enerjisi (USE) belirlenir.</p>
        </header>

        {/* Temel Kavramlar */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Kırılma Geçiş Davranışı</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            BCC kafesli demir ve çeliklerde dislokasyon hareketi düşük sıcaklıkta kovalent bağ karakterine yaklaşır. FCC kafesli malzemelerde bu geçiş gözlemlenmez. Enerji–sıcaklık eğrisinde üç bölge tanımlanır: üst plato (USE), geçiş bölgesi ve alt plato.
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// DBTT tahmin korelasyonu (Pickering–Gladman)</p>
            <p style={{ color: "#fdba74" }}>DBTT (°C) = −11 + 44(%Si) + 700(√%Nf) + 2.2(%Pf) − 11.5(d^−1/2)</p>
            <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "12px" }}>d: ferrit tane çapı (mm), Nf: serbest N (%), Pf: ince perlitik yapı oranı</p>
          </div>
        </section>

        {/* DBTT Faktörler */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>DBTT'yi Etkileyen Metalürjik Parametreler</h2>
          <div style={s.divider} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {dbttFactors.map((item) => (
              <div key={item.factor} style={{ ...s.card, display: "grid", gridTemplateColumns: "160px 140px 1fr", gap: "12px", alignItems: "start" }}>
                <p style={{ fontFamily: "monospace", color: "#fb923c", fontWeight: "700", fontSize: "13px" }}>{item.factor}</p>
                <span style={{ fontSize: "11px", fontFamily: "monospace", backgroundColor: "#1f2937", color: "#d1d5db", padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>{item.effect}</span>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.5" }}>{item.mechanism}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kırık Yüzeyi */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Kırık Yüzeyi Analizi</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {[
              { title: "Lifli (Fibrous / Shear) Kırık", items: ["Mat, koyu, pürüzlü görünüm", "Yüksek plastik deformasyon", "SEM'de dimple (çukurcuk) morfolojisi", "Mikro-boşluk birleşimi (MVC) mekanizması", "Yüksek tokluğu işaret eder"] },
              { title: "Yarılma (Cleavage) Kırık", items: ["{100} düzlemleri boyunca kırılma", "Parlak, granüler, kristalografik görünüm", "SEM'de nehir işaretleri (river marks)", "Düşük tokluğu işaret eder", "Fan motifi çatlak kaynak tanesini gösterir"] },
            ].map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "12px", fontSize: "14px" }}>{card.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "6px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#fb923c" }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Enerji Tablosu */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Standart Enerji Gereksinimleri</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1f2937" }}>
            <table style={s.table}>
              <thead><tr>{["Test Sıcaklığı", "Çelik Sınıfı", "Min. Enerji", "Uygulama"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {energyLevels.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#030712" : "rgba(17,24,39,0.5)" }}>
                    <td style={s.tdOrange}>{row.temp}</td>
                    <td style={s.td}>{row.grade}</td>
                    <td style={{ ...s.td, fontWeight: "700", color: "#fff" }}>{row.energy}</td>
                    <td style={s.tdGray}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pratik Notlar */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Test Prosedürü ve Yaygın Hatalar</h2>
          <div style={s.divider} />
          {[
            { title: "Numune Sıcaklık Kontrolü", text: "ISO 148-2'ye göre numune transferi 5 saniye içinde tamamlanmalıdır. Transfer süresi uzarsa numune yüzeyi ısınır ve özellikle geçiş bölgesinde sonuç sapması yaşanır. Transferde −7/+0°C toleransı uygulanır." },
            { title: "Çentik Geometrisi Hassasiyeti", text: "V-çentik açısı 45° ± 1°, derinlik 2.00 ± 0.025 mm, taban yarıçapı 0.25 ± 0.025 mm. ISO 148-2 kalibre numuneleri ile düzenli kalibrasyon zorunludur." },
            { title: "Subsize Numune Kullanımı", text: "7,5 × 10 mm subsize numuneler için doğrusal ölçek faktörü kullanılır (× 1,33). Bu dönüşüm tahminidir ve özellikle geçiş bölgesinde yüksek hata içerebilir." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests/cekme-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← Çekme Testi</Link>
          <Link href="/mechanical-tests/sertlik-olcumu" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>Sertlik Ölçümü →</Link>
        </footer>
      </article>
    </main>
  );
}
