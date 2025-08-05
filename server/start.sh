#!/bin/sh

echo "Waiting for MongoDB to be ready..."

# Function to check if MongoDB is ready
wait_for_mongodb() {
    echo "Checking MongoDB connection..."
    
    # Try to connect to MongoDB with timeout
    for i in $(seq 1 30); do
        echo "Attempt $i: Checking MongoDB at mongo:27017..."
        
        # Use node to test the connection
        node -e "
        const mongoose = require('mongoose');
        mongoose.connect('$MONGO_URI', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000
        })
        .then(() => {
            console.log('MongoDB connection successful!');
            process.exit(0);
        })
        .catch((err) => {
            console.log('MongoDB connection failed:', err.message);
            process.exit(1);
        });
        " && break
        
        echo "MongoDB not ready yet, waiting 5 seconds..."
        sleep 5
    done
    
    if [ $i -eq 30 ]; then
        echo "Failed to connect to MongoDB after 30 attempts"
        exit 1
    fi
}

# Wait for MongoDB
wait_for_mongodb

echo "MongoDB is ready! Starting application..."

# Run seed script first
echo "Running database seed..."
node seed.js

# Check if seed was successful
if [ $? -eq 0 ]; then
    echo "Database seeding completed successfully!"
else
    echo "Database seeding failed, but continuing with app startup..."
fi

# Start the main application
echo "Starting server..."
exec node app.js
