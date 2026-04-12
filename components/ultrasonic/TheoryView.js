"use client";

export default function TheoryView({ lang }) {
  const isTr = lang === "tr";

  const sections = [
    {
      title: isTr ? "1. Piezoelektrik Etki ve Dalga Üretimi" : "1. Piezoelectric Effect and Wave Generation",
      content: isTr ? (
        <>
          <p>Ultrasonik muayenenin temelini <strong>Piezoelektrik Etki</strong> oluşturur. Prob içerisindeki kristale (örn. Kuvars, PZT - Kurşun Zirkonat Titanat) alternatif akım uygulandığında kristal titreşir ve yüksek frekanslı mekanik ses dalgaları üretir (Ters Piezoelektrik Etki).</p>
          <p>Malzemeden yansıyıp geri dönen ses dalgaları kristale çarptığında ise mekanik baskı oluşturarak elektrik sinyaline dönüşür (Doğrudan Piezoelektrik Etki). Bu sinyaller cihaz tarafından işlenerek A-Scan ekranında genlik (amplitude) olarak gösterilir.</p>
        </>
      ) : (
        <>
          <p>The foundation of ultrasonic testing is the <strong>Piezoelectric Effect</strong>. When an alternating current is applied to the crystal (e.g., Quartz, PZT - Lead Zirconate Titanate) inside the probe, it vibrates and generates high-frequency mechanical sound waves (Inverse Piezoelectric Effect).</p>
          <p>When reflected sound waves return and hit the crystal, they create mechanical pressure that is converted back into an electrical signal (Direct Piezoelectric Effect). These signals are processed by the flaw detector and displayed as amplitude on the A-Scan.</p>
        </>
      ),
    },
    {
      title: isTr ? "2. Ses Dalgası Türleri (Wave Modes)" : "2. Wave Modes",
      content: isTr ? (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Boyuna Dalgalar (Longitudinal / Compression Waves):</strong> Parçacık titreşim yönü, dalganın yayılma yönüne paraleldir. Katı, sıvı ve gazlarda yayılabilirler. En hızlı dalga türüdür (Çelikte ~5920 m/s). Düz problar (0°) bu dalgayı üretir.</li>
          <li><strong>Enine Dalgalar (Transverse / Shear Waves):</strong> Parçacık titreşim yönü, dalganın yayılma yönüne diktir. Sadece katılarda yayılabilirler. Boyuna dalgaların yaklaşık yarısı hızındadır (Çelikte ~3240 m/s). Açılı problar (örn. 45°, 60°, 70°) genellikle bu dalgayı kullanır.</li>
          <li><strong>Yüzey Dalgaları (Rayleigh Waves):</strong> Sadece malzemenin yüzeyinde (yaklaşık 1 dalga boyu derinliğinde) yayılırlar. Parçacıklar eliptik bir yörünge çizer.</li>
          <li><strong>Plaka Dalgaları (Lamb Waves):</strong> Kalınlığı dalga boyuna yakın olan ince levhalarda oluşur. Simetrik ve asimetrik modları vardır.</li>
        </ul>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Longitudinal (Compression) Waves:</strong> Particle motion is parallel to the direction of wave propagation. They can travel through solids, liquids, and gases. It is the fastest wave mode (~5920 m/s in steel). Straight probes (0°) generate this wave.</li>
          <li><strong>Transverse (Shear) Waves:</strong> Particle motion is perpendicular to the direction of wave propagation. They can only travel through solids. Their velocity is roughly half of longitudinal waves (~3240 m/s in steel). Angle probes (e.g., 45°, 60°, 70°) typically use this wave.</li>
          <li><strong>Surface (Rayleigh) Waves:</strong> Travel only on the surface of the material (penetrating to a depth of about one wavelength). Particles follow an elliptical orbit.</li>
          <li><strong>Plate (Lamb) Waves:</strong> Occur in thin plates where the thickness is comparable to the wavelength. They have symmetric and asymmetric modes.</li>
        </ul>
      ),
    },
    {
      title: isTr ? "3. Akustik Empedans ve Arayüzeyler" : "3. Acoustic Impedance and Interfaces",
      content: isTr ? (
        <>
          <p><strong>Akustik Empedans (Z):</strong> Bir malzemenin ses dalgalarının geçişine gösterdiği dirençtir. Yoğunluk (ρ) ve ses hızının (V) çarpımına eşittir (Z = ρ × V).</p>
          <p>Ses dalgası iki farklı malzemenin sınırına (arayüzey) ulaştığında, enerjinin bir kısmı yansır, bir kısmı ise kırılarak (Snell Yasası) diğer ortama geçer. Yansıma miktarı, iki ortamın akustik empedansları arasındaki farka bağlıdır.</p>
          <p className="bg-neutral-950 p-3 rounded border border-neutral-800 text-sm">
            <em>Not:</em> Çelik ile hava arasındaki akustik empedans farkı çok büyüktür. Bu nedenle sesin neredeyse %99.9&apos;u yansır. Probdan malzemeye sesin geçebilmesi için aradaki havayı yok eden bir <strong>Temas Sıvısı (Couplant)</strong> (örn. yağ, su, jel) kullanılması zorunludur.
          </p>
        </>
      ) : (
        <>
          <p><strong>Acoustic Impedance (Z):</strong> The resistance a material presents to the passage of sound waves. It is the product of density (ρ) and sound velocity (V) (Z = ρ × V).</p>
          <p>When a sound wave reaches the boundary (interface) of two different materials, some energy is reflected, and some is transmitted/refracted (Snell&apos;s Law) into the second medium. The amount of reflection depends on the acoustic impedance mismatch between the two media.</p>
          <p className="bg-neutral-950 p-3 rounded border border-neutral-800 text-sm">
            <em>Note:</em> The acoustic impedance mismatch between steel and air is massive, causing ~99.9% of the sound to reflect. To transmit sound from the probe into the material, a <strong>Couplant</strong> (e.g., oil, water, gel) must be used to eliminate the air gap.
          </p>
        </>
      ),
    },
    {
      title: isTr ? "4. Ses Demeti Karakteristiği" : "4. Beam Characteristics",
      content: isTr ? (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Yakın Alan (Near Field / Fresnel Zone):</strong> Prob yüzeyinin hemen önündeki bölgedir. Kristalden çıkan dalgaların yapıcı ve yıkıcı girişimleri (interference) nedeniyle ses şiddeti (genlik) bu bölgede aşırı dalgalanmalar gösterir. Yakın alanda hata boyutlandırması yapmak güvenilir değildir. Uzunluğu N = D² / 4λ formülü ile hesaplanır.</li>
          <li><strong>Uzak Alan (Far Field / Fraunhofer Zone):</strong> Yakın alandan sonra başlayan bölgedir. Bu bölgede ses demeti konik bir şekilde yayılmaya başlar (Beam Spread) ve ses şiddeti mesafenin karesiyle ters orantılı olarak azalır (Ters Kare Yasası). Hata değerlendirmeleri her zaman uzak alanda yapılmalıdır.</li>
        </ul>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Near Field (Fresnel Zone):</strong> The region immediately in front of the transducer. Due to constructive and destructive interference of the waves, the sound intensity (amplitude) fluctuates wildly in this zone. Flaw sizing in the near field is unreliable. Its length is calculated by N = D² / 4λ.</li>
          <li><strong>Far Field (Fraunhofer Zone):</strong> The region beyond the near field. Here, the sound beam begins to spread out conically (Beam Spread), and the sound intensity drops inversely proportional to the square of the distance (Inverse Square Law). Flaw evaluation should always be performed in the far field.</li>
        </ul>
      ),
    },
    {
      title: isTr ? "5. Zayıflama (Attenuation)" : "5. Attenuation",
      content: isTr ? (
        <>
          <p>Ses dalgası malzeme içinde ilerlerken enerjisi giderek azalır. Bu duruma zayıflama denir ve iki ana nedeni vardır:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Saçılma (Scattering):</strong> Malzemenin tane yapısı (grain structure) veya küçük inklüzyonlar nedeniyle sesin farklı yönlere dağılmasıdır. İri taneli malzemelerde (örn. dökme demir, östenitik paslanmaz çelik) saçılma çok yüksektir.</li>
            <li><strong>Soğurma (Absorption):</strong> Mekanik ses enerjisinin malzeme içinde sürtünme yoluyla ısı enerjisine dönüşmesidir. Plastik ve kauçuk gibi malzemelerde soğurma yüksektir.</li>
          </ul>
        </>
      ) : (
        <>
          <p>As a sound wave travels through a material, its energy gradually decreases. This is called attenuation, and it has two main causes:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Scattering:</strong> The dispersion of sound in different directions due to the material&apos;s grain structure or small inclusions. Coarse-grained materials (e.g., cast iron, austenitic stainless steel) exhibit high scattering.</li>
            <li><strong>Absorption:</strong> The conversion of mechanical sound energy into heat energy through internal friction within the material. Materials like plastics and rubber have high absorption.</li>
          </ul>
        </>
      ),
    },
    {
      title: isTr ? "6. Hata Boyutlandırma Teknikleri" : "6. Defect Sizing Techniques",
      content: isTr ? (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>6 dB Düşüş Yöntemi (Half-Amplitude Drop):</strong> Ses demetinden daha büyük olan hataların (örn. laminasyon) sınırlarını belirlemek için kullanılır. Prob hatanın üzerinde gezdirilir, yankı genliğinin maksimum değerinin yarısına (6 dB düşüş) ulaştığı noktalar hatanın sınırları olarak kabul edilir.</li>
          <li><strong>20 dB Düşüş Yöntemi:</strong> Ses demetinden daha küçük hataların boyutlandırılmasında kullanılır. Genliğin %10&apos;a (20 dB) düştüğü noktalar baz alınır.</li>
          <li><strong>DAC (Distance Amplitude Correction):</strong> Aynı boyuttaki hataların, probdan uzaklaştıkça zayıflama ve demet yayılması nedeniyle daha düşük genlik vermesini telafi eden bir referans eğrisidir.</li>
          <li><strong>DGS / AVG (Distance Gain Size):</strong> Belirli bir prob için teorik olarak hesaplanmış, mesafe, kazanç ve eşdeğer reflektör (düz tabanlı delik - FBH) boyutu arasındaki ilişkiyi gösteren diyagramlardır.</li>
        </ul>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>6 dB Drop Method (Half-Amplitude Drop):</strong> Used to size flaws that are larger than the sound beam (e.g., laminations). The probe is scanned over the flaw, and the boundaries are marked where the echo amplitude drops to half of its maximum value (a 6 dB drop).</li>
          <li><strong>20 dB Drop Method:</strong> Used for sizing flaws smaller than the sound beam. The boundaries are marked where the amplitude drops to 10% (20 dB) of its peak.</li>
          <li><strong>DAC (Distance Amplitude Correction):</strong> A reference curve that compensates for the fact that identical flaws produce lower amplitude echoes as their distance from the probe increases, due to attenuation and beam spread.</li>
          <li><strong>DGS / AVG (Distance Gain Size):</strong> Theoretically calculated diagrams for a specific probe that show the relationship between distance, gain, and equivalent reflector size (Flat Bottom Hole - FBH).</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-neutral-700 pb-2 flex items-center gap-3">
          {isTr ? "Ultrasonik Muayene (UT) Teorik Bilgiler" : "Ultrasonic Testing (UT) Theory & Information"}
        </h2>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">{section.title}</h3>
              <div className="text-neutral-300 leading-relaxed space-y-3 text-sm md:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
