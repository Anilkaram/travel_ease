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
  // Add other destinations...
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
              <button className="explore-btn">Explore Tours</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;