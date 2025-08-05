@echo off
echo ==========================================
echo     COMPLETE SOLUTION TEST
echo ==========================================
echo.

echo Step 1: Populate MongoDB with sample data...
call populate-mongodb-quick.bat

echo.
echo Step 2: Testing webhook with different intents...
echo.

echo --- Testing destinations intent ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"show me destinations\"}"
echo.
echo.

echo --- Testing pricing intent ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"what are the prices\"}"
echo.
echo.

echo --- Testing general intent ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"hello\"}"
echo.
echo.

echo ==========================================
echo     TROUBLESHOOTING CHECKLIST
echo ==========================================
echo.
echo If webhook still doesn't work:
echo   1. Make sure n8n workflow is ACTIVE (toggle in n8n interface)
echo   2. Check execution logs in n8n interface
echo   3. Verify MongoDB credentials in n8n match your setup
echo.
echo If chat widget shows offline:
echo   1. Check if frontend is properly configured
echo   2. Verify webhook URL in chat service
echo   3. Check browser console for connection errors
echo.

pause
