import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { getMyBookings, checkoutBooking, verifyPayment } from '../services/bookingService'
import { TicketIcon, CalendarIcon, ArmchairIcon } from 'lucide-react'

const MyBookings = () => {
  const { currency } = useAppContext()
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
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className='text-xl font-semibold'>My Bookings</h1>
      <p className='text-gray-500 text-sm mt-1 mb-6'>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>

      {bookings.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 gap-4'>
          <div className='p-6 rounded-full bg-gray-800/50'>
            <TicketIcon className='w-12 h-12 text-gray-600' />
          </div>
          <h2 className='text-xl font-semibold'>No bookings yet</h2>
          <p className='text-gray-500'>Your movie tickets will appear here</p>
        </div>
      ) : (
        <div className='space-y-4 stagger-children'>
          {bookings.map((item, index) => (
            <div key={index} className='flex flex-col md:flex-row justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 max-w-3xl hover:border-primary/20 transition-all duration-300 group'>
              <div className='flex flex-col md:flex-row gap-4'>
                <img src={item.show?.movie?.poster_path} alt={item.show?.movie?.title} className='md:w-40 aspect-video md:aspect-[3/4] h-auto object-cover object-center rounded-lg' />
                <div className='flex flex-col justify-between py-1'>
                  <div>
                    <p className='text-lg font-semibold group-hover:text-primary transition-colors'>{item.show?.movie?.title || "Unknown Movie"}</p>
                    <p className='text-gray-500 text-sm mt-1'>{timeFormat(item.show?.movie?.runtime)}</p>
                  </div>
                  <div className='flex items-center gap-4 mt-3 text-sm text-gray-400'>
                    <div className='flex items-center gap-1.5'>
                      <CalendarIcon className='w-3.5 h-3.5' />
                      {dateFormat(item.showDateTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col md:items-end justify-between py-1 mt-4 md:mt-0'>
                <div className='flex items-center gap-3'>
                  <p className='text-2xl font-bold'>{currency}{item.amount?.toLocaleString()}</p>
                  {!item.isPaid ? (
                    <button 
                      onClick={() => handlePayNow(item._id)}
                      className='bg-primary hover:bg-primary-dull px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer transition-all active:scale-95 hover:shadow-lg hover:shadow-primary/20'
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className='px-4 py-1.5 text-sm rounded-full font-medium bg-green-500/10 text-green-500 border border-green-500/20'>
                      Paid
                    </span>
                  )}
                </div>
                <div className='text-sm mt-3 space-y-1'>
                  <p className='flex items-center gap-1.5'>
                    <TicketIcon className='w-3.5 h-3.5 text-gray-500' />
                    <span className='text-gray-500'>Tickets:</span>
                    <span className='font-medium'>{item.bookedSeats?.length || 0}</span>
                  </p>
                  <p className='flex items-center gap-1.5'>
                    <ArmchairIcon className='w-3.5 h-3.5 text-gray-500' />
                    <span className='text-gray-500'>Seats:</span>
                    <span className='font-medium'>{item.bookedSeats?.join(", ")}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings