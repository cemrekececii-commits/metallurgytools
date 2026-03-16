# Stripe Ödeme Entegrasyonu — Kurulum Rehberi

## Ne Yaptık

Sitenize Stripe ile aylık abonelik sistemi eklendi:
- Kullanıcı pricing sayfasında plan seçer
- Stripe'ın güvenli ödeme sayfasına yönlendirilir
- Ödeme sonrası otomatik olarak planı aktif olur
- 7 günlük ücretsiz deneme dahil
- İptal, plan değişikliği Stripe Customer Portal ile yapılır

## Dosya Listesi

Aşağıdaki dosyaları proje klasörüne kopyalaman gerekiyor:

```
lib/stripe-client.js          ← Stripe frontend kurulumu
lib/stripe-server.js          ← Stripe backend kurulumu
app/api/stripe/checkout/route.js  ← Ödeme oturumu oluşturma
app/api/stripe/webhook/route.js   ← Stripe bildirimleri (webhook)
app/api/stripe/portal/route.js    ← Abonelik yönetimi portalı
app/pricing/page.js               ← Fiyatlandırma sayfası
```

## Kurulum Adımları

### ADIM 1: Stripe Hesabı Oluştur
1. https://dashboard.stripe.com/register adresinden hesap aç
2. Test mode aktif olsun (sol üstte toggle)

### ADIM 2: API Key'leri Al
1. Stripe Dashboard → Developers → API keys
2. Publishable key (pk_test_xxx) ve Secret key (sk_test_xxx) kopyala

### ADIM 3: Ürünleri Oluştur
1. Stripe Dashboard → Product Catalog → Add Product
2. Starter Plan: $5/month (recurring) → Kaydet → Price ID kopyala
3. Professional Plan: $9/month (recurring) → Kaydet → Price ID kopyala

### ADIM 4: stripe Paketini Kur
PowerShell'de proje klasöründe:
```
npm install stripe @stripe/stripe-js
```

### ADIM 5: Dosyaları Kopyala
ZIP'teki dosyaları proje klasörüne kopyala (üzerine yaz).

### ADIM 6: .env.local'e Stripe Key'leri Ekle
Notepad ile .env.local dosyasını aç ve sonuna şu satırları EKLE:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SENIN_PUBLISHABLE_KEYIN
STRIPE_SECRET_KEY=sk_test_SENIN_SECRET_KEYIN
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_STARTER_PRICE_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_PROFESSIONAL_PRICE_ID
STRIPE_PRICE_PROFESSIONAL=price_PROFESSIONAL_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_BUNU_SONRA_ALACAGIZ
```

### ADIM 7: Lokalde Test Et
```
npm run dev
```
http://localhost:3000/pricing adresini aç.

### ADIM 8: GitHub'a Push + Vercel Deploy
```
git add .
git commit -m "stripe odeme entegrasyonu"
git push origin main
```
Vercel otomatik deploy edecek.

### ADIM 9: Vercel Environment Variables Güncelle
Vercel Dashboard → Project → Settings → Environment Variables
Yukarıdaki 6 Stripe key'ini ekle.
Redeploy yap: Deployments → en üstteki → Redeploy

### ADIM 10: Webhook Ayarla (Canlı Sonrası)
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint → URL: https://metallurgytools.com/api/stripe/webhook
3. Events: checkout.session.completed, invoice.payment_succeeded,
   invoice.payment_failed, customer.subscription.deleted,
   customer.subscription.updated
4. Webhook signing secret'ı kopyala → Vercel'de STRIPE_WEBHOOK_SECRET olarak ekle

## Test Kartları (Test Mode)
- Başarılı ödeme: 4242 4242 4242 4242
- Tarih: gelecek herhangi bir tarih
- CVC: herhangi 3 rakam
- Reddedilen kart: 4000 0000 0000 0002
