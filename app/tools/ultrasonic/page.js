"use client";
import Navbar from "@/components/Navbar";
import UTSimulator from "@/components/ultrasonic/UTSimulator";
import ToolBriefing from "@/components/ToolBriefing";
import { useLang } from "@/lib/LanguageContext";

export default function UltrasonicPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="pt-16">
        <UTSimulator lang={lang} />
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <ToolBriefing
            title={lang === "tr" ? "Nasıl Kullanılır?" : "How to Use"}
            steps={lang === "tr"
              ? [{ icon: "①", color: "#3b82f6", title: "Malzeme Seç", desc: "Sol panelden test malzemesini seç: çelik, alüminyum, bakır veya özel malzeme." },
                 { icon: "②", color: "#f59e0b", title: "Prob Tipini Belirle", desc: "Düz prob, açılı prob veya ikiz kristal prob tipini seç. Frekans ve çap ayarla." },
                 { icon: "③", color: "#8b5cf6", title: "Kalibrasyon Bloğu Seç", desc: "V1 (IIW), V2 veya özel kalibrasyon bloğunu seç." },
                 { icon: "④", color: "#06b6d4", title: "Tarama Parametrelerini Ayarla", desc: "Kazanç (dB), zaman tabanı, sıcaklık düzeltmesi ve gate ayarlarını yap." },
                 { icon: "⑤", color: "#10b981", title: "A-Scan Ekranını Oku", desc: "A-Scan sinyalini yorumla: kusur derinliği, mesafesi ve echo yüksekliği değerlendirilir." }]
              : [{ icon: "①", color: "#3b82f6", title: "Select Material", desc: "Choose test material from the left panel: steel, aluminum, copper or custom material." },
                 { icon: "②", color: "#f59e0b", title: "Set Probe Type", desc: "Select straight, angle or twin crystal probe type. Adjust frequency and diameter." },
                 { icon: "③", color: "#8b5cf6", title: "Select Calibration Block", desc: "Choose V1 (IIW), V2 or custom calibration block." },
                 { icon: "④", color: "#06b6d4", title: "Adjust Scan Parameters", desc: "Set gain (dB), time base, temperature correction and gate settings." },
                 { icon: "⑤", color: "#10b981", title: "Read A-Scan Display", desc: "Interpret A-Scan signal: flaw depth, distance and echo height are evaluated." }]
            }
            formulas={[{ label: "v = 2d/t", color: "#60a5fa" }, { label: "N = D²f/4v (Near Field)", color: "#34d399" }, { label: "sin θ₂/sin θ₁ = v₂/v₁ (Snell)", color: "#a78bfa" }]}
          />
        </div>
      </div>
    </div>
  );
}
