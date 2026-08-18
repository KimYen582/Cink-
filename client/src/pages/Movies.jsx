import React, { useState, useMemo } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { MovieCardSkeleton } from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import { Film, Search, Filter } from 'lucide-react'

const Movies = () => {
  const { shows, loading } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [sortType, setSortType] = useState('Newest')

  // Extract unique genres from shows
  const allGenres = useMemo(() => {
    const genres = new Set(['All'])
    shows.forEach(show => {
      show.movie?.genres?.forEach(g => genres.add(g.name))
    })
    return Array.from(genres)
  }, [shows])

  // Filter and sort shows
  const filteredShows = useMemo(() => {
    let result = [...shows]

    // Search filter
    if (searchTerm) {
      result = result.filter(show => 
        show.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Genre filter
    if (genreFilter !== 'All') {
      result = result.filter(show => 
        show.movie?.genres?.some(g => g.name === genreFilter)
      )
    }

    // Sorting
    result.sort((a, b) => {
      if (sortType === 'Newest') {
        return new Date(b.movie?.release_date) - new Date(a.movie?.release_date)
      } else if (sortType === 'Oldest') {
        return new Date(a.movie?.release_date) - new Date(b.movie?.release_date)
      } else if (sortType === 'Rating (High-Low)') {
        return (b.movie?.vote_average || 0) - (a.movie?.vote_average || 0)
      }
      return 0
    })

    return result
  }, [shows, searchTerm, genreFilter, sortType])

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

  return (
    <div className='relative my-32 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] animate-fade-in'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className='text-2xl font-bold'>Now Showing</h1>
          <p className='text-gray-500 text-sm mt-1'>{filteredShows.length} movies match your criteria</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-primary w-full sm:w-60 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="pl-4 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                {allGenres.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            <select 
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer text-center"
            >
              <option value="Newest" className="bg-gray-900">Newest</option>
              <option value="Oldest" className="bg-gray-900">Oldest</option>
              <option value="Rating (High-Low)" className="bg-gray-900">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {filteredShows.length > 0 ? (
        <div className="flex flex-wrap max-sm:justify-center gap-8 stagger-children">
          {filteredShows.map((show) => (
            <MovieCard movie={show} key={show._id} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 gap-4 animate-fade-in'>
          <div className='p-6 rounded-full bg-gray-800/50'>
            <Film className='w-12 h-12 text-gray-600' />
          </div>
          <h1 className='text-2xl font-semibold'>No movies found</h1>
          <p className='text-gray-500'>Try adjusting your search or filters</p>
          <button 
            onClick={() => { setSearchTerm(''); setGenreFilter('All'); }}
            className='mt-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm'
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Movies
