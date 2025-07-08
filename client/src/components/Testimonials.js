import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'TravelEase made our vacation unforgettable! The guides were knowledgeable and the itinerary was perfect.',
      rating: 5,
      image: '/images/testimonial1.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Toronto, Canada',
      text: 'Best travel experience ever! Everything was well-organized and exceeded our expectations.',
      rating: 5,
      image: '/images/testimonial2.jpg'
    },
    {
      id: 3,
      name: 'Emma Williams',
      location: 'London, UK',
      text: 'The tour packages are worth every penny. We will definitely book with TravelEase again!',
      rating: 4,
      image: '/images/testimonial3.jpg'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2>What Our Travelers Say</h2>
        <p className="subtitle">Hear from our satisfied customers</p>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="testimonial-image"
                />
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.location}</p>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;