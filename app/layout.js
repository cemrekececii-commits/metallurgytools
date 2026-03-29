import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "MetallurgyTools – Yapay Zeka Destekli Metalurji Mühendislik Araçları",
  description:
    "Çelik metalurjisi için profesyonel hesaplama araçları. Tane boyutu analizi, korozyon değerlendirmesi, faz diyagramı simülasyonu.",
  keywords: [
    "metalurji", "metallurgy", "steel", "çelik", "grain size", "tane boyutu",
    "ASTM E112", "corrosion", "korozyon", "phase diagram", "faz diyagramı",
    "Fe-C", "hardness", "sertlik", "engineering tools",
  ],
  openGraph: {
    title: "MetallurgyTools",
    description: "Yapay Zeka Destekli Metalurji Mühendislik Araçları",
    url: "https://metallurgytools.com",
    siteName: "MetallurgyTools",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <body>
          <LanguageProvider>
            <Navbar />
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
