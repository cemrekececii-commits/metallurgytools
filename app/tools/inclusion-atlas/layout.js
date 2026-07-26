import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/inclusion-atlas";

export const metadata = buildMetadata({
  titleTR: "İnklüzyon Atlası — Çelikte Metalik Olmayan İnklüzyonlar",
  titleEN: "Inclusion Atlas: Non-Metallic Inclusions in Steel",
  descTR:
    "MnS, Al₂O₃, TiN, kalsiyum alüminat, silikat, Nb(C,N) ve spinel (MgO·Al₂O₃) inklüzyonları: morfoloji, SEM-EDS karakterizasyonu, ASTM E45 sınıflandırması, oluşum mekanizmaları ve sekonder metalurji düzeltici aksiyonları.",
  descEN:
    "Reference atlas for MnS, Al₂O₃, TiN, calcium aluminates, silicates, Nb(C,N) and spinel inclusions: morphology, EDS signatures, ASTM E45 / ISO 4967 classification, formation mechanisms and corrective actions in secondary metallurgy.",
  path: PATH,
  keywords: [
    "inklüzyon atlası", "inclusion atlas", "non-metallic inclusions",
    "MnS morfolojisi", "Al2O3 inclusion", "TiN inclusion", "kalsiyum alüminat",
    "calcium aluminate", "spinel MgO Al2O3", "silikat inklüzyon",
    "ASTM E45", "ISO 4967", "SEM-EDS inclusion analysis", "çelik temizliği",
    "steel cleanliness", "inclusion engineering", "Ca treatment",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "İnklüzyon Atlası — Inclusion Atlas",
            path: PATH,
            description:
              "Çelikte metalik olmayan inklüzyonların morfoloji, EDS ve proses kaynağı referans atlası. Reference atlas of non-metallic inclusions in steel.",
            subCategory: "Metallography / Steel Cleanliness",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "İnklüzyon Atlası", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
