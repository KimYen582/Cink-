import api from './api';

/**
 * Get current user's bookings
 */
export const getMyBookings = async () => {
  const data = await api.get('/bookings/my-bookings');
  return data.bookings || [];
};

/**
 * Create a new booking
 * @param {Object} bookingData - { showId, seats, amount, paymentMethod }
 */
export const createBooking = async (bookingData) => {
  const data = await api.post('/bookings', bookingData);
  return data;
};

/**
 * Process mock checkout
 * @param {string} bookingId
 */
export const checkoutBooking = async (bookingId) => {
  const data = await api.post('/payments/checkout', { bookingId });
  if (data.success && data.url) {
    window.location.href = data.url;
  }
  return data;
};

/**
 * Verify payment after Stripe redirect
 * @param {string} bookingId
 */
export const verifyPayment = async (bookingId) => {
  const data = await api.post('/payments/verify', { bookingId });
  return data;
};
