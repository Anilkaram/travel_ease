import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import OptimizedImage from '../components/OptimizedImage';
import { apiConfig } from '../config/api';
import { images } from '../utils/images';
import '../styles/pages/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({
    destinations: [],
    suggestions: []
  });
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
        return;
      }

      setError(null);

      try {
        const response = await fetch(`${apiConfig.endpoints.search}?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          // Only keep destinations
          setSearchResults({
            destinations: data.data.destinations || [],
            suggestions: data.data.suggestions || []
          });
        } else {
          setError('Failed to fetch search results');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Error occurred while searching. Please try again.');
      }
    };

    fetchSearchResults();
  }, [query]);

  // Helper to get total results
  const getTotalResults = () => searchResults.destinations.length;

  // Helper to get search results message
  const getSearchMessage = () => {
    const totalResults = getTotalResults();
    if (totalResults > 0) {
      const pluralSuffix = totalResults !== 1 ? 's' : '';
      return `Found ${totalResults} result${pluralSuffix} for "${query}"`;
    } else {
      return `No results found for "${query}"`;
    }
  };

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          <h1>Search Results</h1>
          {query && (
            <p className="search-query">
              {getSearchMessage()}
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
            <p>Use the search bar above to find destinations</p>
          </div>
        )}

        {query.trim() && getTotalResults() === 0 && !error && (
          <div className="no-results">
            <i className="fas fa-map-marked-alt"></i>
            <h3>No results found</h3>
            <p>We couldn't find any destinations matching "{query}"</p>
            <div className="suggestions-section">
              <h4>Try searching for:</h4>
              <ul>
                <li>Popular destinations like "Paris", "Rome", "Bali"</li>
                <li>Countries or cities</li>
              </ul>
            </div>
          </div>
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
                <div key={destination._id || destination.name} className="destination-card">
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
                    <Link to={`/destinations/${destination._id || destination.name}`} className="explore-btn">
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
