// ─────────────────────────────────────────────────────────────────────────────
// lib/llmCorpus.js — LLM / ajan tüketimi için makine-okunur site kataloğu
//
// Amaç
//   llms.txt ve llms-full.txt tek bir kayıt üzerinden üretilir. Böylece yeni
//   bir araç eklendiğinde üç ayrı dosyayı elle güncelleme ihtiyacı kalmaz ve
//   dosyalar arasında sapma oluşmaz.
//
// Kapsam notu
//   Buradaki "abstract" alanları, sayfanın hesaplama mantığını değil, teknik
//   içeriğini özetler. Amaç, JavaScript çalıştırmayan bir ajanın sayfaya
//   girmeden dahi hangi standardın, hangi büyüklüğün ve hangi sınırlamanın
//   söz konusu olduğunu görebilmesidir.
//
// Sorumluluk sınırı
//   Standart numaraları ve yöntem adları bilgi amaçlıdır; standart metinlerinin
//   kendisi burada çoğaltılmamaktadır (telif). Sayısal sınır değerleri
//   verilirken kaynak standart adı birlikte yazılır.
// ─────────────────────────────────────────────────────────────────────────────

export const CORPUS_VERSION = "2026-07-26";

/** Hesaplama araçları */
export const TOOLS = [
  {
    path: "/tools/hardness",
    title: "ASTM E140 Hardness Conversion",
    titleTR: "ASTM E140 Sertlik Dönüştürme",
    standards: ["ASTM E140", "EN ISO 18265", "ASTM E18", "ASTM E92", "ASTM E10"],
    abstract:
      "HRC, HV, HBW, HRB, HRA, HRD ve süperficial (15N/30N/45N) skalaları arasında karşılıklı dönüşüm; dönüşümden yaklaşık çekme dayanımı (UTS) tahmini. Dönüşüm tabloları malzeme sınıfına göre ayrılır (karbon çeliği ve düşük alaşımlı çelik, östenitik paslanmaz, su verilmiş-temperlenmiş çelik). Kritik sınırlama: sertlik dönüşümleri ampiriktir ve malzeme sınıfına bağlıdır; farklı bir sınıfın tablosunun kullanılması sistematik sapma üretir. Deformasyon sertleşmiş, dekarbürize olmuş veya sementasyon tabakası taşıyan yüzeylerde ölçek etkisi (indentasyon derinliği / tabaka kalınlığı oranı) nedeniyle dönüşüm geçerliliğini yitirir.",
  },
  {
    path: "/tools/grain-size",
    title: "ASTM E112 Grain Size Calculator",
    titleTR: "ASTM E112 Tane Boyutu Hesaplayıcı",
    standards: ["ASTM E112", "EN ISO 643", "ASTM E1382", "ASTM E930"],
    abstract:
      "Kesişim (Heyn lineal intercept), planimetrik (Jeffries) ve karşılaştırma yöntemleriyle ASTM tane boyutu numarası G hesabı; ortalama kesişim uzunluğu ℓ ve eşdeğer tane çapı d dönüşümü. Hall–Petch bağıntısı (σy = σ0 + k·d^-1/2) üzerinden akma dayanımına tane inceltme katkısı tahmini. Metodolojik notlar: dupleks (bimodal) tane dağılımlarında tek bir G değeri yanıltıcıdır ve ALA (as-large-as) tane raporlaması gerekir; ikiz sınırları (annealing twins) östenitik yapılarda tane sınırı sayılmaz; bant yapılı (banded) mikroyapılarda ölçüm yönü haddeleme yönüne göre belirtilmelidir.",
  },
  {
    path: "/tools/carbon-equivalent",
    title: "Carbon Equivalent (CE / CEV / Pcm) Calculator",
    titleTR: "Karbon Eşdeğeri (CE / CEV / Pcm) Hesaplayıcı",
    standards: ["IIW / EN 1011-2", "AWS D1.1", "API 5L Annex", "JIS"],
    abstract:
      "IIW karbon eşdeğeri CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 ve düşük karbonlu mikroalaşımlı çelikler için AWS Pcm = C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B hesabı. Kullanım ayrımı: CEV, karbon içeriği yaklaşık %0,18'in üzerindeki çeliklerde sertleşebilirlik esaslı soğuk çatlak riskini; Pcm ise düşük karbonlu HSLA/API hatlarında hidrojen kaynaklı çatlak duyarlılığını daha iyi temsil eder. Çıktı doğrudan ısıl girdi ve ön ısıtma kararına bağlanır; martenzit oluşumu ve difüzyon hidrojeni birlikte değerlendirilmelidir.",
  },
  {
    path: "/tools/preheat",
    title: "EN 1011-2 Weld Preheat Temperature Calculator",
    titleTR: "EN 1011-2 Kaynak Ön Isıtma Sıcaklığı Hesaplayıcı",
    standards: ["EN 1011-2 Method B", "AWS D1.1 Annex H", "ISO/TR 17844"],
    abstract:
      "Hidrojen kaynaklı soğuk çatlak (HICC) riskine karşı ön ısıtma sıcaklığı tayini. Girdiler: birleşim kalınlığı (combined thickness), hidrojen ölçek sınıfı (HD, ml/100 g), ısı girdisi (kJ/mm) ve karbon eşdeğeri. Mekanizma: martenzitik ısı tesiri altındaki bölgede (HAZ) çözünmüş difüzyon hidrojeni, üç eksenli çekme gerilmesi ve duyarlı mikroyapının eşzamanlı bulunması gerekir; ön ısıtma t8/5 süresini uzatarak hem martenzit oranını düşürür hem de hidrojenin dışarı difüzyonuna zaman tanır. Kalın kesitlerde ısı akışı üç boyutlu hale gelir ve soğuma hızı artar.",
  },
  {
    path: "/tools/cct-ttt",
    title: "CCT / TTT Diagram Interpreter",
    titleTR: "CCT / TTT Diyagram Yorumlayıcı",
    standards: ["ASTM A1033", "SAE J406 (Jominy)"],
    abstract:
      "Sürekli soğuma (CCT) ve izotermal (TTT) dönüşüm diyagramları üzerinde soğuma eğrisinin okunması; ferrit, perlit, beynit ve martenzit hacim oranlarının tahmini. Ms ve Bs sıcaklıklarının kimyasal bileşimden kestirimi ve kritik soğuma hızı değerlendirmesi. Yorum notu: TTT diyagramları izotermal tutmayı temsil eder ve sürekli soğuma için doğrudan kullanılamaz; CCT eğrileri östenitleme sıcaklığı, östenit tane boyutu ve mikroalaşım çözünürlüğüne (Nb, Ti, V karbonitrürleri) duyarlıdır. TMCP hatlarında deforme östenitin dönüşüm kinetiği, rekristalize östenitten farklıdır.",
  },
  {
    path: "/tools/phase-diagram",
    title: "Fe–C Phase Diagram (Interactive)",
    titleTR: "Fe–C Faz Diyagramı (Etkileşimli)",
    standards: ["ASM Handbook Vol. 3 — Alloy Phase Diagrams"],
    abstract:
      "Etkileşimli demir-karbon (Fe–Fe3C metastabil) faz diyagramı; alaşım elementlerine göre kaydırılmış Ae1 ve Ae3 çizgileri. Ötektoid (0,76 %C, 727 °C), ötektik (4,3 %C, 1147 °C) ve peritektik (0,17 %C, 1495 °C) noktaların gösterimi; Kaldıraç kuralı ile faz oranı hesabı. Peritektik bölge, sürekli dökümde kabuk büzülmesi ve düzensiz kabuk oluşumuna bağlı boyuna yüzey çatlağı riski nedeniyle ayrıca işaretlenir. Ni ve Mn östenit alanını genişletir; Cr, Mo, Si, Ti ve V ferrit alanını genişletir.",
  },
  {
    path: "/tools/dbtt",
    title: "DBTT (Ductile–Brittle Transition Temperature) Estimator",
    titleTR: "DBTT (Sünek–Gevrek Geçiş Sıcaklığı) Tahmini",
    standards: ["ASTM E23", "EN ISO 148-1", "API 5L Annex"],
    abstract:
      "Kimyasal bileşim, tane boyutu ve mikroyapıdan sünek-gevrek geçiş sıcaklığı kestirimi. Etkiler: tane inceltme DBTT'yi düşüren tek mekanizmadır ki aynı anda akma dayanımını da yükseltir; C ve P artışı geçiş sıcaklığını yükseltir; Ni düşürür; perlit oranı ve bant yapısı geçiş bölgesini genişletir. Ayrıca serbest azot, temper gevrekliği (P, Sn, Sb, As tane sınırı segregasyonu) ve enine/boyuna numune yönü (anizotropi) etkisi değerlendirmeye dahil edilmelidir. Sonuç Charpy geçiş eğrisiyle doğrulanmalıdır; tahmin, testin yerine geçmez.",
  },
  {
    path: "/tools/dwtt",
    title: "DWTT (Drop-Weight Tear Test) Shear Area Calculator",
    titleTR: "DWTT Kayma Alanı (Shear Area) Hesaplayıcı",
    standards: ["API 5L3 (RP 5L3)", "ASTM E436", "ISO 3183"],
    abstract:
      "Düşen ağırlıklı yırtma testinde yüzde kayma alanının (% shear area) hesabı; boru hattı çeliklerinde sünek çatlak yayılımının durdurulabilirliği (crack arrest) değerlendirmesi. Ölçüm, çentik ve çekiç darbesi bölgeleri hariç tutularak kırık yüzeyi üzerinden yapılır. Yorum: Charpy enerjisi çentik açma enerjisini de içerdiğinden kalın cidarlı hat borusunda tek başına yeterli değildir; DWTT tam kalınlık numune kullandığı için gerçek servis koşullarına daha yakındır. Ters kırılma (abnormal / inverse fracture) ve ayrılma (separation / splitting) gözlenmesi, bant yapısı ve kristalografik doku (texture) ile ilişkilidir ve rapor edilmelidir.",
  },
  {
    path: "/tools/inclusion",
    title: "ASTM E45 Non-metallic Inclusion Rating",
    titleTR: "ASTM E45 İnklüzyon Derecelendirme",
    standards: ["ASTM E45", "EN 10247", "DIN 50602", "ISO 4967"],
    abstract:
      "A (sülfür), B (alümina), C (silikat) ve D (küresel oksit) tipi inklüzyonların ince (thin) ve kalın (heavy) seri derecelendirmesi. Mekanizma bağlantısı: A tipi MnS, sıcak haddede plastik olarak uzar ve enine süneklik ile enine Charpy enerjisinde anizotropi yaratır; B tipi Al2O3 kırılgandır ve haddeleme yönünde kesikli sıralar (stringer) oluşturur, yorulma ve HIC çatlağı başlangıç noktasıdır; D tipi küresel oksitler kalsiyum işlemi sonrası modifiye kalsiyum alüminat olarak görülür. Ca/Al oranı ve toplam oksijen hedefleri, tıkanma (nozzle clogging) ve inklüzyon modifikasyonu açısından birlikte değerlendirilir.",
  },
  {
    path: "/tools/inclusion-atlas",
    title: "Non-metallic Inclusion Atlas",
    titleTR: "İnklüzyon Atlası",
    standards: ["ASTM E45", "ISO 4967"],
    abstract:
      "Yaygın metalik olmayan inklüzyonların optik ve elektron mikroskop görüntü atlası; morfoloji (küresel, köşeli, uzamış stringer), dağılım ve muhtemel kaynak süreci (deoksidasyon ürünü, cüruf sürüklenmesi, refrakter aşınması, yeniden oksidasyon) eşleştirmesi.",
  },
  {
    path: "/tools/sem-eds",
    title: "SEM-EDS Peak Overlap Analyzer",
    titleTR: "SEM-EDS Pik Örtüşme Analizörü",
    standards: ["ASTM E1508", "ISO 22309"],
    abstract:
      "EDS spektrumlarında karakteristik X-ışını piklerinin örtüşmesini (Z = 3–95) tespit eder ve yanlış element atama riskini raporlar. Metalurjide kritik örtüşmeler: Mo Lα (2,293 keV) ile S Kα (2,307 keV) — sülfür inklüzyonu ile molibden karışması; Ti Kβ ile V Kα; Mn Kβ ile Fe Kα; Cr Kβ ile Mn Kα; O Kα ile Cr Lα. Artefakt uyarıları: toplam pik (sum peak), kaçış piki (escape peak), yüzey kaplama elementi (Au, C) katkısı ve etkileşim hacmi nedeniyle matristen gelen sinyal — küçük inklüzyonlarda kantitatif sonuç bu nedenle ihtiyatla yorumlanmalıdır.",
  },
  {
    path: "/tools/corrosion",
    title: "API 570 Corrosion Rate Calculator",
    titleTR: "API 570 Korozyon Hızı Hesaplayıcı",
    standards: ["API 570", "API 574", "API 579-1 / ASME FFS-1"],
    abstract:
      "Uzun dönem (LT) ve kısa dönem (ST) korozyon hızı, kalan ömür ve bir sonraki muayene tarihi hesabı. Girdiler: başlangıç kalınlığı, ölçülen kalınlık, gerekli minimum kalınlık ve servis süresi. API 570 uyarınca muayene aralığı kalan ömrün yarısını aşamaz. Not: tekdüze (uniform) incelme varsayımına dayanır; oyuklanma (pitting), aralık korozyonu, akış hızlandırmalı korozyon (FAC) ve gerilmeli korozyon çatlağı bu yaklaşımla temsil edilmez.",
  },
  {
    path: "/tools/ultrasonic",
    title: "Ultrasonic Testing (UT) Calculator and Simulator",
    titleTR: "Ultrasonik Muayene (UT) Hesaplayıcı ve Simülatör",
    standards: ["EN ISO 16810", "EN ISO 17640", "ASTM E164", "ASME V"],
    abstract:
      "Açılı prob geometrisi, sıçrama mesafesi (skip distance), yüzey mesafesi, derinlik ve ses yolu hesapları; A-tarama görüntüsü simülasyonu. Fiziksel temel: Snell yasası ile mod dönüşümü, boyuna ve enine dalga hızları, akustik empedans farkına bağlı yansıma katsayısı, yakın alan (near field) uzunluğu ve ıraksama açısı. Kusur yönelimi ile ses demeti arasındaki açı, yansıyan genlik üzerinde belirleyicidir; düzlemsel kusurlar demete paralel konumda ciddi biçimde eksik değerlendirilebilir.",
  },
  {
    path: "/tools/tensile-specimen",
    title: "Tensile Specimen Dimensioning",
    titleTR: "Çekme Numunesi Boyutlandırma",
    standards: ["ASTM E8/E8M", "EN ISO 6892-1", "ASTM A370"],
    abstract:
      "Yassı ve yuvarlak çekme numunelerinin ölçü boyu, kesit alanı ve omuz geometrisi hesabı. Orantılı numune kuralı (EN ISO 6892-1: L0 = 5,65·√S0) ve sabit ölçü boyu (ASTM 50 mm) ayrımı; uzama değerlerinin yalnız aynı orantı katsayısında karşılaştırılabilir olduğu vurgulanır. Kesit alanı hatası doğrudan akma ve çekme dayanımına yansır.",
  },
  {
    path: "/tools/unit-converter",
    title: "Metallurgical Unit Converter",
    titleTR: "Metalurjik Birim Dönüştürücü",
    standards: ["ISO 80000"],
    abstract:
      "Metalurjiye özgü birim dönüşümleri: MPa ↔ ksi ↔ kgf/mm², J ↔ ft·lb, J/cm² ↔ ft·lb/in², sıcaklık, MPa·√m ↔ ksi·√in (kırılma tokluğu), sertlik yükleri (kgf ↔ N) ve soğuma hızı birimleri.",
  },
  {
    path: "/tools/hasar-vakalari",
    title: "Failure Case Library (Hasar Vakaları)",
    titleTR: "Hasar Vakaları Kütüphanesi",
    standards: ["ASM Handbook Vol. 11 — Failure Analysis and Prevention"],
    abstract:
      "Uzun mamul (kangal / filmaşin) ve yassı mamul (bobin / levha) üretiminde karşılaşılan üretim kusurlarının vaka arşivi. Her vaka: makro ve mikro bulgular, SEM-EDS sonuçları, kök neden değerlendirmesi, proses parametreleriyle ilişkilendirme (sürekli döküm menisküs kontrolü, mold flux, tundish temizliği, hadde redüksiyonu, soğuma rejimi) ve önleyici faaliyet önerileri içerir.",
  },
];

/** Mekanik test rehberleri */
export const MECHANICAL_TESTS = [
  {
    path: "/mechanical-tests/cekme-testi",
    title: "Tensile Test",
    titleTR: "Çekme Testi",
    standards: ["EN ISO 6892-1", "ASTM E8/E8M", "ASTM A370"],
    abstract:
      "Akma dayanımı (ReH/ReL veya Rp0,2), çekme dayanımı (Rm), kopma uzaması (A) ve kesit daralması (Z) tayini. Mikroyapı ilişkisi: belirgin akma platosu serbest arayer atomlarının (C, N) dislokasyonları kilitlemesiyle (Cottrell atmosferi) ilişkilidir ve IF çeliklerinde Ti/Nb stabilizasyonu nedeniyle görülmez; DP çeliklerinde sürekli akma davranışı, martenzit adacıkları çevresindeki hareketli dislokasyon yoğunluğundan kaynaklanır ve yüksek başlangıç pekleşme hızı verir. Plastik kararsızlık (boyun verme) Considère kriteri ile (dσ/dε = σ) değerlendirilir. Uzama değeri ölçü boyuna bağlıdır; farklı standartların değerleri doğrudan karşılaştırılamaz.",
  },
  {
    path: "/mechanical-tests/darbe-testi",
    title: "Charpy V-Notch Impact Test",
    titleTR: "Çentik Darbe (Charpy) Testi",
    standards: ["EN ISO 148-1", "ASTM E23", "ASTM A370"],
    abstract:
      "Charpy V çentikli numunede absorbe edilen enerji, yanal genişleme (lateral expansion) ve kristalinite (% kayma alanı) ölçümü; geçiş eğrisi çıkarılması. Yorum: enerji hem çatlak başlaması hem ilerlemesi bileşenlerini içerir. Enine (T-L) numuneler MnS uzaması ve bant yapısı nedeniyle boyuna (L-T) numunelerden düşük enerji verir. Kırık yüzeyinde ayrılma (separation) gözlenmesi doku ve bantlaşma göstergesidir. Alt raf (lower shelf) bölgesinde ayrılma düzlemsel kırılma (cleavage), üst rafta çukurcuklu (dimple) sünek kırılma baskındır.",
  },
  {
    path: "/mechanical-tests/sertlik-olcumu",
    title: "Hardness Measurement (Rockwell, Vickers, Brinell)",
    titleTR: "Sertlik Ölçümü (Rockwell, Vickers, Brinell)",
    standards: ["ASTM E18", "ASTM E92", "ASTM E10", "EN ISO 6506/6507/6508", "ASTM E384"],
    abstract:
      "Rockwell, Vickers, Brinell ve mikrosertlik (HV0,1–HV1) yöntemlerinin uygulama alanları, yük seçimi, numune hazırlığı ve geçerlilik kuralları. Kritik kurallar: numune kalınlığı iz derinliğinin en az 10 katı olmalı; izler arası mesafe iz köşegeninin en az 3 katı olmalı; sementasyon derinliği (CHD) ve dekarbürizasyon ölçümünde mikrosertlik profili kullanılır. Mikroyapı ilişkisi: martenzit sertliği esas olarak karbon içeriğine, temperlenmiş martenzit sertliği ise temperleme sıcaklığı ve süresine (Hollomon–Jaffe parametresi) bağlıdır.",
  },
  {
    path: "/mechanical-tests/dwtt",
    title: "Drop-Weight Tear Test (DWTT)",
    titleTR: "Düşen Ağırlıklı Yırtma Testi (DWTT)",
    standards: ["API 5L3", "ASTM E436", "ISO 3183"],
    abstract:
      "Tam kalınlıkta numunede sünek çatlak yayılımı direncinin belirlenmesi; hat borusu (API 5L / ISO 3183) kabul kriterlerinde yüzde kayma alanı esas alınır. Kalın cidarda Charpy'ye kıyasla servis koşullarını daha iyi temsil eder.",
  },
  {
    path: "/mechanical-tests/katlama-egme-testi",
    title: "Bend / Fold Test",
    titleTR: "Katlama ve Eğme Testi",
    standards: ["EN ISO 7438", "ASTM E290", "EN ISO 5173 (kaynaklı)"],
    abstract:
      "Belirli mandrel çapında eğme ile yüzey süneklik ve kaynak dikişi bütünlüğü değerlendirmesi. Dış lif çekme birim şekil değiştirmesi mandrel çapı / kalınlık oranı ile belirlenir. Yüzeye yakın inklüzyon sıraları, dekarbürizasyon ve yüzey kusurları bu testte açığa çıkar.",
  },
  {
    path: "/mechanical-tests/basma-testi",
    title: "Compression Test",
    titleTR: "Basma Testi",
    standards: ["ASTM E9", "ISO 7500-1"],
    abstract:
      "Basma dayanımı ve plastik davranış tayini; numune boy/çap oranı ve sürtünme etkisiyle oluşan fıçılaşma (barreling) hatası ve yağlama gereksinimi.",
  },
];

/** Bilgi bankası makaleleri */
export const KNOWLEDGE = [
  {
    path: "/knowledge/steel-microstructures",
    title: "Steel Microstructures",
    titleTR: "Çelik Mikroyapıları",
    standards: ["ASTM E407", "ASTM E3"],
    abstract:
      "Ferrit, perlit, beynit (üst / alt), martenzit (lath / plate), östenit ve Widmanstätten ferritin oluşum koşulları, morfolojisi ve mekanik özelliklere etkisi. Dual-phase (DP600) yapıda ferrit matris içindeki martenzit adacıklarının yüksek pekleşme hızı ve düşük akma/çekme oranı üretmesi; S700MC gibi termomekanik haddelenmiş mikroalaşımlı çeliklerde ince taneli ferrit + beynit yapısı ve Nb/Ti karbonitrür çökeltilerinin çökelme sertleşmesi katkısı; IF çeliklerinde Ti/Nb ile arayer atomlarının bağlanması sonucu elde edilen yüksek r değeri ve derin çekilebilirlik.",
  },
  {
    path: "/knowledge/fe-c-phase-diagram",
    title: "Fe–C Phase Diagram",
    titleTR: "Fe–C Faz Diyagramı",
    standards: ["ASM Handbook Vol. 3"],
    abstract:
      "Demir-karbon sisteminin metastabil (Fe–Fe3C) ve kararlı (Fe–grafit) hâlleri; ötektoid, ötektik ve peritektik reaksiyonlar; alaşım elementlerinin faz sınırlarına etkisi ve pratik ısıl işlem sonuçları.",
  },
  {
    path: "/knowledge/grain-size-hall-petch",
    title: "Grain Size and the Hall–Petch Relationship",
    titleTR: "Tane Boyutu ve Hall–Petch İlişkisi",
    standards: ["ASTM E112", "EN ISO 643"],
    abstract:
      "Tane sınırlarının dislokasyon hareketine engel oluşturma mekanizması ve σy = σ0 + k·d^-1/2 bağıntısı. Tane inceltmenin dayanım ve tokluğu aynı anda artıran tek klasik mekanizma olması; TMCP, kontrollü haddeleme ve mikroalaşım (Nb, Ti, V) yoluyla östenit tane büyümesinin bastırılması.",
  },
  {
    path: "/knowledge/hardness-testing",
    title: "Hardness Testing",
    titleTR: "Sertlik Ölçümü",
    standards: ["ASTM E18", "ASTM E92", "ASTM E10", "ASTM E140", "EN ISO 18265"],
    abstract:
      "Sertlik yöntemlerinin karşılaştırması, dönüşüm tablolarının ampirik doğası ve sınırlamaları, ölçüm hatası kaynakları.",
  },
  {
    path: "/knowledge/mechanical-testing",
    title: "Mechanical Testing of Steels",
    titleTR: "Çeliklerde Mekanik Test",
    standards: ["EN ISO 6892-1", "ASTM E8", "ASTM E23", "EN ISO 148-1"],
    abstract:
      "Çekme, darbe, sertlik ve eğme testlerinin birlikte yorumlanması; mikroyapı-özellik ilişkilerinin test sonuçlarına yansıması; numune yönü ve anizotropi.",
  },
  {
    path: "/knowledge/corrosion-mechanisms",
    title: "Corrosion Mechanisms",
    titleTR: "Korozyon Mekanizmaları",
    standards: ["API 570", "NACE / AMPP", "ASTM G1"],
    abstract:
      "Tekdüze korozyon, oyuklanma, galvanik korozyon, aralık korozyonu, taneler arası korozyon, gerilmeli korozyon çatlaması (SCC) ve hidrojen kaynaklı çatlak (HIC/SSC) mekanizmaları; malzeme seçimi ve muayene stratejisine etkisi.",
  },
];

/** Kurumsal / kanuni sayfalar */
export const SITE_PAGES = [
  { path: "/about", title: "About / Methodology", titleTR: "Hakkında" },
  { path: "/methodology", title: "Methodology and Validation", titleTR: "Metodoloji ve Doğrulama" },
  { path: "/knowledge", title: "Knowledge Base Index", titleTR: "Bilgi Bankası" },
  { path: "/mechanical-tests", title: "Mechanical Tests Index", titleTR: "Mekanik Testler" },
  { path: "/blog", title: "Technical Articles", titleTR: "Teknik Makaleler" },
  { path: "/pricing", title: "Pricing", titleTR: "Fiyatlandırma" },
];

/** .md ayna route'unun karşılayacağı tüm sayfalar */
export const ALL_DOCS = [...TOOLS, ...MECHANICAL_TESTS, ...KNOWLEDGE];

/** path → kayıt araması (ör. "/tools/hardness") */
export function findDoc(path) {
  return ALL_DOCS.find((d) => d.path === path) || null;
}
