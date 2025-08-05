@echo off
echo ========================================
echo   TravelEase - Step by Step Startup
echo ========================================
echo.

echo This script will start services one by one to avoid health check issues.
echo.

echo Step 1: Cleaning up any existing containers...
docker-compose -f docker-compose-with-n8n.yml down 2>nul

echo.
echo Step 2: Starting PostgreSQL (for n8n)...
docker-compose -f docker-compose-with-n8n.yml up -d postgres
echo Waiting 20 seconds for PostgreSQL to initialize...
timeout /t 20 /nobreak > nul

echo.
echo Step 3: Starting MongoDB...
docker-compose -f docker-compose-with-n8n.yml up -d mongo
echo Waiting 15 seconds for MongoDB to initialize...
timeout /t 15 /nobreak > nul

echo.
echo Step 4: Starting Server (with database seeding)...
docker-compose -f docker-compose-with-n8n.yml up -d server
echo Waiting 10 seconds for server to start and seed database...
timeout /t 10 /nobreak > nul

echo.
echo Step 5: Starting n8n (automation platform)...
docker-compose -f docker-compose-with-n8n.yml up -d n8n
echo Waiting 20 seconds for n8n to initialize...
timeout /t 20 /nobreak > nul

echo.
echo Step 6: Starting Client (web interface)...
docker-compose -f docker-compose-with-n8n.yml up -d client
echo Waiting 5 seconds for client to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 7: Checking final status...
docker-compose -f docker-compose-with-n8n.yml ps

echo.
echo Step 8: Testing connectivity...
echo Testing server API...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Server API is responding
) else (
    echo ⚠️  Server API not ready yet - may need more time
)

echo.
echo Testing n8n interface...
curl -s http://localhost:5678 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ n8n interface is responding
) else (
    echo ⚠️  n8n interface not ready yet - may need more time
)

echo.
echo ========================================
echo   🎉 Startup Sequence Complete!
echo ========================================
echo.
echo Your services should now be running:
echo   📱 TravelEase Website: http://localhost
echo   🤖 n8n Dashboard:     http://localhost:5678
echo   🔧 API Backend:       http://localhost:5000
echo.
echo If any service shows as "not ready", wait a few more minutes
echo and check the logs:
echo   docker-compose -f docker-compose-with-n8n.yml logs [service-name]
echo.
echo n8n Login Credentials:
echo   Username: admin
echo   Password: admin123
echo.
pause
