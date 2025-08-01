import React from 'react';
import TourCard from './TourCard';
import '../styles/components/FeaturedTours.css';
import { images } from '../utils/images';

const FeaturedDestinations = () => {
  const destinations = [
    {
      id: 1,
      title: 'Paris City Tour',
      image: images.paris,
      duration: '7 Days',
      price: '$1200',
      rating: 4.8,
      description: 'Explore the romantic streets of Paris, visit the Eiffel Tower, Louvre Museum, and enjoy French cuisine in charming cafes.'
    },
    {
      id: 2,
      title: 'Italian Adventure',
      image: images.rome,
      duration: '10 Days',
      price: '$1800',
      rating: 4.9,
      description: 'Discover the rich history and culture of Italy, from ancient Rome to the Renaissance art of Florence and Venice.'
    },
    {
      id: 3,
      title: 'Bali Beach Escape',
      image: images.bali,
      duration: '8 Days',
      price: '$1500',
      rating: 4.7,
      description: 'Relax on pristine beaches, explore ancient temples, and experience the unique culture and hospitality of Bali.'
    },
    {
      id: 4,
      title: 'Tokyo Explorer',
      image: images.tokyo,
      duration: '6 Days',
      price: '$1700',
      rating: 4.6,
      description: 'Experience the perfect blend of traditional culture and modern technology in Japan\'s vibrant capital city.'
    },
    {
      id: 5,
      title: 'New York Highlights',
      image: images.newYork,
      duration: '5 Days',
      price: '$1600',
      rating: 4.8,
      description: 'See the best of the Big Apple including Times Square, Central Park, Statue of Liberty, and Broadway shows.'
    },
    {
      id: 6,
      title: 'Sydney Discovery',
      image: images.sydney,
      duration: '7 Days',
      price: '$1550',
      rating: 4.7,
      description: 'Experience the stunning harbor city with its iconic Opera House, beautiful beaches, and vibrant culture.'
    },
  ];

  return (
    <section className="featured-destinations">
      <h2>Featured Destinations</h2>
      <p>Discover our most popular travel destinations</p>
      <div className="destinations-grid">
        {destinations.map(destination => (
          <TourCard key={destination.id} tour={destination} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDestinations;