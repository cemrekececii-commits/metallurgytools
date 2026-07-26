/**
 * İletişim — KVKK Md.10 ve 5651 sayılı kanun gereği erişilebilir
 * şirket iletişim bilgilerini gösteren sayfa. [DOLDURUN] alanlarını
 * gerçek MERSİS / ticari bilgilerinizle güncelleyin.
 *
 * Bu sayfa Footer'dan ve yasal sayfalardan link verilir. Bu nedenle
 * server component olarak basit ve cache-friendly tutulmuştur.
 */

export const metadata = {
  title: "İletişim",
  description: "MetallurgyTools iletişim bilgileri — MERSİS, adres, e-posta ve KVKK başvuru kanalı.",
  alternates: { canonical: "https://www.metallurgytools.com/iletisim" },
  robots: { index: true, follow: true },
};

export default function Iletisim() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">İletişim</h1>
      <p className="text-sm text-dark-400 mb-8">
        Genel sorular, KVKK başvuruları ve teknik destek için iletişim kanallarımız.
      </p>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Şirket Bilgileri</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ticari unvan: <strong>[DOLDURUN — Tam ticari unvan]</strong></li>
            <li>MERSİS no: <strong>[DOLDURUN]</strong></li>
            <li>Vergi dairesi / Vergi no: <strong>[DOLDURUN]</strong></li>
            <li>Ticaret sicil no: <strong>[DOLDURUN]</strong></li>
            <li>Adres: <strong>[DOLDURUN — Açık ticari adres]</strong></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">İletişim Kanalları</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Genel: <a className="text-gold-400" href="mailto:info@metallurgytools.com">info@metallurgytools.com</a>
            </li>
            <li>
              KVKK / Veri sahibi başvuruları:{" "}
              <a className="text-gold-400" href="mailto:kvkk@metallurgytools.com">kvkk@metallurgytools.com</a>
            </li>
            <li>
              Güvenlik bildirimleri (responsible disclosure):{" "}
              <a className="text-gold-400" href="mailto:security@metallurgytools.com">security@metallurgytools.com</a>
            </li>
            <li>
              Faturalama / abonelik:{" "}
              <a className="text-gold-400" href="mailto:billing@metallurgytools.com">billing@metallurgytools.com</a>
            </li>
            <li>Telefon: <strong>[DOLDURUN]</strong></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Danışmanlık ve Hasar Analizi Talepleri</h2>
          <p>
            Numune değerlendirme, SEM-EDS analizi, kırılma yüzeyi incelemesi ve hasar
            analizi talepleri için{" "}
            <a className="text-gold-400" href="/consultation">consultation formu</a>{" "}
            üzerinden başvurmanız önerilir. Numune kabul protokolü, gizlilik anlaşması ve
            geri raporlama süresi yanıt e-postasında iletilir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Tüketici Hakem Heyeti / Uyuşmazlık</h2>
          <p>
            6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki uyuşmazlıklarda
            Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir. Parasal sınırlar
            her yıl Ticaret Bakanlığı tarafından güncellenir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mt-6 mb-3">Yasal Sayfalar</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><a className="text-gold-400" href="/gizlilik-politikasi">Gizlilik Politikası</a></li>
            <li><a className="text-gold-400" href="/kvkk-aydinlatma">KVKK Aydınlatma Metni</a></li>
            <li><a className="text-gold-400" href="/cerez-politikasi">Çerez Politikası</a></li>
            <li><a className="text-gold-400" href="/kullanim-kosullari">Kullanım Koşulları</a></li>
            <li><a className="text-gold-400" href="/mesafeli-hizmet-sozlesmesi">Mesafeli Hizmet Sözleşmesi</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
