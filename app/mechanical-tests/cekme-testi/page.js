import Link from "next/link";

export const metadata = {
  title: "Çekme Testi | Mekanik Test Rehberi | MetallurgyTools",
  description: "ASTM E8/E8M ve EN ISO 6892-1 çerçevesinde çekme testi prosedürü, mühendislik–gerçek gerilme dönüşümü, n ve r değerleri, Lüders bandı ve çelik sınıfı uygulamaları.",
};

const properties = [
  { symbol: "Rp0.2 / Re", name: "Akma Dayanımı", unit: "MPa", description: "Kalıcı şekil değişiminin başladığı gerilme. Sürekli akma için 0,2% offset metodu." },
  { symbol: "Rm", name: "Çekme Dayanımı", unit: "MPa", description: "Gerilme–uzama eğrisindeki maksimum mühendislik gerilmesi (UTS)." },
  { symbol: "A%", name: "Kopma Uzaması", unit: "%", description: "Ölçüm uzunluğu (Lo = 5,65√So veya 80 mm) üzerinden kopma uzaması." },
  { symbol: "Z%", name: "Kesit Daralması", unit: "%", description: "Kopma noktasındaki kesit alanı azalma oranı. Tokluğun yerel göstergesi." },
  { symbol: "n", name: "Pekleşme Üssü", unit: "–", description: "σ = C·εⁿ (Hollomon). Sac şekillendirmede derin çekme kapasitesini belirler." },
  { symbol: "r (Lankford)", name: "Anizotropi Katsayısı", unit: "–", description: "r = εw/εt. IF çeliklerinde r̄ > 1.5 derin çekme kalitesini gösterir." },
];

const steelGrades = [
  { grade: "S235 / St37", ys: "≥ 235", uts: "360–510", elong: "≥ 26", note: "Yapısal, düşük C" },
  { grade: "S355J2", ys: "≥ 355", uts: "470–630", elong: "≥ 22", note: "Mikroalaşımlı, Mn-Si" },
  { grade: "S600MC", ys: "≥ 600", uts: "650–820", elong: "≥ 16", note: "Nb-Ti-V termomekanik" },
  { grade: "S700MC", ys: "≥ 700", uts: "750–950", elong: "≥ 12", note: "TMCP, düşük C" },
  { grade: "API 5L X65", ys: "448–600", uts: "530–760", elong: "≥ 21", note: "Boru hattı, PSL2" },
  { grade: "DP600", ys: "330–400", uts: "600–700", elong: "≥ 20", note: "Ferrit+Martenzit, n≈0.18" },
  { grade: "IF (DDQ)", ys: "140–180", uts: "270–330", elong: "≥ 42", note: "Ti/Nb, r̄ > 1.8" },
];

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)", backgroundColor: "rgba(96,165,250,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#3b82f6", marginBottom: "24px" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" },
  mono: { fontFamily: "monospace" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: "11px", borderBottom: "1px solid #1f2937", backgroundColor: "#111827" },
  tdBlue: { padding: "12px 16px", fontFamily: "monospace", color: "#60a5fa", fontSize: "12px", fontWeight: "700" },
  td: { padding: "12px 16px", color: "#d1d5db", fontSize: "12px" },
  tdGray: { padding: "12px 16px", color: "#6b7280", fontSize: "12px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #3b82f6", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function TensileTestPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#60a5fa", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>Çekme Testi</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>ASTM E8/E8M · EN ISO 6892-1</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>01 / 06</span>
          </div>
          <h1 style={s.h1}>Çekme Testi</h1>
          <p style={s.lead}>Mühendislik malzemelerinin statik yük altında doğrusal elastik ve plastik deformasyon davranışını belirleyen temel karakterizasyon yöntemi.</p>
        </header>

        {/* Parametreler */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Temel Mekanik Parametreler</h2>
          <div style={s.divider} />
          <div style={s.grid2}>
            {properties.map((p) => (
              <div key={p.symbol} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ ...s.mono, color: "#60a5fa", fontSize: "16px", fontWeight: "700" }}>{p.symbol}</span>
                  <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#6b7280", border: "1px solid #374151", padding: "1px 6px", borderRadius: "3px" }}>{p.unit}</span>
                </div>
                <p style={{ color: "#d1d5db", fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>{p.name}</p>
                <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: "1.5" }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formüller */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Gerilme–Uzama Eğrisi ve Metalürjik Yorum</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            Mühendislik gerilme–uzama eğrisi σ = F/A₀ ve ε = ΔL/L₀ tanımları üzerine kurulur. Gerçek gerilme–uzama eğrisi ise σ_true = σ_eng(1 + ε_eng) dönüşümüyle elde edilir. Hollomon pekleşme denklemi ve Considère kriteri:
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// Hollomon pekleşme denklemi</p>
            <p style={{ color: "#93c5fd" }}>σ_true = C · ε_true^n</p>
            <p style={{ color: "#6b7280", marginTop: "16px", marginBottom: "8px" }}>// Necking başlangıç kriteri (Considère)</p>
            <p style={{ color: "#93c5fd" }}>dσ_true/dε_true = σ_true → ε_uniform = n</p>
          </div>
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
            Düşük karbonlu çeliklerde belirgin üst ve alt akma gerilmesi gözlemlenir. Bu olgu, çözünmüş C ve N atomlarının dislokasyon çizgilerini kilitlemesi (Cottrell atmosferi) ile açıklanır. Serbest kalan dislokasyonlar Lüders bandları olarak ilerler.
          </p>
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7" }}>
            DP600 çeliklerinde ferrit–martenzit oranına bağlı olarak akma gerilmesi düşük (330–400 MPa), pekleşme üssü yüksek (n ≈ 0.16–0.20) seyreder; bu kombinasyon çekme şekillendirmede erken boyun atmayı geciktirir.
          </p>
        </section>

        {/* Çelik Sınıfı Tablosu */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Çelik Sınıfı Mekanik Özellik Referansı</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1f2937" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Sınıf", "ReH / Rp0.2 (MPa)", "Rm (MPa)", "A5 (%)", "Not"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steelGrades.map((row, i) => (
                  <tr key={row.grade} style={{ backgroundColor: i % 2 === 0 ? "#030712" : "rgba(17,24,39,0.5)" }}>
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

        {/* Yorumlama */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Sonuç Yorumlama ve Yaygın Hatalar</h2>
          <div style={s.divider} />
          {[
            { title: "Rp0.2 Reddi – Metalürjik Kök Neden", text: "S600MC gibi Nb-Ti çeliklerinde Rp0.2 düşüklüğü çoğunlukla bitiş hadde sıcaklığının Tnr üzerine çıkmasıyla ilişkilidir. Nb(C,N) çökelme kinetiklerinin yetersiz kalması dislokasyon yoğunluğunu azaltır. Hızlı soğutma hızı yetersizliği (< 15°C/s) ferrit tane irileşmesine yol açar." },
            { title: "Uzama Reddi – Lokalize Plastiklik", text: "A% düşüklüğü tek başına değil Z% ile birlikte yorumlanmalıdır. Z% normalken A% düşükse ölçüm uzunluğu seçimi araştırılmalıdır. Z% da düşükse inklüzyon bandlaşması veya segregasyon kaynaklı lokal gevreklik düşünülmelidir." },
            { title: "Rm/Re Oranı – Pipeline Güvenlik Kriteri", text: "API 5L PSL2 X65/X70 için Rm/Re ≤ 0.93 kriterleri mevcuttur. Rm/Re oranı < 1.15 ise malzeme plastik reserve kapasitesi sınırlıdır. Bu durum TMCP çeliklerinde aşırı Nb çökelti sertleşmesini işaret edebilir." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← Tüm Testler</Link>
          <Link href="/mechanical-tests/darbe-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>Darbe Testi →</Link>
        </footer>
      </article>
    </main>
  );
}
