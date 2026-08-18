'use client';
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

/* ═══════════════════════════════════════════════════════════════════════════
   Basma Testi / Compression Test
   Dayanak: ASTM E9 (metalik malzemeler, oda sıcaklığı) · DIN 50106 (Avrupa
   karşılığı) · ISO 7500-1 (makine doğrulaması) · ASTM E83 / ISO 9513
   (ekstansometre sınıfı).

   NOT: Önceki sürümde rozet "EN ISO 604" idi. EN ISO 604 PLASTİKLERİN basma
   özelliklerini kapsar, metalik malzemeleri değil; DIN 50106 ile değiştirildi.
   Ayrıca "Rastegaev düzeltmesi" olarak verilen bağıntı aslında Siebel'in
   ortalama basınç düzeltmesidir — Rastegaev bir NUMUNE GEOMETRİSİDİR.
   İkisi ayrıldı.

   Standart metinlerinden hiçbir bölüm çoğaltılmamıştır; sayısal değerler
   referans amaçlıdır ve yürürlükteki edisyondan teyit edilmelidir.
   ═══════════════════════════════════════════════════════════════════════════ */

const TR = {
  breadcrumb: "Mekanik Testler", breadcrumbSub: "Basma Testi",
  badge: "ASTM E9 · DIN 50106", counter: "06 / 06",
  h1: "Basma Testi",
  lead: "Basma testi, metalik malzemenin tek eksenli basma yükü altındaki elastik ve plastik davranışını belirler. Çekme testinin aksine boyun verme (necking) ile sınırlanmadığı için çok daha büyük plastik gerinimlere ulaşılabilir; bu nedenle hadde yükü hesabı, dövme ve şekillendirme simülasyonlarının temel akış gerilmesi verisi bu testten elde edilir. Buna karşılık sürtünme kaynaklı fıçılaşma ve burkulma, testin iki yapısal zaafıdır.",

  /* § 1 */
  s1h: "Test Prensibi ve Ölçülen Büyüklükler",
  s1p1: "Numune, iki paralel baskı plakası arasında eksenel olarak sıkıştırılır. Yük–kısalma verisi gerçek gerilme–gerçek gerinim eğrisine dönüştürülür. Hacim sabitliği (plastik deformasyonda ν = 0,5) kabulüyle anlık kesit alanı yükseklikten türetilir; bu, çekme testinde boyun vermeden sonra mümkün olmayan bir üstünlüktür.",
  s1p2: "Çekme testindeki Rm'nin basma karşılığı yoktur. Sünek metallerde eğri, numune fiziksel olarak sıkışana veya çatlayana kadar monoton yükselir — bir maksimum vermez. Bu yüzden basma testinde raporlanan dayanım büyüklüğü offset akma dayanımıdır; gevrek malzemelerde ise kırılma anındaki gerilme (basma dayanımı) anlamlıdır.",
  s1t: [
    ["Büyüklük", "Sembol", "Tanım ve belirlenişi"],
    ["Basma elastisite modülü", "E_c", "Eğrinin elastik bölümünün eğimi. Uzun numune ve ekstansometre gerektirir; kısa numunede makine esnekliği hâkim olur."],
    ["Basma orantı sınırı", "R_pc", "Gerilme–gerinim ilişkisinin doğrusallıktan ayrıldığı ilk gerilme."],
    ["Basma akma dayanımı", "R_p0,2c", "Elastik doğruya paralel, %0,2 kalıcı gerinim öteleyerek çizilen doğrunun eğriyi kestiği gerilme."],
    ["Basma dayanımı", "R_mc", "Yalnızca gevrek malzemelerde anlamlıdır: kırılma anındaki gerilme. Sünek metallerde tanımsızdır."],
    ["Akış gerilmesi", "σ_f", "Belirli bir ε, ε̇ ve T'de plastik akışı sürdüren gerilme. Şekillendirme hesaplarının girdisidir."],
  ],
  s1c1: "// Gerçek gerilme (hacim sabitliği ile)",
  s1c2: "// Gerçek gerinim — basmada işaret negatiftir, büyüklük kullanılır",
  s1c3: "// Anlık kesit alanı",

  fig1Cap: "Şekil 1 — Basma ve çekme eğrilerinin karşılaştırılması ve %0,2 offset akma kurgusu. Basma eğrisi maksimum vermez; çekme eğrisi boyun vermeyle düşer.",
  fig1Alt: "Basma ve çekme gerilme-gerinim eğrileri, offset akma noktası işaretli",
  fig1X: "gerçek gerinim  ε", fig1Y: "gerçek gerilme  σ",
  fig1Comp: "basma", fig1NoUts: "maksimum yok",
  fig1Tens: "çekme", fig1Frac: "kopma",
  fig1Elast: "elastik doğru", fig1Ys: "Rp0,2c", fig1Off: "0,2 %",

  /* § 2 */
  s2h: "Numune Geometrisi — ASTM E9 Tipleri",
  s2p1: "ASTM E9 tek bir numune tanımlamaz; ölçülecek büyüklüğe göre üç boy sınıfı verir. Seçim, iki karşıt hata kaynağı arasındaki dengedir: numune kısaldıkça uç yüzey sürtünmesinin payı büyür, uzadıkça burkulma riski artar.",
  s2t: [
    ["Tip", "Çap D", "Boy L", "L/D", "Birincil kullanım"],
    ["Kısa", "12,7 – 28,6 mm", "25 – 30 mm", "1,0 – 1,12", "Yüksek dayanımlı ve gevrek malzemelerde dayanım; büyük plastik gerinim"],
    ["Orta", "12,7 – 28,6 mm", "38 – 85 mm", "1,5 – 3,4", "Genel amaçlı akma dayanımı; sürtünme–burkulma dengesi en iyi bu aralıkta"],
    ["Uzun", "20 – 32 mm", "160 – 320 mm", "6,4 – 12,5", "Elastisite modülü ve orantı sınırı; ekstansometre ile"],
  ],
  s2note: "Değerler ASTM E9 numune tiplerinin bilinen aralıklarıdır ve referans amaçlıdır. Toleranslar, uç yüzey diklik ve paralellik şartları için yürürlükteki edisyona bakılmalıdır.",
  s2p2: "Uç yüzeyler eksene dik ve birbirine paralel işlenmelidir. Diklikten sapma, yükün numune kesiti üzerinde eksantrik dağılmasına ve gerçek dışı erken akmaya yol açar — bu, basma testinde en sık karşılaşılan sistematik hatadır.",
  fig2Cap: "Şekil 2 — ASTM E9 numune tipleri, birbirine göre ölçekli. L/D oranı büyüdükçe burkulma, küçüldükçe sürtünme baskın hata kaynağı olur.",
  fig2Alt: "Kısa, orta ve uzun basma numunelerinin ölçekli karşılaştırması",
  fig2short: "Kısa", fig2medium: "Orta", fig2long: "Uzun",

  /* § 3 */
  s3h: "Burkulma, Narinlik ve İnce Sac Numuneler",
  s3p1: "Basma numunesi bir kolondur; kritik yükün üzerinde elastik burkulma gerçekleşir ve ölçülen gerilme malzeme özelliği olmaktan çıkar. Elastik burkulma yükü Euler bağıntısıyla kestirilir; ancak metalik numunelerde akma genellikle elastik burkulmadan önce başladığı için tanjant modül (Engesser) yaklaşımı daha gerçekçidir.",
  s3c1: "// Euler kritik burkulma gerilmesi (elastik)",
  s3c2: "// Tanjant modül yaklaşımı (plastik bölge)",
  s3note: "K: uç bağlantı katsayısı (iki ucu serbest basma plakası arasında K ≈ 1)\nr: kesit atalet yarıçapı, dairesel kesitte r = D/4\nE_t: akma sonrası eğrinin anlık eğimi",
  s3p2: "İnce sac ve levha numunelerinde narinlik doğası gereği çok yüksektir; bu numuneler burkulma önleyici bir aparat (anti-buckling fixture) içinde test edilir. Aparat yanal desteği sağlarken numune yüzeyine sürtünme uygular; bu sürtünme ölçülen yüke katkı yapar ve düzeltilmesi gerekir — desteksiz ölçüm ile aparatlı ölçüm arasındaki fark boş deneyle (blank test) belirlenir.",
  fig3Cap: "Şekil 3 — Basma numunesinde gözlenen deformasyon modları. Yalnızca birincisi geçerli veri üretir.",
  fig3Alt: "Homojen, fıçılaşmış, burkulmuş ve katlanmış numune biçimleri",
  fig3homo: "Homojen", fig3homoS: "sürtünmesiz ideal", fig3homoC: "geçerli",
  fig3barrel: "Fıçılaşma", fig3barrelS: "uç yüzey sürtünmesi", fig3barrelC: "düzeltme gerekir",
  fig3buckle: "Burkulma", fig3buckleS: "L/D çok büyük", fig3buckleC: "geçersiz",
  fig3fold: "Katlanma", fig3foldS: "çok büyük ε, çift fıçı", fig3foldC: "geçersiz",
  fig3Note: "Oklar, plaka yüzeyinde radyal akışa direnen sürtünme kuvvetini gösterir.",

  /* § 4 */
  s4h: "Deney Düzeneği ve Şartları",
  s4items: [
    { title: "Makine ve yük ölçümü", text: "Deney makinesi ISO 7500-1'e göre doğrulanmış olmalıdır (tipik olarak Sınıf 1). Basma testinde yük hücresi çekmeye göre daha yüksek yüklerde çalışır; doğrulama aralığının kullanılan yük seviyesini kapsadığından emin olunmalıdır." },
    { title: "Eksenellik ve alt pres (subpress)", text: "Baskı plakalarının paralelliği ve yükün eksenelliği sonucu doğrudan belirler. Küresel oturmalı plaka veya kılavuzlu alt pres kullanılır. Eksantriklik, numune kesitinde eğilme gerilmesi üretir; kesitin bir tarafı diğerinden önce akar ve ölçülen akma dayanımı düşük çıkar." },
    { title: "Gerinim ölçümü", text: "Elastisite modülü ve orantı sınırı ölçülecekse ekstansometre zorunludur; ASTM E83 Sınıf B-1 veya ISO 9513 sınıf 0,5 tipik gerekliliktir. Traversten okunan kısalma makine esnekliğini de içerdiği için modül hesabında kullanılamaz — bu, laboratuvarda en sık yapılan hatadır." },
    { title: "Deney hızı", text: "Akış gerilmesi gerinim hızına bağımlıdır. Oda sıcaklığındaki çeliklerde bağımlılık zayıftır, ancak sıcak basmada belirleyicidir. Hız, gerinim hızı kontrollü (ε̇ sabit) veya traverse hızı sabit modda uygulanabilir; hangisinin kullanıldığı raporlanmalıdır çünkü sabit traverse hızında ε̇ deney boyunca artar." },
    { title: "Yağlama", text: "Uç yüzey sürtünmesini azaltmak için MoS₂ veya grafit esaslı gres, PTFE folyo, cam tozu (sıcak deneyde) veya Gleeble sistemlerinde tantal folyo kullanılır. Yağlayıcı türü ve numune uç yüzey işleme durumu rapora yazılmalıdır — μ değeri sonucu doğrudan etkiler." },
  ],

  /* § 5 */
  s5h: "Sürtünme, Fıçılaşma ve Düzeltme",
  s5p1: "Baskı plakası ile numune uç yüzeyi arasındaki sürtünme, malzemenin radyal akışını engeller. Uç yüzeye yakın bölge kısıtlanırken orta bölge serbestçe genişler; sonuç fıçılaşmadır. Fıçılaşan numunede gerilme durumu artık tek eksenli değildir ve ölçülen ortalama basınç, gerçek akış gerilmesinden sistematik olarak yüksektir.",
  s5p2: "Ortalama basınç ile akış gerilmesi arasındaki ilişki, silindirik numune için Siebel'in bağıntısıyla verilir. Düzeltme yapılmadığında hata, L/D küçüldükçe ve μ büyüdükçe hızla artar: μ = 0,2 ve L/D = 1 için ortalama basınç akış gerilmesinin yaklaşık %13 üzerindedir.",
  s5c1: "// Siebel — ortalama basınç / akış gerilmesi",
  s5c2: "// Düzeltilmiş akış gerilmesi",
  s5note: "μ: sürtünme katsayısı (iyi yağlanmış 0,02 – 0,05 · kuru 0,1 – 0,3)\nd: anlık numune çapı, h: anlık numune yüksekliği\nBağıntı silindirik numune ve yapışma olmayan (μ < 0,577) koşul içindir.",
  s5p3: "Rastegaev numunesi bir düzeltme bağıntısı değil, bir geometridir: uç yüzeylere açılan sığ konsantrik oluk yağlayıcıyı hapseder ve deformasyon boyunca temas yüzeyinde film sürekliliğini korur. Bu sayede fıçılaşma büyük ölçüde önlenir ve düzeltmeye duyulan ihtiyaç azalır. İki yaklaşım birbirinin alternatifidir: ya geometriyle sürtünmeyi bastırın, ya ölçümü matematiksel olarak düzeltin — tercihen her ikisi.",
  fig4Cap: "Şekil 4 — Sürtünmenin ölçülen eğri üzerindeki etkisi. Aradaki fark malzeme davranışı değil, deney artefaktıdır.",
  fig4Alt: "Kuru, yağlanmış ve sürtünme düzeltmesi yapılmış basma eğrileri",
  fig4X: "gerçek gerinim  ε", fig4Y: "ortalama basınç  p",
  fig4Dry: "kuru — μ ≈ 0,3", fig4Lub: "yağlanmış — μ ≈ 0,05", fig4Corr: "düzeltilmiş σ_f",
  fig4Err: "artefakt",

  /* § 6 */
  s6h: "Sürtünmenin Ölçülmesi — Halka Basma Testi",
  s6p1: "Sürtünme katsayısı doğrudan ölçülemez; halka basma testi ile geriye doğru belirlenir. Standart oranlı bir halka (dış çap : iç çap : yükseklik = 6 : 3 : 2) belirli bir yükseklik azalmasına kadar sıkıştırılır ve iç çaptaki değişim ölçülür.",
  s6p2: "İç çapın davranışı sürtünmeye çok duyarlıdır ve yön değiştirir: sürtünme düşükse malzeme dışa ve içe serbest akar, iç çap büyür. Sürtünme yüksekse malzeme radyal olarak dışa akamaz ve merkeze doğru itilir, iç çap küçülür. Ölçülen iç çap değişimi, önceden hesaplanmış kalibrasyon eğrileriyle karşılaştırılarak sürtünme faktörü m belirlenir.",
  s6note: "Sürtünme faktörü m (0 ≤ m ≤ 1) ile Coulomb katsayısı μ farklı büyüklüklerdir. m, arayüz kayma gerilmesini malzemenin kayma akma gerilmesine oranlar; μ ise kayma gerilmesini normal basınca oranlar. Sonlu elemanlar yazılımlarının çoğu μ ister, halka testi ise doğrudan m verir — dönüşüm gereklidir ve gerilme durumuna bağlıdır.",
  fig5Cap: "Şekil 5 — Halka basma testinin çalışma prensibi. Ölçülen büyüklük iç çaptaki değişimdir. Kalibrasyon eğrileri malzeme ve geometriye özgüdür; literatürden alınan bir eğri kendi geometrinize doğrulanmadan kullanılmamalıdır.",
  fig5Alt: "Halka numunesinin düşük ve yüksek sürtünmede aldığı biçimler",
  fig5Top: "aynı yükseklik azalması uygulanır",
  fig5Init: "Başlangıç halkası", fig5Low: "Düşük sürtünme", fig5LowS: "iç çap büyür",
  fig5High: "Yüksek sürtünme", fig5HighS: "iç çap küçülür",
  fig5Note1: "İç çaptaki değişim yüzdesi → kalibrasyon eğrisi → sürtünme faktörü m",
  fig5Note2: "Testin üstünlüğü: sonuç malzemenin akma dayanımından bağımsızdır, yük ölçümü gerektirmez.",

  /* § 7 */
  s7h: "Akış Gerilmesi, Sıcak Basma ve Hadde Simülasyonu",
  s7p1: "Sıcak basma deneyinde akış gerilmesi üç değişkenin fonksiyonudur: σ_f = f(ε, ε̇, T). Sıcaklık ve gerinim hızının birleşik etkisi Zener–Hollomon parametresiyle tek bir değişkende toplanır; farklı T–ε̇ kombinasyonları aynı Z değerinde benzer akış davranışı gösterir.",
  s7c1: "// Zener–Hollomon parametresi",
  s7c2: "// Sinüs hiperbolik akış gerilmesi bağıntısı",
  s7note: "Q: sıcak deformasyon aktivasyon enerjisi (J/mol) · R = 8,314 J/(mol·K) · T mutlak sıcaklık\nA, α, n: malzemeye özgü, deneysel olarak belirlenen sabitler",
  s7items: [
    { title: "Gleeble termomekanik simülatör", text: "Direnç ısıtmasıyla hızlı sıcaklık kontrolü sağlarken eş zamanlı mekanik yükleme yapar. Sıcak basma ile γ ve α bölgelerinde akış gerilmesi, yeniden kristalleşme kinetiği (MFS — ortalama akış gerilmesi analizi) ve deformasyon sonrası CCT eğrileri üretilir. Numune uçlarında tantal folyo hem yağlayıcı hem difüzyon bariyeridir." },
    { title: "Çok pasolu deney ve T_nr", text: "Nb, V, Ti mikroalaşımlı çeliklerde ardışık paso simülasyonu, yeniden kristalleşme durma sıcaklığı T_nr'yi belirler. T_nr üzerinde her paso arasında tam yeniden kristalleşme olur ve gerinim birikmez; altında gerinim birikir, östenit yassılaşır ve dönüşüm sonrası tane inceltmesi sağlanır. MFS–1/T grafiğindeki eğim değişimi T_nr'yi verir." },
    { title: "Hadde yükü hesabına aktarım", text: "Paso kuvveti F = σ_f · A_temas · Q_p bağıntısıyla kestirilir; Q_p geometriye bağlı basınç faktörüdür. σ_f değeri basma deneyinden, ilgili paso için geçerli ε, ε̇ ve T'de okunur — bu üçlü eşleşmediğinde yük kestirimi anlamsızdır." },
    { title: "FEM için model uydurma", text: "DP, TRIP ve S700MC gibi kalitelerin şekillendirme simülasyonunda σ_f eğrisi Voce veya Swift modeliyle uydurulur ve sonlu elemanlar çözücüsüne aktarılır. Uydurma aralığı deneyde ulaşılan gerinim aralığıyla sınırlıdır; dışına ekstrapolasyon yapılmamalıdır." },
  ],

  /* § 8 */
  s8h: "Sınırlamalar ve Hata Kaynakları",
  s8items: [
    ["Fıçılaşma", "Büyük gerinimlerde deformasyon homojen değildir; numune ortasındaki gerinim uç yüzeye yakın bölgeden belirgin şekilde yüksektir. Düzeltilmemiş σ_f sistematik olarak yüksektir."],
    ["Burkulma", "L/D sınırının üzerinde ölçülen gerilme malzeme özelliği değildir. Deney sonrası numune eksenelliği mutlaka kontrol edilmelidir."],
    ["Tokluk ölçülemez", "Basma testi kırılma tokluğu veya sünek–gevrek geçiş hakkında doğrudan bilgi vermez; bunun için Charpy, DWTT veya CTOD gerekir."],
    ["Bauschinger etkisi", "Çekmeyle ön deformasyon görmüş malzemede basma akma dayanımı düşer (kinematik pekleşme). Ön deformasyon geçmişi bilinmeden basma verisi çekme verisiyle karşılaştırılamaz."],
    ["Anizotropi", "Haddelenmiş üründe basma davranışı numune eksenine bağlıdır. Kalınlık yönü (ST), boyuna (L) ve enine (T) yönler farklı sonuç verir; yön raporlanmalıdır."],
    ["Yüksek sıcaklıkta oksidasyon", "Koruyucu atmosfer (Ar, He) veya vakum kullanılmazsa oksit tabakası hem yük ölçümünü hem yüzey sürtünmesini değiştirir."],
    ["Adyabatik ısınma", "Yüksek gerinim hızında deformasyon işi ısıya dönüşür ve numune ısınır; ölçülen akış gerilmesi izotermal değerin altına iner. Yüksek ε̇ deneylerinde sıcaklık düzeltmesi gerekir."],
  ],

  /* § 9 */
  s9h: "Standart Notu",
  s9p: "Bu sayfa ASTM E9 (metalik malzemelerin oda sıcaklığında basma deneyi) ve DIN 50106 (Avrupa karşılığı) esas alınarak hazırlanmıştır. Makine doğrulaması ISO 7500-1, ekstansometre sınıfı ASTM E83 / ISO 9513 kapsamındadır. Standart metinlerinden hiçbir bölüm çoğaltılmamıştır; verilen sayısal aralıklar referans amaçlıdır. Standart edisyonları revize edilebildiğinden, deney öncesi yürürlükteki edisyon kendi nüshanızdan doğrulanmalıdır.",
  s9warn: "EN ISO 604, plastiklerin basma özelliklerini kapsar ve metalik malzemeler için geçerli değildir. Metaller için ASTM E9 veya DIN 50106 kullanılır.",

  footerPrev: "← DWTT", footerPrevHref: "/mechanical-tests/dwtt",
  footerNext: "↑ Tüm Testler", footerNextHref: "/mechanical-tests",
};

const EN = {
  breadcrumb: "Mechanical Tests", breadcrumbSub: "Compression Test",
  badge: "ASTM E9 · DIN 50106", counter: "06 / 06",
  h1: "Compression Test",
  lead: "The compression test determines the elastic and plastic behaviour of a metallic material under uniaxial compressive loading. Unlike the tensile test it is not limited by necking, so far larger plastic strains are reachable; this is why the flow stress data underpinning rolling load calculations, forging and forming simulations comes from compression. In return, friction-driven barrelling and buckling are its two structural weaknesses.",

  s1h: "Test Principle and Measured Quantities",
  s1p1: "The specimen is compressed axially between two parallel platens. Load–shortening data is converted to a true stress–true strain curve. Assuming volume constancy in plastic deformation (ν = 0.5), the instantaneous cross-section follows from the height — an advantage not available in tension once necking begins.",
  s1p2: "There is no compressive counterpart to the tensile Rm. In ductile metals the curve rises monotonically until the specimen physically upsets or cracks — it exhibits no maximum. The reported strength quantity is therefore the offset yield strength; for brittle materials the stress at fracture (compressive strength) is meaningful.",
  s1t: [
    ["Quantity", "Symbol", "Definition and determination"],
    ["Compressive modulus", "E_c", "Slope of the elastic portion. Requires a long specimen and an extensometer; on short specimens machine compliance dominates."],
    ["Proportional limit", "R_pc", "First stress at which the stress–strain relation departs from linearity."],
    ["Compressive yield strength", "R_p0.2c", "Stress where a line parallel to the elastic slope, offset by 0.2 % permanent strain, intersects the curve."],
    ["Compressive strength", "R_mc", "Meaningful only for brittle materials: the stress at fracture. Undefined for ductile metals."],
    ["Flow stress", "σ_f", "Stress sustaining plastic flow at a given ε, ε̇ and T. The input to forming calculations."],
  ],
  s1c1: "// True stress (via volume constancy)",
  s1c2: "// True strain — negative in compression, magnitude used",
  s1c3: "// Instantaneous cross-sectional area",

  fig1Cap: "Figure 1 — Compression and tensile curves compared, with the 0.2 % offset yield construction. The compression curve has no maximum; the tensile curve falls away after necking.",
  fig1Alt: "Compression and tensile stress-strain curves with offset yield point marked",
  fig1X: "true strain  ε", fig1Y: "true stress  σ",
  fig1Comp: "compression", fig1NoUts: "no maximum",
  fig1Tens: "tension", fig1Frac: "fracture",
  fig1Elast: "elastic slope", fig1Ys: "Rp0.2c", fig1Off: "0.2 %",

  s2h: "Specimen Geometry — ASTM E9 Types",
  s2p1: "ASTM E9 does not define a single specimen; it gives three length classes according to the quantity being measured. The choice balances two opposing error sources: the shorter the specimen the larger the share of end-face friction, the longer it is the greater the buckling risk.",
  s2t: [
    ["Type", "Diameter D", "Length L", "L/D", "Primary use"],
    ["Short", "12.7 – 28.6 mm", "25 – 30 mm", "1.0 – 1.12", "Strength of high-strength and brittle materials; large plastic strain"],
    ["Medium", "12.7 – 28.6 mm", "38 – 85 mm", "1.5 – 3.4", "General-purpose yield strength; best friction–buckling balance"],
    ["Long", "20 – 32 mm", "160 – 320 mm", "6.4 – 12.5", "Modulus of elasticity and proportional limit; with extensometer"],
  ],
  s2note: "The values are the known ranges of the ASTM E9 specimen types and are given for reference. Consult the edition in force for tolerances and for end-face squareness and parallelism requirements.",
  s2p2: "End faces must be machined square to the axis and parallel to each other. Departure from squareness distributes the load eccentrically over the section and produces spurious early yielding — the most common systematic error in compression testing.",
  fig2Cap: "Figure 2 — ASTM E9 specimen types drawn to relative scale. As L/D grows buckling dominates; as it shrinks friction does.",
  fig2Alt: "Short, medium and long compression specimens compared to scale",
  fig2short: "Short", fig2medium: "Medium", fig2long: "Long",

  s3h: "Buckling, Slenderness and Thin-Sheet Specimens",
  s3p1: "A compression specimen is a column; above a critical load it buckles elastically and the measured stress ceases to be a material property. The elastic buckling load follows from Euler's relation, but since metallic specimens usually yield before elastic buckling, the tangent-modulus (Engesser) approach is more realistic.",
  s3c1: "// Euler critical buckling stress (elastic)",
  s3c2: "// Tangent-modulus approach (plastic range)",
  s3note: "K: end-condition factor (free between platens, K ≈ 1)\nr: radius of gyration; for a circular section r = D/4\nE_t: instantaneous slope of the curve after yielding",
  s3p2: "Thin sheet and plate specimens are inherently very slender and are tested inside an anti-buckling fixture. The fixture provides lateral support but rubs against the specimen surface, adding to the measured load; that contribution must be corrected. The difference between unsupported and fixtured measurement is established by a blank test.",
  fig3Cap: "Figure 3 — Deformation modes observed in compression. Only the first yields valid data.",
  fig3Alt: "Homogeneous, barrelled, buckled and folded specimen shapes",
  fig3homo: "Homogeneous", fig3homoS: "frictionless ideal", fig3homoC: "valid",
  fig3barrel: "Barrelling", fig3barrelS: "end-face friction", fig3barrelC: "correction needed",
  fig3buckle: "Buckling", fig3buckleS: "L/D too large", fig3buckleC: "invalid",
  fig3fold: "Folding", fig3foldS: "very large ε, double barrel", fig3foldC: "invalid",
  fig3Note: "Arrows show the friction force resisting radial flow at the platen face.",

  s4h: "Test Setup and Conditions",
  s4items: [
    { title: "Machine and load measurement", text: "The testing machine must be verified to ISO 7500-1 (typically Class 1). Compression testing works the load cell at higher loads than tension; confirm the verified range covers the load level in use." },
    { title: "Axiality and subpress", text: "Platen parallelism and load axiality govern the result directly. A spherically seated platen or a guided subpress is used. Eccentricity generates bending stress across the section; one side yields before the other and the measured yield strength comes out low." },
    { title: "Strain measurement", text: "An extensometer is mandatory if modulus or proportional limit is to be measured; ASTM E83 Class B-1 or ISO 9513 class 0.5 is the typical requirement. Crosshead displacement includes machine compliance and cannot be used for modulus — the most frequent laboratory error." },
    { title: "Test speed", text: "Flow stress is strain-rate dependent. The dependence is weak for steels at room temperature but decisive in hot compression. Testing may run under strain-rate control (constant ε̇) or constant crosshead speed; which one was used must be reported, because at constant crosshead speed ε̇ rises through the test." },
    { title: "Lubrication", text: "MoS₂ or graphite-based grease, PTFE foil, glass powder (hot testing) or tantalum foil in Gleeble systems reduce end-face friction. The lubricant type and the end-face finish must be reported — μ directly affects the result." },
  ],

  s5h: "Friction, Barrelling and Correction",
  s5p1: "Friction between platen and specimen end face restrains radial flow. The region near the end face is constrained while the mid-height expands freely; the result is barrelling. In a barrelled specimen the stress state is no longer uniaxial and the measured mean pressure systematically exceeds the true flow stress.",
  s5p2: "For a cylindrical specimen the relation between mean pressure and flow stress is given by Siebel's equation. Without correction the error grows rapidly as L/D falls and μ rises: for μ = 0.2 and L/D = 1 the mean pressure is roughly 13 % above the flow stress.",
  s5c1: "// Siebel — mean pressure / flow stress",
  s5c2: "// Corrected flow stress",
  s5note: "μ: friction coefficient (well lubricated 0.02 – 0.05 · dry 0.1 – 0.3)\nd: instantaneous specimen diameter, h: instantaneous height\nValid for cylindrical specimens in the non-sticking regime (μ < 0.577).",
  s5p3: "The Rastegaev specimen is not a correction equation but a geometry: a shallow concentric groove machined into the end faces traps lubricant and maintains film continuity at the contact through the deformation. Barrelling is largely suppressed and the need for correction diminishes. The two approaches are alternatives — suppress friction by geometry, or correct the measurement mathematically; preferably both.",
  fig4Cap: "Figure 4 — Effect of friction on the measured curve. The gap is a test artefact, not material behaviour.",
  fig4Alt: "Dry, lubricated and friction-corrected compression curves",
  fig4X: "true strain  ε", fig4Y: "mean pressure  p",
  fig4Dry: "dry — μ ≈ 0.3", fig4Lub: "lubricated — μ ≈ 0.05", fig4Corr: "corrected σ_f",
  fig4Err: "artefact",

  s6h: "Measuring Friction — The Ring Compression Test",
  s6p1: "The friction coefficient cannot be measured directly; the ring compression test determines it inversely. A ring of standard proportions (outer : inner diameter : height = 6 : 3 : 2) is compressed to a set height reduction and the change in its internal diameter is measured.",
  s6p2: "The internal diameter is highly sensitive to friction and reverses direction. Under low friction the material flows freely both outward and inward and the bore grows. Under high friction the material cannot flow radially outward and is driven toward the centre, so the bore shrinks. The measured change is compared against pre-computed calibration curves to obtain the friction factor m.",
  s6note: "The friction factor m (0 ≤ m ≤ 1) and the Coulomb coefficient μ are different quantities. m relates interface shear stress to the shear yield stress of the material; μ relates shear stress to normal pressure. Most finite-element codes expect μ while the ring test yields m directly — a conversion is required and it depends on the stress state.",
  fig5Cap: "Figure 5 — Working principle of the ring compression test. The measured quantity is the change in bore diameter. Calibration curves are specific to material and geometry; a curve taken from the literature should not be used without validating it against your own geometry.",
  fig5Alt: "Ring specimen shapes under low and high friction",
  fig5Top: "the same height reduction is applied",
  fig5Init: "Initial ring", fig5Low: "Low friction", fig5LowS: "bore grows",
  fig5High: "High friction", fig5HighS: "bore shrinks",
  fig5Note1: "Percentage change in bore → calibration curve → friction factor m",
  fig5Note2: "Its advantage: the result is independent of the material's yield strength and needs no load measurement.",

  s7h: "Flow Stress, Hot Compression and Rolling Simulation",
  s7p1: "In hot compression, flow stress is a function of three variables: σ_f = f(ε, ε̇, T). The combined effect of temperature and strain rate is collapsed into a single variable through the Zener–Hollomon parameter; different T–ε̇ combinations at the same Z show similar flow behaviour.",
  s7c1: "// Zener–Hollomon parameter",
  s7c2: "// Hyperbolic-sine flow stress relation",
  s7note: "Q: activation energy for hot deformation (J/mol) · R = 8.314 J/(mol·K) · T absolute temperature\nA, α, n: material-specific constants determined experimentally",
  s7items: [
    { title: "Gleeble thermomechanical simulator", text: "Resistance heating gives fast temperature control while mechanical loading is applied simultaneously. Hot compression yields flow stress in the γ and α regions, recrystallisation kinetics (MFS — mean flow stress analysis) and deformation-conditioned CCT diagrams. Tantalum foil at the specimen ends serves as both lubricant and diffusion barrier." },
    { title: "Multi-pass testing and T_nr", text: "In Nb, V and Ti microalloyed steels a successive-pass simulation locates the no-recrystallisation temperature T_nr. Above T_nr full recrystallisation occurs between passes and no strain accumulates; below it strain accumulates, austenite pancakes and grain refinement follows transformation. The break in slope of the MFS–1/T plot gives T_nr." },
    { title: "Transfer to rolling load calculation", text: "Pass force is estimated as F = σ_f · A_contact · Q_p, where Q_p is a geometry-dependent pressure factor. σ_f is read from the compression test at the ε, ε̇ and T valid for that pass — if the three do not match, the load estimate is meaningless." },
    { title: "Model fitting for FEM", text: "For forming simulation of grades such as DP, TRIP and S700MC the σ_f curve is fitted with a Voce or Swift model and passed to the finite-element solver. The fit is valid only over the strain range reached in the test; do not extrapolate beyond it." },
  ],

  s8h: "Limitations and Error Sources",
  s8items: [
    ["Barrelling", "At large strains the deformation is not homogeneous; strain at mid-height is markedly higher than near the end faces. Uncorrected σ_f is systematically high."],
    ["Buckling", "Above the L/D limit the measured stress is not a material property. Specimen straightness must be checked after the test."],
    ["Toughness not measurable", "The compression test gives no direct information on fracture toughness or the ductile–brittle transition; Charpy, DWTT or CTOD are required for that."],
    ["Bauschinger effect", "After tensile pre-strain the compressive yield strength drops (kinematic hardening). Compression data cannot be compared with tensile data without knowing the pre-strain history."],
    ["Anisotropy", "In rolled product the compressive response depends on specimen axis. Through-thickness (ST), longitudinal (L) and transverse (T) directions give different results; the direction must be reported."],
    ["High-temperature oxidation", "Without a protective atmosphere (Ar, He) or vacuum, the oxide layer alters both the load measurement and the surface friction."],
    ["Adiabatic heating", "At high strain rate the deformation work converts to heat and the specimen warms; the measured flow stress falls below the isothermal value. A temperature correction is required for high-ε̇ tests."],
  ],

  s9h: "Note on Standards",
  s9p: "This page is based on ASTM E9 (compression testing of metallic materials at room temperature) and DIN 50106 (the European counterpart). Machine verification falls under ISO 7500-1 and extensometer classification under ASTM E83 / ISO 9513. No portion of any standard text is reproduced; the numerical ranges given are for reference. Standard editions may be revised, so verify the edition in force against your own copy before testing.",
  s9warn: "EN ISO 604 covers the compressive properties of plastics and does not apply to metallic materials. For metals, ASTM E9 or DIN 50106 applies.",

  footerPrev: "← DWTT", footerPrevHref: "/mechanical-tests/dwtt",
  footerNext: "↑ All Tests", footerNextHref: "/mechanical-tests",
};

/* ═════════════ stil ═════════════ */
function makeS(isDark) {
  const bg = isDark ? "#030712" : "#f8fafc";
  const bg2 = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "#1f2937" : "#e5e7eb";
  const title = isDark ? "#ffffff" : "#0f172a";
  const sub = isDark ? "#9ca3af" : "#6b7280";
  const body = isDark ? "#d1d5db" : "#374151";
  const muted = isDark ? "#6b7280" : "#9ca3af";
  const text = isDark ? "#f3f4f6" : "#111827";
  const accent = "#c084fc";
  const accent2 = isDark ? "#d8b4fe" : "#7c3aed";
  return {
    bg, bg2, border, title, sub, body, muted, text, accent, accent2, isDark,
    page: { minHeight: "100vh", backgroundColor: bg, color: text, transition: "background .2s" },
    breadcrumb: { borderBottom: `1px solid ${border}`, padding: "12px 24px", backgroundColor: bg },
    breadcrumbInner: { maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "monospace", color: muted },
    article: { maxWidth: "960px", margin: "0 auto", padding: "48px 24px" },
    h1: { fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: title, marginBottom: "16px" },
    lead: { color: sub, fontSize: "17px", lineHeight: 1.7, maxWidth: "760px" },
    h2: { fontSize: "22px", fontWeight: 700, color: title, marginBottom: "8px" },
    /* düzeltildi: eskiden renk atanmadığı için ayraç görünmüyordu */
    divider: { width: "48px", height: "2px", marginBottom: "24px", backgroundColor: accent },
    /* düzeltildi: rozet stili tanımsızdı */
    badge: { fontSize: "11px", fontFamily: "monospace", letterSpacing: ".08em", color: accent, border: `1px solid ${accent}55`, borderRadius: "999px", padding: "4px 12px" },
    card: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "20px" },
    codeBlock: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "14px", marginBottom: "20px" },
    p: { color: body, fontSize: "15px", lineHeight: 1.75, marginBottom: "18px" },
    figWrap: { backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: "12px", padding: "18px 18px 12px", marginBottom: "12px" },
    figCap: { color: muted, fontSize: "12.5px", lineHeight: 1.6, marginBottom: "24px", fontStyle: "italic" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: { textAlign: "left", padding: "10px 14px", color: sub, fontFamily: "monospace", fontSize: "11px", letterSpacing: ".04em", textTransform: "uppercase", borderBottom: `1px solid ${border}`, backgroundColor: bg2 },
    td: { padding: "10px 14px", color: body, fontSize: "13px", lineHeight: 1.6, borderBottom: `1px solid ${border}` },
    leftBorder: { backgroundColor: bg2, borderLeft: `3px solid ${accent}`, borderRadius: "0 12px 12px 0", padding: "18px 20px", marginBottom: "14px" },
    footer: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "32px", borderTop: `1px solid ${border}`, marginTop: "32px" },
  };
}

/* ═════════════ şekiller ═════════════ */
function figColors(s) {
  return {
    axis: s.isDark ? "#4b5563" : "#94a3b8",
    grid: s.isDark ? "#1f2937" : "#e5e7eb",
    grid2: s.isDark ? "#374151" : "#cbd5e1",
    fill: s.isDark ? "#1f2937" : "#f1f5f9",
    bg: s.bg2,
    title: s.title, body: s.body, sub: s.sub, dim: s.muted,
    accent: s.accent,
    warn: "#f59e0b",
    ok: "#34d399",
    bad: "#f87171",
  };
}

function FigCurve({ c, t }) {
  return (
    <svg viewBox="0 0 620 330" role="img" aria-label={t.fig1Alt} style={{ width: "100%", height: "auto" }}>
      <line x1="62" y1="286" x2="590" y2="286" stroke={c.axis} strokeWidth="1.5" />
      <line x1="62" y1="286" x2="62" y2="26" stroke={c.axis} strokeWidth="1.5" />
      <text x="326" y="318" fill={c.sub} fontSize="12" textAnchor="middle">{t.fig1X}</text>
      <text x="18" y="156" fill={c.sub} fontSize="12" textAnchor="middle" transform="rotate(-90 18 156)">{t.fig1Y}</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="62" y1={286 - i * 62} x2="590" y2={286 - i * 62} stroke={c.grid} strokeDasharray="3 5" />
      ))}
      <path d="M62,286 L92,200 L108,168 C130,140 160,124 200,112 C260,95 330,80 400,64 C460,50 520,38 566,30"
            fill="none" stroke={c.accent} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M62,286 L92,208 L108,180 C132,156 168,144 208,140 C248,136 286,140 310,152 C330,162 344,182 352,204"
            fill="none" stroke={c.dim} strokeWidth="1.8" strokeDasharray="6 4" strokeLinecap="round" />
      <circle cx="352" cy="204" r="3.4" fill={c.dim} />
      <text x="360" y="200" fill={c.dim} fontSize="11">{t.fig1Frac}</text>
      <text x="392" y="128" fill={c.dim} fontSize="11">{t.fig1Tens}</text>
      {/* elastik doğru ve ondan %0,2 ötelenmiş paralel — kesişim eğri üzerinde */}
      <line x1="62" y1="286" x2="118" y2="126" stroke={c.grid2} strokeWidth="1.2" />
      <line x1="76" y1="286" x2="132" y2="126" stroke={c.warn} strokeWidth="1.4" strokeDasharray="5 4" />
      <circle cx="123" cy="152" r="4.2" fill={c.warn} />
      <line x1="62" y1="152" x2="123" y2="152" stroke={c.warn} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="126" y1="157" x2="150" y2="198" stroke={c.warn} strokeWidth="1" />
      <text x="154" y="204" fill={c.warn} fontSize="11.5" fontWeight="600">{t.fig1Ys}</text>
      <text x="64" y="302" fill={c.warn} fontSize="10.5">{t.fig1Off}</text>
      <text x="152" y="276" fill={c.sub} fontSize="11">{t.fig1Elast}</text>
      <text x="248" y="52" fill={c.accent} fontSize="11.5" fontWeight="600">{t.fig1Comp}</text>
      <text x="248" y="68" fill={c.sub} fontSize="10.5">{t.fig1NoUts}</text>
    </svg>
  );
}

function FigSpecimens({ c, t }) {
  const rows = [
    { key: "short", x: 74, w: 54, h: 56, d: "D 12,7 – 28,6", L: "L 25 – 30 mm", ld: "L/D 1,0 – 1,12" },
    { key: "medium", x: 250, w: 46, h: 110, d: "D 12,7 – 28,6", L: "L 38 – 85 mm", ld: "L/D 1,5 – 3,4" },
    { key: "long", x: 430, w: 34, h: 194, d: "D 20 – 32", L: "L 160 – 320 mm", ld: "L/D 6,4 – 12,5" },
  ];
  const base = 300;
  return (
    <svg viewBox="0 0 620 356" role="img" aria-label={t.fig2Alt} style={{ width: "100%", height: "auto" }}>
      <line x1="30" y1={base} x2="590" y2={base} stroke={c.axis} strokeWidth="1.5" />
      {rows.map((r) => {
        const yTop = base - r.h;
        const cx = r.x + r.w / 2;
        return (
          <g key={r.key}>
            <rect x={r.x - 16} y={yTop - 11} width={r.w + 32} height="9" rx="1.5" fill={c.grid2} />
            <rect x={r.x - 16} y={base} width={r.w + 32} height="9" rx="1.5" fill={c.grid2} />
            <rect x={r.x} y={yTop} width={r.w} height={r.h} rx="1.5" fill={c.fill} stroke={c.accent} strokeWidth="1.8" />
            {/* yük oku — açık üçgen, marker döndürme sorunundan kaçınmak için */}
            <line x1={cx} y1={yTop - 34} x2={cx} y2={yTop - 20} stroke="#f59e0b" strokeWidth="2" />
            <path d={`M${cx - 5},${yTop - 21} L${cx},${yTop - 13} L${cx + 5},${yTop - 21} Z`} fill="#f59e0b" />
            <line x1={r.x - 26} y1={yTop} x2={r.x - 26} y2={base} stroke={c.sub} strokeWidth="1" />
            <line x1={r.x - 30} y1={yTop} x2={r.x - 22} y2={yTop} stroke={c.sub} strokeWidth="1" />
            <line x1={r.x - 30} y1={base} x2={r.x - 22} y2={base} stroke={c.sub} strokeWidth="1" />
            <line x1={r.x} y1={base + 16} x2={r.x + r.w} y2={base + 16} stroke={c.sub} strokeWidth="1" />
            <text x={cx} y={base + 40} fill={c.title} fontSize="12.5" fontWeight="700" textAnchor="middle">{t["fig2" + r.key]}</text>
            <text x={cx} y={yTop - 42} fill={c.body} fontSize="10.5" textAnchor="middle">{r.d}</text>
            <text x={cx} y={yTop - 56} fill={c.body} fontSize="10.5" textAnchor="middle">{r.L}</text>
            <text x={cx} y={yTop - 70} fill={c.accent} fontSize="10.5" fontWeight="600" textAnchor="middle">{r.ld}</text>
          </g>
        );
      })}
    </svg>
  );
}

function FigModes({ c, t }) {
  const items = [{ k: "homo", x: 52 }, { k: "barrel", x: 196 }, { k: "buckle", x: 340 }, { k: "fold", x: 484 }];
  const shapes = {
    homo: "M0,0 L64,0 L64,86 L0,86 Z",
    barrel: "M6,0 L58,0 C74,22 74,64 58,86 L6,86 C-10,64 -10,22 6,0 Z",
    buckle: "M12,0 L62,0 C42,26 28,58 48,86 L0,86 C-16,58 -4,26 12,0 Z",
    fold: "M4,0 L60,0 C80,18 66,40 76,52 C84,62 78,78 58,86 L6,86 C-14,78 -20,62 -12,52 C-2,40 -16,18 4,0 Z",
  };
  const cols = { homo: c.ok, barrel: c.accent, buckle: c.warn, fold: c.bad };
  return (
    <svg viewBox="0 0 620 228" role="img" aria-label={t.fig3Alt} style={{ width: "100%", height: "auto" }}>
      {items.map((it) => (
        <g key={it.k} transform={`translate(${it.x},32)`}>
          <rect x="-20" y="-11" width="104" height="8" rx="1.5" fill={c.grid2} />
          <rect x="-20" y="86" width="104" height="8" rx="1.5" fill={c.grid2} />
          <path d={shapes[it.k]} fill={c.fill} stroke={cols[it.k]} strokeWidth="1.9" />
          <text x="32" y="120" fill={c.title} fontSize="11.5" fontWeight="700" textAnchor="middle">{t["fig3" + it.k]}</text>
          <text x="32" y="137" fill={c.sub} fontSize="10" textAnchor="middle">{t["fig3" + it.k + "S"]}</text>
          <text x="32" y="153" fill={cols[it.k]} fontSize="10" fontWeight="600" textAnchor="middle">{t["fig3" + it.k + "C"]}</text>
        </g>
      ))}
      <g transform="translate(196,32)">
        <line x1="6" y1="-5" x2="24" y2="-5" stroke={c.accent} strokeWidth="1.4" />
        <line x1="58" y1="-5" x2="40" y2="-5" stroke={c.accent} strokeWidth="1.4" />
        <line x1="6" y1="91" x2="24" y2="91" stroke={c.accent} strokeWidth="1.4" />
        <line x1="58" y1="91" x2="40" y2="91" stroke={c.accent} strokeWidth="1.4" />
      </g>
      <text x="310" y="214" fill={c.sub} fontSize="10.5" textAnchor="middle">{t.fig3Note}</text>
    </svg>
  );
}

function FigFriction({ c, t }) {
  return (
    <svg viewBox="0 0 620 300" role="img" aria-label={t.fig4Alt} style={{ width: "100%", height: "auto" }}>
      <line x1="62" y1="256" x2="590" y2="256" stroke={c.axis} strokeWidth="1.5" />
      <line x1="62" y1="256" x2="62" y2="24" stroke={c.axis} strokeWidth="1.5" />
      <text x="326" y="288" fill={c.sub} fontSize="12" textAnchor="middle">{t.fig4X}</text>
      <text x="18" y="140" fill={c.sub} fontSize="12" textAnchor="middle" transform="rotate(-90 18 140)">{t.fig4Y}</text>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="62" y1={256 - i * 66} x2="590" y2={256 - i * 66} stroke={c.grid} strokeDasharray="3 5" />
      ))}
      <path d="M62,256 L96,150 C150,116 240,88 340,66 C420,48 500,36 566,28" fill="none" stroke={c.bad} strokeWidth="2.4" />
      <path d="M62,256 L96,158 C150,130 240,110 340,96 C420,86 500,80 566,76" fill="none" stroke={c.warn} strokeWidth="2.2" />
      <path d="M62,256 L96,164 C150,140 240,124 340,116 C420,110 500,108 566,107" fill="none" stroke={c.ok} strokeWidth="2.6" strokeDasharray="7 4" />
      <text x="440" y="22" fill={c.bad} fontSize="11" fontWeight="600">{t.fig4Dry}</text>
      <text x="440" y="68" fill={c.warn} fontSize="11" fontWeight="600">{t.fig4Lub}</text>
      <text x="440" y="128" fill={c.ok} fontSize="11" fontWeight="600">{t.fig4Corr}</text>
      <line x1="340" y1="66" x2="340" y2="116" stroke={c.sub} strokeWidth="1" strokeDasharray="2 3" />
      <text x="332" y="94" fill={c.sub} fontSize="10.5" textAnchor="end">{t.fig4Err}</text>
    </svg>
  );
}

function FigRing({ c, t }) {
  const Ring = ({ cx, cy, ro, ri, col }) => (
    <g>
      <ellipse cx={cx} cy={cy} rx={ro} ry={ro * 0.34} fill={c.fill} stroke={col} strokeWidth="1.9" />
      <ellipse cx={cx} cy={cy} rx={ri} ry={ri * 0.34} fill={c.bg} stroke={col} strokeWidth="1.6" />
    </g>
  );
  return (
    <svg viewBox="0 0 620 228" role="img" aria-label={t.fig5Alt} style={{ width: "100%", height: "auto" }}>
      <text x="310" y="18" fill={c.sub} fontSize="11" textAnchor="middle">{t.fig5Top}</text>
      <Ring cx={92} cy={84} ro={44} ri={22} col={c.dim} />
      <text x="92" y="148" fill={c.title} fontSize="11.5" fontWeight="700" textAnchor="middle">{t.fig5Init}</text>
      <text x="92" y="164" fill={c.sub} fontSize="10" textAnchor="middle">6 : 3 : 2</text>
      <text x="172" y="90" fill={c.sub} fontSize="20" textAnchor="middle">→</text>
      <Ring cx={280} cy={84} ro={60} ri={35} col={c.ok} />
      <text x="280" y="148" fill={c.ok} fontSize="11.5" fontWeight="700" textAnchor="middle">{t.fig5Low}</text>
      <text x="280" y="164" fill={c.sub} fontSize="10" textAnchor="middle">{t.fig5LowS}</text>
      <Ring cx={470} cy={84} ro={60} ri={12} col={c.bad} />
      <text x="470" y="148" fill={c.bad} fontSize="11.5" fontWeight="700" textAnchor="middle">{t.fig5High}</text>
      <text x="470" y="164" fill={c.sub} fontSize="10" textAnchor="middle">{t.fig5HighS}</text>
      <text x="310" y="196" fill={c.body} fontSize="11" textAnchor="middle">{t.fig5Note1}</text>
      <text x="310" y="214" fill={c.sub} fontSize="10.5" textAnchor="middle">{t.fig5Note2}</text>
    </svg>
  );
}

/* ═════════════ yardımcı bileşenler ═════════════ */
function Code({ s, lines }) {
  return (
    <div style={s.codeBlock}>
      {lines.map((l, i) => (
        <div key={i} style={{ marginTop: i ? 14 : 0 }}>
          <p style={{ color: s.muted, marginBottom: "6px", margin: 0 }}>{l[0]}</p>
          <p style={{ color: s.accent2, margin: "6px 0 0" }}>{l[1]}</p>
        </div>
      ))}
    </div>
  );
}

function Note({ s, children }) {
  return (
    <p style={{ color: s.muted, fontSize: "12px", fontFamily: "monospace", lineHeight: 1.75, whiteSpace: "pre-line", marginTop: "12px" }}>
      {children}
    </p>
  );
}

function Figure({ s, caption, children }) {
  return (
    <>
      <div style={s.figWrap}>{children}</div>
      <p style={s.figCap}>{caption}</p>
    </>
  );
}

function Table({ s, rows }) {
  const [head, ...body] = rows;
  return (
    <div style={{ overflowX: "auto", marginBottom: "12px" }}>
      <table style={s.table}>
        <thead>
          <tr>{head.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 ? s.bg2 : "transparent" }}>
              {r.map((cell, j) => (
                <td key={j} style={{ ...s.td, ...(j === 1 ? { fontFamily: "monospace", color: s.accent, whiteSpace: "nowrap" } : null), ...(j === 0 ? { fontWeight: 600, color: s.title } : null) }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═════════════ sayfa ═════════════ */
export default function CompressionTestPage() {
  const { lang } = useLang();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeS(isDark);
  const c = figColors(s);
  const t = lang === "tr" ? TR : EN;

  return (
    <main style={s.page}>
      <div style={s.breadcrumb}>
        <div style={s.breadcrumbInner}>
          <Link href="/mechanical-tests" style={{ color: s.accent, textDecoration: "none" }}>{t.breadcrumb}</Link>
          <span>/</span>
          <span style={{ color: s.body }}>{t.breadcrumbSub}</span>
        </div>
      </div>

      <article style={s.article}>
        <header style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={s.badge}>{t.badge}</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: s.muted }}>{t.counter}</span>
          </div>
          <h1 style={s.h1}>{t.h1}</h1>
          <p style={s.lead}>{t.lead}</p>
        </header>

        {/* § 1 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s1h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s1p1}</p>
          <p style={s.p}>{t.s1p2}</p>
          <Figure s={s} caption={t.fig1Cap}><FigCurve c={c} t={t} /></Figure>
          <Table s={s} rows={t.s1t} />
          <Code s={s} lines={[
            [t.s1c1, "σ = F / A = F · h / (A₀ · h₀)"],
            [t.s1c2, "ε = ln(h₀ / h)"],
            [t.s1c3, "A = A₀ · h₀ / h        (V = A₀h₀ = Ah)"],
          ]} />
        </section>

        {/* § 2 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s2h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s2p1}</p>
          <Table s={s} rows={t.s2t} />
          <Note s={s}>{t.s2note}</Note>
          <div style={{ height: "22px" }} />
          <Figure s={s} caption={t.fig2Cap}><FigSpecimens c={c} t={t} /></Figure>
          <p style={s.p}>{t.s2p2}</p>
        </section>

        {/* § 3 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s3h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s3p1}</p>
          <Code s={s} lines={[
            [t.s3c1, "σ_cr = π² E / (K L / r)²"],
            [t.s3c2, "σ_cr = π² E_t / (K L / r)²"],
          ]} />
          <Note s={s}>{t.s3note}</Note>
          <div style={{ height: "22px" }} />
          <Figure s={s} caption={t.fig3Cap}><FigModes c={c} t={t} /></Figure>
          <p style={s.p}>{t.s3p2}</p>
        </section>

        {/* § 4 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s4h}</h2>
          <div style={s.divider} />
          {t.s4items.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: 700, color: s.title, marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: s.sub, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* § 5 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s5h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s5p1}</p>
          <Figure s={s} caption={t.fig4Cap}><FigFriction c={c} t={t} /></Figure>
          <p style={s.p}>{t.s5p2}</p>
          <Code s={s} lines={[
            [t.s5c1, "p / σ_f = 1 + μ d / (3 h)"],
            [t.s5c2, "σ_f = p / (1 + μ d / (3 h))"],
          ]} />
          <Note s={s}>{t.s5note}</Note>
          <div style={{ height: "22px" }} />
          <p style={s.p}>{t.s5p3}</p>
        </section>

        {/* § 6 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s6h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s6p1}</p>
          <Figure s={s} caption={t.fig5Cap}><FigRing c={c} t={t} /></Figure>
          <p style={s.p}>{t.s6p2}</p>
          <Note s={s}>{t.s6note}</Note>
        </section>

        {/* § 7 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s7h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s7p1}</p>
          <Code s={s} lines={[
            [t.s7c1, "Z = ε̇ · exp(Q / R T)"],
            [t.s7c2, "Z = A [ sinh(α σ_f) ]ⁿ"],
          ]} />
          <Note s={s}>{t.s7note}</Note>
          <div style={{ height: "22px" }} />
          {t.s7items.map((item) => (
            <div key={item.title} style={s.leftBorder}>
              <h3 style={{ fontWeight: 700, color: s.title, marginBottom: "8px", fontSize: "15px" }}>{item.title}</h3>
              <p style={{ color: s.sub, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </section>

        {/* § 8 */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={s.h2}>{t.s8h}</h2>
          <div style={s.divider} />
          <div style={{ backgroundColor: isDark ? "rgba(88,28,135,0.18)" : "rgba(192,132,252,0.08)", border: `1px solid ${s.accent}33`, borderRadius: "12px", padding: "20px 22px" }}>
            {t.s8items.map(([k, v]) => (
              <div key={k} style={{ marginBottom: "14px" }}>
                <p style={{ color: s.accent, fontSize: "13px", fontWeight: 700, margin: "0 0 4px" }}>{k}</p>
                <p style={{ color: s.body, fontSize: "13.5px", lineHeight: 1.65, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* § 9 */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={s.h2}>{t.s9h}</h2>
          <div style={s.divider} />
          <p style={s.p}>{t.s9p}</p>
          <div style={{ border: `1px solid ${isDark ? "#78350f" : "#fcd34d"}`, backgroundColor: isDark ? "rgba(120,53,15,0.18)" : "rgba(252,211,77,0.14)", borderRadius: "10px", padding: "14px 16px" }}>
            <p style={{ color: isDark ? "#fcd34d" : "#92400e", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>{t.s9warn}</p>
          </div>
        </section>

        <footer style={s.footer}>
          <Link href={t.footerPrevHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerPrev}</Link>
          <Link href={t.footerNextHref} style={{ fontSize: "13px", fontFamily: "monospace", color: s.muted, textDecoration: "none" }}>{t.footerNext}</Link>
        </footer>
      </article>
    </main>
  );
}
