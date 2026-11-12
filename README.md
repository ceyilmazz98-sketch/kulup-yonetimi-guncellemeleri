# Kulüp Yönetimi — Güncelleme Yayını

Bu depo, Kulüp Yönetimi Windows masaüstü uygulamasının **imzalı güncelleme dosyalarını** yayımlamak içindir.

## Güncelleme kaynağı

Uygulamanın sabit kontrol adresi:

`https://github.com/ceyilmazz98-sketch/kulup-yonetimi-guncellemeleri/releases/latest/download/latest.json`

Yeni bir sürüm yayımlandığında `Releases` altında `v2.1.3` gibi bir sürüm oluşturulur ve iki **varlık** eklenir:
- `latest.json` — yayıncı anahtarıyla **Ed25519 imzalı** sürüm manifesti
- `KulupYonetimi_v2_1_3_Kurulum.zip` — manifestteki SHA-256 değeriyle eşleşen tam kurulum arşivi

**Önemli:** Doğrulanmış bir Windows paketi ve imzalı manifest yüklenmeden yeni sürüm yayımlanmış kabul edilmez. Bu depodaki dosyalar tek başına uygulama güncellemesi başlatmaz.

**Güvenlik:** Kulüp/sporcu veritabanları, kişisel bilgiler, yerel yedekler ve `publisher-private.pem` **asla** bu depoya eklenmemelidir. Yalnızca imzalı dağıtım dosyaları yayımlanır.

Uygulama internet yokken de kullanılabilir. Güncelleme kontrolü internet gerektirir; indirme ve kurulum için kullanıcının onayı gerekir.
