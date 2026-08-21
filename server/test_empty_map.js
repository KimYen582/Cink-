import mongoose from "mongoose";
import Show from "./models/Show.js";

async function test() {
  await mongoose.connect('mongodb://localhost:27017/cinK');
  
  // Create a new show with empty map
  const newShow = new Show({
     _id: "show_empty_1",
     movie: "movie_1",
     showDateTime: new Date(),
     showPrice: 100000,
     hall: "B"
  });
  await newShow.save();

  const query = { _id: newShow._id };
  const updateQuery = { $set: {} };
  
  query[`occupiedSeats.B1`] = { $exists: false };
  updateQuery.$set[`occupiedSeats.B1`] = "test_user";

  console.log("Query:", query);
  console.log("UpdateQuery:", updateQuery);

  const updatedShow = await Show.findOneAndUpdate(query, updateQuery, { new: true });
  console.log("Updated Show:", updatedShow);

  await Show.deleteOne({ _id: newShow._id });
  mongoose.disconnect();
}
test();
