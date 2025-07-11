const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

const app = express();

// Health status tracking
let isShuttingDown = false;

// Basic health check endpoint (for liveness probe)
app.get(['/health', '/api/health'], (req, res) => {
  try {
    // If we're shutting down, return unhealthy
    if (isShuttingDown) {
      console.log('Health check failed: server is shutting down');
      return res.status(503).json({
        status: 'error',
        message: 'Server is shutting down',
        timestamp: new Date().toISOString()
      });
    }

    // Basic health check passed
    console.log('Basic health check passed');
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      path: req.path,
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during health check',
      timestamp: new Date().toISOString()
    });
  }
});

// Full health check endpoint (for readiness probe)
app.get(['/health/full', '/api/health/full'], async (req, res) => {
  try {
    // If we're shutting down, return not ready
    if (isShuttingDown) {
      console.log('Full health check failed: server is shutting down');
      return res.status(503).json({
        status: 'error',
        message: 'Server is shutting down',
        timestamp: new Date().toISOString()
      });
    }

    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Only return success if DB is fully connected
    const isDbConnected = dbStatus === 1;
    const statusCode = isDbConnected ? 200 : 503;

    console.log(`Full health check - Database status: ${dbStatusMap[dbStatus]}`);
    
    return res.status(statusCode).json({
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatusMap[dbStatus],
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        port: mongoose.connection.port
      },
      application: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    console.error('Full health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during full health check',
      timestamp: new Date().toISOString()
    });
  }
});

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  if (!req.path.includes('/health')) { // Don't log health check requests to avoid noise
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
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

// Graceful shutdown handler
process.on('SIGTERM', () => {
  isShuttingDown = true;
  console.log('SIGTERM signal received: closing HTTP server');
  
  // Give ongoing requests 10 seconds to complete
  setTimeout(() => {
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }, 10000);
});

module.exports = app;