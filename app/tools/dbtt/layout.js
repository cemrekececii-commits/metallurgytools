import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/dbtt";

export const metadata = buildMetadata({
  titleTR: "DBTT Sünek-Gevrek Geçiş Sıcaklığı Tahmini",
  titleEN: "Ductile-Brittle Transition Temperature Calculator",
  descTR:
    "Bileşim ve ısıl işleme dayalı DBTT tahmini: Charpy V-çentik geçiş eğrisi, alt/üst raf enerjileri, tane boyutu ve mikroyapı etkisi. S355, API 5L, düşük sıcaklık uygulamaları.",
  descEN:
    "DBTT predictor for steel: Charpy V-notch transition curve, shelf energies, grain size and microstructure effects for S355, API 5L and low-temperature service.",
  path: PATH,
  keywords: [
    "DBTT", "sünek gevrek geçiş", "ductile brittle transition",
    "Charpy geçiş eğrisi", "transition temperature", "27J kriteri",
    "klivaj kırılma", "cleavage fracture", "düşük sıcaklık tokluğu",
    "S355J2", "API 5L toughness", "impact transition curve",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "DBTT Tahmin Motoru — DBTT Prediction Engine",
            path: PATH,
            description:
              "Bileşim ve mikroyapıya dayalı sünek-gevrek geçiş sıcaklığı tahmini. Composition and microstructure based DBTT prediction.",
            subCategory: "Impact Toughness",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "DBTT Motoru", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
