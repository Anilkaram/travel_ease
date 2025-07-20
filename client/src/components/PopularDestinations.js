import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import '../styles/components/PopularDestinations.css';
import { images } from '../utils/images';

const PopularDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      image: images.paris,
      tours: 24
    },
    {
      id: 2,
      name: 'Rome',
      image: images.rome,
      tours: 18
    },
    {
      id: 3,
      name: 'Bali',
      image: images.bali,
      tours: 15
    },
    {
      id: 4,
      name: 'Tokyo',
      image: images.tokyo,
      tours: 12
    },
    {
      id: 5,
      name: 'New York',
      image: images.newYork,
      tours: 20
    },
    {
      id: 6,
      name: 'Sydney',
      image: images.sydney,
      tours: 14
    }
  ];

  return (
    <section className="popular-destinations">
      <div className="container">
        <h2>Popular Destinations</h2>
        <p>Explore our most popular travel destinations</p>
        
        <div className="destinations-grid">
          {destinations.map(destination => (
            <div key={destination.id} className="destination-card">
              <OptimizedImage 
                src={destination.image} 
                alt={destination.name} 
                className="destination-image"
                width="350"
                height="200"
                loading="lazy"
              />
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p>{destination.tours} tours available</p>
                <Link to={`/destinations/${destination.id}`} className="explore-btn">
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;