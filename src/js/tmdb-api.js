import axios from 'axios';
// API İstekleri için Temel Sabitler
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

//TMDB API'den film türlerini getirir.
export async function getGenres() {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
      language: 'en',
    },
  });
  return response.data.genres;
}

// Bir filmin detaylı bilgilerini getirir.
export async function getMovieDetails(movieId) {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });

  return response.data;
}

// Bir filmin YouTube fragmanını getirir. Fragman yoksa undefined döner.
export async function getMovieTrailer(movieId) {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });

  return response.data.results.find(
    video => video.site === 'YouTube' && video.type === 'Trailer'
  );
}
