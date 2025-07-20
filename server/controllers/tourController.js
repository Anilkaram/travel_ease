const Tour = require('../models/Tour');

// Search tours
exports.searchTours = async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Tour search query received:', q);

    if (!q) {
      return res.status(200).json({
        status: 'success',
        data: []
      });
    }

    // Create case-insensitive regex for searching
    const searchRegex = new RegExp(q.trim(), 'i');
    
    const tours = await Tour.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ]
    });

    console.log(`Found ${tours.length} tours for query "${q}"`);

    res.status(200).json({
      status: 'success',
      count: tours.length,
      data: tours
    });
  } catch (err) {
    console.error('Tour search error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getFeaturedTours = async (req, res) => {
  try {
    const featuredTours = await Tour.find({ isFeatured: true }).limit(6);
    res.json(featuredTours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTour = async (req, res) => {
  const tour = new Tour(req.body);
  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};