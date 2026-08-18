import api from './api';
import { dummyBookingData } from '../assets/assets';

/**
 * Get current user's bookings
 * Falls back to dummy data if API unavailable
 */
export const getMyBookings = async () => {
  try {
    const data = await api.get('/users/bookings');
    return data.bookings || [];
  } catch {
    // Fallback to dummy data
    return dummyBookingData;
  }
};

/**
 * Create a new booking
 * @param {Object} bookingData - { showId, seats, date, time }
 */
export const createBooking = async (bookingData) => {
  const data = await api.post('/users/bookings', bookingData);
  return data;
};
