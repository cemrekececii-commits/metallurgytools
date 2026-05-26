# LinkedIn Anonim Vaka Paylaşım Formatı

Amaç: "Bu sertifikada ne görüyorum?" formatında her hafta 1-2 anonim vaka. Teknik derinlik yüksek, motive edici dil yok. Her gönderi sonunda siteye CTA.

## Şablon

```
[BAŞLIK — merak uyandıran metalürjik tespit]
Örnek: "S700MC sertifikasında Nb 0.083 — ama sünme davranışı neden kötü?"

[1. PARAGRAF — anonim bağlam, 2-3 cümle]
"Geçen hafta bir basınçlı kap imalatçısından gelen bir heat'i değerlendirdim. 
Grade S700MC, kalınlık 8 mm, sıcak haddelenmiş bobin. 
Sertifika 3.1 uyumlu, ölçüler nominal."

[2. PARAGRAF — ilk bakış, 'normal' görünen]
"Kimyasal kompozisyona bakıyorsunuz: C 0.08, Mn 1.85, Si 0.25, Nb 0.083, Ti 0.12, V 0.10.
Grade spec'i içinde, mekanik değerler (Rp0.2 = 752, Rm = 824, A = 14%) şartnameye uyumlu."

[3. PARAGRAF — KRITIK DETAY, yorum]
"Ama Nb+Ti+V toplamı 0.30 wt%. S700MC için bu mikroalaşım aşırı yüklenme. 
Haddeleme pozisyonunda yeterli rekristalizasyon olmamışsa — 
fiziksel anlamı: çökelme yerleri tane sınırlarında kümelenmiş, 
HAZ'da çözünmüş mikroalaşımın yeniden çökelmesi plastik instabilite yaratıyor."

[4. PARAGRAF — tedarikçi sinyali]
"Daha önemlisi: aynı tedarikçinin son 4 heat'inde toplam mikroalaşım trendi 
0.22 → 0.25 → 0.28 → 0.30 yönünde sürükleniyor. 
Tedarikçi büyük ihtimalle mekanik değerleri tutmak için kimyayı sıkıştırıyor — 
ama işlevsel marj daralıyor."

[5. PARAGRAF — sonuç]
"Müşteriye önerim: şartlı kabul, 
+ SEM-EDS inklüzyon haritası, 
+ kaynak prosedür uyumu için HAZ Charpy.
Tedarikçi ile tartışılacak: Nb+Ti+V spec ceiling'inin ürettiği marj."

[CTA — son satır]
"Sertifikanızı değerlendirelim → [site linki]"

#Metalurji #ÇelikKalite #TedarikçiYönetimi #SteelQuality #CBAM
```

## Vaka fikir havuzu (ilk 12 paylaşım için)

1. **DP600 — Mn+Si bant üstünde, martensit adacıkları büyüyor**
2. **S700MC — mikroalaşım toplamı 0.30, HAZ embrittlement riski**
3. **API 5L X65M — DWTT %SA sınıra yakın, sıvı kırılma sıcaklığı yorumu**
4. **IF DX54D — AlN çökelmesi eksik, tane boyutu hedef dışı**
5. **S355J2+N — Ti eklenmiş ama Ti/N stokiyometrik değil**
6. **Filmaşin — Karbon segregasyonu, yayın anneal öncesi tork bozukluğu**
7. **Galvaniz DX51D+Z275 — Mn yüksek, galvanaj reaksiyonu problemli**
8. **Basınçlı kap P355NL2 — Ni eksik bandında, tedarikçi rutin mi yoksa tekil?**
9. **3.1 vs 3.2 sertifika farkı — third-party eksik, hangi grade'de kritik?**
10. **Ca-treatment izi yok — Al-killed çelikte inklüzyon modifikasyonu belirsiz**
11. **Out-of-spec değil ama sapma trendi — 6 heat'in 4'ü üst banda kayıyor**
12. **CBAM için hangi sertifika verisi direkt kullanılabilir?**

## Yazım kuralları (user preferences ile uyumlu)

- Motive edici dil yok ("harika", "müthiş" gibi).
- Genel açıklama değil — her iddianın metalürjik mekanizması gerekir.
- "[Inference]" etiketi: kimyasaldan mikroyapı kestirimi yaparken.
- "[Unverified]" etiketi: tedarikçi verisi kesinleştirilmediyse.
- Tedarikçi veya firma adı asla geçmez. Heat numarası değiştirilir.
- Her vaka mikroyapı–özellik ilişkisine bağlanır.

## Retargeting

LinkedIn'de paylaşılan vakanın ekran görüntüsü siteye landing olarak yönlendirilebilir:
- **Landing:** /hizmetler/tedarikci-due-diligence?utm_source=linkedin&utm_campaign=case_01
- Her vakaya benzer bir **indirilebilir anonim rapor örneği** (PDF) lead magnet olarak verilebilir.
