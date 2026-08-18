import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, CalendarDays } from 'lucide-react'
import { toast } from 'react-hot-toast'
import BlurCircle from './BlurCircle'

const DateSelect = ({ dateTime, id }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null)

    const dates = dateTime ? Object.keys(dateTime) : []

    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0, 0)
    }

    if (dates.length === 0) return null

    return (
        <div id='dateSelect' className='pt-24'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl backdrop-blur-sm'>
                <BlurCircle top="-100px" left="-100px" />

                <div>
                    <div className='flex items-center gap-2 mb-5'>
                        <CalendarDays className='w-5 h-5 text-primary' />
                        <p className='text-lg font-semibold'>Choose Date</p>
                    </div>
                    <div className='flex items-center gap-4 text-sm'>
                        <ChevronLeftIcon className='w-7 h-7 p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors' />
                        <div className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-3'>
                            {dates.map((date) => {
                                const d = new Date(date)
                                const isSelected = selected === date
                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelected(date)}
                                        className={`flex flex-col items-center justify-center h-16 w-16 rounded-xl cursor-pointer border transition-all duration-200 ${
                                            isSelected
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                                : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                                        }`}
                                    >
                                        <span className='text-lg font-bold leading-none'>{d.getDate()}</span>
                                        <span className='text-xs mt-0.5 opacity-80'>{d.toLocaleDateString("en-US", { month: "short" })}</span>
                                    </button>
                                )
                            })}
                        </div>
                        <ChevronRightIcon className='w-7 h-7 p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors' />
                    </div>
                </div>

                <button
                    onClick={onBookHandler}
                    className='bg-primary hover:bg-primary-dull text-white px-10 py-3 rounded-full transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-95 font-medium'
                >
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default DateSelect