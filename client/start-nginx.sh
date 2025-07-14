#!/bin/sh

echo "Starting nginx with environment-specific configuration..."

# Default to Docker Compose naming
API_BACKEND=${API_BACKEND:-"server:5000"}

echo "API Backend: $API_BACKEND"

# Replace placeholder in nginx config
sed -i "s/API_BACKEND_PLACEHOLDER/$API_BACKEND/g" /etc/nginx/conf.d/default.conf

# Validate nginx configuration
nginx -t

# Start nginx
exec nginx -g "daemon off;"
