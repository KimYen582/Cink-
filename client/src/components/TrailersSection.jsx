import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const [activeIndex, setActiveIndex] = useState(0)

    // Generate YouTube thumbnail from URL
    const getYouTubeThumbnail = (url) => {
        const match = url.match(/(?:embed\/|v=)([a-zA-Z0-9_-]{11})/)
        if (match) {
            return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        }
        return null
    }

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <div className='max-w-[960px] mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <p className='text-white font-semibold text-xl'>Latest Trailers</p>
                        <p className='text-gray-500 text-sm mt-1'>Watch the newest movie trailers</p>
                    </div>
                    <span className='text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full'>
                        {activeIndex + 1} / {dummyTrailers.length}
                    </span>
                </div>
            </div>

            <div className='relative mt-2'>
                <BlurCircle top='-100px' right='-100px' />
                <div className='mx-auto max-w-[960px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50'>
                    <ReactPlayer
                        url={currentTrailer.videoUrl}
                        controls={true}
                        className="mx-auto max-w-full"
                        width="960px"
                        height="540px"
                    />
                </div>
            </div>

            {/* Trailer thumbnails */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mt-8 max-w-3xl mx-auto'>
                {dummyTrailers.map((trailer, index) => {
                    const thumbnail = trailer.image || getYouTubeThumbnail(trailer.videoUrl)
                    const isActive = activeIndex === index

                    return (
                        <div
                            key={trailer.id}
                            className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                                isActive
                                    ? 'ring-2 ring-primary scale-[1.02] shadow-lg shadow-primary/20'
                                    : 'hover:-translate-y-1 hover:shadow-lg opacity-70 hover:opacity-100'
                            }`}
                            onClick={() => {
                                setCurrentTrailer(trailer)
                                setActiveIndex(index)
                            }}
                        >
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt={trailer.title || 'Trailer'}
                                    className="w-full h-32 md:h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-32 md:h-36 bg-gray-800 flex items-center justify-center">
                                    <PlayCircleIcon className="w-10 h-10 text-gray-600" />
                                </div>
                            )}

                            {/* Dark overlay */}
                            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isActive ? 'bg-primary/10' : 'group-hover:bg-black/20'}`} />

                            {/* Play icon */}
                            <PlayCircleIcon
                                strokeWidth={1.4}
                                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                                    isActive ? 'w-8 h-8 text-primary' : 'w-7 h-7 text-white/80 group-hover:scale-110'
                                }`}
                            />

                            {/* Title bar */}
                            <div className='absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent'>
                                <p className='text-xs text-white/80 truncate'>{trailer.title}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default TrailersSection