import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    movie: {
      type: String,
      ref: "Movie",
      required: true,
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
    hall: {
      type: String,
      default: "A",
    },
    occupiedSeats: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Show = mongoose.models.Show || mongoose.model("Show", showSchema);

export default Show;
