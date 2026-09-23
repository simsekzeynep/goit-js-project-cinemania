import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Film türlerini getirir
export async function getGenres() {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
      language: 'en',
    },
  });

  return response.data.genres;
}

// Haftanın trend filmlerini getirir
export async function getTrendingMovies(page = 1) {
  const response = await axios.get(
    `${BASE_URL}/trending/movie/week`,
    {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    }
  );

  return response.data;
}

// Anahtar kelime ve yıla göre film arar
export async function searchMovies(query, year = '', page = 1) {
  const params = {
    api_key: API_KEY,
    query,
    page,
    language: 'en-US',
    include_adult: false,
  };

  if (year) {
   params.primary_release_year = year;
  }

  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params,
  });

  return response.data;
}