import Link from "next/link";

export const metadata = {
  title: "Sertlik Ölçümü | Mekanik Test Rehberi | MetallurgyTools",
  description: "Vickers, Brinell, Rockwell sertlik yöntemleri, ISO 18265 dönüşüm tabloları, UTS korelasyonu ve HAZ haritalama uygulamaları.",
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

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.3)", backgroundColor: "rgba(148,163,184,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#94a3b8", marginBottom: "24px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", marginBottom: "16px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontFamily: "monospace", fontSize: "11px", borderBottom: "1px solid #1f2937", backgroundColor: "#111827" },
  tdSlate: { padding: "12px 16px", fontFamily: "monospace", color: "#cbd5e1", fontSize: "12px", fontWeight: "700" },
  td: { padding: "12px 16px", color: "#d1d5db", fontSize: "12px" },
  tdGray: { padding: "12px 16px", color: "#6b7280", fontSize: "12px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #94a3b8", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function HardnessTestPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#94a3b8", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>Sertlik Ölçümü</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>ASTM E10 · E18 · E92 · ISO 18265</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>03 / 06</span>
          </div>
          <h1 style={s.h1}>Sertlik Ölçümü</h1>
          <p style={s.lead}>Sertlik, malzemenin lokal plastik deformasyona gösterdiği direnci ölçer. Çekme dayanımı ile doğrusal korelasyonu, hızlı üretim kontrolü ve HAZ karakterizasyonu için endüstriyel açıdan kritiktir.</p>
        </header>

        {/* Yöntemler */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Sertlik Ölçüm Yöntemleri</h2>
          <div style={s.divider} />
          {[
            { name: "Vickers (HV)", standard: "ASTM E92 · EN ISO 6507", indenter: "Kare tabanlı elmas piramit, 136°", load: "HV1 (9.81 N) – HV30 (294 N)", formula: "HV = 1.8544 × F / d²", notes: "Geniş sertlik aralığında geçerli. Mikro-HV (HV0.01–HV0.5): HAZ, ince kaplama, kaynak.", accent: "#94a3b8" },
            { name: "Brinell (HBW)", standard: "ASTM E10 · EN ISO 6506", indenter: "Tungsten karbür bilye, Ø 10 / 5 / 2.5 mm", load: "187.5 – 3000 kgf", formula: "HBW = 0.204 × F / (D·(D−√(D²−d²)))", notes: "Kaba mikroyapılı malzeme için uygundur. HBW > 450 önerilmez.", accent: "#60a5fa" },
            { name: "Rockwell (HRC / HRB)", standard: "ASTM E18 · EN ISO 6508", indenter: "HRC: Elmas konus 120° / HRB: Ø 1/16 bilye", load: "HRC: 150 kgf / HRB: 100 kgf", formula: "HR = N − (h/S)", notes: "Hızlı, tek değer. Düzgün yüzey şarttır. Kalın malzeme > 0.5 mm önerilir.", accent: "#34d399" },
          ].map((m) => (
            <div key={m.name} style={s.card}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: m.accent }}>{m.name}</h3>
                  <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#6b7280", marginTop: "4px" }}>{m.standard}</p>
                </div>
                <code style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#1f2937", color: "#d1d5db", padding: "6px 12px", borderRadius: "6px", border: "1px solid #374151" }}>{m.formula}</code>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>
                <div><p style={{ color: "#4b5563", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>İNDENTÖR</p><p>{m.indenter}</p></div>
                <div><p style={{ color: "#4b5563", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>YÜK ARALIĞI</p><p>{m.load}</p></div>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5", borderTop: "1px solid #1f2937", paddingTop: "12px" }}>{m.notes}</p>
            </div>
          ))}
        </section>

        {/* UTS Korelasyonu */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>UTS–Sertlik Korelasyonu</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>Düşük–orta karbonlu çeliklerde HV ve HBW'nin Rm ile doğrusal ilişkisi pratik kullanımda yaygındır:</p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// HV → Rm (carbon steel)</p>
            <p style={{ color: "#cbd5e1" }}>Rm (MPa) ≈ 3.4 × HV</p>
            <p style={{ color: "#6b7280", marginTop: "12px", marginBottom: "8px" }}>// Brinell için</p>
            <p style={{ color: "#cbd5e1" }}>Rm (MPa) ≈ 3.45 × HBW</p>
            <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "12px" }}>* Geçerlilik: HV 90–350. Martenzitik çeliklerde sapma artar.</p>
          </div>
        </section>

        {/* Dönüşüm Tablosu */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Sertlik Dönüşüm Tablosu (ISO 18265)</h2>
          <div style={s.divider} />
          <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #1f2937" }}>
            <table style={s.table}>
              <thead><tr>{["HV", "HBW", "HRC", "HRB", "Rm (MPa) ~"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {conversions.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#030712" : "rgba(17,24,39,0.5)" }}>
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
          <p style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace", marginTop: "12px" }}>* ISO 18265:2013 Tablo A.1'den seçilmiş değerler.</p>
        </section>

        {/* HAZ */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Mikrohardness HAZ Haritalama</h2>
          <div style={s.divider} />
          {[
            { title: "HAZ Sertlik Kriteri – NACE/ISO", text: "NACE MR0175/ISO 15156'ya göre H₂S ortamında karbon çelik bileşenlerinde kaynak HAZ dahil maksimum 250 HV10 sınırı uygulanır. Bu sınırın aşılması HIC/SSC riskini artırır." },
            { title: "Ölçüm Noktası Deseni", text: "Kaynak metalinden baz metale doğru minimum 1 mm aralıklı izler alınır. Tane büyümüş HAZ (CGHAZ), tane incelmiş HAZ (FGHAZ) ve interkritik HAZ (ICHAZ) bölgelerinin ayrı ayrı tanımlanması gerekir." },
            { title: "Yük Seçimi", text: "HV0.1–HV0.5 ince kaplama ve difüzyon bölgelerinde; HV1–HV5 kaynak HAZ için standart aralıktır. HV10 kaba taneli, heterojen yapılarda temsilcilik açısından tercih edilir." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests/darbe-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← Darbe Testi</Link>
          <Link href="/mechanical-tests/katlama-egme-testi" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>Katlama / Eğme →</Link>
        </footer>
      </article>
    </main>
  );
}
