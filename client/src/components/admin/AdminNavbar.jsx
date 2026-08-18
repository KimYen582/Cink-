import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30 bg-[#090909]'>
      <Link to="/" className='flex items-center'>
        <img
          src={assets.logo}
          alt="CinK"
          className='w-28 h-auto object-contain'
        />
      </Link>
    </div>
  )
}

export default AdminNavbar