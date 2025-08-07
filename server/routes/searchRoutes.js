const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Unified search endpoint - destinations only
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Destination search query received:', q);

    if (!q) {
      return res.status(200).json({
        status: 'success',
        data: {
          destinations: [],
          suggestions: []
        }
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    // Search destinations
    const destinations = await Destination.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex },
        { description: searchRegex }
      ]
    }).limit(20);

    // Create suggestions from destinations
    const suggestions = [];
    
    // Add destination names and locations as suggestions
    destinations.forEach(destination => {
      if (!suggestions.some(s => s.value.toLowerCase() === destination.name.toLowerCase())) {
        suggestions.push({
          type: 'destination',
          value: destination.name,
          id: destination._id,
          category: 'Destinations'
        });
      }
      if (destination.location && !suggestions.some(s => s.value.toLowerCase() === destination.location.toLowerCase())) {
        suggestions.push({
          type: 'location',
          value: destination.location,
          category: 'Locations'
        });
      }
    });

    console.log(`Found ${destinations.length} destinations, ${suggestions.length} suggestions for query "${q}"`);

    res.status(200).json({
      status: 'success',
      query: q,
      data: {
        destinations,
        suggestions: suggestions.slice(0, 10) // Limit suggestions to 10
      }
    });
  } catch (err) {
    console.error('Destination search error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get search suggestions (for autocomplete) - destinations only
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    // Get destination names and locations
    const destinations = await Destination.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex }
      ]
    }).select('name location').limit(10);

    const suggestions = [];

    destinations.forEach(destination => {
      if (destination.name.match(searchRegex) && !suggestions.some(s => s.value.toLowerCase() === destination.name.toLowerCase())) {
        suggestions.push({
          type: 'destination',
          value: destination.name,
          category: 'Destinations'
        });
      }
      if (destination.location && destination.location.match(searchRegex) && !suggestions.some(s => s.value.toLowerCase() === destination.location.toLowerCase())) {
        suggestions.push({
          type: 'location',
          value: destination.location,
          category: 'Locations'
        });
      }
    });

    res.status(200).json({
      status: 'success',
      data: suggestions.slice(0, 8) // Limit to 8 suggestions
    });
  } catch (err) {
    console.error('Search suggestions error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;
