import React, { useState, useEffect } from 'react';
import '../styles/components/HeroSection.css';
import { images } from '../utils/images';

const HeroSection = () => {
  const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=95&auto=format&fit=crop&ixlib=rb-4.0.3', // Bright mountain lake
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200&q=95&auto=format&fit=crop&ixlib=rb-4.0.3', // Colorful sunset beach
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=95&auto=format&fit=crop&ixlib=rb-4.0.3', // Vibrant aurora
    'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=1200&q=95&auto=format&fit=crop&ixlib=rb-4.0.3'  // Bright city lights
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
          key={image}
          className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image})`
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
        {backgroundImages.map((image, index) => (
          <button
            key={image}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;