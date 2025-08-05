const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat service is running' });
});

// Chat endpoint for handling user messages
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple response generation (can be enhanced with AI services)
    const response = generateResponse(message, context);
    
    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple response generator (can be replaced with AI service)
function generateResponse(message, context = {}) {
  const msg = message.toLowerCase();
  
  // Travel-related intelligent responses
  if (msg.includes('destination') || msg.includes('place') || msg.includes('where')) {
    return "🏝️ We have incredible destinations worldwide! Our most popular ones include Paris (romantic), Tokyo (cultural), Bali (tropical), Sydney (coastal), New York (urban), and Rome (historical). What type of experience are you seeking?";
  }
  
  if (msg.includes('tour') || msg.includes('trip') || msg.includes('package')) {
    return "✈️ Our tour packages are designed for every traveler! We offer romantic getaways, adventure expeditions, cultural immersions, family vacations, and luxury escapes. Would you like recommendations based on your interests?";
  }
  
  if (msg.includes('price') || msg.includes('cost') || msg.includes('budget')) {
    return "💰 Our tours cater to all budgets! Prices range from $500 for weekend getaways to $5000+ for luxury experiences. All packages include transparent pricing with no hidden fees. What's your ideal budget range?";
  }
  
  if (msg.includes('book') || msg.includes('reserve') || msg.includes('booking')) {
    return "📅 Booking is simple! Browse destinations → Select your package → Choose dates → Secure checkout. You can modify bookings up to 7 days before departure. Ready to start your journey?";
  }
  
  if (msg.includes('contact') || msg.includes('support') || msg.includes('help')) {
    return "🤝 Our travel experts are here to help! Visit our Contact page for personalized assistance, or continue chatting here for quick questions. We respond within 24 hours to all inquiries.";
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('start')) {
    return "Hello! 👋 Welcome to TravelEase! I'm your travel assistant, ready to help you discover amazing destinations and plan unforgettable experiences. What adventure can I help you with today?";
  }
  
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're very welcome! 😊 I'm here whenever you need travel inspiration or assistance. Safe travels and feel free to reach out anytime!";
  }

  // Default intelligent response
  return "That sounds interesting! 🌍 I'm here to help you with destinations, tour packages, pricing, bookings, and travel planning. What specific aspect of your travel experience would you like to explore?";
}

module.exports = router;
