// ─────────────────────────────────────────────────────────────────────────────
// lib/seoFaqData.js — Sayfa bazlı SSS içeriği (TR/EN)
//
// Kullanım: layout.js içinde faqPageLd(FAQ.hardness) + <FaqSection items={FAQ.hardness}/>
// İçerik kuralı: her cevap standart referanslı, metalurjik mekanizma içeren,
// 2-4 cümlelik teknik açıklama. Pazarlama dili yok.
// ─────────────────────────────────────────────────────────────────────────────

export const FAQ = {
  // ── /tools/hardness ────────────────────────────────────────────────────────
  hardness: [
    {
      q: { tr: "HRC–HV dönüşümü hangi standarda göre yapılır ve ne kadar güvenilirdir?", en: "Which standard governs HRC–HV conversion and how reliable is it?" },
      a: {
        tr: "Dönüşümler ASTM E140 ve ISO 18265'teki malzeme grubuna özgü ampirik tablolara dayanır; skalalar arasında fiziksel bir birebir ilişki yoktur. Farklı uç geometrisi, yük ve pekleşme davranışı nedeniyle dönüşüm belirsizliği tipik olarak ±2 HRC mertebesindedir. Kabul kriterine yakın değerlerde dönüşüm yerine doğrudan ilgili skalada ölçüm yapılmalıdır.",
        en: "Conversions rely on the material-group-specific empirical tables of ASTM E140 and ISO 18265; there is no physical one-to-one relationship between scales. Due to differing indenter geometry, load and work-hardening response, conversion uncertainty is typically on the order of ±2 HRC. Near acceptance limits, measure directly in the specified scale instead of converting.",
      },
    },
    {
      q: { tr: "Sertlikten çekme mukavemeti (UTS) tahmini hangi çeliklerde geçerlidir?", en: "For which steels is tensile strength (UTS) estimation from hardness valid?" },
      a: {
        tr: "HV–Rm korelasyonu (ISO 18265 Tablo A.1) ferritik-perlitik ve temperlenmiş martenzitik yapılarda iyi çalışır; yaklaşık Rm ≈ 3,2 × HV ilişkisi geçerlidir. Soğuk deforme edilmiş, östenitik veya yüksek pekleşme üslü (n) malzemelerde sapma büyür. DP çelikleri gibi çift fazlı yapılarda yüzey sertliği martenzit oranını yansıttığından tahmin sistematik olarak sapabilir.",
        en: "The HV–Rm correlation (ISO 18265 Table A.1) works well for ferritic-pearlitic and quench-and-tempered structures, following approximately Rm ≈ 3.2 × HV. Deviation grows for cold-worked, austenitic or high strain-hardening-exponent (n) materials. In dual-phase steels the surface hardness reflects local martensite fraction, so the estimate can be systematically biased.",
      },
    },
    {
      q: { tr: "HBW ile HB/HBS arasındaki fark nedir?", en: "What is the difference between HBW and HB/HBS?" },
      a: {
        tr: "HBW tungsten karbür bilye ile ölçülen Brinell sertliğidir; çelik bilyeli HBS, bilyenin 450 HB üzerinde plastik deformasyona uğraması nedeniyle ASTM E10 ve ISO 6506'dan çıkarılmıştır. Modern sertifikalarda yalnızca HBW raporlanmalıdır. Geçerli iz için d/D oranı 0,24–0,6 aralığında olmalıdır.",
        en: "HBW is Brinell hardness measured with a tungsten carbide ball; steel-ball HBS was withdrawn from ASTM E10 and ISO 6506 because the ball itself deforms plastically above ~450 HB. Modern certificates should report HBW only. A valid indentation requires a d/D ratio between 0.24 and 0.6.",
      },
    },
    {
      q: { tr: "Kaynak HAZ sertlik haritalamasında hangi yöntem kullanılmalı?", en: "Which method should be used for weld HAZ hardness mapping?" },
      a: {
        tr: "HAZ profili için EN ISO 9015-1/-2 kapsamında Vickers HV10 veya HV5 tercih edilir; iz küçüklüğü CGHAZ gibi dar bölgelerin çözünürlüğünü sağlar. PWHT'siz C-Mn çeliklerinde tipik üst sınır 380 HV10 (EN ISO 15614-1), sour servis için ISO 15156-2 sınırı 250 HV'dir. Rockwell iz boyutu HAZ genişliğine göre büyük olduğundan bölgesel haritalamada uygun değildir.",
        en: "For HAZ profiling, Vickers HV10 or HV5 per EN ISO 9015-1/-2 is preferred; the small indent resolves narrow zones such as the CGHAZ. Typical as-welded limit for C-Mn steels is 380 HV10 (EN ISO 15614-1), while ISO 15156-2 imposes 250 HV for sour service. Rockwell indents are too large relative to HAZ width for zone mapping.",
      },
    },
  ],

  // ── /tools/dwtt ────────────────────────────────────────────────────────────
  dwttTool: [
    {
      q: { tr: "DWTT ile Charpy testi arasındaki temel fark nedir?", en: "What is the fundamental difference between DWTT and Charpy testing?" },
      a: {
        tr: "Charpy V-çentik testi 10×10 mm alt boyutlu numunede kırılma başlamasını (initiation) karakterize eder; DWTT ise tam et kalınlığında numune ile çatlak yayılmasını (propagation) temsil eder. Boru hattında sünek kırılma durdurma (crack arrest) kabiliyeti DWTT kesme alanı (shear area) ile değerlendirilir. Bu nedenle API 5L PSL2'de büyük çaplı borularda her iki test birlikte istenir.",
        en: "The Charpy V-notch test characterizes fracture initiation on a sub-size 10×10 mm specimen, whereas DWTT uses a full-wall-thickness specimen and represents crack propagation. Ductile crack-arrest capability of a pipeline is assessed via DWTT shear area. This is why API 5L PSL2 requires both tests for large-diameter pipe.",
      },
    },
    {
      q: { tr: "API 5L'de %85 shear area kriteri nasıl uygulanır?", en: "How is the 85% shear area criterion applied in API 5L?" },
      a: {
        tr: "API 5L Annex G (PSL2) uyarınca, belirtilen test sıcaklığında (genellikle 0 °C veya sipariş sözleşmesindeki minimum tasarım sıcaklığı) iki numunenin ortalama kesme alanı ≥ %85 olmalıdır. Değerlendirme ASTM E436'ya göre kırılma yüzeyinin sünek (shear) oranının ölçümüyle yapılır. Çentik ve çekiç temas bölgeleri (her biri bir et kalınlığı) değerlendirme dışıdır.",
        en: "Per API 5L Annex G (PSL2), the average shear area of two specimens must be ≥ 85% at the specified test temperature (typically 0 °C or the agreed minimum design temperature). Evaluation follows ASTM E436 by measuring the ductile (shear) fraction of the fracture surface. The notch and hammer-contact regions (one wall thickness each) are excluded from rating.",
      },
    },
    {
      q: { tr: "Yüksek tokluklu TMCP çeliklerinde görülen 'inverse fracture' nedir?", en: "What is 'inverse fracture' observed in high-toughness TMCP steels?" },
      a: {
        tr: "Ters (abnormal/inverse) kırılma, çentik tarafı tamamen sünek ilerlerken çekiç darbe bölgesinde klivaj görünümlü bölge oluşmasıdır; yüksek Charpy enerjili modern X70/X80 TMCP çeliklerinde görülür. Mekanizma, darbe bölgesindeki yoğun plastik deformasyonun (pre-strain) yerel tokluğu düşürmesiyle ilişkilendirilir. Bu durumda sonuç değerlendirmesi ve yeniden test kuralları API 5L Annex G ve ilgili teknik literatüre göre yapılmalıdır.",
        en: "Inverse (abnormal) fracture is the appearance of a cleavage-like region at the hammer-impact zone while the notch side propagates fully ductile; it occurs in modern high-Charpy-energy X70/X80 TMCP steels. The mechanism is associated with severe local plastic pre-strain at the impact zone reducing local toughness. Rating and retest provisions then follow API 5L Annex G and the relevant technical literature.",
      },
    },
    {
      q: { tr: "DWTT hangi et kalınlığı aralığında geçerlidir?", en: "Over what wall-thickness range is DWTT valid?" },
      a: {
        tr: "ASTM E436 pres çentikli tam kalınlık numuneleri yaklaşık 3,2–19 mm aralığı için tanımlar; API 5L uygulamasında 19 mm üzeri et kalınlıklarında numune tek yüzeyden işlenerek inceltilebilir. Çok ince cidarlarda numune burkulması, kalın cidarlarda ise makine kapasitesi (düşürme enerjisi) sınırlayıcıdır. Test makinesi enerjisi, numuneyi tek vuruşta tam kırmaya yetecek şekilde seçilmelidir.",
        en: "ASTM E436 defines pressed-notch full-thickness specimens for roughly 3.2–19 mm; in API 5L practice, walls above 19 mm may be machined from one face to reduced thickness. Very thin walls are limited by specimen buckling, thick walls by machine capacity (available drop energy). The machine energy must be sufficient to break the specimen completely in a single impact.",
      },
    },
  ],

  // ── /tools/carbon-equivalent ───────────────────────────────────────────────
  carbonEquivalent: [
    {
      q: { tr: "CE(IIW) ve Pcm formüllerinden hangisi ne zaman kullanılmalı?", en: "When should CE(IIW) versus Pcm be used?" },
      a: {
        tr: "CE(IIW) = C+Mn/6+(Cr+Mo+V)/5+(Cu+Ni)/15 formülü C > %0,12 olan konvansiyonel C-Mn çelikleri için geliştirilmiştir. Pcm (Ito-Bessyo) düşük karbonlu (C ≤ %0,12) TMCP/HSLA çeliklerinde soğuk çatlama duyarlılığını daha iyi temsil eder; API 5L PSL2 de bu ayrımı esas alır. Yanlış formül seçimi ön ısıtma gereksinimini olduğundan düşük veya yüksek gösterebilir.",
        en: "CE(IIW) = C+Mn/6+(Cr+Mo+V)/5+(Cu+Ni)/15 was developed for conventional C-Mn steels with C > 0.12%. Pcm (Ito-Bessyo) better represents cold-cracking susceptibility of low-carbon (C ≤ 0.12%) TMCP/HSLA steels; API 5L PSL2 applies the same split. Choosing the wrong formula can under- or over-state the preheat requirement.",
      },
    },
    {
      q: { tr: "Hidrojen kaynaklı soğuk çatlama (HACC) mekanizması nedir?", en: "What is the mechanism of hydrogen-assisted cold cracking (HACC)?" },
      a: {
        tr: "HACC üç faktörün eşzamanlı varlığını gerektirir: difüze olabilir hidrojen, çatlamaya duyarlı sert mikroyapı (tipik olarak > 350–400 HV martenzit) ve süneklik sınırını aşan çekme gerilmesi. Çatlama genellikle kaynak sonrası 48 saat içinde, sıcaklık 200 °C altına düştükten sonra gelişir; bu nedenle NDT bekletme süresi uygulanır. Ön ısıtma t8/5 süresini uzatarak sert faz oluşumunu ve hidrojen kaçışını birlikte iyileştirir.",
        en: "HACC requires the simultaneous presence of diffusible hydrogen, a crack-susceptible hard microstructure (typically martensite > 350–400 HV) and tensile restraint stress. Cracking usually develops within 48 h after welding once the joint cools below ~200 °C, hence delayed NDT hold times. Preheat extends the t8/5 cooling time, simultaneously reducing hard-phase formation and promoting hydrogen effusion.",
      },
    },
    {
      q: { tr: "CET nedir ve EN 1011-2'de nasıl kullanılır?", en: "What is CET and how is it used in EN 1011-2?" },
      a: {
        tr: "CET = C+(Mn+Mo)/10+(Cr+Cu)/20+Ni/40, EN 1011-2 Yöntem B'nin karbon eşdeğeridir. Ön ısıtma sıcaklığı CET, et kalınlığı, difüze hidrojen içeriği (HD) ve ısı girdisinin fonksiyonu olarak hesaplanır. Yöntem A (CE-IIW tabanlı) ile Yöntem B aynı kaynak için farklı sonuç verebilir; hangi yöntemin sözleşmede geçerli olduğu netleştirilmelidir.",
        en: "CET = C+(Mn+Mo)/10+(Cr+Cu)/20+Ni/40 is the carbon equivalent of EN 1011-2 Method B. Preheat temperature is computed as a function of CET, wall thickness, diffusible hydrogen content (HD) and heat input. Method A (CE-IIW based) and Method B can yield different results for the same joint, so the contractually applicable method must be defined.",
      },
    },
    {
      q: { tr: "Hangi CE değerinin üzerinde ön ısıtma gerekir?", en: "Above what CE value is preheat required?" },
      a: {
        tr: "Kaba kılavuz olarak CE(IIW) < 0,40 iyi kaynaklanabilirlik, 0,40–0,45 koşullu, > 0,45 ön ısıtma gerektirir kabul edilir; ancak bu tek başına yeterli değildir. Kombine kalınlık, hidrojen sınıfı (H5/H10/H15), ısı girdisi ve mesnetlenme (restraint) belirleyicidir. Kesin değer EN 1011-2 veya AWS D1.1 Annex H prosedürüyle hesaplanmalıdır — bu araç her iki yöntemi de uygular.",
        en: "As a rough guide, CE(IIW) < 0.40 indicates good weldability, 0.40–0.45 conditional, and > 0.45 preheat required — but CE alone is insufficient. Combined thickness, hydrogen class (H5/H10/H15), heat input and restraint govern the result. The definitive value should be computed per EN 1011-2 or AWS D1.1 Annex H, both of which this tool implements.",
      },
    },
  ],

  // ── /tools/grain-size ──────────────────────────────────────────────────────
  grainSize: [
    {
      q: { tr: "ASTM E112 G numarası nasıl tanımlanır?", en: "How is the ASTM E112 grain size number G defined?" },
      a: {
        tr: "G numarası, 100× büyütmede 1 inç² alandaki tane sayısı N üzerinden N = 2^(G-1) bağıntısıyla tanımlanır. G büyüdükçe tane incelir: G=8 yaklaşık 22 µm, G=10 yaklaşık 11 µm ortalama tane çapına karşılık gelir. Ölçüm planimetrik (Jeffries) veya çizgi kesişim (Heyn intercept) yöntemiyle yapılabilir; intercept yöntemi eşeksenli olmayan yapılarda da uygulanabilir.",
        en: "G is defined via N = 2^(G-1), where N is the number of grains per square inch at 100× magnification. Higher G means finer grain: G=8 corresponds to ~22 µm and G=10 to ~11 µm mean grain diameter. Measurement may use the planimetric (Jeffries) or lineal intercept (Heyn) method; the intercept method also handles non-equiaxed structures.",
      },
    },
    {
      q: { tr: "Hall-Petch ilişkisi çelikte nasıl çalışır?", en: "How does the Hall-Petch relationship work in steel?" },
      a: {
        tr: "σy = σ0 + ky·d^(-1/2) bağıntısında tane sınırları dislokasyon hareketine bariyer oluşturur; ferrit için ky ≈ 17–23 MPa·mm^(1/2) mertebesindedir. Tane inceltme, mukavemeti artırırken DBTT'yi de düşüren tek güçlendirme mekanizmasıdır (Cottrell-Petch: ITT ∝ -ln d^(-1/2)). Bu nedenle HSLA ve S700MC gibi TMCP çeliklerinde Nb/Ti mikroalaşımlamayla östenit tane kontrolü esastır.",
        en: "In σy = σ0 + ky·d^(-1/2), grain boundaries act as barriers to dislocation motion; for ferrite, ky is on the order of 17–23 MPa·mm^(1/2). Grain refinement is the only strengthening mechanism that simultaneously raises strength and lowers DBTT (Cottrell-Petch: ITT scales with -ln d^(-1/2)). This is why austenite conditioning via Nb/Ti microalloying is central to TMCP steels such as HSLA and S700MC.",
      },
    },
    {
      q: { tr: "Intercept ve planimetrik yöntem arasındaki fark nedir?", en: "What is the difference between intercept and planimetric methods?" },
      a: {
        tr: "Planimetrik yöntem alan bazlı tane sayımıyla doğrudan N değerini verir ancak tane sınırı kararsızlıklarında sayım hatası büyür. Heyn intercept yöntemi test çizgilerinin sınır kesişimlerini sayar, daha hızlıdır ve istatistiksel olarak %10 göreli doğruluğa daha az ölçümle ulaşır. Uzamış (haddelenmiş) yapılarda yönlü intercept ölçümü ASTM E112'nin anizotropi prosedürüyle yapılmalıdır.",
        en: "The planimetric method counts grains per area and yields N directly, but counting error grows with ambiguous boundaries. The Heyn intercept method counts boundary intersections along test lines, is faster, and reaches 10% relative accuracy with fewer measurements. For elongated (rolled) structures, directional intercept counts should follow the anisotropy procedure of ASTM E112.",
      },
    },
    {
      q: { tr: "Önceki östenit tane boyutu (PAGS) neden ve nasıl ölçülür?", en: "Why and how is prior austenite grain size (PAGS) measured?" },
      a: {
        tr: "Sertleştirilmiş çeliklerde tokluk ve sertleşebilirlik, dönüşüm öncesi östenit tane boyutuyla belirlenir; iri PAGS klivaj facet boyutunu büyüterek DBTT'yi yükseltir. Ölçüm için McQuaid-Ehn karbürizasyon testi (ASTM E112 Annex), pikrik asit bazlı dağlama veya EBSD rekonstrüksiyonu kullanılır. Temperlenmiş martenzitik yapılarda doymuş pikrik + ıslatıcı ajan pratiği yaygındır.",
        en: "In hardened steels, toughness and hardenability are governed by the austenite grain size prior to transformation; coarse PAGS enlarges cleavage facets and raises DBTT. Measurement uses the McQuaid-Ehn carburizing test (ASTM E112 Annex), picric-acid-based etching, or EBSD reconstruction. Saturated picric with a wetting agent is common practice for tempered martensitic structures.",
      },
    },
  ],

  // ── /tools/cct-ttt ─────────────────────────────────────────────────────────
  cctTtt: [
    {
      q: { tr: "CCT ve TTT diyagramları arasındaki fark nedir?", en: "What is the difference between CCT and TTT diagrams?" },
      a: {
        tr: "TTT (izotermal) diyagram, östenitin sabit sıcaklıkta bekletilmesiyle elde edilir; CCT ise sürekli soğuma koşulunu temsil eder ve endüstriyel proseslerle (kaynak, haddeleme sonrası soğuma, su verme) doğrudan ilgilidir. CCT eğrileri TTT'ye göre daha uzun sürelere ve daha düşük sıcaklıklara kayar. Kaynak HAZ analizi için t8/5 soğuma süresi CCT üzerinden okunmalıdır.",
        en: "A TTT (isothermal) diagram is obtained by holding austenite at constant temperature; a CCT diagram represents continuous cooling and maps directly to industrial processes (welding, post-roll cooling, quenching). CCT curves are shifted to longer times and lower temperatures relative to TTT. For weld HAZ analysis, the t8/5 cooling time should be read against the CCT diagram.",
      },
    },
    {
      q: { tr: "Ms sıcaklığı bileşime nasıl bağlıdır?", en: "How does the Ms temperature depend on composition?" },
      a: {
        tr: "Andrews bağıntısına göre Ms(°C) ≈ 539 − 423C − 30,4Mn − 17,7Ni − 12,1Cr − 7,5Mo (ağırlıkça %); karbon en baskın terimdir. Ms'in düşmesi kalıntı östenit oranını artırır ve su verme çatlağı riskini yükseltir. Bor gibi mikroalaşım elementleri Ms'i pek değiştirmez ancak sertleşebilirliği (ferrit/beynit burnunu geciktirerek) güçlü etkiler.",
        en: "Per the Andrews relation, Ms(°C) ≈ 539 − 423C − 30.4Mn − 17.7Ni − 12.1Cr − 7.5Mo (wt%); carbon is the dominant term. A lower Ms increases retained austenite fraction and quench-cracking risk. Microalloying elements such as boron barely shift Ms but strongly affect hardenability by delaying the ferrite/bainite nose.",
      },
    },
    {
      q: { tr: "t8/5 soğuma süresi neden kritik bir parametredir?", en: "Why is the t8/5 cooling time a critical parameter?" },
      a: {
        tr: "800→500 °C aralığı, östenitin difüzyonel ve difüzyonsuz dönüşümlerinin gerçekleştiği penceredir; t8/5 bu penceredeki soğuma hızını tek sayıyla temsil eder. Kısa t8/5 (yüksek soğuma hızı) HAZ'da martenzit ve yüksek sertlik, aşırı uzun t8/5 ise tane irileşmesi ve tokluk kaybı üretir. EN 1011-2, ısı girdisi ve birleşim geometrisinden t8/5 hesabı için 2/3 boyutlu ısı akışı denklemleri verir.",
        en: "The 800→500 °C interval is the window in which both diffusional and displacive transformations of austenite occur; t8/5 condenses the cooling rate in this window into a single number. Short t8/5 (fast cooling) produces martensite and high HAZ hardness, while excessively long t8/5 causes grain coarsening and toughness loss. EN 1011-2 provides 2D/3D heat-flow equations to compute t8/5 from heat input and joint geometry.",
      },
    },
    {
      q: { tr: "Beynit ile martenzit oluşumu CCT üzerinde nasıl ayırt edilir?", en: "How are bainite and martensite formation distinguished on a CCT diagram?" },
      a: {
        tr: "Beynit, Bs altında ve Ms üzerinde, orta soğuma hızlarında C eğrisinin ikinci burnunda oluşur; martenzit ise soğuma eğrisi tüm difüzyonel burunları kestiğinde Ms altında atermal olarak gelişir. Kritik soğuma hızı, soğuma eğrisinin ferrit/beynit burnuna teğet geçtiği hızdır. Karışık beynit+martenzit yapılar, özellikle S700MC ve yüksek mukavemetli kaynak HAZ'larında tokluk açısından değerlendirilmelidir.",
        en: "Bainite forms below Bs and above Ms at intermediate cooling rates in the second nose of the C-curve; martensite forms athermally below Ms when the cooling curve misses all diffusional noses. The critical cooling rate is the one tangent to the ferrite/bainite nose. Mixed bainite+martensite structures deserve toughness scrutiny, particularly in S700MC and high-strength weld HAZs.",
      },
    },
  ],

  // ── /tools/preheat ─────────────────────────────────────────────────────────
  preheat: [
    {
      q: { tr: "Ön ısıtma metalurjik olarak neyi değiştirir?", en: "What does preheat change metallurgically?" },
      a: {
        tr: "Ön ısıtma t8/5 soğuma süresini uzatarak HAZ'da martenzit oranını ve pik sertliği düşürür; aynı zamanda birleşim 100 °C üzerinde daha uzun kaldığından difüze hidrojenin kaçışına zaman tanır. Üçüncü etkisi termal gradyanı ve dolayısıyla artık gerilmeyi azaltmasıdır. Bu üç mekanizma birlikte hidrojen kaynaklı soğuk çatlama (HACC) riskini kontrol eder.",
        en: "Preheat extends the t8/5 cooling time, lowering martensite fraction and peak HAZ hardness; it also keeps the joint above ~100 °C longer, allowing diffusible hydrogen to effuse. Its third effect is reducing thermal gradients and hence residual stress. Together these three mechanisms control hydrogen-assisted cold cracking (HACC).",
      },
    },
    {
      q: { tr: "EN 1011-2 Yöntem A ile Yöntem B arasındaki fark nedir?", en: "What is the difference between EN 1011-2 Method A and Method B?" },
      a: {
        tr: "Yöntem A, CE(IIW) tabanlıdır ve hidrojen skalası ile kombine kalınlık üzerinden nomogram yaklaşımı kullanır; Yöntem B, CET tabanlıdır ve ön ısıtmayı kapalı formül ile hesaplar. Yöntem B düşük alaşımlı yüksek mukavemetli çeliklerde genellikle daha gerçekçi (daha az tutucu) sonuç verir. Aynı birleşim için iki yöntem farklı sıcaklık önerebilir; sözleşmede geçerli yöntem tanımlanmalıdır.",
        en: "Method A is CE(IIW)-based and uses a nomogram approach with hydrogen scale and combined thickness; Method B is CET-based with a closed-form preheat equation. Method B is generally more realistic (less conservative) for low-alloy high-strength steels. The two methods may recommend different temperatures for the same joint, so the governing method must be contractually defined.",
      },
    },
    {
      q: { tr: "Pasolar arası sıcaklık (interpass) neden sınırlanır?", en: "Why is interpass temperature limited?" },
      a: {
        tr: "Alt sınır soğuk çatlama kontrolü için ön ısıtma sıcaklığına eşittir; üst sınır ise aşırı yavaş soğumanın getirdiği tane irileşmesi, tokluk kaybı ve mukavemet düşüşünü önler. TMCP ve QT çeliklerinde (ör. S690QL, S700MC) yüksek interpass, temperleme etkisiyle ana metal özelliklerini bozabilir; tipik üst sınır 200–250 °C aralığındadır. Ölçüm kaynak ağzından tanımlı mesafede temaslı pirometre ile yapılmalıdır.",
        en: "The lower bound equals the preheat temperature for cold-cracking control; the upper bound prevents grain coarsening, toughness loss and strength reduction from excessively slow cooling. In TMCP and QT steels (e.g. S690QL, S700MC) high interpass can degrade base-metal properties through self-tempering effects; typical caps are 200–250 °C. Measure with a contact pyrometer at a defined distance from the weld groove.",
      },
    },
    {
      q: { tr: "Hidrojen giderme ısıl işlemi (DHT) ne zaman gerekir?", en: "When is a dehydrogenation heat treatment (DHT) required?" },
      a: {
        tr: "Yüksek mesnetli kalın kesitlerde, CE'si yüksek çeliklerde veya H10 üzeri hidrojen sınıfındaki sarf malzemelerde, kaynak sonrası 200–300 °C aralığında 2–4 saat bekletme difüze hidrojeni etkin şekilde uzaklaştırır. DHT, PWHT'den farklıdır: amaç gerilim giderme değil hidrojen effüzyonudur ve dönüşüm sıcaklıklarının çok altında uygulanır. Soğumaya izin vermeden ön ısıtmadan doğrudan DHT'ye geçilmesi en güvenli pratiktir.",
        en: "For highly restrained thick sections, high-CE steels, or consumables above hydrogen class H10, holding at 200–300 °C for 2–4 h immediately after welding effectively removes diffusible hydrogen. DHT differs from PWHT: the goal is hydrogen effusion, not stress relief, and it is applied well below transformation temperatures. Transitioning directly from preheat to DHT without allowing cool-down is the safest practice.",
      },
    },
  ],

  // ── /mechanical-tests/cekme-testi ──────────────────────────────────────────
  cekmeTesti: [
    {
      q: { tr: "ReH ile Rp0.2 arasındaki fark nedir ve hangisi rapor edilir?", en: "What is the difference between ReH and Rp0.2, and which is reported?" },
      a: {
        tr: "ReH, belirgin akma gösteren malzemelerde (Lüders bantlı ferritik çelikler, ST37–ST52 dahil) üst akma noktasıdır; Rp0.2 ise belirgin akma göstermeyen malzemelerde %0,2 kalıcı uzamaya karşılık gelen gerilmedir. EN 10025 belgelendirmesinde belirgin akma varsa ReH raporlanır. DP600 gibi sürekli akan çeliklerde yalnızca Rp0.2 tanımlıdır.",
        en: "ReH is the upper yield point of materials showing discontinuous yielding (Lüders-banded ferritic steels, including ST37–ST52); Rp0.2 is the stress at 0.2% plastic strain for materials without a distinct yield point. EN 10025 certification reports ReH when discontinuous yielding is present. Continuously yielding steels such as DP600 are defined by Rp0.2 only.",
      },
    },
    {
      q: { tr: "A50 ile A5 (orantılı) uzama değerleri birbirine çevrilebilir mi?", en: "Can A50 and A5 (proportional) elongation values be converted?" },
      a: {
        tr: "Farklı ölçü uzunluklarında ölçülen uzamalar doğrudan karşılaştırılamaz; boyun verme bölgesinin katkısı ölçü uzunluğuna bağlıdır (Barba yasası). ISO 2566-1, karbon ve düşük alaşımlı çelikler için dönüşüm bağıntıları verir; orantılı numunede k = 5,65√S0 standardıdır. Uluslararası sipariş karşılaştırmalarında (ör. A50mm istenen ASTM sertifikası ile A5 raporlu EN sertifikası) bu dönüşüm dikkate alınmalıdır.",
        en: "Elongations measured over different gauge lengths are not directly comparable; the necking contribution depends on gauge length (Barba's law). ISO 2566-1 provides conversion relations for carbon and low-alloy steels; the proportional standard is k = 5.65√S0. This conversion matters when comparing international orders, e.g. an ASTM certificate requesting A50mm against an EN certificate reporting A5.",
      },
    },
    {
      q: { tr: "Pekleşme üssü n nasıl ölçülür ve neden önemlidir?", en: "How is the strain-hardening exponent n measured and why does it matter?" },
      a: {
        tr: "n değeri, ISO 6892-1/ASTM E646'ya göre üniform plastik uzama bölgesinde gerçek gerilme-gerçek birim şekil değişimi eğrisinin log-log eğiminden hesaplanır. Considère kriterine göre üniform uzama sınırında εu ≈ n olduğundan, n şekillendirilebilirliğin doğrudan göstergesidir. DP600'ün düşük başlangıç akma oranı ve yüksek başlangıç n'i, otomotiv parçalarında gerilme dağıtma kabiliyetinin temelidir.",
        en: "The n-value is computed per ISO 6892-1/ASTM E646 from the log-log slope of the true stress–true strain curve within the uniform elongation range. By the Considère criterion, uniform elongation satisfies εu ≈ n, making n a direct formability indicator. The low initial yield ratio and high initial n of DP600 underpin its strain-distribution capability in automotive parts.",
      },
    },
    {
      q: { tr: "Çekme hızı sonuçları nasıl etkiler?", en: "How does test speed affect tensile results?" },
      a: {
        tr: "Ferritik çelikler pozitif gerinim hızı duyarlılığına sahiptir: hız arttıkça akma dayanımı yükselir; bu etki alt akma platosunda belirgindir. ISO 6892-1:2019 Metot A (kapalı çevrim gerinim hızı kontrolü, önerilen) ile Metot B (gerilme hızı) arasında ReH farkı birkaç MPa–%2 mertebesine ulaşabilir. Uygunluk itirazlarında test hızı metodunun sertifikada tanımlı olması kritik önemdedir.",
        en: "Ferritic steels show positive strain-rate sensitivity: yield strength rises with speed, most visibly on the lower yield plateau. Between ISO 6892-1:2019 Method A (closed-loop strain-rate control, recommended) and Method B (stress-rate control), ReH differences can reach several MPa or ~2%. In conformity disputes, having the speed method defined on the certificate is critical.",
      },
    },
  ],

  // ── /mechanical-tests/darbe-testi ──────────────────────────────────────────
  darbeTesti: [
    {
      q: { tr: "Charpy alt raf ve üst raf enerjilerini ne belirler?", en: "What determines Charpy lower- and upper-shelf energies?" },
      a: {
        tr: "Alt rafta kırılma, klivajla ({100} düzlemlerinde transgranüler) ilerler ve enerji tane boyutu ile klivaj başlatıcı parçacıklara (iri karbürler, inklüzyonlar) bağlıdır. Üst rafta mekanizma mikroboşluk birleşmesidir; enerji sülfür içeriği, MnS morfolojisi ve inklüzyon hacim oranıyla ters orantılıdır. Bu nedenle Ca ile inklüzyon modifikasyonu ve düşük S, üst raf enerjisini doğrudan yükseltir.",
        en: "On the lower shelf, fracture proceeds by cleavage (transgranular on {100} planes) and energy is controlled by grain size and cleavage initiators (coarse carbides, inclusions). On the upper shelf the mechanism is microvoid coalescence; energy is inversely related to sulfur content, MnS morphology and inclusion volume fraction. Hence Ca inclusion modification and low S directly raise upper-shelf energy.",
      },
    },
    {
      q: { tr: "S355J2 ve K2 kalite ekleri ne anlama gelir?", en: "What do the S355J2 and K2 quality suffixes mean?" },
      a: {
        tr: "EN 10025-2'de kalite eki, garanti edilen Charpy V enerjisini ve test sıcaklığını kodlar: JR = 27 J / +20 °C, J0 = 27 J / 0 °C, J2 = 27 J / −20 °C, K2 = 40 J / −20 °C. Değer üç numunenin ortalamasıdır; tek değer ortalama şartının %70'inin altına inemez. Soğuk iklim yapıları ve dinamik yüklü konstrüksiyonlar için J2/K2 seçimi DBTT konumunu servis sıcaklığının altına çekme stratejisidir.",
        en: "In EN 10025-2 the suffix encodes guaranteed Charpy V energy and test temperature: JR = 27 J / +20 °C, J0 = 27 J / 0 °C, J2 = 27 J / −20 °C, K2 = 40 J / −20 °C. The value is the mean of three specimens; no single value may fall below 70% of the specified mean. Specifying J2/K2 for cold-climate or dynamically loaded structures is a strategy to shift DBTT below service temperature.",
      },
    },
    {
      q: { tr: "Alt boy (subsize) numune enerjisi tam boya nasıl ölçeklenir?", en: "How is subsize specimen energy scaled to full size?" },
      a: {
        tr: "10×7,5 ve 10×5 mm alt boy numunelerde enerji, kesit oranıyla lineer ölçeklenmez; çentik önü gerilme üç eksenliliği kalınlıkla değiştiğinden geçiş sıcaklığı da kayar. EN 10025 pratikte orantılı enerji şartı verir (ör. 10×5 için 27 J yerine ~%50'si değil, tabloda tanımlı değer). DBTT karşılaştırmalarında alt boy sonuçları tam boy eşdeğerine çevirmek için ampirik kaydırma bağıntıları kullanılmalı ve raporda numune kesiti mutlaka belirtilmelidir.",
        en: "For 10×7.5 and 10×5 mm subsize specimens, energy does not scale linearly with ligament area; notch-tip stress triaxiality changes with thickness, shifting the transition temperature as well. EN 10025 specifies proportional energy requirements in tabulated form rather than a simple ratio. For DBTT comparisons, empirical temperature-shift relations should be applied, and the specimen cross-section must always be stated on the report.",
      },
    },
    {
      q: { tr: "Charpy enerjisinden kırılma tokluğu (KIc) tahmin edilebilir mi?", en: "Can fracture toughness (KIc) be estimated from Charpy energy?" },
      a: {
        tr: "Barsom-Rolfe ve benzeri ampirik korelasyonlar geçiş ve üst raf bölgeleri için ayrı bağıntılar verir; ancak Charpy dinamik ve künt çentikli, KIc ise kvazistatik ve keskin çatlaklı test olduğundan korelasyon malzeme grubuna özgüdür. Yapısal bütünlük değerlendirmesinde (BS 7910, API 579) Charpy'den Master Curve T0 tahmini üzerinden ilerlemek daha savunulabilir bir yaklaşımdır. Doğrudan CTOD/J testi her zaman tercih edilir.",
        en: "Empirical correlations such as Barsom-Rolfe provide separate relations for the transition and upper-shelf regimes; but since Charpy is dynamic with a blunt notch while KIc is quasi-static with a sharp crack, correlations remain material-group specific. For structural integrity assessment (BS 7910, API 579), estimating the Master Curve T0 from Charpy data is the more defensible route. Direct CTOD/J testing is always preferred.",
      },
    },
  ],

  // ── /mechanical-tests/dwtt ─────────────────────────────────────────────────
  dwttGuide: [
    {
      q: { tr: "Pres çentik ile chevron çentik arasındaki fark nedir?", en: "What is the difference between pressed and chevron notches?" },
      a: {
        tr: "ASTM E436 standart numunesi pres çentiklidir: 5 mm derinlikte, keskin bir bıçakla soğuk basılır ve kırılmayı klivajla başlatacak deformasyon sertleşmiş bölge yaratır. Chevron çentik, başlatma enerjisini düşürmek için bazı özel durumlarda (yüksek tokluklu malzemede geçersiz kırılmayı önlemek) kullanılır. API 5L uygulamasında aksi kararlaştırılmadıkça pres çentik esastır.",
        en: "The ASTM E436 standard specimen uses a pressed notch: 5 mm deep, cold-pressed with a sharp tool, creating a work-hardened zone that initiates fracture in cleavage. Chevron notches are used in specific cases to reduce initiation energy (avoiding invalid fracture in very tough materials). In API 5L practice the pressed notch governs unless otherwise agreed.",
      },
    },
    {
      q: { tr: "Kesme alanı (shear area) nasıl ölçülür?", en: "How is shear area measured?" },
      a: {
        tr: "ASTM E436'ya göre çentik kökünden ve çekiç temas bölgesinden birer et kalınlığı dışlanır; kalan değerlendirme alanındaki sünek (mat, lifli, 45° eğimli) bölge oranı yüzde olarak raporlanır. Ölçüm cetvelle bölgesel, görüntü analiziyle planimetrik veya standart şablonlarla karşılaştırmalı yapılabilir. Klivaj (parlak, düz) ve sünek bölge sınırı geçiş sıcaklığı civarında dilimli olabilir; separasyonlar klivaj sayılmaz.",
        en: "Per ASTM E436, one wall thickness is excluded from the notch root and from the hammer-contact zone; the ductile fraction (dull, fibrous, 45° slant) of the remaining evaluation area is reported as a percentage. Measurement may be regional with a rule, planimetric with image analysis, or comparative using standard charts. Near the transition temperature, the cleavage/ductile boundary can be tongued; separations are not rated as cleavage.",
      },
    },
    {
      q: { tr: "DWTT geçiş eğrisi Charpy eğrisinden neden daha yüksek sıcaklıkta konumlanır?", en: "Why is the DWTT transition curve positioned at higher temperature than Charpy?" },
      a: {
        tr: "Tam kalınlıklı DWTT numunesi, alt boyutlu Charpy'ye göre daha yüksek gerilme üç eksenliliği ve daha büyük plastik bölge hacmi barındırır; kalınlık etkisi geçiş sıcaklığını yukarı kaydırır. Tipik olarak %85 SA-DWTT sıcaklığı, aynı çeliğin 27 J Charpy geçişinden 20–40 °C daha yüksektir. Bu nedenle boru hattı çatlak durdurma tasarımı Charpy yerine DWTT'ye dayandırılır.",
        en: "The full-thickness DWTT specimen carries higher stress triaxiality and a larger plastic zone volume than the subsize Charpy; the thickness effect shifts the transition upward. Typically the 85% SA DWTT temperature lies 20–40 °C above the 27 J Charpy transition of the same steel. This is why pipeline crack-arrest design is based on DWTT rather than Charpy.",
      },
    },
    {
      q: { tr: "Separasyon (delaminasyon) DWTT sonucunu nasıl etkiler?", en: "How do separations (delaminations) affect DWTT results?" },
      a: {
        tr: "Haddeleme yönüne paralel separasyonlar, sıcak hadde bantlaşması, uzamış MnS/segregasyon bantları veya kristalografik doku kaynaklıdır; kırılma yüzeyinde çatlak düzlemine dik yarıklar olarak görülür. Separasyon üç eksenliliği bozarak lokal gerilme durumunu düzlem gerilmeye yaklaştırır — görünür kesme alanını artırabilir ancak enerji absorpsiyonunu düşürebilir. Değerlendirmede separasyonlar klivaj sayılmaz; fakat yoğun separasyon, levha üretiminde merkez segregasyonu ve bantlaşma yönünden metalografik incelemeyi gerektirir.",
        en: "Separations parallel to the rolling plane originate from hot-rolling banding, elongated MnS/segregation bands or crystallographic texture; they appear as splits normal to the fracture plane. By relaxing triaxiality toward plane stress, separations can increase apparent shear area while reducing absorbed energy. They are not rated as cleavage, but pronounced separations warrant metallographic investigation of centerline segregation and banding in the plate.",
      },
    },
  ],

  // ── /mechanical-tests/sertlik-olcumu ──────────────────────────────────────
  sertlikOlcumu: [
    {
      q: { tr: "Vickers'ta yük seçimi sonucu etkiler mi?", en: "Does load selection affect Vickers results?" },
      a: {
        tr: "Makro aralıkta (HV5–HV100) sertlik yükten pratikçe bağımsızdır; mikro aralıkta (< 1 kgf) iz boyutu etkisi (ISE) nedeniyle ölçülen sertlik yük düştükçe artma eğilimi gösterir. Çok fazlı yapılarda küçük yük tek faza denk gelebilir; temsili ortalama için iz, mikroyapı ölçeğinin en az 3 katı olmalıdır. Karşılaştırılabilirlik için raporda yük daima belirtilir (ör. HV10).",
        en: "In the macro range (HV5–HV100) hardness is practically load-independent; in the micro range (< 1 kgf) the indentation size effect (ISE) tends to raise measured hardness as load decreases. In multiphase structures a small indent may sample a single phase; for a representative mean, the indent should span at least 3× the microstructural scale. The load must always be reported (e.g. HV10) for comparability.",
      },
    },
    {
      q: { tr: "Sour servis için 22 HRC / 250 HV sınırının metalurjik gerekçesi nedir?", en: "What is the metallurgical basis of the 22 HRC / 250 HV limit for sour service?" },
      a: {
        tr: "ISO 15156-2 / NACE MR0175, H2S ortamında sülfür gerilmeli çatlamaya (SSC) karşı karbon çeliklerinde 22 HRC (≈250 HV) üst sınırını tanımlar. Sertlik, mikro yapıdaki hidrojen tuzaklama ve çatlak başlatma duyarlılığının pratik göstergesidir: temperlenmemiş martenzit ve beynit adacıkları SSC başlangıç noktalarıdır. Kaynaklarda kep pasosu ve HAZ, en yüksek sertliğin ölçüldüğü kritik bölgelerdir.",
        en: "ISO 15156-2 / NACE MR0175 sets a 22 HRC (≈250 HV) cap for carbon steels against sulfide stress cracking (SSC) in H2S environments. Hardness is the practical proxy for hydrogen trapping and crack-initiation susceptibility of the microstructure: untempered martensite and bainite islands act as SSC initiation sites. In welds, the cap pass and HAZ are the critical zones where peak hardness occurs.",
      },
    },
    {
      q: { tr: "Rockwell, Vickers ve Brinell arasında yöntem seçimi neye göre yapılır?", en: "How is the choice made between Rockwell, Vickers and Brinell?" },
      a: {
        tr: "Brinell (HBW, geniş iz) döküm ve sıcak haddelenmiş yüzeylerde heterojenliği ortalamak için uygundur; Vickers tüm sertlik aralığında tek skala sunar ve ince kesit/kaplama/HAZ işlerinde standarttır; Rockwell hız ve operatör bağımsızlığı gerektiren seri üretim kabul testlerinde tercih edilir. Yüzey hazırlığı hassasiyeti Vickers'ta en yüksek, Brinell'de en düşüktür. Kalibrasyon ve dolaylı doğrulama ISO 6506/6507/6508 serilerine göre yapılır.",
        en: "Brinell (HBW, large indent) suits cast and hot-rolled surfaces where heterogeneity must be averaged; Vickers offers a single continuous scale and is standard for thin sections, coatings and HAZ work; Rockwell is preferred for high-throughput acceptance testing requiring speed and operator independence. Surface-preparation sensitivity is highest for Vickers, lowest for Brinell. Calibration and indirect verification follow the ISO 6506/6507/6508 series.",
      },
    },
    {
      q: { tr: "Sertlik taraması (hardness traverse) kaynak kalifikasyonunda nasıl planlanır?", en: "How is a hardness traverse planned in weld qualification?" },
      a: {
        tr: "EN ISO 9015-1 uyarınca iz dizileri ana metal–HAZ–kaynak metali hattı boyunca, kep ve kök bölgelerinde ayrı sıralar halinde yerleştirilir; HAZ'da izler ergime çizgisine mümkün olduğunca yakın (tipik 0,5 mm aralık) konumlandırılır. Amaç CGHAZ pik sertliğini yakalamaktır — bu bölge en yüksek sertleşebilirliğe sahip dar banttır. İz merkezleri arası mesafe, iz köşegeninin en az 3 katı olmalıdır (ISO 6507-1).",
        en: "Per EN ISO 9015-1, indent rows run across base metal–HAZ–weld metal in separate lines at cap and root regions; HAZ indents are placed as close as practicable to the fusion line (typically 0.5 mm spacing). The objective is to capture the CGHAZ peak hardness — the narrow band with highest hardenability. Center-to-center indent spacing must be at least 3× the indent diagonal (ISO 6507-1).",
      },
    },
  ],
};
