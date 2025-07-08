const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
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
    console.log('Users already exist, skipping seed.');
  }
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
