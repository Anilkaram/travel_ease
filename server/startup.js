const mongoose = require('mongoose');

// Function to wait for MongoDB to be ready
async function waitForMongoDB() {
  const maxAttempts = 30;
  const delayMs = 5000;
  
  console.log('🔍 Waiting for MongoDB to be ready...');
  console.log('🔗 MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxAttempts}: Checking MongoDB connection...`);
      
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        authSource: 'admin',
        maxPoolSize: 10,
        retryWrites: true,
        retryReads: true
      });
      
      console.log('✅ MongoDB connection successful!');
      console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
      return true;
      
    } catch (error) {
      console.log(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxAttempts) {
        console.error('💥 Failed to connect to MongoDB after maximum attempts');
        console.error('🔍 Final error details:', error);
        process.exit(1);
      }
      
      console.log(`⏳ Waiting ${delayMs/1000} seconds before next attempt...`);
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
