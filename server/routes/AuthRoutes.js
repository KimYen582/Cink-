import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import crypto from "crypto";

const router = express.Router();

// Login by email (dev mode)
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
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
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const user = await User.findById(session.userId);

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
