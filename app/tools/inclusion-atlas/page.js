"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";

// ─── SVG MİKROYAPI GÖRSELLERİ ────────────────────────────────────────────────

function MatrixBg({ seed = 0 }) {
  const polys = [
    "M0,30 L50,10 L100,40 L70,80 L10,70Z",
    "M50,10 L130,0 L160,50 L100,40Z",
    "M100,40 L160,50 L180,100 L130,130 L70,80Z",
    "M160,50 L230,20 L275,70 L220,110 L180,100Z",
    "M70,80 L130,130 L90,170 L10,170 L10,70Z",
    "M130,130 L220,110 L275,155 L275,170 L90,170Z",
    "M220,20 L275,0 L275,70 L230,20Z",
  ];
  const fills = ["#1f1f1f", "#1c1c1c", "#212121", "#1e1e1e", "#232323", "#1f1f1f", "#1c1c1c"];
  return (
    <>
      {polys.map((d, i) => (
        <path key={i} d={d} fill={fills[(i + seed) % fills.length]} stroke="#2a2a2a" strokeWidth="0.5" />
      ))}
    </>
  );
}

function ScaleBar({ x = 195, y = 158, label = "50 μm" }) {
  return (
    <>
      <rect x={x} y={y} width="52" height="2" fill="#ffffff" opacity="0.55" />
      <text x={x} y={y - 3} fill="#ffffff" fontSize="7" fontFamily="monospace" opacity="0.55">{label}</text>
    </>
  );
}

function MnSSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={0} />
      {/* Elongated MnS stringers parallel to rolling direction */}
      <ellipse cx="70"  cy="48"  rx="42" ry="5.5" fill="#8a8a8a" opacity="0.92" />
      <ellipse cx="155" cy="72"  rx="50" ry="6"   fill="#919191" opacity="0.90" />
      <ellipse cx="90"  cy="108" rx="38" ry="5"   fill="#878787" opacity="0.92" />
      <ellipse cx="210" cy="55"  rx="32" ry="4.5" fill="#8c8c8c" opacity="0.88" />
      <ellipse cx="195" cy="128" rx="44" ry="5.5" fill="#898989" opacity="0.90" />
      <ellipse cx="40"  cy="135" rx="25" ry="4"   fill="#8e8e8e" opacity="0.85" />
      {/* Rolling direction */}
      <line x1="8" y1="168" x2="260" y2="168" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.7" />
      <polygon points="258,165 268,168 258,171" fill="#d4af37" opacity="0.7" />
      <text x="6" y="166" fill="#d4af37" fontSize="7.5" fontFamily="monospace" opacity="0.7">RD →</text>
      <ScaleBar />
    </svg>
  );
}

function Al2O3SVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={2} />
      {/* Al₂O₃ — angular dark cluster */}
      <polygon points="110,55 128,48 142,60 138,78 122,82 108,72" fill="#1a1a1a" stroke="#555" strokeWidth="0.8" />
      <polygon points="128,48 148,42 158,54 148,62 135,58" fill="#1c1c1c" stroke="#555" strokeWidth="0.8" />
      <polygon points="138,78 155,72 162,85 150,95 132,90" fill="#181818" stroke="#555" strokeWidth="0.8" />
      {/* Satellite particles */}
      <polygon points="95,68 102,62 108,70 100,76" fill="#1a1a1a" stroke="#444" strokeWidth="0.7" />
      <polygon points="165,60 172,55 177,63 170,68" fill="#1c1c1c" stroke="#444" strokeWidth="0.7" />
      <polygon points="100,100 107,95 112,103 105,108" fill="#191919" stroke="#444" strokeWidth="0.7" />
      <polygon points="170,90 178,85 183,94 175,99" fill="#1a1a1a" stroke="#444" strokeWidth="0.7" />
      {/* Cracks at corners (stress concentration) */}
      <line x1="108" y1="55" x2="98"  y2="45"  stroke="#555" strokeWidth="0.6" opacity="0.5" />
      <line x1="162" y1="85" x2="174" y2="93"  stroke="#555" strokeWidth="0.6" opacity="0.5" />
      <ScaleBar label="20 μm" />
    </svg>
  );
}

function SilicateSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={4} />
      {/* Silicate stringer — glassy, elongated, slightly tapered */}
      <defs>
        <linearGradient id="silGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#606060" stopOpacity="0.3" />
          <stop offset="20%"  stopColor="#787878" stopOpacity="0.85" />
          <stop offset="80%"  stopColor="#757575" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#606060" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="72" rx="88" ry="7" fill="url(#silGrad)" />
      <ellipse cx="140" cy="72" rx="88" ry="7" fill="none" stroke="#aaaaaa" strokeWidth="0.4" opacity="0.4" />
      {/* Internal glassy texture lines */}
      <line x1="65"  y1="70" x2="80"  y2="74" stroke="#aaa" strokeWidth="0.4" opacity="0.3" />
      <line x1="120" y1="67" x2="130" y2="77" stroke="#aaa" strokeWidth="0.4" opacity="0.3" />
      <line x1="160" y1="68" x2="168" y2="76" stroke="#aaa" strokeWidth="0.4" opacity="0.3" />
      {/* Rolling direction */}
      <line x1="8" y1="168" x2="260" y2="168" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="5,3" opacity="0.7" />
      <polygon points="258,165 268,168 258,171" fill="#d4af37" opacity="0.7" />
      <text x="6" y="166" fill="#d4af37" fontSize="7.5" fontFamily="monospace" opacity="0.7">RD →</text>
      <ScaleBar label="100 μm" />
    </svg>
  );
}

function CaAluminateSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={1} />
      {/* Ca-aluminate globules — round/spherical */}
      {[
        { cx: 80,  cy: 60,  r: 9  },
        { cx: 155, cy: 50,  r: 11 },
        { cx: 210, cy: 80,  r: 8  },
        { cx: 120, cy: 110, r: 10 },
        { cx: 60,  cy: 120, r: 7  },
        { cx: 195, cy: 130, r: 9  },
        { cx: 240, cy: 50,  r: 6  },
        { cx: 100, cy: 148, r: 5  },
      ].map(({ cx, cy, r }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#5a5a6a" stroke="#8888aa" strokeWidth="0.7" opacity="0.9" />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill="#8888aa" opacity="0.4" />
        </g>
      ))}
      <ScaleBar label="20 μm" />
    </svg>
  );
}

function TiNSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={3} />
      {/* TiN — golden cubic/square particles */}
      {[
        { x: 72,  y: 45,  s: 14 },
        { x: 150, y: 62,  s: 18 },
        { x: 210, cy: 40, x2: 205, y: 38, s: 11 },
        { x: 95,  y: 108, s: 16 },
        { x: 195, y: 115, s: 13 },
        { x: 45,  y: 130, s: 10 },
        { x: 240, y: 100, s: 9  },
      ].map(({ x, y, s }, i) => (
        <g key={i}>
          <rect x={x} y={y} width={s} height={s} fill="#c8a020" stroke="#e8c030" strokeWidth="0.8" opacity="0.92" rx="0.5" />
          {/* Highlight corner */}
          <rect x={x + 1} y={y + 1} width={s * 0.4} height={s * 0.3} fill="#f0d060" opacity="0.35" rx="0.3" />
        </g>
      ))}
      <ScaleBar label="10 μm" />
    </svg>
  );
}

function NbCNSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={5} />
      {/* Nb(C,N) — very fine dispersed precipitates */}
      {Array.from({ length: 55 }, (_, i) => {
        const x = 15 + ((i * 47 + i * i * 13) % 250);
        const y = 10 + ((i * 31 + i * 19) % 150);
        const r = 1.2 + (i % 3) * 0.5;
        return <circle key={i} cx={x} cy={y} r={r} fill="#b0b0c0" opacity={0.5 + (i % 4) * 0.12} />;
      })}
      {/* Grain boundary lines */}
      <path d="M40,20 L80,55 L120,40 L170,80 L220,60 L275,90" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />
      <path d="M0,85 L60,100 L120,80 L180,120 L240,95 L275,110" fill="none" stroke="#3a3a3a" strokeWidth="1.2" />
      <text x="10" y="62" fill="#888" fontSize="7" fontFamily="monospace" opacity="0.7">GB</text>
      <ScaleBar label="1 μm" />
    </svg>
  );
}

function SpinelSVG() {
  return (
    <svg viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg">
      <rect width="280" height="175" fill="#141414" />
      <MatrixBg seed={6} />
      {/* MgO·Al₂O₃ Spinel — very angular, faceted, dark */}
      <polygon points="100,48 118,40 135,50 140,68 128,78 108,75 96,62" fill="#111111" stroke="#505050" strokeWidth="1" />
      <polygon points="118,40 145,33 158,47 148,62 135,50" fill="#131313" stroke="#505050" strokeWidth="1" />
      <polygon points="140,68 158,60 170,75 162,90 145,90 132,80" fill="#111111" stroke="#505050" strokeWidth="1" />
      {/* Secondary cluster */}
      <polygon points="185,100 200,92 212,100 215,115 200,122 185,115" fill="#111111" stroke="#484848" strokeWidth="0.9" />
      {/* Small satellites */}
      <polygon points="82,85 92,80 97,90 88,96" fill="#111111" stroke="#484848" strokeWidth="0.7" />
      <polygon points="165,42 173,37 179,46 173,51" fill="#131313" stroke="#484848" strokeWidth="0.7" />
      <polygon points="185,130 193,124 198,133 190,138" fill="#111111" stroke="#484848" strokeWidth="0.7" />
      {/* Fracture indication lines */}
      <line x1="100" y1="48" x2="90"  y2="38" stroke="#666" strokeWidth="0.7" opacity="0.55" />
      <line x1="140" y1="68" x2="152" y2="75" stroke="#666" strokeWidth="0.7" opacity="0.55" />
      <ScaleBar label="15 μm" />
    </svg>
  );
}

// ─── INCLUSION DATA ──────────────────────────────────────────────────────────

const INCLUSIONS_TR = [
  {
    id: "mns",
    name: "MnS — Mangan Sülfür",
    formula: "MnS",
    astm: "Tip A",
    astmColor: "#f59e0b",
    category: "Sülfür",
    svg: <MnSSVG />,
    color: "#8a8a8a",
    colorLabel: "Optik: Gri, uzamış / SEM-BSE: Orta gri",
    eds: "Mn Kα 5.90 keV · S Kα 2.31 keV",
    hardness: "~120–160 HV (plastik, hadde sıcaklığında deforme olur)",
    formation: "Katılaşma sırasında peritekik reaksiyon: L → γ + MnS (~1400–1460°C). Mn/S oranı ≥ 5 olmadıkça demir-sülfür ötektiği (988°C) oluşur → sıcak kırılganlık riski.",
    reactions: "[Mn] + [S] = MnS(s)  |  log K = 12.6 − 9020/T  |  ΔG° ≈ −163 kJ/mol @ 1600°C",
    morphology: "Haddeleme yönüne paralel uzamış şeritler. En-boy oranı >10:1. Hadde sıcaklığında plastik, ASTM E45 Tip A olarak sınıflandırılır.",
    effects: [
      "Enine yönde Charpy darbe enerjisini belirgin düşürür (anizotropi)",
      "HIC (Hidrojen Kaynaklı Çatlak) başlangıç noktası — sour servis çeliklerinde kritik",
      "Kalın levhalarda lameller yırtılma riski",
      "S > 0.010% → yorulma dayanımında kayıp",
    ],
    grades: "API 5L (S < 0.003%), HIC dirençli çelik, basınçlı kap, IF çeliği (S < 0.005%)",
    corrective: [
      "Pota desülfürizasyonu: CaO + CaF₂ flaks ile S < 0.005%'e düşür",
      "Ca tel enjeksiyonu: Ca/S > 0.3 (kütle oranı) → MnS yerine globüler (Ca,Mn)S oluşumu",
      "RE (nadir toprak) oksit muamelesi: CeO₂, La₂O₃ → sülfür şeklini küreselleştirir",
      "Stiridite hadde sıcaklığı kontrolü: S oranı yüksekse şekillendirme sıcaklığını yükselt",
    ],
  },
  {
    id: "al2o3",
    name: "Al₂O₃ — Alümina Oksit",
    formula: "Al₂O₃",
    astm: "Tip B",
    astmColor: "#3b82f6",
    category: "Oksit",
    svg: <Al2O3SVG />,
    color: "#1a1a1a",
    colorLabel: "Optik: Koyu gri/siyah, köşeli / SEM-BSE: Koyu (düşük Z)",
    eds: "Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~2000 HV (sert, kırılgan — hadde sıcaklığında deforme olmaz)",
    formation: "Alüminyum ile deoksidasyon: 2[Al] + 3[O] = Al₂O₃(k) | log K = 13.8 + 36900/T. Sıvı çelikteki küçük partiküller yüzeye yükselir; kümeler (rozet yapısı) tundish veya kalıp içinde hapsedilir.",
    reactions: "2[Al] + 3[O] = Al₂O₃  |  log([%Al]²[%O]³) = −64000/T + 20.6  |  ΔG° ≈ −1130 kJ/mol @ 1600°C",
    morphology: "Köşeli, rozet veya dendritik kümeler, 2–50 μm. Kırılgan, asla plastik deformasyon göstermez. Sürekli dökümde nozul tıkanmasının başlıca nedeni.",
    effects: [
      "Yorulma ömrünü kısaltır — keskin köşeler yüksek gerilim konsantrasyonu yaratır",
      "Sürekli dökümde nozul tıkanması (submerged entry nozzle clogging)",
      "Yüzey kalitesini bozar (sliver, çizik)",
      "Rulman çeliklerinde (52100) kabul edilemez",
    ],
    grades: "Rulman çeliği (tüm inklüzyon < 0.5 ASTM), yay çeliği, yorulma kritik uygulamalar",
    corrective: [
      "Ca muamelesi: Al₂O₃ → CaO·Al₂O₃ (12CaO·7Al₂O₃) — sıvı faz, akıcı → nozul tıkanmaz",
      "Ca/Al kütlesel oranı 0.09–0.14 hedef (düşük → sertleşmez, yüksek → CaS)",
      "Tundish akış optimizasyonu: çökeltme süresi ↑, kırık çim engeli (turbostop)",
      "Ar gaz koruma: döküm hattı boyunca atmosfer ile temas önlenmeli",
      "Slide gate yenileme sıklığı ↑, refrakter kalitesi iyileştirilmeli",
    ],
  },
  {
    id: "silicate",
    name: "Silikat — SiO₂ Bazlı",
    formula: "SiO₂, FeO·SiO₂, MnO·SiO₂",
    astm: "Tip C",
    astmColor: "#10b981",
    category: "Oksit",
    svg: <SilicateSVG />,
    color: "#787878",
    colorLabel: "Optik: Saydam-gri, camsı, uzamış / SEM-BSE: Koyu-gri",
    eds: "Si Kα 1.74 keV · O Kα 0.52 keV (+ Mn, Fe, Al opsiyonel)",
    hardness: "~600–800 HV (plastik — >700°C'da vizkoz cam gibi deforme olur)",
    formation: "Si ile deoksidasyon veya cüruf sürüklenmesi. Si-kaynaklı: 2[O]+[Si]=SiO₂. Düşük baziklik cürufu (B<2.5) → SiO₂ aktivitesi yüksek → karışma riski.",
    reactions: "[Si] + 2[O] = SiO₂  |  log K = 30110/T − 11.4  |  ΔG° ≈ −576 kJ/mol @ 1600°C",
    morphology: "Hadde sıcaklığında deforme olan, uzun şeritler oluşturan, camsı görünümlü. Tip C: uzunluk/genişlik > 3. İnce (T) ve kalın (H) eşikleri ASTM E45'te tanımlı.",
    effects: [
      "Enine sünekliği düşürür (şerit boyunca kırılma)",
      "Derin çekme ve şekillendirme kusurlarına yol açar (IF çeliği için kritik)",
      "Yüzey çizikleri ve hatalar (stringer)",
      "Termal çevrimlerde yüzey yorulması",
    ],
    grades: "IF çeliği, derin çekme levha (DD11-DD14), yüksek şekillendirme çelikleri",
    corrective: [
      "Al-killing'e geçiş: Si-killed yerine Al-killed → SiO₂ yerine Al₂O₃ (Ca ile modifiye edilebilir)",
      "Cüruf bazikliği ↑: CaO/SiO₂ > 3.0 — SiO₂ aktivitesini düşür",
      "Cüruf taşması önlemi: döküm başlangıcında cüruf kesme, slide gate kontrolü",
      "Potadan tundish'e transfer sırasında Ar koruma",
    ],
  },
  {
    id: "ca-aluminate",
    name: "Kalsiyum Alüminat",
    formula: "CaO·Al₂O₃ (CA, C₃A₅, 12CaO·7Al₂O₃)",
    astm: "Tip D",
    astmColor: "#8b5cf6",
    category: "Oksit",
    svg: <CaAluminateSVG />,
    color: "#6a6a8a",
    colorLabel: "Optik: Gri-mavimsi, küresel / SEM-BSE: Orta-koyu gri",
    eds: "Ca Kα 3.69 keV · Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~600–900 HV (katı faz); 12CaO·7Al₂O₃ → ~1390°C'da sıvı → akıcı",
    formation: "Ca muamelesi: CaO·Al₂O₃ faz diyagramında hedef alan 12CaO·7Al₂O₃ veya C₃A₅ (sıvı pencere 1300–1500°C). Ca/Al = 0.09–0.14 kütlesel oran. Aşırı Ca → CaS (katı, nozul tıkayan).",
    reactions: "Ca(l) + Al₂O₃(k) → CaO·Al₂O₃  |  Hedef: 12CaO·7Al₂O₃ (Tm ≈ 1390°C, Çelik için sıvı)  |  CaO/Al₂O₃ molar oranı 1.5–1.8",
    morphology: "Küresel-globüler, 2–20 μm, izotropik. Ca muamelesi başarılıysa tüm Al₂O₃ kümeleri globüle dönüşür. SEM'de uniform, düzgün kenarlı.",
    effects: [
      "Genellikle yararlı: küresel şekil → gerilim konsantrasyonu düşük",
      "Enine Charpy tokluğunu Tip A sülfüre kıyasla iyileştirir",
      "Castability iyileşir (nozul tıkanmaz — Tm < çelik sıcaklığı)",
      "Sour servis (HIC direnci) için tercih edilen morfoloji",
    ],
    grades: "API 5L sour servis, HIC dirençli çelik, sürekli döküm kalitesi",
    corrective: [
      "Ca tel enjeksiyonu dozunu optimize et: Ca/Al = 0.09–0.14",
      "[Al] kontrol: 0.02–0.04% optimum (düşük → yetersiz deoksidasyon, yüksek → Ca fazla gerekir)",
      "Ca sonrası yeterli Ar purge: min 5–8 dk şişirme — reaksiyon tamamlansın",
      "CaS tuzağı: S < 0.005% altında tut yoksa Ca önce S ile tepkimeye girer",
    ],
  },
  {
    id: "tin",
    name: "TiN — Titanyum Nitrür",
    formula: "TiN",
    astm: "Tip D (köşeli)",
    astmColor: "#8b5cf6",
    category: "Nitrür",
    svg: <TiNSVG />,
    color: "#c8a020",
    colorLabel: "Optik: Altın sarısı (tanımlayıcı) / SEM-BSE: Parlak (yüksek Z-Ti)",
    eds: "Ti Kα 4.51 keV · N Kα 0.39 keV (N EDS ile güç — WDS gerekebilir)",
    hardness: "~2000–2400 HV (kırılgan, hadde sıcaklığında asla deforme olmaz)",
    formation: "Katılaşma sırasında veya östenit içinde: [Ti] + [N] = TiN. Çözünürlük: log([%Ti][%N]) = −15790/T + 5.90 (Turkdogan). T_nükleasyon genellikle 1450–1500°C, kübik morfoloji bu sıcaklıkta oluşur.",
    reactions: "[Ti] + [N] = TiN  |  log K = 15790/T − 5.90  |  Tsolüb = 1449 + 21990 / (4.83 − log([%Ti][%N]))",
    morphology: "Kusursuz kübik/kare şekil (NaCl kristal yapısı). Katılaşmada büyük (2–10 μm), solid-state çökeliminde ince (<1 μm). Altın sarısı renk patolognomik.",
    effects: [
      "İnce TiN (<1 μm): östenit tane büyümesini frenler (Zener pinning: D_lim = 4r/3f) → yararlı",
      "Kaba TiN (>3 μm): yorulma çatlak başlangıcı, yuvarlanma yorulması (rulman uygulamaları)",
      "Çekme numunelerinde kırılma yüzeyi dimple'larında gözlemlenir",
      "HSLA çeliklerde Charpy geçiş sıcaklığını yükseltebilir",
    ],
    grades: "HSLA (S315MC-S700MC), API 5L X65-X80, mikroalaşımlı yapı çelikleri, yay çeliği",
    corrective: [
      "[Ti][N] çarpımını solübisite eğrisinin altında tut (üretim sıcaklığına göre)",
      "Ti/N molar oranını stoikiometrik değere yakın tut (Ti/N ~ 3.42 kütlesel)",
      "Süperheat düşürmek → çökelim sıcaklığını düşürür → ince TiN",
      "N < 0.006%: azot kontrolü (elektrik ark ocağı hava teması minimizasyonu)",
    ],
  },
  {
    id: "nbcn",
    name: "Nb(C,N) — Niyobyum Karbonitrid",
    formula: "Nb(C₁₋ₓNₓ)",
    astm: "Optik sınır altı (< 1 μm)",
    astmColor: "#6b7280",
    category: "Karbonitrür",
    svg: <NbCNSVG />,
    color: "#b0b0c0",
    colorLabel: "Optik: Çözünemez / SEM-BSE: Hafif parlak nokta / TEM: difraksiyon",
    eds: "Nb Lα 2.17 keV · (C ve N EDS ile pratik saptanamaz — TEM-EDS gerekir)",
    hardness: "~2000 HV (son derece sert ve ince dağılmış)",
    formation: "Gerilim kaynaklı çökelim (strain-induced precipitation) haddeleme sırasında ve/veya östenit içinde soğuma esnasında. Çözünürlük: log([%Nb]([%C]+[%N])) = 2.06 − 6700/T (Irvine-Baker). T_çökelim ~850–950°C.",
    reactions: "[Nb] + [C] + [N] = Nb(C,N)  |  log K = 6700/T − 2.06  |  ΔG° ≈ −128 kJ/mol",
    morphology: "5–200 nm aralığında dağılmış partiküller. Tane sınırlarında (inter-granüler) veya östenit içinde (intra-granüler). TEM ile görüntülenir; optik mikroskop ile görülemez.",
    effects: [
      "Östenit yeniden kristalleşmesini engeller (Tnr ↑) → pankeyk östenit → ince ferrit",
      "Çökelim sertleşmesi: ΔYS = 50–150 MPa (0.05–0.1% Nb için)",
      "Tane büyümesini frenler (Zener pinning)",
      "Tane sınırında kabalaşan Nb → düşük sıcaklık tokluğunu azaltabilir",
    ],
    grades: "HSLA S355MC–S700MC, API 5L X65–X80, yapısal çelik, kalın levha",
    corrective: [
      "Katı çözelti Nb miktarını optimize et: [Nb]çöz = toplam Nb − çökelmiş Nb",
      "Finish hadde sıcaklığı Tnr'ın altında tutulursa → strain-induced çökelim hızlanır",
      "İnce dispersiyon için hızlı soğuma sonrası ılımlı sıcaklık (su verme + ısıl işlem)",
      "Nb > 0.12% → grain boundary çökelme riski → tokluk kaybı",
    ],
  },
  {
    id: "spinel",
    name: "Spinel — MgO·Al₂O₃",
    formula: "MgO·Al₂O₃",
    astm: "Tip B (küme)",
    astmColor: "#3b82f6",
    category: "Oksit",
    svg: <SpinelSVG />,
    color: "#111111",
    colorLabel: "Optik: Koyu siyah, çok köşeli / SEM-BSE: Koyu (düşük ortalama Z)",
    eds: "Mg Kα 1.25 keV · Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~2300 HV (Al₂O₃'ten daha sert, termal olarak son derece stabil)",
    formation: "Refrakter kaynaklı MgO (MgO-C tuğla, dolomit) çelik içindeki Al₂O₃ ile reaksiyon: MgO(ref.) + Al₂O₃(k) → MgO·Al₂O₃. Temas süresi ve refrakter aşınmasıyla doğru orantılı.",
    reactions: "MgO(s) + Al₂O₃(s) = MgAl₂O₄  |  ΔG° = −36 kJ/mol @ 1600°C  |  aSpinel = aMgO × aAl₂O₃",
    morphology: "Son derece köşeli, faceted, yüksek rölyefli. Al₂O₃'e göre daha az kümelenme ama daha yüksek sertlik. Ca muamelesi ile modifikasyonu çok güç — Al₂O₃ gibi erimez.",
    effects: [
      "En kötü nozul tıkanma inklüzyonu — Ca muamelesi etkisiz",
      "Sertliği nedeniyle çelik yüzeyinde ciddi çizik ve hasar",
      "Yorulma çatlak başlangıcı Al₂O₃'ten daha erken",
      "Yüzey kalitesi sorunları: sliver, laminasyon",
    ],
    grades: "Tüm Al-killed çelikler risk altında; MgO-C refrakter kullanan sistemlerde kritik",
    corrective: [
      "MgO-C refrakter temasını minimize et: dolomit kaplama yerine Al₂O₃-SiC-C kullan",
      "Potada temas süresini kısalt: ısıl döngü optimizasyonu",
      "Tundish içi akış tasarımı: turbo-stop engeli, sızdırmazlık iyileştirmesi",
      "Ca muamelesi yetersiz → Mg chelation agent (nadir toprak oksit) araştırılabilir",
    ],
  },
];

const INCLUSIONS_EN = [
  {
    id: "mns",
    name: "MnS — Manganese Sulphide",
    formula: "MnS",
    astm: "Type A",
    astmColor: "#f59e0b",
    category: "Sulphide",
    svg: <MnSSVG />,
    color: "#8a8a8a",
    colorLabel: "Optical: Grey, elongated / SEM-BSE: Medium grey",
    eds: "Mn Kα 5.90 keV · S Kα 2.31 keV",
    hardness: "~120–160 HV (plastic — deforms during hot rolling)",
    formation: "Peritectic reaction during solidification: L → γ + MnS (~1400–1460°C). When Mn/S < 5, iron-sulphide eutectic forms at 988°C → hot shortness risk.",
    reactions: "[Mn] + [S] = MnS(s)  |  log K = 12.6 − 9020/T  |  ΔG° ≈ −163 kJ/mol @ 1600°C",
    morphology: "Elongated stringers parallel to rolling direction. Aspect ratio >10:1. Plastic at hot rolling temperature — classified as ASTM E45 Type A.",
    effects: [
      "Significantly reduces transverse Charpy impact energy (anisotropy)",
      "Primary HIC (Hydrogen-Induced Cracking) initiation site — critical in sour service",
      "Lamellar tearing risk in heavy plates",
      "S > 0.010% → reduced fatigue resistance",
    ],
    grades: "API 5L (S < 0.003%), HIC-resistant steel, pressure vessel, IF steel (S < 0.005%)",
    corrective: [
      "Ladle desulphurisation: CaO + CaF₂ flux to achieve S < 0.005%",
      "Ca wire injection: Ca/S > 0.3 (mass ratio) → MnS converts to globular (Ca,Mn)S",
      "Rare earth (RE) treatment: CeO₂, La₂O₃ → spheroidises sulphide morphology",
      "Increase hot deformation temperature if S is elevated to reduce stringer severity",
    ],
  },
  {
    id: "al2o3",
    name: "Al₂O₃ — Alumina",
    formula: "Al₂O₃",
    astm: "Type B",
    astmColor: "#3b82f6",
    category: "Oxide",
    svg: <Al2O3SVG />,
    color: "#1a1a1a",
    colorLabel: "Optical: Dark grey/black, angular / SEM-BSE: Dark (low Z)",
    eds: "Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~2000 HV (hard, brittle — does not deform at any rolling temperature)",
    formation: "Aluminium deoxidation product: 2[Al] + 3[O] = Al₂O₃. Small particles float out; clusters (rosette morphology) are entrapped in tundish or mould during continuous casting.",
    reactions: "2[Al] + 3[O] = Al₂O₃  |  log([%Al]²[%O]³) = −64000/T + 20.6  |  ΔG° ≈ −1130 kJ/mol @ 1600°C",
    morphology: "Angular, rosette or dendritic clusters, 2–50 μm. Brittle — never deforms plastically. Primary cause of submerged entry nozzle (SEN) clogging in continuous casting.",
    effects: [
      "Reduces fatigue life — sharp corners create high stress concentration factors",
      "Submerged entry nozzle clogging in continuous casting",
      "Surface defects: slivers, seams",
      "Unacceptable in bearing steels (ASTM A295 / ISO 683-17)",
    ],
    grades: "Bearing steel (52100) — all inclusions < 0.5 ASTM, spring steel, fatigue-critical applications",
    corrective: [
      "Calcium treatment: Al₂O₃ → CaO·Al₂O₃ (12CaO·7Al₂O₃) — liquid phase, fluid → no nozzle clogging",
      "Target Ca/Al mass ratio 0.09–0.14 (below → insufficient, above → CaS formation)",
      "Tundish flow optimisation: increased residence time, turbostop weir for flotation",
      "Argon shrouding throughout casting line to prevent re-oxidation",
      "Increase slide gate change frequency; improve refractory quality",
    ],
  },
  {
    id: "silicate",
    name: "Silicate — SiO₂-Based",
    formula: "SiO₂, FeO·SiO₂, MnO·SiO₂",
    astm: "Type C",
    astmColor: "#10b981",
    category: "Oxide",
    svg: <SilicateSVG />,
    color: "#787878",
    colorLabel: "Optical: Transparent-grey, glassy, elongated / SEM-BSE: Dark grey",
    eds: "Si Kα 1.74 keV · O Kα 0.52 keV (+ Mn, Fe, Al optional)",
    hardness: "~600–800 HV (plastic — behaves as viscous glass above ~700°C)",
    formation: "Silicon deoxidation or slag entrainment. Si-sourced: [Si] + 2[O] = SiO₂. Low-basicity slag (B < 2.5) → high SiO₂ activity → mixing risk.",
    reactions: "[Si] + 2[O] = SiO₂  |  log K = 30110/T − 11.4  |  ΔG° ≈ −576 kJ/mol @ 1600°C",
    morphology: "Deformable at rolling temperature — forms elongated stringers with glassy appearance. Type C: length/width > 3. Thin (T) and heavy (H) thresholds defined in ASTM E45.",
    effects: [
      "Reduces transverse ductility (fracture along stringer length)",
      "Causes deep drawing and forming defects (critical for IF steel)",
      "Surface slivers and lamination defects",
      "Thermal fatigue at surface during cyclic heating",
    ],
    grades: "IF steel, deep drawing sheet (DD11–DD14), high-formability grades",
    corrective: [
      "Switch to Al-killing: replaces SiO₂ with Al₂O₃ (modifiable by Ca treatment)",
      "Increase slag basicity: CaO/SiO₂ > 3.0 to reduce SiO₂ activity",
      "Slag carry-over prevention: slag cutting at cast start, slide gate control",
      "Argon shrouding during ladle-to-tundish transfer",
    ],
  },
  {
    id: "ca-aluminate",
    name: "Calcium Aluminate",
    formula: "CaO·Al₂O₃ (CA, C₃A₅, 12CaO·7Al₂O₃)",
    astm: "Type D",
    astmColor: "#8b5cf6",
    category: "Oxide",
    svg: <CaAluminateSVG />,
    color: "#6a6a8a",
    colorLabel: "Optical: Grey-bluish, globular / SEM-BSE: Medium dark grey",
    eds: "Ca Kα 3.69 keV · Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~600–900 HV (solid phase); 12CaO·7Al₂O₃ → liquid at ~1390°C → fluid",
    formation: "Calcium treatment of Al-killed steel. Target phase in CaO-Al₂O₃ diagram: 12CaO·7Al₂O₃ or C₃A₅ (liquid window 1300–1500°C). Ca/Al = 0.09–0.14 mass ratio. Excess Ca → CaS (solid, clogs nozzle).",
    reactions: "Ca(l) + Al₂O₃(s) → CaO·Al₂O₃  |  Target: 12CaO·7Al₂O₃ (Tm ≈ 1390°C, liquid in steel)  |  CaO/Al₂O₃ molar ratio 1.5–1.8",
    morphology: "Spherical to globular, 2–20 μm, isotropic. Successful Ca treatment converts all Al₂O₃ clusters to globules. Uniform, smooth-edged at SEM.",
    effects: [
      "Generally beneficial: spherical shape → low stress concentration factor",
      "Improves transverse Charpy toughness vs. Type A sulphides",
      "Improves castability (no nozzle clogging — Tm < steel temperature)",
      "Preferred morphology for sour service and HIC resistance",
    ],
    grades: "API 5L sour service, HIC-resistant steel, continuous casting quality grades",
    corrective: [
      "Optimise Ca wire injection rate: Ca/Al = 0.09–0.14",
      "Control [Al]: 0.02–0.04% optimum (low → insufficient deoxidation, high → excess Ca needed)",
      "Adequate Ar purge after Ca: minimum 5–8 min bubbling — allow reaction to complete",
      "CaS trap: keep S < 0.005% otherwise Ca preferentially reacts with S",
    ],
  },
  {
    id: "tin",
    name: "TiN — Titanium Nitride",
    formula: "TiN",
    astm: "Type D (angular)",
    astmColor: "#8b5cf6",
    category: "Nitride",
    svg: <TiNSVG />,
    color: "#c8a020",
    colorLabel: "Optical: Golden yellow (diagnostic) / SEM-BSE: Bright (high Z-Ti)",
    eds: "Ti Kα 4.51 keV · N Kα 0.39 keV (N difficult by EDS — WDS may be required)",
    hardness: "~2000–2400 HV (brittle — does not deform at any rolling temperature)",
    formation: "During solidification or in austenite: [Ti] + [N] = TiN. Solubility: log([%Ti][%N]) = −15790/T + 5.90 (Turkdogan). Nucleation temperature typically 1450–1500°C; cubic morphology forms at this temperature.",
    reactions: "[Ti] + [N] = TiN  |  log K = 15790/T − 5.90  |  T_solubility = 1449 + 21990 / (4.83 − log([%Ti][%N]))",
    morphology: "Perfect cubic/square shape (NaCl crystal structure). Large at solidification (2–10 μm), fine in solid-state precipitation (<1 μm). Golden yellow colour is pathognomonic.",
    effects: [
      "Fine TiN (<1 μm): pins austenite grain boundaries (Zener pinning: D_lim = 4r/3f) → beneficial",
      "Coarse TiN (>3 μm): fatigue crack initiation site, rolling contact fatigue (bearing applications)",
      "Observed in fracture surface dimples of tensile specimens",
      "Can raise Charpy transition temperature in HSLA steels",
    ],
    grades: "HSLA (S315MC–S700MC), API 5L X65–X80, microalloyed structural steel, spring steel",
    corrective: [
      "Keep [Ti][N] product below solubility curve at production temperature",
      "Maintain Ti/N molar ratio near stoichiometric value (Ti/N ~ 3.42 mass ratio)",
      "Reduce superheat → lowers precipitation temperature → finer TiN",
      "N < 0.006%: nitrogen control (minimise air contact in EAF operations)",
    ],
  },
  {
    id: "nbcn",
    name: "Nb(C,N) — Niobium Carbonitride",
    formula: "Nb(C₁₋ₓNₓ)",
    astm: "Below optical resolution (<1 μm)",
    astmColor: "#6b7280",
    category: "Carbonitride",
    svg: <NbCNSVG />,
    color: "#b0b0c0",
    colorLabel: "Optical: Unresolvable / SEM-BSE: Faint bright spots / TEM: diffraction",
    eds: "Nb Lα 2.17 keV · (C and N not detectable by EDS — TEM-EDS required)",
    hardness: "~2000 HV (extremely hard, finely dispersed)",
    formation: "Strain-induced precipitation during rolling and/or during austenite cooling. Solubility: log([%Nb]([%C]+[%N])) = 2.06 − 6700/T (Irvine-Baker). Precipitation temperature ~850–950°C.",
    reactions: "[Nb] + [C] + [N] = Nb(C,N)  |  log K = 6700/T − 2.06  |  ΔG° ≈ −128 kJ/mol",
    morphology: "Dispersed particles in the 5–200 nm range. Intergranular (grain boundary) or intragranular (within austenite). Imaged by TEM; not resolvable by optical microscopy.",
    effects: [
      "Retards austenite recrystallisation (raises Tnr) → pancaked austenite → fine ferrite",
      "Precipitation strengthening: ΔYS = 50–150 MPa (for 0.05–0.1% Nb)",
      "Grain growth inhibition (Zener pinning mechanism)",
      "Coarse Nb at grain boundaries (excess) → reduces low-temperature toughness",
    ],
    grades: "HSLA S355MC–S700MC, API 5L X65–X80, structural steel, heavy plate",
    corrective: [
      "Optimise solid-solution Nb: [Nb]dissolved = total Nb − precipitated Nb",
      "Finish rolling below Tnr accelerates strain-induced precipitation",
      "Fine dispersion: rapid cooling followed by controlled tempering temperature",
      "Nb > 0.12% → grain boundary precipitation risk → toughness loss",
    ],
  },
  {
    id: "spinel",
    name: "Spinel — MgO·Al₂O₃",
    formula: "MgO·Al₂O₃",
    astm: "Type B (cluster)",
    astmColor: "#3b82f6",
    category: "Oxide",
    svg: <SpinelSVG />,
    color: "#111111",
    colorLabel: "Optical: Black, highly angular / SEM-BSE: Dark (low mean Z)",
    eds: "Mg Kα 1.25 keV · Al Kα 1.49 keV · O Kα 0.52 keV",
    hardness: "~2300 HV (harder than Al₂O₃, thermally extremely stable)",
    formation: "MgO from refractory (MgO-C bricks, dolomite) reacts with Al₂O₃ inclusions in the steel: MgO(ref.) + Al₂O₃(s) → MgO·Al₂O₃. Proportional to contact time and refractory wear rate.",
    reactions: "MgO(s) + Al₂O₃(s) = MgAl₂O₄  |  ΔG° = −36 kJ/mol @ 1600°C  |  a_Spinel = a_MgO × a_Al₂O₃",
    morphology: "Extremely angular, faceted, high relief. Less clustering than Al₂O₃ but higher hardness. Ca treatment is ineffective for modification — does not melt like Al₂O₃.",
    effects: [
      "Most severe nozzle clogging inclusion — Ca treatment ineffective",
      "Due to extreme hardness, causes severe surface scoring and damage",
      "Fatigue crack initiation earlier than Al₂O₃",
      "Surface quality defects: slivers, laminations",
    ],
    grades: "All Al-killed steels at risk; critical in systems using MgO-C refractories",
    corrective: [
      "Minimise MgO-C refractory contact: replace dolomite lining with Al₂O₃-SiC-C",
      "Reduce ladle contact time: optimise thermal cycling",
      "Tundish flow design: turbostop barrier, improved sealing",
      "Ca treatment insufficient → investigate Mg chelation or rare earth oxide additions",
    ],
  },
];

const FILTERS_TR = ["Tümü", "Sülfür", "Oksit", "Nitrür", "Karbonitrür", "Tip A", "Tip B", "Tip C", "Tip D"];
const FILTERS_EN = ["All",   "Sulphide", "Oxide", "Nitride", "Carbonitride", "Type A", "Type B", "Type C", "Type D"];

function matchFilter(inc, filter) {
  if (filter === "Tümü" || filter === "All") return true;
  if (filter === "Tip A"  || filter === "Type A")  return inc.astm.includes("A");
  if (filter === "Tip B"  || filter === "Type B")  return inc.astm.includes("B");
  if (filter === "Tip C"  || filter === "Type C")  return inc.astm.includes("C");
  if (filter === "Tip D"  || filter === "Type D")  return inc.astm.includes("D");
  return inc.category === filter;
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function InclusionAtlasPage() {
  const { lang } = useLang();
  const [filter, setFilter] = useState(lang === "tr" ? "Tümü" : "All");
  const [expanded, setExpanded] = useState(null);

  const filters  = lang === "tr" ? FILTERS_TR : FILTERS_EN;
  const data     = lang === "tr" ? INCLUSIONS_TR : INCLUSIONS_EN;
  const filtered = data.filter(inc => matchFilter(inc, filter));

  return (
    <div className="min-h-screen pt-20 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-dark-400 font-mono mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors no-underline text-dark-400">MetallurgyTools</Link>
            <span>/</span>
            <Link href="/#tools" className="hover:text-gold-400 transition-colors no-underline text-dark-400">{lang === "tr" ? "Araçlar" : "Tools"}</Link>
            <span>/</span>
            <span className="text-dark-200">{lang === "tr" ? "İnklüzyon Atlası" : "Inclusion Atlas"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {lang === "tr" ? (
              <>İnklüzyon Atlası — <span className="text-gold-400">Çelik Mikroyapı Referansı</span></>
            ) : (
              <>Inclusion Atlas — <span className="text-gold-400">Steel Microstructure Reference</span></>
            )}
          </h1>
          <p className="text-dark-300 text-base max-w-3xl leading-relaxed">
            {lang === "tr"
              ? "Çelik üretiminde karşılaşılan metalik olmayan inklüzyonların morfoloji, kimyasal bileşim, oluşum mekanizması, EDS karakterizasyonu, mekanik özellik etkileri ve proses düzeltici faaliyetlerine ait kapsamlı teknik referans."
              : "Comprehensive technical reference for non-metallic inclusions in steel production — morphology, chemistry, formation mechanisms, EDS identification, mechanical property effects and corrective process actions."}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["ASTM E45", "ISO 4967", "SEM-EDS", lang === "tr" ? "Metalografi" : "Metallography"].map(tag => (
              <span key={tag} className="font-mono text-[11px] border border-gold-400/20 text-gold-400 px-2.5 py-1 rounded-md bg-gold-400/5">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono border transition-all cursor-pointer ${
                filter === f
                  ? "bg-gold-400/15 border-gold-400/40 text-gold-400"
                  : "bg-white/[0.03] border-white/[0.08] text-dark-300 hover:border-white/20 hover:text-dark-50"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-dark-400 font-mono self-center">
            {filtered.length} {lang === "tr" ? "inklüzyon" : "inclusions"}
          </span>
        </div>

        {/* ── Inclusion Cards ── */}
        <div className="space-y-6">
          {filtered.map((inc) => {
            const isOpen = expanded === inc.id;
            return (
              <div
                key={inc.id}
                className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-gold-400/15 transition-all"
              >
                {/* Card Header — always visible */}
                <button
                  onClick={() => setExpanded(isOpen ? null : inc.id)}
                  className="w-full text-left cursor-pointer bg-transparent border-none"
                >
                  <div className="flex items-stretch">

                    {/* SVG Micrograph */}
                    <div className="w-48 md:w-64 shrink-0 bg-dark-900 border-r border-white/[0.06]" style={{ minHeight: "160px" }}>
                      {inc.svg}
                    </div>

                    {/* Summary */}
                    <div className="flex-1 p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border" style={{ color: inc.astmColor, borderColor: inc.astmColor + "40", background: inc.astmColor + "10" }}>
                          ASTM E45 {inc.astm}
                        </span>
                        <span className="font-mono text-[10px] border border-white/10 text-dark-300 px-2 py-0.5 rounded">{inc.category}</span>
                      </div>

                      <h2 className="text-lg md:text-xl font-bold text-dark-50 mb-1">{inc.name}</h2>
                      <p className="font-mono text-xs text-dark-400 mb-3">{inc.formula}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-dark-400 uppercase tracking-wider font-mono text-[10px]">{lang === "tr" ? "Renk / Görünüm" : "Color / Appearance"}</span>
                          <p className="text-dark-200 mt-0.5">{inc.colorLabel}</p>
                        </div>
                        <div>
                          <span className="text-dark-400 uppercase tracking-wider font-mono text-[10px]">EDS</span>
                          <p className="text-dark-200 mt-0.5 font-mono">{inc.eds}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 text-xs text-gold-400 font-mono">
                        <span>{isOpen ? "▲" : "▼"}</span>
                        <span>{isOpen ? (lang === "tr" ? "Gizle" : "Collapse") : (lang === "tr" ? "Tam Teknik Veri →" : "Full Technical Data →")}</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="border-t border-white/[0.06] p-6 md:p-8 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                      {/* Left column */}
                      <div className="space-y-6">

                        {/* Morphology */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Morfoloji" : "Morphology"}
                          </h3>
                          <p className="text-dark-200 text-sm leading-relaxed">{inc.morphology}</p>
                        </div>

                        {/* Formation */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Oluşum Mekanizması" : "Formation Mechanism"}
                          </h3>
                          <p className="text-dark-200 text-sm leading-relaxed mb-3">{inc.formation}</p>
                          <div className="bg-dark-900 rounded-lg px-4 py-3 font-mono text-xs text-green-400 leading-relaxed border border-white/[0.05]">
                            {inc.reactions}
                          </div>
                        </div>

                        {/* Hardness */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Sertlik" : "Hardness"}
                          </h3>
                          <p className="text-dark-200 text-sm">{inc.hardness}</p>
                        </div>

                        {/* Critical grades */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Kritik Çelik Kaliteleri" : "Critical Steel Grades"}
                          </h3>
                          <p className="text-dark-200 text-sm">{inc.grades}</p>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="space-y-6">

                        {/* Effects */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Mekanik Özellik Etkileri" : "Effect on Mechanical Properties"}
                          </h3>
                          <ul className="space-y-2">
                            {inc.effects.map((e, i) => (
                              <li key={i} className="flex gap-2 text-dark-200 text-sm leading-relaxed">
                                <span className="text-red-400 mt-0.5 shrink-0">▸</span>
                                {e}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Corrective */}
                        <div>
                          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 mb-2 pb-1.5 border-b border-white/[0.06]">
                            {lang === "tr" ? "Düzeltici Proses Faaliyetleri" : "Corrective Process Actions"}
                          </h3>
                          <ul className="space-y-2">
                            {inc.corrective.map((c, i) => (
                              <li key={i} className="flex gap-2 text-dark-200 text-sm leading-relaxed">
                                <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Quick Reference Table ── */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            {lang === "tr" ? "Hızlı Karşılaştırma Tablosu" : "Quick Comparison Table"}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  {[
                    lang === "tr" ? "İnklüzyon" : "Inclusion",
                    lang === "tr" ? "ASTM Tipi" : "ASTM Type",
                    lang === "tr" ? "Sertlik (HV)" : "Hardness (HV)",
                    lang === "tr" ? "Hadde Def." : "Hot Deform.",
                    lang === "tr" ? "Tanımlayıcı EDS" : "Key EDS Peak",
                    lang === "tr" ? "Başlıca Risk" : "Primary Risk",
                  ].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "MnS",          astm: "A",       hv: "120–160",   def: lang === "tr" ? "Evet" : "Yes", eds: "Mn 5.90, S 2.31",        risk: lang === "tr" ? "HIC, enine tokluk" : "HIC, transverse toughness" },
                  { name: "Al₂O₃",        astm: "B",       hv: "~2000",     def: lang === "tr" ? "Hayır" : "No",  eds: "Al 1.49",                risk: lang === "tr" ? "Yorulma, nozul" : "Fatigue, nozzle clogging" },
                  { name: "Silikat",       astm: "C",       hv: "600–800",   def: lang === "tr" ? "Evet" : "Yes", eds: "Si 1.74",                risk: lang === "tr" ? "Süneklik, yüzey" : "Ductility, surface" },
                  { name: "Ca-Alüminat",   astm: "D",       hv: "600–900",   def: lang === "tr" ? "Kısmen" : "Partly", eds: "Ca 3.69, Al 1.49",  risk: lang === "tr" ? "Genellikle iyi" : "Generally benign" },
                  { name: "TiN",           astm: "D",       hv: "2000–2400", def: lang === "tr" ? "Hayır" : "No",  eds: "Ti 4.51",               risk: lang === "tr" ? "Yorulma (kaba)" : "Fatigue (coarse)" },
                  { name: "Nb(C,N)",       astm: lang === "tr" ? "Alt sınır" : "Sub-limit", hv: "~2000", def: lang === "tr" ? "Hayır" : "No", eds: "Nb 2.17", risk: lang === "tr" ? "GB çökelme (aşırı)" : "GB precipitation" },
                  { name: "MgO·Al₂O₃",    astm: "B",       hv: "~2300",     def: lang === "tr" ? "Hayır" : "No",  eds: "Mg 1.25, Al 1.49",      risk: lang === "tr" ? "Nozul, yorulma" : "Nozzle, fatigue" },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-white/[0.04] ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"} hover:bg-white/[0.03] transition-colors`}>
                    <td className="px-4 py-3 font-mono text-dark-50 font-medium">{row.name}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs border border-gold-400/20 text-gold-400 px-1.5 py-0.5 rounded bg-gold-400/5">{row.astm}</span></td>
                    <td className="px-4 py-3 font-mono text-dark-300 text-xs">{row.hv}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs ${row.def === "Evet" || row.def === "Yes" ? "text-green-400" : row.def === "Kısmen" || row.def === "Partly" ? "text-yellow-400" : "text-red-400"}`}>
                        {row.def}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-dark-300">{row.eds} keV</td>
                    <td className="px-4 py-3 text-dark-300 text-xs">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Standard References ── */}
        <div className="mt-10 p-5 bg-gold-400/[0.03] border border-gold-400/15 rounded-xl">
          <p className="text-xs text-dark-400 leading-relaxed font-mono">
            <span className="text-gold-400 font-semibold">{lang === "tr" ? "Standart Referanslar: " : "Standard References: "}</span>
            ASTM E45 (Standard Test Methods for Determining the Inclusion Content of Steel) ·
            ISO 4967 (Steel — Determination of content of non-metallic inclusions) ·
            DIN 50602 (Microscopic examination of special steels) ·
            ASTM E2142 (EDS Characterization of inclusions)
          </p>
        </div>

      </div>
    </div>
  );
}
