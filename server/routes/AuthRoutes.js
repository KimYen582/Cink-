import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Session from "../models/Session.js";
import crypto from "crypto";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      _id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    // Create session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Session.create({
      _id: `session_${Date.now()}`,
      userId: user._id,
      token,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login with email + password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Select password explicitly since it's excluded by default
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: "This account has no password set. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await Session.create({
      _id: `session_${Date.now()}`,
      userId: user._id,
      token,
      expiresAt,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(401).json({ success: false, message: "Token invalid" });
    }

    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ token });
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ success: false, message: "No token" });
    }

    await Session.deleteOne({ token });

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
