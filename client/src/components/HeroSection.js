import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
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
    </section>
  );
};

export default HeroSection;