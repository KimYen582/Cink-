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
          {/* Unused icons removed as requested */}
      </div>
    </div>
  )
}

export default AdminNavbar