# MetallurgyTools — Güvenlik Denetim Raporu
**Tarih:** 2026-04-15
**Kapsam:** Next.js 14 App Router + Clerk + Vercel KV/Blob + Stripe/iyzico
**Denetim tipi:** Statik kod incelemesi (SAST) + yapılandırma analizi

---

## Yönetici Özeti

Bu denetim sonucunda **kritik seviyede iki adet**, yüksek seviyede dört adet ve
orta seviyede yedi adet bulgu tespit edilmiştir. Tespit edilen açıklıklar
(A01, A02, A04, A05, A07 OWASP Top-10 kategorileri) doğrudan istismar
edilebilir nitelikteydi; en kritik olanı admin panelinin **client-side**
kontrol ile korunuyor olmasıdır. Bu bulgular bu commit setinde uygulama
kodunda düzeltilmiştir. Bazı aksiyonlar yalnızca site sahibi tarafından
tamamlanabilir; bunlar `SECURITY-ACTIONS.md` içinde listelenmiştir.

---

## Bulgular

### [CRITICAL-01] Admin kimlik doğrulaması tamamen client-side
**Dosyalar:** `app/admin/layout.js`, `app/admin/*/page.js`, `lib/planUtils.js`
**OWASP:** A01 — Broken Access Control
**Bulgu:** `ADMIN_KEY = "metallurgy2026"` sabiti client bileşenlerinde
hardcoded idi. Next.js `"use client"` modülleri tarayıcıya JavaScript bundle
olarak gönderildiğinden, bu anahtar herkese açık olarak tarayıcıdan
okunabiliyordu (DevTools → Sources). Ayrıca oturum yalnızca
`sessionStorage.setItem("mt_admin_authed","1")` ile tutuluyordu; saldırgan
bu anahtarı bilmese bile browser konsolundan bu değeri manuel set ederek
admin paneline erişebiliyordu.
**Etki:** Tam admin yetkisi (blog CRUD, kullanıcı yönetimi, consultation
okuma).
**Düzeltme (uygulandı):**
- Anahtar tüm client dosyalarından kaldırıldı.
- Yeni `lib/adminAuth.js`: HMAC-SHA256 imzalı JWT benzeri token, 12 saat TTL.
- `POST /api/admin/verify` — `timingSafeEqual` ile anahtar doğrulaması,
  başarılıysa `HttpOnly + Secure + SameSite=Strict` cookie set edilir.
- Tüm admin API rotaları `cookies()` üzerinden sunucuda doğrulanır.
- `/api/admin/verify` 5 dakika içinde 5 deneme ile IP başına rate-limited.

### [CRITICAL-02] Hardcoded secret ile güvensiz fallback
**Dosyalar:** `app/api/blog/route.js`, `app/api/blog/upload/route.js`,
`app/api/blog/[id]/route.js`, `app/api/admin/migrate-blogs/route.js`
**OWASP:** A07 — Identification and Authentication Failures
**Bulgu:** `process.env.BLOG_ADMIN_KEY || "metallurgy2026"` örüntüsü ile env
değişkeni yoksa düz metin fallback kullanılıyordu. Env değişkeni
ayarlanmadıysa üretimde aynı zayıf anahtar etkin kalıyordu.
**Düzeltme (uygulandı):** Fallback tamamen kaldırıldı. `ADMIN_KEY` yoksa
`lib/adminAuth.js` fail-closed çalışır (exception atar) — anahtar olmadan
kimse giremez.

### [HIGH-01] Güvenlik başlıkları (HTTP headers) yok
**Dosya:** `next.config.js`
**OWASP:** A05 — Security Misconfiguration
**Bulgu:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
Permissions-Policy, COOP/CORP — hiçbiri tanımlı değildi.
**Etki:** Clickjacking, MIME sniffing, cross-origin leak, mixed content
saldırılarına açık.
**Düzeltme (uygulandı):** Kapsamlı `securityHeaders` tanımlandı
(bkz. `next.config.js`). CSP whitelist'i Clerk, Stripe, Google Analytics,
Clarity, Vercel Blob/KV, Unsplash, iyzico, Shopier host'larını içerir.

### [HIGH-02] API endpoint'lerinde rate limiting yok
**Dosyalar:** `app/api/consultation/route.js`, `app/api/feedback/route.js`,
`app/api/admin/verify/route.js` (yeni)
**OWASP:** A04 — Insecure Design
**Bulgu:** Public POST endpoint'leri ve admin login endpoint'i rate limiting
olmadan çalışıyordu — brute-force, spam ve DoS riski.
**Düzeltme (uygulandı):** `lib/rateLimit.js` — Vercel KV (Upstash Redis)
tabanlı sliding window limiter. KV yoksa in-memory fallback. Limitler:
`feedback POST`: 5/dk, `consultation POST`: 3/5dk, `admin-verify`: 5/5dk.

### [HIGH-03] Input validation eksikliği + XSS yüzeyi
**Dosyalar:** `app/api/*/route.js`, `app/blog/[slug]/page.js`
**OWASP:** A03 — Injection
**Bulgu:** Consultation/feedback endpoint'leri `body` alanlarını doğrulamadan
`global.store`'a yazıyordu. Email formatı kontrolü yoktu; boyut limiti
yoktu; kontrol karakterleri kabul ediliyordu. Blog içeriği
`dangerouslySetInnerHTML` ile render ediliyor; `parseMarkdown`
`&/</>/` kaçırıyor olsa da girişte HTML tag'ler ham kaydediliyordu.
**Düzeltme (uygulandı):** `lib/validation.js` — `cleanString`, `stripTags`,
`isEmail`, `isSlug`, `validateAttachments`, `approxByteSize` yardımcıları.
Tüm POST/PUT endpoint'lerinde uygulandı. Email RFC 5321 uzunluk kontrolü,
kontrol karakterleri temizleniyor, alan bazında maksimum uzunluklar
belirlendi.

### [HIGH-04] Dosya ekleri (base64) için boyut/tür kontrolü yok
**Dosya:** `app/api/consultation/route.js` + `next.config.js`
**OWASP:** A04 — Insecure Design
**Bulgu:** `bodySizeLimit: "25mb"` ayarı; consultation formu `files: [...]`
base64 olarak kabul ediyordu. Dosya sayısı, tür ve toplam boyut
denetlenmiyordu.
**Düzeltme (uygulandı):** `bodySizeLimit` → 8 MB. `validateAttachments` ile
maksimum 5 dosya, 6 MB toplam, yalnızca `image/png|jpeg|jpg|webp|gif` ve
`application/pdf` data URL'leri kabul ediliyor.

### [MEDIUM-01] Admin anahtarı URL query string'de iletiliyordu
**Dosyalar:** admin client sayfaları
**OWASP:** A09 — Security Logging/Monitoring Failures (side effect)
**Bulgu:** `fetch("/api/feedback?key=metallurgy2026")` örneği. URL
parametreleri Vercel edge log'larında, CDN log'larında, Referer header'larında
sızabilir.
**Düzeltme (uygulandı):** Cookie tabanlı auth'a geçildi; query string
üzerinden anahtar iletimi tamamen kaldırıldı.

### [MEDIUM-02] `x-powered-by: Next.js` teknoloji parmak izi
**Dosya:** `next.config.js`
**Düzeltme (uygulandı):** `poweredByHeader: false`.

### [MEDIUM-03] Production source map'ler açıktı (varsayılan)
**Dosya:** `next.config.js`
**Düzeltme (uygulandı):** `productionBrowserSourceMaps: false`.

### [MEDIUM-04] Google Search Console doğrulama eksikti
**Dosya:** `app/layout.js`
**Bulgu:** Sitenin Google'da gözükmemesinin en olası nedenlerinden biri.
Sitemap ve robots.txt doğru yapılandırılmıştı ancak Search Console
mülk doğrulaması yoktu, dolayısıyla sitemap indekse submit edilmemişti.
**Düzeltme (uygulandı):** `metadata.verification.google`, `msvalidate.01`,
`yandex-verification` alanları env-driven olarak eklendi. Kullanıcının
Search Console'da doğrulama kodunu üretip env değişkenine yazması gerekir
(bkz. `SECURITY-ACTIONS.md`).

### [MEDIUM-05] JSON-LD structured data yok
**Dosya:** `app/layout.js`
**Etki:** Google zengin sonuçlarda site bilgisini göremiyor, CTR düşük.
**Düzeltme (uygulandı):** `Organization` ve `WebSite` (SearchAction dahil)
JSON-LD blokları `<head>` içine eklendi.

### [MEDIUM-06] `robots` metadata'sında GoogleBot-özel talimatlar yoktu
**Dosya:** `app/layout.js`
**Düzeltme (uygulandı):** `max-snippet`, `max-image-preview: large`,
`max-video-preview` eklendi; rich result'larda görünürlük artışı.

### [MEDIUM-07] `global.store` kullanımı (consultation + feedback)
**Dosyalar:** `app/api/consultation/route.js`, `app/api/feedback/route.js`
**Bulgu:** Serverless fonksiyonlar arasında `global` persist etmez; veriler
kaybolabilir ve farklı lambda instance'ları arasında tutarsız kalabilir.
**Öneri (kod değiştirilmedi — veri modelini etkiler):** Vercel KV'ye
migrasyon yapılmalı (blog için zaten yapılmış). Bu rapor kapsamında
semantik değişiklik yapmadım; yalnızca validation ekledim. Sonraki iterasyonda
KV/Postgres migrasyonu önerilir.

### [LOW-01] `strict-origin-when-cross-origin` yerine daha sıkı referrer
**Dosya:** `next.config.js`
**Mevcut:** `strict-origin-when-cross-origin` (Referrer-Policy) — endüstri
standardı. Daha sıkı istenirse `no-referrer` kullanılabilir; ancak
analytics ve affiliate referans bilgisini bozabilir. Varsayılanda bırakıldı.

---

## Değiştirilen / Eklenen Dosyalar

| Dosya | Durum | Amaç |
|------|------|------|
| `next.config.js` | Değişti | Security headers, poweredBy kapatma, bodySizeLimit |
| `lib/adminAuth.js` | **Yeni** | HMAC imzalı cookie tabanlı admin auth |
| `lib/validation.js` | **Yeni** | Input sanitization + attachment validation |
| `lib/rateLimit.js` | **Yeni** | KV tabanlı rate limiter |
| `app/api/admin/verify/route.js` | **Yeni** | Login/logout/session endpoint'i |
| `app/api/admin/users/route.js` | Değişti | Cookie auth'a geçiş |
| `app/api/admin/migrate-blogs/route.js` | Değişti | Cookie auth'a geçiş |
| `app/api/blog/route.js` | Değişti | Cookie auth + input validation |
| `app/api/blog/[id]/route.js` | Değişti | Cookie auth + input validation |
| `app/api/blog/upload/route.js` | Değişti | Cookie auth + 8 MB limit |
| `app/api/consultation/route.js` | Değişti | Cookie auth + validation + RL + attachment policy |
| `app/api/feedback/route.js` | Değişti | Cookie auth + validation + RL |
| `app/admin/layout.js` | Değişti | Sunucu tarafı session check (UI aynı) |
| `app/admin/page.js` | Değişti | Query key parametresi kaldırıldı |
| `app/admin/blog/page.js` | Değişti | Query key parametresi kaldırıldı |
| `app/admin/feedback/page.js` | Değişti | Query key parametresi kaldırıldı |
| `app/admin/consultations/page.js` | Değişti | Query key parametresi kaldırıldı |
| `app/admin/users/page.js` | Değişti | Query key + import kaldırıldı |
| `app/dashboard/feedback/page.js` | Değişti | Hardcoded key kaldırıldı |
| `lib/planUtils.js` | Değişti | `ADMIN_KEY` export kaldırıldı |
| `app/layout.js` | Değişti | Verification meta + JSON-LD + GoogleBot direktifleri |
| `.env.example` | Değişti | Yeni env değişkenleri dokümante |

---

## [Unverified] Uyarılar

- Bu düzeltmeler **statik kod incelemesi** sonucudur; canlı ortamda
  DAST (dinamik test) yapılmamıştır. Üretime deploy sonrası `securityheaders.com`
  ve `mozilla/observatory` ile puanlama doğrulanmalıdır.
- CSP whitelist'i kullanımda olan üçüncü parti host'lara göre hazırlandı.
  Yeni bir entegrasyon eklenirse CSP güncellenmelidir.
- Clerk, Stripe, Vercel KV ve iyzico/Shopier endpoint'lerinin mevcut
  çalışır durumda olduğu varsayılmıştır; bunların kendi güvenlik
  yapılandırmaları bu raporun kapsamı dışındadır.
- `global.*` store'ların serverless kalıcılığı ile ilgili bulgu [Inference]
  Next.js/Vercel davranışına dayanır; ölçümlenerek doğrulanmalıdır.
