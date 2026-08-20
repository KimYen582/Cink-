import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { getMyBookings, checkoutBooking, verifyPayment } from '../services/bookingService'
import { TicketIcon, CalendarIcon, ArmchairIcon, Clock, Film, CheckCircle2, MapPin, Barcode } from 'lucide-react'

const MyBookings = () => {
  const { currency } = useAppContext()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const isSuccess = searchParams.get('payment_success')
      const isCanceled = searchParams.get('payment_canceled')
      const bookingId = searchParams.get('bookingId')

      if (isSuccess && bookingId) {
        setIsLoading(true)
        try {
          await verifyPayment(bookingId)
          toast.success('Payment verified successfully!')
        } catch (error) {
          toast.error('Payment verification failed.')
        } finally {
          // Clean up URL
          setSearchParams({})
          fetchBookings()
        }
      } else if (isCanceled) {
        toast.error('Payment was canceled.')
        setSearchParams({})
        fetchBookings()
      } else {
        fetchBookings()
      }
    }

    handlePaymentReturn()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePayNow = async (bookingId) => {
    const toastId = toast.loading('Redirecting to secure checkout...')
    try {
      await checkoutBooking(bookingId)
      toast.dismiss(toastId)
    } catch (error) {
      toast.error('Failed to initiate checkout', { id: toastId })
    }
  }

  if (isLoading) return <Loading />

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] animate-fade-in'>
      <BlurCircle top="100px" left="10%" />
      <BlurCircle bottom="10%" right="10%" />

      <div className="flex items-end justify-between mb-8 max-w-4xl mx-auto">
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>My Tickets</h1>
          <p className='text-gray-400 mt-2 text-sm'>
            {bookings.length} {bookings.length <= 1 ? 'ticket' : 'tickets'} found in your collection
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 gap-5 max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl'>
          <div className='relative p-8 rounded-full bg-primary/10 border border-primary/20'>
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Film className='w-14 h-14 text-primary relative z-10' />
          </div>
          <div className="text-center">
            <h2 className='text-2xl font-semibold mb-2'>No tickets yet</h2>
            <p className='text-gray-400 max-w-md mx-auto'>Your cinematic journey starts here. Explore our latest blockbusters and book your perfect seat.</p>
          </div>
          <button onClick={() => navigate('/movies')} className="mt-4 px-8 py-3 bg-primary hover:bg-primary-dull transition-all duration-300 rounded-full font-medium shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-95">
            Browse Movies
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-8 max-w-4xl mx-auto stagger-children'>
          {bookings.map((item, index) => (
            <div key={index} className='group relative flex flex-col md:flex-row w-full bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(225,29,72,0.15)]'>
              
              {/* Left Side: Movie Info (65%) */}
              <div className='flex p-5 md:p-6 gap-5 md:gap-6 md:w-[65%] relative z-10'>
                <img 
                  src={item.show?.movie?.poster_path} 
                  alt={item.show?.movie?.title} 
                  className='w-28 md:w-36 h-auto aspect-[3/4] object-cover object-center rounded-xl shadow-lg shadow-black/50 group-hover:scale-105 transition-transform duration-500' 
                />
                <div className='flex flex-col justify-between py-1 flex-1'>
                  <div>
                    <h3 className='text-xl md:text-2xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300'>
                      {item.show?.movie?.title || "Unknown Movie"}
                    </h3>
                    <div className='flex items-center gap-3 mt-3 flex-wrap'>
                      <span className='px-2.5 py-1 text-[10px] font-bold bg-white/10 text-white rounded uppercase tracking-wider'>
                        {item.show?.hall || 'HALL A'}
                      </span>
                      <span className='flex items-center gap-1.5 text-xs text-gray-400 font-medium'>
                        <Clock className='w-3.5 h-3.5' />
                        {timeFormat(item.show?.movie?.runtime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-y-3 mt-4 text-sm text-gray-300'>
                    <div className='flex items-center gap-2'>
                      <CalendarIcon className='w-4 h-4 text-primary' />
                      <span className="font-medium">{dateFormat(item.showDateTime)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='w-4 h-4 text-primary' />
                      <span className="font-medium">CinK Cinema</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforated Edge Divider (Hidden on mobile, vertical line) */}
              <div className='hidden md:flex flex-col items-center justify-between relative z-10 w-0'>
                <div className="w-6 h-6 rounded-full bg-[#09090B] absolute -top-3 left-1/2 -translate-x-1/2 border-b border-white/10 shadow-inner" />
                <div className="h-full border-l-2 border-dashed border-white/20" />
                <div className="w-6 h-6 rounded-full bg-[#09090B] absolute -bottom-3 left-1/2 -translate-x-1/2 border-t border-white/10 shadow-inner" />
              </div>

              {/* Horizontal Divider for Mobile */}
              <div className='md:hidden w-full flex items-center justify-between relative z-10'>
                <div className="w-6 h-6 rounded-full bg-[#09090B] absolute -left-3 top-1/2 -translate-y-1/2 border-r border-white/10" />
                <div className="w-full border-t-2 border-dashed border-white/20 mx-4" />
                <div className="w-6 h-6 rounded-full bg-[#09090B] absolute -right-3 top-1/2 -translate-y-1/2 border-l border-white/10" />
              </div>

              {/* Right Side: Order Info & Payment (35%) */}
              <div className='flex flex-col justify-between p-5 md:p-6 md:w-[35%] relative z-10 bg-white/[0.02]'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] text-gray-500 uppercase tracking-widest mb-1'>Seats</span>
                      <span className='font-bold text-white text-base leading-none'>{item.bookedSeats?.join(", ") || 'N/A'}</span>
                    </div>
                    <div className='flex flex-col items-end'>
                      <span className='text-[10px] text-gray-500 uppercase tracking-widest mb-1'>Count</span>
                      <span className='font-bold text-white text-base leading-none flex items-center gap-1.5'>
                        <TicketIcon className='w-4 h-4 text-primary' /> {item.bookedSeats?.length || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className='flex flex-col items-center justify-center opacity-40 mix-blend-screen'>
                     <Barcode className='w-full h-12' strokeWidth={1} />
                     <p className='text-[10px] tracking-[0.3em] font-mono mt-1'>{item._id?.slice(-10).toUpperCase()}</p>
                  </div>
                </div>

                <div className='flex items-end justify-between mt-6'>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-500 font-medium mb-1'>Total Amount</span>
                    <p className='text-2xl font-bold text-white tracking-tight'>{currency}{item.amount?.toLocaleString()}</p>
                  </div>
                  
                  {!item.isPaid ? (
                    <button 
                      onClick={() => handlePayNow(item._id)}
                      className='bg-primary hover:bg-primary-dull px-5 py-2 text-sm rounded-full font-bold cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)]'
                    >
                      Pay Now
                    </button>
                  ) : (
                    <div className='flex items-center gap-1.5 px-4 py-2 text-sm rounded-full font-bold bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]'>
                      <CheckCircle2 className='w-4 h-4' />
                      Paid
                    </div>
                  )}
                </div>
              </div>
              
              {/* Glow Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings