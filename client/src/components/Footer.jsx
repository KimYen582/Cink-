import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Youtube, href: '#' },
  ]

  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-400">
      {/* Top divider with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-14" />

      <div className="flex flex-col md:flex-row justify-between w-full gap-12">

        <div className="md:max-w-sm">
          <img
            className="w-36 h-auto"
            src={assets.logo}
            alt="CinK logo"
          />

          <p className="mt-6 text-sm leading-relaxed">
            CinK – nơi mỗi suất chiếu không chỉ là một bộ phim, mà còn là một câu chuyện, một cảm xúc và một kỷ niệm đáng nhớ.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3 mt-6">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="p-2 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <img
              src={assets.logo1}
              alt="Google Play"
              className="h-9 w-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
            <img
              src={assets.logo2}
              alt="App Store"
              className="h-9 w-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
          </div>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-16 md:gap-24">

          <div>
            <h2 className="font-semibold text-white mb-5">
              Quick Links
            </h2>
            <ul className="text-sm space-y-3">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/movies" className="hover:text-white transition-colors">Movies</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Favorites</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white mb-5">
              Company
            </h2>
            <ul className="text-sm space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-white mb-5">
              Get in touch
            </h2>
            <div className="text-sm space-y-3">
              <p className="hover:text-white transition-colors">+84-123-456-789</p>
              <p className="hover:text-white transition-colors">contact@cink.vn</p>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mt-12" />
      <p className="py-5 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} CinK. All rights reserved.
      </p>

    </footer>
  )
}

export default Footer
