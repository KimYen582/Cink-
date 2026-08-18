import mongoose from "mongoose";
import "dotenv/config";

import connectDB from "./configs/db.js";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Show from "./models/Show.js";
import Booking from "./models/Booking.js";
import Payment from "./models/Payment.js";

const users = [
  {
    _id: "admin_001",
    name: "Admin Cin",
    email: "admin@cin.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    role: "admin",
  },
  {
    _id: "user_001",
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    role: "user",
  },
  {
    _id: "user_002",
    name: "Tran Thi B",
    email: "tranthib@example.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    role: "user",
  },
  {
    _id: "user_003",
    name: "Le Hoang C",
    email: "lehoangc@example.com",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    role: "user",
  },
];

const movies = [
  {
    _id: "movie_1",
    title: "Movie 1",
    overview:
      "Một bộ phim hành động ly kỳ về một nhóm anh hùng cố gắng cứu thế giới khỏi một thảm họa lớn trước khi quá muộn.",
    poster_path: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-01-15",
    original_language: "en",
    tagline: "The world is one choice away.",
    genres: [{ name: "Action" }, { name: "Adventure" }],
    casts: [
      { name: "John Carter", character: "Alex" },
      { name: "Emma Stone", character: "Lena" },
      { name: "David Lee", character: "Khan" },
    ],
    vote_average: 8.5,
    vote_count: 12500,
    runtime: 120,
  },
  {
    _id: "movie_2",
    title: "Movie 2",
    overview:
      "Một câu chuyện hài hước, cảm động về cuộc sống của những người bạn đang tìm kiếm một khởi đầu mới ở thành phố lớn.",
    poster_path: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-02-20",
    original_language: "en",
    tagline: "Laugh loud. Live brighter.",
    genres: [{ name: "Comedy" }, { name: "Drama" }],
    casts: [
      { name: "Sarah Kim", character: "Mia" },
      { name: "Lucas Tran", character: "Ben" },
      { name: "Olivia White", character: "Nina" },
    ],
    vote_average: 7.8,
    vote_count: 9800,
    runtime: 105,
  },
  {
    _id: "movie_3",
    title: "Movie 3",
    overview:
      "Một bộ phim kinh dị rùng rợn với cốt truyện kéo dài, khiến khán giả không dám thở khi đêm tối buông xuống.",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-03-10",
    original_language: "en",
    tagline: "When the lights go out, something watches.",
    genres: [{ name: "Horror" }, { name: "Thriller" }],
    casts: [
      { name: "Mila Nguyen", character: "Sophie" },
      { name: "Henry Scott", character: "Mark" },
      { name: "Grace Hwang", character: "Anna" },
    ],
    vote_average: 8.1,
    vote_count: 7600,
    runtime: 115,
  },
  {
    _id: "movie_4",
    title: "Movie 4",
    overview:
      "Một truyện tình cảm lãng mạn, sâu sắc về những cuộc gặp gỡ bất ngờ đánh dấu một mùa mới trong đời mỗi người.",
    poster_path: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-04-05",
    original_language: "en",
    tagline: "Some love stories start at the wrong time.",
    genres: [{ name: "Romance" }, { name: "Drama" }],
    casts: [
      { name: "Daniel Park", character: "Kai" },
      { name: "Ariana Moss", character: "Lucy" },
      { name: "Noah Reed", character: "Ethan" },
    ],
    vote_average: 7.9,
    vote_count: 6200,
    runtime: 110,
  },
  {
    _id: "movie_5",
    title: "The Last Horizon",
    overview:
      "Một phi hành gia và nhóm đồng đội phải tìm cách quay trở về trái đất sau khi phát hiện ra một bí ẩn lớn trong không gian sâu.",
    poster_path: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-05-18",
    original_language: "en",
    tagline: "Beyond the stars, the truth is waiting.",
    genres: [{ name: "Sci-Fi" }, { name: "Adventure" }],
    casts: [
      { name: "Chris Evans", character: "Captain Ray" },
      { name: "Natalie Portman", character: "Dr. Sol" },
      { name: "Tom Holland", character: "Jett" },
    ],
    vote_average: 8.8,
    vote_count: 18400,
    runtime: 132,
  },
  {
    _id: "movie_6",
    title: "Midnight City",
    overview:
      "Trong một thành phố thức đêm, một thám tử đang truy dấu một tội ác mà chính mình không thể giải thích được.",
    poster_path: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    release_date: "2026-06-22",
    original_language: "en",
    tagline: "Every alley has a secret.",
    genres: [{ name: "Action" }, { name: "Crime" }],
    casts: [
      { name: "Brandon Lee", character: "Detective Rowan" },
      { name: "Rosie Kim", character: "Mina" },
      { name: "Jason Cole", character: "Victor" },
    ],
    vote_average: 8.2,
    vote_count: 9150,
    runtime: 118,
  },
];

const shows = [
  {
    _id: "show_001",
    movie: "movie_1",
    showDateTime: "2026-08-20T10:00:00.000Z",
    showPrice: 95000,
    hall: "A",
    occupiedSeats: { A1: "user_001", A2: "user_002", B5: "user_003" },
  },
  {
    _id: "show_002",
    movie: "movie_1",
    showDateTime: "2026-08-20T13:00:00.000Z",
    showPrice: 110000,
    hall: "B",
    occupiedSeats: { C1: "user_001", C2: "user_002" },
  },
  {
    _id: "show_003",
    movie: "movie_2",
    showDateTime: "2026-08-21T18:30:00.000Z",
    showPrice: 90000,
    hall: "A",
    occupiedSeats: { A3: "user_003", D4: "user_002" },
  },
  {
    _id: "show_004",
    movie: "movie_3",
    showDateTime: "2026-08-22T20:00:00.000Z",
    showPrice: 120000,
    hall: "C",
    occupiedSeats: { E2: "user_001" },
  },
  {
    _id: "show_005",
    movie: "movie_5",
    showDateTime: "2026-08-23T19:00:00.000Z",
    showPrice: 140000,
    hall: "D",
    occupiedSeats: { F1: "user_003", F2: "user_001" },
  },
];

const bookings = [
  {
    _id: "booking_001",
    user: "user_001",
    movie: "movie_1",
    show: "show_001",
    seats: ["A1", "A2"],
    amount: 190000,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    orderCode: "ORD-10001",
  },
  {
    _id: "booking_002",
    user: "user_002",
    movie: "movie_2",
    show: "show_003",
    seats: ["A3"],
    amount: 90000,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "e_wallet",
    orderCode: "ORD-10002",
  },
  {
    _id: "booking_003",
    user: "user_003",
    movie: "movie_3",
    show: "show_004",
    seats: ["E2", "E3"],
    amount: 240000,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "credit_card",
    orderCode: "ORD-10003",
  },
];

const payments = [
  {
    _id: "payment_001",
    booking: "booking_001",
    user: "user_001",
    amount: 190000,
    method: "credit_card",
    status: "paid",
    transactionId: "TXN-CC-10001",
    paidAt: "2026-08-18T08:15:00.000Z",
  },
  {
    _id: "payment_002",
    booking: "booking_003",
    user: "user_003",
    amount: 240000,
    method: "credit_card",
    status: "paid",
    transactionId: "TXN-CC-10003",
    paidAt: "2026-08-18T09:00:00.000Z",
  },
];

async function seedDatabase() {
  await connectDB();

  if (process.argv.includes("--reset")) {
    await mongoose.connection.db.dropDatabase();
    console.log("Database reset complete.");
  }

  await User.deleteMany({});
  await Movie.deleteMany({});
  await Show.deleteMany({});
  await Booking.deleteMany({});
  await Payment.deleteMany({});

  const createdUsers = await User.insertMany(users);
  const createdMovies = await Movie.insertMany(movies);
  const createdShows = await Show.insertMany(shows);
  const createdBookings = await Booking.insertMany(bookings);
  const createdPayments = await Payment.insertMany(payments);

  console.log(
    `Seeded ${createdUsers.length} users, ${createdMovies.length} movies, ${createdShows.length} shows, ${createdBookings.length} bookings and ${createdPayments.length} payments successfully.`
  );
  console.log('Admin account ready: admin@cin.com');
}

seedDatabase()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    mongoose.connection.close();
    process.exit(1);
  });
