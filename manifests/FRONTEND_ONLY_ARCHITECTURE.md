# Travel Ease Application - Frontend-Only External Access

## Architecture Overview

```
External Users → Ingress → Frontend (React) → Internal Backend (Express) → MongoDB
     🌐            ↓           ↓                    🔒                ↓
   Internet     LoadBalancer  client-service    server-service   mongo-service
```

## Security Model

### ✅ Externally Accessible:
- **Frontend (React App)**: Exposed via LoadBalancer IP
- **Static Assets**: Images, CSS, JavaScript files

### 🔒 Internal Only (Cluster-level access):
- **Backend API**: `server-service:80` (not exposed externally)
- **MongoDB**: `mongo:27017` (only accessible by backend)

## How It Works

1. **External Users** access the application via LoadBalancer IP
2. **Ingress Controller** routes all traffic to the React frontend
3. **React App** makes API calls to internal backend service (`server-service:80`)
4. **Backend** communicates with MongoDB internally
5. **All API communication** happens within the cluster (secure)

## Benefits

- ✅ **Enhanced Security**: Backend API not exposed to internet
- ✅ **Simplified Firewall**: Only one entry point (frontend)
- ✅ **DDoS Protection**: External attacks can't directly hit API
- ✅ **Network Isolation**: Database completely internal
- ✅ **Reduced Attack Surface**: Only frontend faces external traffic

## Deployment

```bash
# Deploy everything
bash deploy-testing.sh

# Access application
http://LOADBALANCER-IP/
```

## URLs

- **Frontend**: `http://LOADBALANCER-IP/` (External)
- **Backend**: `http://server-service:80/api/` (Internal Only)
- **MongoDB**: `mongodb://mongo:27017/travelease` (Internal Only)

## Network Flow

```
User Request → LoadBalancer → Ingress → client-service:80
                                         ↓
Frontend JavaScript → server-service:80/api/* (Internal)
                                         ↓
                      Backend → mongo:27017 (Internal)
```

This architecture ensures that only your React frontend is publicly accessible while keeping your API and database secure within the cluster.
