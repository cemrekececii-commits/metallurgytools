import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, techArticleLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/mechanical-tests/darbe-testi";

export const metadata = buildMetadata({
  titleTR: "Charpy Darbe Testi Rehberi",
  titleEN: "Charpy Impact Test Guide (ISO 148-1, ASTM E23)",
  descTR:
    "Charpy V-çentik darbe testi: DBTT belirleme, alt/üst raf enerjileri, kırılma yüzeyi (klivaj-sünek) değerlendirmesi, alt boy numune ölçekleme ve EN 10025 kalite ekleri (JR, J0, J2, K2).",
  descEN:
    "Charpy V-notch impact testing: DBTT determination, shelf energies, fracture surface (cleavage vs ductile) rating, subsize specimen scaling and EN 10025 quality suffixes (JR, J0, J2, K2).",
  path: PATH,
  ogType: "article",
  keywords: [
    "Charpy darbe testi", "Charpy impact test", "ISO 148-1", "ASTM E23",
    "DBTT", "geçiş sıcaklığı", "transition temperature", "27J",
    "S355J2 darbe", "kırılma yüzeyi", "shear fracture appearance",
    "alt boy numune", "subsize specimen", "üst raf enerjisi", "upper shelf energy",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Charpy Darbe Testi Rehberi — Charpy Impact Test Guide (ISO 148-1, ASTM E23)",
            path: PATH,
            description:
              "DBTT belirleme, raf enerjileri, kırılma yüzeyi değerlendirmesi ve alt boy numune ölçekleme.",
            keywords: ["Charpy", "darbe testi", "impact test", "ISO 148-1", "ASTM E23", "DBTT"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "Darbe Testi", path: PATH },
          ]),
          faqPageLd(FAQ.darbeTesti),
        ]}
      />
      {children}
      <FaqSection items={FAQ.darbeTesti} />
    </>
  );
}
