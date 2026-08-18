import hero from './hero.png'
import hero1 from './hero1.png'
import logo from './logo.png'
import logo1 from './logo1.png'
import logo2 from './logo2.png'
import poster1 from './poster1.png'
import screenImage from './screenImage.png'

export const assets = {
  hero,
  hero1,
  logo,
  logo1,
  logo2,
  poster1,
  screenImage

  }
export const dummyShowsData = [
  {
    _id: "1",
    title: "Movie 1",
    backdrop_path: "/movie1.jpg",
    poster_path: poster1,
    release_date: "2026-01-15",
    genres: [
      { name: "Action" },
      { name: "Adventure" }
    ],
    runtime: 120,
    vote_average: 8.5,
    vote_count: 12500
  },
  {
    _id: "2",
    title: "Movie 2",
    backdrop_path: "/movie2.jpg",
    poster_path: poster1,
    release_date: "2026-02-20",
    genres: [
      { name: "Comedy" },
      { name: "Drama" }
    ],
    runtime: 105,
    vote_average: 7.8,
    vote_count: 9800
  },
  {
    _id: "3",
    title: "Movie 3",
    backdrop_path: "/movie3.jpg",
    poster_path: poster1,
    release_date: "2026-03-10",
    genres: [
      { name: "Horror" },
      { name: "Thriller" }
    ],
    runtime: 115,
    vote_average: 8.1,
    vote_count: 7600
  },
  {
    _id: "4",
    title: "Movie 4",
    backdrop_path: "/movie4.jpg",
    poster_path: poster1,
    release_date: "2026-04-05",
    genres: [
      { name: "Romance" },
      { name: "Drama" }
    ],
    runtime: 110,
    vote_average: 7.9,
    vote_count: 6200
  }
];

export const dummyTrailers = [
  {
    id: 1,
    title: "Trailer Movie 1",
    videoUrl: "https://www.youtube.com/embed/B5Dxd1EvXwU"
  },
  {
    id: 2,
    title: "Trailer Movie 2",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Trailer Movie 3",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 4,
    title: "Trailer Movie 4",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
]

export const dummyDateTimeData = {
  "1": {
    "2026-08-20": ["10:00", "13:00", "16:00", "19:00"],
    "2026-08-21": ["11:00", "14:00", "17:00", "20:00"]
  },
  "2": {
    "2026-08-20": ["09:00", "12:00", "15:00", "18:00"],
    "2026-08-21": ["10:30", "13:30", "16:30", "19:30"]
  },
  "3": {
    "2026-08-20": ["10:30", "13:30", "16:30", "19:30"],
    "2026-08-21": ["09:30", "12:30", "15:30", "18:30"]
  },
  "4": {
    "2026-08-20": ["11:00", "14:00", "17:00", "20:00"],
    "2026-08-21": ["10:00", "13:00", "16:00", "19:00"]
  }
}

export const dummyBookingData = [
  {
    _id: "booking_001",
    user: "user_001",
    show: {
      movie: {
        title: "Avengers: Endgame",
        poster_path: poster1,
        runtime: 120,
      },
      showDateTime: "2026-08-20T18:30:00",
    },
    amount: 250000,
    bookedSeats: ["A1", "A2"],
  },
  {
    _id: "booking_002",
    user: "user_001",
    show: {
      movie: {
        title: "Spider-Man",
        poster_path: poster1,
        runtime: 120,
      },
      showDateTime: "2026-08-22T20:00:00",
    },
    amount: 180000,
    bookedSeats: ["C3", "C4"],
  },
]
export const dummyDashboardData = {
    totalBookings: 120,
    totalRevenue: 5000000,
    activeShows: [
        {
            _id: "show_001",
            movie: dummyShowsData[0],
            showDateTime: "2026-08-20T19:00:00",
            showPrice: 100000
        },
        {
            _id: "show_002",
            movie: dummyShowsData[1],
            showDateTime: "2026-08-20T20:00:00",
            showPrice: 120000
        },
        {
            _id: "show_003",
            movie: dummyShowsData[2],
            showDateTime: "2026-08-21T19:30:00",
            showPrice: 100000
        }
    ],
    totalUser: 50
};









