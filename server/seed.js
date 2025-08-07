const mongoose = require('mongoose');
const User = require('./models/User');
const Destination = require('./models/Destination');
const { destinations } = require('./seedData');
require('dotenv').config();

const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1}/${retries}...`);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        maxPoolSize: 10,
        serverSelectionRetryDelayMS: 3000,
        authSource: 'admin'
      });
      console.log('MongoDB connected successfully for seeding!');
      return;
    } catch (error) {
      console.log(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        throw error;
      }
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const seed = async () => {
  console.log('🌱 Starting database seeding process...');
  console.log('Environment check:');
  console.log('- MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
  
  try {
    await connectWithRetry();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB after retries:', error.message);
    process.exit(1);
  }

  // Always remove all destinations
  console.log('🗑️ Clearing existing destinations...');
  const deletedCount = await Destination.deleteMany({});
  console.log(`✅ Removed ${deletedCount.deletedCount} existing destinations`);

  // Insert new destinations list with accurate images
  console.log('📝 Inserting new destinations...');
  
  try {
    const result = await Destination.insertMany(destinations);
    console.log(`✅ Successfully inserted ${result.length} destinations!`);
    
    // Verify the seeding worked
    const count = await Destination.countDocuments();
    console.log(`✅ Total destinations in database: ${count}`);
    
    // Show a few examples
    const samples = await Destination.find().limit(3);
    console.log('📋 Sample destinations:', samples.map(d => ({ name: d.name, location: d.location })));
  } catch (insertError) {
    console.error('❌ Error inserting destinations:', insertError);
    console.error('Full error details:', insertError.message);
    
    // Check if it's a validation error
    if (insertError.name === 'ValidationError') {
      console.error('Validation errors:', Object.keys(insertError.errors));
    }
    throw insertError;
  }

  await mongoose.disconnect();
  console.log('✅ Database seeding completed successfully!');
};

seed().catch(err => {
  console.error('Seed error:', err);
  console.error('Full error details:', err.stack);
  mongoose.disconnect().catch(disconnectErr => {
    console.error('Error disconnecting from MongoDB:', disconnectErr);
  });
  process.exit(1);
});
