import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/PopularDestinations.css';

const PopularDestinations = () => {
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      image: 'https://placehold.co/300x200?text=Paris',
      tours: 24
    },
    {
      id: 2,
      name: 'Rome',
      image: 'https://placehold.co/300x200?text=Rome',
      tours: 18
    },
    {
      id: 3,
      name: 'Bali',
      image: 'https://placehold.co/300x200?text=Bali',
      tours: 15
    },
    {
      id: 4,
      name: 'Tokyo',
      image: 'https://placehold.co/300x200?text=Tokyo',
      tours: 12
    },
    {
      id: 5,
      name: 'New York',
      image: 'https://placehold.co/300x200?text=New+York',
      tours: 20
    },
    {
      id: 6,
      name: 'Sydney',
      image: 'https://placehold.co/300x200?text=Sydney',
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
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="destination-image"
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