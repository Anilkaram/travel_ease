#!/bin/bash
# Travel Ease Application Deployment for Minikube

echo "Deploying Travel Ease Application on Minikube..."

# Check if Minikube is running
if ! minikube status | grep -q "Running"; then
    echo "Starting Minikube..."
    minikube start --cpus=4 --memory=4096  # Allocate sufficient resources
fi

# 1. Deploy storage class for Minikube
echo "Step 1: Deploying Minikube storage class..."
kubectl apply -f storage_class.yml

# 2. Deploy MongoDB
echo "Step 2: Deploying MongoDB..."
bash deploy_mongo.sh

# 3. Deploy Application Components
echo "Step 3: Deploying application components..."
kubectl apply -f client_config.yml
kubectl apply -f server_secret.yml
kubectl apply -f client_service.yml
kubectl apply -f server_service.yml
kubectl apply -f client_deployment.yml
kubectl apply -f server_deployment.yml

# 4. Wait for deployments to be ready
echo "Step 4: Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/client-deployment
kubectl wait --for=condition=available --timeout=300s deployment/server-deployment

# 5. Install NGINX Ingress Controller for Minikube
echo "Step 5: Checking NGINX Ingress Controller..."
if ! kubectl get namespace ingress-nginx &> /dev/null; then
    echo "Installing NGINX Ingress Controller for Minikube..."
    bash install-ingress-controller.sh
else
    echo "NGINX Ingress Controller already installed."
fi

# 6. Deploy ingress for frontend-only external access
echo "Step 6: Deploying ingress (frontend-only external access)..."
kubectl apply -f ingress.yml

echo ""
echo "✅ Minikube deployment complete!"
echo ""
echo "🔒 Security Architecture:"
echo "   ✅ Frontend: Externally accessible"
echo "   🔒 Backend:  Internal only (server-service:80)"
echo "   🔒 MongoDB:  Internal only (mongo:27017)"
echo ""

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo "🌐 Access your application at:"
echo "   Frontend: http://$MINIKUBE_IP/ (PUBLIC)"
echo "   Backend:  server-service:80/api/ (INTERNAL ONLY)"
echo ""
echo "📊 Check deployment status:"
echo "   kubectl get pods"
echo "   kubectl get services"
echo "   kubectl get ingress"
echo ""
echo "🔧 Minikube commands:"
echo "   minikube dashboard  # Open Kubernetes dashboard"
echo "   minikube tunnel     # Enable LoadBalancer services (if needed)"

echo ""
echo "📊 Check deployment status:"
echo "   kubectl get pods"
echo "   kubectl get services"
echo "   kubectl get ingress"
