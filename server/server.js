import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import userRoutes from "./routes/UserRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import movieRoutes from "./routes/MovieRoutes.js";
import showRoutes from "./routes/ShowRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import { notFound, errorHandler } from './middlewares/errorHandler.js';

import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const port = process.env.PORT || 3000;

// Kết nối MongoDB local
await connectDB();

// Middleware
app.use(express.json());

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Strict CORS configuration
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Auth routes BEFORE clerkMiddleware
console.log('Mounting auth routes...');
app.use("/api/auth", authRoutes);

// Public routes (No auth required)
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);

// Clerk middleware (dùng cho routes cần auth)
app.use(clerkMiddleware());
console.log('Mounting user routes...');
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
console.log('Mounting admin routes...');
app.use("/api/admin", adminRoutes);

// Test route
app.post("/test", (req, res) => {
  console.log('Test route called');
  res.json({ success: true, message: "Test OK" });
});

// Test server
app.get('/', (req, res) => {
  res.send('Server is Live!');
});

// Error handling middleware (must be at the end)
app.use(notFound);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});