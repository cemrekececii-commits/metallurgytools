# Tedarikçi Kalite Due Diligence — Landing Metni (TR)

> Bu, `/hizmetler/tedarikci-due-diligence` route'undaki Next.js sayfasının metin kaynağıdır. Sayfanın bileşen yapısı kod klasöründeki `page.tsx` dosyasında; metin düzenlemek isterseniz bu dosyadaki versiyonu referans alın.

---

## Hero

**Badge:** Metalürjik Danışmanlık · Kurumsal

**H1:** Tedarikçi Kalite **Due Diligence**

**Açılış:**
Mill sertifikası gelmiş — "EN 10204 3.1 uyumlu" yazıyor. Peki Mn/S oranı, Ti stokiyometrisi, CE değeri ne diyor? Heat bazında sertifika analizi, mikroyapı risk öngörüsü ve tedarikçi güvenilirlik skoru.

**CTA:** Sertifika analizine başla · Paketleri incele

---

## Tanıdık senaryo

Avrupa'ya ihracat yapan bir otomotiv yan sanayi. Tedarikçiden DP600 bobin geliyor, mill sertifikası ekinde. Giriş kalitesi "standartlara uygun" mührü basıp hattı açıyor. Üç ay sonra Almanya'dan iade: B-sütunu stamping sırasında çatlak başlangıcı, fraktografide martensit adacıkları arasında makaslama kırığı.

Sertifikaya geri dönüldüğünde görülen: Mn+Si toplamı üst sınırda, CE %0.05 yüksek, Ti/N oranı stokiyometrik değil — yani tane inceltme amacıyla eklenen Ti aslında TiN/TiC olarak klastır oluşturmuş. Bu sertifikada *sayı olarak* görünmüyor — sadece yorumla ortaya çıkıyor.

---

## Nasıl okunuyor

**1. Kimyasal kompozisyon → faz kestirimi**
C, Mn, Si, P, S, Nb, Ti, V, N, B, Al içerikleri; CE (IIW), Pcm, Ceq (AWS), Mn/S, Ti/N, Nb+Ti+V mikroalaşım toplamı hesaplanır. Kimyasaldan kabaca CCT kaydırma eğilimi çıkarılır — soğuma hızına göre olası faz spektrumu.

**2. Mekanik değerler → tutarlılık kontrolü**
Rp0.2 / Rm oranı, A% elongation, Charpy (T, enerji), DWTT %SA (ilgili gradeler için). Kimyasal-mekanik tutarsızlık flag'leri. Grade için beklenen bant dışında bir değer varsa gerekçe aranır.

**3. Mikroyapı risk öngörüsü**
İnklüzyon morfolojisi riski (Mn/S, Ca-treatment izi, Al-killed mı?), segregasyon bandı beklentisi (rolling pozisyonu), tane boyutu tahmini. SEM-EDS gerekliyse öneri.

**4. Tedarikçi kırmızı bayrak skoru**
Aynı tedarikçiden geçmiş heat'lerinizin sapma trendi — grafikle. 0-100 skor: kimyasal drift, mekanik varyasyon, out-of-spec sıklığı, ikincil metallurji izleri.

---

## Kimler için

- Avrupa'ya ihracat yapan **otomotiv yan sanayi** (stamping, welding, assembly)
- **Beyaz eşya** üreticileri (DP600, IF kalite sac alımı)
- **Makine ve basınçlı kap** imalatçıları (S355, S460, P355NL2, API 5L)
- Çelik **tüccarları** ve servis merkezleri (partinin yeniden satışı öncesi)
- **CBAM** raporlaması yapan ihracatçılar (Scope 1-2 tahmini ek modül)

---

## Paketler

**Basic** — Shopier üyelik dahili
- Ayda 2 heat analizi
- Standart risk yorumu
- PDF rapor teslim
- Üye panelinde geçmiş

**Pro Rapor** — ek rapor / heat başına
- Mikroyapı risk modülü
- Kırmızı bayrak skorkartı
- Tedarikçi trend grafiği
- SEM/EDS test önerileri

**Retainer** — aylık tedarikçi izleme
- Sınırsız heat analizi
- Aylık konsolide rapor
- CBAM Scope 1-2 modülü
- Tedarikçi red-flag dashboard

Fiyatlar grade, kritiklik ve heat sayısına göre değişir. Örnek aralıklar: Pro Rapor 15-40k TL / heat, Retainer 25-75k TL / ay.

---

## SSS

**Bu bir test laboratuvarı hizmeti mi?**
Hayır. Test yapılmaz — mevcut sertifikalar ve varsa müşteri test raporları metalürjik mühendislik yorumuyla değerlendirilir. Gerekli görüldüğünde akredite lab testleri önerilir (SEM-EDS, DWTT, metalografik kesit).

**Sertifikalarım güvende mi?**
Dosyalar şifreli object storage'da (AES-256) saklanır. 90 gün sonra otomatik silinir. KVKK aydınlatma metni ve NDA panel girişinde onaylanır.

**Rapor ne kadar sürede geliyor?**
Standart paket 5 iş günü, Expedited (premium) 24-48 saat. Eksik veri varsa süre işlemeye başlamaz.

**Danışmanlık raporu resmi test belgesi yerine geçer mi?**
Geçmez. Rapor metalürjik değerlendirme ve risk analizi niteliğindedir; kabul/ret kararı kullanıcıya aittir. Sorumluluk sınırlaması Hizmet Şartları belgesinde.

---

## CTA

**Bir heat ile başla.**
Profesyonel üyelik aktif olduğunda panelinizden sertifika yükleyebilir, metalürjik rapor talep edebilirsiniz.

Buton: Panele gir
