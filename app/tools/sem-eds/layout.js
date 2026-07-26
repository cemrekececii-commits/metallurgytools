import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/sem-eds";

export const metadata = buildMetadata({
  titleTR: "SEM-EDS Analiz Aracı — Pik Çakışması ve Spektrum Yorumlama",
  titleEN: "SEM-EDS Analysis Tool: Peak Overlap & Spectrum Interpretation",
  descTR:
    "Çelik mikroyapı ve inklüzyon analizinde SEM-EDS spektrum yorumlama: pik çakışması kontrolü (S Kα/Mo Lα, Mn Kα/Cr Kβ, Ti Kα/Ba Lα), kantitatif analiz güvenilirliği, artefakt farkındalığı ve metalurjik değerlendirme.",
  descEN:
    "SEM-EDS spectrum interpretation for steel microstructures and inclusions: peak overlap checks (S Kα/Mo Lα, Mn Kα/Cr Kβ, Ti Kα/Ba Lα), quantitative reliability, artefact awareness and metallurgical assessment.",
  path: PATH,
  keywords: [
    "SEM-EDS", "EDS analizi", "pik çakışması", "peak overlap",
    "EDS spectrum interpretation", "inklüzyon EDS", "inclusion EDS analysis",
    "S Ka Mo La overlap", "Mn Cr overlap", "kantitatif EDS",
    "mikroyapı karakterizasyonu", "fraktografi", "failure analysis SEM",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "SEM-EDS Analiz Aracı — SEM-EDS Analysis Tool",
            path: PATH,
            description:
              "SEM-EDS spektrum çakışma analizi ve metalurjik yorumlama. SEM-EDS peak overlap analysis and metallurgical interpretation.",
            subCategory: "Microanalysis / Characterization",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "SEM-EDS Analizi", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
