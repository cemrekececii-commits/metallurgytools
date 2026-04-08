"use client";
import Navbar from "@/components/Navbar";
import UTSimulator from "@/components/ultrasonic/UTSimulator";
import { useLang } from "@/lib/LanguageContext";

export default function UltrasonicPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="pt-16">
        <UTSimulator lang={lang} />
      </div>
    </div>
  );
}
