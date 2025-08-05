# TravelEase Chat Agent Test Examples

## Basic Test Requests

### 1. General Greeting
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what can you help me with?"}'
```

**Expected Response:**
```json
{
  "response": "👋 Welcome to TravelEase! I'm here to help you plan your perfect trip...",
  "intent": ["general"],
  "entities": {},
  "resultsCount": 18,
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```

### 2. Tour Inquiries
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me some tours"}'
```

### 3. Price-Based Queries
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "I want tours under $1500"}'
```

### 4. Location-Specific Requests
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Do you have tours to Paris?"}'
```

### 5. Duration-Based Queries
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me 7 day tours"}'
```

### 6. Featured Tours
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your featured tours?"}'
```

### 7. Destination Queries
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "What destinations do you offer?"}'
```

### 8. Complex Queries
```bash
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me budget tours to Europe for 5-7 days under $2000"}'
```

## Advanced Test Scenarios

### 1. Price Range Queries
```bash
# Test price range detection
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Tours between $1000-$2500"}'

curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a budget of $800 or less"}'
```

### 2. Multi-Intent Queries
```bash
# Query combining tours, location, and pricing
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Affordable Paris tours with good prices"}'
```

### 3. Negative Test Cases
```bash
# Query for non-existent location
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Tours to Antarctica"}'

# Unrealistic budget
curl -X POST http://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Tours under $10"}'
```

## Frontend Integration Examples

### JavaScript Fetch Example
```javascript
async function sendChatMessage(message) {
  try {
    const response = await fetch('http://your-n8n-webhook-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message })
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Chat error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

// Usage
sendChatMessage("Show me tours to Paris")
  .then(response => console.log(response));
```

### React Component Example
```jsx
import React, { useState } from 'react';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setChatHistory(prev => [...prev, { type: 'user', text: message }]);
    
    try {
      const response = await fetch('http://your-n8n-webhook-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      setChatHistory(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
    
    setMessage('');
    setLoading(false);
  };

  return (
    <div className="chatbot">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.type}`}>
            {chat.text}
          </div>
        ))}
        {loading && <div className="message bot">Thinking...</div>}
      </div>
      
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about tours, destinations, prices..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
```

### HTML/Vanilla JS Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>TravelEase Chat</title>
    <style>
        .chat-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .chat-history { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        .message { margin: 10px 0; padding: 10px; border-radius: 10px; }
        .user { background: #007bff; color: white; text-align: right; }
        .bot { background: #f8f9fa; color: #333; }
        .chat-input { display: flex; gap: 10px; }
        .chat-input input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .chat-input button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="chat-container">
        <h1>TravelEase Chat Assistant</h1>
        <div id="chatHistory" class="chat-history"></div>
        <div class="chat-input">
            <input id="messageInput" type="text" placeholder="Ask about tours, destinations, prices...">
            <button onclick="sendMessage()">Send</button>
        </div>
    </div>

    <script>
        const chatHistory = document.getElementById('chatHistory');
        const messageInput = document.getElementById('messageInput');

        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage('user', message);
            messageInput.value = '';

            try {
                const response = await fetch('http://your-n8n-webhook-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                addMessage('bot', data.response);
            } catch (error) {
                addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            }
        }

        function addMessage(type, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = text.replace(/\n/g, '<br>');
            chatHistory.appendChild(messageDiv);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }

        // Allow Enter key to send message
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });

        // Initial greeting
        addMessage('bot', '👋 Welcome to TravelEase! I can help you find tours, destinations, and pricing information. What are you looking for?');
    </script>
</body>
</html>
```

## Testing Checklist

### MongoDB Connection Tests
- [ ] Test with local Docker MongoDB
- [ ] Test with production MongoDB
- [ ] Test with MongoDB Atlas
- [ ] Verify credentials are working
- [ ] Test database connectivity

### Functionality Tests
- [ ] General greeting responses
- [ ] Tour queries work correctly
- [ ] Destination queries return results
- [ ] Price filtering works
- [ ] Location filtering works
- [ ] Duration filtering works
- [ ] Featured tour queries work
- [ ] Complex multi-criteria queries work
- [ ] No results scenarios handled gracefully

### Error Handling Tests
- [ ] Invalid/empty messages handled
- [ ] Database connection errors handled
- [ ] Malformed requests handled
- [ ] Large response handling
- [ ] Timeout scenarios

### Performance Tests
- [ ] Response time under 3 seconds
- [ ] Multiple concurrent requests handled
- [ ] Large dataset queries optimized
- [ ] Memory usage acceptable

## Expected Response Formats

### Successful Tour Query
```json
{
  "response": "🌟 I found 3 amazing tours for you!\n\n1. **Paris Adventure**\n   📍 Paris, France\n   ⏱️ 7 days\n   💰 $1,299\n   📝 Experience the beauty of Paris...\n\n2. **London Explorer**\n   📍 London, UK\n   ⏱️ 5 days\n   💰 $999\n   📝 Discover the charm of London...",
  "intent": ["tours"],
  "entities": {},
  "resultsCount": 3,
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```

### No Results Response
```json
{
  "response": "😔 I couldn't find any results matching your criteria.\n\n💡 Try increasing your budget above $100, or contact our travel experts for personalized recommendations!",
  "intent": ["tours", "pricing"],
  "entities": { "maxPrice": 100 },
  "resultsCount": 0,
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```

### Error Response
```json
{
  "response": "Sorry, I encountered an error while searching for tours. Please try again or contact our support team.",
  "error": "Database connection timeout",
  "timestamp": "2025-08-04T12:00:00.000Z"
}
```
