FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies including bcrypt and jsonwebtoken
RUN npm install

# Copy all other files
COPY . .

# Ensure the build includes all necessary files
RUN ls -la /app/models/ # Verification step

EXPOSE 5000

# Use Node.js startup script instead of shell script
CMD ["node", "startup.js"]