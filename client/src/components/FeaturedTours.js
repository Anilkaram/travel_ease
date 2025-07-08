import React from 'react';
import TourCard from './TourCard';
import '../styles/components/FeaturedTours.css';
import { images } from '../utils/images';

const FeaturedTours = () => {
  const tours = [
    {
      id: 1,
      title: 'Paris City Tour',
      image: images.paris,
      duration: '7 Days',
      price: '$1200',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Italian Adventure',
      image: images.rome,
      duration: '10 Days',
      price: '$1800',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Bali Beach Escape',
      image: images.bali,
      duration: '8 Days',
      price: '$1500',
      rating: 4.7
    },
    {
      id: 4,
      title: 'Tokyo Explorer',
      image: images.tokyo,
      duration: '6 Days',
      price: '$1700',
      rating: 4.6
    },
    {
      id: 5,
      title: 'New York Highlights',
      image: images.newYork,
      duration: '5 Days',
      price: '$1600',
      rating: 4.8
    },
    {
      id: 6,
      title: 'Sydney Discovery',
      image: images.sydney,
      duration: '7 Days',
      price: '$1550',
      rating: 4.7
    },
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