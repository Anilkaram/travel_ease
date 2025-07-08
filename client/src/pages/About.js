import React from 'react';
import '../styles/pages/About.css';

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
            <div className="team-card">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" />
              <h4>John Doe</h4>
              <p>Founder & CEO</p>
            </div>
            <div className="team-card">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Smith" />
              <h4>Jane Smith</h4>
              <p>Head of Operations</p>
            </div>
            <div className="team-card">
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Mike Brown" />
              <h4>Mike Brown</h4>
              <p>Lead Travel Expert</p>
            </div>
            <div className="team-card">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emily White" />
              <h4>Emily White</h4>
              <p>Customer Support</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;