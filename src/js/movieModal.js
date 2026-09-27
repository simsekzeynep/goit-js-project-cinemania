import { getMovieDetails } from './tmdb-api.js';
import { showLoader, hideLoader } from './loader.js';
import {
  isInLibrary,
  toggleLibrary,
} from './library-service.js';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const modal = document.querySelector('#movie-modal');
const closeBtn = document.querySelector('.movie-modal__close');
const poster = document.querySelector('#movie-poster');
const title = document.querySelector('#movie-title');
const vote = document.querySelector('#movie-vote');
const votes = document.querySelector('#movie-votes');
const popularity = document.querySelector('#movie-popularity');
const genre = document.querySelector('#movie-genre');
const overview = document.querySelector('#movie-overview');
const libraryBtn = document.querySelector('#library-btn');

const status = document.createElement('p');
status.className = 'movie-modal-status';
status.setAttribute('role', 'status');
status.hidden = true;

let currentMovie = null;
let isLoading = false;

function showStatus(message = '') {
  status.textContent = message;
  status.hidden = !message;
}

if (modal && libraryBtn) {
  libraryBtn.after(status);

  closeBtn?.addEventListener('click', () => modal.close());

  modal.addEventListener('click', event => {
    const bounds = modal.getBoundingClientRect();
    const isOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (event.target === modal && isOutside) {
      modal.close();
    }
  });

  libraryBtn.addEventListener('click', () => {
    if (!currentMovie) return;

    try {
      toggleLibrary(currentMovie);
      updateLibraryButton(currentMovie);

      showStatus(
        isInLibrary(currentMovie.id)
          ? 'Movie added to your library.'
          : 'Movie removed from your library.'
      );
    } catch {
      showStatus(
        'Could not update your library. Please try again.'
      );
    }
  });
}

export async function openMovieModal(movieId) {
  if (!modal || !libraryBtn || isLoading || modal.open) return;

  isLoading = true;
  showLoader();

  try {
    const movie = await getMovieDetails(movieId);
    fillModal(movie);
    modal.showModal();
  } catch {
    currentMovie = null;
    title.textContent = 'Movie details unavailable';
    poster.hidden = true;
    poster.removeAttribute('src');
    vote.textContent = '—';
    votes.textContent = '—';
    popularity.textContent = '—';
    genre.textContent = '—';
    overview.textContent =
      'Movie details could not be loaded. Please try again later.';
    libraryBtn.hidden = true;
    showStatus();

    if (!modal.open) {
      modal.showModal();
    }
  } finally {
    isLoading = false;
    hideLoader();
  }
}

function fillModal(movie) {
  currentMovie = movie;
  showStatus();

  if (movie.poster_path) {
    poster.src = `${IMAGE_BASE}${movie.poster_path}`;
    poster.hidden = false;
  } else {
    poster.removeAttribute('src');
    poster.hidden = true;
  }

  poster.alt = movie.title || 'Movie poster';
  title.textContent = movie.title || 'Untitled movie';
  vote.textContent = Number(movie.vote_average || 0).toFixed(1);
  votes.textContent = movie.vote_count ?? 0;
  popularity.textContent = Number(movie.popularity || 0).toFixed(1);
  genre.textContent =
    (movie.genres || []).map(item => item.name).join(', ') ||
    'Unknown';
  overview.textContent =
    movie.overview || 'No description available.';

  libraryBtn.hidden = false;
  libraryBtn.disabled = false;

  try {
    updateLibraryButton(movie);
  } catch {
    libraryBtn.textContent = 'Library unavailable';
    libraryBtn.disabled = true;
    libraryBtn.removeAttribute('aria-pressed');
    showStatus('Your library could not be read.');
  }
}

function updateLibraryButton(movie) {
  if (!movie) return;

  const saved = isInLibrary(movie.id);

  libraryBtn.textContent = saved
    ? 'Remove from my library'
    : 'Add to my library';

  libraryBtn.setAttribute('aria-pressed', String(saved));
}