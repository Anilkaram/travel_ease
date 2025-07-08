import React from 'react';
import TourCard from '../components/TourCard';
import '../styles/pages/Tours.css';

const Tours = () => {
  const tours = [
    {
      id: 1,
      title: 'Paris City Tour',
      description: 'Explore the romantic city of Paris with our guided tour',
      duration: '7 Days',
      price: '$1200',
      image: 'paris.jpg',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Italian Adventure',
      description: 'Discover the beauty of Rome, Florence and Venice',
      duration: '10 Days',
      price: '$1800',
      image: 'italy.jpg',
      rating: 4.9
    },
    // Add more tours as needed
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