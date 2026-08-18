import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, ClockIcon, PlayCircleIcon, StarIcon, TicketIcon } from 'lucide-react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import timeFormat from '../lib/timeFormat'

const HeroSection = () => {

    const navigate = useNavigate()
    const { shows } = useAppContext()

    // Use first show data if available, otherwise fallback
    const featuredMovie = shows[0] || null

    return (
        <div className='relative h-[100svh] w-full overflow-hidden flex items-center'>
            {/* Background Image with Zoom Animation */}
            <div className='absolute inset-0 w-full h-full'>
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]'
                    style={{ backgroundImage: `url(${assets.hero})` }}
                />
            </div>

            {/* Immersive Cinematic Gradients */}
            <div className='absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-[80%]' />
            <div className='absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent h-full' />
            <div className='absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#09090b] to-transparent' />

            {/* Content Container */}
            <div className='relative z-10 flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-32 w-full max-w-7xl mx-auto pt-20'>
                
                {/* Now Showing Badge */}
                <div className='animate-fade-in-up' style={{ animationDelay: '200ms' }}>
                    <div className='flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full'>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(225,29,72,1)]" />
                        <span className='text-xs font-bold text-primary uppercase tracking-widest'>
                            Premium Premiere
                        </span>
                    </div>
                </div>

                {/* Massive Typography Title */}
                <h1 className='text-5xl md:text-7xl lg:text-[80px] leading-[1.1] font-black max-w-[800px] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-fade-in-up drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]' style={{ animationDelay: '350ms' }}>
                    {featuredMovie ? featuredMovie.title : 'Guardians of the Galaxy'}
                </h1>

                {/* Metadata Row */}
                <div className='flex items-center gap-4 md:gap-6 text-sm md:text-base font-medium text-gray-300 flex-wrap animate-fade-in-up' style={{ animationDelay: '500ms' }}>
                    {featuredMovie ? (
                        <>
                            <div className='flex items-center gap-2'>
                                <StarIcon className='w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' />
                                <span className='text-white font-bold'>{featuredMovie.vote_average?.toFixed(1)}</span>
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <div className='flex items-center gap-2'>
                                <ClockIcon className='w-4.5 h-4.5 text-gray-400' />
                                {timeFormat(featuredMovie.runtime)}
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <div className='flex items-center gap-2'>
                                <CalendarIcon className='w-4.5 h-4.5 text-gray-400' />
                                {new Date(featuredMovie.release_date).getFullYear()}
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <span className='text-primary-light font-bold uppercase tracking-wider'>
                                {featuredMovie.genres?.slice(0, 3).map(g => g.name).join(' • ')}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className='text-primary-light font-bold uppercase tracking-wider'>Action • Adventure • Sci-Fi</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <div className='flex items-center gap-2'><ClockIcon className='w-4.5 h-4.5 text-gray-400' /> 2h 8m</div>
                        </>
                    )}
                </div>

                {/* Synopsis */}
                <p className='max-w-xl text-gray-400 text-lg leading-relaxed animate-fade-in-up mix-blend-screen' style={{ animationDelay: '650ms' }}>
                    CinK Cinema mang đến không gian điện ảnh tối thượng. Đắm chìm vào những khung hình rực rỡ và âm thanh bùng nổ. Trải nghiệm vượt xa sức tưởng tượng.
                </p>

                {/* Call To Action Buttons */}
                <div className='flex items-center flex-wrap gap-4 mt-4 animate-fade-in-up' style={{ animationDelay: '800ms' }}>
                    <button
                        onClick={() => featuredMovie ? navigate(`/movies/${featuredMovie._id}`) : navigate('/movies')}
                        className='flex items-center gap-2 px-8 py-4 text-sm md:text-base bg-primary hover:bg-primary-dull transition-all duration-300 rounded-full font-bold cursor-pointer hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] active:scale-95 group'
                    >
                        <TicketIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        {featuredMovie ? 'Book Tickets Now' : 'Explore Movies'}
                    </button>
                    
                    <button
                        onClick={() => navigate('/movies')}
                        className='group flex items-center gap-3 px-8 py-4 text-sm md:text-base bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 rounded-full font-bold cursor-pointer active:scale-95 hover:border-white/30'
                    >
                        <PlayCircleIcon className="w-6 h-6 text-white group-hover:text-primary transition-colors duration-300" />
                        Watch Trailer
                    </button>
                </div>
            </div>
            
            {/* Elegant Fade Out Bottom */}
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none' />
        </div>
    )
}

export default HeroSection