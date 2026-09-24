import {
  getTrendingMovies,
  searchMovies,
  getGenres,
} from './tmdb-api.js';

import { openMovieModal } from './movieModal.js';
import { showLoader, hideLoader } from './loader.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

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
let totalPages = 0;

let currentQuery = '';
let currentYear = '';

let heroMovieId = null;

// =========================
// YEAR SELECT
// =========================

function createYearOptions() {
  const currentYearValue = new Date().getFullYear();
  const firstYear = 1900;

  for (
    let year = currentYearValue;
    year >= firstYear;
    year -= 1
  ) {
    const option = document.createElement('option');

    option.value = year;
    option.textContent = year;

    yearSelect.append(option);
  }
}

// =========================
// CLEAR BUTTON
// =========================

function updateClearButton() {
  const isInputEmpty = searchInput.value.trim() === '';

  clearButton.classList.toggle(
    'is-hidden',
    isInputEmpty
  );
}

// =========================
// GENRES
// =========================

function getGenreNames(genreIds = []) {
  return genreIds
    .map(
      id =>
        genres.find(genre => genre.id === id)
          ?.name
    )
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}

// =========================
// MOVIE YEAR
// =========================

function getMovieYear(releaseDate) {
  if (!releaseDate) {
    return 'Unknown';
  }

  return releaseDate.slice(0, 4);
}

// =========================
// HERO
// =========================

function renderHero(movie) {
  if (!movie) {
    heroMovieId = null;

    catalogHeroContent.hidden = true;

    catalogHeroMessage.textContent =
      'We are sorry, but we could not find a movie for today.';

    catalogHeroMessage.hidden = false;

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

  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : '0.0';

  catalogHeroRating.textContent = `★ ${rating}`;

  if (movie.backdrop_path) {
    catalogHero.style.backgroundImage =
      `url("${BACKDROP_BASE_URL}${movie.backdrop_path}")`;
  } else {
    catalogHero.style.backgroundImage = 'none';
  }
}

// =========================
// DAILY MOVIE
// =========================

function getDailyMovie(movies) {
  if (!movies || movies.length === 0) {
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

  const movieGenres = getGenreNames(
    movie.genre_ids
  );

  const movieYear = getMovieYear(
    movie.release_date
  );

  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : '0.0';

  return `
    <li
      class="catalog-card"
      data-id="${movie.id}"
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

            <h2 class="catalog-card-title">
              ${movie.title}
            </h2>

            <p class="catalog-card-meta">
              ${
                movieGenres || 'Unknown'
              } | ${movieYear}
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
// RENDER MOVIES
// =========================

function renderMovies(movies) {
  if (!movies || movies.length === 0) {
    catalogList.innerHTML = '';
    catalogPagination.innerHTML = '';

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

function renderPagination(page, pages) {
  currentPage = page;
  totalPages = pages;

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
// TRENDING MOVIES
// =========================

async function loadTrendingMovies(page = 1) {
  showLoader();

  try {
    const data =
      await getTrendingMovies(page);

    renderMovies(data.results);

    renderPagination(
      data.page,
      data.total_pages
    );

    if (page === 1) {
      const dailyMovie =
        getDailyMovie(data.results);

      renderHero(dailyMovie);
    }
  } catch (error) {
    catalogList.innerHTML = '';
    catalogPagination.innerHTML = '';

    catalogMessage.textContent =
      'Something went wrong while loading movies.';

    catalogMessage.hidden = false;
  } finally {
    hideLoader();
  }
}

// =========================
// SEARCH MOVIES
// =========================

async function loadSearchResults(
  query,
  year,
  page = 1
) {
  showLoader();

  try {
    const data = await searchMovies(
      query,
      year,
      page
    );

    renderMovies(data.results);

    renderPagination(
      data.page,
      data.total_pages
    );
  } catch (error) {
    catalogList.innerHTML = '';
    catalogPagination.innerHTML = '';

    catalogMessage.textContent =
      'Something went wrong while searching movies.';

    catalogMessage.hidden = false;
  } finally {
    hideLoader();
  }
}

// =========================
// SEARCH INPUT
// =========================

searchInput.addEventListener(
  'input',
  updateClearButton
);

// =========================
// CLEAR BUTTON
// =========================

clearButton.addEventListener(
  'click',
  () => {
    searchInput.value = '';

    clearButton.classList.add(
      'is-hidden'
    );

    searchInput.focus();
  }
);

// =========================
// SEARCH FORM
// =========================

searchForm.addEventListener(
  'submit',
  async event => {
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
);

// =========================
// MOVIE CARD MODAL
// =========================

catalogList.addEventListener(
  'click',
  event => {
    const card = event.target.closest(
      '.catalog-card'
    );

    if (!card) {
      return;
    }

    const movieId = Number(
      card.dataset.id
    );

    openMovieModal(movieId);
  }
);

// =========================
// HERO DETAILS MODAL
// =========================

heroDetailsButton.addEventListener(
  'click',
  () => {
    if (!heroMovieId) {
      return;
    }

    openMovieModal(heroMovieId);
  }
);

// =========================
// PAGINATION CLICK
// =========================

catalogPagination.addEventListener(
  'click',
  async event => {
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
);

// =========================
// START
// =========================

async function initCatalog() {
  createYearOptions();
  updateClearButton();

  try {
    genres = await getGenres();
  } catch (error) {
    genres = [];
  }

  await loadTrendingMovies();
}

initCatalog();