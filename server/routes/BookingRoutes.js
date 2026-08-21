import express from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Session from '../models/Session.js';

const router = express.Router();

const ensureUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    }

    const session = await Session.findOne({ token });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }

    req.userId = session.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Auth error' });
  }
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
      .populate({ path: 'show', populate: { path: 'movie' } })
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

    // Use atomic update to prevent double booking concurrency issues
    const query = { _id: showId };
    const updateQuery = { $set: {} };

    for (const seat of seats) {
      // Ensure seat does not exist in the Map yet
      query[`occupiedSeats.${seat}`] = { $exists: false };
      updateQuery.$set[`occupiedSeats.${seat}`] = req.userId;
    }

    // This will ONLY succeed if ALL requested seats are available (not exists)
    const updatedShow = await Show.findOneAndUpdate(query, updateQuery, { new: true });

    if (!updatedShow) {
      res.status(400);
      throw new Error('One or more selected seats are already booked by someone else. Please choose different seats.');
    }

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

    let createdBooking;
    try {
      createdBooking = await booking.save();
    } catch (error) {
      // Rollback seats if booking fails to save
      const rollbackQuery = { $unset: {} };
      for (const seat of seats) {
        rollbackQuery.$unset[`occupiedSeats.${seat}`] = 1;
      }
      await Show.findByIdAndUpdate(showId, rollbackQuery);
      throw error;
    }

    res.status(201).json({
      success: true,
      booking: createdBooking,
    });
  })
);

export default router;
