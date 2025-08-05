@echo off
echo Testing TravelEase Chat Agent...
echo.

REM Test health endpoint
echo Testing health endpoint...
curl -X GET http://localhost:5000/api/health
echo.
echo.

REM Test chat endpoint with different messages
echo Testing chat with greeting...
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello, I need help planning a trip\"}"
echo.
echo.

echo Testing chat with destination query...
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"What destinations do you recommend?\"}"
echo.
echo.

echo Testing chat with pricing query...
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"message\": \"How much do your tours cost?\"}"
echo.
echo.

echo Chat agent testing completed!
pause
