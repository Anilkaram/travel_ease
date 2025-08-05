// Enhanced Chat Agent with Advanced MongoDB Queries
// This script provides more sophisticated chat responses based on TravelEase data

class TravelEaseChatAgent {
  constructor(mongodbCredentials) {
    this.credentials = mongodbCredentials;
    this.intentPatterns = {
      tours: ['tour', 'trip', 'package', 'vacation', 'travel'],
      destinations: ['destination', 'place', 'location', 'country', 'city'],
      pricing: ['price', 'cost', 'budget', 'cheap', 'expensive', 'affordable'],
      duration: ['duration', 'days', 'week', 'time', 'long', 'short'],
      booking: ['book', 'reserve', 'available', 'schedule'],
      featured: ['popular', 'featured', 'recommended', 'best', 'top']
    };
  }

  // Detect user intent from message
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    const intents = [];

    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        intents.push(intent);
      }
    }

    return intents.length > 0 ? intents : ['general'];
  }

  // Extract entities like price range, location, duration
  extractEntities(message) {
    const entities = {};
    
    // Extract price range
    const priceMatch = message.match(/\$?(\d+)\s*-\s*\$?(\d+)|\$?(\d+)\s*(or\s*)?less|under\s*\$?(\d+)|below\s*\$?(\d+)/i);
    if (priceMatch) {
      if (priceMatch[1] && priceMatch[2]) {
        entities.priceRange = { min: parseInt(priceMatch[1]), max: parseInt(priceMatch[2]) };
      } else if (priceMatch[3] || priceMatch[5] || priceMatch[6]) {
        entities.maxPrice = parseInt(priceMatch[3] || priceMatch[5] || priceMatch[6]);
      }
    }

    // Extract duration
    const durationMatch = message.match(/(\d+)\s*(day|week|month)s?/i);
    if (durationMatch) {
      entities.duration = {
        value: parseInt(durationMatch[1]),
        unit: durationMatch[2].toLowerCase()
      };
    }

    // Extract location
    const locationKeywords = ['paris', 'london', 'tokyo', 'new york', 'rome', 'sydney', 'bali'];
    const foundLocation = locationKeywords.find(loc => 
      message.toLowerCase().includes(loc)
    );
    if (foundLocation) {
      entities.location = foundLocation;
    }

    return entities;
  }

  // Build MongoDB query based on intent and entities
  buildMongoQuery(intent, entities) {
    let query = {};
    let collection = 'tours';

    switch (intent) {
      case 'tours':
        collection = 'tours';
        if (entities.priceRange) {
          query.price = { 
            $gte: entities.priceRange.min, 
            $lte: entities.priceRange.max 
          };
        } else if (entities.maxPrice) {
          query.price = { $lte: entities.maxPrice };
        }
        
        if (entities.location) {
          query.location = new RegExp(entities.location, 'i');
        }
        
        if (entities.duration) {
          query.duration = new RegExp(`${entities.duration.value}.*${entities.duration.unit}`, 'i');
        }
        break;

      case 'destinations':
        collection = 'destinations';
        if (entities.location) {
          query.$or = [
            { name: new RegExp(entities.location, 'i') },
            { location: new RegExp(entities.location, 'i') }
          ];
        }
        break;

      case 'featured':
        collection = 'tours';
        query.isFeatured = true;
        break;
    }

    return { collection, query };
  }

  // Generate response based on query results
  generateResponse(intent, entities, results, originalMessage) {
    let response = "";

    if (results.length === 0) {
      return this.generateNoResultsResponse(intent, entities);
    }

    switch (intent[0]) {
      case 'tours':
        response = this.generateToursResponse(results, entities);
        break;
      case 'destinations':
        response = this.generateDestinationsResponse(results);
        break;
      case 'pricing':
        response = this.generatePricingResponse(results);
        break;
      case 'featured':
        response = this.generateFeaturedResponse(results);
        break;
      default:
        response = this.generateGeneralResponse(results);
    }

    return response;
  }

  generateToursResponse(tours, entities) {
    let response = `🌟 I found ${tours.length} amazing tour${tours.length > 1 ? 's' : ''} for you!\\n\\n`;
    
    tours.slice(0, 5).forEach((tour, index) => {
      response += `${index + 1}. **${tour.title}**\\n`;
      response += `   📍 ${tour.location}\\n`;
      response += `   ⏱️ ${tour.duration}\\n`;
      response += `   💰 $${tour.price.toLocaleString()}\\n`;
      response += `   📝 ${tour.description.substring(0, 100)}...\\n`;
      if (tour.isFeatured) response += `   ⭐ Featured Tour!\\n`;
      response += `\\n`;
    });

    if (tours.length > 5) {
      response += `📋 And ${tours.length - 5} more tours available! Contact us for the complete list.\\n`;
    }

    return response;
  }

  generateDestinationsResponse(destinations) {
    let response = `🗺️ Here are our popular destinations:\\n\\n`;
    
    destinations.slice(0, 6).forEach((dest, index) => {
      response += `${index + 1}. **${dest.name}**\\n`;
      response += `   📍 ${dest.location}\\n`;
      response += `   📝 ${dest.description.substring(0, 80)}...\\n\\n`;
    });

    return response;
  }

  generatePricingResponse(tours) {
    const sortedTours = tours.sort((a, b) => a.price - b.price);
    const priceRanges = {
      budget: sortedTours.filter(t => t.price < 1000),
      mid: sortedTours.filter(t => t.price >= 1000 && t.price < 2500),
      luxury: sortedTours.filter(t => t.price >= 2500)
    };

    let response = `💰 **Tour Pricing Overview:**\\n\\n`;

    if (priceRanges.budget.length > 0) {
      response += `🏷️ **Budget Tours (Under $1,000):** ${priceRanges.budget.length} options\\n`;
      response += `   Starting from $${Math.min(...priceRanges.budget.map(t => t.price))}\\n\\n`;
    }

    if (priceRanges.mid.length > 0) {
      response += `🎯 **Mid-Range Tours ($1,000 - $2,500):** ${priceRanges.mid.length} options\\n`;
      response += `   Average price: $${Math.round(priceRanges.mid.reduce((sum, t) => sum + t.price, 0) / priceRanges.mid.length)}\\n\\n`;
    }

    if (priceRanges.luxury.length > 0) {
      response += `💎 **Luxury Tours ($2,500+):** ${priceRanges.luxury.length} options\\n`;
      response += `   Premium experiences starting from $${Math.min(...priceRanges.luxury.map(t => t.price))}\\n\\n`;
    }

    // Show top 3 budget and top 3 expensive
    response += `**🔥 Best Value Tours:**\\n`;
    sortedTours.slice(0, 3).forEach((tour, i) => {
      response += `${i + 1}. ${tour.title} - $${tour.price} (${tour.duration})\\n`;
    });

    return response;
  }

  generateFeaturedResponse(tours) {
    const featured = tours.filter(t => t.isFeatured);
    let response = `⭐ **Our Featured Tours:**\\n\\n`;
    
    featured.forEach((tour, index) => {
      response += `${index + 1}. **${tour.title}**\\n`;
      response += `   📍 ${tour.location} | ⏱️ ${tour.duration} | 💰 $${tour.price}\\n`;
      response += `   🌟 ${tour.description.substring(0, 100)}...\\n\\n`;
    });

    return response;
  }

  generateNoResultsResponse(intent, entities) {
    let response = "😔 I couldn't find any results matching your criteria.\\n\\n";
    
    if (entities.maxPrice) {
      response += `💡 Try increasing your budget above $${entities.maxPrice}, or `;
    }
    if (entities.location) {
      response += `🗺️ Consider exploring other destinations, or `;
    }
    
    response += "contact our travel experts for personalized recommendations!\\n\\n";
    response += "🔍 You can also try searching for:\\n";
    response += "• 'featured tours'\\n";
    response += "• 'budget tours under $1500'\\n";
    response += "• 'destinations in Europe'\\n";
    response += "• '7 day tours'";
    
    return response;
  }

  generateGeneralResponse(results) {
    const tours = results.filter(r => r.title); // Tours have titles
    const destinations = results.filter(r => r.name && !r.title); // Destinations have names but no titles

    let response = "👋 Welcome to TravelEase! I'm here to help you plan your perfect trip.\\n\\n";
    
    if (tours.length > 0) {
      response += `🎯 We have ${tours.length} amazing tours available\\n`;
    }
    if (destinations.length > 0) {
      response += `🗺️ Covering ${destinations.length} exciting destinations\\n`;
    }

    response += "\\n💬 You can ask me about:\\n";
    response += "• 🎒 Tours and packages\\n";
    response += "• 🗺️ Destinations and locations\\n";
    response += "• 💰 Pricing and budget options\\n";
    response += "• ⭐ Featured and popular tours\\n";
    response += "• ⏱️ Tour durations\\n\\n";
    response += "Try asking: 'Show me tours to Paris under $2000' or 'What are your featured destinations?'";

    return response;
  }
}

// Main processing function for n8n
function processUserMessage(userMessage, tours, destinations) {
  const chatAgent = new TravelEaseChatAgent();
  
  // Detect intent and extract entities
  const intents = chatAgent.detectIntent(userMessage);
  const entities = chatAgent.extractEntities(userMessage);
  
  // Combine results based on intent
  let results = [];
  if (intents.includes('tours') || intents.includes('pricing') || intents.includes('featured')) {
    results = tours;
  } else if (intents.includes('destinations')) {
    results = destinations;
  } else {
    results = [...tours, ...destinations];
  }
  
  // Filter results based on entities
  if (entities.priceRange && results.length > 0 && results[0].price !== undefined) {
    results = results.filter(item => 
      item.price >= entities.priceRange.min && item.price <= entities.priceRange.max
    );
  } else if (entities.maxPrice && results.length > 0 && results[0].price !== undefined) {
    results = results.filter(item => item.price <= entities.maxPrice);
  }
  
  if (entities.location) {
    results = results.filter(item => 
      (item.location && item.location.toLowerCase().includes(entities.location.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(entities.location.toLowerCase()))
    );
  }
  
  if (intents.includes('featured')) {
    results = results.filter(item => item.isFeatured === true);
  }
  
  // Generate response
  const response = chatAgent.generateResponse(intents, entities, results, userMessage);
  
  return {
    response: response,
    intent: intents,
    entities: entities,
    resultsCount: results.length,
    timestamp: new Date().toISOString()
  };
}

// Export for use in n8n Code node
module.exports = { processUserMessage, TravelEaseChatAgent };
