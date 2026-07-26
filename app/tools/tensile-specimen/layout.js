import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/tensile-specimen";

export const metadata = buildMetadata({
  titleTR: "Çekme Numunesi L₀ Hesaplayıcı",
  titleEN: "Tensile Specimen L₀ Calculator (EN ISO 6892-1, ASTM E8)",
  descTR:
    "Yuvarlak ve yassı çekme numuneleri için ölçü uzunluğu L₀ (k=5,65√S₀), paralel uzunluk Lc ve toplam numune boyu hesabı. EN ISO 6892-1 ve ASTM E8/E8M oransal/oransız numune tasarımı.",
  descEN:
    "Gauge length L₀ (k=5.65√S₀), parallel length Lc and total specimen length for round and flat tensile specimens per EN ISO 6892-1 and ASTM E8/E8M, proportional and non-proportional designs.",
  path: PATH,
  keywords: [
    "çekme numunesi", "tensile specimen", "gauge length", "ölçü uzunluğu",
    "L0 hesabı", "Lo calculation", "EN ISO 6892-1", "ASTM E8",
    "paralel uzunluk Lc", "proportional specimen", "5.65 S0",
    "numune tasarımı", "specimen machining",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "Çekme Numunesi L₀ Hesaplayıcı — Tensile Specimen Calculator",
            path: PATH,
            description:
              "EN ISO 6892-1 ve ASTM E8/E8M'e göre ölçü uzunluğu, paralel uzunluk ve toplam numune boyu hesabı. Gauge length and specimen dimensioning tool.",
            subCategory: "Mechanical Testing",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "Çekme Numunesi L₀", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
