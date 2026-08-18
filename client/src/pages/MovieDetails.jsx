import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon, Clock, Calendar, Film } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import MovieReviews from '../components/MovieReviews'
import { MovieDetailsSkeleton } from '../components/Loading'
import useShow from '../hooks/useShow'
import { useAppContext } from '../context/AppContext'

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { show, loading, error } = useShow(id)
  const { shows } = useAppContext()

  const handleReviewAdded = () => {
    // Quick refresh to get new reviews
    window.location.reload();
  }

  if (loading) return <MovieDetailsSkeleton />

  if (error || !show) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4 animate-fade-in'>
        <div className='p-6 rounded-full bg-gray-800/50'>
          <Film className='w-12 h-12 text-gray-600' />
        </div>
        <h1 className='text-2xl font-semibold'>Movie not found</h1>
        <p className='text-gray-500'>This movie may have been removed</p>
        <button onClick={() => navigate('/movies')} className='mt-2 px-6 py-2.5 bg-primary hover:bg-primary-dull rounded-full transition-all active:scale-95'>
          Browse Movies
        </button>
      </div>
    )
  }

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50 animate-fade-in'>
      <div className='flex flex-col md:flex-row gap-10 max-w-6xl mx-auto'>
        {/* Poster */}
        <div className='relative max-md:mx-auto'>
          <img src={show.movie.poster_path} alt={show.movie.title} className='rounded-2xl h-104 max-w-70 object-cover shadow-2xl shadow-black/50' />
          <div className='absolute -bottom-3 -right-3 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg'>
            ⭐ {show.movie.vote_average.toFixed(1)}
          </div>
        </div>

        {/* Info */}
        <div className='relative flex flex-col gap-4 flex-1'>
          <BlurCircle top="-100px" left="-100px" />

          <span className='inline-block w-max px-3 py-1 text-xs font-medium bg-primary/15 text-primary border border-primary/30 rounded-full uppercase tracking-wider'>
            {show.movie.original_language?.toUpperCase() || 'ENGLISH'}
          </span>

          <h1 className='text-4xl md:text-5xl font-bold max-w-[500px] leading-tight'>{show.movie.title}</h1>

          <div className='flex items-center gap-5 text-gray-400 text-sm flex-wrap'>
            <div className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4' />
              {timeFormat(show.movie.runtime)}
            </div>
            <div className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4' />
              {show.movie.release_date?.split("-")[0]}
            </div>
            <span className='text-gray-600'>•</span>
            <span>{show.movie.genres?.map(genre => genre.name).join(", ")}</span>
          </div>

          <p className='text-gray-400 mt-1 text-sm leading-relaxed max-w-xl'>{show.movie.overview}</p>

          <div className='flex items-center flex-wrap gap-3 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-white/8 hover:bg-white/12 border border-white/10 transition-all duration-200 rounded-full font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className="w-5 h-5" />Xem Trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer active:scale-95 hover:shadow-lg hover:shadow-primary/20'>
              Đặt vé
            </a>
            <button className='bg-white/8 hover:bg-white/12 border border-white/10 p-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 hover:border-primary/30 group'>
              <Heart className='w-5 h-5 group-hover:text-primary transition-colors' />
            </button>
          </div>
        </div>
      </div>

      {/* Cast */}
      {show.movie.casts?.length > 0 && (
        <>
          <p className='text-lg font-semibold mt-20'>Your Favorite Cast</p>
          <div className='overflow-x-auto no-scrollbar mt-6 pb-4'>
            <div className='flex items-center gap-5 w-max'>
              {show.movie.casts.slice(0, 12).map((cast, index) => (
                <div key={index} className='flex flex-col items-center group'>
                  <img src={cast.profile_path} alt={cast.name} className='rounded-full h-20 w-20 object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300' />
                  <p className='font-medium text-xs mt-3 text-gray-400 group-hover:text-white transition-colors text-center max-w-[80px] truncate'>{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <MovieReviews 
        movieId={show.movie._id} 
        reviews={show.movie.reviews || []} 
        onReviewAdded={handleReviewAdded} 
      />

      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Recommendations */}
      <p className='text-lg font-semibold mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8 stagger-children'>
        {shows.filter(m => m._id !== id).slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-16'>
        <button onClick={() => {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-95'>
          Show more
        </button>
      </div>
    </div>
  )
}
export default MovieDetails