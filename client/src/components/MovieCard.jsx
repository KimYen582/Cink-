import React, { useState } from 'react'
import { StarIcon, ImageIcon } from 'lucide-react'
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

    // Use poster_path as fallback if backdrop_path is broken
    const imageSrc = imgError ? movie.poster_path : (movie.backdrop_path || movie.poster_path)

    return (
        <div className='group flex flex-col justify-between p-3 bg-gray-800/60 border border-gray-700/50 rounded-2xl hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 w-66'>
            {/* Image with loading state */}
            <div className='relative rounded-xl overflow-hidden cursor-pointer' onClick={handleClick}>
                {!imgLoaded && !imgError && (
                    <div className="skeleton h-52 w-full" />
                )}
                <img
                    src={imageSrc}
                    alt={movie.title}
                    className={`h-52 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'block' : 'hidden'}`}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => { setImgError(true); setImgLoaded(true) }}
                />
                {imgError && imgLoaded && !movie.poster_path && (
                    <div className="flex items-center justify-center h-52 w-full bg-gray-700/50">
                        <ImageIcon className="w-10 h-10 text-gray-500" />
                    </div>
                )}
                {/* Hover overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>

            <p className='font-semibold mt-3 truncate'>{movie.title}</p>
            <p className='text-sm text-gray-500 mt-1'>
                {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map
                    (genre => genre.name).join(" | ")} • {timeFormat(movie.runtime)}
            </p>

            <div className='flex items-center justify-between mt-4 pb-1'>
                <button onClick={handleClick}
                    className='px-5 py-2 text-xs bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-primary/20'>Buy Tickets</button>
                <p className='flex items-center gap-1 text-sm text-gray-400 pr-1'>
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    )
}
export default MovieCard
