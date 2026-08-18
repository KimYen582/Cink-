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
      createdAt: booking.createdAt,
    }));

    res.json({ success: true, bookings: formattedBookings });
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

export default router;
