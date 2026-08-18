import React from 'react'

const Loading = () => {
    return (
        <div className='flex justify-center items-center h-[80vh]'>
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="relative">
                    <div className='animate-spin rounded-full h-14 w-14 border-2 border-gray-700 border-t-primary'></div>
                    <div className='absolute inset-0 animate-spin rounded-full h-14 w-14 border-2 border-transparent border-b-primary/30' style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
            </div>
        </div>
    )
}

/**
 * Skeleton component for content placeholder loading
 */
export const MovieCardSkeleton = () => (
    <div className="flex flex-col p-3 rounded-2xl w-66 bg-gray-800/50">
        <div className="skeleton h-52 w-full rounded-lg" />
        <div className="skeleton h-5 w-3/4 mt-3" />
        <div className="skeleton h-4 w-1/2 mt-2" />
        <div className="flex items-center justify-between mt-4 pb-3">
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-4 w-10" />
        </div>
    </div>
)

export const MovieDetailsSkeleton = () => (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            <div className="skeleton max-md:mx-auto h-104 w-70 rounded-xl" />
            <div className="flex flex-col gap-4 flex-1">
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-10 w-3/4" />
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-20 w-full max-w-xl" />
                <div className="skeleton h-5 w-60" />
                <div className="flex gap-4 mt-4">
                    <div className="skeleton h-12 w-36 rounded-md" />
                    <div className="skeleton h-12 w-28 rounded-md" />
                    <div className="skeleton h-12 w-12 rounded-full" />
                </div>
            </div>
        </div>
    </div>
)

export default Loading