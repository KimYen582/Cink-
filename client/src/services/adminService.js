import api from './api';

/**
 * Get admin dashboard data
 */
export const getDashboard = async () => {
  const data = await api.get('/admin/dashboard');
  return data.dashboard;
};

/**
 * Get all movies (admin)
 */
export const getMovies = async () => {
  const data = await api.get('/admin/movies');
  return data.movies || [];
};

/**
 * Get all shows (admin)
 */
export const getShows = async () => {
  const data = await api.get('/admin/shows');
  return data.shows || [];
};

/**
 * Create a new show
 * @param {Object} showData - { movieId, showDateTime, showPrice, hall }
 */
export const createShow = async (showData) => {
  const data = await api.post('/admin/shows', showData);
  return data.show;
};

/**
 * Get all bookings (admin)
 */
export const getBookings = async () => {
  const data = await api.get('/admin/bookings');
  return data.bookings || [];
};

/**
 * Get admin profile
 */
export const getAdminProfile = async () => {
  const data = await api.get('/admin/me');
  return data;
};
