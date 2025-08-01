import React, { useState, useEffect } from 'react';
import '../styles/components/HeroSection.css';
import { images } from '../utils/images';

const HeroSection = () => {
  const backgroundImages = [
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="hero-section">
      {/* Background images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image}) no-repeat center center/cover`
          }}
        />
      ))}
      
      {/* Content */}
      <div className="hero-content">
        <h1>Discover Amazing Places Around The World</h1>
        <p>Find and book unique travel experiences at the best prices</p>
        <div className="search-box">
          <input type="text" placeholder="Where to?" />
          <input type="date" placeholder="When?" />
          <select>
            <option value="">Travel Type</option>
            <option value="adventure">Adventure</option>
            <option value="beach">Beach</option>
            <option value="cultural">Cultural</option>
          </select>
          <button className="search-btn">Search</button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="slide-indicators">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;