import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/ultrasonic";

export const metadata = buildMetadata({
  titleTR: "UT Simülatörü — Ultrasonik Muayene Eğitim Aracı",
  titleEN: "Ultrasonic Testing (UT) Simulator for NDT Training",
  descTR:
    "İnteraktif ultrasonik muayene simülatörü: A-scan, puls-eko, açılı prob kalibrasyonu (K1/K2 blokları), hata tespit blokları ve DGS/DAC değerlendirme mantığı. NDT Seviye 1-3 eğitimi için.",
  descEN:
    "Interactive ultrasonic testing simulator: A-scan, pulse-echo, angle-beam probe calibration on K1/K2 blocks, flaw detection blocks and DGS/DAC evaluation logic for NDT Level 1-3 training.",
  path: PATH,
  keywords: [
    "ultrasonik muayene", "ultrasonic testing", "UT simülatör", "UT simulator",
    "A-scan", "pulse echo", "açılı prob", "angle beam probe",
    "K1 K2 kalibrasyon bloğu", "calibration block", "NDT eğitimi", "NDT training",
    "DAC eğrisi", "DGS", "tahribatsız muayene",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "UT Simülatörü — Ultrasonic Testing Simulator",
            path: PATH,
            description:
              "A-scan, puls-eko ve açılı prob kalibrasyonu için interaktif NDT eğitim simülatörü. Interactive NDT training simulator.",
            subCategory: "Non-Destructive Testing",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "UT Simülatörü", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
