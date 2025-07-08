// client/src/components/TourCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/TourCard.css'; 

const TourCard = ({ tour }) => {
  return (
    <div className="tour-card">
      <img src={tour.image || 'https://placehold.co/300x200?text=Tour'} alt={tour.title} className="tour-image" />
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