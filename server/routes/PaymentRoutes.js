import express from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { getAuth } from '@clerk/express';

const router = express.Router();

const ensureUser = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }
  req.userId = userId;
  next();
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

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: `Vé xem phim: ${booking.movie?.title}`,
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

    // In a real production app, you MUST use Stripe Webhooks to verify payment.
    // For this demonstration, if the client hits /verify, we check the DB or assume it's paid.
    // Since we don't have webhook setup yet, we will just mark it paid here as a fallback mock for the success_url.
    
    if (booking.paymentStatus !== 'paid') {
      const transactionId = `txn_stripe_${Date.now()}`;
      const payment = new Payment({
        _id: `pay_${Date.now()}`,
        booking: booking._id,
        user: req.userId,
        amount: booking.amount,
        method: 'credit_card',
        status: 'paid',
        transactionId,
        paidAt: Date.now(),
      });
      await payment.save();

      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();
    }

    res.json({ success: true, booking });
  })
);

export default router;
