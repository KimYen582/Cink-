import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook to get show data by ID.
 * Eliminates duplicate getShow() logic in MovieDetails and SeatLayout.
 *
 * @param {string} id - Show/movie ID from URL params
 * @returns {{ show: Object|null, loading: boolean, error: string|null }}
 */
const useShow = (id) => {
  const { getShowWithDateTime, loading: appLoading } = useAppContext();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appLoading) return;

    try {
      const data = getShowWithDateTime(id);
      if (data) {
        setShow(data);
        setError(null);
      } else {
        setError('Show not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load show');
    } finally {
      setLoading(false);
    }
  }, [id, appLoading, getShowWithDateTime]);

  return { show, loading: loading || appLoading, error };
};

export default useShow;
