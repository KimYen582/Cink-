import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
