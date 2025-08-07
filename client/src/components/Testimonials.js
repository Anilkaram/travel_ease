import React from 'react';
import '../styles/components/Testimonials.css';
import { images } from '../utils/images';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'HemaSree',
      location: 'Hyderabad, India',
      text: 'TravelEase made our vacation unforgettable! The guides were knowledgeable and the itinerary was perfectly crafted. Every moment was magical and exceeded all our expectations.',
      rating: 5,
      image: images.testimonial1
    },
    {
      id: 2,
      name: 'Anilkumar',
      location: 'Bangalore, India',
      text: 'Best travel experience ever! Everything was well-organized and the attention to detail was incredible. The team went above and beyond to make our journey extraordinary.',
      rating: 5,
      image: images.testimonial2
    },
    {
      id: 3,
      name: 'Rakesh',
      location: 'Mumbai, India',
      text: 'The tour packages are worth every penny! Professional service, amazing destinations, and memories that will last a lifetime. We will definitely book with TravelEase again!',
      rating: 5,
      image: images.testimonial3
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <i className="fas fa-heart"></i>
            <span>Customer Love</span>
          </div>
          <h2>What Our Travelers Say</h2>
          <p className="subtitle">Real experiences from real travelers who trusted us with their dream journeys</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={`${testimonial.id}-star-${i + 1}`} className="star">★</span>
                  ))}
                </div>
              </div>
              <div className="testimonial-footer">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="testimonial-image"
                  />
                  <div className="avatar-ring"></div>
                </div>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;