import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    booking: {
      type: String,
      ref: "Booking",
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["credit_card", "e_wallet", "cod"],
      default: "credit_card",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
