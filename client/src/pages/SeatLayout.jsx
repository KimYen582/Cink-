import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ClockIcon, ArrowRightIcon } from 'lucide-react'
import { useAuth, useClerk } from '@clerk/clerk-react'
import { assets } from '../assets/assets'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import useShow from '../hooks/useShow'
import { createBooking } from '../services/bookingService'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { show, loading, error } = useShow(id)
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!selectedTime) {
      return toast('Please select time first')
    }
    if (selectedSeats.length === 0) {
      return toast('Please select at least one seat')
    }
    if (!isSignedIn) {
      toast.error('Please login to book tickets')
      openSignIn()
      return
    }

    const showId = show?.movie?.showIds?.[date]?.[selectedTime]
    if (!showId) {
      return toast.error('Invalid show time')
    }

    const seatPrice = show?.movie?.showPrices?.[date]?.[selectedTime] ?? show?.movie?.showPrice ?? 0
    const amount = seatPrice * selectedSeats.length

    setIsSubmitting(true)
    try {
      await createBooking({ showId, seats: selectedSeats, amount })
      toast.success('Booking created successfully!')
      navigate('/my-bookings')
    } catch (err) {
      if (err.status === 401) {
        toast.error('Please login to book tickets')
        openSignIn()
      } else {
        toast.error(err.message || 'Failed to create booking')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => {
    // Get occupied seats for the selected time
    const occupiedSeats = selectedTime && show?.movie?.occupiedSeatsMap?.[date]?.[selectedTime] 
      ? show.movie.occupiedSeatsMap[date][selectedTime] 
      : {};

    return (
      <div key={row} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isOccupied = !!occupiedSeats[seatId];
            const isSelected = selectedSeats.includes(seatId);
            
            return (
              <button 
                key={seatId} 
                onClick={() => !isOccupied && handleSeatClick(seatId)} 
                disabled={isOccupied}
                className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition-all ${
                  isOccupied 
                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed opacity-50" 
                    : isSelected 
                      ? "bg-primary text-white" 
                      : "hover:bg-primary/20"
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    )
  }

  if (loading) return <Loading />
  if (error || !show) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-xl'>Show not found</p>
        <button onClick={() => navigate('/movies')} className='mt-4 px-6 py-2 bg-primary rounded-full'>
          Browse Movies
        </button>
      </div>
    )
  }

  const timings = show?.dateTime?.[date] || []

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/*Available Timings*/}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {timings.map((item) => (
            <div key={item} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime === item ?
              "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className="w-4 h-4" />
              <p className='text-sm'>{isoTimeFormat(item)}</p>
            </div>
          ))}
        </div>
      </div>
      {/*Seat Layout*/}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-2xl font-semibold mb-1'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" className='w-[600px] max-w-full  -mt-20' />
        <p className='text-gray-400 text-sm -mt-24'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Processing...' : 'Proceed to checkout'}
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div >
  )
}
export default SeatLayout