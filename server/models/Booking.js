import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    movie: {
      type: String,
      ref: "Movie",
      required: true,
    },
    show: {
      type: String,
      ref: "Show",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
      default: [],
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "e_wallet", "cod"],
      default: "credit_card",
    },
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
