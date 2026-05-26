# Tedarikçi Kalite Due Diligence Raporu — Şablon

> Bu dosya, danışman (siz) için iç şablondur. Her rapor aynı yapıyı takip eder; JSON alanları panel veritabanına (`Report.chemicalAnalysis`, vb.) işlenir ve PDF'e dönüştürülür.

---

## 0) Rapor kimliği

| Alan | Değer |
|---|---|
| Rapor No | DD-2026-XXXX |
| Müşteri | {{company}} |
| Heat No | {{heatNumber}} |
| Tedarikçi | {{supplierName}} |
| Standart / Grade | {{standard}} / {{grade}} |
| Ürün formu | {{productForm}} — {{thicknessMm}} mm |
| Uygulama | {{application}} |
| Rapor tarihi | YYYY-MM-DD |

---

## 1) Yönetici özeti

3-5 cümle. Kritik flag varsa kırmızıyla. Örnek:

> Heat H264891 için sunulan EN 10204 3.1 sertifikası temel şartname karşılanır görünmektedir. Ancak **Mn+Si toplamı 2.08 wt% ile grade üst sınırında**, Ti/N stokiyometrik oranı 1.8 (hedef > 3.4), CE-IIW değeri 0.47. Bu kombinasyon, ince cidarlı stamping uygulamasında **sekonder faz kaynaklı geç çatlak başlangıç riski** taşımaktadır. Tedarikçinin son 6 heat'inde Mn'ın üst sınıra sürüklenme trendi var — tedarikçi süreç kontrolünde zayıflama olasılığı. **Şartlı kabul** önerilir; SEM-EDS ile inklüzyon morfolojisi doğrulama talebi edilmeli.

---

## 2) Sertifika verisi vs. şartname karşılaştırması

| Parametre | Ölçülen | Şartname | Durum |
|---|---|---|---|
| C wt% | 0.11 | ≤ 0.12 | ✓ |
| Mn wt% | 1.54 | ≤ 1.60 | ✓ (üst sınır) |
| Si wt% | 0.54 | ≤ 0.50 | ✗ **Out** |
| S wt% | 0.008 | ≤ 0.015 | ✓ |
| P wt% | 0.018 | ≤ 0.025 | ✓ |
| Ti wt% | 0.015 | 0.005–0.020 | ✓ |
| N ppm | 84 | ≤ 80 | ✗ **Out** |
| Nb wt% | 0.045 | ≤ 0.060 | ✓ |
| Rp0.2 MPa | 478 | ≥ 460 | ✓ |
| Rm MPa | 612 | 560–700 | ✓ |
| A% | 21 | ≥ 18 | ✓ |

**Out-of-spec flag'leri:** Si, N.

---

## 3) Kimyasal kompozisyon değerlendirmesi

- **Karbon eşdeğerlikleri:**
  - CE-IIW = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15 = **{{x.xx}}**
  - Pcm (Ito-Bessyo) = **{{x.xx}}** — kaynaklanabilirlik
  - Ceq-AWS = **{{x.xx}}**
- **Mn/S oranı:** {{val}} — MnS inklüzyonları için çökelme potansiyeli
- **Ti/N stokiyometrik oranı:** (Ti/47.87) / (N/14.01) — 3.42 teorik stokiyometri. Değer 3.4 altında ise **serbest N kalması**, HAZ embrittlement riski.
- **Nb+Ti+V (mikroalaşım toplamı):** {{val}} wt% — tane inceltme etkinliği yorumu
- **Al-killed durumu:** Altot, solAl, Alins değerleri (varsa)
- **Ca-treatment izi:** Ca/S, Ca/Al oranları — inklüzyon modifikasyonu etkinliği

**Metalurjik yorum:** {{2-3 paragraf — kimyasaldan kestirilen faz spektrumu, CCT davranışı, olası anomaliler}}

---

## 4) Mekanik özellikler değerlendirmesi

- Rp0.2 / Rm oranı: {{val}} — {{plastik instabilite yorumu}}
- Eşit uzama (A_gt, varsa): {{val}}% — {{HSLA grade için kritik}}
- Charpy: {{enerji @ sıcaklık}} — {{geçiş sıcaklığı tahmini}}
- DWTT (API/HSLA için): {{%SA değeri}} — {{pipe grade için kritik}}
- Sertlik (varsa): {{HV/HB}} — {{mikroyapı-sertlik uyumu}}

**Kimyasal–mekanik tutarlılık:** {{beklenen Rm bandı vs. ölçülen}}. Aykırılık varsa olası sebep ({{aşırı soğutma, kontrolsuz rekristalizasyon, vb.}}).

---

## 5) Mikroyapı risk öngörüsü

**Beklenen faz spektrumu (kimyasaldan CCT çıkarımı, [Inference]):**
- Ferrit-perlit bölgesi: {{tahmin}}%
- Bainit/acicular ferrit: {{tahmin}}%
- Martensit: {{tahmin}}% — {{DP grade için bant değerlendirmesi}}

**İnklüzyon tipi riski:**
- MnS (type II/III) olasılığı: {{düşük/orta/yüksek}} — Mn/S ve deoksidasyon rotasından
- Al2O3 klasterleri: {{durum}}
- CaS ve kompleks (Ca-Al-S) inklüzyonlar: {{durum}}
- TiN klasterleri: Ti/N oranı bazlı {{değerlendirme}}

**Segregasyon bandı beklentisi:** Mn-Si-P segregasyonu için Kurdjumov-Sachs bandı olasılığı {{yorum}}.

**Tane boyutu tahmini:** {{ASTM G no veya micrometre}} — mikroalaşım etkinliği + yeniden ısıtma rotasına bağlı.

**Önerilen doğrulama testleri:** SEM-EDS inklüzyon haritalama / nital dağlama metalografi / ASTM E112 tane boyutu / Charpy altı sıcaklık genişletme.

---

## 6) Tedarikçi trend analizi *(geçmiş veri varsa)*

- Aynı tedarikçiden son {{N}} heat — **grafik:** Mn, S, Ti zamana göre
- Sapma eğilimi: {{stabil / üst sınıra sürükleniyor / varyasyon artıyor}}
- Out-of-spec oran (son 12 ay): {{x}} / {{y}}
- İkincil metalurji izi değişikliği: {{varsa yorum}}

---

## 7) Red-flag skorkartı (0-100)

| Kriter | Puan | Maks | Not |
|---|---|---|---|
| Şartname uyumu (ölçülen değerler) | 20 | 25 | Si ve N out-of-spec |
| Kimyasal-mekanik tutarlılık | 22 | 25 | Tutarlı |
| Mikroyapı risk sinyali | 10 | 20 | Ti/N düşük |
| Tedarikçi geçmiş varyasyonu | 12 | 15 | Mn drift |
| Sertifika bütünlüğü (imza, izlenebilirlik) | 15 | 15 | 3.1 tam |
| **TOPLAM** | **79** | **100** | Yüksek risk bandı |

---

## 8) Tavsiye

**Karar:** ☐ Kabul  ☒ Şartlı kabul  ☐ Ret  ☐ Ek veri bekleniyor

**Gerekçe:** {{3-5 cümle}}

**Şartlı kabul koşulları:**
1. SEM-EDS ile inklüzyon haritalama (en az 20 FOV, 500x büyütme)
2. Kalınlık merkezinden metalografik kesit, nital dağlama, segregasyon bandı değerlendirmesi
3. Tedarikçiden Ca-treatment kayıtları ve LF-VD süreç izi talebi
4. Gelen partinin ilk 3 rulosunda 100% NDT (UT, EN 10160 eşdeğer)

---

## 9) CBAM ek modülü *(opsiyonel)*

- Birim ürün başına tahmini CO2e (Scope 1+2): {{value}} kg/t
- Üretim rotası varsayımı: EAF / BOF / BF-BOF
- CBAM raporlama alanı uyumluluğu: {{yorum}}

---

## 10) Yasal uyarılar

Bu rapor metalürjik mühendislik değerlendirmesi niteliğindedir; resmi test belgesi yerine geçmez. Kabul/ret kararı ve bunun sonuçları tamamen kullanıcıya aittir. Detaylı sorumluluk sınırlaması için Hizmet Şartları belgesine bakınız.

Rapor hazırlayan: {{consultant name}} · TMMOB Metalurji ve Malzeme Mühendisi · Tarih: YYYY-MM-DD
