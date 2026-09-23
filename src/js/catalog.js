import { getTrendingMovies, searchMovies, getGenres } from './tmdb-api.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const searchForm = document.querySelector('#catalogSearchForm');
const searchInput = document.querySelector('#catalogSearchInput');
const clearButton = document.querySelector('#catalogClearBtn');
const yearSelect = document.querySelector('#catalogYearSelect');
const catalogList = document.querySelector('#catalogList');
const catalogMessage = document.querySelector('#catalogMessage');

let genres = [];

// YEAR SELECT
function createYearOptions() {
  const currentYear = new Date().getFullYear();
  const firstYear = 1900;

  for (let year = currentYear; year >= firstYear; year -= 1) {
    const option = document.createElement('option');

    option.value = year;
    option.textContent = year;

    yearSelect.append(option);
  }
}

// CLEAR BUTTON
function updateClearButton() {
  const isInputEmpty = searchInput.value.trim() === '';

  clearButton.hidden = isInputEmpty;
}

// GENRES
function getGenreNames(genreIds = []) {
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}

// YEAR
function getMovieYear(releaseDate) {
  if (!releaseDate) {
    return 'Unknown';
  }

  return releaseDate.slice(0, 4);
}

// MOVIE CARD
function createMovieCard(movie) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '';

  const movieGenres = getGenreNames(movie.genre_ids);
  const movieYear = getMovieYear(movie.release_date);

  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : '0.0';

  return `
    <li class="catalog-card" data-id="${movie.id}">
      <div class="catalog-card-image-wrapper">

        ${
          posterUrl
            ? `
              <img
                class="catalog-card-image"
                src="${posterUrl}"
                alt="${movie.title}"
                loading="lazy"
              />
            `
            : `
              <div class="catalog-card-no-image">
                No image
              </div>
            `
        }

        <div class="catalog-card-overlay">
          <div class="catalog-card-info">
            <h2 class="catalog-card-title">
              ${movie.title}
            </h2>

            <p class="catalog-card-meta">
              ${movieGenres || 'Unknown'} | ${movieYear}
            </p>
          </div>

          <p class="catalog-card-rating">
            ${rating}
          </p>
        </div>
      </div>
    </li>
  `;
}

// RENDER MOVIES
function renderMovies(movies) {
  if (!movies || movies.length === 0) {
    catalogList.innerHTML = '';

    catalogMessage.textContent =
      'We are sorry, but we could not find any results.';

    catalogMessage.hidden = false;

    return;
  }

  catalogMessage.hidden = true;

  catalogList.innerHTML = movies
    .map(movie => createMovieCard(movie))
    .join('');
}

// INPUT
searchInput.addEventListener('input', updateClearButton);

// CLEAR
clearButton.addEventListener('click', () => {
  searchInput.value = '';

  updateClearButton();

  searchInput.focus();
});

// FORM
searchForm.addEventListener('submit', event => {
  event.preventDefault();

  // API key geldikten sonra arama işlemini buraya bağlayacağız.
});

// START
createYearOptions();
updateClearButton();