import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Film türlerini getirir.
export async function getGenres() {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });

  return response.data.genres;
}

// Haftanın popüler filmlerini getirir.
export async function getWeeklyTrends() {
  const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });

  return response.data.results;
}

// İçinde bulunduğumuz ayın filmlerini getirir.
export async function getUpcomingThisMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
      include_adult: false,
      include_video: false,
      sort_by: 'popularity.desc',
      'primary_release_date.gte': `${year}-${month}-01`,
      'primary_release_date.lte': `${year}-${month}-${lastDay}`,
    },
  });

  return response.data.results;
}
// Günün trend filmlerini getirir.
export async function getDailyTrends() {
  const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });

  return response.data.results;
}