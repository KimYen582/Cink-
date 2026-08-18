import api from './api';

/**
 * Get all shows with movie data (for public pages)
 */
export const getShows = async () => {
  const data = await api.get('/shows');
  return data.shows ? data.shows.map(show => ({
    ...show.movie,
    _id: show._id // Keep show._id for navigation routing
  })) : [];
};

/**
 * Get show by ID with movie data and dateTime info
 * @param {string} id - Show ID
 */
export const getShowById = async (id) => {
  const data = await api.get(`/shows/${id}`);
  if (data.success && data.show) {
    return {
      movie: data.show.movie || data.show,
      dateTime: { [data.show.showDateTime]: data.show._id },
    };
  }
  throw new Error('Show not found');
};

/**
 * Submit a movie review
 * @param {string} movieId 
 * @param {Object} reviewData - { rating, comment }
 */
export const submitReview = async (movieId, reviewData) => {
  const data = await api.post(`/movies/${movieId}/reviews`, reviewData);
  return data;
};
