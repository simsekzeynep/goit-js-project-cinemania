import { getGenres } from './tmdb-api.js';
import { getLibrary } from './library-service.js';
import { openMovieModal } from './movie-modal.js';
import { createMovieCardMarkup } from './movie-card.js';

const ITEMS_PER_PAGE = 9;

const genreSelect = document.querySelector('#genreSelect');
const genreTitle = document.querySelector('.custom-select__title');
const genreOptions = document.querySelector('.custom-select__options');
const genreTrigger = document.querySelector('.custom-select__trigger');

const libraryFilter = document.querySelector('.library-filter');
const libraryList = document.querySelector('#libraryMoviesList');
const emptyState = document.querySelector('.library-empty');
const loadMoreBtn = document.querySelector('#loadMoreBtn');
const movieModal = document.querySelector('#movie-modal');

let selectedGenreId = '';
let displayedMoviesCount = ITEMS_PER_PAGE;

function updateGenreSelection() {
  const options = genreOptions.querySelectorAll('li[data-value]');

  const selectedOption = Array.from(options).find(
    option => option.dataset.value === selectedGenreId
  );

  options.forEach(option => {
    const isSelected = option === selectedOption;

    option.classList.toggle('is-selected', isSelected);
    option.setAttribute('aria-selected', String(isSelected));
  });

  genreTitle.textContent = selectedOption?.textContent.trim() || 'Genre';
}

function renderGenreOptions(genres) {
  genreOptions.innerHTML = `
    <li
      data-value=""
      role="option"
      tabindex="0"
      aria-selected="true"
    >
      All Genres
    </li>

    ${genres
      .map(
        genre => `
          <li
            data-value="${genre.id}"
            role="option"
            tabindex="0"
            aria-selected="false"
          >
            ${genre.name}
          </li>
        `
      )
      .join('')}
  `;

  updateGenreSelection();
}

function getFilteredMovies(movies) {
  if (!selectedGenreId) {
    return movies;
  }

  return movies.filter(movie =>
    movie.genres?.some(genre => String(genre.id) === String(selectedGenreId))
  );
}

function showEmptyLibrary() {
  libraryFilter.classList.add('is-hidden');
  libraryList.classList.add('is-hidden');
  loadMoreBtn.classList.add('is-hidden');
  emptyState.classList.remove('is-hidden');
}

function showLibraryContent() {
  libraryFilter.classList.remove('is-hidden');
  libraryList.classList.remove('is-hidden');
  emptyState.classList.add('is-hidden');
}

function showNoResults() {
  libraryList.innerHTML = `
    <li class="library-no-results">
      No movies found for this genre.
    </li>
  `;

  loadMoreBtn.classList.add('is-hidden');
}

function updateLoadMoreButton(totalMovies) {
  const hasMoreMovies = displayedMoviesCount < totalMovies;

  loadMoreBtn.classList.toggle('is-hidden', !hasMoreMovies);
}

function renderLibrary() {
  const libraryMovies = getLibrary();

  if (libraryMovies.length === 0) {
    showEmptyLibrary();
    return;
  }

  showLibraryContent();

  const filteredMovies = getFilteredMovies(libraryMovies);

  if (filteredMovies.length === 0) {
    showNoResults();
    return;
  }

  const visibleMovies = filteredMovies.slice(0, displayedMoviesCount);

  libraryList.innerHTML = visibleMovies.map(createMovieCardMarkup).join('');

  updateLoadMoreButton(filteredMovies.length);
}

function openGenreSelect() {
  genreSelect.classList.add('is-open');
  genreTrigger.setAttribute('aria-expanded', 'true');
}

function closeGenreSelect(restoreFocus = false) {
  genreSelect.classList.remove('is-open');
  genreTrigger.setAttribute('aria-expanded', 'false');

  if (restoreFocus) {
    genreTrigger.focus();
  }
}

async function loadGenres() {
  try {
    const genres = await getGenres();

    renderGenreOptions(Array.isArray(genres) ? genres : []);
  } catch {
    renderGenreOptions([]);
  }
}

async function initLibrary() {
  await loadGenres();
  renderLibrary();
}

genreTrigger.addEventListener('click', () => {
  const isOpen = genreSelect.classList.contains('is-open');

  if (isOpen) {
    closeGenreSelect();
    return;
  }

  openGenreSelect();
});

genreOptions.addEventListener('click', event => {
  const selectedOption = event.target.closest('li[data-value]');

  if (!selectedOption) {
    return;
  }

  selectedGenreId = selectedOption.dataset.value || '';
  displayedMoviesCount = ITEMS_PER_PAGE;

  updateGenreSelection();
  closeGenreSelect(true);
  renderLibrary();
});

genreOptions.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const selectedOption = event.target.closest('li[data-value]');

  if (!selectedOption) {
    return;
  }

  event.preventDefault();
  selectedOption.click();
});

document.addEventListener('click', event => {
  if (!genreSelect.contains(event.target)) {
    closeGenreSelect();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && genreSelect.classList.contains('is-open')) {
    closeGenreSelect(true);
  }
});

loadMoreBtn.addEventListener('click', () => {
  displayedMoviesCount += ITEMS_PER_PAGE;
  renderLibrary();
});

libraryList.addEventListener('click', event => {
  const card = event.target.closest('.movie-card');

  if (!card) {
    return;
  }

  openMovieModal(Number(card.dataset.id));
});

libraryList.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const card = event.target.closest('.movie-card');

  if (!card || event.repeat) {
    return;
  }

  event.preventDefault();
  openMovieModal(Number(card.dataset.id));
});

movieModal?.addEventListener('close', renderLibrary);
window.addEventListener('pageshow', renderLibrary);

initLibrary();
