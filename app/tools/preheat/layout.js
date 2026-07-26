import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, webAppLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/tools/preheat";

export const metadata = buildMetadata({
  titleTR: "Kaynak Ön Isıtma Hesaplayıcı (EN 1011-2, AWS D1.1)",
  titleEN: "Weld Preheat Calculator",
  descTR:
    "EN 1011-2 Yöntem A/B ve AWS D1.1 Annex H'ye göre minimum ön ısıtma sıcaklığı: CET/CE(IIW), kombine kalınlık, hidrojen sınıfı (H5-H15) ve ısı girdisi ile soğuk çatlama (HACC) risk değerlendirmesi.",
  descEN:
    "Minimum preheat temperature per EN 1011-2 Method A/B and AWS D1.1 Annex H: CET/CE(IIW), combined thickness, hydrogen class and heat input based cold-cracking (HACC) assessment.",
  path: PATH,
  keywords: [
    "kaynak ön ısıtma", "weld preheat calculator", "EN 1011-2",
    "AWS D1.1 preheat", "CET", "CE IIW", "soğuk çatlama", "cold cracking",
    "HACC", "hidrojen çatlağı", "hydrogen cracking", "t8/5",
    "interpass sıcaklığı", "kombine kalınlık", "S355 preheat", "S690 preheat",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "Kaynak Ön Isıtma Hesaplayıcı — Weld Preheat Calculator",
            path: PATH,
            description:
              "EN 1011-2 ve AWS D1.1 bazlı minimum ön ısıtma sıcaklığı hesabı ve HACC risk değerlendirmesi. EN 1011-2 / AWS D1.1 preheat calculation.",
            subCategory: "Welding Engineering",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "Ön Isıtma Hesaplayıcı", path: PATH },
          ]),
          faqPageLd(FAQ.preheat),
        ]}
      />
      {children}
      <FaqSection items={FAQ.preheat} />
    </>
  );
}
