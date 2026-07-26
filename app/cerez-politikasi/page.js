/**
 * Çerez Politikası — KVKK + ePrivacy (2002/58/EC) uyumlu şablon.
 * [DOLDURUN] alanlarını şirket bilgileriniz ile değiştirin; yasal görüş alın.
 */

import CookiePrefsButton from "@/components/CookiePrefsButton";

export const metadata = {
  title: "Çerez Politikası",
  description: "MetallurgyTools sitesinde kullanılan çerezler, amaçları, süresi ve tercih yönetimi.",
  alternates: { canonical: "https://www.metallurgytools.com/cerez-politikasi" },
  robots: { index: true, follow: true },
};

const COOKIES = [
  { name: "__clerk_*",            type: "Zorunlu", purpose: "Clerk oturum yönetimi (kimlik doğrulama)", duration: "Oturum + 7 gün", provider: "Clerk (ABD)" },
  { name: "mt_admin_session",     type: "Zorunlu", purpose: "Admin panel oturumu (HMAC imzalı, HttpOnly)", duration: "12 saat",   provider: "Birinci taraf" },
  { name: "mt_cookie_consent_v1", type: "Zorunlu", purpose: "Çerez tercihinizi hatırlamak", duration: "1 yıl",                    provider: "Birinci taraf (localStorage)" },
  { name: "_ga, _ga_*",           type: "Analitik (rıza)",   purpose: "Google Analytics 4 — anonim ziyaret istatistikleri", duration: "14 ay", provider: "Google LLC (ABD)" },
  { name: "_clck, _clsk",         type: "Analitik (rıza)",   purpose: "Microsoft Clarity — oturum kaydı/heatmap", duration: "1 yıl",         provider: "Microsoft Ireland" },
  { name: "__stripe_*",           type: "Zorunlu (ödeme)",   purpose: "Stripe Checkout dolandırıcılık önleme", duration: "Oturum",          provider: "Stripe Inc. (ABD)" },
];

export default function CerezPolitikasi() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-dark-200 leading-relaxed">
      <h1 className="text-3xl font-bold text-gold-400 mb-2">Çerez Politikası</h1>
      <p className="text-sm text-dark-400 mb-8">Son güncelleme: 2026-05-26</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white mt-6">1. Çerez nedir?</h2>
        <p>
          Çerezler (cookies), bir web sitesi ziyaret edildiğinde tarayıcınız tarafından
          cihazınıza küçük metin dosyaları olarak yerleştirilen, sonraki ziyaretlerde
          siteye geri okunabilen verilerdir. Bazıları sitenin çalışması için zorunlu,
          bazıları ise analitik veya pazarlama amaçlıdır.
        </p>

        <h2 className="text-xl font-semibold text-white mt-6">2. Kullandığımız çerezler</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="p-2 text-left">Çerez</th>
                <th className="p-2 text-left">Tür</th>
                <th className="p-2 text-left">Amaç</th>
                <th className="p-2 text-left">Süre</th>
                <th className="p-2 text-left">Sağlayıcı</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-t border-white/5">
                  <td className="p-2 font-mono text-xs">{c.name}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.purpose}</td>
                  <td className="p-2">{c.duration}</td>
                  <td className="p-2">{c.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-white mt-6">3. Hukuki Sebep</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Zorunlu çerezler:</strong> KVKK Md. 5/2-c ve 5/2-f — sözleşmenin ifası ve meşru menfaat (rıza gerekmez).</li>
          <li><strong>Analitik / pazarlama çerezleri:</strong> KVKK Md. 5/1 — yalnızca açık rıza ile yüklenir. Banner üzerinden &ldquo;Tümünü kabul et&rdquo; veya &ldquo;Tercihleri ayarla&rdquo; → &ldquo;Analitik&rdquo; / &ldquo;Pazarlama&rdquo; kutusunu seçerek rıza vermeniz halinde yüklenir.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6">4. Tercihinizi Değiştirme</h2>
        <p>
          Tercihinizi istediğiniz zaman değiştirebilirsiniz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Bu sayfada veya footer&apos;da &ldquo;Çerez Tercihleri&rdquo; bağlantısına tıklayarak banner&apos;ı yeniden açın.</li>
          <li>Tarayıcı ayarlarınızdan tüm çerezleri silebilir veya engelleyebilirsiniz (zorunlu çerezler engellenirse site bazı özellikleri çalışmayabilir).</li>
          <li>Google Analytics opt-out: <a className="text-gold-400" href="https://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</a></li>
        </ul>

        <CookiePrefsButton />

        <h2 className="text-xl font-semibold text-white mt-6">5. İletişim</h2>
        <p>Sorularınız için: <a href="mailto:kvkk@metallurgytools.com" className="text-gold-400">kvkk@metallurgytools.com</a></p>
      </section>
    </main>
  );
}
