import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkGetToken } from '../services/api';
import { getShows as fetchShowsAPI } from '../services/movieService';
import api from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const currency = import.meta.env.VITE_CURRENCY || '₫';

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Register Clerk getToken with API layer immediately (prevents race condition with children's useEffect)
  setClerkGetToken(getToken);

  // Sync Clerk user to MongoDB when signed in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    
    const syncUser = async () => {
      try {
        const token = await getToken();
        await api.post('/users/sync', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        // Non-blocking: booking still works with Clerk userId
      }
    };
    
    syncUser();
  }, [isLoaded, isSignedIn, getToken]);

  // Fetch shows data
  const fetchShows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchShowsAPI();
      setShows(data);
    } catch {
      setShows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get show by ID (used by MovieDetails & SeatLayout)
  const getShowById = useCallback(
    (id) => {
      const movie = shows.find((s) => s._id === id);
      return movie || null;
    },
    [shows]
  );

  // Get show with dateTime data (used by MovieDetails & SeatLayout)
  const getShowWithDateTime = useCallback(
    (id) => {
      const movie = shows.find((s) => s._id === id);
      if (!movie) return null;
      return {
        movie,
        dateTime: movie.dateTime || {},
      };
    },
    [shows]
  );

  // Load shows on mount
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const value = {
    shows,
    loading,
    currency,
    fetchShows,
    getShowById,
    getShowWithDateTime,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
