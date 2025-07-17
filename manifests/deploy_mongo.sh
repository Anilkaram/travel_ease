#!/bin/bash
# Simple MongoDB Deployment for Testing

echo "Deploying MongoDB for Testing..."

# Deploy secret
kubectl apply -f mongo_secret.yml

# Deploy service  
kubectl apply -f mongo_service.yml

# Deploy StatefulSet
kubectl apply -f mongo_statefulset.yml

# Wait for pod to be ready
echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongo --timeout=180s

# Deploy server secret
kubectl apply -f server_secret.yml

echo "MongoDB deployment complete!"
echo ""
echo "Connection Details:"
echo "- Service: mongo:27017"
echo "- Username: admin"
echo "- Password: admin"
echo "- Database: travelease"
echo ""
echo "Test connection:"
echo "kubectl exec -it mongo-statefulset-0 -- mongosh -u admin -p admin --authenticationDatabase admin"
