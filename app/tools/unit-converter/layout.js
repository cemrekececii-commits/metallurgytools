import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, webAppLd } from "@/lib/seo";

const PATH = "/tools/unit-converter";

export const metadata = buildMetadata({
  titleTR: "Mühendislik Birim Çevirici",
  titleEN: "Engineering Unit Converter (MPa-ksi, J-ft·lb, °C-°F)",
  descTR:
    "Metalurji ve malzeme mühendisliği için birim çevirici: gerilme (MPa-ksi-N/mm²), enerji (J-ft·lb), sıcaklık (°C-°F-K), basınç, tokluk (MPa√m-ksi√in) ve sertlik skalaları.",
  descEN:
    "Unit converter for metallurgy and materials engineering: stress (MPa-ksi-N/mm²), energy (J-ft·lb), temperature (°C-°F-K), pressure, fracture toughness (MPa√m-ksi√in) and hardness scales.",
  path: PATH,
  keywords: [
    "birim çevirici", "unit converter", "MPa ksi dönüşüm", "MPa to ksi",
    "joule ft-lb", "J to ft lb", "celsius fahrenheit", "MPa√m ksi√in",
    "mühendislik birimleri", "engineering units", "stress conversion",
    "basınç dönüşümü", "pressure conversion",
  ],
});

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          webAppLd({
            name: "Mühendislik Birim Çevirici — Engineering Unit Converter",
            path: PATH,
            description:
              "Gerilme, enerji, sıcaklık, basınç ve tokluk birimleri için çevirici. Converter for stress, energy, temperature, pressure and toughness units.",
            subCategory: "Engineering Utilities",
          }),
          breadcrumbLd([
            { name: "Ana Sayfa", path: "" },
            { name: "Araçlar", path: "/tools" },
            { name: "Birim Çevirici", path: PATH },
          ]),
        ]}
      />
      {children}
    </>
  );
}
