import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import withLazyLoading from './components/LazyWrapper';
import RoutePreloader from './components/RoutePreloader';
import PerformanceMonitor from './components/PerformanceMonitor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/main.css';

// Lazy load components for better performance
const Home = withLazyLoading(() => import('./pages/Home'));
const Login = withLazyLoading(() => import('./pages/Login'));
const Register = withLazyLoading(() => import('./pages/Register'));
const Destinations = withLazyLoading(() => import('./pages/Destinations'));
const Tours = withLazyLoading(() => import('./pages/Tours'));
const About = withLazyLoading(() => import('./pages/About'));
const Contact = withLazyLoading(() => import('./pages/Contact'));
const SearchResults = withLazyLoading(() => import('./pages/SearchResults'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <PerformanceMonitor />
          <Navbar />
          <RoutePreloader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            {/* Protected route - only accessible when logged in */}
            <Route path="/contact" element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;