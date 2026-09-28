import { getTrendingMovies, searchMovies, getGenres } from './tmdb-api.js';
import { openMovieModal } from './movieModal.js';
import { showLoader, hideLoader } from './loader.js';
import { createMovieCardMarkup } from './movie-card.js';

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
const catalogSection = document.querySelector('.catalog-section');

// =========================
// STATE
// =========================

let genres = [];
let currentPage = 1;
let currentQuery = '';
let currentYear = '';

// =========================
// YEAR SELECT
// =========================

function createYearOptions() {
  const currentYearValue = new Date().getFullYear();

  for (let year = currentYearValue; year >= FIRST_MOVIE_YEAR; year -= 1) {
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

  clearButton.classList.toggle('is-hidden', isInputEmpty);
}

function handleClearSearch() {
  searchInput.value = '';
  clearButton.classList.add('is-hidden');
  searchInput.focus();
}

// =========================
// MOVIE HELPERS
// =========================

function prepareMovieForCard(movie) {
  if (Array.isArray(movie.genres)) {
    return movie;
  }

  const movieGenres = (movie.genre_ids || [])
    .map(id => genres.find(genre => genre.id === id))
    .filter(Boolean);

  return {
    ...movie,
    genres: movieGenres,
  };
}

// =========================
// MESSAGES
// =========================

function showCatalogMessage(message) {
  catalogList.innerHTML = '';
  catalogPagination.innerHTML = '';

  catalogMessage.classList.remove('catalog-message--empty');
  catalogMessage.textContent = message;
  catalogMessage.hidden = false;
}

function showNoResultsMessage() {
  catalogList.innerHTML = '';
  catalogPagination.innerHTML = '';

  catalogMessage.innerHTML = `
    <span class="catalog-message__title">
      OOPS
    </span>

    <span class="catalog-message__subtitle">
      We are very sorry!
    </span>

    <span class="catalog-message__text">
      We don’t have any results matching your search.
    </span>
  `;

  catalogMessage.classList.add('catalog-message--empty');
  catalogMessage.hidden = false;
}

// =========================
// RENDER MOVIES
// =========================

function renderMovies(movies) {
  if (!movies?.length) {
    showNoResultsMessage();
    return;
  }

  catalogMessage.hidden = true;

  catalogList.innerHTML = movies
    .map(movie => {
      const preparedMovie = prepareMovieForCard(movie);

      return createMovieCardMarkup(preparedMovie);
    })
    .join('');
}

// =========================
// PAGINATION
// =========================

function createPageButton(page) {
  const button = document.createElement('button');

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

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
    catalogPagination.append(createPageButton(pageNumber));
  }
}

// =========================
// API
// =========================

async function fetchAndRenderMovies(request, errorMessage) {
  showLoader();

  try {
    const data = await request();

    renderMovies(data.results);
    renderPagination(data.page, data.total_pages);
  } catch {
    showCatalogMessage(errorMessage);
  } finally {
    hideLoader();
  }
}

function loadTrendingMovies(page = 1) {
  return fetchAndRenderMovies(
    () => getTrendingMovies(page),
    'Something went wrong while loading movies.'
  );
}

function loadSearchResults(query, year, page = 1) {
  return fetchAndRenderMovies(
    () => searchMovies(query, year, page),
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

  const movieId = Number(card.dataset.id);

  openMovieModal(movieId);
}

function handleCatalogClick(event) {
  const card = event.target.closest('.movie-card');

  openCardModal(card);
}

function handleCatalogKeydown(event) {
  const card = event.target.closest('.movie-card');

  if (!card) {
    return;
  }

  const isActivationKey = event.key === 'Enter' || event.key === ' ';

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

  currentQuery = searchInput.value.trim();
  currentYear = yearSelect.value;
  currentPage = 1;

  if (!currentQuery && currentYear) {
    showCatalogMessage('Please enter a movie name to search by year.');
    return;
  }

  if (!currentQuery) {
    await loadTrendingMovies(1);
    return;
  }

  await loadSearchResults(currentQuery, currentYear, currentPage);
}

// =========================
// PAGINATION
// =========================

async function handlePaginationClick(event) {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  currentPage = Number(button.dataset.page);

  if (currentQuery) {
    await loadSearchResults(currentQuery, currentYear, currentPage);
  } else {
    await loadTrendingMovies(currentPage);
  }

  catalogSection?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// =========================
// EVENTS
// =========================

function addEventListeners() {
  searchInput.addEventListener('input', updateClearButton);
  clearButton.addEventListener('click', handleClearSearch);
  searchForm.addEventListener('submit', handleSearchSubmit);
  catalogList.addEventListener('click', handleCatalogClick);
  catalogList.addEventListener('keydown', handleCatalogKeydown);
  catalogPagination.addEventListener('click', handlePaginationClick);
}

// =========================
// GENRES
// =========================

async function loadGenres() {
  try {
    genres = await getGenres();
  } catch {
    genres = [];
  }
}

// =========================
// INIT
// =========================

async function initCatalog() {
  createYearOptions();
  updateClearButton();
  addEventListeners();

  await loadGenres();
  await loadTrendingMovies();
}

initCatalog();