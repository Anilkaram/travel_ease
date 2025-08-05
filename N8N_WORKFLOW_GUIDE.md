# Complete n8n Workflow Setup Guide for TravelEase Chat Agent

## Part 1: Installing n8n

### Option A: Docker Installation (Recommended)
```bash
# Create n8n directory
mkdir n8n-data

# Run n8n with Docker
docker run -it --rm --name n8n -p 5678:5678 -v ${PWD}/n8n-data:/home/node/.n8n n8nio/n8n
```

### Option B: Add to Your Docker Compose
Add this to your `docker-compose.yml`:

```yaml
  n8n:
    image: n8nio/n8n
    ports:
      - 5678:5678
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678
    volumes:
      - n8n-data:/home/node/.n8n
    networks:
      - travel-network
    depends_on:
      - mongo

volumes:
  n8n-data:
```

## Part 2: Creating the Chat Workflow from Scratch

### Step 1: Access n8n Dashboard
1. Open browser: `http://localhost:5678`
2. Login with credentials (if using basic auth)
3. Click "New Workflow"

### Step 2: Add Webhook Node (Entry Point)
1. Click "+" to add node
2. Search for "Webhook"
3. Click "Webhook" node
4. Configure:
   - **HTTP Method**: POST
   - **Path**: `chat`
   - **Response Mode**: Respond to Webhook
5. Click "Listen for Test Event" (keep this tab open)

### Step 3: Add Function Node (Intent Detection)
1. Add new node after Webhook
2. Search for "Function"
3. Configure the function:

```javascript
// Intent Detection Function
const userMessage = $json.message.toLowerCase();
const intent = detectIntent(userMessage);

function detectIntent(message) {
  // Greeting patterns
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return 'greeting';
  }
  
  // Destination queries
  if (message.match(/(destination|place|where|location|country|city)/)) {
    return 'destinations';
  }
  
  // Tour/package queries
  if (message.match(/(tour|package|trip|vacation|holiday|booking)/)) {
    return 'tours';
  }
  
  // Price queries
  if (message.match(/(price|cost|cheap|expensive|budget|affordable)/)) {
    return 'pricing';
  }
  
  // Help queries
  if (message.match(/(help|assist|support|guide)/)) {
    return 'help';
  }
  
  return 'general';
}

return {
  originalMessage: $json.message,
  intent: intent,
  userQuery: userMessage
};
```

### Step 4: Add IF Node (Route Based on Intent)
1. Add "IF" node after Function
2. Configure conditions:
   - **Condition 1**: `{{ $json.intent }}` equals `destinations`
   - **Condition 2**: `{{ $json.intent }}` equals `tours`  
   - **Condition 3**: `{{ $json.intent }}` equals `pricing`

### Step 5: Add MongoDB Nodes for Each Intent

#### For Destinations Branch:
1. Add "MongoDB" node to "destinations" branch
2. Configure:
   - **Operation**: Find Documents
   - **Connection**: Create new MongoDB credential
   - **Database**: `travelease`
   - **Collection**: `destinations`
   - **Query**: 
   ```json
   {
     "featured": true
   }
   ```

#### For Tours Branch:
1. Add "MongoDB" node to "tours" branch
2. Configure:
   - **Database**: `travelease`
   - **Collection**: `tours`
   - **Query**:
   ```json
   {
     "isFeatured": true
   }
   ```

#### For Pricing Branch:
1. Add "MongoDB" node to "pricing" branch
2. Configure:
   - **Database**: `travelease`
   - **Collection**: `tours`
   - **Query**:
   ```json
   {
     "$or": [
       {"price": {"$lt": 1000}},
       {"price": {"$lt": 1500}}
     ]
   }
   ```

### Step 6: Add Response Function Nodes

#### Destinations Response Function:
```javascript
const destinations = $json;
let response = "🌍 Here are our featured destinations:\n\n";

if (destinations.length > 0) {
  destinations.forEach((dest, index) => {
    response += `${index + 1}. **${dest.name}** - ${dest.location}\n`;
    response += `   ${dest.description}\n\n`;
  });
  response += "Which destination interests you most? I can show you tours for any of these!";
} else {
  response = "I'm sorry, I couldn't find any destinations right now. Please try again later.";
}

return {
  response: response,
  type: 'destinations',
  data: destinations
};
```

#### Tours Response Function:
```javascript
const tours = $json;
let response = "🎒 Here are our featured tours:\n\n";

if (tours.length > 0) {
  tours.forEach((tour, index) => {
    response += `${index + 1}. **${tour.title}**\n`;
    response += `   📍 ${tour.location}\n`;
    response += `   ⏰ ${tour.duration}\n`;
    response += `   💰 $${tour.price}\n`;
    response += `   ${tour.description}\n\n`;
  });
  response += "Would you like more details about any of these tours?";
} else {
  response = "I'm sorry, no tours are available right now. Please check back later.";
}

return {
  response: response,
  type: 'tours',
  data: tours
};
```

#### Pricing Response Function:
```javascript
const tours = $json;
let response = "💰 Here are our budget-friendly options:\n\n";

if (tours.length > 0) {
  // Sort by price
  tours.sort((a, b) => a.price - b.price);
  
  tours.forEach((tour, index) => {
    response += `${index + 1}. **${tour.title}** - $${tour.price}\n`;
    response += `   📍 ${tour.location} (${tour.duration})\n\n`;
  });
  response += "These are great value tours! Need more details about any of them?";
} else {
  response = "Let me find some great deals for you! What's your budget range?";
}

return {
  response: response,
  type: 'pricing',
  data: tours
};
```

### Step 7: Add Default Response Function
For the "false" branch of IF node:

```javascript
const intent = $json.intent;
const message = $json.originalMessage;

let response = "";

switch(intent) {
  case 'greeting':
    response = "👋 Hello! Welcome to TravelEase! I'm here to help you find amazing destinations and tours. What would you like to explore today?";
    break;
  case 'help':
    response = "🤝 I can help you with:\n• Find destinations\n• Browse tours and packages\n• Check pricing and deals\n• Get travel recommendations\n\nJust ask me anything about travel!";
    break;
  default:
    response = "I'd be happy to help you with travel planning! You can ask me about:\n• Popular destinations\n• Tour packages\n• Pricing information\n• Travel recommendations\n\nWhat would you like to know?";
}

return {
  response: response,
  type: 'general'
};
```

### Step 8: Merge and Final Response
1. Add "Merge" node to combine all branches
2. Add final "Function" node to format response:

```javascript
// Final Response Formatter
const responseData = $json.response || $json[0].response;
const responseType = $json.type || $json[0].type;

return {
  success: true,
  message: responseData,
  type: responseType,
  timestamp: new Date().toISOString()
};
```

## Part 3: MongoDB Credential Setup

### Step 1: Create MongoDB Credential
1. Go to Settings → Credentials
2. Click "Add Credential"
3. Search for "MongoDB"
4. Configure:
   - **Connection String**: `mongodb://admin:admin@mongo:27017/admin?authSource=admin`
   - **Database**: `travelease`

### Step 2: Test Connection
1. Click "Test Connection"
2. Should show "Connection successful"

## Part 4: Testing the Workflow

### Step 1: Test with Sample Messages
1. Use the webhook URL from the webhook node
2. Test with curl or Postman:

```bash
# IMPORTANT: Use production webhook URL (not webhook-test)
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

curl -X POST http://localhost:5678/webhook-test/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me destinations"}'

curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What tours do you have?"}'
```

### Step 2: Save and Activate Workflow
1. Click "Save" (Ctrl+S)
2. Name it: "TravelEase Chat Agent"
3. Toggle "Active" to ON

## Part 5: Integration with Your Application

### Step 1: Update Chat Service
Update `client/src/services/chatService.js`:

```javascript
class ChatService {
  constructor() {
    this.n8nWebhookUrl = 'http://localhost:5678/webhook/chat';
    this.backendUrl = 'http://localhost:5000/api';
    this.isInitialized = false;
  }

  async initialize() {
    // Test n8n webhook availability
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' })
      });
      
      if (response.ok) {
        this.isInitialized = true;
        console.log('✅ n8n webhook service available');
        return true;
      }
    } catch (error) {
      console.log('❌ n8n webhook not available, using fallback');
    }
    
    return false;
  }

  async sendMessage(message) {
    // Try n8n webhook first
    if (this.isInitialized) {
      try {
        const response = await fetch(this.n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            message: data.message || data.response,
            source: 'n8n-automation'
          };
        }
      } catch (error) {
        console.error('n8n webhook error:', error);
      }
    }

    // Fallback to backend API
    try {
      const response = await fetch(`${this.backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message,
          source: 'backend-api'
        };
      }
    } catch (error) {
      console.error('Backend API error:', error);
    }

    // Final fallback
    return this.getOfflineResponse(message);
  }

  getOfflineResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        success: true,
        message: "Hello! I'm currently offline, but I'd love to help you plan your next adventure when I'm back online!",
        source: 'offline'
      };
    }
    
    if (lowerMessage.includes('destination') || lowerMessage.includes('place')) {
      return {
        success: true,
        message: "I'm offline right now, but we have amazing destinations like Paris, Tokyo, Bali, and more! Please try again when I'm online for detailed information.",
        source: 'offline'
      };
    }
    
    return {
      success: true,
      message: "I'm currently offline. Please try again later, and I'll be happy to help you with travel planning!",
      source: 'offline'
    };
  }
}

export default new ChatService();
```

### Step 2: Test Integration
1. Start your application: `docker-compose up`
2. Start n8n (if separate): `docker run -p 5678:5678 n8nio/n8n`
3. Open your application: `http://localhost`
4. Test the chat widget with various messages

### Step 3: Production Webhook URL
For production, update the webhook URL in `chatService.js`:
```javascript
this.n8nWebhookUrl = 'https://your-n8n-domain.com/webhook/chat';
```

## Part 6: Advanced Features

### Add Context Memory
Modify the Function node to store conversation context:

```javascript
// In the intent detection function, add:
const sessionId = $json.sessionId || 'default';
const context = global.get(`context_${sessionId}`) || {};

// Store context
context.lastIntent = intent;
context.lastMessage = userMessage;
context.timestamp = new Date();
global.set(`context_${sessionId}`, context);

return {
  originalMessage: $json.message,
  intent: intent,
  userQuery: userMessage,
  context: context,
  sessionId: sessionId
};
```

### Add Personalized Responses
Use the context to provide better responses:

```javascript
const context = $json.context || {};
const isReturningUser = context.lastMessage !== undefined;

if (isReturningUser) {
  response = `Welcome back! Last time you were asking about ${context.lastIntent}. ` + response;
}
```

This guide will help you create a fully functional n8n workflow integrated with your TravelEase application! 🚀
