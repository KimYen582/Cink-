import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { MovieCardSkeleton } from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import { Film } from 'lucide-react'

const Movies = () => {
  const { shows, loading } = useAppContext()

  if (loading) {
    return (
      <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
        <h1 className='text-xl font-semibold my-4'>Now Showing</h1>
        <div className="flex flex-wrap max-sm:justify-center gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1 className='text-xl font-semibold my-4'>Now Showing</h1>
      <p className='text-gray-500 text-sm mb-8'>{shows.length} movies available</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8 stagger-children">
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen gap-4 animate-fade-in'>
      <div className='p-6 rounded-full bg-gray-800/50'>
        <Film className='w-12 h-12 text-gray-600' />
      </div>
      <h1 className='text-2xl font-semibold'>No movies available</h1>
      <p className='text-gray-500'>Check back soon for new releases</p>
    </div>
  )
}

export default Movies
