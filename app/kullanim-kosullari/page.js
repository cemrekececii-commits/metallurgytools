/**
 * Kullanım Koşulları — MetallurgyTools sitesi kullanıcı sözleşmesi şablonu.
 * [DOLDURUN] alanlarını şirket bilgileriniz ile değiştirin ve avukat
 * görüşü alın.
 */

export const metadata = {
  title: "Kullanım Koşulları",
  description: "MetallurgyTools sitesi kullanım koşulları, sorumluluk reddi ve fikri mülkiyet hakları.",
  alternates: { canonical: "https://www.metallurgytools.com/kullanim-kosullari" },
  robots: { index: true, follow: true },
};

export default function KullanimKosullari() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">Kullanım Koşulları</h1>
      <p className="text-sm text-dark-400 mb-8">Son güncelleme: 2026-05-26</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white mt-6">1. Taraflar ve Kapsam</h2>
        <p>
          Bu kullanım koşulları (&ldquo;Koşullar&rdquo;), <strong>[DOLDURUN: Tam ticari unvan]</strong>
          (&ldquo;MetallurgyTools&rdquo;) ile www.metallurgytools.com&apos;u (&ldquo;Site&rdquo;)
          ziyaret eden veya hizmetleri kullanan kişi (&ldquo;Kullanıcı&rdquo;) arasındaki
          ilişkiyi düzenler. Siteyi kullanarak bu Koşullar&apos;ı kabul etmiş sayılırsınız.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">2. Hizmetin Niteliği</h2>
        <p>
          Site, metalurji mühendislerine yönelik <em>mühendislik rehberliği</em> amacıyla
          hesaplama araçları, bilgi içerikleri ve danışmanlık formu sunar. İçerikler
          ASTM, EN ISO, API ve VDA standartlarına atıfla hazırlanmıştır; <strong>resmi
          standart metinlerinin yerine geçmez</strong>. Kritik tasarım ve emniyet
          kararlarında ilgili güncel standartlara ve yetkili mühendis değerlendirmesine
          başvurmak zorunludur.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">3. Hesap ve Üyelik</h2>
        <p>
          Bazı hizmetler için Clerk üzerinden hesap oluşturulması gerekir. Hesap
          bilgilerinizin güvenliği size aittir; oturumunuzu başkalarıyla
          paylaşmamalısınız. Yanıltıcı bilgilerle açılan hesapları askıya alma hakkımız
          saklıdır.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">4. Ücretli Hizmetler</h2>
        <p>
          Pro abonelik ücretleri Pricing sayfasında ilan edilir. Ödemeler Stripe,
          Shopier veya iyzico üzerinden alınır. Mesafeli Hizmet Sözleşmesi&apos;nde
          belirtilen cayma hakkı geçerlidir; ancak <em>tamamen elektronik ortamda anında
          ifa edilen ve sayısal içeriklere ilişkin hizmetler</em> bakımından Mesafeli
          Sözleşmeler Yönetmeliği&apos;nin 15. maddesindeki istisnalar uygulanabilir
          [Unverified — duruma göre avukat görüşü alınmalı].
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">5. Kabul Edilemez Kullanımlar</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Otomatik scraping, brute-force, API rate-limit bypass denemeleri</li>
          <li>Başka kullanıcıların hesabına yetkisiz erişim</li>
          <li>Site içeriğini izinsiz toplu çoğaltma veya yeniden yayınlama</li>
          <li>Zararlı yazılım/malware enjekte etmeye yönelik girişimler</li>
          <li>Yasalara aykırı içerik gönderimi</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">6. Fikri Mülkiyet</h2>
        <p>
          Site&apos;deki tüm metin, görsel, hesaplama algoritmaları, kod ve marka unsurları
          MetallurgyTools&apos;a aittir. Kişisel ve ticari olmayan bireysel kullanım dışında
          izinsiz kopyalama/dağıtım yasaktır. Standart atıfları (ASTM, EN ISO vb.)
          ilgili standart kuruluşlarının fikri mülkiyetidir.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">7. Sorumluluk Reddi</h2>
        <p>
          Site içerikleri &ldquo;olduğu gibi&rdquo; sunulur. Hesaplama sonuçlarının
          doğrudan kullanımından doğan kayıplar (üretim hatası, hatalı malzeme
          seçimi, kabul/red kararları, vb.) MetallurgyTools&apos;u bağlamaz. Tüm ampirik
          korelasyonlar belirtilen geçerlilik aralıklarında kullanılmalıdır.
          Mühendislik kararı kullanıcının sorumluluğundadır.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">8. Hizmet Değişiklikleri ve Askıya Alma</h2>
        <p>
          Site özellikleri, fiyatlar ve içerikler önceden bildirim yapılmaksızın
          değiştirilebilir. Bakım, güvenlik veya yasal sebeplerle hizmet geçici olarak
          askıya alınabilir.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">9. Uyuşmazlık Çözümü</h2>
        <p>
          Bu Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda
          <strong> [DOLDURUN: Yetkili mahkeme]</strong> Mahkemeleri ve İcra Daireleri
          yetkilidir. Tüketici uyuşmazlıkları için Tüketici Hakem Heyeti ve Tüketici
          Mahkemeleri yetkilidir.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">10. İletişim</h2>
        <p><a className="text-gold-400" href="mailto:info@metallurgytools.com">info@metallurgytools.com</a></p>
      </section>
    </main>
  );
}
