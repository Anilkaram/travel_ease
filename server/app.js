const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

const app = express();

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint - MUST be registered first, with explicit path
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint called');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    path: req.path,
    uptime: process.uptime()
  });
});

// Separate full health check with DB status
app.get('/api/health/full', async (req, res) => {
  try {
    console.log('Full health check endpoint called');
    const dbStatus = mongoose.connection.readyState === 1;
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        host: mongoose.connection.host
      },
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// CORS middleware
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000', 'http://localhost'],
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Handle 404 routes - with logging
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    path: req.originalUrl
  });
});

// Database connection with more detailed logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    console.log('Connection details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started at ${new Date().toISOString()}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('Available routes:');
  console.log('- GET /api/health');
  console.log('- GET /api/health/full');
  console.log('- GET /api/tours');
  console.log('- GET /api/destinations');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;