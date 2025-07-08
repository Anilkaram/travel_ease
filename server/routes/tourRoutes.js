// const express = require('express');
// const router = express.Router();
// const tourController = require('../controllers/tourController');

// // GET all tours
// router.get('/', tourController.getAllTours);

// // GET featured tours
// router.get('/featured', tourController.getFeaturedTours);

// // GET tour by ID
// router.get('/:id', tourController.getTourById);

// // POST create new tour
// router.post('/', tourController.createTour);

// module.exports = router;

const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.route('/')
  .get(tourController.getAllTours);

module.exports = router;