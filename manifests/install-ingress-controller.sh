#!/bin/bash
# Deploy NGINX Ingress Controller for Kops

echo "Installing NGINX Ingress Controller..."

# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

echo "Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

echo "Getting LoadBalancer IP..."
kubectl get service ingress-nginx-controller --namespace=ingress-nginx

echo ""
echo "NGINX Ingress Controller installed successfully!"
echo ""
echo "To deploy your application ingress:"
echo "kubectl apply -f ingress.yml"
echo ""
echo "For production with SSL:"
echo "kubectl apply -f ingress-production.yml"
