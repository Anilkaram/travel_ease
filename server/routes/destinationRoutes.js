const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// GET /api/destinations/search
router.get('/search', destinationController.search);

// GET /api/destinations
router.get('/', destinationController.getAllDestinations);

// POST /api/destinations
router.post('/', destinationController.createDestination);

module.exports = router;
