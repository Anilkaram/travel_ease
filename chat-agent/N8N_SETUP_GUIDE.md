# 🤖 TravelEase n8n Chat Agent Setup Guide

## 🎯 Overview

This guide will help you set up n8n (Node8n) automation platform to power your TravelEase chat agent with advanced workflows, database integration, and intelligent responses.

## 🚀 Quick Start (Recommended)

### Step 1: Start with n8n Integration

```bash
# Stop your current containers
docker-compose down

# Start with n8n integration
docker-compose -f docker-compose-with-n8n.yml up -d

# Check all services are running
docker-compose -f docker-compose-with-n8n.yml ps
```

### Step 2: Access Services

- **TravelEase Website**: http://localhost (Port 80)
- **n8n Dashboard**: http://localhost:5678
- **API Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

### Step 3: n8n Login

- **URL**: http://localhost:5678
- **Username**: `admin`
- **Password**: `admin123`

## 🔧 n8n Configuration

### 1. Configure MongoDB Connection

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential** → **MongoDB**
3. Use these settings:
   ```
   Connection String: mongodb://admin:admin@mongo:27017/travelease?authSource=admin
   ```
4. Test connection and save as **"TravelEase MongoDB"**

### 2. Import Enhanced Workflow

1. In n8n, click **"+" → Import from file**
2. Upload: `chat-agent/enhanced-n8n-chat-workflow.json`
3. **Important**: In each MongoDB node, select **"TravelEase MongoDB"** credential
4. **Save** and **Activate** the workflow

### 3. Get Webhook URL

- Copy the webhook URL from the **"Chat Webhook"** node
- Should be: `http://localhost:5678/webhook/travelease-chat`

## 🎛️ Manual n8n Setup (Alternative)

If you prefer to run n8n separately:

### Install n8n

```bash
# Option 1: Using Docker
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n

# Option 2: Using npm
npm install n8n -g
n8n start
```

### Configure Environment

```bash
# Set environment variables
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=admin123
export WEBHOOK_URL=http://localhost:5678/
```

## 🧪 Testing Your Setup

### Test Script

```bash
# Run the provided test script
test-chat-agent.bat
```

### Manual Testing

```bash
# Test greeting
curl -X POST http://localhost:5678/webhook/travelease-chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Hello, I need help planning a trip\"}"

# Test destination query
curl -X POST http://localhost:5678/webhook/travelease-chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Tell me about Paris destinations\"}"

# Test tour inquiry
curl -X POST http://localhost:5678/webhook/travelease-chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"What tours do you have?\"}"
```

## 🎨 Workflow Features

### Enhanced Chat Agent Capabilities

1. **Intent Recognition**: Automatically detects user intentions
   - Greetings
   - Destination inquiries
   - Tour requests
   - Pricing questions
   - Booking assistance

2. **Database Integration**: 
   - Real-time MongoDB queries
   - Destination information retrieval
   - Tour package details
   - Dynamic pricing

3. **Smart Responses**:
   - Context-aware replies
   - Personalized recommendations
   - Multi-turn conversations
   - Fallback handling

4. **Session Management**:
   - User session tracking
   - Conversation history
   - Context preservation

## 🔧 Customization

### Adding New Intents

1. Open the **"Enhanced Message Processor"** node
2. Add new intents to the `intents` object:
   ```javascript
   const intents = {
     // Existing intents...
     weather: ['weather', 'climate', 'temperature'],
     activities: ['activities', 'things to do', 'attractions']
   };
   ```

### Adding New Response Types

1. Create new condition nodes in n8n
2. Add MongoDB queries for new data types
3. Create response processors for new intents

### Database Schema

Your MongoDB collections should include:

```javascript
// destinations collection
{
  name: "Paris",
  description: "The City of Light...",
  country: "France",
  featured: true,
  images: ["paris1.jpg", "paris2.jpg"]
}

// tours collection
{
  title: "Romantic Paris Getaway",
  destination: "Paris",
  price: 1299,
  duration: "5 days",
  description: "Experience the romance...",
  featured: true
}
```

## 🚀 Advanced Features

### 1. AI Integration

Add OpenAI or other AI services:
1. Add **HTTP Request** node
2. Connect to OpenAI API
3. Use for complex queries

### 2. Email Notifications

Add email sending for:
- Booking confirmations
- Support requests
- Newsletter signups

### 3. Calendar Integration

- Google Calendar for booking
- Availability checking
- Appointment scheduling

### 4. Payment Processing

- Stripe/PayPal integration
- Payment confirmations
- Invoice generation

## 📊 Monitoring & Analytics

### n8n Execution History

- View all chat interactions
- Monitor response times
- Track error rates
- Analyze user patterns

### Custom Analytics

Add tracking nodes to:
- Log user interactions
- Track popular destinations
- Monitor conversion rates
- Generate reports

## 🔒 Security Considerations

### Production Settings

```bash
# Environment variables for production
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=your_secure_username
N8N_BASIC_AUTH_PASSWORD=your_secure_password
N8N_ENCRYPTION_KEY=your_encryption_key
```

### Database Security

- Use strong MongoDB credentials
- Enable SSL/TLS connections
- Implement proper access controls
- Regular security audits

## 🐛 Troubleshooting

### Common Issues

1. **Webhook not responding**:
   - Check n8n is running: `docker-compose ps`
   - Verify workflow is activated
   - Check webhook URL in browser

2. **MongoDB connection failed**:
   - Verify MongoDB container is running
   - Check connection string
   - Test credentials manually

3. **Chat widget not working**:
   - Check browser console for errors
   - Verify environment variables
   - Test API endpoints manually

### Debug Commands

```bash
# Check container logs
docker-compose -f docker-compose-with-n8n.yml logs n8n
docker-compose -f docker-compose-with-n8n.yml logs mongo
docker-compose -f docker-compose-with-n8n.yml logs server

# Check container status
docker-compose -f docker-compose-with-n8n.yml ps

# Restart specific service
docker-compose -f docker-compose-with-n8n.yml restart n8n
```

## 🎯 Next Steps

1. **Start the system**: Use the quick start commands
2. **Import workflow**: Load the enhanced workflow
3. **Test functionality**: Run test scripts
4. **Customize responses**: Modify workflows as needed
5. **Monitor performance**: Check n8n execution history

Your TravelEase chat agent is now powered by n8n with advanced automation capabilities! 🎉

## 📞 Support

- Check n8n documentation: https://docs.n8n.io
- TravelEase chat logs: Check browser developer tools
- MongoDB queries: Use MongoDB Compass for debugging
