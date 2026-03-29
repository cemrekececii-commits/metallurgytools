import Link from "next/link";

export const metadata = {
  title: "Basma Testi | Mekanik Test Rehberi | MetallurgyTools",
  description: "ASTM E9 ve EN ISO 604 çerçevesinde basma testi, akış gerilmesi ölçümü, fıçılaşma düzeltmesi, sürtünme etkisi ve hadde simülasyonu uygulamaları.",
};

const s = {
  page: { minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" },
  breadcrumb: { borderBottom: "1px solid #1f2937", padding: "12px 24px" },
  breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: "#6b7280" },
  article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
  badge: { fontSize: "11px", fontFamily: "monospace", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)", backgroundColor: "rgba(192,132,252,0.05)", padding: "2px 8px", borderRadius: "4px" },
  h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", color: "#fff", marginBottom: "16px" },
  lead: { color: "#9ca3af", fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" },
  h2: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  divider: { width: "48px", height: "2px", backgroundColor: "#a855f7", marginBottom: "24px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" },
  leftBorder: { backgroundColor: "#111827", borderLeft: "2px solid #a855f7", borderRadius: "0 12px 12px 0", padding: "20px", marginBottom: "16px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: "1px solid #1f2937", marginTop: "32px" },
};

export default function CompressionTestPage() {
  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: "#c084fc", textDecoration: "none" }}>Mekanik Testler</Link>
          <span>/</span>
          <span style={{ color: "#d1d5db" }}>Basma Testi</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>ASTM E9 · EN ISO 604</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>06 / 06</span>
          </div>
          <h1 style={s.h1}>Basma Testi</h1>
          <p style={s.lead}>Basma testi, malzemenin basma yükü altındaki plastik akma davranışını ve akış gerilmesini belirler. Hadde yükü hesabı ve şekillendirme simülasyonu için temel girdi verilerini sağlar.</p>
        </header>

        {/* Formüller */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Akış Gerilmesi ve Pekleşme</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            Basma testinde numune silindirik olup boyuna yüklenir. En kritik çıktı akış gerilmesi eğrisi: σ_f = f(ε, ε̇, T). Zener-Hollomon parametresi Z = ε̇ · exp(Q/RT) ile farklı kombinasyonlar normalize edilir.
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// Basma gerçek gerilme</p>
            <p style={{ color: "#d8b4fe" }}>sigma_true = F / A_true = F·h / (A₀·h₀)</p>
            <p style={{ color: "#6b7280", marginTop: "14px", marginBottom: "8px" }}>// Gerçek gerinim (basma)</p>
            <p style={{ color: "#d8b4fe" }}>epsilon_true = ln(h₀ / h)</p>
            <p style={{ color: "#6b7280", marginTop: "14px", marginBottom: "8px" }}>// Zener-Hollomon parametresi</p>
            <p style={{ color: "#d8b4fe" }}>Z = ε̇ · exp(Q / RT)</p>
          </div>
        </section>

        {/* Fıçılaşma */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Fıçılaşma (Barreling) ve Sürtünme Düzeltmesi</h2>
          <div style={s.divider} />
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px" }}>
            Gerçek basma testinde plaka–numune temas yüzeyindeki sürtünme radyal akışı engeller, fıçılaşmaya neden olur. Sürtünme düzeltmesi yapılmadan elde edilen σ_f değerleri sistematik olarak yüksek hatalıdır.
          </p>
          <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" }}>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>// Rastegaev sürtünme düzeltmesi</p>
            <p style={{ color: "#d8b4fe" }}>sigma_f = sigma_measured / (1 + 2μR/3h)</p>
            <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "12px" }}>μ: sürtünme katsayısı (yağlama 0.02–0.05, kuru 0.1–0.3)<br />R: anlık numune yarıçapı, h: anlık yükseklik</p>
          </div>
          <p style={{ color: "#d1d5db", fontSize: "15px", lineHeight: "1.7" }}>
            Sürtünme etkisini azaltmak için: grafit + yağ karışımı, teflon disk, veya Rastegaev yöntemi (numune uç yüzeyine sığ konsantrik oluk) uygulanır. Gleeble sistemlerinde tantalum folyo standarttır.
          </p>
        </section>

        {/* h/d Oranı */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Numune Geometrisi – h/d Oranı</h2>
          <div style={s.divider} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
            {[
              { ratio: "h/d = 1.0", use: "Fıçılaşma çalışmaları", notes: ["Sürtünme etkisi belirgin", "Geniş ε aralığı", "Yüksek deformasyon kapasitesi"] },
              { ratio: "h/d = 1.5", use: "Standart basma testi", notes: ["ASTM E9 önerisi", "Denge: sürtünme vs burkulma", "Çoğu araştırma uygulaması"] },
              { ratio: "h/d ≥ 3.0", use: "Burkulma kritik", notes: ["Uzun ince numune", "Elastik burkulma riski", "Sadece çok düşük ε"] },
            ].map((card) => (
              <div key={card.ratio} style={s.card}>
                <p style={{ fontFamily: "monospace", color: "#c084fc", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>{card.ratio}</p>
                <p style={{ color: "#d1d5db", fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>{card.use}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.notes.map((n) => (
                    <li key={n} style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px", display: "flex", gap: "8px" }}>
                      <span style={{ color: "#a855f7" }}>·</span>{n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Gleeble */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>Hadde Simülasyonu ve Sıcak Basma Testleri</h2>
          <div style={s.divider} />
          {[
            { title: "Gleeble Termal-Mekanik Simülatörü", text: "Gleeble, direnç ısıtması ile sıcaklık kontrolü sağlarken eş zamanlı mekanik yükleme yapabilir. Sıcak basma deneyleri; γ ve α bölgelerinde akış gerilmesi, yeniden kristalleşme kinetikleri (MFS – mean flow stress) ve CCT eğrisi oluşturma için kullanılır." },
            { title: "Akış Gerilmesi Eğrisi – Hadde Yükü Hesabı", text: "Sıcak hadde pass yükü: F = σ_f × A_contact × Q_p (baskı faktörü). Nb, V, Ti mikroalaşımlı çeliklerde T_nr sıcaklığının üzerinde her passta dinamik yeniden kristalleşme gerçekleşir; altında gerinim birikmesi başlar." },
            { title: "Soğuk Basma – FEM Girdi Verisi", text: "DP ve TRIP çeliklerinin şekillendirme simülasyonunda deformasyon kuvveti verisi basma testinden elde edilir. σ_f eğrisi Voce veya Swift modelleriyle fit edilir ve sonlu elemanlar analizine aktarılır." },
          ].map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6" }}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* Uyarı */}
        <section style={{ marginBottom: "56px" }}>
          <div style={{ backgroundColor: "rgba(88,28,135,0.2)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ fontWeight: "700", color: "#fff", marginBottom: "12px" }}>⚠ Basma Testinin Sınırlamaları</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Büyük deformasyonlarda fıçılaşma homojen deformasyonu bozar, σ_f gerçek değildir.",
                "Çekme testine kıyasla kırılma/tokluğun doğrudan ölçülmesi mümkün değildir.",
                "Bauchinger etkisi: çekme sonrası basma yüklemesinde akma gerilmesi düşer (kinematik pekleşme).",
                "Yüksek sıcaklık testinde oksidasyonu önlemek için koruyucu atmosfer (Ar, He) gerekebilir.",
              ].map((item) => (
                <li key={item} style={{ color: "#d1d5db", fontSize: "13px", marginBottom: "8px", display: "flex", gap: "8px", lineHeight: "1.5" }}>
                  <span style={{ color: "#c084fc", marginTop: "2px" }}>·</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer style={s.footer}>
          <Link href="/mechanical-tests/dwtt" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>← DWTT</Link>
          <Link href="/mechanical-tests" style={{ fontSize: "13px", fontFamily: "monospace", color: "#6b7280", textDecoration: "none" }}>↑ Tüm Testler</Link>
        </footer>
      </article>
    </main>
  );
}
