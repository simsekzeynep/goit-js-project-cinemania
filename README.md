# 🎬 CINEMANIA

### Film keşfet, fragmanları izle ve kendi film koleksiyonunu oluştur.

**Cinemania**, TMDB API üzerinden gerçek film verilerini kullanan, responsive ve dinamik bir film keşif uygulamasıdır. Dört kişilik bir ekip tarafından JavaScript takım projesi olarak geliştirilmiştir.

🌐 **[Canlı Demo](https://simsekzeynep.github.io/goit-js-project-cinemania/)** · 💻 **[GitHub Repository](https://github.com/simsekzeynep/goit-js-project-cinemania)**

---

## ✨ Öne Çıkan Özellikler

- 🔥 Günlük ve haftalık trend filmler
- 🔎 Film arama, yıl filtresi ve pagination
- 🎬 Film detayları ve YouTube fragmanları
- ❤️ LocalStorage destekli kişisel film kütüphanesi
- 🎭 Genre filtreleme ve Load More
- 🌓 Light / Dark tema
- 📱 Mobil, tablet ve desktop uyumlu responsive tasarım
- ⚡ TMDB API ile dinamik veri yönetimi

---

## 🛠 Teknolojiler

`HTML5` · `CSS3` · `JavaScript ES6+` · `Vite` · `Axios` · `TMDB API` · `LocalStorage` · `Git & GitHub`

---

## 👥 Ekip & Görev Dağılımı

| Ekip Üyesi | Rol | Geliştirme Alanı | Profil |
| --- | --- | --- | --- |
| **Zeynep Şimşek** | **Team Lead** | My Library · Genre Filtering · LocalStorage · Load More | [GitHub](https://github.com/simsekzeynep) · [LinkedIn](https://www.linkedin.com/in/zeynep-t-9207911a3/) |
| **Melis Gönden** | Developer | Home & Header · Hero · Weekly Trends & Upcoming · Footer & Theme | [GitHub](https://github.com/melisgonden) · [LinkedIn](https://www.linkedin.com/in/melis-g%C3%B6nden-4b3158373) |
| **Nesrin Ekinci** | Developer | Catalog · TMDB API · Search · Year Filter · Pagination | [GitHub](https://github.com/nnesrineekinci) · [LinkedIn](https://www.linkedin.com/in/nnesrineekinci) |
| **Ahsen Göktaş** | Developer | Movie & Trailer Modals · Team Modal · Loader · Scroll Up | [GitHub](https://github.com/ahsengoktas) · [LinkedIn](https://www.linkedin.com/in/ahsengoktas/) |

---

## 🏗 Proje Yapısı

```text
src/
├── css/                     # Sayfa ve bileşen stilleri
├── js/
│   ├── tmdb-api.js          # TMDB API istekleri
│   ├── catalog.js           # Arama, yıl filtresi ve pagination
│   ├── library.js           # Kütüphane, genre filtresi ve Load More
│   ├── library-service.js   # LocalStorage işlemleri
│   ├── movie-modal.js       # Film detay modalı
│   └── trailer-modal.js     # Film fragmanları
├── partials/                # Tekrar kullanılabilir HTML bileşenleri
├── images/                  # Görsel varlıklar
├── index.html               # Ana sayfa
├── catalog.html             # Film kataloğu
└── library.html             # My Library
```

---

## 🚀 Kurulum

```bash
git clone https://github.com/simsekzeynep/goit-js-project-cinemania.git
cd goit-js-project-cinemania
npm install
npm run dev
```

TMDB API kullanımı için proje ana dizininde `.env` dosyası oluşturun:

```env
VITE_TMDB_API_KEY=your_api_key
```

---

### ✅ Proje Kalitesi

**W3C HTML & CSS Validated** · **PageSpeed 90+** · **Responsive Tested**

---

## 📄 Lisans

Bu proje, [**GoIT**](https://goit.global/tr/) Full Stack Developer Programı kapsamında eğitim amaçlı bir ekip projesi olarak geliştirilmiştir.

Proje, film verileri için **The Movie Database (TMDB) API** kullanmaktadır. İlgili içerik ve verilerin hakları kendi sağlayıcılarına aittir.

© 2026 **CineCraft**
