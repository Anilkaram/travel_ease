import React from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import '../styles/components/PopularDestinations.css';
import { images } from '../utils/images';

const PopularDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      imageKey: 'paris',
      tours: 24
    },
    {
      id: 2,
      name: 'Rome',
      imageKey: 'rome',
      tours: 18
    },
    {
      id: 3,
      name: 'Bali',
      imageKey: 'bali',
      tours: 15
    },
    {
      id: 4,
      name: 'Tokyo',
      imageKey: 'tokyo',
      tours: 12
    },
    {
      id: 5,
      name: 'New York',
      imageKey: 'newYork',
      tours: 20
    },
    {
      id: 6,
      name: 'Sydney',
      imageKey: 'sydney',
      tours: 14
    }
  ];

  return (
    <section className="popular-destinations">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <i className="fas fa-globe-americas"></i>
            <span>Trending Now</span>
          </div>
          <h2>Popular Destinations</h2>
          <p>Discover the world's most sought-after travel destinations, handpicked by our travel experts</p>
        </div>
        
        <div className="destinations-grid">
          {destinations.map(destination => (
            <div key={destination.id} className="destination-card">
              <div className="card-image-wrapper">
                <SmartImage 
                  imageKey={destination.imageKey}
                  alt={destination.name} 
                  className="destination-image"
                  width="350"
                  height="200"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="tours-badge">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{destination.tours} tours</span>
                  </div>
                </div>
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p className="tours-text">{destination.tours} amazing experiences await</p>
                <Link to={`/destinations/${destination.id}`} className="explore-btn">
                  <span>Explore Now</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="bg-pattern">
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
      </div>
    </section>
  );
};

export default PopularDestinations;