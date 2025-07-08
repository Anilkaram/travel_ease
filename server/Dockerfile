FROM node:16-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./


# Install dependencies including bcrypt
RUN npm install --production

# Copy all other files
COPY . .

# Ensure the build includes all necessary files
RUN ls -la /app/models/ # Verification step

EXPOSE 5000

# Run seed script before starting the server
CMD ["sh", "-c", "node seed.js && node app.js"]