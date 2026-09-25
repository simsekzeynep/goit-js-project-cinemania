import { getGenres } from './tmdb-api.js';
import { getLibrary } from './library-service.js';

const genreSelect = document.querySelector('#genreSelect');
const genreTitle = document.querySelector('.custom-select__title');
const genreOptions = document.querySelector('.custom-select__options');
const genreTrigger = document.querySelector('.custom-select__trigger');
const libraryList = document.querySelector('#libraryMoviesList');
let selectedGenreId = null;

async function loadGenres() {
    const genres = await getGenres();
    const optionsMarkup = genres.map(genre => {
        return `<li data-value="${genre.id}">${genre.name}</li>`;
    });
    const optionsHtml = optionsMarkup.join('');
    genreOptions.innerHTML = optionsHtml;
}
async function initLibrary() {
      await loadGenres();
}
initLibrary();

genreTrigger.addEventListener('click', () => {
  genreSelect.classList.toggle('is-open');
});
genreOptions.addEventListener('click', event => {
    if (event.target.matches('li')) {
        selectedGenreId = event.target.dataset.value;
        genreTitle.textContent = event.target.textContent;
        genreSelect.classList.remove('is-open');
}
});
