import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import Favorite from './Favorite'
import Movies from './Movies'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
      <Favorite/>
      <Movies/>
    </div>
  )
}

export default Home