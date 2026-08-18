import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
