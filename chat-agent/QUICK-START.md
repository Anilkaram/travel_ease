# 🤖 TravelEase n8n Chat Agent - Complete Setup

## 📋 What You'll Get

A chat agent that:
1. ✅ Greets users: "Hi! What can I do for you?"  
2. ✅ Queries MongoDB destinations when users ask about travel
3. ✅ Shows detailed destination info from your database
4. ✅ Handles unknown destinations: "Try another destination"

## 🚀 Quick Start Steps

### 1️⃣ Configure MongoDB in n8n

1. Open n8n (usually `http://localhost:5678`)
2. Go to **Settings** → **Credentials** 
3. Create/edit MongoDB credential with:
   ```
   mongodb://admin:admin@localhost:27017/travelease?authSource=admin
   ```
4. Test connection and save as **"TravelEase MongoDB"**

### 2️⃣ Import the Workflow

1. In n8n, create **New Workflow**
2. Click **menu (⋯)** → **Import from JSON**
3. Copy content from `simple-chat-workflow.json` and import
4. In **"Query MongoDB"** node, select **"TravelEase MongoDB"** credential
5. **Save** and **Activate** the workflow

### 3️⃣ Get Your Webhook URL

- Click the **"Chat Webhook"** node
- Copy the webhook URL (e.g., `http://localhost:5678/webhook/travelease-chat`)

### 4️⃣ Test the Agent

**Windows:**
```cmd
# Run the test script
test-chat-agent.bat
```

**Manual Test:**
```cmd
# Test greeting
curl -X POST http://localhost:5678/webhook/travelease-chat -H "Content-Type: application/json" -d "{\"message\": \"hi\"}"

# Test destination
curl -X POST http://localhost:5678/webhook/travelease-chat -H "Content-Type: application/json" -d "{\"message\": \"tell me about Paris\"}"
```

## 📁 Files Created

- `simple-chat-workflow.json` - Main n8n workflow
- `setup-guide.md` - Detailed setup instructions  
- `test-chat-agent.bat` - Windows test script
- `test-chat-agent.sh` - Linux/Mac test script

## 🔍 Expected Behavior

### Greeting Input: `"hi"` or `"hello"`
```json
{
  "response": "Hi! What can I do for you? 🌍\n\nI can help you with information about travel destinations. Just ask me about any place you'd like to visit!",
  "type": "greeting"
}
```

### Destination Query: `"tell me about Paris"`
```json
{
  "response": "🌍 Here are the destinations I found:\n\n**1. Paris**\n📍 Location: France\nℹ️ The city of lights...",
  "type": "destinations_found",
  "count": 1,
  "destinations": [...]
}
```

### Unknown Destination: `"tell me about Mars"`
```json
{
  "response": "I couldn't find any destinations matching your query. 😔\n\nTry asking about popular destinations like:\n• Paris, France\n• Tokyo, Japan...",
  "type": "no_results"
}
```

## 🛠️ Troubleshooting

### ❌ MongoDB Connection Failed
```cmd
# Check containers are running
docker-compose ps

# Test MongoDB manually
docker exec -it <mongo_container> mongo -u admin -p admin --authenticationDatabase admin
```

### ❌ No Destinations Found
```javascript
// Add sample data to MongoDB
use travelease
db.destinations.insertMany([
  {
    name: "Paris",
    location: "France", 
    description: "The City of Light, famous for the Eiffel Tower.",
    image: "paris.jpg"
  }
]);
```

### ❌ Webhook Not Responding
- Ensure workflow is **Active** (green toggle)
- Check correct webhook URL
- Verify n8n is running on correct port

## 🎯 Your Chat Agent Flow

```
User Message 
    ↓
Greeting Check → "Hi! What can I do for you?"
    ↓
Destination Check → Query MongoDB
    ↓
Results Found? 
    ├─ Yes → Format & Show Destinations
    └─ No → "Try another destination"
```

## 🔄 Testing Your Setup

1. **Start your Docker containers:**
   ```cmd
   docker-compose up -d
   ```

2. **Open n8n and import the workflow**

3. **Run the test:**
   ```cmd
   test-chat-agent.bat
   ```

4. **Verify all 5 tests pass:**
   - ✅ Greeting response
   - ✅ Found destination
   - ✅ Unknown destination  
   - ✅ General destination query
   - ✅ Random message handling

## 🎉 Success!

Your n8n chat agent is now ready and will:
- Greet users warmly
- Search your MongoDB destinations
- Provide detailed destination information
- Guide users when destinations aren't found

**Next Steps:** Integrate this webhook URL into your frontend chat interface!
