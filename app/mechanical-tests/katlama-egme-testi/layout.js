import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, techArticleLd } from "@/lib/seo";

const PATH = "/mechanical-tests/katlama-egme-testi";

export const metadata = buildMetadata({
  titleTR: "Katlama / Eğme Testi Rehberi",
  titleEN: "Bend Test Guide (EN ISO 7438, ASTM E290)",
  descTR:
    "Eğme testi prosedürü: mandrel çapı seçimi, eğme açısı, yüzey çatlak değerlendirme kriterleri, kaynak kalifikasyonunda yan/kök/yüz eğme uygulamaları ve süneklik değerlendirmesi.",
  descEN:
    "Bend test procedure: mandrel diameter selection, bend angle, surface crack acceptance criteria, side/root/face bend applications in weld qualification and ductility assessment.",
  path: PATH,
  ogType: "article",
  keywords: [
    "katlama testi", "eğme testi", "bend test", "EN ISO 7438", "ASTM E290",
    "mandrel çapı", "mandrel diameter", "kaynak eğme testi", "weld bend test",
    "yan eğme", "kök eğme", "side bend", "root bend", "süneklik testi",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Katlama / Eğme Testi Rehberi — Bend Test Guide (EN ISO 7438, ASTM E290)",
            path: PATH,
            description:
              "Mandrel çapı seçimi, eğme açısı ve kaynak kalifikasyonu eğme uygulamaları.",
            keywords: ["eğme testi", "bend test", "ISO 7438", "ASTM E290"],
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Mekanik Testler", path: "/mechanical-tests" },
            { name: "Katlama / Eğme Testi", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
