import React from 'react';
import TourCard from './TourCard';
import '../styles/components/FeaturedTours.css';

const FeaturedTours = () => {
  const tours = [
    {
      id: 1,
      title: 'Paris City Tour',
      image: 'https://placehold.co/300x200?text=Paris',
      duration: '7 Days',
      price: '$1200',
      rating: 4.8
    },
    // More tour objects...
  ];

  return (
    <section className="featured-tours">
      <h2>Featured Tours</h2>
      <p>Check out our most popular tours</p>
      <div className="tours-grid">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedTours;