/**
 * Mesafeli Hizmet Sözleşmesi — 6502 sayılı Tüketicinin Korunması Hakkında
 * Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında zorunlu metin.
 *
 * NOT: Bu sayfa BİR ŞABLONDUR. Avukat görüşü alın. Ön Bilgilendirme Formu
 * ile birlikte iki ayrı belge olarak sunulması, ödeme sırasında her ikisinin
 * de açık rıza kutucuğu ile onaylatılması gerekir.
 */

export const metadata = {
  title: "Mesafeli Hizmet Sözleşmesi",
  description: "MetallurgyTools Pro abonelik mesafeli hizmet sözleşmesi (6502 sayılı kanun).",
  alternates: { canonical: "https://www.metallurgytools.com/mesafeli-hizmet-sozlesmesi" },
  robots: { index: true, follow: true },
};

export default function MesafeliHizmet() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">Mesafeli Hizmet Sözleşmesi</h1>
      <p className="text-sm text-dark-400 mb-8">Son güncelleme: 2026-05-26</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white mt-6">1. Taraflar</h2>
        <p><strong>SAĞLAYICI</strong></p>
        <ul className="list-disc pl-6">
          <li>Unvan: <strong>[DOLDURUN]</strong></li>
          <li>MERSİS: <strong>[DOLDURUN]</strong></li>
          <li>Adres: <strong>[DOLDURUN]</strong></li>
          <li>Telefon: <strong>[DOLDURUN]</strong></li>
          <li>E-posta: info@metallurgytools.com</li>
        </ul>
        <p><strong>ALICI</strong> Site üzerinden Pro abonelik satın alma akışında bilgileri kayda alınan kullanıcıdır.</p>

        <h2 className="text-xl font-semibold text-white mt-6">2. Konu</h2>
        <p>
          Alıcı&apos;nın Site üzerinden satın aldığı &ldquo;MetallurgyTools Pro&rdquo; aboneliğine
          (&ldquo;Hizmet&rdquo;) ilişkin tarafların hak ve yükümlülükleridir. Hizmet, tamamen
          dijital olarak sunulur; fiziki teslim yoktur.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">3. Sözleşme Konusu Hizmetin Temel Nitelikleri ve Fiyatı</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hizmet adı: <strong>MetallurgyTools Pro</strong></li>
          <li>Süre: 30 gün (aylık) / <strong>[DOLDURUN]</strong></li>
          <li>İçerik: tüm hesaplama araçları, knowledge base, consultation formu kotası, SEM-EDS analizi vb. (detay: Pricing sayfası)</li>
          <li>Fiyat (KDV dahil): <strong>[DOLDURUN]</strong></li>
          <li>Ödeme yöntemi: Stripe / Shopier / iyzico (kart bilgisi Sağlayıcı&apos;ya iletilmez)</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">4. Cayma Hakkı</h2>
        <p>
          Alıcı, hizmetin ifasının başlamasından önceki 14 gün içinde cayma hakkına
          sahiptir (6502 sayılı kanun Md. 48; Mesafeli Sözleşmeler Yönetmeliği Md. 9).
          Cayma bildirimi <a className="text-gold-400" href="mailto:info@metallurgytools.com">info@metallurgytools.com</a>
          adresine yapılabilir.
        </p>
        <p>
          <strong>İstisna (Md. 15/1-ğ):</strong> Alıcı&apos;nın açık onayı ile cayma süresi
          sona ermeden ifasına başlanmış olan elektronik ortamda anında ifa edilen
          hizmetlerde cayma hakkı kullanılamaz. Site, ödeme sonrası Pro özelliklerini
          anında aktifleştirdiği için Alıcı&apos;nın bu özelliklere erişmesi durumunda
          cayma hakkı düşer. Bu durum ödeme sırasında ayrı bir kutucukla onaylatılır.
          [Unverified — yasal görüşle teyit edin.]
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">5. Sağlayıcı&apos;nın Yükümlülükleri</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hizmeti Site&apos;de tarif edildiği özelliklerle sunmak</li>
          <li>Plana özgü teknik destek sağlamak (kullanıcı kanalları üzerinden)</li>
          <li>Verileri KVKK uyarınca güvenli şekilde işlemek</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">6. Alıcı&apos;nın Yükümlülükleri</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hesabını başkalarıyla paylaşmamak</li>
          <li>Otomatize scraping/abuse yapmamak</li>
          <li>Ücretleri zamanında ödemek</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">7. Yetkili Mahkeme</h2>
        <p>
          Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri, Tüketicinin Korunması
          Hakkında Kanun&apos;da belirlenen parasal sınırlar dahilinde yetkilidir.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">8. Yürürlük</h2>
        <p>
          İşbu sözleşme, Alıcı&apos;nın elektronik ortamda &ldquo;Okudum, anladım, kabul
          ediyorum&rdquo; kutucuğunu işaretlemesi ile yürürlüğe girer.
        </p>
      </section>
    </main>
  );
}
