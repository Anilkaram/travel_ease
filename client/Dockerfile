FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies with specific flags to handle deprecated warnings
RUN npm cache clean --force && \
    npm install --legacy-peer-deps --no-audit --no-fund --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start-nginx.sh /start-nginx.sh

# Set permissions
RUN chmod +x /start-nginx.sh && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["/start-nginx.sh"]

# FROM node:18-alpine as builder

# # Install build dependencies for native modules
# RUN apk add --no-cache python3 make g++

# # Set working directory
# WORKDIR /app

# # Set environment variables for build optimization
# ENV NODE_OPTIONS="--max-old-space-size=4096"
# ENV GENERATE_SOURCEMAP=false
# ENV CI=false

# # Copy package files
# COPY package*.json ./

# # Install dependencies with proper flags
# RUN npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline

# # Copy source code
# COPY . .

# # Build the application
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy built files
# COPY --from=builder /app/build /usr/share/nginx/html

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY start-nginx.sh /start-nginx.sh

# # Set permissions
# RUN chmod +x /start-nginx.sh && \
#     chmod -R 755 /usr/share/nginx/html

# EXPOSE 80

# CMD ["/start-nginx.sh"]
