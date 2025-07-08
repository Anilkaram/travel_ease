import React from 'react';
import TourCard from '../components/TourCard';
import '../styles/pages/Tours.css';

const Tours = () => {
  const { paris, rome, bali, tokyo, newYork } = require('../utils/images').images;
  const tours = [
    {
      id: 1,
      title: 'Paris City Tour',
      description: 'Explore the romantic city of Paris with our guided tour',
      duration: '7 Days',
      price: '$1200',
      image: paris,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Italian Adventure',
      description: 'Discover the beauty of Rome, Florence and Venice',
      duration: '10 Days',
      price: '$1800',
      image: rome,
      rating: 4.9
    },
    {
      id: 3,
      title: 'Bali Beach Escape',
      description: 'Relax on the beautiful beaches of Bali and enjoy the local culture',
      duration: '8 Days',
      price: '$1500',
      image: bali,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Tokyo Explorer',
      description: 'Experience the vibrant city life and traditions of Tokyo',
      duration: '6 Days',
      price: '$1700',
      image: tokyo,
      rating: 4.6
    },
    {
      id: 5,
      title: 'New York Highlights',
      description: 'See the best of New York City with our expert guides',
      duration: '5 Days',
      price: '$1600',
      image: newYork,
      rating: 4.8
    },
  ];

  return (
    <div className="tours-page">
      <h1>Our Tour Packages</h1>
      <p>Discover our carefully curated travel experiences</p>
      <div className="tours-grid">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default Tours;