import { showLoader, hideLoader } from './loader.js';
import { getUpcomingThisMonth, getGenres } from './tmdb-api.js';
import {
  isInLibrary,
  toggleLibrary,
} from './library-service.js';

const wrapper = document.querySelector('#upcomingWrapper');

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

async function loadUpcoming() {
  if (!wrapper) return;

  wrapper.textContent = 'Loading movie…';
  showLoader();

  try {
    const [movies, genres] = await Promise.all([
      getUpcomingThisMonth(),
      getGenres(),
    ]);

    const movie = movies.length
      ? movies[Math.floor(Math.random() * movies.length)]
      : null;

    if (!movie) {
      wrapper.textContent = 'No movies found for this month.';
      return;
    }

    // Ortak kütüphanenin beklediği tür nesnelerini hazırla.
    const movieGenres = (movie.genre_ids || [])
      .map(id => genres.find(genre => genre.id === id))
      .filter(Boolean);

    const libraryMovie = {
      ...movie,
      genres: movieGenres,
    };

    const article = createElement('article', 'upcoming-card');
    const imagePath = movie.backdrop_path || movie.poster_path;

    if (imagePath) {
      const image = createElement('img', 'upcoming-image');
      image.src = `https://image.tmdb.org/t/p/w780${imagePath}`;
      image.alt = movie.title || 'Movie image';
      image.loading = 'lazy';
      article.append(image);
    } else {
      article.append(
        createElement(
          'div',
          'upcoming-image upcoming-placeholder',
          'No image available'
        )
      );
    }

    const content = createElement('div', 'upcoming-content');
    const title = createElement(
      'h3',
      'upcoming-title',
      movie.title || 'Untitled movie'
    );
    const facts = createElement('dl', 'upcoming-facts');

    const genreNames = movieGenres
      .map(genre => genre.name)
      .join(', ');

    const releaseDate = movie.release_date
      ? movie.release_date.split('-').reverse().join('.')
      : 'Unknown';

    const rows = [
      ['Release date', releaseDate],
      [
        'Vote / Votes',
        `${Number(movie.vote_average || 0).toFixed(1)} / ${
          movie.vote_count || 0
        }`,
      ],
      ['Popularity', Number(movie.popularity || 0).toFixed(1)],
      ['Genre', genreNames || 'Unknown'],
    ];

    rows.forEach(([label, value]) => {
      const term = createElement('dt', '', label);
      const description = createElement('dd', '', value);

      if (label === 'Release date') {
        description.className = 'upcoming-date';
      }

      facts.append(term, description);
    });

    const aboutTitle = createElement(
      'h4',
      'upcoming-about-title',
      'About'
    );

    const overview = createElement(
      'p',
      'upcoming-overview',
      movie.overview || 'No description available.'
    );

    const button = createElement('button', 'hero-button');
    button.type = 'button';

    const status = createElement('p', 'upcoming-status');
    status.setAttribute('role', 'status');

    function updateButton() {
      const saved = isInLibrary(movie.id);

      button.textContent = saved
        ? 'Remove from my library'
        : 'Add to my library';

      button.setAttribute('aria-pressed', String(saved));
      button.disabled = false;

      return saved;
    }

    function syncButton() {
      try {
        updateButton();
      } catch {
        button.textContent = 'Library unavailable';
        button.disabled = true;
        button.removeAttribute('aria-pressed');
        status.textContent =
          'Your library could not be read.';
      }
    }

    syncButton();

    button.addEventListener('click', () => {
      try {
        toggleLibrary(libraryMovie);
        const saved = updateButton();

        status.textContent = saved
          ? 'Movie added to your library.'
          : 'Movie removed from your library.';
      } catch {
        status.textContent =
          'Could not update your library. Please try again.';
      }
    });

    // Detay penceresinde yapılan değişiklikten sonra butonu güncelle.
    document
      .querySelector('#movie-modal')
      ?.addEventListener('close', () => {
        status.textContent = '';
        syncButton();
      });

    // Başka sekmede veya geri dönüşte değişen kayıtları kontrol et.
    window.addEventListener('storage', syncButton);
    window.addEventListener('pageshow', syncButton);

    content.append(
      title,
      facts,
      aboutTitle,
      overview,
      button,
      status
    );

    article.append(content);
    wrapper.replaceChildren(article);
  } catch {
    wrapper.textContent =
      'Movie could not be loaded. Please try again later.';
  } finally {
    hideLoader();
  }
}

loadUpcoming();