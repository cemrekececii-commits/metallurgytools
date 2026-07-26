/**
 * KVKK Aydınlatma Metni — Form/satın alma sırasında bağımsız olarak
 * gösterilen, KVKK Md. 10 kapsamında zorunlu aydınlatma metni.
 *
 * Gizlilik Politikası'ndan ayrı tutulmasının sebebi: Aydınlatma metni
 * formlardan, e-posta footer'larından, kayıt akışlarından LINK olarak
 * gösterilir; daha kısa ve doğrudan olmalıdır.
 */

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı KVKK Madde 10 kapsamında kişisel veri işleme aydınlatma metni.",
  alternates: { canonical: "https://www.metallurgytools.com/kvkk-aydinlatma" },
  robots: { index: true, follow: true },
};

export default function KvkkAydinlatma() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-sm text-dark-400 mb-8">6698 sayılı Kişisel Verilerin Korunması Kanunu Madde 10</p>

      <section className="space-y-4">
        <p>
          <strong>[DOLDURUN: Tam ticari unvan]</strong> (&ldquo;MetallurgyTools&rdquo;) olarak,
          veri sorumlusu sıfatıyla, www.metallurgytools.com sitesi üzerinden ilettiğiniz
          kişisel verilerinizin işlenmesinde 6698 sayılı KVKK&apos;nın 10. maddesi gereğince
          sizleri bilgilendirmek isteriz.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">Veri Sorumlusu</h2>
        <ul className="list-disc pl-6">
          <li>Ticari unvan: <strong>[DOLDURUN]</strong></li>
          <li>MERSİS no: <strong>[DOLDURUN]</strong></li>
          <li>Adres: <strong>[DOLDURUN]</strong></li>
          <li>E-posta: <a className="text-gold-400" href="mailto:kvkk@metallurgytools.com">kvkk@metallurgytools.com</a></li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">İşlenen Veriler</h2>
        <p>
          Ad–soyad, e-posta, şirket adı, telefon (opsiyonel), iletişim mesajı veya
          consultation formu içeriği, ekli dosyalar, IP adresi, tarayıcı bilgisi,
          ödeme yapan kullanıcılar için satın alma bilgisi (kart bilgisi tarafımızca
          işlenmez; Stripe/Shopier/iyzico tarafından işlenir).
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">İşleme Amaçları</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hizmet sunumu (hesap oluşturma, abonelik yönetimi, danışmanlık yanıtı)</li>
          <li>İletişim taleplerinizin karşılanması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, e-fatura, MASAK, 5651 sayılı kanun)</li>
          <li>Site güvenliği, dolandırıcılık önleme</li>
          <li>Açık rızanız varsa: analitik ve pazarlama amaçlı kullanım</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">Hukuki Sebep</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>KVKK Md. 5/2-c: sözleşmenin kurulması/ifası</li>
          <li>KVKK Md. 5/2-ç: hukuki yükümlülük</li>
          <li>KVKK Md. 5/2-f: meşru menfaat</li>
          <li>KVKK Md. 5/1: açık rıza (analitik/pazarlama)</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">Aktarım</h2>
        <p>
          Verileriniz, hizmet sağlayıcılarımıza (Vercel, Clerk, Stripe, Shopier, iyzico,
          Google, Microsoft) ve yetkili kamu kurumlarına yasal sınırlar dahilinde
          aktarılabilir. Yurt dışı aktarım için KVKK Md. 9 kapsamında uygun güvenceler
          sağlanır (standart sözleşmeler / açık rıza).
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">Haklarınız (KVKK Md. 11)</h2>
        <p>
          Bilgi talebi, düzeltme, silme, itiraz ve tazminat dahil tüm haklarınız için
          başvuru: <a className="text-gold-400" href="mailto:kvkk@metallurgytools.com">kvkk@metallurgytools.com</a>.
          Başvurular Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun
          olarak 30 gün içinde yanıtlanır.
        </p>

        <p className="text-sm text-dark-400 mt-8">
          Bu metin, ilgili form veya kayıt akışında bir kutucuk işaretlemenizle
          görmüş ve okumuş sayılırsınız. Daha geniş bilgi için
          <a href="/gizlilik-politikasi" className="text-gold-400"> Gizlilik Politikası</a>&apos;na bakınız.
        </p>
      </section>
    </main>
  );
}
