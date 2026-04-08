"use client";

export default function FormulasView({ lang }) {
  const isTr = lang === "tr";

  const formulas = [
    {
      title: isTr ? "Snell Yasası (Snell's Law)" : "Snell's Law",
      desc: isTr ? "Farklı ortamlardaki ses hızlarına bağlı olarak kırılma açısını hesaplar." : "Calculates the angle of refraction based on sound velocities in different mediums.",
      formula: "sin(θ₁) / V₁ = sin(θ₂) / V₂",
      vars: [
        { sym: "θ₁", desc: isTr ? "Geliş açısı" : "Angle of incidence" },
        { sym: "V₁", desc: isTr ? "1. Ortamdaki ses hızı" : "Sound velocity in medium 1" },
        { sym: "θ₂", desc: isTr ? "Kırılma açısı" : "Angle of refraction" },
        { sym: "V₂", desc: isTr ? "2. Ortamdaki ses hızı" : "Sound velocity in medium 2" },
      ],
    },
    {
      title: isTr ? "Ses Yolu (Sound Path - S)" : "Sound Path (S)",
      desc: isTr ? "Sesin probdan çıkıp yansıtıcıya gidip dönmesi için geçen süreye bağlı mesafe." : "The distance the sound travels from the probe to the reflector and back.",
      formula: "S = (v × t) / 2",
      vars: [
        { sym: "v", desc: isTr ? "Malzemedeki ses hızı (m/s)" : "Sound velocity in material (m/s)" },
        { sym: "t", desc: isTr ? "Gidiş-dönüş süresi (µs)" : "Time of flight (µs)" },
      ],
    },
    {
      title: isTr ? "Yüzey Mesafesi (PA - X)" : "Surface Distance / PA (X)",
      desc: isTr ? "Kusurun probun çıkış noktasına olan yatay uzaklığı." : "The horizontal distance from the probe exit point to the flaw.",
      formula: "X = S × sin(θ)",
      vars: [
        { sym: "S", desc: isTr ? "Ses yolu (mm)" : "Sound path (mm)" },
        { sym: "θ", desc: isTr ? "Prob açısı" : "Probe angle" },
      ],
    },
    {
      title: isTr ? "Derinlik (RA - Y)" : "Depth / RA (Y)",
      desc: isTr ? "Kusurun yüzeyden olan dikey derinliği." : "The vertical depth of the flaw from the surface.",
      formula: "Y = S × cos(θ)",
      vars: [
        { sym: "S", desc: isTr ? "Ses yolu (mm)" : "Sound path (mm)" },
        { sym: "θ", desc: isTr ? "Prob açısı" : "Probe angle" },
      ],
    },
    {
      title: isTr ? "Dalga Boyu (λ)" : "Wavelength (λ)",
      desc: isTr ? "Bir tam dalganın fiziksel uzunluğu. Hata tespit edilebilirliğini belirler (λ/2)." : "The physical length of one full wave. Determines flaw detectability (λ/2).",
      formula: "λ = v / f",
      vars: [
        { sym: "v", desc: isTr ? "Ses hızı (m/s)" : "Sound velocity (m/s)" },
        { sym: "f", desc: isTr ? "Frekans (Hz)" : "Frequency (Hz)" },
      ],
    },
    {
      title: isTr ? "Yakın Alan (Near Field - N)" : "Near Field (N)",
      desc: isTr ? "Ses demetinin dalgalandığı ve genliklerin düzensiz olduğu bölge uzunluğu." : "The region where the sound beam fluctuates and amplitudes are irregular.",
      formula: "N = D² / (4 × λ)",
      vars: [
        { sym: "D", desc: isTr ? "Kristal çapı (mm)" : "Transducer diameter (mm)" },
        { sym: "λ", desc: isTr ? "Dalga boyu (mm)" : "Wavelength (mm)" },
      ],
    },
    {
      title: isTr ? "Demet Yayılması (Beam Spread - γ)" : "Beam Spread (γ)",
      desc: isTr ? "Uzak alanda ses demetinin yayılma açısı." : "The angle of beam spread in the far field.",
      formula: "sin(γ) = 1.22 × (λ / D)",
      vars: [
        { sym: "γ", desc: isTr ? "Yarım yayılma açısı" : "Half beam spread angle" },
        { sym: "λ", desc: isTr ? "Dalga boyu (mm)" : "Wavelength (mm)" },
        { sym: "D", desc: isTr ? "Kristal çapı (mm)" : "Transducer diameter (mm)" },
      ],
    },
    {
      title: isTr ? "Akustik Empedans (Z)" : "Acoustic Impedance (Z)",
      desc: isTr ? "Malzemenin ses dalgalarının geçişine gösterdiği direnç." : "The resistance of a material to the passage of sound waves.",
      formula: "Z = ρ × v",
      vars: [
        { sym: "ρ", desc: isTr ? "Malzeme yoğunluğu (kg/m³)" : "Material density (kg/m³)" },
        { sym: "v", desc: isTr ? "Ses hızı (m/s)" : "Sound velocity (m/s)" },
      ],
    },
    {
      title: isTr ? "Yansıma Katsayısı (R)" : "Reflection Coefficient (R)",
      desc: isTr ? "İki farklı ortam sınırında sesin ne kadarının yansıyacağını belirtir." : "Indicates how much sound will reflect at the boundary of two different mediums.",
      formula: "R = [ (Z₂ − Z₁) / (Z₂ + Z₁) ]²",
      vars: [
        { sym: "Z₁", desc: isTr ? "1. Ortamın akustik empedansı" : "Acoustic impedance of medium 1" },
        { sym: "Z₂", desc: isTr ? "2. Ortamın akustik empedansı" : "Acoustic impedance of medium 2" },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-700 pb-2">
          {isTr ? "Ultrasonik Muayene (UT) Temel Formülleri" : "Ultrasonic Testing (UT) Basic Formulas"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formulas.map((item, idx) => (
            <div key={idx} className="bg-neutral-800 border border-neutral-700 rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-400 mb-4">{item.desc}</p>
              <div className="bg-neutral-950 rounded p-4 mb-4 flex items-center justify-center border border-neutral-800">
                <code className="text-green-400 text-lg font-mono tracking-wider">{item.formula}</code>
              </div>
              <div className="space-y-1">
                {item.vars.map((v, vIdx) => (
                  <div key={vIdx} className="flex text-sm">
                    <span className="text-yellow-400 font-mono w-8 font-bold">{v.sym}</span>
                    <span className="text-neutral-500 mx-2">=</span>
                    <span className="text-neutral-300">{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
