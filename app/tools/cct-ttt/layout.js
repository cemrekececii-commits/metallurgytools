import JsonLd from "@/components/JsonLd";
import FaqSection from "@/components/FaqSection";
import { buildMetadata, breadcrumbLd, webAppLd, faqPageLd } from "@/lib/seo";
import { FAQ } from "@/lib/seoFaqData";

const PATH = "/tools/cct-ttt";

export const metadata = buildMetadata({
  titleTR: "CCT/TTT Diyagram Yorumlayıcı",
  titleEN: "CCT/TTT Diagram Interpreter (Ms, Ae3, t8/5)",
  descTR:
    "Bileşime dayalı kritik sıcaklıklar (Ae1, Ae3, Ms, Bs), faz fraksiyonu tahmini ve soğuma eğrisi analizi. Kaynak HAZ t8/5 değerlendirmesi, su verme ve normalizasyon senaryoları.",
  descEN:
    "Composition-based critical temperatures, phase fraction prediction and cooling curve analysis for steel heat treatment: CCT vs TTT, martensite/bainite formation, weld HAZ t8/5 assessment.",
  path: PATH,
  keywords: [
    "CCT diyagramı", "TTT diyagramı", "CCT diagram", "TTT diagram",
    "Ms sıcaklığı", "Ms temperature", "Ae3", "Bs bainite start",
    "t8/5 soğuma", "soğuma eğrisi", "cooling curve", "hardenability",
    "sertleşebilirlik", "martenzit dönüşümü", "beynit", "isothermal transformation",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "CCT/TTT Diyagram Yorumlayıcı — CCT/TTT Diagram Interpreter",
            path: PATH,
            description:
              "Bileşime dayalı kritik sıcaklıklar, faz fraksiyonu tahmini ve soğuma eğrisi analizi. Composition-based critical temperatures and cooling curve analysis.",
            subCategory: "Heat Treatment / Phase Transformations",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "CCT/TTT Yorumlayıcı", path: PATH },
          ]),
          faqPageLd(FAQ.cctTtt),
        ]}
      />
      {children}
      <FaqSection items={FAQ.cctTtt} />
    </>
  );
}
