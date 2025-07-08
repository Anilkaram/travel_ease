import React from 'react';
import { images } from '../utils/images';
import '../styles/pages/Destinations.css';

const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: images.paris,
    description: 'The city of love and lights with iconic landmarks like the Eiffel Tower and Louvre Museum.'
  },
  {
    id: 2,
    name: 'Rome, Italy',
    image: images.rome,
    description: 'Experience ancient history, art, and culture in the heart of Italy.'
  },
  {
    id: 3,
    name: 'Bali, Indonesia',
    image: images.bali,
    description: 'A tropical paradise known for its beaches, temples, and vibrant culture.'
  },
  {
    id: 4,
    name: 'Tokyo, Japan',
    image: images.tokyo,
    description: 'A bustling metropolis blending tradition and innovation.'
  },
  {
    id: 5,
    name: 'New York, USA',
    image: images.newYork,
    description: 'The city that never sleeps, full of iconic sights and experiences.'
  },
];

const Destinations = () => {
  return (
    <div className="destinations-page">
      <h1>Explore Our Destinations</h1>
      <div className="destinations-grid">
        {destinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <img src={destination.image} alt={destination.name} />
            <div className="destination-info">
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>
              <a href="/tours" className="explore-btn">Explore Tours</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;