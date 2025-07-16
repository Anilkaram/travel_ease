# MongoDB Production Deployment Script
# Deploy in this order for proper replica set initialization

echo "Deploying MongoDB Production Replica Set..."

# 0. Deploy StorageClass first (choose one based on your environment)
echo "Deploying StorageClass..."
# For AWS EKS:
kubectl apply -f storage_class.yml
# For local development (minikube):
# kubectl apply -f local_storage_class.yml

# 1. Deploy secrets
echo "Deploying secrets..."
kubectl apply -f secret.yml
kubectl apply -f mongo_keyfile_secret.yml

# 2. Deploy services
echo "Deploying services..."
kubectl apply -f mongo_service.yml          # Headless service (renamed from mongo_headless_service.yml)
kubectl apply -f mongo_primary_service.yml   # Regular service for app connections

# 3. Deploy StatefulSet
echo "Deploying StatefulSet..."
kubectl apply -f mongo_statefulset.yml

echo "Waiting for MongoDB pods to be ready..."
kubectl wait --for=condition=ready pod -l app=db --timeout=300s

# 4. Deploy job to add remaining members to replica set
echo "Adding remaining members to replica set..."
kubectl apply -f mongo_init_job.yml

echo "Waiting for replica set setup to complete..."
kubectl wait --for=condition=complete job/mongo-replica-set-add-members --timeout=180s

echo "MongoDB Replica Set Status:"
kubectl exec mango-statefulset-0 -- mongosh --host mango-statefulset-0.mongo-headless:27017 -u admin -p admin --authenticationDatabase admin --eval "rs.status()" --quiet

echo "Production MongoDB deployment complete!"
echo ""
echo "Connection Details:"
echo "- Replica Set Name: rs0"
echo "- Primary Service: mongo-primary:27017"
echo "- Headless Service: mongo-headless:27017"
echo "- Connection String for Apps:"
echo "  mongodb://admin:admin@mango-statefulset-0.mongo-headless:27017,mango-statefulset-1.mongo-headless:27017,mango-statefulset-2.mongo-headless:27017/travelease?authSource=admin&replicaSet=rs0"
