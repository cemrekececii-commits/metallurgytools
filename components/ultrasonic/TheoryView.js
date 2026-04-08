"use client";
import { useState } from "react";

export default function TheoryView({ lang }) {
  const isTr = lang === "tr";
  const [openSection, setOpenSection] = useState(0);

  const sections = [
    {
      title: isTr ? "1. Ultrasonik Muayenenin Temelleri" : "1. Fundamentals of Ultrasonic Testing",
      icon: "〜",
      content: isTr ? [
        { h: "Ultrasonik Dalga Nedir?", p: "Ultrasonik muayenede (UT) kullanılan sesüstü dalgalar, 20 kHz ile 25 MHz frekans aralığında mekanik titreşimlerdir. Endüstriyel uygulamalarda genellikle 1–10 MHz kullanılır. Bu dalgalar madde içinde katı partiküllerin elastik titreşimi yoluyla yayılır ve katı, sıvı ortamlarda iletilir; gazlarda ise empedans uyumsuzluğu nedeniyle zayıf iletilir." },
        { h: "Dalga Modları", p: "Boyuna (Longitudinal/L) dalgalar: Parçacık hareketi dalga yayılma yönüne paralel olup çelikte ~5920 m/s hızla ilerler. Enine (Transvers/T) dalgalar: Parçacık hareketi yayılma yönüne dik olup çelikte ~3240 m/s hızla ilerler ve açılı problarla oluşturulur. Yüzey (Rayleigh) dalgaları: Yalnızca yüzey yakınında yayılır." },
        { h: "Frekans ve Dalga Boyu İlişkisi", p: "λ = v / f formülüyle hesaplanan dalga boyu, tespit edilebilecek minimum kusur boyutunu belirler (teorik alt sınır ≈ λ/2). Yüksek frekans → kısa dalga boyu → ince kusurları tespit → ancak zayıflama artar. Düşük frekans → daha derin nüfuziyet → çözünürlük azalır." },
      ] : [
        { h: "What is an Ultrasonic Wave?", p: "Ultrasonic waves used in UT are mechanical vibrations in the frequency range of 20 kHz to 25 MHz. Industrial applications typically use 1–10 MHz. These waves propagate through materials via elastic vibration of particles, transmitting well through solids and liquids, but poorly through gases due to acoustic impedance mismatch." },
        { h: "Wave Modes", p: "Longitudinal (L) waves: Particle motion is parallel to the direction of wave propagation; velocity in steel ≈5920 m/s. Transverse/Shear (T) waves: Particle motion is perpendicular to propagation direction; velocity in steel ≈3240 m/s — generated using angle probes via mode conversion at an interface. Surface (Rayleigh) waves propagate only near the surface." },
        { h: "Frequency and Wavelength", p: "Wavelength λ = v / f determines the minimum detectable flaw size (theoretical lower limit ≈ λ/2). Higher frequency → shorter wavelength → detects finer flaws → increased attenuation. Lower frequency → deeper penetration → reduced resolution." },
      ],
    },
    {
      title: isTr ? "2. Darbe-Yankı Tekniği (Pulse-Echo)" : "2. Pulse-Echo Technique",
      icon: "↕",
      content: isTr ? [
        { h: "Çalışma Prensibi", p: "Prob bir kısa ultrasonik darbe gönderir ve geri dönen yankıları (echo) dinler. Başlangıç darbesi (initial pulse / transmitter bang), arka yüzey yankısı (backwall echo) ve kusur yankıları (flaw echo) A-tarama ekranında görüntülenir. Ses yolu (SA): SA = (v × t) / 2 formülüyle hesaplanır." },
        { h: "Çift Kristal Prob (Dual Element)", p: "Ayrı verici ve alıcı kristallerden oluşur. Ölü bölge (dead zone) azalır, yüzeye yakın kusurlar daha iyi tespit edilir. Düz prob (0°) ile boyuna dalgalar gönderilir ve kalınlık ölçümünde kullanılır." },
        { h: "Açılı Prob (Angle Beam)", p: "Perspeksden yapılan takoz (wedge) sayesinde ses demeti, Snell yasasına göre kırılarak malzemeye girer ve enine dalgaya dönüşür. 45°, 60°, 70° yaygın kullanılan açılardır. Kaynak dikişi, boru ve yapısal parçaların muayenesinde tercih edilir." },
      ] : [
        { h: "Operating Principle", p: "The probe transmits a short ultrasonic pulse and listens for returning echoes. The initial pulse (transmitter bang), backwall echo, and flaw echoes are displayed on the A-scan. Sound path (SA) is calculated as: SA = (v × t) / 2." },
        { h: "Dual Element Probe", p: "Consists of separate transmitter and receiver crystals. Reduces the dead zone for better near-surface flaw detection. Straight (0°) probes transmit longitudinal waves and are used for thickness measurement." },
        { h: "Angle Beam Probe", p: "An acrylic wedge refracts the sound beam into the material according to Snell's Law, converting it to a shear wave. Common angles are 45°, 60°, and 70°. Preferred for weld inspection, pipe, and structural component examination." },
      ],
    },
    {
      title: isTr ? "3. Kalibrasyon Blokları" : "3. Calibration Blocks",
      icon: "▣",
      content: isTr ? [
        { h: "K1 (V1) Bloğu", p: "ISO 2400 standardına göre üretilen K1 bloğu, 100 mm yarıçaplı dairesel yüzey ve çeşitli delikler içerir. Açılı prob kalibrasyonunda kullanılır: Yarım daire (R100) yüzeyine prob yerleştirilerek ses demetinin merkezi doğrulanır. Çelik için vT = 3240 m/s standardı bu blok üzerinde ayarlanır. Prob indeksi (exit point) ve açı doğrulaması yapılır." },
        { h: "K2 (V2) Bloğu", p: "EN 12223 standardına göre R25 ve R50 mm'lik iki dairesel yüzey içerir. Açılı probların hassas kalibrasyonu için kullanılır. R25: 1/2 V yolu kalibrasyonu. R50: Tam V yolu kalibrasyonu. Bu blok özellikle kaynak muayenesi için DAC eğrisi oluşturmada kritik rol oynar." },
        { h: "Hata Tespit Bloğu (Reference Block)", p: "Özel boyutlarda üretilen referans blokları düz tabanlı delikler (FBH - Flat Bottom Hole) veya yan delme delikleri (SDH - Side Drilled Hole) içerir. Amplitüd kalibrasyonu ve DAC eğrisi oluşturmada kullanılır. EN 10160, ASME V veya proje özelinde belirlenen delik boyutları referans alınır." },
      ] : [
        { h: "K1 (V1) Block", p: "Manufactured per ISO 2400, the K1 block features a 100 mm radius curved surface and various machined holes. Used for angle probe calibration: the probe is positioned on the semi-circular (R100) surface to verify the beam center. Steel shear velocity vT = 3240 m/s is set using this block. Probe index (exit point) and angle verification are performed." },
        { h: "K2 (V2) Block", p: "Per EN 12223, contains two curved surfaces of R25 and R50 mm. Used for precise calibration of angle probes. R25: half-V path calibration. R50: full-V path calibration. This block is critical for generating DAC curves in weld inspection." },
        { h: "Reference (Flaw Detection) Block", p: "Custom reference blocks contain flat-bottom holes (FBH) or side-drilled holes (SDH). Used for amplitude calibration and DAC curve construction. SDH diameters are specified per EN 10160, ASME V, or project-specific requirements." },
      ],
    },
    {
      title: isTr ? "4. A-Tarama Yorumlama" : "4. A-Scan Interpretation",
      icon: "📈",
      content: isTr ? [
        { h: "A-Tarama Görüntüsü", p: "Yatay eksen ses yolunu (mesafe/zaman), dikey eksen yansıyan dalganın genliğini (%) gösterir. Ekranın solunda başlangıç darbesi (T-darbe), sağ tarafta arka yüzey yankısı (BWE) yer alır. Kusur yankısı bu ikisi arasında görülür." },
        { h: "Kazanç (Gain)", p: "Kazanç (dB), alınan sinyalin elektronik olarak güçlendirilmesidir. Her 6 dB kazanç artışı genliği 2 katına çıkarır. Referans amplitüdü %80 FSH'ye (Full Screen Height) ayarlama standardı yaygındır. Aşırı kazanç elektriksel gürültüyü de yükseltir." },
        { h: "Kapı (Gate) Kullanımı", p: "Kapı, belirli bir mesafe-amplitüd bölgesini izlemek için kullanılan eşik seviyesidir. Gate A genellikle flaw detection için kullanılır. Kapı eşiğini geçen ilk yankı, dijital UT cihazlarında alarm verir ve SA, PA, RA değerlerini otomatik hesaplar." },
        { h: "Kusur Konumlandırma (PA ve RA)", p: "Açılı prob muayenesinde: PA (Projection A / Surface Distance) = SA × sin(θ). RA (Range A / Depth) = SA × cos(θ). Leg sayısı (bounce): Ses demeti arka yüzeyden her sektiğinde leg artar. Gerçek derinlik ve yüzey mesafesi leg'e göre hesaplanır." },
      ] : [
        { h: "A-Scan Display", p: "The horizontal axis represents sound path (distance/time); the vertical axis represents amplitude (%) of reflected signal. The initial pulse (T-bang) is at the left, the backwall echo (BWE) at the right, and flaw echoes appear between them." },
        { h: "Gain", p: "Gain (dB) is electronic amplification of received signals. Each 6 dB increase doubles the amplitude. Setting reference amplitude to 80% FSH (Full Screen Height) is a common standard. Excessive gain also amplifies electrical noise." },
        { h: "Gate Usage", p: "A gate monitors a specific distance-amplitude zone with a threshold level. Gate A is typically used for flaw detection. The first echo exceeding the gate threshold triggers an alarm in digital UT instruments and automatically calculates SA, PA, and RA values." },
        { h: "Flaw Location (PA and RA)", p: "For angle probe inspection: PA (Projection Distance / Surface Distance) = SA × sin(θ). RA (Range / Depth) = SA × cos(θ). Leg count (bounce): the leg number increases each time the sound beam reflects off the backwall. True depth and surface distance are calculated based on the leg number." },
      ],
    },
    {
      title: isTr ? "5. Zayıflama ve Sıcaklık Etkisi" : "5. Attenuation and Temperature Effects",
      icon: "📉",
      content: isTr ? [
        { h: "Akustik Zayıflama", p: "Ses dalgasının malzeme içinde yayılırken kaybettiği enerjidir. İki temel mekanizma: Saçılma (scattering) — tane sınırlarından ve inklüzyonlardan yansıma; Absorpsiyon — mekanik enerji ısıya dönüşür. Zayıflama katsayısı (α) malzeme ve frekansa bağlıdır: çelik ≈ 0.005 dB/mm/MHz, bakır ≈ 0.03 dB/mm/MHz." },
        { h: "Yakın Alan (N) ve Uzak Alan", p: "Yakın alan uzunluğu N = D² / (4λ). Bu bölgede ses demetinin genliği düzensiz dalgalanmalar gösterir ve güvenilir ölçüm yapılamaz. N değerinin ötesinde (uzak alan) genlik mesafeyle monoton azalır. Kalibrasyon her zaman uzak alanda yapılmalıdır." },
        { h: "Sıcaklık Etkisi", p: "Sıcaklık artışı ses hızını düşürür. Çelik için boyuna dalga: ~-0.8 m/s/°C, enine dalga: ~-0.5 m/s/°C. 20°C referans olarak ayarlanan bir cihaz, 100°C'de ölçüm yaparsa ses yolunda sistematik hata oluşur. Simulatörde sıcaklık değişimine bağlı hız sapması gözlemlenebilir." },
      ] : [
        { h: "Acoustic Attenuation", p: "Energy lost as sound propagates through a material. Two primary mechanisms: Scattering — reflections from grain boundaries and inclusions; Absorption — mechanical energy converts to heat. Attenuation coefficient (α) depends on material and frequency: steel ≈0.005 dB/mm/MHz, copper ≈0.03 dB/mm/MHz." },
        { h: "Near Field (N) and Far Field", p: "Near field length N = D² / (4λ). In this zone, beam amplitude shows irregular fluctuations and reliable measurement is not possible. Beyond N (far field), amplitude decreases monotonically with distance. Calibration must always be performed in the far field." },
        { h: "Temperature Effects", p: "Increasing temperature reduces sound velocity. For steel, longitudinal wave: ~-0.8 m/s/°C, shear wave: ~-0.5 m/s/°C. A device calibrated at 20°C will produce systematic errors in sound path if used at 100°C. In the simulator, velocity deviation due to temperature change can be observed." },
      ],
    },
    {
      title: isTr ? "6. Standartlar ve Referanslar" : "6. Standards & References",
      icon: "📋",
      content: isTr ? [
        { h: "Endüstriyel Standartlar", p: "EN ISO 17640: Kaynak bağlantılarının ultrasonik muayenesi. EN 10160: Düz yüzeyli çelik ürünlerin ultrasonik muayenesi (levha, geniş bant). ASME Sec. V Art. 4: Basınçlı kap bileşenleri için UT prosedürleri. ASTM E114: Darbe-yankı tekniği yöntemi." },
        { h: "API Standartları", p: "API 5L: Boru hattı çelik borularının UT muayenesi. API 650: Depolama tankı kaynakları için UT. API 570 / 571: İn-servis muayene ve mekanizma tanımlama. Bu standartlarda kabul kriteri, referans yansıtıcıya göre amplitüd karşılaştırması esasına dayanır (DAC veya TCG)." },
        { h: "Kalite Seviyeleri", p: "EN ISO 17640'a göre muayene seviyeleri A, B ve C olarak belirlenir. Seviye B: Kaynak dikişi boyunca çakışmalı tarama (indeksleme ≤ prob genişliğinin %50'si). EN 10160 kalite sınıfları: S0 (en sıkı), S1, S2, S3 (en gevşek); E0, E1 kenar bölgesi sınıflandırması. Tespit edilen hatalar boyut, konum ve yönelime göre kayıt altına alınır." },
      ] : [
        { h: "Industrial Standards", p: "EN ISO 17640: Ultrasonic testing of welded joints. EN 10160: Ultrasonic testing of steel flat products (plates, wide flats). ASME Sec. V Art. 4: UT procedures for pressure vessel components. ASTM E114: Pulse-echo technique methodology." },
        { h: "API Standards", p: "API 5L: UT of pipeline steel pipes. API 650: UT for storage tank welds. API 570/571: In-service inspection and mechanism identification. In these standards, acceptance criteria are based on amplitude comparison against a reference reflector (DAC or TCG method)." },
        { h: "Quality Levels", p: "EN ISO 17640 defines inspection levels A, B, and C. Level B: Overlapping scans along the weld (index step ≤50% of probe width). EN 10160 quality classes: S0 (strictest), S1, S2, S3 (most lenient); E0, E1 for edge zone classification. Detected discontinuities are recorded by size, location, and orientation." },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2 border-b border-neutral-700 pb-2">
          {isTr ? "UT Teorik Bilgiler" : "UT Theory & Information"}
        </h2>
        <p className="text-neutral-400 text-sm mb-6">
          {isTr
            ? "Ultrasonik muayenenin fiziksel temelleri, kalibrasyon prosedürleri ve standart referanslar."
            : "Physical fundamentals of ultrasonic testing, calibration procedures, and standard references."}
        </p>

        <div className="space-y-3">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none font-sans"
                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-lg font-mono">{sec.icon}</span>
                  <span className="text-white font-semibold text-sm">{sec.title}</span>
                </div>
                <span className="text-neutral-400 text-xs font-mono">{openSection === idx ? "▲" : "▼"}</span>
              </button>

              {openSection === idx && (
                <div className="px-5 pb-5 border-t border-neutral-700">
                  <div className="space-y-4 mt-4">
                    {sec.content.map((item, i) => (
                      <div key={i}>
                        <h4 className="text-blue-300 font-semibold text-sm mb-1.5">{item.h}</h4>
                        <p className="text-neutral-300 text-sm leading-relaxed">{item.p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Values Reference */}
        <div className="mt-8 bg-neutral-800 border border-neutral-700 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">
            {isTr ? "🔢 Hızlı Referans: Ses Hızları" : "🔢 Quick Reference: Sound Velocities"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-600">
                  <th className="text-left py-2 pr-4">{isTr ? "Malzeme" : "Material"}</th>
                  <th className="text-right py-2 pr-4">vL (m/s)</th>
                  <th className="text-right py-2 pr-4">vT (m/s)</th>
                  <th className="text-right py-2">Z (MRayl)</th>
                </tr>
              </thead>
              <tbody className="text-neutral-300">
                {[
                  { mat: isTr ? "Çelik (Steel)" : "Steel", vL: 5920, vT: 3240, Z: "46.4" },
                  { mat: isTr ? "Alüminyum" : "Aluminum", vL: 6320, vT: 3130, Z: "17.1" },
                  { mat: isTr ? "Bakır (Copper)" : "Copper", vL: 4700, vT: 2260, Z: "41.6" },
                  { mat: isTr ? "Perspeks (Wedge)" : "Perspex (Wedge)", vL: 2730, vT: "—", Z: "3.2" },
                  { mat: isTr ? "Su (Couplant)" : "Water (Couplant)", vL: 1480, vT: "—", Z: "1.48" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-neutral-700/50">
                    <td className="py-2 pr-4 text-yellow-300">{row.mat}</td>
                    <td className="py-2 pr-4 text-right text-green-400">{row.vL}</td>
                    <td className="py-2 pr-4 text-right text-blue-400">{row.vT}</td>
                    <td className="py-2 text-right text-purple-400">{row.Z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
