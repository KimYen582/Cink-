import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useUser, useClerk, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isLoaded } = useUser()
  const { openSignIn, signOut } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()

  // Scroll-aware background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

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

  return (
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

      <div className='flex items-center gap-6'>
        <SearchIcon className='max-md:hidden w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition-colors' />
        {
          !user ? (
            <button onClick={openSignIn} className='px-5 py-2 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition-all duration-200 rounded-full font-medium cursor-pointer hover:shadow-lg hover:shadow-primary/20 active:scale-95'>Login</button>
          ) : (
              <UserButton>
                <UserButton.MenuItems>
                  {/* Show Admin Dashboard link if user is admin */}
                  {(user?.publicMetadata?.role === 'admin' || user?.unsafeMetadata?.role === 'admin' || user?.privateMetadata?.role === 'admin') && (
                    <UserButton.Action label='Admin Dashboard' labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>} onClick={() => navigate('/admin')} />
                  )}
                  <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-bookings')} />
                  <UserButton.Action label='Profile Settings' labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-cog"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 11v2"/><path d="M19 17v2"/><path d="m21.7 14.3-1.4.8"/><path d="m16.3 16.7-1.4.8"/><path d="m21.7 15.7-1.4-.8"/><path d="m16.3 13.3-1.4-.8"/></svg>} onClick={() => navigate('/profile')} />
                </UserButton.MenuItems>
              </UserButton >
          )
        }
      </div>
      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer hover:text-primary transition-colors' onClick={() => setIsOpen(!isOpen)} />
    </nav>
  )
}

export default Navbar