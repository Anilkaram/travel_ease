const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const Destination = require('../models/Destination');

// Unified search endpoint
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Unified search query received:', q);

    if (!q) {
      return res.status(200).json({
        status: 'success',
        data: {
          tours: [],
          destinations: [],
          suggestions: []
        }
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');

    // Search tours
    const tours = await Tour.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ]
    }).limit(10);

    // Search destinations
    const destinations = await Destination.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10);

    // Create suggestions combining both tours and destinations
    const suggestions = [];
    
    // Add tour titles and locations as suggestions
    tours.forEach(tour => {
      if (!suggestions.some(s => s.value.toLowerCase() === tour.title.toLowerCase())) {
        suggestions.push({
          type: 'tour',
          value: tour.title,
          id: tour._id,
          category: 'Tours'
        });
      }
      if (!suggestions.some(s => s.value.toLowerCase() === tour.location.toLowerCase())) {
        suggestions.push({
          type: 'location',
          value: tour.location,
          category: 'Locations'
        });
      }
    });

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

    console.log(`Found ${tours.length} tours, ${destinations.length} destinations, ${suggestions.length} suggestions for query "${q}"`);

    res.status(200).json({
      status: 'success',
      query: q,
      data: {
        tours,
        destinations,
        suggestions: suggestions.slice(0, 8) // Limit suggestions to 8
      }
    });
  } catch (err) {
    console.error('Unified search error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get search suggestions (for autocomplete)
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
    
    // Get unique tour titles and locations
    const tours = await Tour.find({
      $or: [
        { title: searchRegex },
        { location: searchRegex }
      ]
    }).select('title location').limit(5);

    // Get unique destination names and locations
    const destinations = await Destination.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex }
      ]
    }).select('name location').limit(5);

    const suggestions = [];

    tours.forEach(tour => {
      if (tour.title.match(searchRegex) && !suggestions.some(s => s.value.toLowerCase() === tour.title.toLowerCase())) {
        suggestions.push({
          type: 'tour',
          value: tour.title,
          category: 'Tours'
        });
      }
      if (tour.location.match(searchRegex) && !suggestions.some(s => s.value.toLowerCase() === tour.location.toLowerCase())) {
        suggestions.push({
          type: 'location',
          value: tour.location,
          category: 'Locations'
        });
      }
    });

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
      data: suggestions.slice(0, 6)
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
