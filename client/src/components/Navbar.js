import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/Navbar.css';
import { images } from '../utils/images';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={images.logo} alt="TravelEase Logo" style={{height: '40px'}} />
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/destinations" className="nav-links" onClick={toggleMenu}>
              Destinations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tours" className="nav-links" onClick={toggleMenu}>
              Tours
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item user-info">
                <span className="nav-links">Welcome, {user?.name || user?.email}</span>
              </li>
              <li className="nav-item">
                <button className="nav-links nav-btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links nav-btn" onClick={toggleMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links nav-btn" onClick={toggleMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;