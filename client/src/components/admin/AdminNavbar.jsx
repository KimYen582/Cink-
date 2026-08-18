import React from 'react'
import { Link } from 'react-router-dom'
import { BellIcon, SettingsIcon } from 'lucide-react'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50'>
      <Link to="/" className='flex items-center group'>
        <img
          src={assets.logo}
          alt="CinK"
          className='w-28 h-auto object-contain group-hover:scale-105 transition-transform duration-300'
        />
      </Link>
      
      <div className='flex items-center gap-4'>
          <button className='relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5'>
              <BellIcon className='w-5 h-5' />
              <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-[#09090b]' />
          </button>
          <button className='p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5'>
              <SettingsIcon className='w-5 h-5' />
          </button>
      </div>
    </div>
  )
}

export default AdminNavbar