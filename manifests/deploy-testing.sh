#!/bin/bash
# Simple Travel Ease Application Deployment for Testing

echo "Deploying Travel Ease Application for Testing..."

# 1. Deploy MongoDB
echo "Step 1: Deploying MongoDB..."
bash deploy_mongo.sh

# 2. Deploy Application Components
echo "Step 2: Deploying application components..."
kubectl apply -f client_config.yml
kubectl apply -f server_secret.yml
kubectl apply -f client_service.yml
kubectl apply -f server_service.yml
kubectl apply -f client_deployment.yml
kubectl apply -f server_deployment.yml

# 3. Wait for deployments to be ready
echo "Step 3: Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/client-deployment
kubectl wait --for=condition=available --timeout=300s deployment/server-deployment

# 4. Install NGINX Ingress Controller (if not already installed)
echo "Step 4: Checking NGINX Ingress Controller..."
if ! kubectl get namespace ingress-nginx &> /dev/null; then
    echo "Installing NGINX Ingress Controller..."
    bash install-ingress-controller.sh
else
    echo "NGINX Ingress Controller already installed."
fi

# 5. Deploy ingress for frontend-only external access
echo "Step 5: Deploying ingress (frontend-only external access)..."
kubectl apply -f ingress.yml

echo ""
echo "✅ Frontend-only deployment complete!"
echo ""
echo "🔒 Security Architecture:"
echo "   ✅ Frontend: Externally accessible"
echo "   🔒 Backend:  Internal only (server-service:80)"
echo "   🔒 MongoDB:  Internal only (mongo:27017)"
echo ""
echo "Getting access information..."
INGRESS_IP=$(kubectl get service ingress-nginx-controller --namespace=ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
if [ -z "$INGRESS_IP" ]; then
    INGRESS_IP=$(kubectl get service ingress-nginx-controller --namespace=ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)
fi

if [ -n "$INGRESS_IP" ]; then
    echo "🌐 Access your application at:"
    echo "   Frontend: http://$INGRESS_IP/ (PUBLIC)"
    echo "   Backend:  server-service:80/api/ (INTERNAL ONLY)"
else
    echo "⏳ LoadBalancer IP is still being assigned..."
    echo "   Run this command to get the IP when ready:"
    echo "   kubectl get service ingress-nginx-controller --namespace=ingress-nginx"
fi

echo ""
echo "📊 Check deployment status:"
echo "   kubectl get pods"
echo "   kubectl get services"
echo "   kubectl get ingress"
