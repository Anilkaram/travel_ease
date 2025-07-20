// client/src/components/TourCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import { images } from '../utils/images';
import '../styles/components/TourCard.css'; 

const TourCard = ({ tour }) => {
  // Function to get proper image URL
  const getImageUrl = (tour) => {
    if (tour.image && tour.image.startsWith('http')) {
      return tour.image;
    }
    
    // Map tour location/title to proper images
    const location = tour.location?.toLowerCase() || tour.title?.toLowerCase() || '';
    
    if (location.includes('paris')) return images.paris;
    if (location.includes('rome') || location.includes('italy')) return images.rome;
    if (location.includes('bali')) return images.bali;
    if (location.includes('tokyo') || location.includes('japan')) return images.tokyo;
    if (location.includes('new york') || location.includes('usa')) return images.newYork;
    if (location.includes('sydney') || location.includes('australia')) return images.sydney;
    
    // Default fallback
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80';
  };

  return (
    <div className="tour-card">
      <OptimizedImage 
        src={getImageUrl(tour)} 
        alt={tour.title} 
        className="tour-image"
        width="300"
        height="200"
        loading="lazy"
      />
      <div className="tour-info">
        <h3>{tour.title}</h3>
        <p className="tour-description">{tour.description}</p>
        <div className="tour-meta">
          <span className="tour-duration">{tour.duration}</span>
          <span className="tour-price">{tour.price}</span>
        </div>
        <div className="tour-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < tour.rating ? 'filled' : ''}`}>
              ★
            </span>
          ))}
        </div>
        <Link to={`/tours/${tour.id}`} className="tour-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TourCard;