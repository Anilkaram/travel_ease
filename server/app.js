const express = require('express');
const mongoose = require('mongoose');
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/auth', authRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;