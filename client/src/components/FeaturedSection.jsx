import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import MovieCard from './MovieCard'
import { MovieCardSkeleton } from './Loading'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { shows, loading } = useAppContext()

    return (
        <div className='relative px-6 md:px-16 lg:px-24 xl:px-44 py-24 overflow-hidden'>
            {/* Background Glows */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full' />

            <div className='relative z-10 flex items-end justify-between mb-12'>
                <div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className='text-primary font-bold tracking-widest uppercase text-sm'>Trending</span>
                    </div>
                    <h2 className='text-4xl md:text-5xl font-bold tracking-tight text-white'>Now Showing</h2>
                    <p className='text-gray-400 mt-3 text-lg max-w-xl'>Experience the magic of cinema with our handpicked selection of current blockbusters.</p>
                </div>
                <button onClick={() => navigate('/movies')} className='group hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/10'>
                    View All Movies
                    <ArrowRight className='group-hover:translate-x-1 transition-transform w-4 h-4 text-primary' />
                </button>
            </div>

            {/* Movie Grid */}
            <div className='relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 stagger-children'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex justify-center w-full"><MovieCardSkeleton /></div>
                    ))
                ) : (
                    shows.slice(0, 4).map((show) => (
                        <div key={show._id} className="flex justify-center w-full"><MovieCard movie={show} /></div>
                    ))
                )}
            </div>

            <div className='flex justify-center mt-16 md:hidden relative z-10'>
                <button onClick={() => { navigate('/movies'); scrollTo(0, 0) }} className='flex items-center gap-2 px-8 py-3.5 text-sm bg-primary hover:bg-primary-dull transition-all duration-300 rounded-full font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)]'>
                    View All Movies
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default FeaturedSection