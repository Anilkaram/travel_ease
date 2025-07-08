FROM node:16-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Ensure the build includes all necessary files
RUN ls -la /app/models/ # Verification step

EXPOSE 5000

CMD ["node", "app.js"]