#!/bin/bash
# Complete Travel Ease Application Deployment with Ingress

echo "Deploying Travel Ease Application with Ingress..."

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

# 5. Deploy Ingress based on environment
read -p "Deploy for (d)evelopment or (p)roduction? [d/p]: " env_choice

case $env_choice in
    p|P|production)
        echo "Deploying production ingress..."
        kubectl apply -f ingress-production.yml
        echo ""
        echo "Production deployment complete!"
        echo "Configure your DNS to point to the LoadBalancer IP:"
        kubectl get service ingress-nginx-controller --namespace=ingress-nginx
        ;;
    *)
        echo "Deploying development ingress..."
        kubectl apply -f ingress-dev.yml
        echo ""
        echo "Development deployment complete!"
        echo "Access your application at:"
        INGRESS_IP=$(kubectl get service ingress-nginx-controller --namespace=ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
        if [ -z "$INGRESS_IP" ]; then
            INGRESS_IP=$(kubectl get service ingress-nginx-controller --namespace=ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
        fi
        echo "http://$INGRESS_IP"
        ;;
esac

echo ""
echo "Deployment Summary:"
echo "- MongoDB: mongo:27017"
echo "- Frontend: client-service:80"
echo "- Backend: server-service:80"
echo "- Ingress: Routes traffic to appropriate services"
