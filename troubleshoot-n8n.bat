@echo off
echo ========================================
echo   TravelEase n8n Troubleshooting
echo ========================================
echo.

echo Step 1: Checking current container status...
docker-compose -f docker-compose-with-n8n.yml ps

echo.
echo Step 2: Checking n8n container logs...
echo ----------------------------------------
docker-compose -f docker-compose-with-n8n.yml logs --tail=20 n8n

echo.
echo Step 3: Checking PostgreSQL logs...
echo ------------------------------------
docker-compose -f docker-compose-with-n8n.yml logs --tail=10 postgres

echo.
echo Step 4: Testing individual service connectivity...
echo -------------------------------------------------

echo Testing PostgreSQL connection:
docker-compose -f docker-compose-with-n8n.yml exec postgres pg_isready -U n8n -d n8n 2>nul
if %errorlevel%==0 (
    echo ✅ PostgreSQL is ready
) else (
    echo ❌ PostgreSQL connection failed
)

echo.
echo Testing MongoDB connection:
docker-compose -f docker-compose-with-n8n.yml exec mongo mongosh --eval "db.adminCommand('ping')" 2>nul
if %errorlevel%==0 (
    echo ✅ MongoDB is ready
) else (
    echo ❌ MongoDB connection failed
)

echo.
echo Step 5: Testing n8n web interface...
curl -s http://localhost:5678 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ n8n web interface is accessible
) else (
    echo ❌ n8n web interface is not accessible
)

echo.
echo ========================================
echo   Suggested Solutions:
echo ========================================
echo.

echo If n8n is unhealthy, try these solutions:
echo.
echo Option 1 - Use simplified startup (no health checks):
echo   docker-compose -f docker-compose-simple.yml up -d
echo.
echo Option 2 - Manual step-by-step startup:
echo   docker-compose -f docker-compose-with-n8n.yml up -d postgres
echo   timeout /t 30 /nobreak ^> nul
echo   docker-compose -f docker-compose-with-n8n.yml up -d mongo
echo   timeout /t 30 /nobreak ^> nul
echo   docker-compose -f docker-compose-with-n8n.yml up -d server
echo   timeout /t 15 /nobreak ^> nul
echo   docker-compose -f docker-compose-with-n8n.yml up -d n8n
echo   timeout /t 30 /nobreak ^> nul
echo   docker-compose -f docker-compose-with-n8n.yml up -d client
echo.
echo Option 3 - Reset everything:
echo   docker-compose -f docker-compose-with-n8n.yml down -v
echo   docker system prune -f
echo   docker-compose -f docker-compose-with-n8n.yml build --no-cache
echo   docker-compose -f docker-compose-with-n8n.yml up -d
echo.
echo Option 4 - Skip n8n for now:
echo   Use the original docker-compose.yml for basic functionality
echo   Add n8n later when needed
echo.

echo Current Service URLs:
echo   TravelEase: http://localhost
echo   n8n:        http://localhost:5678 (admin/admin123)
echo   API:        http://localhost:5000
echo.
pause
