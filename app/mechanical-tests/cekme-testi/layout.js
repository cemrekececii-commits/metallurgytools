import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, techArticleLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/mechanical-tests/cekme-testi";

export const metadata = buildMetadata({
  titleTR: "Çekme Testi Rehberi",
  titleEN: "Tensile Test Guide (ASTM E8, EN ISO 6892-1)",
  descTR:
    "Çekme testi prosedürü: ReH/Rp0.2 ayrımı, mühendislik-gerçek gerilme dönüşümü, n ve r değerleri, Lüders bantları, A50/A5 uzama dönüşümü (ISO 2566) ve çelik kalitelerine göre uygulama.",
  descEN:
    "Tensile testing procedure: ReH vs Rp0.2, engineering-true stress conversion, n and r values, Lüders bands, A50/A5 elongation conversion (ISO 2566) and steel grade applications.",
  path: PATH,
  ogType: "article",
  keywords: [
    "çekme testi", "tensile test", "ASTM E8", "EN ISO 6892-1",
    "ReH Rp0.2", "akma dayanımı", "yield strength", "çekme mukavemeti",
    "n değeri", "r değeri", "Lüders bandı", "uzama dönüşümü",
    "A50 A5", "ISO 2566", "gerçek gerilme", "true stress",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Çekme Testi Rehberi — Tensile Test Guide (ASTM E8, EN ISO 6892-1)",
            path: PATH,
            description:
              "ReH/Rp0.2, mühendislik-gerçek gerilme dönüşümü, n ve r değerleri, Lüders bantları ve uzama dönüşümleri.",
            keywords: ["çekme testi", "tensile test", "ASTM E8", "ISO 6892-1", "ReH", "Rp0.2"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "Çekme Testi", path: PATH },
          ]),
          faqPageLd(FAQ.cekmeTesti),
        ]}
      />
      {children}
      <FaqSection items={FAQ.cekmeTesti} />
    </>
  );
}
