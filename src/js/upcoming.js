import { getUpcomingThisMonth, getGenres } from './tmdb-api.js';

const wrapper = document.querySelector('#upcomingWrapper');
const STORAGE_KEY = 'cinemania-library';

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function readLibrary() {
  const saved = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  );

  if (!Array.isArray(saved)) {
    throw new Error('Kütüphane verisi okunamadı.');
  }

  return saved;
}

async function loadUpcoming() {
  if (!wrapper) return;

  wrapper.textContent = 'Loading movie…';

  try {
    const [movies, genres] = await Promise.all([
      getUpcomingThisMonth(),
      getGenres(),
    ]);

    // Gelen filmler arasından rastgele birini seç.
    const movie = movies.length
      ? movies[Math.floor(Math.random() * movies.length)]
      : null;

    if (!movie) {
      wrapper.textContent = 'No movies found for this month.';
      return;
    }

    const article = createElement('article', 'upcoming-card');
    const imagePath = movie.backdrop_path || movie.poster_path;

    if (imagePath) {
      const image = createElement('img', 'upcoming-image');
      image.src = `https://image.tmdb.org/t/p/w780${imagePath}`;
      image.alt = movie.title;
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
    const title = createElement('h3', 'upcoming-title', movie.title);
    const facts = createElement('dl', 'upcoming-facts');

    const genreNames = (movie.genre_ids || [])
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const releaseDate = movie.release_date
      ? movie.release_date.split('-').reverse().join('.')
      : 'Unknown';

    const rows = [
      ['Release date', releaseDate],
      [
        'Vote / Votes',
        `${Number(movie.vote_average || 0).toFixed(1)} / ${movie.vote_count || 0}`,
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
      const isSaved = readLibrary().some(
        item => item.id === movie.id
      );

      button.textContent = isSaved
        ? 'Remove from my library'
        : 'Add to my library';

      button.setAttribute('aria-pressed', String(isSaved));
    }

    try {
      updateButton();
    } catch {
      button.textContent = 'Add to my library';
      button.disabled = true;
      status.textContent =
        'Your library is unavailable in this browser.';
    }

    button.addEventListener('click', () => {
      try {
        const library = readLibrary();
        const isSaved = library.some(
          item => item.id === movie.id
        );

        const updatedLibrary = isSaved
          ? library.filter(item => item.id !== movie.id)
          : [...library, movie];

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedLibrary)
        );

        updateButton();

        status.textContent = isSaved
          ? 'Movie removed from your library.'
          : 'Movie added to your library.';
      } catch {
        status.textContent =
          'Could not update your library. Please try again.';
      }
    });

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
  } catch (error) {
    wrapper.textContent =
      'Movie could not be loaded. Please try again later.';

    console.warn(
      'Upcoming yüklenemedi:',
      error.response?.status || error.message
    );
  }
}

loadUpcoming();