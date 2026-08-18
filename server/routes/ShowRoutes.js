import express from 'express';
import asyncHandler from 'express-async-handler';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';

const router = express.Router();

/**
 * Format show response helper
 */
const formatShowResponse = async (show) => {
  const movie = typeof show.movie === "string" ? await Movie.findById(show.movie) : show.movie;

  return {
    _id: show._id,
    movie,
    showDateTime: show.showDateTime,
    showPrice: show.showPrice,
    hall: show.hall,
    occupiedSeats: show.occupiedSeats || {},
    createdAt: show.createdAt,
  };
};

/**
 * @desc    Fetch all active shows
 * @route   GET /api/shows
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() } // Only future shows
    })
      .populate('movie')
      .sort({ showDateTime: 1 });
      
    const formattedShows = await Promise.all(shows.map(show => formatShowResponse(show)));

    res.json({
      success: true,
      shows: formattedShows,
    });
  })
);

/**
 * @desc    Fetch single show by ID
 * @route   GET /api/shows/:id
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const show = await Show.findById(req.params.id).populate('movie');

    if (show) {
      const formattedShow = await formatShowResponse(show);
      res.json({ success: true, show: formattedShow });
    } else {
      res.status(404);
      throw new Error('Show not found');
    }
  })
);

export default router;
