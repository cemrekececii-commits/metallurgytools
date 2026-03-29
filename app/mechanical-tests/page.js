import Link from "next/link";

export const metadata = {
  title: "Mekanik Test Rehberi | MetallurgyTools",
  description:
    "Çekme testi, darbe testi, sertlik ölçümü, katlama testi, DWTT ve basma testi hakkında kapsamlı mühendislik rehberleri.",
};

const tests = [
  {
    id: 1,
    slug: "cekme-testi",
    title: "Çekme Testi",
    titleEn: "Tensile Test",
    icon: "↕",
    standards: ["ASTM E8/E8M", "EN ISO 6892-1"],
    summary: "Akma dayanımı, çekme dayanımı, uzama ve kesit daralması belirlenir. Mühendislik–gerçek gerilme dönüşümü ve n, r değerleri.",
    tags: ["Rp0.2", "Rm", "A%", "Z%", "n-değeri"],
    accent: "#3B82F6",
  },
  {
    id: 2,
    slug: "darbe-testi",
    title: "Darbe Testi",
    titleEn: "Charpy Impact Test",
    icon: "⚡",
    standards: ["ISO 148-1", "ASTM E23"],
    summary: "Kırılma geçiş sıcaklığı (DBTT), üst plato enerjisi ve kırık yüzeyi analizi. Tane boyutu ve mikroalaşım elementi etkisi.",
    tags: ["DBTT", "USE", "% Shear", "CVN"],
    accent: "#F97316",
  },
  {
    id: 3,
    slug: "sertlik-olcumu",
    title: "Sertlik Ölçümü",
    titleEn: "Hardness Testing",
    icon: "◈",
    standards: ["ASTM E10", "ASTM E18", "ASTM E92", "ISO 18265"],
    summary: "Vickers, Brinell ve Rockwell yöntemleri. UTS–sertlik korelasyonu, HAZ haritalama ve dönüşüm tabloları.",
    tags: ["HV", "HBW", "HRC", "HV0.1"],
    accent: "#94A3B8",
  },
  {
    id: 4,
    slug: "katlama-egme-testi",
    title: "Katlama / Eğme Testi",
    titleEn: "Bend Test",
    icon: "⌒",
    standards: ["EN ISO 7438", "ASTM E290"],
    summary: "Kılavuzlu eğme, mandrel çapı/kalınlık oranı seçimi ve yüzey çatlak değerlendirmesi. Kaynak yeterliliği uygulamaları.",
    tags: ["d/t Oranı", "180°", "ASME IX"],
    accent: "#10B981",
  },
  {
    id: 5,
    slug: "dwtt",
    title: "DWTT Testi",
    titleEn: "Drop Weight Tear Test",
    icon: "▼",
    standards: ["API 5L Annex G", "ASTM E436"],
    summary: "Boru hattı çeliklerinde kırılma yayılımı kontrolü. ≥%85 kesme yüzeyi kriteri, tasarım sıcaklığı ve çentik geometrisi etkisi.",
    tags: ["% Shear Area", "SAT", "Pipeline", "X65/X70"],
    accent: "#EF4444",
  },
  {
    id: 6,
    slug: "basma-testi",
    title: "Basma Testi",
    titleEn: "Compression Test",
    icon: "⬛",
    standards: ["ASTM E9", "EN ISO 604"],
    summary: "Akma gerilmesi ölçümü, fıçılaşma düzeltmesi ve sürtünme etkisi. Hadde takviyesi için akış gerilmesi eğrileri.",
    tags: ["σ_flow", "Barreling", "Gleeble"],
    accent: "#A855F7",
  },
];

export default function MechanicalTestsPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#030712", color: "#f3f4f6" }}>
      {/* Hero */}
      <section style={{ borderBottom: "1px solid #1f2937", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <p style={{ color: "#60a5fa", fontSize: "12px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
            Mechanical Testing Guide
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "700", color: "#fff", marginBottom: "24px" }}>
            Mekanik Test <span style={{ color: "#60a5fa" }}>Rehberi</span>
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "18px", maxWidth: "672px", lineHeight: "1.7" }}>
            ASTM ve EN ISO standartları çerçevesinde altı temel mekanik test yönteminin
            metalürjik temelleri, numune geometrisi, test prosedürü ve sonuç yorumlaması.
          </p>
          <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["ASTM E8/E8M", "ISO 148-1", "ASTM E10/E18/E92", "API 5L Annex G", "EN ISO 7438"].map((std) => (
              <span key={std} style={{ fontSize: "11px", fontFamily: "monospace", border: "1px solid #374151", borderRadius: "4px", padding: "2px 8px", color: "#6b7280" }}>
                {std}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section style={{ maxWidth: "1152px", margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/mechanical-tests/${test.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                backgroundColor: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "16px",
                padding: "24px",
                transition: "border-color 0.2s",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "28px", color: test.accent }}>{test.icon}</span>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4b5563" }}>
                    {String(test.id).padStart(2, "0")}
                  </span>
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>{test.title}</h2>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#6b7280", marginBottom: "12px" }}>{test.titleEn}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                  {test.standards.map((std) => (
                    <span key={std} style={{
                      fontSize: "10px", fontFamily: "monospace",
                      padding: "2px 8px", borderRadius: "4px",
                      border: `1px solid ${test.accent}40`,
                      color: test.accent,
                      backgroundColor: `${test.accent}10`,
                    }}>{std}</span>
                  ))}
                </div>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>{test.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {test.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace" }}>#{tag}</span>
                  ))}
                </div>
                <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#4b5563" }}>Detaylı incele →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ borderTop: "1px solid #1f2937", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#4b5563", fontFamily: "monospace" }}>
          Tüm içerikler ücretsiz erişime açıktır · MetallurgyTools
        </p>
      </section>
    </main>
  );
}
