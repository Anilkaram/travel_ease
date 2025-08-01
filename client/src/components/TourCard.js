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

  // Ensure all required data is available with fallbacks
  const tourTitle = tour.title || tour.name || 'Adventure Tour';
  const tourPrice = tour.price || '$999';
  const tourDuration = tour.duration || '5 Days';
  const tourRating = tour.rating || 4.5;
  const tourDescription = tour.description || 'Experience an amazing adventure with breathtaking views and unforgettable memories.';

  return (
    <div className="tour-card">
      <div className="tour-image-container">
        <OptimizedImage 
          src={getImageUrl(tour)} 
          alt={tourTitle} 
          className="tour-image"
          width="300"
          height="200"
          loading="lazy"
        />
        <div className="tour-price-badge">{tourPrice}</div>
      </div>
      <div className="tour-info">
        <h3 className="tour-title">{tourTitle}</h3>
        <p className="tour-description">{tourDescription}</p>
        <div className="tour-meta">
          <div className="tour-duration">
            <i className="fas fa-clock"></i>
            <span>{tourDuration}</span>
          </div>
          <div className="tour-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(tourRating) ? 'filled' : ''}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="rating-number">({tourRating})</span>
          </div>
        </div>
        <Link to={`/destinations/${tour.id}`} className="tour-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TourCard;