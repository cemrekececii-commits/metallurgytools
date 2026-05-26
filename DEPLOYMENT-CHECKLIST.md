# MetallurgyTools — Deployment & Indexleme Aksiyon Listesi

> Bu döküman, kod tarafındaki SEO + güvenlik düzeltmelerinden sonra **senin yapman gereken
> manuel adımları** sırasıyla içerir. Her adımın altında "neden gerekli" açıklaması ve
> doğrulama yöntemi var. Sıraya uy — özellikle 1 → 2 → 3 adımları zorunlu birbirine bağlı.

---

## ADIM 1 — Kod değişikliklerini git'e gönder ve Vercel deploy'u doğrula

### 1.1 Lokalde commit + push

```bash
cd C:\Users\nil\Desktop\metallurgytools

# Hangi dosyalar değişmiş, bir göz at:
git status

# Hepsini stage'le:
git add -A

# Anlamlı bir commit mesajı:
git commit -m "fix(seo+sec): unblock Googlebot, expand metadata/JSON-LD, harden /api/sem-eds

- middleware: removed /tools and /mechanical-tests from protected routes (Googlebot was being 302'd to /login)
- layout.js: metadataBase=www, expanded keywords (TR+EN), OG/Twitter image, favicons, JSON-LD Organization+WebSite+SoftwareApplication
- robots.js + sitemap.js: www canonical, 35 URLs (was 22), added blog/knowledge/mechanical-tests
- per-tool layouts: corrosion, dwtt, hardness, grain-size, phase-diagram, carbon-equivalent — TR titles, canonical, JSON-LD WebApplication+BreadcrumbList
- knowledge/* + blog/* layouts: per-page metadata, dynamic OG for posts
- api/sem-eds: Clerk auth + rate limit + image MIME/size validation
- assets: og-default.png, favicon.svg/ico, apple-touch-icon, site.webmanifest"

# Remote'a gönder (branch adın main veya master ise ona göre):
git push origin main
```

### 1.2 Vercel'in deploy'u tamamladığını doğrula

1. Vercel dashboard → `metallurgytools` projesi → **Deployments** sekmesi
2. En üstteki deployment **Ready** durumuna gelsin (genelde 60–120 sn)
3. Build log'unda **ERROR** veya **TypeError** geçmiyor olsun
4. Eğer build patlarsa, hatayı bana getir — büyük ihtimal eksik bir import veya
   `next/script` referansı olur.

### 1.3 Production tarafında smoke test

Tarayıcıdan aç:

- https://www.metallurgytools.com/tools/corrosion → Sayfa **giriş yapmadan** açılmalı (eskiden /login'e atıyordu, kritik fix bu)
- https://www.metallurgytools.com/tools/dwtt → Aynı şekilde public
- https://www.metallurgytools.com/mechanical-tests/cekme-testi → Public
- https://www.metallurgytools.com/sitemap.xml → 35 URL içermeli, hepsi `https://www.` ile başlamalı
- https://www.metallurgytools.com/robots.txt → `Sitemap: https://www.metallurgytools.com/sitemap.xml` satırı görünmeli

**Bir tanesi bile 302 ile /login'e atıyorsa Googlebot da indeksleyemez — bana haber ver.**

---

## ADIM 2 — Vercel: non-www → www 301 redirect (KRİTİK)

Şu anda `metadataBase` ve sitemap **www** subdomain'ini "resmi adres" olarak işaretliyor.
Ancak `metallurgytools.com` (www'suz) hâlâ açılıyor olabilir. Bu durumda Google **iki ayrı
site** olarak görür → duplicate content → sinyal dağılması → sıralama düşer.

### 2.1 Vercel Dashboard adımları

1. Vercel → `metallurgytools` projesi → **Settings** → **Domains**
2. İki domain görmen lazım:
   - `metallurgytools.com` (apex)
   - `www.metallurgytools.com`
3. `www.metallurgytools.com` üzerine tıkla → **"Set as Production Domain"** ise tamam.
   Değilse, ayarla.
4. `metallurgytools.com` (apex) için **"Redirect to www.metallurgytools.com"** seçeneğini
   aktif et — Vercel bunu **308 Permanent Redirect** olarak yapar (308 ≈ 301, Google için
   eşdeğer kabul edilir [Inference, doğrulanmış davranış: Google's redirect handling
   documentation 308'i 301 gibi işler]).

### 2.2 Redirect'i doğrula

Terminal'den:

```bash
curl -I https://metallurgytools.com
# Beklenen: HTTP/2 308   ve   location: https://www.metallurgytools.com/
```

Veya tarayıcıdan https://metallurgytools.com aç → adres çubuğunda otomatik
`https://www.metallurgytools.com/` olmalı.

---

## ADIM 3 — Vercel environment variables

`.env.example` dosyasında listelenen değişkenlerden bazıları **production'da set
değilse**, build sorunsuz geçer ama özellik çalışmaz. Aşağıdakileri kontrol et:

### 3.1 Mevcut olması gerekenler (Vercel → Settings → Environment Variables)

| Variable | Production değeri | Neden lazım |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://www.metallurgytools.com` | Canonical URL üretimi, ödeme callback'i |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk'ten al | Login/signup çalışması |
| `CLERK_SECRET_KEY` | Clerk'ten al | Sunucu tarafı auth |
| `GOOGLE_AI_API_KEY` | aistudio.google.com/apikey | AI tool'ları (SEM-EDS dahil) |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Vercel KV / Upstash | Rate limit, blog storage |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | Görsel yükleme |
| `ADMIN_KEY` | `openssl rand -base64 32` ile üret | Admin paneli |
| `ADMIN_SESSION_SECRET` | `openssl rand -base64 48` ile üret | Admin cookie imzası |

### 3.2 YENİ olarak eklenen verification değişkenleri (4. adımdan sonra dolduracaksın)

Bunları **şimdi boş ekle**, sonraki adımlarda Search Console / Bing verification kodlarıyla
dolduracaksın:

| Variable | Şu an | Sonra |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (boş) | Google Search Console'dan gelecek |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | (boş) | Bing Webmaster Tools'tan gelecek |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | (boş) | (opsiyonel) |

**Önemli:** Environment variable değiştirdikten sonra Vercel **yeni deploy başlatmalısın**
(otomatik tetiklenmez — Deployments → en son deployment'a tıkla → "Redeploy").

---

## ADIM 4 — Google Search Console (EN KRİTİK ADIM)

Şu an Google'da görünmemenizin **birincil sebebi** — Googlebot zaten siteyi tarayamıyor +
hangi sitenize bakacağını bilmiyor. Bunu çözmeden hiçbir SEO işlemi anlam taşımaz.

### 4.1 Property oluştur

1. https://search.google.com/search-console aç (Gmail ile gir: cemrekececii@gmail.com)
2. Sol üstte **"+ Property eklemek"** → **"Domain"** seçeneğini seç (URL prefix değil)
3. Domain alanına: `metallurgytools.com` yaz (www olmadan, çünkü Domain property hem
   www hem apex hem alt-protokol hepsini kapsar)
4. Google sana **DNS TXT kaydı** verecek, formatı:
   ```
   google-site-verification=AbCdEf1234567890...
   ```

### 4.2 DNS TXT kaydını ekle

Domain'i nereden aldıysan (Namecheap / GoDaddy / Cloudflare / Vercel Domains), oraya git:

- **Cloudflare** ise: DNS → Add Record → Type: TXT, Name: `@`, Content: yapıştır → Save
- **Vercel Domains** ise: Domains → metallurgytools.com → DNS Records → Add → TXT
- **Namecheap** ise: Advanced DNS → Add New Record → TXT Record → Host: `@`

DNS propagation 5 dk – 1 saat sürer. Bekle, sonra Search Console'da **"Verify"** bas.

### 4.3 Alternatif: HTML meta tag verification

Eğer DNS değiştiremiyorsan:
1. Search Console'da property oluştururken **"URL prefix"** seç → `https://www.metallurgytools.com`
2. **"HTML tag"** verification yöntemini seç
3. Sana verilen `<meta name="google-site-verification" content="XYZ...">` etiketindeki
   **sadece `XYZ` kısmını kopyala**
4. Vercel → Environment Variables → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` değerine yapıştır
5. Vercel'i redeploy et (otomatik tetiklenmez)
6. Search Console → Verify

Layout dosyasında bu zaten hazır:
```js
verification: {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  ...
}
```

### 4.4 Sitemap'i submit et

Verification başarılı olduktan sonra:

1. Search Console → sol menüden **Sitemaps**
2. "Yeni site haritası ekle" → `sitemap.xml` yaz → Submit
3. Status birkaç dakika içinde **"Başarılı"** olmalı, **35 URL keşfedildi** görünmeli

### 4.5 Öncelikli sayfalar için URL Inspection + "Request Indexing"

Search Console'un siteyi kendi başına taraması haftalar sürer. Manuel hızlandır:

1. Search Console → en üstteki URL arama kutusuna sırayla şunları yapıştır ve her biri
   için **"Dizine eklenmesini iste"** bas (günde ~10 talep limiti var):

```
https://www.metallurgytools.com/
https://www.metallurgytools.com/tools
https://www.metallurgytools.com/tools/corrosion
https://www.metallurgytools.com/tools/dwtt
https://www.metallurgytools.com/tools/hardness
https://www.metallurgytools.com/tools/grain-size
https://www.metallurgytools.com/tools/phase-diagram
https://www.metallurgytools.com/tools/carbon-equivalent
https://www.metallurgytools.com/mechanical-tests
https://www.metallurgytools.com/blog
```

[Inference] Her URL için Google 7–14 gün içinde ilk crawl'ı yapar, ilk indekslemeden
sıralamaya geçiş 4–12 haftadır. Bu tahmindir, garantisi yoktur.

---

## ADIM 5 — Bing Webmaster Tools

Bing trafiği Google'a göre küçük ama:
- ChatGPT/Copilot arama sonuçları Bing'i kullanıyor → AI search'te görünürlük için kritik
- Bing genellikle daha hızlı indeksler

### 5.1

1. https://www.bing.com/webmasters → Gmail ile giriş
2. **"Add a site"** → `https://www.metallurgytools.com`
3. **"Import from Google Search Console"** seçeneğini seç (en hızlısı) — Search Console
   verification'ını mirror'lar
4. Eğer import başarısız olursa: **Meta tag** yöntemi → değeri
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` env var'a yapıştır → redeploy
5. Verification sonrası **Sitemaps** → `https://www.metallurgytools.com/sitemap.xml` ekle

### 5.2 Bing'in IndexNow özelliğini aç (opsiyonel ama hızlandırıcı)

Webmaster Tools → **Settings** → **IndexNow** → "Enable" — bu Vercel ile entegre edilebilir
ama ileride. Şimdilik sitemap submit yeterli.

---

## ADIM 6 — Yandex Webmaster (opsiyonel)

Türkiye trafiği için **çoğunlukla gereksiz** — Google Türkiye'de %95+ pazar payına sahip
[Unverified, son yıl verisi]. Ancak akademik metalurji aramaları Rusya, Ukrayna, BDT
bölgesinde Yandex'te yapılıyor. Senin gibi bir teknik içerik üreten için fena değil.

1. https://webmaster.yandex.com → kayıt
2. Add site → `https://www.metallurgytools.com`
3. Verification meta tag → `NEXT_PUBLIC_YANDEX_VERIFICATION` env var'a yapıştır

---

## ADIM 7 — Deploy sonrası teknik validasyon

Aşağıdaki 4 testi mutlaka çalıştır. Birinde "hata" çıkarsa, screenshot'ı bana getir.

### 7.1 Schema.org / Rich Results

https://search.google.com/test/rich-results

URL: `https://www.metallurgytools.com`

**Beklenen sonuç:** "Organization", "WebSite", "SoftwareApplication" yapıları geçerli
olarak görünmeli. Sıfır hata.

Sonra: `https://www.metallurgytools.com/tools/corrosion`
**Beklenen:** "WebApplication" + "BreadcrumbList" geçerli olmalı.

### 7.2 Open Graph

https://www.opengraph.xyz

URL'i gir → sosyal medya kartı önizlemesi gelir. og-default.png görünmeli, title ve
description doğru olmalı.

### 7.3 Güvenlik header'ları

https://securityheaders.com/?q=www.metallurgytools.com

[Inference] Şu an muhtemelen **C–D** notu alıyorsun çünkü CSP, HSTS yok. Bu kritik değil
ama sonraki iterasyonda `next.config.js`'e header'lar eklenebilir. Şimdilik bu adım sadece
**baseline** ölçmek için — sayıyı not et.

### 7.4 PageSpeed / Core Web Vitals

https://pagespeed.web.dev → URL: `https://www.metallurgytools.com`

**Hedef:** Mobile + Desktop her ikisinde de "Good" Core Web Vitals (LCP < 2.5s, INP < 200ms,
CLS < 0.1). Bu doğrudan ranking faktörü.

Sorun varsa muhtemel sebepler:
- Görsel optimize değil → `next/image` kullanılmalı
- Üçüncü parti script (GA4, Clarity) blocking → zaten `strategy="afterInteractive"` kullandık, sorun olmamalı

---

## ADIM 8 — İçerik + backlink stratejisi (organik trafik için kritik)

Teknik SEO altyapı doğru kurulu — artık Google **görebiliyor**. Ama **rank etmek için
backlink ve içerik tazeleme gerekiyor**. Bu kısım kod düzeltmesiyle olmaz, senin
faaliyetinle olur.

### 8.1 İlk 4 hafta için içerik takvimi (önerilen)

Senin uzmanlık alanına özel, **uzun-kuyruk** anahtar kelime hedefli yazılar:

1. "DP600 mikroyapısı: ferrit-martenzit faz oranı ve haddeleme parametreleri"
2. "S700MC HSLA çelik üretiminde Ti(C,N) çökeltme kinetiği"
3. "IF çelik IF sürekli tavlama hattında tane büyümesi: ASTM E112 ölçümleri"
4. "API 5L X65 boru sünek-gevrek geçiş sıcaklığı: DWTT vs Charpy korelasyonu"
5. "Tel haddehanede merkez segregasyon: kütük çatlağı kök neden analizi"

Her yazı **1500–2500 kelime**, en az 3 mikroskop görseli, ASTM/EN standart referansları,
"İsdemir'de gözlemlenen pratik" formatında olsun. Bu tür içerik şu anda **Türkçe internette
neredeyse yok** — boşluğu doldurursun, organik trafik 3–6 ay içinde gelir [Inference,
content gap analysis based on Turkish search results in metallurgy].

### 8.2 Backlink — kalite > miktar

Aşağıdaki yerlere kendin git, yorum at, kaynak bırak:

- **LinkedIn:** Türkçe metalurji grupları (TMMOB Metalurji Mühendisleri Odası, Çelik
  Üreticileri Derneği). Tool linkini değil, **içerik linkini** paylaş. Direkt tool
  paylaşımı spam sayılır.
- **ResearchGate:** Profil oluştur (Cemre Keçeci olarak), kendi DWTT/SEM-EDS bilgini
  paylaş, MetallurgyTools'u "developed tools at" referans olarak ekle.
- **Üniversite metalurji bölümleri:** Karadeniz Teknik, İTÜ, Sakarya, Hacettepe, ODTÜ —
  öğrenci kulüplerine veya hocalara mail at, "öğrencilerin pratik için kullanabileceği
  ücretsiz araçlar" diye sun.
- **Reddit:** r/metallurgy (İngilizce). Spam yapma, gerçek soruya cevap verirken
  "burada kendi yaptığım tool var, şuna bak" diye organik bırak.
- **Stack Exchange — Engineering:** ASTM E112 hesaplama, hardness conversion gibi
  sorulara cevap verirken araca link.

[Unverified — Her backlink platformunun spam politikası farklı, her birinde tek tek
kuralları okumalısın. Aşırı promosyon hesap kapatılmasına yol açabilir.]

### 8.3 Internal linking

Blog yazıları arasında ve blog → tool arası **bağlam içi link** koy. Örneğin "DP600
mikroyapısı" yazısının içinde:
"Numunenin tane boyutunu ölçmek için [ASTM E112 grain size aracımızı](/tools/grain-size)
kullanabilirsiniz."

Google bu sinyalleri tool sayfalarının otorite skorunu artırmak için kullanır.

---

## ADIM 9 — Beklenen zaman çizelgesi [Inference]

| Süre | Beklenen olay |
|---|---|
| 0–24 saat | DNS verification tamam, Search Console property aktif |
| 1–3 gün | İlk URL inspection / request indexing'lerin Google'a iletildi |
| 7–14 gün | Ana sayfa + en güçlü 5 tool sayfası Google indeksinde görünür |
| 3–4 hafta | Sitemap'teki tüm 35 URL crawl edilmiş olur |
| 4–8 hafta | Düşük rekabetli uzun-kuyruk anahtar kelimelerde sayfa 3–5'te görünme |
| 3–6 ay | "DWTT hesaplama", "ASTM E112" gibi anahtar kelimelerde sayfa 1–2'ye giriş |
| 6–12 ay | Backlink + içerik güncel kalırsa organik 1000+ aylık kullanıcı |

[Inference: Bu zaman çizelgesi yeni, az otoriteli site için tipik senaryodur. Niş + teknik
içerik olduğu için aslında ortalama bir e-ticaret sitesinden daha hızlı ranking görebilir
çünkü rekabet düşük. Garanti veremem.]

---

## ADIM 10 — İzleme (kurmadan trafik kazanılmaz)

GA4 ve Clarity zaten kurulu. Haftada bir aşağıdakileri kontrol et:

### 10.1 Search Console — haftalık

- **Performance** sekmesi: hangi anahtar kelimelerle göründüğün (impressions), tıklanma
  oranı (CTR), ortalama sıralama
- **Coverage** sekmesi: indexlenmiş sayfa sayısı (hedef: 35'in 30+'sı)
- **Mobile Usability** + **Core Web Vitals**: hata varsa düzelt

### 10.2 GA4 — haftalık

- **Realtime**: o anki ziyaretçiler
- **Reports → Acquisition → Traffic acquisition**: Organic Search yüzdesi (hedef 3 ay
  içinde %30+, 6 ay içinde %60+)
- **Engagement → Pages and screens**: hangi tool sayfası daha çok kullanılıyor

### 10.3 Clarity — ayda bir

- **Recordings**: gerçek kullanıcı session'larını izle, kullanıcı tool'da nerede tıkanıyor
- **Heatmaps**: hangi tool'lar tıklanıyor, hangileri görmezden geliniyor

---

## ÖZET — Acil yapılacaklar listesi

```
[ ] 1. git add -A && git commit -m "..." && git push
[ ] 2. Vercel deployment Ready olduğunu doğrula
[ ] 3. /tools/corrosion, /tools/dwtt giriş yapmadan açıldığını test et
[ ] 4. Vercel → Settings → Domains → apex'i www'ya 308 redirect
[ ] 5. curl -I https://metallurgytools.com  →  308 ve Location: www
[ ] 6. Vercel → Environment Variables doğrula (özellikle NEXT_PUBLIC_APP_URL=www)
[ ] 7. Google Search Console → property oluştur → DNS TXT verification
[ ] 8. Search Console → Sitemaps → sitemap.xml submit
[ ] 9. Search Console → URL Inspection → 10 öncelikli URL için "Request Indexing"
[ ] 10. Bing Webmaster Tools → import from Search Console + sitemap submit
[ ] 11. Rich Results Test → sıfır hata
[ ] 12. opengraph.xyz → kart görünür
[ ] 13. pagespeed.web.dev → Core Web Vitals "Good"
[ ] 14. İlk blog yazısını hazırla (önerilen: DP600 mikroyapısı veya DWTT korelasyonu)
[ ] 15. LinkedIn metalurji gruplarında ilk paylaşım (içerik linki, tool değil)
```

---

## İzin verilmeyen kestirmeler

[Unverified]
- "Google'a para verirsen hızlı index olur" → **Yanlış**. Google Ads paid'tir, organik
  ranking'i etkilemez. Yalnız Search Console verification ücretsizdir.
- "Sitemap'i 100 yere submit edersen rank yükselir" → **Yanlış**, hatta zararlıdır.
  Sadece Google Search Console + Bing Webmaster yeterli.
- "Footer'a 50 anahtar kelime koy" → **Kara şapka SEO**, manuel penalty riski.
- "Reddit/forum'larda link spam at" → Hesap kapatma + Google manuel cezası riski.

---

## Bir şey takılırsa

Aşağıdaki bilgilerle gel:
- Hangi adımda takıldığın
- Ekran görüntüsü
- Vercel build log (varsa hata)
- `curl -I` çıktısı (redirect sorunu için)

İyi çalışmalar.
