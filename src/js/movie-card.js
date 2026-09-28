const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const MAX_STARS = 5;

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>"']/g,
    character => HTML_ENTITIES[character]
  );
}

function getMovieYear(releaseDate) {
  return releaseDate ? String(releaseDate).slice(0, 4) : 'Unknown';
}

function getGenreNames(movie) {
  if (!Array.isArray(movie.genres)) return '';

  return movie.genres
    .map(genre => genre?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}

function getStarRating(voteAverage) {
  const rating = Number(voteAverage);

  if (!Number.isFinite(rating)) return 0;

  return Math.max(0, Math.min(MAX_STARS, Math.round(rating / 2)));
}

function createRatingMarkup(voteAverage) {
  const filledStars = getStarRating(voteAverage);

  return Array.from({ length: MAX_STARS }, (_, index) => {
    const isFilled = index < filledStars;

    return `
      <span
        class="movie-card__star"
        aria-hidden="true"
      >${isFilled ? '★' : '☆'}</span>
    `;
  }).join('');
}

export function createMovieCardMarkup(movie) {
  const title = movie.title || 'Untitled movie';

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '';

  const genres = getGenreNames(movie) || 'Unknown';
  const year = getMovieYear(movie.release_date);
  const meta = `${genres} | ${year}`;

  const numericRating = Number(movie.vote_average);

  const accessibleRating = Number.isFinite(numericRating)
    ? (numericRating / 2).toFixed(1)
    : '0.0';

  return `
    <li
      class="movie-card"
      data-id="${escapeHtml(movie.id)}"
      tabindex="0"
      role="button"
      aria-haspopup="dialog"
      aria-label="${escapeHtml(title)} — View details"
    >
      <div class="movie-card__media">
        ${
          posterUrl
            ? `
              <img
                class="movie-card__image"
                src="${escapeHtml(posterUrl)}"
                alt="${escapeHtml(title)}"
                loading="lazy"
              />
            `
            : `
              <div class="movie-card__placeholder">
                Poster unavailable
              </div>
            `
        }

        <div class="movie-card__overlay">
          <div class="movie-card__info">
            <h2 class="movie-card__title">
              ${escapeHtml(title)}
            </h2>

            <p class="movie-card__meta">
              ${escapeHtml(meta)}
            </p>
          </div>

          <div
            class="movie-card__rating"
            aria-label="${accessibleRating} out of 5 stars"
          >
            ${createRatingMarkup(movie.vote_average)}
          </div>
        </div>
      </div>
    </li>
  `;
}
