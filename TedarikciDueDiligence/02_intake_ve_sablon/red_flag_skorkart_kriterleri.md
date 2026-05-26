# Red-Flag Skorkart — Kriter Tanımları

Her raporda `Report.redFlagBreakdown` JSON alanına yazılır. 0-100 arası toplam skor; yüksek = daha riskli.

## Kriter 1: Şartname uyumu (25 puan)
Ölçülen değerlerin grade/standart bantlarına göre konumu.
- Tüm değerler nominal orta bant → 0 puan
- Tek parametre üst/alt sınıra yakın (±%5) → 5 puan
- Birden fazla parametre sınıra yakın → 10 puan
- En az bir parametre out-of-spec → 20 puan
- Birden fazla out-of-spec veya emniyet kritik parametre (C, Mn+Si, S, P) out → 25 puan

## Kriter 2: Kimyasal–mekanik tutarlılık (25 puan)
Kimyasal kompozisyondan beklenen Rp0.2, Rm, A% bandı vs. ölçülen.
- Tutarlı → 0 puan
- ±10% sapma → 5 puan
- ±20% sapma veya Rp/Rm oranı anormal → 15 puan
- Ciddi tutarsızlık (kimyasal düşük, mekanik yüksek veya tersi) → 25 puan

## Kriter 3: Mikroyapı risk sinyalleri (20 puan)
[Inference] kimyasaldan kestirilen.
- Mn/S < 50 → +4 puan (MnS Type II riski)
- Ti/N < 3.4 → +4 puan (serbest N, HAZ embrittlement)
- Nb+Ti+V > 0.15 wt% → +3 puan (aşırı çökelme, sünekliği etkiler)
- Al_sol < 0.020 wt% → +3 puan (deoksidasyon eksik)
- Ca/S < 1.5 (Ca-treated grade) → +3 puan (inklüzyon modifikasyonu yetersiz)
- B > 0.003 wt% (istenmeyen grade'de) → +3 puan

## Kriter 4: Tedarikçi geçmiş varyasyonu (15 puan)
Müşterinin aynı tedarikçiden geçmiş heat'leri.
- N < 3 rapor, baseline yok → 5 puan (veri yetersiz, ihtiyatlı)
- Stabil trend → 0 puan
- Sınıra sürüklenme (3+ heat üst/alt banda yakın) → 8 puan
- Out-of-spec tekrar ediyor → 15 puan

## Kriter 5: Sertifika bütünlüğü (15 puan)
- EN 10204 3.2 (third-party onaylı) → 0 puan
- EN 10204 3.1 (tam, izlenebilir) → 2 puan
- EN 10204 2.2 (spec uygunluk beyanı) → 8 puan
- EN 10204 2.1 (sadece uygunluk beyanı) → 12 puan
- Sertifika eksik, imzasız, okunaksız → 15 puan

---

## Karar matrisine çeviri

| Toplam skor | Öneri |
|---|---|
| 0–25 | Kabul |
| 26–55 | Şartlı kabul (ek test öner) |
| 56–75 | Ek veri bekleniyor / tedarikçi görüşmesi |
| 76–100 | Ret / kritik uygulamada kullanmama |

**Not:** Safety-critical uygulamalarda eşik bantları -15 puan kaydırılır (30 → şartlı kabul alt eşiği olur).
