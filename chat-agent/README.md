# TravelEase Chat Agent - MongoDB Connection Guide

## Overview
This guide shows you how to configure a chat agent in n8n that connects to your TravelEase MongoDB database and provides intelligent responses based on your travel data.

## Prerequisites
- n8n instance running
- Access to your TravelEase MongoDB database
- Basic understanding of n8n workflows

## Method 1: Connection String (Recommended)

### Step 1: Create MongoDB Credentials in n8n
1. Go to **Settings** → **Credentials** in your n8n interface
2. Click **"Create Credential"**
3. Select **"MongoDB"** from the list
4. Choose **"Connection String"** as the connection method

### Step 2: Configure Connection String
Use one of these connection strings based on your setup:

#### For Docker Environment (Local Development):
```
mongodb://admin:admin@localhost:27017/travelease?authSource=admin
```

#### For Production Environment:
```
mongodb://admin:admin@your-mongodb-host:27017/travelease?authSource=admin
```

#### For MongoDB Atlas (Cloud):
```
mongodb+srv://username:password@cluster-name.mongodb.net/travelease?retryWrites=true&w=majority
```

### Step 3: Test the Connection
- Click **"Test"** to verify the connection
- Save the credential with name: **"TravelEase MongoDB"**

## Method 2: Values Configuration

### Step 1: Create MongoDB Credentials in n8n
1. Go to **Settings** → **Credentials** in your n8n interface
2. Click **"Create Credential"**
3. Select **"MongoDB"** from the list
4. Choose **"Values"** as the connection method

### Step 2: Fill in Connection Details

#### For Local Docker Environment:
- **Host**: `localhost` (or `mongo` if running in same Docker network)
- **Port**: `27017`
- **Database**: `travelease`
- **User**: `admin`
- **Password**: `admin`
- **Authentication Database**: `admin`

#### For Production Environment:
- **Host**: Your MongoDB server IP/hostname
- **Port**: `27017` (or your custom port)
- **Database**: `travelease`
- **User**: Your MongoDB username
- **Password**: Your MongoDB password
- **Authentication Database**: `admin` (or your auth database)

#### For MongoDB Atlas:
- **Host**: Your cluster hostname (e.g., `cluster0.abcde.mongodb.net`)
- **Port**: `27017`
- **Database**: `travelease`
- **User**: Your Atlas username
- **Password**: Your Atlas password
- **Use SSL**: ✅ Enable
- **Authentication Database**: Leave empty for Atlas

### Step 3: Advanced Options (Optional)
- **Pool Size**: `10` (for connection pooling)
- **Server Selection Timeout**: `5000ms`
- **Socket Timeout**: `45000ms`

## Database Collections Structure

Your TravelEase database contains these main collections:

### Tours Collection
```json
{
  "_id": "ObjectId",
  "title": "Amazing Paris Tour",
  "description": "Experience the beauty of Paris...",
  "duration": "7 days",
  "price": 1299,
  "location": "Paris, France",
  "isFeatured": true,
  "image": "paris-tour.jpg",
  "createdAt": "2025-08-04T00:00:00.000Z",
  "updatedAt": "2025-08-04T00:00:00.000Z"
}
```

### Destinations Collection
```json
{
  "_id": "ObjectId",
  "name": "Paris",
  "location": "France",
  "description": "The city of lights and romance...",
  "image": "paris.jpg",
  "createdAt": "2025-08-04T00:00:00.000Z",
  "updatedAt": "2025-08-04T00:00:00.000Z"
}
```

### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "2025-08-04T00:00:00.000Z",
  "updatedAt": "2025-08-04T00:00:00.000Z"
}
```

## Workflow Import Instructions

1. **Import the Workflow**:
   - Open n8n
   - Click **"Import from File"**
   - Select the `n8n-chat-workflow.json` file

2. **Configure Credentials**:
   - Open each MongoDB node
   - Select your created credential: **"TravelEase MongoDB"**

3. **Activate the Workflow**:
   - Click the toggle to activate the workflow
   - Note the webhook URL provided

## Testing the Chat Agent

### Example Requests:

#### Ask about Tours:
```bash
curl -X POST your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me some tours"}'
```

#### Ask about Destinations:
```bash
curl -X POST your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "What destinations do you have?"}'
```

#### Ask about Pricing:
```bash
curl -X POST your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your tour prices?"}'
```

### Expected Response Format:
```json
{
  "response": "Here are our featured tours:\n\n1. **Amazing Paris Tour**\n   📍 Location: Paris, France\n   ⏱️ Duration: 7 days\n   💰 Price: $1299\n   📝 Experience the beauty of Paris...",
  "timestamp": "2025-08-04T12:00:00.000Z",
  "query_results": {
    "tours_found": 10,
    "destinations_found": 8
  }
}
```

## Troubleshooting

### Common Connection Issues:

1. **Connection Timeout**:
   - Check if MongoDB service is running
   - Verify network connectivity
   - Check firewall settings

2. **Authentication Failed**:
   - Verify username and password
   - Check authentication database
   - Ensure user has proper permissions

3. **Database Not Found**:
   - Verify database name spelling
   - Check if database exists
   - Ensure user has access to the database

4. **SSL/TLS Issues**:
   - For Atlas: Enable SSL in credentials
   - For local: Usually disable SSL
   - Check certificate requirements

### Testing Connection:
```javascript
// Test script to verify MongoDB connection
const { MongoClient } = require('mongodb');

const uri = "your-connection-string";
const client = new MongoClient(uri);

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = client.db('travelease');
    const tours = await db.collection('tours').countDocuments();
    const destinations = await db.collection('destinations').countDocuments();
    
    console.log(`📊 Found ${tours} tours and ${destinations} destinations`);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await client.close();
  }
}

testConnection();
```

## Security Best Practices

1. **Use Environment Variables**:
   - Store credentials securely
   - Never commit passwords to version control

2. **Limit Database Permissions**:
   - Create read-only user for chat agent
   - Grant minimum required permissions

3. **Enable Connection Pooling**:
   - Set appropriate pool size
   - Configure timeout values

4. **Monitor Connections**:
   - Track database usage
   - Set up alerts for connection issues

## Advanced Features

### Custom Query Filters:
You can modify the MongoDB nodes to include filters:

```json
{
  "operation": "find",
  "collection": "tours",
  "query": {
    "isFeatured": true,
    "price": { "$lte": 2000 }
  },
  "options": {
    "limit": 5,
    "sort": { "price": 1 }
  }
}
```

### Text Search Capabilities:
Enable text search on your collections:

```javascript
// Create text indexes
db.tours.createIndex({ 
  "title": "text", 
  "description": "text", 
  "location": "text" 
});

db.destinations.createIndex({ 
  "name": "text", 
  "description": "text", 
  "location": "text" 
});
```

This configuration will give you a fully functional chat agent that can intelligently respond to user queries about your travel offerings!
