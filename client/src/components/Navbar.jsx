import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, LogOutIcon, UserIcon, LayoutDashboardIcon, ChevronDownIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, isLoggedIn, isLoaded, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  // Scroll-aware background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setShowDropdown(false)
  }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Movies', to: '/movies' },
    { label: 'Favorites', to: '/favorites' },
    { label: 'My Bookings', to: '/my-bookings' },
  ]

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    setShowDropdown(false)
    await logout()
    navigate('/')
  }

  // Get user initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <nav className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090B]/90 backdrop-blur-xl shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}>
        <Link to='/' className='max-md:flex-1'>
          <img src={assets.logo} alt='CinK logo' className='w-36 h-auto transition-transform duration-300 hover:scale-105' />
        </Link>

        {/* Desktop + Mobile Nav */}
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur-xl bg-black/80 md:bg-white/8 md:border border-white/10 overflow-hidden transition-all duration-300 ${isOpen ? 'max-md:w-full max-md:opacity-100' : 'max-md:w-0 max-md:opacity-0'}`}>
          <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer hover:text-primary transition-colors' onClick={() => setIsOpen(false)} />
          {navLinks.map((link) => (
            <Link
              key={link.to}
              onClick={() => { scrollTo(0, 0); setIsOpen(false) }}
              to={link.to}
              className={`relative transition-colors duration-200 hover:text-white ${
                isActiveLink(link.to)
                  ? 'text-white after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full'
                  : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <button
            type='button'
            title='Search movies'
            aria-label='Search movies'
            onClick={() => navigate('/movies')}
            className='max-md:hidden p-1 text-gray-400 hover:text-white transition-colors cursor-pointer'
          >
            <SearchIcon className='w-5 h-5' />
          </button>

          {/* Auth section */}
          {!isLoaded ? null : !isLoggedIn ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className='px-5 py-2 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-95'
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="flex items-center gap-2 rounded-full transition-all duration-200 hover:ring-2 hover:ring-purple-500/50 focus:outline-none"
              >
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    {initials}
                  </div>
                )}
                <ChevronDownIcon size={14} className={`text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div
                  className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden py-1 z-50"
                  style={{
                    background: 'rgba(17,17,27,0.97)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                  </div>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/admin') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboardIcon size={15} className="text-purple-400" />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => { setShowDropdown(false); navigate('/my-bookings') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <TicketPlus size={15} className="text-purple-400" />
                    My Bookings
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); navigate('/profile') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserIcon size={15} className="text-purple-400" />
                    Profile
                  </button>

                  <div className="border-t border-white/5 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOutIcon size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer hover:text-primary transition-colors' onClick={() => setIsOpen(!isOpen)} />
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}

export default Navbar