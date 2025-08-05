# TravelEase n8n Workflow Visual Guide

## Workflow Architecture

```
[User Message] 
    ↓
[Webhook Node] 
    ↓
[Intent Detection Function]
    ↓
[IF Node - Route by Intent]
    ├── destinations → [MongoDB: destinations] → [Format Destinations Response]
    ├── tours       → [MongoDB: tours]        → [Format Tours Response]  
    ├── pricing     → [MongoDB: tours+filter] → [Format Pricing Response]
    └── default     → [Default Response Function]
                        ↓
                   [Merge All Responses]
                        ↓
                   [Final Response Formatter]
                        ↓
                   [Return to Chat Widget]
```

## Step-by-Step Node Configuration

### 1. Webhook Node Configuration
```
Node Type: Webhook
HTTP Method: POST
Path: chat
Response Mode: Respond to Webhook
Authentication: None

Expected Input:
{
  "message": "Hello, show me destinations"
}
```

### 2. Intent Detection Function
```javascript
// This function analyzes user input and determines intent
const userMessage = $json.message.toLowerCase();

function detectIntent(message) {
  if (message.match(/^(hi|hello|hey)/)) return 'greeting';
  if (message.match(/(destination|place|where)/)) return 'destinations';
  if (message.match(/(tour|package|trip)/)) return 'tours';
  if (message.match(/(price|cost|cheap|budget)/)) return 'pricing';
  if (message.match(/(help|assist)/)) return 'help';
  return 'general';
}

return {
  originalMessage: $json.message,
  intent: detectIntent(userMessage),
  userQuery: userMessage
};
```

### 3. IF Node Conditions
```
Condition 1: {{ $json.intent }} equals "destinations"
Condition 2: {{ $json.intent }} equals "tours"
Condition 3: {{ $json.intent }} equals "pricing"
Default: All other intents
```

### 4. MongoDB Node Configurations

#### Destinations Query:
```json
Database: travelease
Collection: destinations
Operation: Find Documents
Query: {"featured": true}
```

#### Tours Query:
```json
Database: travelease
Collection: tours
Operation: Find Documents  
Query: {"isFeatured": true}
```

#### Pricing Query:
```json
Database: travelease
Collection: tours
Operation: Find Documents
Query: {"price": {"$lt": 1500}}
```

### 5. Response Formatting Functions

#### Destinations Response:
```javascript
const destinations = $json;
let response = "🌍 Here are our featured destinations:\n\n";

destinations.forEach((dest, index) => {
  response += `${index + 1}. **${dest.name}** - ${dest.location}\n`;
  response += `   ${dest.description}\n\n`;
});

return { response, type: 'destinations', data: destinations };
```

## Testing Your Workflow

### Test Messages to Try:
1. **Greeting**: "Hello", "Hi there"
2. **Destinations**: "Show me destinations", "Where can I travel?"
3. **Tours**: "What tours do you have?", "Show me packages"
4. **Pricing**: "Cheap tours", "Budget options"
5. **Help**: "Help me", "What can you do?"

### Expected Responses:
- **Destinations**: List of featured destinations with descriptions
- **Tours**: List of tour packages with prices and durations
- **Pricing**: Budget-friendly tours sorted by price
- **Default**: Helpful guidance message

## Integration Points

### 1. Chat Widget → n8n
```javascript
// In chatService.js
const response = await fetch('http://localhost:5678/webhook/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
});
```

### 2. n8n → MongoDB
```
Connection String: mongodb://admin:admin@mongo:27017/admin?authSource=admin
Database: travelease
Collections: destinations, tours, users
```

### 3. Response Format
```json
{
  "success": true,
  "message": "Formatted response text",
  "type": "destinations|tours|pricing|general",
  "timestamp": "2025-08-05T10:30:00.000Z"
}
```

## Troubleshooting Common Issues

### Issue 1: Webhook Not Receiving Data
**Solution**: Check webhook URL and ensure n8n is running
```bash
curl -X POST http://localhost:5678/webhook/chat -d '{"message":"test"}'
```

### Issue 2: MongoDB Connection Failed
**Solution**: Verify connection string and run setup script
```bash
docker exec travel_ease_mongo_1 mongosh --eval "db.adminCommand('ping')"
```

### Issue 3: No Data Returned
**Solution**: Ensure database has sample data
```bash
# Run the setup script
setup-mongodb-for-n8n.bat
```

### Issue 4: Function Errors
**Solution**: Check JavaScript syntax in function nodes
- Use console.log() for debugging
- Check $json variable structure
- Verify return format

## Advanced Workflow Features

### 1. Session Management
Add session tracking to maintain conversation context:

```javascript
// In Intent Detection Function
const sessionId = $json.sessionId || Date.now().toString();
const context = global.get(`context_${sessionId}`) || {};

context.lastIntent = intent;
context.messageCount = (context.messageCount || 0) + 1;
global.set(`context_${sessionId}`, context);

return {
  originalMessage: $json.message,
  intent: intent,
  sessionId: sessionId,
  context: context
};
```

### 2. Personalized Responses
Use context for better user experience:

```javascript
const context = $json.context || {};
let greeting = "";

if (context.messageCount > 1) {
  greeting = "Thanks for chatting with me again! ";
}

return { response: greeting + mainResponse };
```

### 3. Data Caching
Cache MongoDB results to improve performance:

```javascript
// Check cache first
const cacheKey = `destinations_${Date.now() - (Date.now() % 300000)}`; // 5 min cache
let destinations = global.get(cacheKey);

if (!destinations) {
  // Fetch from MongoDB and cache
  destinations = $json;
  global.set(cacheKey, destinations);
}
```

## Production Deployment Tips

### 1. Environment Variables
```yaml
environment:
  - N8N_HOST=your-domain.com
  - WEBHOOK_URL=https://your-domain.com
  - N8N_PROTOCOL=https
```

### 2. Security Settings
```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=true
  - N8N_BASIC_AUTH_USER=your-username
  - N8N_BASIC_AUTH_PASSWORD=your-secure-password
```

### 3. Webhook URLs
Update chat service for production:
```javascript
this.n8nWebhookUrl = 'https://your-n8n-domain.com/webhook/chat';
```

This visual guide should help you understand and implement the n8n workflow step by step! 🎯
