import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, techArticleLd } from "@/lib/seo";

const PATH = "/mechanical-tests/basma-testi";

export const metadata = buildMetadata({
  titleTR: "Basma Testi Rehberi",
  titleEN: "Compression Test Guide (ASTM E9)",
  descTR:
    "Basma testi: akış eğrisi ölçümü, fıçılaşma (barreling) düzeltmesi, sürtünme etkileri, boy/çap oranı seçimi ve sıcak haddeleme simülasyonunda basma testinin kullanımı.",
  descEN:
    "Compression testing: flow curve measurement, barreling correction, friction effects, height-to-diameter ratio selection and use of compression tests in hot rolling simulation.",
  path: PATH,
  ogType: "article",
  keywords: [
    "basma testi", "compression test", "ASTM E9", "akış eğrisi", "flow stress",
    "fıçılaşma", "barreling", "sürtünme düzeltmesi", "hot compression",
    "haddeleme simülasyonu", "rolling simulation", "Gleeble",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Basma Testi Rehberi — Compression Test Guide (ASTM E9)",
            path: PATH,
            description:
              "Akış eğrisi ölçümü, fıçılaşma düzeltmesi ve haddeleme simülasyonu uygulamaları.",
            keywords: ["basma testi", "compression test", "ASTM E9", "flow stress"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "Basma Testi", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
