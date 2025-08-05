// Chat service for handling API communications
class ChatService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.n8nWebhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/travelease-chat';
    this.isConnected = false;
    this.isN8nConnected = false;
  }

  // Initialize chat service
  async initialize() {
    try {
      // Check if n8n webhook is available first (preferred)
      try {
        const n8nResponse = await fetch(this.n8nWebhookUrl.replace('/webhook/', '/webhook-test/'), {
          method: 'GET',
          timeout: 3000
        });
        this.isN8nConnected = true;
        console.log('Chat service: n8n webhook connected');
      } catch (n8nError) {
        console.log('Chat service: n8n webhook not available, checking backend...');
      }

      // Check if backend is available
      const response = await fetch(`${this.apiUrl}/health`);
      this.isConnected = response.ok;
      
      console.log(`Chat service: Backend ${this.isConnected ? 'connected' : 'offline'}`);
      return this.isConnected || this.isN8nConnected;
    } catch (error) {
      console.log('Chat service: Using offline mode');
      this.isConnected = false;
      this.isN8nConnected = false;
      return false;
    }
  }

  // Send message to AI service or backend
  async sendMessage(message, context = {}) {
    // Priority 1: Try n8n webhook first (most advanced)
    if (this.isN8nConnected) {
      try {
        const response = await fetch(this.n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            sessionId: context.sessionId || Date.now().toString(),
            userId: context.userId || 'anonymous',
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.message || data.response || 'I received your message!';
        }
      } catch (error) {
        console.error('n8n webhook error:', error);
        this.isN8nConnected = false;
      }
    }

    // Priority 2: Try backend API
    if (this.isConnected) {
      try {
        const response = await fetch(`${this.apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            context,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.response;
        }
      } catch (error) {
        console.error('Chat API error:', error);
      }
    }

    // Priority 3: Fallback to local response generation
    return this.generateLocalResponse(message);
  }

  // Generate local responses when offline
  generateLocalResponse(message) {
    const msg = message.toLowerCase();
    
    // Intent detection and responses
    const responses = {
      greeting: [
        "Hello! 👋 Welcome to TravelEase! I'm here to help you discover amazing destinations and plan your perfect trip.",
        "Hi there! 🌍 Ready to explore the world? I can help you find the perfect travel experience!",
        "Welcome to TravelEase! ✈️ Let's make your travel dreams come true!"
      ],
      
      destinations: [
        "🏝️ We have incredible destinations like Paris, Tokyo, Bali, Sydney, New York, and Rome! Each offers unique experiences. What type of adventure interests you?",
        "🌟 Our popular destinations include romantic Paris, vibrant Tokyo, tropical Bali, and cosmopolitan Sydney. Would you like to know more about any of these?",
        "🗺️ From European elegance to Asian adventures, tropical paradises to urban excitement - we have destinations for every traveler!"
      ],
      
      tours: [
        "✈️ Our tour packages range from romantic getaways to adventure expeditions! We offer guided tours, custom itineraries, and all-inclusive packages.",
        "🎒 Whether you're looking for cultural immersion, adventure sports, luxury relaxation, or family fun - we have the perfect tour for you!",
        "🌅 Our featured tours include romantic Paris escapes, Tokyo cultural adventures, Bali wellness retreats, and Sydney coastal experiences."
      ],
      
      pricing: [
        "💰 Our tour prices vary based on destination, duration, and inclusions. We offer options for every budget - from affordable adventures to luxury experiences!",
        "💵 Prices range from budget-friendly packages starting at $500 to premium luxury tours. What's your budget range? I can help you find the perfect match!",
        "🏷️ We believe great travel should be accessible! Our tours include transparent pricing with no hidden fees. Would you like pricing for a specific destination?"
      ],
      
      booking: [
        "📅 Booking is easy! Browse our destinations, choose your package, and click 'Book Now'. You'll need to create an account for a personalized experience.",
        "🎫 To book: 1) Select your destination 2) Choose your tour package 3) Pick your dates 4) Complete secure checkout. Need help with any step?",
        "📋 Our booking process is secure and straightforward. You can modify or cancel bookings up to 7 days before departure. Ready to start?"
      ],
      
      contact: [
        "📞 Our support team is here to help! Visit our Contact page or reach out directly. We respond within 24 hours to all inquiries.",
        "💬 Need personalized assistance? Our travel experts are available via the Contact page. We'd love to help plan your perfect trip!",
        "🤝 For immediate help, use this chat! For detailed planning, visit our Contact page where our travel specialists can create custom itineraries."
      ],
      
      thanks: [
        "You're very welcome! 😊 I'm here whenever you need help planning your next adventure. Happy travels!",
        "My pleasure! 🌟 Feel free to ask me anything else about destinations, tours, or booking. I'm here to help!",
        "Glad I could help! ✨ Don't hesitate to reach out when you're ready to plan your next amazing journey!"
      ]
    };

    // Intent detection
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('start')) {
      return this.getRandomResponse(responses.greeting);
    }
    
    if (msg.includes('destination') || msg.includes('place') || msg.includes('where') || msg.includes('location')) {
      return this.getRandomResponse(responses.destinations);
    }
    
    if (msg.includes('tour') || msg.includes('trip') || msg.includes('package') || msg.includes('vacation')) {
      return this.getRandomResponse(responses.tours);
    }
    
    if (msg.includes('price') || msg.includes('cost') || msg.includes('budget') || msg.includes('money')) {
      return this.getRandomResponse(responses.pricing);
    }
    
    if (msg.includes('book') || msg.includes('reserve') || msg.includes('booking') || msg.includes('buy')) {
      return this.getRandomResponse(responses.booking);
    }
    
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help') || msg.includes('assistance')) {
      return this.getRandomResponse(responses.contact);
    }
    
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
      return this.getRandomResponse(responses.thanks);
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! 🤔 I'd love to help you with that. Could you tell me more about what you're looking for in your travel experience?",
      "Great question! 🌍 I'm here to help you discover amazing destinations. Are you interested in adventure, relaxation, culture, or something else?",
      "I'd be happy to assist you! ✈️ Whether you're looking for destinations, tours, pricing, or booking help - just let me know what interests you most!",
      "Sounds exciting! 🎒 I can help you with destinations, tour packages, travel tips, and booking. What aspect of travel planning can I help you with?"
    ];

    return this.getRandomResponse(defaultResponses);
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Get travel suggestions based on preferences
  async getTravelSuggestions(preferences) {
    // This could integrate with your backend to get personalized suggestions
    const suggestions = {
      romantic: ["Paris, France", "Santorini, Greece", "Venice, Italy"],
      adventure: ["New Zealand", "Costa Rica", "Nepal"],
      beach: ["Bali, Indonesia", "Maldives", "Hawaii"],
      culture: ["Tokyo, Japan", "Rome, Italy", "Istanbul, Turkey"],
      budget: ["Thailand", "Vietnam", "Eastern Europe"]
    };

    return suggestions[preferences.type] || suggestions.culture;
  }
}

export default new ChatService();
