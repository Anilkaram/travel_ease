import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import '../styles/components/PopularDestinations.css';
// The new destinations list (should be fetched from backend in production)
const allDestinations = [
  { name: 'Kerala', location: 'India', description: 'God’s Own Country with serene backwaters and lush greenery.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Paris', location: 'France', description: 'The city of lights, romance, and world-famous cuisine and art.', image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&q=80' },
  { name: 'London', location: 'United Kingdom', description: 'A vibrant city with rich history, iconic landmarks, and diverse culture.', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80' },
  { name: 'New York City', location: 'USA', description: 'The city that never sleeps, with iconic landmarks and diverse culture.', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { name: 'Dubai', location: 'United Arab Emirates', description: 'A futuristic city with luxury shopping and modern architecture.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { name: 'Bangkok', location: 'Thailand', description: 'A city known for ornate shrines and vibrant street life.', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80' },
  { name: 'Singapore', location: 'Singapore', description: 'A global financial center with a tropical climate and multicultural population.', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80' },
  { name: 'Hong Kong', location: 'China', description: 'A vibrant city known for its skyscraper-studded skyline and deep natural harbor.', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&q=80' },
  { name: 'Macau', location: 'China', description: 'Known for its giant casinos and extravagant malls.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Istanbul', location: 'Turkey', description: 'A city straddling Europe and Asia across the Bosphorus Strait.', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
  { name: 'Kuala Lumpur', location: 'Malaysia', description: 'Malaysia’s capital, known for its modern skyline and the iconic Petronas Twin Towers.', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80' },
  { name: 'Tokyo', location: 'Japan', description: 'A blend of modern skyscrapers, historic temples, and cherry blossoms.', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&q=80' },
  { name: 'Seoul', location: 'South Korea', description: 'A city where modern skyscrapers, high-tech subways and pop culture meet Buddhist temples.', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&q=80' },
  { name: 'Orlando', location: 'USA', description: 'Home to more than a dozen theme parks, including Walt Disney World and Universal Studios.', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { name: 'Washington D.C.', location: 'USA', description: 'The U.S. capital, filled with iconic monuments and museums.', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80' },
  { name: 'Los Angeles', location: 'USA', description: 'Known for its Mediterranean climate, ethnic diversity, Hollywood, and the entertainment industry.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80' },
  { name: 'Osaka', location: 'Japan', description: 'A vibrant Japanese city famous for its food culture, historic castles, and modern attractions.', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80' },
  { name: 'Vienna', location: 'Austria', description: 'The elegant capital known for its imperial architecture, classical music heritage, and coffee culture.', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80' }
];

function getRandomDestinations(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const PopularDestinations = () => {
  const [popular, setPopular] = useState([]);
  useEffect(() => {
    setPopular(getRandomDestinations(allDestinations, 8));
  }, []);

  return (
    <section className="popular-destinations">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <i className="fas fa-globe-americas"></i>
            <span>Trending Now</span>
          </div>
          <h2>Popular Destinations</h2>
          <p>Discover the world's most sought-after travel destinations, handpicked by our travel experts</p>
        </div>
        <div className="destinations-grid">
          {popular.map((destination) => (
            <div key={destination.name} className="destination-card">
              <OptimizedImage src={destination.image} alt={destination.name} width="350" height="200" />
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Background decorative elements */}
      <div className="bg-pattern">
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
        <div className="pattern-dot"></div>
      </div>
    </section>
  );
};

export default PopularDestinations;