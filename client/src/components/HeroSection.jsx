import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClockIcon, ArrowRight, StarIcon } from 'lucide-react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import timeFormat from '../lib/timeFormat'

const HeroSection = () => {

    const navigate = useNavigate()
    const { shows } = useAppContext()

    // Use first show data if available, otherwise fallback
    const featuredMovie = shows[0] || null

    return (
        <div className='relative h-screen overflow-hidden'>
            {/* Background image */}
            <div
                className='absolute inset-0 bg-cover bg-center bg-no-repeat scale-105'
                style={{ backgroundImage: `url(${assets.hero})` }}
            />

            {/* Gradient overlays */}
            <div className='absolute inset-0 hero-gradient' />
            <div className='absolute bottom-0 left-0 right-0 h-40 hero-gradient-bottom' />

            {/* Content */}
            <div className='relative z-10 flex flex-col items-start justify-center gap-5 px-6 md:px-16 lg:px-36 h-full'>
                <div className='animate-fade-in-up' style={{ animationDelay: '200ms' }}>
                    <span className='inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full uppercase tracking-wider'>
                        Now Showing
                    </span>
                </div>

                <h1 className='text-5xl md:text-[70px] md:leading-[1.1] font-bold max-w-[600px] animate-fade-in-up' style={{ animationDelay: '350ms' }}>
                    {featuredMovie ? featuredMovie.title : 'Guardians of the Galaxy'}
                </h1>

                <div className='flex items-center gap-4 text-gray-300 flex-wrap animate-fade-in-up' style={{ animationDelay: '500ms' }}>
                    {featuredMovie ? (
                        <>
                            <span>{featuredMovie.genres?.slice(0, 3).map(g => g.name).join(' | ')}</span>
                            <div className='flex items-center gap-1.5'>
                                <CalendarIcon className='w-4 h-4' />
                                {new Date(featuredMovie.release_date).getFullYear()}
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <ClockIcon className='w-4 h-4' />
                                {timeFormat(featuredMovie.runtime)}
                            </div>
                            <div className='flex items-center gap-1.5'>
                                <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                {featuredMovie.vote_average?.toFixed(1)}
                            </div>
                        </>
                    ) : (
                        <>
                            <span>Action | Adventure | Sci-Fi</span>
                            <div className='flex items-center gap-1'>
                                <CalendarIcon className='w-4.5 h-4.5' /> 2026
                            </div>
                            <div className='flex items-center gap-1'>
                                <ClockIcon className='w-4.5 h-4.5' /> 2h 8m
                            </div>
                        </>
                    )}
                </div>

                <p className='max-w-lg text-gray-400 leading-relaxed animate-fade-in-up' style={{ animationDelay: '650ms' }}>
                    CinK là điểm đến dành cho những người yêu điện ảnh — nơi mang đến trải nghiệm xem phim hiện đại, thoải mái và đầy cảm xúc. Xem nhiều hơn, cảm nhận sâu hơn.
                </p>

                <div className='flex items-center gap-4 animate-fade-in-up' style={{ animationDelay: '800ms' }}>
                    <button
                        onClick={() => featuredMovie ? navigate(`/movies/${featuredMovie._id}`) : navigate('/movies')}
                        className='flex items-center gap-2 px-7 py-3.5 text-sm bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer hover:shadow-lg hover:shadow-primary/25 active:scale-95 group'
                    >
                        {featuredMovie ? 'Book Tickets' : 'Explore Movies'}
                        <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/movies')}
                        className='px-7 py-3.5 text-sm bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur transition-all duration-200 rounded-full font-medium cursor-pointer active:scale-95'
                    >
                        Browse All
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection