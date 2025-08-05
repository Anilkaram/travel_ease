@echo off
echo Rebuilding TravelEase containers with Node.js 18...
echo.

echo Step 1: Stopping existing containers...
docker-compose down

echo.
echo Step 2: Removing old images to force rebuild...
docker rmi travel_ease-client travel_ease-server 2>nul

echo.
echo Step 3: Building with Node.js 18 (this may take a few minutes)...
docker-compose build --no-cache

echo.
echo Step 4: Starting the containers...
docker-compose up -d

echo.
echo Build completed! Your application should now be running with Node.js 18.
echo.
echo Check status with: docker-compose ps
echo View logs with: docker-compose logs -f
echo.
pause
