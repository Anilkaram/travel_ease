import React, { useState } from 'react';
import '../styles/pages/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-envelope"></i>
            <span>Get in Touch</span>
          </div>
          <h1>Contact Us</h1>
          <p className="hero-subtitle">Your next adventure starts with a conversation</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-header">
                <div className="section-badge">
                  <i className="fas fa-headset"></i>
                  <span>Support</span>
                </div>
                <h2>Let's Start Planning Your Journey</h2>
                <p>
                  Have questions about our destinations or need help with your booking?
                  Our experienced travel consultants are here to turn your travel dreams into reality.
                </p>
              </div>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-content">
                    <h4>Email Us</h4>
                    <p>info@travelease.com</p>
                    <span>We'll respond within 2 hours</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-content">
                    <h4>Call Us</h4>
                    <p>+91 9876543210</p>
                    <span>Mon-Fri, 9AM-6PM IST</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-content">
                    <h4>Visit Our Office</h4>
                    <p>Hyderabad, Telangana, India</p>
                    <span>By appointment only</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="method-content">
                    <h4>Live Chat</h4>
                    <p>Available 24/7</p>
                    <span>Instant support</span>
                  </div>
                </div>
              </div>

              <div className="social-connect">
                <h3>Follow Our Journey</h3>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-header">
                  <h3>Send us a Message</h3>
                  <p>Fill out the form below and we'll get back to you shortly</p>
                </div>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      <i className="fas fa-user"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <i className="fas fa-tag"></i>
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="destinations">Destination Information</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <i className="fas fa-comment-alt"></i>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your travel plans or how we can help..."
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;