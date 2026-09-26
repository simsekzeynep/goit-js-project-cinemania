import {
  getTrendingMovies,
  searchMovies,
  getGenres,
} from './tmdb-api.js';

import { openMovieModal } from './movieModal.js';
import { showLoader, hideLoader } from './loader.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const FIRST_MOVIE_YEAR = 1900;

// =========================
// DOM
// =========================

const searchForm = document.querySelector('#catalogSearchForm');
const searchInput = document.querySelector('#catalogSearchInput');
const clearButton = document.querySelector('#catalogClearBtn');
const yearSelect = document.querySelector('#catalogYearSelect');

const catalogList = document.querySelector('#catalogList');
const catalogMessage = document.querySelector('#catalogMessage');
const catalogPagination = document.querySelector('#catalogPagination');

const catalogHero = document.querySelector('#catalogHero');
const catalogHeroContent = document.querySelector('#catalogHeroContent');
const catalogHeroTitle = document.querySelector('#catalogHeroTitle');
const catalogHeroRating = document.querySelector('#catalogHeroRating');
const catalogHeroDescription = document.querySelector(
  '#catalogHeroDescription'
);
const catalogHeroMessage = document.querySelector('#catalogHeroMessage');

const heroDetailsButton = document.querySelector(
  '#catalogHeroDetailsBtn'
);

// =========================
// STATE
// =========================

let genres = [];
let currentPage = 1;
let currentQuery = '';
let currentYear = '';
let heroMovieId = null;

// =========================
// YEAR SELECT
// =========================

function createYearOptions() {
  const currentYearValue = new Date().getFullYear();

  for (
    let year = currentYearValue;
    year >= FIRST_MOVIE_YEAR;
    year -= 1
  ) {
    const option = document.createElement('option');

    option.value = year;
    option.textContent = year;

    yearSelect.append(option);
  }
}

// =========================
// SEARCH HELPERS
// =========================

function updateClearButton() {
  const isInputEmpty = searchInput.value.trim() === '';

  clearButton.classList.toggle(
    'is-hidden',
    isInputEmpty
  );
}

function handleClearSearch() {
  searchInput.value = '';
  clearButton.classList.add('is-hidden');
  searchInput.focus();
}

// =========================
// MOVIE HELPERS
// =========================

function getGenreNames(genreIds = []) {
  return genreIds
    .map(id => {
      return genres.find(
        genre => genre.id === id
      )?.name;
    })
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}

function getMovieYear(releaseDate) {
  if (!releaseDate) {
    return 'Unknown';
  }

  return releaseDate.slice(0, 4);
}

function getMovieRating(voteAverage) {
  return typeof voteAverage === 'number'
    ? voteAverage.toFixed(1)
    : '0.0';
}

// =========================
// HERO
// =========================

function renderHero(movie) {
  if (!movie) {
    heroMovieId = null;

    catalogHeroContent.hidden = true;
    catalogHeroMessage.hidden = false;

    catalogHeroMessage.textContent =
      'We are sorry, but we could not find a movie for today.';

    catalogHero.style.backgroundImage = 'none';

    return;
  }

  heroMovieId = movie.id;

  catalogHeroMessage.hidden = true;
  catalogHeroContent.hidden = false;

  catalogHeroTitle.textContent =
    movie.title || 'Unknown movie';

  catalogHeroDescription.textContent =
    movie.overview ||
    'No description available.';

  catalogHeroRating.textContent =
    `★ ${getMovieRating(movie.vote_average)}`;

  catalogHero.style.backgroundImage =
    movie.backdrop_path
      ? `url("${BACKDROP_BASE_URL}${movie.backdrop_path}")`
      : 'none';
}

function getDailyMovie(movies) {
  if (!movies?.length) {
    return null;
  }

  const today = new Date();

  const startOfYear = new Date(
    today.getFullYear(),
    0,
    0
  );

  const dayNumber = Math.floor(
    (today - startOfYear) / 86400000
  );

  const movieIndex =
    dayNumber % movies.length;

  return movies[movieIndex];
}

// =========================
// MOVIE CARD
// =========================

function createMovieCard(movie) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '';

  const movieGenres =
    getGenreNames(movie.genre_ids);

  const movieYear =
    getMovieYear(movie.release_date);

  const rating =
    getMovieRating(movie.vote_average);

  const titleId =
    `catalog-movie-title-${movie.id}`;

  return `
    <li
      class="catalog-card"
      data-id="${movie.id}"
      tabindex="0"
      role="button"
      aria-labelledby="${titleId}"
    >
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
                Poster unavailable
              </div>
            `
        }

        <div class="catalog-card-overlay">

          <div class="catalog-card-info">

            <h2
              class="catalog-card-title"
              id="${titleId}"
            >
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

// =========================
// RENDER
// =========================

function showCatalogMessage(message) {
  catalogList.innerHTML = '';
  catalogPagination.innerHTML = '';

  catalogMessage.textContent = message;
  catalogMessage.hidden = false;
}

function renderMovies(movies) {
  if (!movies?.length) {
    showCatalogMessage(
      'We are sorry, but we could not find any results.'
    );

    return;
  }

  catalogMessage.hidden = true;

  catalogList.innerHTML = movies
    .map(createMovieCard)
    .join('');
}

// =========================
// PAGINATION
// =========================

function createPageButton(page) {
  const button =
    document.createElement('button');

  button.type = 'button';
  button.textContent = page;
  button.dataset.page = page;

  if (page === currentPage) {
    button.classList.add('is-active');
  }

  return button;
}

function renderPagination(page, totalPages) {
  currentPage = page;

  catalogPagination.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  const startPage = Math.max(
    1,
    currentPage - 2
  );

  const endPage = Math.min(
    totalPages,
    currentPage + 2
  );

  for (
    let pageNumber = startPage;
    pageNumber <= endPage;
    pageNumber += 1
  ) {
    catalogPagination.append(
      createPageButton(pageNumber)
    );
  }
}

// =========================
// API REQUESTS
// =========================

async function fetchAndRenderMovies(
  request,
  errorMessage,
  options = {}
) {
  showLoader();

  try {
    const data = await request();

    renderMovies(data.results);

    renderPagination(
      data.page,
      data.total_pages
    );

    if (options.updateHero) {
      renderHero(
        getDailyMovie(data.results)
      );
    }
  } catch (error) {
    console.error(error);

    showCatalogMessage(errorMessage);
  } finally {
    hideLoader();
  }
}

function loadTrendingMovies(page = 1) {
  return fetchAndRenderMovies(
    () => getTrendingMovies(page),
    'Something went wrong while loading movies.',
    {
      updateHero: page === 1,
    }
  );
}

function loadSearchResults(
  query,
  year,
  page = 1
) {
  return fetchAndRenderMovies(
    () => searchMovies(
      query,
      year,
      page
    ),
    'Something went wrong while searching movies.'
  );
}

// =========================
// MOVIE MODAL
// =========================

function openCardModal(card) {
  if (!card) {
    return;
  }

  const movieId = Number(
    card.dataset.id
  );

  openMovieModal(movieId);
}

function handleCatalogClick(event) {
  const card = event.target.closest(
    '.catalog-card'
  );

  openCardModal(card);
}

function handleCatalogKeydown(event) {
  const card = event.target.closest(
    '.catalog-card'
  );

  if (!card) {
    return;
  }

  const isActivationKey =
    event.key === 'Enter' ||
    event.key === ' ';

  if (!isActivationKey) {
    return;
  }

  event.preventDefault();

  openCardModal(card);
}

// =========================
// SEARCH
// =========================

async function handleSearchSubmit(event) {
  event.preventDefault();

  currentQuery =
    searchInput.value.trim();

  currentYear =
    yearSelect.value;

  currentPage = 1;

  if (!currentQuery) {
    await loadTrendingMovies(1);
    return;
  }

  await loadSearchResults(
    currentQuery,
    currentYear,
    currentPage
  );
}

// =========================
// HERO DETAILS
// =========================

function handleHeroDetailsClick() {
  if (!heroMovieId) {
    return;
  }

  openMovieModal(heroMovieId);
}

// =========================
// PAGINATION
// =========================

async function handlePaginationClick(event) {
  const button =
    event.target.closest('button');

  if (!button) {
    return;
  }

  currentPage = Number(
    button.dataset.page
  );

  if (currentQuery) {
    await loadSearchResults(
      currentQuery,
      currentYear,
      currentPage
    );
  } else {
    await loadTrendingMovies(
      currentPage
    );
  }

  window.scrollTo({
    top: catalogHero.offsetHeight,
    behavior: 'smooth',
  });
}

// =========================
// EVENTS
// =========================

function addEventListeners() {
  searchInput.addEventListener(
    'input',
    updateClearButton
  );

  clearButton.addEventListener(
    'click',
    handleClearSearch
  );

  searchForm.addEventListener(
    'submit',
    handleSearchSubmit
  );

  catalogList.addEventListener(
    'click',
    handleCatalogClick
  );

  catalogList.addEventListener(
    'keydown',
    handleCatalogKeydown
  );

  heroDetailsButton.addEventListener(
    'click',
    handleHeroDetailsClick
  );

  catalogPagination.addEventListener(
    'click',
    handlePaginationClick
  );
}

// =========================
// INIT
// =========================

async function loadGenres() {
  try {
    genres = await getGenres();
  } catch (error) {
    console.error(
      'Genres could not be loaded:',
      error
    );

    genres = [];
  }
}

async function initCatalog() {
  createYearOptions();
  updateClearButton();
  addEventListeners();

  await loadGenres();
  await loadTrendingMovies();
}

initCatalog();