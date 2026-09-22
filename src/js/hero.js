import { getDailyTrends } from './tmdb-api.js';

async function loadHero() {
  const hero = document.querySelector('.hero');
  const title = hero?.querySelector('.hero-title');
  const description = hero?.querySelector('.hero-description');

  if (!hero || !title || !description) return;

  try {
    const movies = await getDailyTrends();

    const candidates = movies.filter(
      movie => movie.backdrop_path && movie.title
    );

    // Film bulunamazsa varsayılan Hero görünümü kalır.
    if (candidates.length === 0) return;

    const movie =
      candidates[Math.floor(Math.random() * candidates.length)];

    const imageUrl =
      `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    // Arka plan hazır olduktan sonra film bilgilerini göster.
    await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    hero.style.backgroundImage = `
      linear-gradient(
        to right,
        rgba(0, 0, 0, 0.85),
        rgba(0, 0, 0, 0.25)
      ),
      url("${imageUrl}")
    `;

    hero.dataset.movieId = movie.id;
    title.textContent = movie.title;
    description.textContent =
      movie.overview || 'No description available.';
    description.classList.add('hero-description-film');

    const rating = document.createElement('p');
    rating.className = 'hero-rating';
    rating.textContent =
      `★ ${Number(movie.vote_average || 0).toFixed(1)} / 10`;

    title.after(rating);

    const defaultButton = hero.querySelector('a.hero-button');
    if (defaultButton) defaultButton.hidden = true;
  } catch (error) {
    console.warn(
      'Hero yüklenemedi; varsayılan görünüm korunuyor.',
      error.response?.status || 'Görsel veya bağlantı hatası'
    );
  }
}

loadHero();