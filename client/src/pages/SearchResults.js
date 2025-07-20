import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import OptimizedImage from '../components/OptimizedImage';
import { apiConfig } from '../config/api';
import { images } from '../utils/images';
import '../styles/pages/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    tours: [],
    destinations: [],
    suggestions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';

  // Function to get proper destination image URL
  const getDestinationImageUrl = (destination) => {
    if (destination.image && destination.image.startsWith('http') && !destination.image.includes('placehold')) {
      return destination.image;
    }
    
    // Map destination name to proper images
    const name = destination.name?.toLowerCase() || '';
    
    if (name.includes('paris')) return images.paris;
    if (name.includes('rome')) return images.rome;
    if (name.includes('bali')) return images.bali;
    if (name.includes('tokyo')) return images.tokyo;
    if (name.includes('new york')) return images.newYork;
    if (name.includes('sydney')) return images.sydney;
    
    // Default fallback
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80';
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiConfig.endpoints.search}?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setSearchResults(data.data);
        } else {
          setError('Failed to fetch search results');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Error occurred while searching. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const getTotalResults = () => {
    return searchResults.tours.length + searchResults.destinations.length;
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Searching for "{query}"...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          <h1>Search Results</h1>
          {query && (
            <p className="search-query">
              {getTotalResults() > 0 
                ? `Found ${getTotalResults()} result${getTotalResults() !== 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}

        {!query.trim() && (
          <div className="no-query">
            <i className="fas fa-search"></i>
            <h3>Please enter a search term</h3>
            <p>Use the search bar above to find tours and destinations</p>
          </div>
        )}

        {query.trim() && getTotalResults() === 0 && !error && (
          <div className="no-results">
            <i className="fas fa-map-marked-alt"></i>
            <h3>No results found</h3>
            <p>We couldn't find any tours or destinations matching "{query}"</p>
            <div className="suggestions-section">
              <h4>Try searching for:</h4>
              <ul>
                <li>Popular destinations like "Paris", "Rome", "Bali"</li>
                <li>Tour types like "City Tour", "Beach Escape"</li>
                <li>Countries or cities</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tours Section */}
        {searchResults.tours.length > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-map-marked-alt"></i>
                Tours ({searchResults.tours.length})
              </h2>
            </div>
            <div className="tours-grid">
              {searchResults.tours.map(tour => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          </section>
        )}

        {/* Destinations Section */}
        {searchResults.destinations.length > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-map-marker-alt"></i>
                Destinations ({searchResults.destinations.length})
              </h2>
            </div>
            <div className="destinations-grid">
              {searchResults.destinations.map(destination => (
                <div key={destination._id} className="destination-card">
                  <OptimizedImage 
                    src={getDestinationImageUrl(destination)} 
                    alt={destination.name} 
                    className="destination-image"
                    width="350"
                    height="220"
                    loading="lazy"
                  />
                  <div className="destination-info">
                    <h3>{destination.name}</h3>
                    <p className="destination-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {destination.location}
                    </p>
                    <p className="destination-description">{destination.description}</p>
                    <Link to={`/destinations/${destination._id}`} className="explore-btn">
                      <i className="fas fa-arrow-right"></i>
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Searches Section */}
        {searchResults.suggestions.length > 0 && (
          <section className="suggestions-section">
            <h3>You might also be interested in:</h3>
            <div className="suggestions-grid">
              {searchResults.suggestions.map((suggestion, index) => (
                <Link 
                  key={index}
                  to={`/search?q=${encodeURIComponent(suggestion.value)}`}
                  className="suggestion-link"
                >
                  <i className={`fas ${
                    suggestion.type === 'tour' ? 'fa-map-marked-alt' :
                    suggestion.type === 'destination' ? 'fa-map-marker-alt' :
                    'fa-location-arrow'
                  }`}></i>
                  <span>{suggestion.value}</span>
                  <small>{suggestion.category}</small>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
