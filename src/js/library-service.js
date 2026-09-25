const STORAGE_KEY = 'cinemania_my_library';

//Localstorage' da kaydedilmiş filmleri getirir.
export function getLibrary() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
//Bu film kütüphanede var mı? Kontrol eder.
export function isInLibrary(movieId) {
  const library = getLibrary();
  return library.some(movie => Number(movie.id) === Number(movieId));
}
//Filmi library' e ekleme
export function addToLibrary(movie) {
  if (isInLibrary(movie.id)) {
    return;
  }
  const movieToSave = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    genres: movie.genres,
  };
  const library = getLibrary();
  library.push(movieToSave);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}
//Filmi library' den çıkarma
export function removeFromLibrary(movieId) {
  const library = getLibrary();
  const filteredMovies = library.filter(
    movie => Number(movie.id) !== Number(movieId)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMovies));
}
// Filmin Library'deki durumuna göre ekleme veya çıkarma işlemi yapar.
export function toggleLibrary(movie) {
  if (isInLibrary(movie.id)) {
    removeFromLibrary(movie.id);
  } else {
    addToLibrary(movie);
  }
}
