import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbLd } from "@/lib/seo";

const PATH = "/mechanical-tests";
const URL = `${SITE_URL}${PATH}`;

export const metadata = {
  title: "Mekanik Testler Rehberi — Mechanical Testing Guide",
  description:
    "Çekme, darbe (Charpy), sertlik, eğme, DWTT ve basma testleri için ASTM ve EN ISO standartlarına dayalı mühendislik rehberleri. Engineering guides on tensile, impact, hardness, bend, DWTT and compression testing under ASTM and EN ISO standards.",
  keywords: [
    "mekanik testler", "mechanical testing", "çekme testi", "tensile test",
    "darbe testi", "Charpy", "sertlik ölçümü", "hardness testing",
    "eğme testi", "bend test", "DWTT", "basma testi", "compression test",
    "ASTM E8", "ISO 6892", "ISO 148-1", "ASTM E436",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Mekanik Testler Rehberi — Mechanical Testing Guide",
    description:
      "Çekme, darbe, sertlik, eğme, DWTT ve basma testleri için standart bazlı mühendislik rehberleri.",
    url: URL,
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Mechanical Testing Guide" }],
  },
};

export default function Layout({ children }) {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Mekanik Testler", path: PATH },
        ])}
      />
      {children}
    </>
  );
}
