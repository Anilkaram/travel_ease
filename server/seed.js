const mongoose = require('mongoose');
const User = require('./models/User');
const Tour = require('./models/Tour');
const Destination = require('./models/Destination');
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
        authSource: 'admin'  // Add authentication source
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
  try {
    await connectWithRetry();
  } catch (error) {
    console.error('Failed to connect to MongoDB after retries:', error.message);
    process.exit(1);
  }
  

  // Always remove all tours
  await Tour.deleteMany({});
  console.log('All tours removed');

  // Always remove all destinations
  await Destination.deleteMany({});
  console.log('All destinations removed');

  // Always insert destinations from UI
  const destinations = [
    {
      name: 'Bali',
      country: 'Indonesia',
      description: 'A tropical paradise with beautiful beaches, vibrant culture, and lush landscapes.',
      image: '/assets/images/bali.jpg',
      featured: true
    },
    {
      name: 'Paris',
      country: 'France',
      description: 'The city of lights, romance, and world-famous cuisine and art.',
      image: '/assets/images/paris.jpg',
      featured: true
    },
    {
      name: 'Rome',
      country: 'Italy',
      description: 'A city rich in history, architecture, and delicious Italian food.',
      image: '/assets/images/rome.jpg',
      featured: true
    },
    {
      name: 'Sydney',
      country: 'Australia',
      description: 'Famous for its Opera House, Harbour Bridge, and beautiful beaches.',
      image: '/assets/images/sydney.jpg',
      featured: true
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      description: 'A blend of modern skyscrapers, historic temples, and cherry blossoms.',
      image: '/assets/images/tokyo.jpg',
      featured: false
    },
    {
      name: 'New York',
      country: 'USA',
      description: 'The city that never sleeps, with iconic landmarks and diverse culture.',
      image: '/assets/images/new-york.jpg',
      featured: false
    }
  ];
  await Destination.insertMany(destinations);
  console.log('Destinations seeded');

  await mongoose.disconnect();
  console.log('Seeding completed successfully!');
};

seed().catch(err => {
  console.error('Seed error:', err);
  console.error('Full error details:', err.stack);
  mongoose.disconnect().catch(disconnectErr => {
    console.error('Error disconnecting from MongoDB:', disconnectErr);
  });
  process.exit(1);
});
