# Sıradaki Aksiyonlar — Senin Yapman Gerekenler

Aşağıdaki adımları **bu sırayla** tamamlaman gerekiyor. Kod değişiklikleri
yapıldı ama bu adımları sen bitirmeden site bozulabilir veya güvenlik
açıkları kapanmamış olur.

---

## 1) Yeni env değişkenlerini Vercel'e ekle  (ZORUNLU — yoksa admin paneli açılmaz)

Terminalde şu iki komutu çalıştırıp çıktıları not al:

```bash
openssl rand -base64 32   # ADMIN_KEY için
openssl rand -base64 48   # ADMIN_SESSION_SECRET için
```

`openssl` yoksa alternatif: https://generate-secret.vercel.app/32 ve /48

Sonra:

1. Vercel → Projen → **Settings → Environment Variables**
2. Şu değişkenleri **Production + Preview + Development** için ekle:
   - `ADMIN_KEY` = (yukarıdaki 32-byte çıktısı)
   - `ADMIN_SESSION_SECRET` = (yukarıdaki 48-byte çıktısı)
3. Aynı iki değeri `.env.local` dosyana da yaz (lokal dev için).
4. **Redeploy** yap.

**Admin paneline giriş artık bu yeni `ADMIN_KEY` ile olacak.** Eski
`metallurgy2026` anahtarı çalışmıyor.

> Not: `ADMIN_KEY` ve `ADMIN_SESSION_SECRET` ön eki NEXT_PUBLIC_ olmamalı.
> Ön ek eklenirse anahtar tarayıcıya sızar ve açık geri döner.

---

## 2) Eskiden sızmış olabilecek anahtarları rotate et  (ÖNEMLİ)

Eski `ADMIN_KEY = "metallurgy2026"` git geçmişinde kalmış olabilir. Kritik
değil (yeni ADMIN_KEY aktif olduğunda çalışmıyor) ama iyi pratik olarak
şunları da rotate et:
- Clerk Secret Key (Clerk Dashboard → API Keys → Regenerate)
- Stripe Secret Key + Webhook Secret (Stripe Dashboard → API Keys)
- iyzico / Shopier API anahtarları
- Google AI Studio API anahtarı
- Vercel KV tokenları (Vercel → Storage → KV → Rotate)

Rotate ettikten sonra Vercel env değişkenlerini yeni değerlerle güncelle.

---

## 3) Google Search Console doğrulaması  (SEO için ZORUNLU)

Sitenin Google aramalarında çıkmamasının en olası sebebi bu adım.

1. https://search.google.com/search-console → **Add Property**
2. Domain property ekle: `metallurgytools.com`
3. Doğrulama yöntemi olarak **HTML tag** seç. Sana şöyle bir kod verir:
   ```html
   <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxx" />
   ```
4. Sadece `content="..."` içindeki değeri al, Vercel'e:
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = `xxxxxxxxxxxxxxxxxx`
5. Redeploy → Search Console'da **Verify** butonuna bas.
6. Doğrulama başarılıysa **Sitemaps** sekmesine git, `sitemap.xml` gönder.
7. **URL Inspection** → ana sayfayı test et → **Request Indexing**.

Aynı süreci Bing Webmaster Tools için de yap (opsiyonel ama önerilir):
https://www.bing.com/webmasters → `NEXT_PUBLIC_BING_SITE_VERIFICATION`

**Bekleme süresi:** Google indeksleme tipik olarak 3–14 gün sürer.
[Unverified — Google algoritmasına bağlı] İlk taranmadan sonra sıralama
için backlink, içerik derinliği ve kullanıcı etkileşimi etkili olur.

---

## 4) Deploy sonrası güvenlik doğrulaması

Deploy tamamlandığında şu iki aracı çalıştır:

1. **https://securityheaders.com/** — `https://metallurgytools.com` yaz.
   Hedef: **A** veya **A+** notu.
2. **https://observatory.mozilla.org/** — aynı URL.
   Hedef: **B** veya üzeri. CSP `'unsafe-inline'` kullandığımız için
   A+ alamayabilirsin (Clerk / Google Analytics inline script gereksinimi).
3. **https://www.ssllabs.com/ssltest/** — SSL/TLS konfigürasyonu.
   Hedef: **A**. Vercel'in TLS sertifikası zaten geçerli.

Çıktıları bana gönderirsen kalan eksikleri kapatırız.

---

## 5) Admin panelini test et

1. Eski tarayıcı oturumlarını kapat / gizli pencere aç.
2. `https://metallurgytools.com/admin` → login ekranı çıkmalı.
3. Yeni `ADMIN_KEY` değerini gir.
4. Panel açılmalı; blog/consultation/feedback sayfaları çalışmalı.
5. DevTools → Application → Cookies → `mt_admin_session` görünmeli.
   **HttpOnly** ve **Secure** kolonları ✓ olmalı.
6. Çıkış yap → cookie silinmeli, tekrar login ekranı gelmeli.

---

## 6) İlerde yapılması önerilenler  (opsiyonel ama kurumsal düzey için gerekli)

- **Clerk role-based admin:** Mevcut admin anahtarı tekil bir paylaşımlı
  secret. Uzun vadede Clerk'te `admin` rolü tanımlayıp `metadata.role === "admin"`
  kontrolüne geçmek daha güvenli (rol bazlı log, çoklu admin, revoke).
- **Consultation/feedback verilerini KV/Postgres'e taşı:** Mevcut
  `global.*` in-memory store serverless'ta kaybolabilir.
- **WAF:** Vercel Firewall → Attack Challenge Mode veya Cloudflare ön-proxy.
- **Dependency audit:** `npm audit` ve `npm outdated` düzenli çalıştır.
  `@types/react@19` ve `typescript@6` gibi bazı dev bağımlılıkları
  runtime'ı etkilemez ama versiyon uyumluluğunu gözden geçir.
- **Backup:** Vercel KV verilerini haftalık export et (`kv` CLI ile).
- **Log monitoring:** Vercel Log Drains → Datadog/Logtail → admin-verify
  401/429'larını alarma bağla (brute-force tespit).
- **CSP nonce:** `'unsafe-inline'` yerine nonce-based CSP için Clerk
  script stratejisini `dangerouslySetInnerHTML` + `nonce` ile değiştir
  (daha sıkı XSS koruması).
- **Penetration test:** OWASP ZAP veya Burp Suite ile gerçek DAST tarama.

---

## Özet — Hemen Yapılacaklar

- [ ] `ADMIN_KEY` + `ADMIN_SESSION_SECRET` Vercel env'e eklendi
- [ ] Redeploy yapıldı
- [ ] Admin girişi yeni anahtarla test edildi
- [ ] Google Search Console mülk doğrulandı
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` Vercel env'e eklendi
- [ ] Sitemap Search Console'a submit edildi
- [ ] `securityheaders.com` taraması A/A+
- [ ] Eski API/secret anahtarları rotate edildi
