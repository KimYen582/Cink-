const FAVORITES_KEY = 'cink_favorite_movies';

const readFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getFavorites = () => readFavorites();

export const isFavorite = (id) => readFavorites().some((movie) => movie._id === id);

export const toggleFavorite = (movie) => {
  const favorites = readFavorites();
  const exists = favorites.some((item) => item._id === movie._id);
  const nextFavorites = exists
    ? favorites.filter((item) => item._id !== movie._id)
    : [movie, ...favorites];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  window.dispatchEvent(new Event('favorites-updated'));
  return !exists;
};
