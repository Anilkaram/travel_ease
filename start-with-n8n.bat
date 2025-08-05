@echo off
echo ========================================
echo   TravelEase with n8n Chat Agent Setup
echo ========================================
echo.

echo Step 1: Stopping any existing containers...
docker-compose down 2>nul
docker-compose -f docker-compose-with-n8n.yml down 2>nul

echo.
echo Step 2: Starting TravelEase with n8n integration...
echo This will start:
echo   - TravelEase Website (Port 80)
echo   - n8n Automation (Port 5678)
echo   - API Backend (Port 5000)
echo   - MongoDB (Port 27017)
echo   - PostgreSQL for n8n (Port 5432)
echo.

docker-compose -f docker-compose-with-n8n.yml up -d

echo.
echo Step 3: Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Step 4: Checking service status...
docker-compose -f docker-compose-with-n8n.yml ps

echo.
echo ========================================
echo   🎉 Setup Complete!
echo ========================================
echo.
echo Access your services:
echo   📱 TravelEase Website: http://localhost
echo   🤖 n8n Dashboard:     http://localhost:5678
echo   🔧 API Backend:       http://localhost:5000
echo.
echo n8n Login Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Next Steps:
echo   1. Open http://localhost:5678 in your browser
echo   2. Login with the credentials above
echo   3. Import the workflow from: chat-agent/enhanced-n8n-chat-workflow.json
echo   4. Configure MongoDB credentials in n8n
echo   5. Test the chat agent on http://localhost
echo.
echo For detailed setup instructions, see:
echo   chat-agent/N8N_SETUP_GUIDE.md
echo.
pause
