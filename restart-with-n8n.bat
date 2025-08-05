@echo off
echo ========================================
echo   TravelEase - Clean Restart with n8n
echo ========================================
echo.

echo Step 1: Stopping and cleaning up containers...
docker-compose -f docker-compose-with-n8n.yml down -v
docker system prune -f

echo.
echo Step 2: Rebuilding containers with latest changes...
docker-compose -f docker-compose-with-n8n.yml build --no-cache

echo.
echo Step 3: Starting services in proper order...
echo Starting PostgreSQL first...
docker-compose -f docker-compose-with-n8n.yml up -d postgres

echo Waiting for PostgreSQL to be ready...
timeout /t 15 /nobreak > nul

echo Starting MongoDB...
docker-compose -f docker-compose-with-n8n.yml up -d mongo

echo Waiting for MongoDB to be ready...
timeout /t 20 /nobreak > nul

echo Starting server (with seeding)...
docker-compose -f docker-compose-with-n8n.yml up -d server

echo Waiting for server to be ready...
timeout /t 10 /nobreak > nul

echo Starting n8n...
docker-compose -f docker-compose-with-n8n.yml up -d n8n

echo Waiting for n8n to be ready...
timeout /t 15 /nobreak > nul

echo Starting client...
docker-compose -f docker-compose-with-n8n.yml up -d client

echo.
echo Step 4: Checking service status...
docker-compose -f docker-compose-with-n8n.yml ps

echo.
echo Step 5: Checking server logs for successful startup...
echo MongoDB Connection Status:
docker-compose -f docker-compose-with-n8n.yml logs server | findstr /i "mongodb"

echo.
echo Seed Status:
docker-compose -f docker-compose-with-n8n.yml logs server | findstr /i "seed"

echo.
echo ========================================
echo   🎉 Startup Complete!
echo ========================================
echo.
echo Services Status:
echo   📱 TravelEase Website: http://localhost
echo   🤖 n8n Dashboard:     http://localhost:5678 (admin/admin123)
echo   🔧 API Backend:       http://localhost:5000
echo   🗄️  MongoDB:          localhost:27017
echo   🐘 PostgreSQL:       localhost:5432
echo.
echo If you see any connection errors above, wait a few more minutes
echo for all services to fully initialize, then check:
echo.
echo   docker-compose -f docker-compose-with-n8n.yml logs server
echo   docker-compose -f docker-compose-with-n8n.yml logs mongo
echo.
pause
