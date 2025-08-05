@echo off
echo ========================================
echo   Testing TravelEase n8n Chat Agent
echo ========================================
echo.

set WEBHOOK_URL=http://localhost:5678/webhook/travelease-chat

echo Testing n8n webhook endpoint: %WEBHOOK_URL%
echo.

echo Test 1: Greeting
echo ----------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"Hello, I need help planning a trip\", \"sessionId\": \"test-session-1\"}"
echo.
echo.

echo Test 2: Destination Inquiry
echo -------------------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"Tell me about Paris destinations\", \"sessionId\": \"test-session-2\"}"
echo.
echo.

echo Test 3: Tour Request
echo -----------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"What tours do you have for Tokyo?\", \"sessionId\": \"test-session-3\"}"
echo.
echo.

echo Test 4: Pricing Question
echo ----------------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"How much do your tours cost?\", \"sessionId\": \"test-session-4\"}"
echo.
echo.

echo Test 5: Booking Inquiry
echo ---------------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"How do I book a tour to Bali?\", \"sessionId\": \"test-session-5\"}"
echo.
echo.

echo Test 6: General Question
echo ----------------------
curl -X POST %WEBHOOK_URL% -H "Content-Type: application/json" -d "{\"message\": \"What can you help me with?\", \"sessionId\": \"test-session-6\"}"
echo.
echo.

echo ========================================
echo   Testing Complete!
echo ========================================
echo.
echo If you see JSON responses above, your n8n chat agent is working correctly!
echo.
echo To check n8n execution history:
echo 1. Open http://localhost:5678
echo 2. Go to Executions tab
echo 3. View the test executions
echo.
echo To debug issues:
echo 1. Check if n8n is running: docker-compose -f docker-compose-with-n8n.yml ps
echo 2. Check n8n logs: docker-compose -f docker-compose-with-n8n.yml logs n8n
echo 3. Verify workflow is activated in n8n dashboard
echo.
pause
