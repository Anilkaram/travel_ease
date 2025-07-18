#!/bin/bash

echo "Starting TravelEase Server..."

# Start the server first (non-blocking)
node app.js &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"

# Wait a moment for the server to start
sleep 5

# Run the seed script (but don't fail if it fails)
echo "Running seed script..."
node seed.js || echo "Seed script failed, but continuing..."

# Wait for the server process
wait $SERVER_PID
