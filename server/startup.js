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
    console.log('🌱 Running database seed...');
    
    // Import and run seeding function directly
    const seedFunction = require('./seedData');
    await seedFunction();
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
}

// Main startup function
async function startServer() {
  try {
    console.log('🚀 Starting TravelEase Server...');
    
    // Wait for MongoDB to be ready
    await waitForMongoDB();
    
    // Run database seeding
    await runSeed();
    
    // Start the main application
    console.log('🌟 Starting main server application...');
    require('./app.js');
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    console.error('Full error stack:', error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();
