// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#030712", borderTop: "1px solid #1f2937" }}>

      {/* Güvenilirlik Açıklaması */}
      <div style={{ backgroundColor: "#070d1a", borderBottom: "1px solid #1f2937", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>

            <div>
              <p style={{ color: "#d4af37", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Neden MetallurgyTools?
              </p>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.4" }}>
                Yapay Zeka Değil,<br />Gerçek Saha Verisi
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.7" }}>
                Bu platformdaki tüm içerikler, entegre demir-çelik tesisinde 18 yılı aşkın sürede
                biriktirilen 50.000'den fazla mekanik test verisi, SEM-EDS analizi ve
                uluslararası standart uygulaması deneyimine dayanmaktadır.
              </p>
            </div>

            <div>
              <p style={{ color: "#d4af37", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Metodoloji
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Her hesaplama yöntemi literatür ve saha verisiyle çapraz doğrulanmıştır",
                  "Ampirik korelasyonlar (Pickering-Gladman, Hollomon, Mintz) gerçek üretim verileriyle test edilmiştir",
                  "Standart yorumlamaları ASTM, EN ISO, API ve VDA belgelerine sadık kalınarak hazırlanmıştır",
                  "Hata analizi ve ölçüm belirsizliği hesaplamalarında ISO/IEC 17025 çerçevesi esas alınmıştır",
                ].map((item, i) => (
                  <li key={i} style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "8px", display: "flex", gap: "8px", lineHeight: "1.5" }}>
                    <span style={{ color: "#d4af37", marginTop: "2px", flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ color: "#d4af37", fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                Uzmanlık Alanları
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  "S315MC–S700MC", "DP600", "API X42–X80", "IF Çelikleri",
                  "DD11–DD14", "Zırh Çeliği", "Tel Çeliği", "BOF/Sürekli Döküm",
                  "TMCP Hadde", "Charpy/DWTT", "SEM-EDS", "UT Level 2",
                ].map((tag) => (
                  <span key={tag} style={{
                    fontSize: "11px", fontFamily: "monospace",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "#9ca3af",
                    padding: "2px 8px", borderRadius: "4px",
                  }}>{tag}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Sorumluluk Reddi */}
          <div style={{
            marginTop: "32px",
            padding: "16px 20px",
            backgroundColor: "rgba(212,175,55,0.05)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "8px",
          }}>
            <p style={{ color: "#6b7280", fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
              <span style={{ color: "#d4af37", fontWeight: "600" }}>Önemli Not: </span>
              Bu platformdaki hesaplama araçları ve bilgi içerikleri mühendislik rehberliği amacıyla
              sunulmaktadır. Kritik tasarım ve güvenlik kararlarında güncel standartlara ve yetkili
              mühendislik değerlendirmesine başvurulması zorunludur. Tüm ampirik korelasyonlar
              belirtilen geçerlilik aralıklarında kullanılmalıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div style={{ padding: "24px", maxWidth: "1152px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg, #d4af37, #b8962e)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "700", color: "#030712", fontSize: "14px", fontFamily: "monospace",
          }}>M</div>
          <span style={{ color: "#9ca3af", fontSize: "13px" }}>
            MetallurgyTools · Uzman Metalurji Ekibi tarafından geliştirilmiştir
          </span>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { href: "/mechanical-tests", label: "Mekanik Testler" },
            { href: "/knowledge", label: "Bilgi Bankası" },
            { href: "/tools", label: "Araçlar" },
            { href: "/pricing", label: "Fiyatlandırma" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "#6b7280", fontSize: "12px", textDecoration: "none", fontFamily: "monospace" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <p style={{ color: "#4b5563", fontSize: "11px", fontFamily: "monospace", margin: 0 }}>
          © {new Date().getFullYear()} MetallurgyTools · Tüm hakları saklıdır
        </p>
      </div>

    </footer>
  );
}
