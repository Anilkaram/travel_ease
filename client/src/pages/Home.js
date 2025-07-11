import React from 'react';
// import Login from './pages/Login';
import HeroSection from '../components/HeroSection';
import FeaturedTours from '../components/FeaturedTours';
import PopularDestinations from '../components/PopularDestinations';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

import '../styles/pages/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* <Login/> */}
      <HeroSection />
      <FeaturedTours />
      <PopularDestinations />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;