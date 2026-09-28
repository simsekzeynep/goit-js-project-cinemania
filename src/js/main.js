import { showLoader, hideLoader } from './loader.js';
import { openMovieModal } from './movieModal.js';
import { createMovieCardMarkup } from './movie-card.js';
import { getWeeklyTrends, getGenres } from './tmdb-api.js';
import '../css/movie-card.css';
import './hero.js';
import './upcoming.js';

// Aktif sayfa
function setActiveNavigation() {
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = new URL(link.href).pathname.split('/').pop();

    if (linkPage === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

setActiveNavigation();

// Tema
const themeButton = document.querySelector('.theme-toggle');

function applyTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-theme', isLight);
  themeButton?.setAttribute('aria-pressed', String(isLight));
}

let savedTheme = 'dark';

try {
  savedTheme = localStorage.getItem('cinemania-theme') || 'dark';
} catch {
  savedTheme = 'dark';
}

applyTheme(savedTheme);

themeButton?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-theme')
    ? 'dark'
    : 'light';

  applyTheme(nextTheme);

  try {
    localStorage.setItem('cinemania-theme', nextTheme);
  } catch {
    // Kayıt yapılamasa da seçilen tema açık sayfada uygulanır.
  }
});

// Mobil menü
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const closeButton = document.querySelector('.menu-close');

if (menuButton && mobileMenu && closeButton) {
  let previousOverflow = '';

  function openMenu() {
    if (!mobileMenu.hidden) return;

    previousOverflow = document.body.style.overflow;
    mobileMenu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (mobileMenu.hidden) return;

    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = previousOverflow;

    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', openMenu);
  closeButton.addEventListener('click', () => closeMenu());

  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('click', event => {
    if (
      !mobileMenu.hidden &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (mobileMenu.hidden) return;

    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key === 'Tab') {
      const items = Array.from(
        mobileMenu.querySelectorAll('button:not(:disabled), a[href]')
      ).filter(item => item.getClientRects().length > 0);

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const desktopScreen = window.matchMedia('(min-width: 768px)');

  desktopScreen.addEventListener('change', event => {
    if (event.matches) closeMenu(false);
  });
}

// Film detay modalı
const weeklyList = document.querySelector('#weeklyList');
let isMovieModalOpening = false;
let detailsStatus = null;

if (weeklyList) {
  detailsStatus = document.createElement('p');
  detailsStatus.setAttribute('role', 'status');
  detailsStatus.hidden = true;
  weeklyList.after(detailsStatus);

  weeklyList.addEventListener('click', event => {
    const card = event.target.closest('.movie-card[data-id]');

    if (!card || !weeklyList.contains(card)) return;

    showMovieDetails(card.dataset.id);
  });

  weeklyList.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const card = event.target.closest('.movie-card[data-id]');

    if (!card || !weeklyList.contains(card)) return;

    event.preventDefault();

    if (!event.repeat) {
      showMovieDetails(card.dataset.id);
    }
  });
}

async function showMovieDetails(movieId) {
  if (isMovieModalOpening) return;

  isMovieModalOpening = true;

  if (detailsStatus) {
    detailsStatus.textContent = '';
    detailsStatus.hidden = true;
  }

  try {
    await openMovieModal(movieId);
  } catch {
    if (detailsStatus) {
      detailsStatus.textContent =
        'Movie details could not be opened. Please try again.';
      detailsStatus.hidden = false;
    }
  } finally {
    isMovieModalOpening = false;
  }
}

// Haftanın trend filmleri
async function loadWeeklyTrends() {
  if (!weeklyList) return;

  function showMessage(message) {
    const item = document.createElement('li');
    item.textContent = message;
    weeklyList.replaceChildren(item);
  }

  showMessage('Loading movies…');
  showLoader();

  try {
    const [movies, genres] = await Promise.all([
      getWeeklyTrends(),
      getGenres(),
    ]);

    const genreMap = new Map(
      genres.map(genre => [genre.id, genre])
    );

    const weeklyMovies = movies.slice(0, 3);

    if (weeklyMovies.length === 0) {
      showMessage('No trending movies found.');
      return;
    }

    const markup = weeklyMovies
      .map(movie => {
        const movieGenres = (movie.genre_ids || [])
          .map(id => genreMap.get(id))
          .filter(Boolean);

        return createMovieCardMarkup({
          ...movie,
          genres: movieGenres,
        });
      })
      .join('');

    weeklyList.innerHTML = markup;
  } catch {
    showMessage('Movies could not be loaded. Please try again later.');
  } finally {
    hideLoader();
  }
}

loadWeeklyTrends();