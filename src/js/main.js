import './hero.js';
import './upcoming.js';
import { getWeeklyTrends, getGenres } from './tmdb-api.js';
// Tema
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = themeButton?.querySelector('span');

function applyTheme(theme) {
  const isLight = theme === 'light';

  document.body.classList.toggle('light-theme', isLight);
  themeButton?.setAttribute('aria-pressed', String(isLight));

  if (themeIcon) {
    themeIcon.textContent = isLight ? '☾' : '☀';
  }
}

let savedTheme = 'dark';

try {
  savedTheme = localStorage.getItem('cinemania-theme') || 'dark';
} catch (error) {
  console.warn('Tema tercihi okunamadı.', error);
}

applyTheme(savedTheme);

themeButton?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-theme')
    ? 'dark'
    : 'light';

  applyTheme(nextTheme);

  try {
    localStorage.setItem('cinemania-theme', nextTheme);
  } catch (error) {
    console.warn('Tema tercihi kaydedilemedi.', error);
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

    // Klavye odağını açık menünün içinde tut.
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

// Haftanın popüler filmleri
const weeklyList = document.querySelector('#weeklyList');

async function loadWeeklyTrends() {
  if (!weeklyList) return;

  function showMessage(message) {
    const item = document.createElement('li');
    item.textContent = message;
    weeklyList.replaceChildren(item);
  }

  showMessage('Loading movies…');

  try {
    const [movies, genres] = await Promise.all([
      getWeeklyTrends(),
      getGenres(),
    ]);

    const genreNames = new Map(
      genres.map(genre => [genre.id, genre.name])
    );

    const cards = movies.slice(0, 3).map(movie => {
      const card = document.createElement('li');
      card.className = 'weekly-card';
      card.dataset.movieId = movie.id;

      if (movie.poster_path) {
        const poster = document.createElement('img');
        poster.className = 'weekly-card-poster';
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.alt = movie.title;
        poster.loading = 'lazy';
        card.append(poster);
      }

      const info = document.createElement('div');
      info.className = 'weekly-card-info';

      const title = document.createElement('h3');
      title.textContent = movie.title;

      const details = document.createElement('p');
      const names = (movie.genre_ids || [])
        .map(id => genreNames.get(id))
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');

      const year = movie.release_date?.slice(0, 4);
      details.textContent = [names, year]
        .filter(Boolean)
        .join(' | ');

      const rating = document.createElement('p');
      rating.className = 'weekly-card-rating';
      rating.textContent =
        `★ ${Number(movie.vote_average || 0).toFixed(1)} / 10`;

      info.append(title, details, rating);
      card.append(info);

      return card;
    });

    if (cards.length === 0) {
      showMessage('No trending movies found.');
      return;
    }

    weeklyList.replaceChildren(...cards);
  } catch (error) {
    showMessage('Movies could not be loaded. Please try again later.');
    console.warn(
      'Weekly Trends yüklenemedi:',
      error.response?.status || error.message
    );
  }
}

loadWeeklyTrends();