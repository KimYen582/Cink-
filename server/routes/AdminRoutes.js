import express from "express";
import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

const router = express.Router();

import Session from "../models/Session.js";

const ensureAdmin = async (req, res, next) => {
  try {
    // 1. Try local dev token first
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const session = await Session.findOne({ token });
      if (session && session.userId) {
        const user = await User.findById(session.userId);
        if (user && user.role === "admin") {
          req.admin = user; // local admin
          return next();
        }
      }
    }

    // 2. Try Clerk auth
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const role = clerkUser.publicMetadata?.role ?? clerkUser.unsafeMetadata?.role ?? clerkUser.privateMetadata?.role ?? "user";

    const isAdmin = String(role).toLowerCase() === "admin";

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.admin = clerkUser;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

const seatObject = (occupiedSeats) => occupiedSeats instanceof Map
  ? Object.fromEntries(occupiedSeats)
  : { ...(occupiedSeats || {}) };

router.get("/me", ensureAdmin, async (req, res) => {
  try {
    const userOrClerk = req.admin;

    // If local user
    if (userOrClerk.email) {
      return res.json({
        success: true,
        admin: userOrClerk,
      });
    }

    // If clerk user
    const adminRecord = await Admin.findOneAndUpdate(
      { clerkUserId: userOrClerk.id },
      {
        _id: userOrClerk.id,
        name: `${userOrClerk.firstName || ""} ${userOrClerk.lastName || ""}`.trim(),
        email: userOrClerk.emailAddresses?.[0]?.emailAddress,
        role: "admin",
        clerkUserId: userOrClerk.id,
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      admin: adminRecord,
      clerkUser: userOrClerk,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/movies", ensureAdmin, async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ release_date: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const movieFields = [
  "title", "overview", "poster_path", "backdrop_path", "release_date",
  "original_language", "tagline", "genres", "casts", "vote_average",
  "vote_count", "runtime",
];

router.post("/movies", ensureAdmin, async (req, res) => {
  try {
    const movieData = Object.fromEntries(movieFields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]));

    const requiredFields = ["title", "overview", "poster_path", "backdrop_path", "release_date", "genres", "casts", "vote_average", "runtime"];
    if (requiredFields.some((field) => movieData[field] === undefined || movieData[field] === "")) {
      return res.status(400).json({ success: false, message: "All required movie fields must be provided" });
    }

    const movie = await Movie.create({ _id: req.body._id || `movie_${Date.now()}`, ...movieData });
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.patch("/movies/:id", ensureAdmin, async (req, res) => {
  try {
    const updates = Object.fromEntries(movieFields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]));
    const movie = await Movie.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/movies/:id", ensureAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    const shows = await Show.find({ movie: req.params.id }).select("_id");
    const showIds = shows.map((show) => show._id);
    const bookings = await Booking.find({ $or: [{ movie: req.params.id }, { show: { $in: showIds } }] }).select("_id");
    const bookingIds = bookings.map((booking) => booking._id);
    await Payment.deleteMany({ booking: { $in: bookingIds } });
    await Booking.deleteMany({ _id: { $in: bookingIds } });
    await Show.deleteMany({ _id: { $in: showIds } });
    await movie.deleteOne();
    res.json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/shows", ensureAdmin, async (req, res) => {
  try {
    const shows = await Show.find({}).populate("movie").sort({ showDateTime: 1 });
    const formattedShows = await Promise.all(shows.map((show) => formatShowResponse(show)));
    res.json({ success: true, shows: formattedShows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/shows", ensureAdmin, async (req, res) => {
  try {
    const { movieId, showDateTime, showPrice, hall = "A", occupiedSeats = {} } = req.body;

    if (!movieId || !showDateTime || !showPrice) {
      return res.status(400).json({ success: false, message: "movieId, showDateTime and showPrice are required" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const newShow = await Show.create({
      _id: `show_${Date.now()}`,
      movie: movieId,
      showDateTime: new Date(showDateTime),
      showPrice: Number(showPrice),
      hall,
      occupiedSeats,
    });

    res.status(201).json({ success: true, show: await formatShowResponse(newShow) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/shows/:id", ensureAdmin, async (req, res) => {
  try {
    const { movieId, showDateTime, showPrice, hall } = req.body;
    const updates = {};
    if (movieId !== undefined) {
      if (!(await Movie.exists({ _id: movieId }))) return res.status(404).json({ success: false, message: "Movie not found" });
      updates.movie = movieId;
    }
    if (showDateTime !== undefined) updates.showDateTime = new Date(showDateTime);
    if (showPrice !== undefined) updates.showPrice = Number(showPrice);
    if (hall !== undefined) updates.hall = hall;
    const show = await Show.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!show) return res.status(404).json({ success: false, message: "Show not found" });
    res.json({ success: true, show: await formatShowResponse(show) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/shows/:id", ensureAdmin, async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: "Show not found" });
    const bookings = await Booking.find({ show: show._id }).select("_id");
    const bookingIds = bookings.map((booking) => booking._id);
    await Payment.deleteMany({ booking: { $in: bookingIds } });
    await Booking.deleteMany({ _id: { $in: bookingIds } });
    await show.deleteOne();
    res.json({ success: true, message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/bookings", ensureAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("user").populate("movie").populate("show").sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      user: booking.user?.name || "Unknown User",
      movie: booking.movie?.title || "Unknown Movie",
      showDateTime: booking.show?.showDateTime || null,
      seats: booking.seats || [],
      amount: booking.amount || 0,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      orderCode: booking.orderCode,
      showId: booking.show?._id,
      userId: booking.user?._id,
      createdAt: booking.createdAt,
    }));

    res.json({ success: true, bookings: formattedBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const releaseBookingSeats = async (booking) => {
  const show = await Show.findById(booking.show);
  if (!show) return;
  const occupiedSeats = seatObject(show.occupiedSeats);
  for (const seat of booking.seats || []) delete occupiedSeats[seat];
  show.occupiedSeats = occupiedSeats;
  await show.save();
};

router.patch("/bookings/:id", ensureAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (status && !["pending", "confirmed", "cancelled", "expired"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid booking status" });
    }
    if (paymentStatus && !["unpaid", "paid", "failed", "refunded"].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status" });
    }
    if (status && !["cancelled", "expired"].includes(status) && ["cancelled", "expired"].includes(booking.status)) {
      return res.status(409).json({ success: false, message: "Cancelled bookings cannot be reopened" });
    }
    const cancelling = status && ["cancelled", "expired"].includes(status) && !["cancelled", "expired"].includes(booking.status);
    if (cancelling) await releaseBookingSeats(booking);
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/bookings/:id", ensureAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    await releaseBookingSeats(booking);
    await booking.deleteOne();
    await Payment.deleteMany({ booking: booking._id });
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/dashboard", ensureAdmin, async (req, res) => {
  try {
    const [totalBookings, totalUser, paidRevenue, shows] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Show.find({}).populate("movie").sort({ showDateTime: 1 }).limit(6),
    ]);

    const totalRevenue = paidRevenue[0]?.total || 0;
    const activeShows = await Promise.all(
      shows.map(async (show) => ({
        _id: show._id,
        movie: show.movie,
        showDateTime: show.showDateTime,
        showPrice: show.showPrice,
        occupiedSeats: show.occupiedSeats || {},
      }))
    );

    res.json({
      success: true,
      dashboard: {
        totalBookings,
        totalRevenue,
        activeShows,
        totalUser,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/users", ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/users/:id", ensureAdmin, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.email !== undefined) updates.email = String(req.body.email).trim().toLowerCase();
    if (req.body.image !== undefined) updates.image = req.body.image;
    if (req.body.role !== undefined) {
      if (!["admin", "user"].includes(req.body.role)) return res.status(400).json({ success: false, message: "Invalid role" });
      updates.role = req.body.role;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/users/:id", ensureAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const bookings = await Booking.find({ user: req.params.id }).select("_id");
    const bookingIds = bookings.map((booking) => booking._id);
    await Payment.deleteMany({ booking: { $in: bookingIds } });
    await Booking.deleteMany({ _id: { $in: bookingIds } });
    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
