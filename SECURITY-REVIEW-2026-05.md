# MetallurgyTools — Güvenlik & SEO Denetim Raporu
**Tarih:** 2026-05-26
**Denetçi:** Cowork mode (Claude Opus 4.7) — kod tabanı statik incelemesi
**Kapsam:** SAST + bağımlılık + robots/sitemap + JSON-LD + kurumsal sayfa eksikliği
**Önceki rapor:** `SECURITY-AUDIT.md` (2026-04-15) — büyük kısmı kapatılmış

> **Uyarı:** Production canlı header taraması yapılamadı; sandbox network
> allowlist'i `www.metallurgytools.com` domain'ini içermiyor. Aşağıdaki
> "production" notları [Unverified] olarak işaretlendi; deploy sonrası
> `securityheaders.com` ve `https://www.ssllabs.com/ssltest/` ile doğrulanmalı.

---

## 0) Genel Değerlendirme

Site **teknik olarak iyi konumlanmış** — Nisan denetiminden bu yana eklenen
CSP/HSTS/Permissions-Policy/COOP/CORP başlıkları, HMAC imzalı HttpOnly cookie
tabanlı admin auth, KV tabanlı rate-limit, input validation, JSON-LD ve
www-kanonik sitemap kurumsal sınıf bir altyapıyı yansıtıyor. Mevcut kalan
gerçek riskler iki noktada yoğunlaşıyor:

1. **Shopier webhook'unda fail-open authenticity verification** (HIGH)
2. **KVKK/GDPR/ePrivacy uyum eksikliği** (HIGH — legal/compliance)

Bunun dışındaki bulgular ya MEDIUM/LOW seviyede ya da SEO/kurumsallaşma
iyileştirmeleridir.

---

## 1) Bulgular

### [HIGH-A] Shopier IPN authenticity verification fail-open
**Dosya:** `app/api/shopier/webhook/route.js:21–37`
**OWASP:** A07 — Identification and Authentication Failures
**Açıklama:**
```js
async function verifyOrderWithShopier(orderId) {
  if (!SHOPIER_PAT) return true;       // env yoksa doğrulama atlanır
  // ...
  } catch (err) {
    return true;                       // API hatasında da true döner
  }
}
```
Saldırgan, Shopier IPN endpoint'inizi (public URL) tahmin edip kendi
e-posta adresi ile bir POST atarsa, `status=1` + `buyer_email=mine@x.com`
ile **30 günlük Professional plan** aktifleştirebilir. `SHOPIER_PAT` env'i
production'da set değilse veya Shopier API'si herhangi bir HTTP hatası
döndürüyorsa kontrol tamamen bypass'lanır.

**Etki:** Plan aktivasyonu üzerinden gelir kaybı + potansiyel premium içerik
erişimi. Stripe webhook'unda `stripe.webhooks.constructEvent` ile imza
doğrulanırken Shopier tarafında eşdeğer kriptografik kontrol yok.

**Önerilen düzeltme (ONAYINIZA SUNULUYOR):**
- `SHOPIER_SIGNATURE_KEY` env'i ekle; Shopier IPN'de gelen `signature`
  alanını HMAC-SHA256(`{platform_order_id}{status}{installment}{payment_id}{random_nr}{currency}`, key)
  ile karşılaştır. (Shopier resmi IPN dokümantasyonu bu formatı kullanır —
  [Unverified, doğrulanmalı: Shopier merchant docs])
- `SHOPIER_PAT` yoksa fail-**closed** ol → `return false` ve 503 dön.
- Idempotency: `kv.setnx("shopier:order:" + order_id, "processed", EX 86400*30)`
  ile aynı sipariş tekrar işlenmemeli.
- Buyer email yerine `order_id`'yi anahtar al; email enjekte edilemez.

### [HIGH-B] KVKK / GDPR / ePrivacy uyum eksikliği
**Kapsam:** Tüm site
**Bulgu:**
- `app/` altında `privacy/`, `kvkk/`, `cerez-politikasi/`, `kullanim-kosullari/`,
  `gizlilik-politikasi/`, `terms/` klasörleri **yok**.
- `app/layout.js`'de Google Analytics 4 (G-P1R7MB65WK) ve Microsoft Clarity
  (w8jv2xdiqq) **koşulsuz** yükleniyor — kullanıcı consent vermeden tracking
  başlıyor.
- `app/api/consultation/route.js` PII (ad, e-posta, şirket, durum, dosya)
  topluyor; aydınlatma metni / explicit consent kutucuğu görünmüyor.
- Footer'da yasal sayfalara link yok.

**Yasal etki:**
- **KVKK Madde 5 & 10:** Açık rıza alınmadan kişisel veri işleme + aydınlatma
  yükümlülüğü ihlali. Veri Sorumluları Sicili (VERBİS) kaydı + Veri Sorumlusu
  irtibat kişisi atama gerekebilir (yıllık ciro ve çalışan sayısına bağlı).
- **GDPR Article 6 & 7:** AB kullanıcısı varsa lawful basis belirleme + consent
  banner zorunlu.
- **ePrivacy 2002/58/EC (cookie law):** Non-essential cookie'ler (GA, Clarity)
  öncesinde explicit consent.
- **Türk Tüketici Kanunu / Mesafeli Sözleşmeler Yönetmeliği:** Ücretli abonelik
  satıldığı için "Mesafeli Hizmet Sözleşmesi", "Ön Bilgilendirme Formu",
  cayma hakkı, iletişim adresi (MERSİS dahil) zorunlu.

**Önerilen düzeltme (ONAYINIZA SUNULUYOR):**
Aşağıdaki sayfaları oluşturmamı isterseniz şablon (boş yer doldurulacak)
üretebilirim:
1. `/gizlilik-politikasi` (KVKK Madde 10 aydınlatma metni dahil)
2. `/kvkk-basvuru` — veri sahibi başvuru formu
3. `/cerez-politikasi` + Cookie consent banner (Google Consent Mode v2 uyumlu)
4. `/kullanim-kosullari`
5. `/mesafeli-hizmet-sozlesmesi` (Shopier/Stripe abonelik için)
6. `/iletisim` — MERSİS no, ticari adres, telefon
7. Consultation form'una "Aydınlatma metnini okudum" zorunlu checkbox
8. Footer'a tüm yasal sayfa linkleri

### [MEDIUM-A] Shopier IPN'de PII loglama
**Dosya:** `app/api/shopier/webhook/route.js:50–55`
`buyer_email` plaintext olarak `console.log` ile Vercel log drain'ine
yazılıyor. KVKK Madde 12 (veri güvenliği) ve veri minimizasyonu açısından
sorunlu. **Düzeltme:** `redactEmail(email)` ile `c***@d***.com` formatına çevir;
audit trail gerekiyorsa `crypto.createHash('sha256').update(email).digest('hex').slice(0,12)`.

### [MEDIUM-B] `global.consultationStore` ve `global.feedbackStore`
**Dosyalar:** `app/api/consultation/route.js`, `app/api/feedback/route.js`
Serverless'ta `global` persist etmez — farklı lambda instance'ları arasında
veri kaybı / tutarsızlık. Müşteri consultation gönderiyor, admin panelden
göremiyor olabilir. Vercel KV'ye migrate edilmeli. (Önceki audit'te de
not edilmiş; henüz yapılmamış.)

### [MEDIUM-C] `@types/react@19` vs `react@18.3.1` — version mismatch
**Dosya:** `package.json`
Runtime'ı etkilemiyor ama TS type-check'te yanlış pozitif/negatif
verebilir; `useFormStatus`/`useActionState` gibi React 19 API tipleri
mevcutmuş gibi görünebilir. `@types/react@^18.3` ve `@types/react-dom@^18.3`
ile uyumlandırılmalı.

### [MEDIUM-D] `typescript@6.0.2` — şüpheli versiyon
**Dosya:** `package.json`
[Unverified] TypeScript stabil sürümü Mayıs 2026 itibariyle henüz 6.x'e
geçmemiş olabilir. devDep olarak kabul edilebilir ama supply-chain tipo-squatting
riski açısından doğrulanmalı; `npm view typescript versions --json` ile resmi
sürümler kontrol edilmeli.

### [MEDIUM-E] `next@14.2.35` patch level
**Dosya:** `package.json`
Next.js 14.2.x serisi şu CVE'lerden etkilendi:
- CVE-2025-29927 (middleware auth bypass) → 14.2.25'te kapatıldı
- CVE-2024-46982 (cache poisoning) → 14.2.10'da kapatıldı
- CVE-2024-47831 (image opt DoS) → 14.2.7'de kapatıldı
14.2.35 bu CVE'ler için patched görünüyor [Inference — npm advisory'ye göre],
ancak Mayıs 2026'da daha yeni 14.2.x veya 15.x sürümü olabilir. Düzenli
`npm audit` ve `npm outdated next` çalıştırılmalı.

### [MEDIUM-F] `x-forwarded-for` spoofing
**Dosyalar:** `app/api/sem-eds/route.js:27`, `app/api/admin/verify/route.js:21`,
`app/api/consultation/route.js:17`, `app/api/feedback/route.js`
İlk XFF değerini alıyoruz — Vercel edge bunu güvenilir olarak set eder
ancak self-hosted veya Cloudflare-front durumunda spoofed header rate-limit'i
bypass edebilir. Vercel'de OK [Unverified — Vercel docs: "x-forwarded-for is set by Vercel edge, not client-controllable" doğrulanmalı]. Cloudflare ekleniyorsa
`cf-connecting-ip` öncelikli olmalı.

### [LOW-A] CSP `'unsafe-inline'` ve `'unsafe-eval'`
**Dosya:** `next.config.js:7`
Clerk + GA + Clarity nedeniyle gerekli. **Nonce-based CSP**'ye geçiş daha
sıkı XSS koruması verir ama Clerk script entegrasyonunu refactor gerektirir
— yüksek efor/düşük marjinal kazanç.

### [LOW-B] Consultation form CSRF
**Dosya:** `app/api/consultation/route.js`
Public POST endpoint, CSRF token yok. SameSite=Lax + JSON content-type
zorunluluğu kısmen koruyor. Spam riski rate-limit ile sınırlanmış (3/5dk).
Form için reCAPTCHA v3 veya hCaptcha eklenebilir.

### [LOW-C] `consultation/`, `dashboard/` robots.txt'de var ama disallow
**Dosya:** `app/robots.js`
Yeni allowlist'te `/consultation` disallow listede; ancak `/consultation/yeni`
gibi public form URL'i olabilir mi kontrol edilmeli. Mevcut hali ile form
genel arama motoru tarafından bulunmuyor — istenen bu mu doğrulanmalı.

---

## 2) Bu Oturumda Uygulanan Değişiklikler (Düşük Riskli)

| Dosya | Durum | Açıklama |
|---|---|---|
| `app/robots.js` | **Güncellendi** | AI tarayıcıları (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot + 15 bot daha) explicit allow listesine eklendi; admin/api yolları her UA için disallow kaldı. |
| `public/llms.txt` | **Yeni** | llmstxt.org standardına uygun, LLM tarayıcıları için site özeti + 16 tool + 4 mechanical test + knowledge/blog linkleri. ChatGPT/Claude/Perplexity için site navigasyonu hızlanır. |
| `public/.well-known/security.txt` | **Yeni** | RFC 9116 — güvenlik araştırmacısı bildirim kanalı. `security@metallurgytools.com` adresi yoksa kurulmalı (alias yeterli). |

**Uygulanmadı (kritik — onayınızı bekliyor):**
- Shopier webhook signature verification
- KVKK/GDPR/Terms/Cookie sayfaları
- Cookie consent banner + GA/Clarity'yi consent'e koşullama
- `global.*` store → KV migrasyonu
- `@types/react`, `typescript`, `next` patch bump

---

## 3) Önerilen Eylem Sırası

### Hemen (1–2 gün içinde)
1. **Shopier signature verification ekle** — gelir kaybı riski
2. **Privacy policy + cookie consent banner** — KVKK/ePrivacy uyumu
3. `npm audit` + `npm outdated` çalıştır, kritik patch'leri uygula

### Kısa vadeli (1 hafta)
4. KVKK aydınlatma metni + VERBİS kaydı (gerekiyorsa)
5. Mesafeli hizmet sözleşmesi + iletişim sayfası
6. `global.*` store'ları KV'ye migrate et
7. Consultation form'una reCAPTCHA v3

### Orta vadeli (1 ay)
8. WAF (Vercel Firewall Attack Challenge Mode veya Cloudflare ön-proxy)
9. Nonce-based CSP'ye geçiş
10. Vercel Log Drain → Datadog → 401/429 alert
11. OWASP ZAP / Burp ile DAST

---

## 4) [Unverified] / Kontrol Edilmesi Gereken

- Production'da `ADMIN_KEY`, `ADMIN_SESSION_SECRET`, `SHOPIER_API_KEY`,
  `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  env'leri set mi? — Vercel dashboard'dan kontrol edin.
- 308 redirect (apex → www) aktif mi? — `curl -I https://metallurgytools.com`
  yerel terminalden test edilmeli.
- Google Search Console mülk doğrulaması tamamlandı mı? Sitemap submit edildi mi?
- `securityheaders.com` skoru? Mozilla Observatory skoru?
- 14.2.35 → 14.2.x latest veya 15.x stable bump için breaking change var mı?

---

## 5) Önemli Not

Bu rapor **statik kod incelemesi**ne dayanır. Dinamik test (DAST), gerçek
kullanıcı oturumu testi ve production penetrasyon testi yapılmamıştır.
Yasal sayfa şablonları üretilirse **mutlaka bir avukat tarafından gözden
geçirilmelidir** — özellikle KVKK aydınlatma metni şirket bilgilerinize,
veri işleme amacınıza ve VERBİS kaydınıza özgü yazılmalı.
