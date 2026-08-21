import mongoose from "mongoose";
import Show from "./models/Show.js";

async function test() {
  await mongoose.connect('mongodb://localhost:27017/cinK');
  const shows = await Show.find().limit(1);
  if (!shows.length) {
    console.log("No shows found");
    process.exit(1);
  }
  const show = shows[0];
  console.log("Show:", show);

  const query = { _id: show._id };
  const updateQuery = { $set: {} };
  
  query[`occupiedSeats.Z9`] = { $exists: false };
  updateQuery.$set[`occupiedSeats.Z9`] = "test_user";

  console.log("Query:", query);
  console.log("UpdateQuery:", updateQuery);

  const updatedShow = await Show.findOneAndUpdate(query, updateQuery, { new: true });
  console.log("Updated Show:", updatedShow);

  mongoose.disconnect();
}
test();
