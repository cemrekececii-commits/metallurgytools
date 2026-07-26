import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, techArticleLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/mechanical-tests/dwtt";

export const metadata = buildMetadata({
  titleTR: "DWTT Rehberi — Drop-Weight Tear Test",
  titleEN: "DWTT Guide (API 5L Annex G, ASTM E436)",
  descTR:
    "Drop-Weight Tear Test: %85 kesme alanı kriteri, pres çentik hazırlığı, kırılma yüzeyi değerlendirmesi, separasyonlar, inverse fracture ve boru hattı çatlak durdurma tasarımındaki rolü. X65/X70/X80 uygulamaları.",
  descEN:
    "Drop-Weight Tear Test: 85% shear area criterion, pressed-notch preparation, fracture surface rating, separations, inverse fracture and its role in pipeline crack-arrest design for X65/X70/X80.",
  path: PATH,
  ogType: "article",
  keywords: [
    "DWTT", "drop weight tear test", "API 5L Annex G", "ASTM E436",
    "shear area", "kesme alanı", "%85 kriteri", "pres çentik",
    "pipeline crack arrest", "çatlak durdurma", "X70 DWTT", "X80 DWTT",
    "inverse fracture", "separasyon", "delaminasyon",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "DWTT Rehberi — Drop-Weight Tear Test Guide (API 5L Annex G, ASTM E436)",
            path: PATH,
            description:
              "%85 kesme alanı kriteri, kırılma yüzeyi değerlendirmesi, separasyonlar ve inverse fracture.",
            keywords: ["DWTT", "API 5L", "ASTM E436", "shear area", "pipeline"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "DWTT", path: PATH },
          ]),
          faqPageLd(FAQ.dwttGuide),
        ]}
      />
      {children}
      <FaqSection items={FAQ.dwttGuide} />
    </>
  );
}
