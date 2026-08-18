import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from "./routes/UserRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";

import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const port = process.env.PORT || 3000;

// Kết nối MongoDB local
await connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Auth routes BEFORE clerkMiddleware
console.log('Mounting auth routes...');
app.use("/api/auth", authRoutes);

// Clerk middleware (dùng cho routes khác)
app.use(clerkMiddleware());
console.log('Mounting user routes...');
app.use("/api/users", userRoutes);
console.log('Mounting admin routes...');
app.use("/api/admin", adminRoutes);

// Test route
app.post("/test", (req, res) => {
  console.log('Test route called');
  res.json({ success: true, message: "Test OK" });
});

// Kiểm tra Clerk
console.log(
  'CLERK KEY:',
  process.env.CLERK_PUBLISHABLE_KEY?.slice(0, 12),
  'length:',
  process.env.CLERK_PUBLISHABLE_KEY?.length
);

// Test server
app.get('/', (req, res) => {
  res.send('Server is Live!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});