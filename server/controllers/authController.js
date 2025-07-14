const User = require('../models/User');

// Try to import jsonwebtoken with error handling
let jwt;
try {
  jwt = require('jsonwebtoken');
  console.log('✅ jsonwebtoken loaded successfully');
} catch (error) {
  console.error('❌ Failed to load jsonwebtoken:', error.message);
  console.error('Please run: npm install jsonwebtoken');
}

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'TravelEase2025SecretKeyForJWTTokens987654321';
  return jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { body: req.body });
    
    // Check if JWT is available
    if (!jwt) {
      console.error('❌ JWT not available');
      return res.status(500).json({ message: 'Server configuration error: JWT not available' });
    }

    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    console.log('✅ User registered successfully:', user.email);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TravelEase2025SecretKeyForJWTTokens987654321');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      }
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
