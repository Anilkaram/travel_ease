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
  
  // Seed Users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234'
    });
    await user.save();
    console.log('Seed user created: test@example.com / test1234');
  } else {
    console.log('Users already exist, skipping user seed.');
  }

  // Seed Destinations
  const destinationCount = await Destination.countDocuments();
  if (destinationCount === 0) {
    const destinations = [
      {
        name: 'Paris',
        location: 'France',
        description: 'The city of love and lights with iconic landmarks like the Eiffel Tower and Louvre Museum.',
        image: 'https://placehold.co/400x300?text=Paris'
      },
      {
        name: 'Rome',
        location: 'Italy',
        description: 'Experience ancient history, art, and culture in the heart of Italy.',
        image: 'https://placehold.co/400x300?text=Rome'
      },
      {
        name: 'Bali',
        location: 'Indonesia',
        description: 'A tropical paradise known for its beaches, temples, and vibrant culture.',
        image: 'https://placehold.co/400x300?text=Bali'
      },
      {
        name: 'Tokyo',
        location: 'Japan',
        description: 'A bustling metropolis blending tradition and innovation.',
        image: 'https://placehold.co/400x300?text=Tokyo'
      },
      {
        name: 'New York',
        location: 'USA',
        description: 'The city that never sleeps, full of iconic sights and experiences.',
        image: 'https://placehold.co/400x300?text=NewYork'
      },
      {
        name: 'Sydney',
        location: 'Australia',
        description: 'A vibrant harbor city with stunning beaches and iconic landmarks.',
        image: 'https://placehold.co/400x300?text=Sydney'
      }
    ];

    await Destination.insertMany(destinations);
    console.log('Seed destinations created');
  } else {
    console.log('Destinations already exist, skipping destination seed.');
  }

  // Seed Tours
  const tourCount = await Tour.countDocuments();
  if (tourCount === 0) {
    const tours = [
      {
        title: 'Paris City Tour',
        description: 'Explore the romantic city of Paris with our guided tour including Eiffel Tower, Louvre, and Seine River cruise.',
        duration: '7 Days',
        price: 1200,
        location: 'Paris, France',
        isFeatured: true,
        image: 'https://placehold.co/400x300?text=Paris+Tour'
      },
      {
        title: 'Italian Adventure',
        description: 'Discover the beauty of Rome, Florence and Venice in this comprehensive Italy tour.',
        duration: '10 Days',
        price: 1800,
        location: 'Rome, Italy',
        isFeatured: true,
        image: 'https://placehold.co/400x300?text=Italy+Tour'
      },
      {
        title: 'Bali Beach Escape',
        description: 'Relax on the beautiful beaches of Bali and enjoy the local culture, temples, and cuisine.',
        duration: '8 Days',
        price: 1500,
        location: 'Bali, Indonesia',
        isFeatured: true,
        image: 'https://placehold.co/400x300?text=Bali+Tour'
      },
      {
        title: 'Tokyo Explorer',
        description: 'Experience the vibrant city life and traditions of Tokyo with visits to temples, markets, and modern districts.',
        duration: '6 Days',
        price: 1700,
        location: 'Tokyo, Japan',
        isFeatured: false,
        image: 'https://placehold.co/400x300?text=Tokyo+Tour'
      },
      {
        title: 'New York Highlights',
        description: 'See the best of New York City with our expert guides including Times Square, Central Park, and Broadway.',
        duration: '5 Days',
        price: 1600,
        location: 'New York, USA',
        isFeatured: false,
        image: 'https://placehold.co/400x300?text=NYC+Tour'
      },
      {
        title: 'Sydney Discovery',
        description: 'Explore Sydney\'s harbor, beaches, and wildlife with guided tours of Opera House and Harbour Bridge.',
        duration: '7 Days',
        price: 1550,
        location: 'Sydney, Australia',
        isFeatured: false,
        image: 'https://placehold.co/400x300?text=Sydney+Tour'
      },
      {
        title: 'London Heritage Tour',
        description: 'Discover London\'s rich history with visits to Tower of London, Buckingham Palace, and British Museum.',
        duration: '6 Days',
        price: 1400,
        location: 'London, UK',
        isFeatured: true,
        image: 'https://placehold.co/400x300?text=London+Tour'
      },
      {
        title: 'Barcelona Culture Walk',
        description: 'Immerse yourself in Barcelona\'s art, architecture, and cuisine with Gaudí tours and tapas experiences.',
        duration: '5 Days',
        price: 1100,
        location: 'Barcelona, Spain',
        isFeatured: false,
        image: 'https://placehold.co/400x300?text=Barcelona+Tour'
      }
    ];

    await Tour.insertMany(tours);
    console.log('Seed tours created');
  } else {
    console.log('Tours already exist, skipping tour seed.');
  }

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
