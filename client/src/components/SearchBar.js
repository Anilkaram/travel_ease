import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConfig } from '../config/api';
import '../styles/components/SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${apiConfig.endpoints.search}/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setSuggestions(data.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    try {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    handleSearch(suggestion.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const getSuggestionIcon = (suggestionType) => {
    if (suggestionType === 'tour') {
      return 'fa-map-marked-alt';
    } else if (suggestionType === 'destination') {
      return 'fa-map-marker-alt';
    } else {
      return 'fa-location-arrow';
    }
  };

  const renderSuggestionContent = () => {
    if (isLoading) {
      return (
        <div className="suggestion-item loading">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Searching...</span>
        </div>
      );
    }

    if (suggestions.length > 0) {
      return suggestions.map((suggestion) => (
        <div
          key={suggestion.value}
          className="suggestion-item"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          <div className="suggestion-content">
            <i className={`fas ${getSuggestionIcon(suggestion.type)}`}></i>
            <span className="suggestion-text">{suggestion.value}</span>
            <span className="suggestion-category">{suggestion.category}</span>
          </div>
        </div>
      ));
    }

    if (searchQuery.length >= 2) {
      return (
        <div className="suggestion-item no-results">
          <i className="fas fa-exclamation-circle"></i>
          <span>No suggestions found</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search tours, destinations..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
        />
        <button
          className="search-button"
          onClick={() => handleSearch()}
          disabled={!searchQuery.trim()}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {renderSuggestionContent()}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
