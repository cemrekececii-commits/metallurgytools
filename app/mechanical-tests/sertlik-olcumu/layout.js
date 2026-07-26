import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, techArticleLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/mechanical-tests/sertlik-olcumu";

export const metadata = buildMetadata({
  titleTR: "Sertlik Ölçümü Rehberi — Vickers, Brinell, Rockwell",
  titleEN: "Hardness Testing Guide (ISO 6506/6507/6508)",
  descTR:
    "Sertlik ölçüm yöntemleri: Vickers, Brinell (HBW), Rockwell prensipleri, yük seçimi, ISO 18265/ASTM E140 dönüşüm tabloları, UTS korelasyonu, HAZ sertlik haritalama (EN ISO 9015) ve sour servis limitleri.",
  descEN:
    "Hardness measurement methods: Vickers, Brinell (HBW), Rockwell principles, load selection, ISO 18265/ASTM E140 conversion tables, UTS correlation, HAZ hardness mapping (EN ISO 9015) and sour-service limits.",
  path: PATH,
  ogType: "article",
  keywords: [
    "sertlik ölçümü", "hardness testing", "Vickers", "Brinell", "Rockwell",
    "ISO 6507", "ISO 6506", "ISO 6508", "ASTM E140", "ISO 18265",
    "HV10", "HBW", "HRC", "sertlik dönüşümü", "HAZ sertlik",
    "22 HRC sour service", "250 HV NACE",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Sertlik Ölçümü Rehberi — Hardness Testing Guide (Vickers, Brinell, Rockwell)",
            path: PATH,
            description:
              "Sertlik ölçüm prensipleri, dönüşüm tabloları, UTS korelasyonu ve HAZ sertlik haritalama.",
            keywords: ["sertlik", "hardness", "Vickers", "Brinell", "Rockwell", "ASTM E140"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "Sertlik Ölçümü", path: PATH },
          ]),
          faqPageLd(FAQ.sertlikOlcumu),
        ]}
      />
      {children}
      <FaqSection items={FAQ.sertlikOlcumu} />
    </>
  );
}
