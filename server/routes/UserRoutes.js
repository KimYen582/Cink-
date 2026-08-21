import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";

const router = express.Router();

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const session = await Session.findOne({ token });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: "Token invalid or expired" });
    }

    const user = await User.findById(session.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;