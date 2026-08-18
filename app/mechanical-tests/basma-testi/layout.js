import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, techArticleLd } from "@/lib/seo";

const PATH = "/mechanical-tests/basma-testi";

export const metadata = buildMetadata({
  titleTR: "Basma Testi Rehberi — ASTM E9 / DIN 50106",
  titleEN: "Compression Test Guide — ASTM E9 / DIN 50106",
  descTR:
    "Metalik malzemelerde basma testi: ASTM E9 numune tipleri ve L/D oranı, burkulma ve narinlik sınırı, Siebel sürtünme düzeltmesi, Rastegaev numune geometrisi, halka basma testiyle sürtünme faktörü ölçümü, akış gerilmesi ve Zener–Hollomon parametresi, sıcak basma ile hadde yükü hesabı.",
  descEN:
    "Compression testing of metallic materials: ASTM E9 specimen types and L/D ratio, buckling and slenderness limits, Siebel friction correction, Rastegaev specimen geometry, friction factor measurement by ring compression, flow stress and the Zener–Hollomon parameter, hot compression for rolling load calculation.",
  path: PATH,
  ogType: "article",
  keywords: [
    "basma testi", "compression test", "ASTM E9", "DIN 50106",
    "basma akma dayanımı", "compressive yield strength", "Rp0,2c",
    "akış eğrisi", "flow stress", "fıçılaşma", "barreling",
    "Siebel sürtünme düzeltmesi", "friction correction", "Rastegaev numunesi",
    "halka basma testi", "ring compression test", "sürtünme faktörü",
    "burkulma", "buckling", "L/D oranı", "narinlik",
    "Zener-Hollomon", "sıcak basma", "hot compression",
    "haddeleme simülasyonu", "rolling simulation", "Gleeble",
    "Bauschinger etkisi", "ISO 7500-1", "ASTM E83",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          techArticleLd({
            headline: "Basma Testi Rehberi — Compression Test Guide (ASTM E9 / DIN 50106)",
            path: PATH,
            description:
              "ASTM E9 numune tipleri, burkulma sınırı, Siebel sürtünme düzeltmesi, halka basma testi ve sıcak basma ile hadde yükü hesabı.",
            keywords: [
              "basma testi", "compression test", "ASTM E9", "DIN 50106",
              "flow stress", "fıçılaşma", "halka basma testi", "Zener-Hollomon",
            ],
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
