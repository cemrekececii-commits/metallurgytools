# KVKK Aydınlatma Metni — Tedarikçi Due Diligence Hizmeti

> Bu metin **şablon**dur. Son haliyle yayına almadan önce bir KVKK uyum danışmanı veya hukuk müşaviri tarafından gözden geçirilmesi zorunludur.

## 1. Veri Sorumlusu

- **Ünvan:** [Ünvanınız / Danışmanlık ticari adı]
- **Adres:** [Adres]
- **İletişim:** [E-posta, telefon]
- **VERBİS kaydı:** [varsa numarası]

## 2. Hangi Kişisel Veriler İşlenir

Due Diligence hizmetinin sunulması kapsamında aşağıdaki veriler işlenir:

**Kimlik ve iletişim verileri:** Ad-soyad, şirket ünvanı, vergi numarası, iş e-postası, telefon.

**Hesap ve üyelik verileri:** Shopier müşteri ID, abonelik durumu, abonelik başlama/bitiş tarihleri, kota kullanım kayıtları, panel giriş logları (IP, user-agent, zaman damgası).

**Sertifika ve teknik veriler:** Yüklediğiniz mill sertifikaları, müşteri şartnameleri, test raporları ve bunlar içindeki tedarikçi firma adı, heat numarası, kimyasal kompozisyon, mekanik değerler vb. Bu veriler ticari sır niteliğinde olabilir ve buna uygun düzeyde korunur.

**Hukuki işlem verileri:** NDA onayları, KVKK onayları, hizmet şartları kabulleri, zaman damgaları.

## 3. İşleme Amaçları

- Due Diligence raporunun hazırlanması ve teslim edilmesi
- Üyelik doğrulama, kota yönetimi, faturalama
- Yasal saklama yükümlülüklerinin yerine getirilmesi
- Hizmet kalitesinin izlenmesi, iyileştirilmesi
- Olası uyuşmazlık çözümü

## 4. Hukuki Sebepler (KVKK m.5)

- Sözleşmenin kurulması ve ifası için gerekli olması
- Veri sorumlusunun meşru menfaati
- Açık rızanız (sertifika içeriklerinin analiz amacıyla işlenmesi)
- Kanunlarda açıkça öngörülmesi

## 5. Saklama Süresi

**Sertifika dosyaları:** Rapor teslim tarihinden itibaren **90 gün**. Bu süre sonunda şifreli storage'dan otomatik silinir.

**Rapor çıktıları:** Rapor teslim tarihinden itibaren **2 yıl** (denetim izi, potansiyel uyuşmazlık).

**Faturalama/hesap verileri:** Yasal zorunluluk (10 yıl TTK, Vergi Usul Kanunu).

**Log verileri:** En fazla **1 yıl**.

Süre dolmadan silinme talebinde bulunabilirsiniz; yasal yükümlülük olmayan veriler için talebiniz yerine getirilir.

## 6. Aktarım

**Yurt içi:** Hosting sağlayıcımıza (şifreli olarak), Shopier'e (abonelik yönetimi), muhasebe/SMMM'imize (fatura), gerektiğinde hukuk müşavirimize.

**Yurt dışı:** Object storage hizmeti [sağlayıcı adı, örn. AWS eu-central-1 / Cloudflare R2] — AB sınırları içinde, GDPR uyumlu.

Uygulamalar dışında üçüncü taraflarla **paylaşılmaz**. Tedarikçi adı dahil içerik anonimleştirilmeden LinkedIn/blog gibi pazarlama mecralarında kullanılmaz.

## 7. Güvenlik Önlemleri

- AES-256 şifreli server-side encryption (SSE)
- HTTPS zorunlu (TLS 1.2+)
- Presigned, süreli upload/download URL'leri (max 48 saat)
- httpOnly + Secure cookie oturum yönetimi
- Veri minimizasyonu — sadece gerekli alanlar
- Rol-tabanlı erişim; sadece yetkilendirilmiş danışman erişebilir

## 8. Haklarınız (KVKK m.11)

Veri sorumlusuna başvurarak:
- İşlenen verileriniz hakkında bilgi talep etme
- İşlenmişse nasıl kullanıldığını öğrenme
- Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme
- Eksik/yanlış işlendiyse düzeltilmesini isteme
- Silme veya yok etme talep etme
- Otomatik sistemlerle analiz edilmeye itiraz etme
- Kanuna aykırı işlemeden kaynaklı zarar için tazminat talep etme

haklarına sahipsiniz.

**Başvuru:** [E-posta] · [Adres] · [KEP varsa]

## 9. Çerezler

Panel çalışması için zorunlu çerezler (oturum, CSRF) kullanılır. Analitik çerez kullanıyorsanız ayrıca açık rıza alın.

## 10. Güncelleme

Bu metin gerekli olduğunda güncellenir. Son güncelleme: [TARİH]. Önemli değişiklikler e-posta ile bildirilir.
