import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Profile from './pages/Profile'
import DevLogin from './pages/DevLogin'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import ListBookings from './pages/admin/ListBookings'
import ListShows from './pages/admin/ListShows'
import AddShows from './pages/admin/AddShows'
import Dashboard from './pages/admin/Dashboard'
import ListMovies from './pages/admin/ListMovies'
import ListUsers from './pages/admin/ListUsers'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AppProvider } from './context/AppContext'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <AppProvider>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favorites' element={<Favorite />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dev-login' element={<DevLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path='/admin/*' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-shows" element={<AddShows />} />
            <Route path="list-shows" element={<ListShows />} />
            <Route path="list-bookings" element={<ListBookings/>} />
            <Route path="list-movies" element={<ListMovies />} />
            <Route path="list-users" element={<ListUsers />} />
          </Route>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </AppProvider>
  )
}

export default App