# MongoDB Connection Examples for n8n

## Connection String Examples

### Local Docker Environment
```
mongodb://admin:admin@localhost:27017/travelease?authSource=admin
```

### Docker Compose Network (container to container)
```
mongodb://admin:admin@mongo:27017/travelease?authSource=admin
```

### Production Server
```
mongodb://admin:admin@your-server-ip:27017/travelease?authSource=admin
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster0.abcde.mongodb.net/travelease?retryWrites=true&w=majority
```

### With SSL/TLS
```
mongodb://username:password@hostname:27017/travelease?authSource=admin&ssl=true&sslValidate=false
```

### Replica Set
```
mongodb://username:password@host1:27017,host2:27017,host3:27017/travelease?replicaSet=myReplicaSet&authSource=admin
```

## Values Configuration Examples

### Local Development
```json
{
  "host": "localhost",
  "port": 27017,
  "database": "travelease",
  "user": "admin",
  "password": "admin",
  "authenticationDatabase": "admin",
  "useSSL": false
}
```

### Docker Network
```json
{
  "host": "mongo",
  "port": 27017,
  "database": "travelease",
  "user": "admin",
  "password": "admin",
  "authenticationDatabase": "admin",
  "useSSL": false
}
```

### Production
```json
{
  "host": "your-mongodb-server.com",
  "port": 27017,
  "database": "travelease",
  "user": "your-username",
  "password": "your-secure-password",
  "authenticationDatabase": "admin",
  "useSSL": true
}
```

### MongoDB Atlas
```json
{
  "host": "cluster0.abcde.mongodb.net",
  "port": 27017,
  "database": "travelease",
  "user": "atlas-username",
  "password": "atlas-password",
  "authenticationDatabase": "",
  "useSSL": true
}
```

## Environment Variables Setup

### For Node.js Applications
```bash
# .env file
MONGO_URI=mongodb://admin:admin@localhost:27017/travelease?authSource=admin
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=travelease
MONGO_USER=admin
MONGO_PASSWORD=admin
MONGO_AUTH_DB=admin
```

### For Docker Compose
```yaml
environment:
  - MONGO_URI=mongodb://admin:admin@mongo:27017/travelease?authSource=admin
  - MONGO_HOST=mongo
  - MONGO_PORT=27017
  - MONGO_DATABASE=travelease
  - MONGO_USER=admin
  - MONGO_PASSWORD=admin
```

## Connection Options Explained

| Option | Description | Example |
|--------|-------------|---------|
| `host` | MongoDB server hostname or IP | `localhost`, `mongo`, `cluster0.mongodb.net` |
| `port` | MongoDB server port | `27017` (default) |
| `database` | Database name | `travelease` |
| `user` | Username for authentication | `admin`, `your-username` |
| `password` | Password for authentication | `admin`, `your-password` |
| `authenticationDatabase` | Database used for authentication | `admin` (default) |
| `authSource` | Same as authenticationDatabase in URI | `admin` |
| `useSSL/ssl` | Enable SSL/TLS connection | `true` for Atlas, `false` for local |
| `retryWrites` | Enable retryable writes | `true` (recommended) |
| `w` | Write concern | `majority` (recommended) |
| `poolSize` | Maximum connections in pool | `10` (default) |
| `serverSelectionTimeoutMS` | Server selection timeout | `5000` (5 seconds) |
| `socketTimeoutMS` | Socket timeout | `45000` (45 seconds) |

## Quick Setup Commands

### Test MongoDB Connection (Node.js)
```javascript
const { MongoClient } = require('mongodb');

// Using connection string
const uri = "mongodb://admin:admin@localhost:27017/travelease?authSource=admin";

async function testConnection() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ MongoDB connection successful!");
    
    // Test query
    const db = client.db('travelease');
    const count = await db.collection('tours').countDocuments();
    console.log(`📊 Found ${count} tours in database`);
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  } finally {
    await client.close();
  }
}

testConnection();
```

### MongoDB Shell Connection
```bash
# Local connection
mongosh "mongodb://admin:admin@localhost:27017/travelease?authSource=admin"

# Docker connection
docker exec -it mongo mongosh "mongodb://admin:admin@localhost:27017/travelease?authSource=admin"

# Atlas connection
mongosh "mongodb+srv://username:password@cluster0.abcde.mongodb.net/travelease"
```

## Troubleshooting Connection Issues

### Common Error Messages and Solutions:

#### "MongoServerError: Authentication failed"
- ✅ Check username and password
- ✅ Verify authentication database
- ✅ Ensure user exists and has proper roles

#### "MongooseServerSelectionError: connect ECONNREFUSED"
- ✅ Check if MongoDB service is running
- ✅ Verify host and port
- ✅ Check firewall settings
- ✅ For Docker: ensure containers are on same network

#### "MongoParseError: Invalid connection string"
- ✅ Check connection string syntax
- ✅ Ensure proper URL encoding for special characters
- ✅ Verify all required parameters are included

#### "MongoServerError: bad auth Authentication failed"
- ✅ Check if authSource/authenticationDatabase is correct
- ✅ For new databases, use `admin` as authSource
- ✅ Verify user has access to the specified database

### Connection Testing Checklist:
- [ ] MongoDB service is running
- [ ] Correct hostname/IP address
- [ ] Correct port number
- [ ] Valid username and password
- [ ] Proper authentication database
- [ ] Network connectivity (ping test)
- [ ] Firewall rules allow connection
- [ ] SSL/TLS configuration if required
