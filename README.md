# Kulüp Yönetimi — Windows Güncelleme Kanalı

Bu depo Kulüp Yönetimi'nin herkese açık **imzalı Windows güncelleme** dosyaları içindir. Kulüp verileri burada tutulmaz.

**Uygulamanın kontrol adresi:**

`https://github.com/ceyilmazz98-sketch/kulup-yonetimi-guncellemeleri/releases/latest/download/latest.json`

## Otomatik GitHub yayını (GitHub Actions)

`.github/workflows/publish-updates.yml` iş akışı `main` dalına bir sürüm paketi geldiğinde çalışır.

Bir güncelleme için şu iki dosya **aynı sürüm klasöründe** bulunmalıdır:

- `publish/v2.1.3/latest.json` — özel yayıncı anahtarıyla imzalı manifest
- `publish/v2.1.3/KulupYonetimi_v2_1_3_Kurulum.zip` — manifestteki hash ve boyutla eşleşen kurulum paketi

Actions **Ed25519 imzasını, ZIP boyutunu, SHA-256 özetini ve beklenen GitHub adresini doğrular**. Ardından `v2.1.3` etiketli GitHub Release'i oluşturup bu iki dosyayı otomatik ekler. Eksik dosya varsa yayınlamaz; mevcut bir sürümün üzerine yazmaz. Yayınlama işleminde `GITHUB_TOKEN` için `contents: write` izni kullanılır.

**Durum:** v2.1.3 manifesti depoya kaydedildi; ZIP arşivi henüz depoya aktarılmadı. Bu nedenle otomatik yayınlama iş akışı hazır olsa da v2.1.3 Release henüz oluşmadı.

## Güvenlik

- `publisher-private.pem`, sporcu ve ödeme veritabanları, yedekler ve kişisel bilgiler **asla GitHub'a yüklenmez**.
- Actions özel anahtarla imza **üretmez**; yalnızca zaten imzalanmış güncellemeleri doğrular ve yayımlar.
- Yeni sürüm kaynağında önceki sürümden daha yüksek sürüm numarası kullanılmalı.
- İlk gerçek Windows uygulama içi güncelleme denemesi henüz yapılmadı.
- İnternet olmadan uygulamanın günlük işlevleri çalışmaya devam eder.

## Önemli sınır

GitHub Releases ekranında her seferinde elle yayın yapmak gerekmiyor; ancak yeni sürümün ZIP dosyası ile imzalı manifestinin GitHub'a aktarılması ayrı bir adımdır. Bu depoya kurulmuş iş akışı **o aktarımı değil, doğrulama ve Release yayımlama adımını otomatikleştirir**. Tamamen dokunmadan yayınlama için güvenli ikili dosya aktarımı veya GitHub içinde kaynak koddan derleme sistemi ayrıca kurulmalıdır.
