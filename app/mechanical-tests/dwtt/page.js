import Link from "next/link";

export const metadata = {
  title: "DWTT (Drop Weight Tear Test) | Mekanik Test Rehberi | MetallurgyTools",
  description: "API 5L Annex G ve ASTM E436 çerçevesinde DWTT testi, %85 kesme yüzeyi kriteri, boru hattı kırılma yayılımı ve X65/X70 çelik uygulamaları.",
};

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", backgroundColor: "rgba(248,113,113,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#ef4444", marginBottom: "24px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: "11px", borderBottom: "1px solid #1f2937", backgroundColor: "#111827" },
  tdRed: { padding: "12px 16px", fontFamily: "monospace", color: "#f87171", fontSize: "12px", fontWeight: "700" },
  td: { padding: "12px 16px", color: "#d1d5db", fontSize: "12px" },
  tdGray: { padding: "12px 16px", color: "#6b7280", fontSize: "12px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #ef4444", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function DWTTPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#f87171", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>DWTT</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>API 5L Annex G · ASTM E436</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>05 / 06</span>
          </div>
          <h1 style={s.h1}>DWTT Testi</h1>
          <p style={s.lead}>Drop Weight Tear Test, büyük çaplı boru hatlarında uzun mesafeli kırılma yayılımını (running fracture) önlemeye yönelik tokluğun belirlenmesinde kullanılan birincil kırılma mekanik testidir.</p>
        </header>

        {/* Charpy vs DWTT */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Neden DWTT? Charpy ile Fark</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            Charpy CVN testi küçük numune geometrisi (10×10×55 mm) nedeniyle yüksek mukavemetli boru çeliklerinin (X65, X70, X80) gerçek kırılma yayılım davranışını temsil etmekte yetersiz kalır. DWTT tam et kalınlığında, büyük format numune kullanır.
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "24px" }}>
            {[
              { label: "CHARPY CVN", items: ["10×10×55 mm numune", "V-çentik, 2 mm derinlik", "Sonuç: Joule enerji", "Subsize gerektirebilir"] },
              { label: "DWTT", items: ["305×76 mm, tam et kalınlığı", "Pressed notch veya EB notch", "Sonuç: % kesme yüzeyi (SA)", "Full-scale simülasyon"] },
            ].map((col) => (
              <div key={col.label}>
                <p style={{ color: "#f87171", fontFamily: "monospace", fontSize: "11px", fontWeight: "700", marginBottom: "12px" }}>{col.label}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.items.map((item) => (
                    <li key={item} style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "6px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#f87171" }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* %85 Kriteri */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>%85 Kesme Yüzeyi Kriteri</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            API 5L Annex G, DWTT için tasarım sıcaklığında %85 minimum kesme yüzeyi (% shear area) kriterini zorunlu kılar. Bu kriter Battelle Columbus Laboratories deneylerine dayanır: %85 SA eşiğinin altında kırılma yayılımı sürdürülebilir hale gelir.
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// SA hesabı</p>
            <p style={{ color: "#fca5a5" }}>% SA = [(A_total − A_cleavage) / A_total] × 100</p>
            <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "12px" }}>A_total: Net kesit alanı = (W − 2×w_notch) × t</p>
          </div>
        </section>

        {/* Çentik Tipleri */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Çentik Geometrisi</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {[
              { title: "Pressed Notch (PN)", desc: "Zımba ile oluşturulan küt çentik. Standart API 5L DWTT yöntemi. Çentik önünde kısa plastik deformasyon bölgesi oluşur. PN sonuçları EB'ye göre daha tutucu olabilir.", use: "API 5L PSL1 ve PSL2" },
              { title: "Electron Beam (EB) Notch", desc: "Elektron demeti ile oluşturulan keskin çentik. Çentik ucu yarıçapı ≈ 0.01 mm. Pressed notch ile karşılaştırıldığında daha düşük %SA verebilir.", use: "Araştırma, X80/X100" },
            ].map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "12px", fontSize: "15px" }}>{card.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>{card.desc}</p>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#f87171" }}>Kullanım: {card.use}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kök Neden */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>DWTT Reddi – Metalürjik Kök Neden</h2>
          <div style={s.divider} />
          {[
            { title: "İri Kolonyal Tane – Segregasyon Etkisi", text: "Sürekli döküm slab merkez segregasyonu (C, Mn, P, S zenginleşmesi) hadde sonrasında bantlaşmış martenzit/bainit adacıkları oluşturur. Bu adacıklar DWTT numunesinde yarılma çekirdeklenmesi noktaları olarak işlev görür." },
            { title: "Yetersiz TMCP – Ar3 Altı Haddeleme", text: "Bitiş hadde sıcaklığının Ar3 altına düşmesi deformasyon bandlaşmış ferrit oluşturur. X65/X70 üretiminde FRT penceresi tipik olarak 780–850°C aralığında tutulur." },
            { title: "Hızlı Soğutma – Sert Faz", text: "ACC soğutma hızı kontrolsüz arttığında bainit/martenzit oranı yükselir. Ferrit–sert faz ara yüzeylerinde gerilim konsantrasyonu yaratır ve düşük test sıcaklıklarında erken yarılma tetikler." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* API 5L Tablo */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>API 5L PSL2 DWTT Gereksinimleri</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1f2937" }}>
            <table style={s.table}>
              <thead><tr>{["Sınıf", "Kalınlık (mm)", "Test Sıcaklığı", "Min. %SA", "Not"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  { g: "X52 PSL2", t: "≥ 6.0", temp: "Tasarım sıc.", sa: "≥ 85%", n: "Charpy yeterli olabilir" },
                  { g: "X60 PSL2", t: "≥ 6.0", temp: "Tasarım sıc.", sa: "≥ 85%", n: "DWTT zorunlu" },
                  { g: "X65 PSL2", t: "≥ 6.0", temp: "Tasarım sıc.", sa: "≥ 85%", n: "DWTT zorunlu" },
                  { g: "X70 PSL2", t: "≥ 6.0", temp: "Tasarım sıc.", sa: "≥ 85%", n: "DWTT zorunlu" },
                  { g: "X80 PSL2", t: "≥ 6.0", temp: "Tasarım sıc.", sa: "≥ 85%", n: "EB veya PN" },
                ].map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#030712" : "rgba(17,24,39,0.5)" }}>
                    <td style={s.tdRed}>{row.g}</td>
                    <td style={s.td}>{row.t}</td>
                    <td style={s.td}>{row.temp}</td>
                    <td style={{ ...s.td, fontWeight: "700", color: "#fff" }}>{row.sa}</td>
                    <td style={s.tdGray}>{row.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests/katlama-egme-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← Katlama / Eğme</Link>
          <Link href="/mechanical-tests/basma-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>Basma Testi →</Link>
        </footer>
      </article>
    </main>
  );
}
