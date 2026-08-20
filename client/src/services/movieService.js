import api from './api';

/**
 * Get all shows with movie data (for public pages)
 */
export const getShows = async () => {
  const data = await api.get('/shows');
  if (!data.shows) return [];

  const movies = new Map();
  data.shows.forEach((show) => {
    if (!show.movie?._id || !show.showDateTime) return;
    const date = new Date(show.showDateTime);
    const dateKey = date.toISOString().slice(0, 10);
    const time = date.toISOString().slice(11, 16);
    const existingMovie = movies.get(show.movie._id);

    if (existingMovie) {
      const times = existingMovie.dateTime[dateKey] || [];
      if (!times.includes(time)) {
        existingMovie.dateTime[dateKey] = [...times, time].sort();
        existingMovie.showIds[dateKey][time] = show._id;
      }
      return;
    }

    movies.set(show.movie._id, {
      ...show.movie,
      _id: show._id,
      movieId: show.movie._id,
      showDateTime: show.showDateTime,
      showPrice: show.showPrice,
      hall: show.hall,
      occupiedSeats: show.occupiedSeats || {},
      dateTime: { [dateKey]: [time] },
      showIds: { [dateKey]: { [time]: show._id } },
    });
  });

  return Array.from(movies.values());
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
