FROM node:16-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies including bcrypt and jsonwebtoken
RUN npm install

# Copy all other files
COPY . .

# Ensure the build includes all necessary files
RUN ls -la /app/models/ # Verification step

# Make startup script executable
RUN chmod +x startup.sh

EXPOSE 5000

# Use the new startup script
CMD ["sh", "startup.sh"]