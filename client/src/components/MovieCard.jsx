import React, { useState } from 'react'
import { StarIcon, PlayCircleIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({ movie }) => {
    const navigate = useNavigate()
    const [imgLoaded, setImgLoaded] = useState(false)
    const [imgError, setImgError] = useState(false)

    const handleClick = () => {
        navigate(`/movies/${movie._id}`)
        scrollTo(0, 0)
    }

    const imageSrc = imgError ? movie.poster_path : (movie.backdrop_path || movie.poster_path)

    return (
        <div 
            onClick={handleClick}
            className='group relative w-64 md:w-72 aspect-[2/3] md:aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-black/40 hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-2'
        >
            {/* Background Image */}
            {!imgLoaded && !imgError && (
                <div className="absolute inset-0 skeleton" />
            )}
            <img
                src={imageSrc}
                alt={movie.title}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 group-hover:blur-[2px] ${imgLoaded ? 'block' : 'hidden'}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => { setImgError(true); setImgLoaded(true) }}
            />

            {/* Default Overlay (Always visible vignette) */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80' />

            {/* Hover Glassmorphism Overlay */}
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity duration-500 flex flex-col items-center justify-center'>
                 <PlayCircleIcon className='w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(225,29,72,0.8)] scale-50 group-hover:scale-100 transition-transform duration-500 delay-100' />
            </div>

            {/* Content Container */}
            <div className='absolute bottom-0 left-0 right-0 p-5 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out'>
                <h3 className='text-white font-bold text-xl leading-tight truncate drop-shadow-md'>{movie.title}</h3>
                
                <div className='flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150'>
                    <p className='flex items-center gap-1 text-sm text-yellow-400 font-semibold bg-black/40 px-2 py-0.5 rounded backdrop-blur-md'>
                        <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
                        {movie.vote_average?.toFixed(1)}
                    </p>
                    <span className='text-xs text-gray-300 font-medium bg-white/10 px-2 py-0.5 rounded backdrop-blur-md border border-white/10'>
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                </div>

                <div className='mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 flex flex-wrap gap-1'>
                    {movie.genres?.slice(0, 3).map((genre, index) => (
                        <span key={index} className='bg-primary/20 text-primary-light px-2 py-0.5 rounded-full border border-primary/20'>
                            {genre.name}
                        </span>
                    ))}
                </div>

                <button 
                    onClick={(e) => { e.stopPropagation(); handleClick(); }}
                    className='w-full mt-4 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 shadow-[0_0_15px_rgba(225,29,72,0.5)] active:scale-95'
                >
                    Buy Tickets
                </button>
            </div>
            
            {/* Elegant Top Border Glow on Hover */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        </div>
    )
}

export default MovieCard
