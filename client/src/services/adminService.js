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

export const createMovie = async (movieData) => {
  const data = await api.post('/admin/movies', movieData);
  return data.movie;
};

export const updateMovie = async (id, movieData) => {
  const data = await api.patch(`/admin/movies/${id}`, movieData);
  return data.movie;
};

export const deleteMovie = async (id) => api.delete(`/admin/movies/${id}`);

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

export const updateShow = async (id, showData) => {
  const data = await api.patch(`/admin/shows/${id}`, showData);
  return data.show;
};

export const deleteShow = async (id) => api.delete(`/admin/shows/${id}`);

/**
 * Get all bookings (admin)
 */
export const getBookings = async () => {
  const data = await api.get('/admin/bookings');
  return data.bookings || [];
};

export const updateBooking = async (id, bookingData) => {
  const data = await api.patch(`/admin/bookings/${id}`, bookingData);
  return data.booking;
};

export const deleteBooking = async (id) => api.delete(`/admin/bookings/${id}`);

export const getUsers = async () => {
  const data = await api.get('/admin/users');
  return data.users || [];
};

export const updateUser = async (id, userData) => {
  const data = await api.patch(`/admin/users/${id}`, userData);
  return data.user;
};

export const deleteUser = async (id) => api.delete(`/admin/users/${id}`);

/**
 * Get admin profile
 */
export const getAdminProfile = async () => {
  const data = await api.get('/admin/me');
  return data;
};
