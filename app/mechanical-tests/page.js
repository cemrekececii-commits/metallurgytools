'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const TESTS_TR = [
  {
    id: 1, slug: "cekme-testi", icon: "↕",
    standards: ["ASTM E8/E8M", "EN ISO 6892-1"],
    title: "Çekme Testi",
    summary: "Akma dayanımı, çekme dayanımı, uzama ve kesit daralması belirlenir. Mühendislik–gerçek gerilme dönüşümü ve n, r değerleri.",
    tags: ["Rp0.2", "Rm", "A%", "Z%", "n-değeri"],
    accent: "#3B82F6",
  },
  {
    id: 2, slug: "darbe-testi", icon: "⚡",
    standards: ["ISO 148-1", "ASTM E23"],
    title: "Darbe Testi",
    summary: "Kırılma geçiş sıcaklığı (DBTT), üst plato enerjisi ve kırık yüzeyi analizi. Tane boyutu ve mikroalaşım elementi etkisi.",
    tags: ["DBTT", "USE", "% Shear", "CVN"],
    accent: "#F97316",
  },
  {
    id: 3, slug: "sertlik-olcumu", icon: "◈",
    standards: ["ASTM E10", "ASTM E18", "ASTM E92", "ISO 18265"],
    title: "Sertlik Ölçümü",
    summary: "Vickers, Brinell ve Rockwell yöntemleri. UTS–sertlik korelasyonu, HAZ haritalama ve dönüşüm tabloları.",
    tags: ["HV", "HBW", "HRC", "HV0.1"],
    accent: "#94A3B8",
  },
  {
    id: 4, slug: "katlama-egme-testi", icon: "⌒",
    standards: ["EN ISO 7438", "ASTM E290"],
    title: "Katlama / Eğme Testi",
    summary: "Kılavuzlu eğme, mandrel çapı/kalınlık oranı seçimi ve yüzey çatlak değerlendirmesi. Kaynak yeterliliği uygulamaları.",
    tags: ["d/t Oranı", "180°", "ASME IX"],
    accent: "#10B981",
  },
  {
    id: 5, slug: "dwtt", icon: "▼",
    standards: ["API 5L Annex G", "ASTM E436"],
    title: "DWTT Testi",
    summary: "Boru hattı çeliklerinde kırılma yayılımı kontrolü. ≥%85 kesme yüzeyi kriteri, tasarım sıcaklığı ve çentik geometrisi etkisi.",
    tags: ["% Shear Area", "SAT", "Pipeline", "X65/X70"],
    accent: "#EF4444",
  },
  {
    id: 6, slug: "basma-testi", icon: "⬛",
    standards: ["ASTM E9", "EN ISO 604"],
    title: "Basma Testi",
    summary: "Akma gerilmesi ölçümü, fıçılaşma düzeltmesi ve sürtünme etkisi. Hadde takviyesi için akış gerilmesi eğrileri.",
    tags: ["σ_flow", "Barreling", "Gleeble"],
    accent: "#A855F7",
  },
];

const TESTS_EN = [
  {
    id: 1, slug: "cekme-testi", icon: "↕",
    standards: ["ASTM E8/E8M", "EN ISO 6892-1"],
    title: "Tensile Test",
    summary: "Yield strength, tensile strength, elongation and reduction of area. Engineering–true stress conversion and n, r values.",
    tags: ["Rp0.2", "Rm", "A%", "Z%", "n-value"],
    accent: "#3B82F6",
  },
  {
    id: 2, slug: "darbe-testi", icon: "⚡",
    standards: ["ISO 148-1", "ASTM E23"],
    title: "Impact Test",
    summary: "Ductile-to-brittle transition temperature (DBTT), upper shelf energy and fracture surface analysis. Grain size and microalloying effects.",
    tags: ["DBTT", "USE", "% Shear", "CVN"],
    accent: "#F97316",
  },
  {
    id: 3, slug: "sertlik-olcumu", icon: "◈",
    standards: ["ASTM E10", "ASTM E18", "ASTM E92", "ISO 18265"],
    title: "Hardness Testing",
    summary: "Vickers, Brinell and Rockwell methods. UTS–hardness correlation, HAZ mapping and conversion tables.",
    tags: ["HV", "HBW", "HRC", "HV0.1"],
    accent: "#94A3B8",
  },
  {
    id: 4, slug: "katlama-egme-testi", icon: "⌒",
    standards: ["EN ISO 7438", "ASTM E290"],
    title: "Bend Test",
    summary: "Guided bend, mandrel diameter-to-thickness ratio selection and surface crack assessment. Weld qualification applications.",
    tags: ["d/t Ratio", "180°", "ASME IX"],
    accent: "#10B981",
  },
  {
    id: 5, slug: "dwtt", icon: "▼",
    standards: ["API 5L Annex G", "ASTM E436"],
    title: "DWTT Test",
    summary: "Fracture propagation control in pipeline steels. ≥85% shear area criterion, design temperature and notch geometry effects.",
    tags: ["% Shear Area", "SAT", "Pipeline", "X65/X70"],
    accent: "#EF4444",
  },
  {
    id: 6, slug: "basma-testi", icon: "⬛",
    standards: ["ASTM E9", "EN ISO 604"],
    title: "Compression Test",
    summary: "Flow stress measurement, barreling correction and friction effects. Flow stress curves for rolling mill analysis.",
    tags: ["σ_flow", "Barreling", "Gleeble"],
    accent: "#A855F7",
  },
];

export default function MechanicalTestsPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tests = lang === 'tr' ? TESTS_TR : TESTS_EN;

  const bg      = isDark ? "#030712" : "#f8fafc";
  const text     = isDark ? "#f3f4f6" : "#111827";
  const subText  = isDark ? "#9ca3af" : "#6b7280";
  const border   = isDark ? "#1f2937" : "#e5e7eb";
  const cardBg   = isDark ? "#111827" : "#ffffff";
  const tagColor = isDark ? "#4b5563" : "#9ca3af";
  const stdColor = isDark ? "#6b7280" : "#9ca3af";
  const accent   = "#60a5fa";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: bg, color: text, transition: "background .2s" }}>
      {/* Hero */}
      <section style={{ borderBottom: `1px solid ${border}`, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <p style={{ color: accent, fontSize: "12px", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
            {lang === 'tr' ? 'Mekanik Test Rehberi' : 'Mechanical Testing Guide'}
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "700", color: text, marginBottom: "24px" }}>
            {lang === 'tr'
              ? <>{`Mekanik Test `}<span style={{ color: accent }}>Rehberi</span></>
              : <>{`Mechanical Testing `}<span style={{ color: accent }}>Guide</span></>
            }
          </h1>
          <p style={{ color: subText, fontSize: "18px", maxWidth: "672px", lineHeight: "1.7" }}>
            {lang === 'tr'
              ? 'ASTM ve EN ISO standartları çerçevesinde altı temel mekanik test yönteminin metalürjik temelleri, numune geometrisi, test prosedürü ve sonuç yorumlaması.'
              : 'Metallurgical fundamentals, specimen geometry, test procedures and result interpretation for six core mechanical test methods under ASTM and EN ISO standards.'}
          </p>
          <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["ASTM E8/E8M", "ISO 148-1", "ASTM E10/E18/E92", "API 5L Annex G", "EN ISO 7438"].map((std) => (
              <span key={std} style={{ fontSize: "11px", fontFamily: "monospace", border: `1px solid ${border}`, borderRadius: "4px", padding: "2px 8px", color: stdColor }}>
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
            <Link key={test.id} href={`/mechanical-tests/${test.slug}`} style={{ textDecoration: "none" }}>
              <div style={{ backgroundColor: cardBg, border: `1px solid ${border}`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "28px", color: test.accent }}>{test.icon}</span>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", color: tagColor }}>{String(test.id).padStart(2, "0")}</span>
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: text, marginBottom: "4px" }}>{test.title}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                  {test.standards.map((std) => (
                    <span key={std} style={{ fontSize: "10px", fontFamily: "monospace", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${test.accent}40`, color: test.accent, backgroundColor: `${test.accent}10` }}>{std}</span>
                  ))}
                </div>
                <p style={{ color: subText, fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>{test.summary}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {test.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: "11px", color: tagColor, fontFamily: "monospace" }}>#{tag}</span>
                  ))}
                </div>
                <p style={{ fontSize: "12px", fontFamily: "monospace", color: tagColor }}>
                  {lang === 'tr' ? 'Detaylı incele →' : 'Read more →'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${border}`, padding: "32px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: tagColor, fontFamily: "monospace" }}>
          {lang === 'tr' ? 'Tüm içerikler ücretsiz erişime açıktır · MetallurgyTools' : 'All content is freely accessible · MetallurgyTools'}
        </p>
      </section>
    </main>
  );
}
