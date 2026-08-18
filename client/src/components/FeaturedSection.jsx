import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { MovieCardSkeleton } from './Loading'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { shows, loading } = useAppContext()

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
            <div className='relative flex items-center justify-between pt-20 pb-10'>
                <BlurCircle top='0' right='-80px' />
                <div>
                    <p className='text-white font-semibold text-xl'>Now Showing</p>
                    <p className='text-gray-500 text-sm mt-1'>Currently playing in theaters</p>
                </div>
                <button onClick={() => navigate('/movies')} className='group flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors'>
                    View All
                    <ArrowRight className='group-hover:translate-x-1 transition-transform w-4 h-4' />
                </button>
            </div>

            <div className='flex flex-wrap max-sm:justify-center gap-8 mt-4 stagger-children'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))
                ) : (
                    shows.slice(0, 4).map((show) => (
                        <MovieCard key={show._id} movie={show} />
                    ))
                )}
            </div>

            <div className='flex justify-center mt-20'>
                <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-95'>
                    Show more
                </button>
            </div>

        </div>
    )
}

export default FeaturedSection