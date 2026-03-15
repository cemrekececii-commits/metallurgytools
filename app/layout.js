import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "MetallurgyTools — AI-Powered Metallurgical Engineering Tools",
  description:
    "Professional-grade computational tools for steel metallurgy. Grain size analysis, corrosion assessment, phase diagram simulation.",
  keywords: [
    "metallurgy",
    "steel",
    "grain size",
    "ASTM E112",
    "corrosion",
    "phase diagram",
    "Fe-C",
    "engineering tools",
  ],
  openGraph: {
    title: "MetallurgyTools",
    description: "AI-Powered Metallurgical Engineering Tools",
    url: "https://metallurgytools.com",
    siteName: "MetallurgyTools",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
