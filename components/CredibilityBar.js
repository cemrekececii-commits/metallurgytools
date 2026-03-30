"use client";
// components/CredibilityBar.js
// Tüm sayfalarda kullanılabilir güvenilirlik şeridi

export default function CredibilityBar() {
  return (
    <div style={{
      backgroundColor: "#0a0f1a",
      borderTop: "1px solid rgba(212,175,55,0.15)",
      borderBottom: "1px solid rgba(212,175,55,0.15)",
      padding: "12px 24px",
      overflowX: "auto",
    }}>
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "32px",
      }}>
        {[
          { value: "18+", label: "Yıl Endüstriyel Deneyim", sub: "Entegre çelik tesisi" },
          { value: "50.000+", label: "Analiz Edilmiş Test Verisi", sub: "Çekme · Charpy · Sertlik · DWTT" },
          { value: "12+", label: "Akademik Yayın", sub: "Konferans bildirisi" },
          { value: "ASTM · EN ISO · API", label: "Standart Uyumluluğu", sub: "Tüm içerik doğrulanmış" },
        ].map((item) => (
          <div key={item.value} style={{ textAlign: "center", minWidth: "140px" }}>
            <p style={{ fontFamily: "monospace", color: "#d4af37", fontSize: "18px", fontWeight: "700", margin: 0 }}>
              {item.value}
            </p>
            <p style={{ color: "#e5e7eb", fontSize: "12px", fontWeight: "600", margin: "2px 0 1px" }}>
              {item.label}
            </p>
            <p style={{ color: "#6b7280", fontSize: "11px", fontFamily: "monospace", margin: 0 }}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
