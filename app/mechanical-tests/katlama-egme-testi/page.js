import Link from "next/link";

export const metadata = {
  title: "Katlama / Eğme Testi | Mekanik Test Rehberi | MetallurgyTools",
  description: "EN ISO 7438 ve ASTM E290 çerçevesinde katlama ve eğme testi prosedürü, mandrel çapı seçimi ve kaynak yeterliliği uygulamaları.",
};

const mandrelTable = [
  { grade: "S235 / St37", t: "≤ 16 mm", ratio: "d = 1.0t", angle: "180°", standard: "EN 10025" },
  { grade: "S355J2", t: "≤ 16 mm", ratio: "d = 1.5t", angle: "180°", standard: "EN 10025" },
  { grade: "S420 / S460", t: "≤ 16 mm", ratio: "d = 2.0t", angle: "180°", standard: "EN 10025-4" },
  { grade: "S600MC / S700MC", t: "≤ 8 mm", ratio: "d = 3.0t", angle: "90°", standard: "EN 10149-2" },
  { grade: "API 5L X65 PSL2", t: "WT", ratio: "d = 3.0t", angle: "180°", standard: "API 5L Sec. 9" },
  { grade: "DP600", t: "≤ 2 mm", ratio: "d = 1.0t", angle: "180°", standard: "VDA 238-100" },
  { grade: "Kaynak (WPS)", t: "2t", ratio: "d = 2t spesifik", angle: "180°", standard: "ASME IX QW-160" },
];

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", backgroundColor: "rgba(52,211,153,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#10b981", marginBottom: "24px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: "11px", borderBottom: "1px solid #1f2937", backgroundColor: "#111827" },
  tdGreen: { padding: "12px 16px", fontFamily: "monospace", color: "#34d399", fontSize: "12px", fontWeight: "700" },
  td: { padding: "12px 16px", color: "#d1d5db", fontSize: "12px" },
  tdGray: { padding: "12px 16px", color: "#6b7280", fontSize: "12px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #10b981", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function BendTestPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#34d399", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>Katlama / Eğme Testi</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>EN ISO 7438 · ASTM E290</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>04 / 06</span>
          </div>
          <h1 style={s.h1}>Katlama / Eğme Testi</h1>
          <p style={s.lead}>Eğme testi, malzemenin sünek deformasyon kapasitesini ve yüzey bütünlüğünü belirler. Sac malzeme şekillendirilebilirliği ve kaynak dikiş yeterliliğinin doğrulanmasında birincil yöntemdir.</p>
        </header>

        {/* Konfigürasyonlar */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Test Konfigürasyonları</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "16px" }}>
            {[
              { title: "Kılavuzlu Eğme", sub: "Guided Bend", desc: "Belirli mandrel çapı etrafında sabit açıya kadar eğme. EN ISO 7438 ve ASTM E290 temel konfigürasyonu. Kaynak testlerinde (ASME IX, ISO 15614-1) uygulanır.", items: ["Zımba-kalıp seti", "d/t oranı kritik", "Convex/concave yüzey"] },
              { title: "Serbest Eğme", sub: "Free Bend", desc: "Sabit mesafeli iki destek üzerinde ortadan yük. Üç noktalı eğme düzeneğinde eğme açısı ve mandrel çapı ilişkisi belirlenir.", items: ["L/d oranı kontrolü", "Sac formability testi", "VDA 238-100 uyumlu"] },
              { title: "Sarma Testi", sub: "Wrap-Around Bend", desc: "Numune belirli çaplı silindir etrafına sarılır. İnce saclar ve kaplı malzemeler için uygundur.", items: ["EN ISO 8491 tel ürünler", "Spiral eğme teli", "Kaplama bütünlüğü"] },
            ].map((card) => (
              <div key={card.title} style={s.card}>
                <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "2px", fontSize: "15px" }}>{card.title}</h3>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#6b7280", marginBottom: "10px" }}>{card.sub}</p>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>{card.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ color: "#6b7280", fontSize: "12px", fontFamily: "monospace", marginBottom: "4px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#34d399" }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Mandrel Tablosu */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Mandrel Çapı Gereksinimleri</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1f2937" }}>
            <table style={s.table}>
              <thead><tr>{["Çelik Sınıfı", "Kalınlık", "d/t Oranı", "Eğme Açısı", "Standart"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {mandrelTable.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#030712" : "rgba(17,24,39,0.5)" }}>
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
          <p style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace", marginTop: "12px" }}>* t = numune kalınlığı, d = mandrel çapı.</p>
        </section>

        {/* Formül ve Yorum */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Kırılma Metalürjisi ve Ret Kriterleri</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            Eğme numunesi dış yüzeyi çekme gerilmesi altında, iç yüzeyi basma altında kalır. Dış yarıçaptaki maksimum gerinim:
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// Dış yüzey maksimum gerinim</p>
            <p style={{ color: "#6ee7b7" }}>ε_max = t / (t + d)</p>
            <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "12px" }}>Örnek: t = 5 mm, d = 10 mm → ε_max = 5/15 = 0.333 (%33,3)</p>
          </div>
          {[
            { title: "Laminasyon ve Bantlaşma", text: "Hadde ürününde çift yönlü segregasyon bantları eğme sırasında delamination ile kendini gösterir. MnS bandlaşması kalınlık yönünde düktilitesi olan malzemelerde (Z35 kalitesi) kontrol edilir." },
            { title: "Kaynak Eğme Testi Reddi", text: "ASME IX QW-163'e göre 3,2 mm'nin üzerindeki herhangi bir çatlak red kriteri oluşturur. HAZ çatlakları; CGHAZ'da martenzit oluşumunu ve H₂ kırılganlığını düşündürmelidir." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests/sertlik-olcumu" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← Sertlik Ölçümü</Link>
          <Link href="/mechanical-tests/dwtt" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>DWTT →</Link>
        </footer>
      </article>
    </main>
  );
}
