const mongoose = require('mongoose');

// Function to wait for MongoDB to be ready
async function waitForMongoDB() {
  const maxAttempts = 30;
  const delayMs = 5000;
  
  console.log('Waiting for MongoDB to be ready...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Checking MongoDB connection...`);
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      
      console.log('✅ MongoDB connection successful!');
      await mongoose.disconnect();
      return true;
      
    } catch (error) {
      console.log(`❌ MongoDB connection failed: ${error.message}`);
      
      if (attempt === maxAttempts) {
        console.error('Failed to connect to MongoDB after maximum attempts');
        process.exit(1);
      }
      
      console.log(`Waiting ${delayMs/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Function to run database seeding
async function runSeed() {
  try {
    console.log('Running database seed...');
    
    // Run seed script as a separate process to avoid conflicts
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const seedProcess = spawn('node', ['seed.js'], {
        env: process.env,
        stdio: 'inherit'
      });
      
      seedProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Database seeding completed successfully!');
          resolve();
        } else {
          console.log('⚠️ Database seeding failed, but continuing with app startup...');
          resolve(); // Continue even if seeding fails
        }
      });
      
      seedProcess.on('error', (error) => {
        console.log('⚠️ Database seeding failed, but continuing with app startup...');
        console.log('Seed error:', error.message);
        resolve(); // Continue even if seeding fails
      });
    });
    
  } catch (error) {
    console.log('⚠️ Database seeding failed, but continuing with app startup...');
    console.log('Seed error:', error.message);
  }
}

// Main startup function
async function startServer() {
  try {
    // Wait for MongoDB to be ready
    await waitForMongoDB();
    
    // Run database seeding
    await runSeed();
    
    // Start the main application
    console.log('🚀 Starting server...');
    require('./app.js');
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();
