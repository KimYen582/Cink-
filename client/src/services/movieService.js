import api from './api';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';

/**
 * Get all shows with movie data (for public pages)
 * Falls back to dummy data if API unavailable
 */
export const getShows = async () => {
  try {
    const data = await api.get('/admin/shows');
    return data.shows || [];
  } catch {
    // Fallback to dummy data when server is not running
    return dummyShowsData;
  }
};

/**
 * Get show by ID with movie data and dateTime info
 * @param {string} id - Show/movie ID
 * @returns {{ movie, dateTime }} show data with schedule
 */
export const getShowById = async (id) => {
  try {
    const data = await api.get(`/admin/shows`);
    const shows = data.shows || [];
    const show = shows.find((s) => s._id === id || s.movie?._id === id);
    if (show) {
      return {
        movie: show.movie || show,
        dateTime: show.dateTime || {},
      };
    }
    throw new Error('Show not found');
  } catch {
    // Fallback to dummy data
    const movie = dummyShowsData.find((s) => s._id === id);
    if (movie) {
      return {
        movie,
        dateTime: dummyDateTimeData[id] || {},
      };
    }
    return null;
  }
};
