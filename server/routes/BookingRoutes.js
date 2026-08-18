import express from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { getAuth } from '@clerk/express';

const router = express.Router();

// Middleware to ensure user is logged in
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
 * @desc    Get logged in user bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
router.get(
  '/my-bookings',
  ensureUser,
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.userId })
      .populate('movie')
      .populate('show')
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      movie: booking.movie?.title || "Unknown Movie",
      showDateTime: booking.show?.showDateTime || null,
      seats: booking.seats || [],
      amount: booking.amount || 0,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      orderCode: booking.orderCode,
      createdAt: booking.createdAt,
      show: booking.show,
      bookedSeats: booking.seats,
      isPaid: booking.paymentStatus === 'paid',
    }));

    res.json({ success: true, bookings: formattedBookings });
  })
);

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
router.post(
  '/',
  ensureUser,
  asyncHandler(async (req, res) => {
    const { showId, seats, amount, paymentMethod } = req.body;

    if (!showId || !seats || seats.length === 0) {
      res.status(400);
      throw new Error('No seats provided or show missing');
    }

    const show = await Show.findById(showId);
    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }

    // Check if seats are already booked
    const showOccupiedSeats = show.occupiedSeats || {};
    // Let's assume occupiedSeats is { "A1": "userId", "B2": "userId" }
    // Or it might be an array depending on previous implementation. 
    // Wait, in AdminRoutes, it's an object. 

    for (const seat of seats) {
      if (showOccupiedSeats[seat]) {
        res.status(400);
        throw new Error(`Seat ${seat} is already booked`);
      }
    }

    // Mark seats as occupied
    for (const seat of seats) {
      showOccupiedSeats[seat] = req.userId;
    }
    show.occupiedSeats = showOccupiedSeats;
    await show.save();

    // Create booking
    const orderCode = `CIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = new Booking({
      _id: `booking_${Date.now()}`,
      user: req.userId,
      movie: show.movie,
      show: showId,
      seats,
      amount,
      paymentMethod: paymentMethod || 'credit_card',
      orderCode,
    });

    const createdBooking = await booking.save();

    res.status(201).json({
      success: true,
      booking: createdBooking,
    });
  })
);

export default router;
