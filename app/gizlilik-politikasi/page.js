/**
 * Gizlilik Politikası — KVKK Madde 5 & 10 aydınlatma uyumlu şablon.
 *
 * ÖNEMLİ: Bu metin BİR ŞABLONDUR. [DOLDURUN] ile işaretlenmiş alanları
 * şirketinize özgü bilgilerle doldurun ve YAYINLAMADAN ÖNCE bir avukat
 * tarafından gözden geçirilmesini sağlayın. KVKK aydınlatma yükümlülüğü
 * (Md. 10) yanlış/eksik bilgilendirme halinde idari para cezası ile
 * sonuçlanabilir.
 */

export const metadata = {
  title: "Gizlilik Politikası",
  description: "MetallurgyTools gizlilik politikası ve KVKK kapsamında kişisel veri işleme aydınlatma metni.",
  alternates: { canonical: "https://www.metallurgytools.com/gizlilik-politikasi" },
  robots: { index: true, follow: true },
};

export default function GizlilikPolitikasi() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">Gizlilik Politikası</h1>
      <p className="text-sm text-dark-400 mb-8">Son güncelleme: 2026-05-26</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white mt-6">1. Veri Sorumlusu</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) kapsamında veri sorumlusu
          sıfatıyla <strong>[DOLDURUN: Tam ticari unvan]</strong> (&ldquo;MetallurgyTools&rdquo;,
          &ldquo;biz&rdquo;) tarafından, www.metallurgytools.com (&ldquo;Site&rdquo;) ziyaretçileri
          ve kullanıcıları (&ldquo;veri sahipleri&rdquo;) hakkında işlenen kişisel verilerin
          işlenmesine ilişkin esaslar bu Gizlilik Politikası&apos;nda düzenlenmiştir.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Ticari unvan: <strong>[DOLDURUN]</strong></li>
          <li>MERSİS no: <strong>[DOLDURUN]</strong></li>
          <li>Adres: <strong>[DOLDURUN]</strong></li>
          <li>İletişim: <a href="mailto:info@metallurgytools.com" className="text-gold-400">info@metallurgytools.com</a></li>
          <li>KVKK başvurusu: <a href="mailto:kvkk@metallurgytools.com" className="text-gold-400">kvkk@metallurgytools.com</a></li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">2. İşlenen Kişisel Veri Kategorileri</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Kimlik bilgileri:</strong> ad, soyad.</li>
          <li><strong>İletişim bilgileri:</strong> e-posta adresi, şirket adı (consultation formu).</li>
          <li><strong>İşlem güvenliği:</strong> IP adresi, oturum çerezi (mt_admin_session), tarayıcı türü, kullanım logları.</li>
          <li><strong>Müşteri işlem:</strong> abonelik durumu, satın alma bilgisi (Stripe / Shopier / iyzico aracılığıyla; ödeme kartı bilgisi tarafımıza ulaşmaz).</li>
          <li><strong>Talep/şikâyet:</strong> consultation formu üzerinden ilettiğiniz teknik durum açıklamaları, ek dosyalar (görsel, PDF).</li>
          <li><strong>Pazarlama:</strong> sadece açık rıza vermeniz halinde — site içi davranış analizi (Microsoft Clarity), trafik analizi (Google Analytics 4).</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">3. İşleme Amaçları ve Hukuki Sebepleri</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Hizmet sunumu:</strong> hesabınızın oluşturulması, abonelik yönetimi — sözleşmenin kurulması/ifası (KVKK Md. 5/2-c).</li>
          <li><strong>Site güvenliği, dolandırıcılığın önlenmesi:</strong> rate-limit, IP loglama — meşru menfaat (Md. 5/2-f).</li>
          <li><strong>Yasal yükümlülük:</strong> e-fatura, vergi kayıtları, KVKK/MASAK — kanunlarda öngörülmesi (Md. 5/2-a).</li>
          <li><strong>İletişim ve danışmanlık taleplerine yanıt:</strong> sözleşme öncesi/kurulması (Md. 5/2-c).</li>
          <li><strong>Analitik ve pazarlama:</strong> yalnızca <em>açık rızanız</em> (Md. 5/1) — istediğiniz zaman geri çekebilirsiniz.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">4. Aktarım</h2>
        <p>
          Verileriniz aşağıdaki hizmet sağlayıcılarına, sözleşmesel/yasal yükümlülükler
          çerçevesinde aktarılabilir:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Vercel Inc.</strong> (ABD) — hosting ve KV/Blob veri depolama. KVKK Md. 9 kapsamında yurt dışına aktarım açık rızanıza tabi olabilir; SCC/standart sözleşmeler hukuki sebep olarak kullanılabilir.</li>
          <li><strong>Clerk Inc.</strong> (ABD) — kimlik doğrulama.</li>
          <li><strong>Stripe Inc.</strong> (ABD) / <strong>Shopier</strong> (TR) / <strong>iyzico</strong> (TR) — ödeme işlemleri.</li>
          <li><strong>Google LLC</strong> (Google Analytics 4) — yalnızca açık rıza ile.</li>
          <li><strong>Microsoft Ireland</strong> (Microsoft Clarity) — yalnızca açık rıza ile.</li>
        </ul>
        <p>
          Resmi makamların talebi halinde, ilgili mevzuat çerçevesinde gerekli aktarım yapılır.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">5. Saklama Süreleri</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hesap verileri: aktif abonelik süresince + 10 yıl (Türk Borçlar Kanunu zamanaşımı).</li>
          <li>Fatura/ödeme kayıtları: VUK md. 253 gereği 5 yıl.</li>
          <li>Consultation formu içerikleri: yanıt tarihinden itibaren 3 yıl, sonra anonimleştirilir.</li>
          <li>Log kayıtları: 1 yıl (5651 sayılı Kanun çerçevesinde).</li>
          <li>Analitik çerez verileri (rıza varsa): GA4 14 ay, Clarity 1 yıl.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">6. Veri Sahibi Hakları (KVKK Md. 11)</h2>
        <p>Aşağıdaki haklarınızı kullanmak için <a href="mailto:kvkk@metallurgytools.com" className="text-gold-400">kvkk@metallurgytools.com</a> adresine başvurabilirsiniz:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>Amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içi/yurt dışı üçüncü kişileri bilme</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
          <li>Şartlar oluştuğunda silinmesini/yok edilmesini isteme</li>
          <li>Otomatik sistemler ile analiz sonucu aleyhinize çıkan sonuca itiraz etme</li>
          <li>Kanuna aykırı işleme sebebiyle zarara uğrarsanız tazminat talep etme</li>
        </ul>
        <p>Başvurunuz Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun olarak en geç 30 gün içinde yanıtlanır.</p>

        <h2 className="text-xl font-semibold text-white mt-6">7. Çerezler</h2>
        <p>Detaylı bilgi için <a href="/cerez-politikasi" className="text-gold-400">Çerez Politikası</a> sayfamıza bakınız.</p>

        <h2 className="text-xl font-semibold text-white mt-6">8. Güvenlik Tedbirleri</h2>
        <p>
          Verilerinizin güvenliği için TLS şifreleme, HMAC imzalı oturum çerezleri,
          rate-limit, input validation, Content Security Policy gibi teknik ve idari
          tedbirler uygulanmaktadır. Buna rağmen internet üzerindeki hiçbir iletim
          %100 güvenli değildir. [Inference — endüstri standardı uyarı]
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">9. Değişiklikler</h2>
        <p>
          Bu politika ihtiyaç halinde güncellenebilir. Önemli değişiklikler hakkında
          Site üzerinde bilgilendirme yapılır. Son güncelleme tarihi yukarıda
          belirtilmiştir.
        </p>
      </section>
    </main>
  );
}
