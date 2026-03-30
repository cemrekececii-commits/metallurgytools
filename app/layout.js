import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "MetallurgyTools – Uzman Metalurji Mühendislik Araçları",
  description:
    "18 yıllık entegre çelik tesisi deneyimi ve 50.000+ test verisiyle geliştirilmiş profesyonel metalurji hesaplama araçları. Çekme testi, Charpy, DWTT, sertlik, faz diyagramı.",
  keywords: [
    "metalurji", "metallurgy", "steel", "çelik", "mekanik test", "mechanical testing",
    "çekme testi", "tensile test", "Charpy", "darbe testi", "DWTT", "sertlik",
    "grain size", "tane boyutu", "ASTM E112", "corrosion", "korozyon",
    "phase diagram", "faz diyagramı", "Fe-C", "S700MC", "API 5L", "DP600",
  ],
  openGraph: {
    title: "MetallurgyTools – Uzman Metalurji Ekibi",
    description: "50.000+ test verisi ve 18 yıllık saha deneyimiyle geliştirilmiş metalurji araçları",
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
            <Footer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
