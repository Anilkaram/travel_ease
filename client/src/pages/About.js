import React from 'react';
import '../styles/pages/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-compass"></i>
            <span>Our Journey</span>
          </div>
          <h1>About TravelEase</h1>
          <p className="hero-subtitle">Crafting extraordinary travel experiences since 2025</p>
        </div>
      </div>

      <div className="about-content">
        <section className="story-section">
          <div className="container">
            <div className="content-wrapper">
              <div className="text-content">
                <div className="section-badge">
                  <i className="fas fa-rocket"></i>
                  <span>Our Beginning</span>
                </div>
                <h2>Our Story</h2>
                <p>
                  Founded in 2025, TravelEase began with a simple yet powerful mission: to make travel planning
                  effortless and enjoyable for everyone. What started as a small team of passionate travel enthusiasts has
                  grown into a trusted platform serving thousands of travelers worldwide, creating memories that last a lifetime.
                </p>
                <p>
                  Our journey is built on the belief that travel opens minds, connects cultures, and transforms lives.
                  Every destination we offer is carefully curated to provide authentic, enriching experiences.
                </p>
              </div>
              <div className="visual-content">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">25K+</div>
                    <div className="stat-label">Happy Travelers</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">150+</div>
                    <div className="stat-label">Destinations</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <div className="section-badge">
                <i className="fas fa-heart"></i>
                <span>Our Purpose</span>
              </div>
              <h2>Our Mission</h2>
              <p>
                We believe everyone deserves to experience the transformative power of travel. Our mission is to
                provide exceptional travel experiences at accessible prices, with unparalleled customer service
                and attention to detail that exceeds expectations.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <div className="point-icon">
                    <i className="fas fa-globe"></i>
                  </div>
                  <div className="point-content">
                    <h4>Global Accessibility</h4>
                    <p>Making world-class travel experiences accessible to everyone</p>
                  </div>
                </div>
                <div className="mission-point">
                  <div className="point-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="point-content">
                    <h4>Trust & Safety</h4>
                    <p>Your safety and satisfaction are our highest priorities</p>
                  </div>
                </div>
                <div className="mission-point">
                  <div className="point-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <div className="point-content">
                    <h4>Sustainable Travel</h4>
                    <p>Promoting responsible tourism that respects local communities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-users"></i>
                <span>Our Team</span>
              </div>
              <h2>Meet Our Travel Experts</h2>
              <p>The passionate individuals behind your extraordinary journeys</p>
            </div>
            <div className="team-members">
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Anilkumar" />
                  <div className="team-overlay">
                    <div className="social-links">
                      <a href="#"><i className="fab fa-linkedin"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h4>Anilkumar</h4>
                  <p className="team-role">Founder & CEO</p>
                  <p className="team-bio">Visionary leader with 10+ years in travel industry</p>
                </div>
              </div>
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Rakesh" />
                  <div className="team-overlay">
                    <div className="social-links">
                      <a href="#"><i className="fab fa-linkedin"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h4>Rakesh</h4>
                  <p className="team-role">Head of Operations</p>
                  <p className="team-bio">Operations expert ensuring seamless travel experiences</p>
                </div>
              </div>
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Vigneshwar" />
                  <div className="team-overlay">
                    <div className="social-links">
                      <a href="#"><i className="fab fa-linkedin"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h4>Vigneshwar</h4>
                  <p className="team-role">Lead Travel Expert</p>
                  <p className="team-bio">Destination specialist with extensive global knowledge</p>
                </div>
              </div>
              <div className="team-card">
                <div className="team-image-wrapper">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Hema Sree" />
                  <div className="team-overlay">
                    <div className="social-links">
                      <a href="#"><i className="fab fa-linkedin"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h4>HemaSree</h4>
                  <p className="team-role">Customer Experience Lead</p>
                  <p className="team-bio">Dedicated to ensuring exceptional customer satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;