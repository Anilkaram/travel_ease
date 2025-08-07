import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedDestinations from '../components/FeaturedDestinations';
import PopularDestinations from '../components/PopularDestinations';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

import '../styles/pages/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* <Login/> */}
      <HeroSection />
      <FeaturedDestinations />
      <PopularDestinations />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;