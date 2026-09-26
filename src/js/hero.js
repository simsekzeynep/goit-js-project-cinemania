import { showLoader, hideLoader } from './loader.js';
import { getDailyTrends } from './tmdb-api.js';
import { openMovieModal } from './movieModal.js';
import { openTrailerModal } from './trailerModal.js';

async function loadHero() {
  const hero = document.querySelector('.hero');
  const title = hero?.querySelector('.hero-title');
  const description = hero?.querySelector('.hero-description');

  if (!hero || !title || !description) return;

  showLoader();

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

    // Görsel hazır olana kadar varsayılan görünümü koru.
    await new Promise((resolve, reject) => {
      const image = new Image();

      const timeoutId = window.setTimeout(() => {
        image.onload = null;
        image.onerror = null;
        reject(new Error('Hero image loading timed out.'));
      }, 15000);

      image.onload = () => {
        window.clearTimeout(timeoutId);
        image.onload = null;
        image.onerror = null;
        resolve();
      };

      image.onerror = () => {
        window.clearTimeout(timeoutId);
        image.onload = null;
        image.onerror = null;
        reject(new Error('Hero image could not be loaded.'));
      };

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

    const status = document.createElement('p');
    status.className = 'hero-status';
    status.setAttribute('role', 'status');
    status.hidden = true;

    function showStatus(message = '') {
      status.textContent = message;
      status.hidden = !message;
    }

    // Film detayları butonu
    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'hero-button';
    detailsButton.textContent = 'More details';
    detailsButton.setAttribute('aria-haspopup', 'dialog');

    let isOpening = false;

    detailsButton.addEventListener('click', async () => {
      if (isOpening) return;

      isOpening = true;
      detailsButton.setAttribute('aria-disabled', 'true');
      showStatus();

      try {
        await openMovieModal(movie.id);
      } catch {
        showStatus(
          'Movie details could not be opened. Please try again.'
        );
      } finally {
        isOpening = false;
        detailsButton.removeAttribute('aria-disabled');
      }
    });

    // Fragman butonu
    const trailerButton = document.createElement('button');
    trailerButton.type = 'button';
    trailerButton.className = 'hero-button hero-button-outline';
    trailerButton.textContent = 'Watch trailer';
    trailerButton.setAttribute('aria-haspopup', 'dialog');

    let isTrailerOpening = false;

    trailerButton.addEventListener('click', async () => {
      if (isTrailerOpening) return;

      isTrailerOpening = true;
      trailerButton.setAttribute('aria-disabled', 'true');
      showStatus();

      try {
        await openTrailerModal(movie.id);
      } catch {
        showStatus(
          'The trailer window could not be opened. Please try again.'
        );
      } finally {
        isTrailerOpening = false;
        trailerButton.removeAttribute('aria-disabled');
      }
    });

    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    actions.append(detailsButton, trailerButton);

    description.after(actions, status);
  } catch {
    // Film veya görsel yüklenemezse varsayılan görünüm korunur.
  } finally {
    hideLoader();
  }
}

loadHero();