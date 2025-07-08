import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>About TravelEase</h1>
      <div className="about-content">
        <section>
          <h2>Our Story</h2>
          <p>
            Founded in 2015, TravelEase began with a simple mission: to make travel planning
            effortless and enjoyable. What started as a small team of travel enthusiasts has
            grown into a trusted platform serving thousands of travelers worldwide.
          </p>
        </section>
        
        <section>
          <h2>Our Mission</h2>
          <p>
            We believe everyone deserves to experience the joy of travel. Our mission is to
            provide exceptional travel experiences at affordable prices, with unparalleled
            customer service.
          </p>
        </section>
        
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-members">
            {/* Team member cards would go here */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;