import { getMovieDetails } from './tmdb-api.js';
import { showLoader, hideLoader } from './loader.js';

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

let currentMovie = null;

// Dinleyiciler modul yuklenirken bir kez baglaniyor, modal her acildiginda
// degil. Boylece tekrar tekrar acilip kapandiginda listener birikmiyor.
if (modal) {
  closeBtn.addEventListener('click', () => modal.close());

  modal.addEventListener('click', event => {
    if (event.target === modal) modal.close();
  });

  libraryBtn.addEventListener('click', () => {
    // TASK-21 — Zeynep'in ekle/cikar fonksiyonu buraya gelecek.
    updateLibraryButton(currentMovie);
  });
}

// Film detay modal'ini acar. Kart tiklamalarindan ve hero'daki
// "More details" dugmesinden cagrilir.
export async function openMovieModal(movieId) {
  showLoader();

  try {
    const movie = await getMovieDetails(movieId);
    fillModal(movie);
    modal.showModal();
  } catch (error) {
    console.error('Film detaylari alinamadi:', error);
  } finally {
    hideLoader();
  }
}

function fillModal(movie) {
  currentMovie = movie;

  if (movie.poster_path) {
    poster.src = `${IMAGE_BASE}${movie.poster_path}`;
    poster.hidden = false;
  } else {
    poster.hidden = true;
  }
  poster.alt = movie.title;

  title.textContent = movie.title;
  vote.textContent = movie.vote_average.toFixed(1);
  votes.textContent = movie.vote_count;
  popularity.textContent = movie.popularity.toFixed(1);
  genre.textContent = movie.genres.map(item => item.name).join(', ');
  overview.textContent = movie.overview;

  updateLibraryButton(movie);
}

// TASK-21 — gecici yer tutucu. Zeynep'in TASK-20 fonksiyonu gelince
// sadece bu fonksiyonun ici degisecek.
function isInLibrary(movieId) {
  return false;
}

function updateLibraryButton(movie) {
  if (!movie) return;

  libraryBtn.textContent = isInLibrary(movie.id)
    ? 'Remove from my library'
    : 'Add to my library';
}
