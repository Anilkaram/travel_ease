const Destination = require('../models/Destination');

// Search destinations
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Search query received:', q);

    if (!q) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Create case-insensitive regex for searching
    const searchRegex = new RegExp(q.trim(), 'i');
    
    const destinations = await Destination.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex }
      ]
    });

    console.log(`Found ${destinations.length} destinations for query "${q}"`);

    res.status(200).json({
      status: 'success',
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({
      status: 'success',
      count: destinations.length,
      data: destinations
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      status: 'success',
      data: destination
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};