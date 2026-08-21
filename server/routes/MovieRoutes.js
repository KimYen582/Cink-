import express from 'express';
import asyncHandler from 'express-async-handler';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { getAuth } from '@clerk/express';

const router = express.Router();

const ensureUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const session = await Session.findOne({ token });
      if (session?.userId && session.expiresAt > new Date()) {
        req.userId = session.userId;
        return next();
      }
    }
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || 'Not authorized, please login' });
  }
};

/**
 * @desc    Fetch all movies with optional search, filter, and sort
 * @route   GET /api/movies
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { keyword, genre, sort } = req.query;

    // Search query
    const searchQuery = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};

    // Filter by genre (assuming genres is an array of objects or strings, based on TMDB structure)
    // If genres are stored as objects like [{ name: "Action" }, ...], we query by 'genres.name'
    const genreQuery = genre
      ? { 'genres.name': { $regex: genre, $options: 'i' } }
      : {};

    const finalQuery = { ...searchQuery, ...genreQuery };

    // Sort logic
    let sortQuery = { release_date: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortQuery = { release_date: 1 };
    } else if (sort === 'rating_desc') {
      sortQuery = { vote_average: -1 };
    } else if (sort === 'rating_asc') {
      sortQuery = { vote_average: 1 };
    }

    const movies = await Movie.find(finalQuery).sort(sortQuery);

    res.json({
      success: true,
      count: movies.length,
      movies,
    });
  })
);

/**
 * @desc    Fetch single movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      res.json({ success: true, movie });
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  })
);



/**
 * @desc    Create new review
 * @route   POST /api/movies/:id/reviews
 * @access  Private
 */
router.post(
  '/:id/reviews',
  ensureUser,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const movie = await Movie.findById(req.params.id);
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found in DB. Please re-login.');
    }

    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.userId.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this movie');
      }

      const review = {
        name: user.name || 'Anonymous',
        rating: Number(rating),
        comment,
        user: req.userId,
      };

      movie.reviews.push(review);

      // Recalculate average rating
      movie.vote_count = movie.reviews.length;
      movie.vote_average =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      await movie.save();
      res.status(201).json({ success: true, message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  })
);

export default router;
