import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Session from '../models/Session.js';

const router = express.Router();

const ensureUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    
    const session = await Session.findOne({ token });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
    
    req.userId = session.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Not authorized, please login' });
  }
};

/**
 * @desc    Create Stripe Checkout Session
 * @route   POST /api/payments/checkout
 * @access  Private
 */
router.post(
  '/checkout',
  ensureUser,
  asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400);
      throw new Error('Booking ID is required');
    }

    const booking = await Booking.findById(bookingId).populate('movie');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.user.toString() !== req.userId) {
      res.status(403);
      throw new Error('Not authorized to pay for this booking');
    }

    if (booking.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Booking is already paid');
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_key_here') {
      // MOCK PAYMENT FLOW FOR DEV/TESTING
      return res.json({ 
        success: true, 
        url: `${clientUrl}/my-bookings?payment_success=true&bookingId=${booking._id}` 
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: `Vé xem phim: ${booking.movie?.title || 'Unknown'}`,
                description: `Suất chiếu ID: ${booking.show} | Ghế: ${booking.seats.join(', ')}`,
              },
              unit_amount: booking.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${clientUrl}/my-bookings?payment_success=true&bookingId=${booking._id}`,
        cancel_url: `${clientUrl}/my-bookings?payment_canceled=true`,
        client_reference_id: booking._id.toString(),
      });

      res.json({ success: true, url: session.url });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(500);
      throw new Error('Could not create payment session: ' + error.message);
    }
  })
);

/**
 * @desc    Verify Stripe Payment (called by client after redirect)
 * @route   POST /api/payments/verify
 * @access  Private
 */
router.post(
  '/verify',
  ensureUser,
  asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      res.status(400);
      throw new Error('Booking ID required');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // With Stripe Webhooks configured, this endpoint no longer mutates the database natively.
    // However, if we're mocking Stripe (no STRIPE_SECRET_KEY), we'll simulate the webhook here.
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_key_here') {
      if (booking.paymentStatus !== 'paid') {
        booking.paymentStatus = 'paid';
        await booking.save();
      }
    }

    if (booking.paymentStatus === 'paid') {
      return res.json({ success: true, booking, message: 'Payment verified successfully.' });
    } else {
      return res.json({ success: false, booking, message: 'Payment is pending or failed. Waiting for Stripe webhook...' });
    }
  })
);

export default router;
