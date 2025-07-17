const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!', timestamp: new Date().toISOString() });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verify);

module.exports = router;
