# MetallurgyTools — Kurulum ve Deploy Rehberi

## Genel Bakış

Bu rehber seni sıfırdan canlı bir siteye götürecek. Tahmini süre: 2–4 saat.

**Sonuç:** metallurgytools.com adresinde çalışan, kullanıcı girişi + abonelik sistemi olan, 3 metalurji aracı barındıran profesyonel bir SaaS platformu.

---

## ADIM 1: Gerekli Hesaplar (15 dk)

### 1.1 — Clerk Hesabı (Authentication)
1. https://clerk.com adresine git → "Start Building" tıkla
2. Google hesabınla giriş yap
3. Yeni bir uygulama oluştur: **"MetallurgyTools"**
4. Sign-in seçenekleri: **Email + Google** seç
5. Dashboard'dan şu key'leri kopyala:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → pk_test_xxx...
   - `CLERK_SECRET_KEY` → sk_test_xxx...

### 1.2 — Google AI Studio API Key
1. https://aistudio.google.com/apikey adresine git
2. "Create API Key" tıkla
3. Key'i kopyala → `GOOGLE_AI_API_KEY`

### 1.3 — iyzico Merchant Hesabı (Ödeme)
1. https://www.iyzico.com/sana-ozel-teklif adresinden başvuru yap
2. **Sandbox** hesabı ile başla (test ortamı)
3. Merchant panelinden API key + Secret key al
4. **Not:** iyzico onay süreci birkaç gün sürebilir. Bu arada sandbox ile geliştirmeye devam edebilirsin.

---

## ADIM 2: Proje Kurulumu (20 dk)

### 2.1 — GitHub Repo Oluştur
```bash
# GitHub'da yeni bir repo oluştur: "metallurgytools"
# Sonra lokal makinende:
git clone https://github.com/SENIN_USERNAME/metallurgytools.git
cd metallurgytools
```

### 2.2 — Proje Dosyalarını Kopyala
Bu projede sana verilen tüm dosyaları repo klasörüne kopyala.
Dosya yapısı şu şekilde olmalı:

```
metallurgytools/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js                    ← Landing page
│   ├── dashboard/
│   │   └── page.js                ← Kullanıcı dashboard'u
│   ├── tools/
│   │   ├── grain-size/page.js     ← Tane boyutu aracı
│   │   ├── corrosion/page.js      ← Korozyon hesap aracı
│   │   └── phase-diagram/page.js  ← Fe-C faz diyagramı
│   ├── api/tools/
│   │   ├── grain-size/route.js    ← Grain size API
│   │   ├── corrosion/route.js     ← Corrosion API
│   │   └── phase-diagram/route.js ← Phase diagram API
│   ├── login/[[...login]]/page.js
│   └── signup/[[...signup]]/page.js
├── components/
│   └── Navbar.js
├── lib/
│   ├── plans.js                   ← Abonelik planları + erişim kontrolü
│   └── ai-studio.js               ← Google AI Studio API wrapper
├── middleware.js                   ← Route koruması
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### 2.3 — Bağımlılıkları Yükle
```bash
npm install
```

### 2.4 — Environment Variables
```bash
# .env.example dosyasını kopyala
cp .env.example .env.local

# .env.local dosyasını aç ve key'leri doldur:
# - Clerk key'leri (Adım 1.1'den)
# - Google AI key (Adım 1.2'den)
# - iyzico key'leri (Adım 1.3'den veya sandbox)
```

### 2.5 — Lokalde Test Et
```bash
npm run dev
# Tarayıcıda: http://localhost:3000
```

Kontrol listesi:
- [ ] Landing page açılıyor mu?
- [ ] "Get Started" tıklayınca Clerk login modal'ı geliyor mu?
- [ ] Giriş yaptıktan sonra /dashboard'a yönleniyor mu?
- [ ] Dashboard'da tool kartları görünüyor mu?
- [ ] Bir tool'a tıklayınca açılıyor mu?

---

## ADIM 3: Vercel'e Deploy (10 dk)

### 3.1 — GitHub'a Push Et
```bash
git add .
git commit -m "Initial MetallurgyTools setup"
git push origin main
```

### 3.2 — Vercel'e Bağla
1. https://vercel.com/dashboard adresine git
2. "Add New Project" tıkla
3. GitHub repo'nu seç: **metallurgytools**
4. Framework: **Next.js** (otomatik algılanacak)
5. Environment Variables bölümüne .env.local'deki tüm key'leri ekle
6. "Deploy" tıkla

### 3.3 — Domain Bağla
1. Vercel dashboard → Project Settings → Domains
2. **metallurgytools.com** ekle
3. Vercel sana DNS kayıtlarını gösterecek:
   - **A Record:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`
4. Domain sağlayıcında (aldığın yerden) bu DNS kayıtlarını ekle
5. SSL sertifikası otomatik oluşturulacak (5-10 dk)

### 3.4 — Clerk Domain Güncelle
1. Clerk Dashboard → Settings
2. Production domain'i güncelle: `metallurgytools.com`
3. **Production key'leri** al ve Vercel environment variables'a ekle
   (test key'lerini production key'leriyle değiştir)

---

## ADIM 4: iyzico Abonelik Entegrasyonu (İleri Aşama)

iyzico recurring billing entegrasyonu ek kod gerektirir.
Temel akış:

```
Kullanıcı Plan Seçer
    → iyzico Checkout Form açılır
    → Ödeme başarılı
    → iyzico Webhook → /api/subscription/webhook
    → Clerk user metadata güncellenir (plan: "professional")
    → Kullanıcı tool'lara erişir
```

Bu entegrasyonu bir sonraki adımda birlikte detaylandırabiliriz.
Şimdilik free_trial planı ile tüm araçlar erişilebilir durumda.

---

## ADIM 5: Kontrol Listesi

### Deploy Öncesi
- [ ] Tüm environment variables Vercel'e eklendi
- [ ] .env.local git'e PUSH EDİLMEDİ (.gitignore'da)
- [ ] Clerk production key'leri aktif
- [ ] Google AI API key çalışıyor

### Deploy Sonrası
- [ ] metallurgytools.com açılıyor
- [ ] SSL (https) aktif
- [ ] Login/signup çalışıyor
- [ ] Dashboard erişilebilir
- [ ] En az 1 tool çalışıyor (test et)

### İlk Hafta
- [ ] LinkedIn teaser post paylaş
- [ ] 3 tool'u tam test et (edge case'ler)
- [ ] Google Analytics ekle (Vercel Analytics veya GA4)
- [ ] iyzico entegrasyonunu tamamla

---

## Maliyet Özeti (İlk Ay)

| Kalem | Maliyet |
|-------|---------|
| Domain (metallurgytools.com) | ~$12/yıl → $1/ay |
| Vercel (free tier) | $0 |
| Clerk (free tier, 10K MAU) | $0 |
| Google AI Studio (free tier) | $0 |
| Supabase (henüz gerekmiyor) | $0 |
| **TOPLAM** | **~$1/ay** |

---

## Sık Sorulan Sorular

**S: Google AI Studio free tier yeterli mi?**
Gemini 2.0 Flash modeli günlük 1500 istek veriyor. İlk aylar için fazlasıyla yeterli.
Büyüdüğünde pay-as-you-go modeline geçersin.

**S: iyzico olmadan başlayabilir miyim?**
Evet. Şu an tüm kullanıcılar free_trial planıyla giriyor. iyzico entegrasyonunu
site çalışırken arka planda geliştirebilirsin.

**S: Yeni tool nasıl eklenir?**
1. `lib/plans.js` → TOOLS dizisine yeni tool ekle
2. `app/tools/yeni-tool/page.js` → Tool UI oluştur
3. `app/api/tools/yeni-tool/route.js` → API endpoint oluştur
4. Deploy et — hepsi bu.

**S: İngilizce dışında dil desteği?**
Clerk çoklu dil destekler. Landing page'de next-intl kullanarak
Türkçe/İngilizce toggle ekleyebilirsin.
