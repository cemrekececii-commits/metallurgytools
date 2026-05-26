# Tedarikçi Kalite Due Diligence Sistemi — Proje Planı

**Hizmet:** İhracatçı OEM ve yan sanayi için heat bazında sertifika (EN 10204 3.1/3.2) analizi, mikroyapı risk öngörüsü, tedarikçi kırmızı bayrak skorkartı ve CBAM ek modülü.

**Hedef kullanıcı:** Sitede **Shopier aylık profesyonel üyelik** planına sahip olan çelik üretici/satıcı/alıcı firmalar.

---

## 1) Konumlandırma ve değer önermesi

Bağımsız danışmanlar ya laboratuvar odaklı (test üretir, yorum üretmez) ya genel kalite odaklı (ISO denetçisi, metalürjik derinlik yok). Boş pazar: **sertifika + mikroyapı + süreç bilgisini birleştiren metalürjik yorum**. Farklılaşma iki cümlede:

- *"Mill sertifikası EN 10204 3.1 uyumlu görünüyor olabilir, ama biz kimyasal kompozisyondan CCT/TTT davranışına, inklüzyon morfolojisi riskine ve rulo pozisyonu bazlı segregasyon olasılığına kadar bakarız."*
- *"3 ay boyunca aynı tedarikçiden 12 heat aldığınızda — kaç tanesinin Mn, S, Ti, Nb üst/alt sınıra sürüklendiğini grafik üstünden görürsünüz."*

Bu, statik bir rapor değil; **üye panelinde biriken veriyle tedarikçi güvenilirliğinin trend analizi** yapan bir servis.

---

## 2) Ürün paketleri ve fiyatlandırma mantığı

Shopier profesyonel üyelik hizmete **erişim hakkı** verir (panele giriş + temel modüller). Raporlar üyelik dahilinde kontör bazlı (örn. ayda 2 rapor dahil, ek rapor X TL) veya retainer modeliyle çalışır.

| Paket | İçerik | Fiyat mantığı |
|---|---|---|
| Basic (üyelik dahili) | Heat analizi, 2 rapor/ay, standart risk yorumu | Shopier üyelik bedeli |
| Pro rapor (ek) | Mikroyapı risk + tedarikçi skorkart | 15-40k TL / rapor |
| CBAM modülü | Scope 1-2 tahmini + CBAM raporlama deste | 10-25k TL / parti |
| Retainer | Aylık tedarikçi izleme + aylık consolidated rapor | 25-75k TL / ay |

> **Not [Inference]:** Fiyat aralıkları mevcut pazar konuşma notlarınızdan geldi; son fiyatlama rekabet analizi sonrası güncellenmelidir.

---

## 3) MVP kapsamı (ilk 3-4 hafta)

**Hafta 1-2:** Alt yapı
- Veritabanı şeması (request, certificate, report, supplier tabloları)
- Shopier üyelik doğrulama entegrasyonu (webhook veya session bazlı)
- Üye paneli iskeleti (Next.js App Router, protected routes)

**Hafta 2-3:** Fonksiyonel akış
- Sertifika yükleme formu (şifreli upload, PDF/JPG/Excel)
- İntake formu (heat numarası, standart, uygulama, kritiklik seviyesi)
- Admin panelinde rapor oluşturma/yükleme arayüzü
- KVKK onay akışı + dosya saklama/silme politikası

**Hafta 3-4:** Kullanıma hazır
- TR + EN landing sayfaları
- Rapor indirme + geçmiş raporlar görünümü
- E-posta bildirimleri (rapor hazır, rapor ekleme vb.)
- Analitik kaydı (hangi tedarikçi, hangi grade, hangi risk flag'i)

**Sonraki fazlar (MVP sonrası):**
- Otomatik ön-analiz motoru (kimyasal limit kontrol, CE, Pcm hesabı, CCT çıkarımı)
- Tedarikçi skorkart trend grafiği
- CBAM Scope 1-2 tahmin modülü
- Çoklu heat toplu yükleme (Excel import)

---

## 4) Teknik mimari

```
Next.js (App Router)
├── (public)          → landing + SEO içerik (TR/EN)
├── panel/            → Shopier üyesine özel dashboard
├── api/
│   ├── due-diligence/requests    → CRUD talepler
│   ├── due-diligence/upload      → şifreli dosya yükleme
│   └── webhooks/shopier          → üyelik event'leri
│
Prisma + PostgreSQL (request, certificate, report, supplier)
S3/R2 uyumlu object storage (şifreli blob)
Resend/Postmark (transactional e-posta)
```

**Güvenlik katmanı:**
- Dosyalar sunucuda değil, object storage'da şifreli saklanır (AES-256)
- 90 gün sonra otomatik silme (KVKK uyum)
- Rapor PDF'i indirme linki imzalı ve süreli (signed URL, 48h)
- Oturum: httpOnly cookie + CSRF token

---

## 5) İçerik stratejisi (site üstü)

Landing sayfası üç bölümden oluşur:
1. **Problem anlatımı:** "Sertifika eline geçti, tamam mı?" — kısa vaka anekdotu.
2. **Metodoloji kutuları:** nasıl okunduğu, neye bakıldığı (sertifika → CCT çıkarımı → risk flag → rapor).
3. **Paket + CTA:** Shopier üyelik linki + "vaka örneği indir" lead magneti.

**LinkedIn stratejisi (pazarlama):** "Bu sertifikada ne görüyorum?" formatında anonimleştirilmiş (heat numarası/firma silinmiş) vakalar. Örneğin:
- *"S700MC tedarikçisi Nb'yi üst sınıra dayamış. Peki tane boyutu nasıl? Bu heat'i rolling'e verseniz..."* 
- *"DP600'de Mn+Si yüksek — C40 bandına düşmüş. CCT kaydırıldı, martensit fraksiyonu kritikleşiyor."*

Her gönderinin altında: "Sertifikanızı değerlendirelim → [site linki]" CTA.

---

## 6) Intake form şeması (müşteri ne yüklesin?)

MVP'de minimum veri seti:

| Alan | Tip | Zorunlu | Not |
|---|---|---|---|
| Heat numarası | string | ✓ | |
| Standart | enum | ✓ | EN 10025, API 5L, EN 10149, ASTM A36 vb. |
| Grade | string | ✓ | S355MC, X65M, DP600 vb. |
| Ürün formu | enum | ✓ | Sıcak haddelenmiş levha / soğuk haddelenmiş sac / galvanizli / tel filmaşin / boru |
| Kalınlık, genişlik | number | ✓ | mm |
| Uygulama | string | ✓ | otomotiv B-sütun / basınçlı kap / kaynaklı yapı... |
| Kritiklik seviyesi | enum | ✓ | Yüksek / Orta / Düşük (tabakalama için) |
| Tedarikçi adı | string | ✓ | |
| Sertifika dosyası | file | ✓ | PDF/JPG/PNG, max 10 MB, şifreli upload |
| Spesifikasyon/şartname | file | opsiyonel | Müşteri şartnamesi varsa |
| Ek notlar | text | opsiyonel | |

Detaylı şema `02_intake_ve_sablon/certificate_intake_schema.json` dosyasında.

---

## 7) Rapor çıktıları (teslim edilen artifact)

Her rapor PDF formatında, standart başlık + metalürjik yorum bloğu içerir:

1. **Yönetici özeti:** 3-5 cümle, kritik flag'ler kırmızı-sarı-yeşil.
2. **Sertifika verisinin şartname karşılaştırması:** tablo, out-of-spec varsa vurgulu.
3. **Kimyasal kompozisyon değerlendirmesi:** CE, Pcm, Mn/S, Mn/Si, Ti/N, Nb+Ti+V toplamı, mikroalaşım etkinliği.
4. **Mekanik değerler yorumu:** Rp0.2/Rm oranı, elongation, Charpy (varsa), DWTT (varsa) davranışı.
5. **Mikroyapı risk öngörüsü:** kimyasaldan CCT çıkarımı, olası fazlar, inklüzyon tipi riski, segregasyon bandı beklentisi.
6. **Tedarikçi trend (eğer geçmiş veri varsa):** bu tedarikçinin son N heat'indeki sapma eğilimi.
7. **Red flag skorkartı:** 0-100 puan, her kriter için gerekçe.
8. **Tavsiyeler:** gelen çeliğin kabul/ret/şartlı kabul, ek test önerisi (SEM-EDS, fraktografi, DWTT).

Şablon → `02_intake_ve_sablon/rapor_sablonu_ornek.md`

---

## 8) Yasal çerçeve

- **KVKK Aydınlatma Metni:** sertifikalar ticari sır içerir; hangi veri, ne kadar, nerede saklanıyor net yazılmalı.
- **Gizlilik Sözleşmesi (standart NDA):** panele girişte elektronik onay.
- **Sorumluluk sınırlaması:** danışmanlık raporu, resmi test belgesi değildir; uygunluk kararı kullanıcıya aittir.

Şablonlar → `04_yasal/` klasöründe.

---

## 9) KPI'lar ve başarı ölçümleri

MVP sonrası 3 ay içinde:
- Panel kayıt → ilk rapor talebine dönüşüm oranı (%)
- Ortalama rapor teslim süresi (saat)
- Tekrar kullanım oranı (aynı müşteri >1 rapor)
- Retainer'a yükselme oranı
- LinkedIn gönderi → panel kaydı CTR

---

## 10) Bu paket içinde ne var?

```
TedarikciDueDiligence/
├── 00_PROJE_PLANI.md                    ← bu dosya
├── 01_kod/                              ← Next.js drop-in kod
│   ├── app/(public)/hizmetler/...       ← TR landing
│   ├── app/panel/due-diligence/...      ← üye paneli
│   ├── app/api/due-diligence/...        ← API routes
│   ├── components/                       ← React bileşenleri
│   ├── lib/                              ← yardımcı kütüphaneler
│   ├── prisma/schema.prisma              ← veritabanı modeli
│   └── README_KURULUM.md                 ← kurulum ve entegrasyon rehberi
├── 02_intake_ve_sablon/
│   ├── certificate_intake_schema.json
│   ├── rapor_sablonu_ornek.md
│   └── red_flag_skorkart_kriterleri.md
├── 03_icerik_ve_pazarlama/
│   ├── landing_tr.md
│   ├── landing_en.md
│   └── linkedin_vaka_formati.md
└── 04_yasal/
    ├── KVKK_aydinlatma_metni.md
    └── NDA_gizlilik_sozlesmesi.md
```

---

**[Unverified]** Bu plan; kullanıcının mevcut Shopier entegrasyonunun hangi API'lere veya webhook'lara sahip olduğunu, Next.js projesindeki auth/session mekanizmasını ve mevcut PostgreSQL/ORM kurulumunu bilmeden hazırlanmıştır. Kurulum sırasında ince ayar gerekecektir.
