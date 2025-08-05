@echo off
echo ==========================================
echo     CONNECTION TESTING SUITE
echo ==========================================
echo.

echo Testing the complete connection flow:
echo React App ---> n8n Webhook ---> MongoDB ---> Response
echo.

echo ==========================================
echo     STEP 1: TEST N8N WEBHOOK DIRECTLY
echo ==========================================
echo.
echo Testing if n8n webhook is responding...
echo.

echo --- Test 1: Basic webhook connectivity ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"test connection\"}" ^
  -w "HTTP Status: %%{http_code}\n" ^
  --connect-timeout 5 ^
  --max-time 10
echo.
echo.

echo --- Test 2: Destinations intent ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"show me destinations\"}" ^
  -w "HTTP Status: %%{http_code}\n" ^
  --connect-timeout 5 ^
  --max-time 10
echo.
echo.

echo --- Test 3: Pricing intent ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"what are tour prices\"}" ^
  -w "HTTP Status: %%{http_code}\n" ^
  --connect-timeout 5 ^
  --max-time 10
echo.
echo.

echo ==========================================
echo     STEP 2: TEST MONGODB CONNECTION
echo ==========================================
echo.
echo Checking if MongoDB has data...
echo.

echo --- Destinations count ---
docker exec travel_ease_mongodb_1 mongosh --username admin --password admin123 --authenticationDatabase admin --eval "use travelease; console.log('Destinations:', db.destinations.countDocuments()); console.log('Sample:', JSON.stringify(db.destinations.findOne(), null, 2));" 2>nul
echo.

echo --- Tours count ---
docker exec travel_ease_mongodb_1 mongosh --username admin --password admin123 --authenticationDatabase admin --eval "use travelease; console.log('Tours:', db.tours.countDocuments()); console.log('Sample:', JSON.stringify(db.tours.findOne(), null, 2));" 2>nul
echo.

echo ==========================================
echo     STEP 3: TEST REACT APP CONNECTION TO N8N
echo ==========================================
echo.
echo This tests what your React app would do...
echo.

echo Testing with same URL as React app uses:
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -H "Origin: http://localhost:3000" ^
  -d "{\"message\": \"hello from react app\"}" ^
  -w "HTTP Status: %%{http_code}\n" ^
  --connect-timeout 5 ^
  --max-time 10
echo.
echo.

echo ==========================================
echo     STEP 4: CHECK SERVICES STATUS
echo ==========================================
echo.
echo Checking if all required services are running...
echo.

docker-compose ps | findstr "Up"
echo.

echo ==========================================
echo     TROUBLESHOOTING GUIDE
echo ==========================================
echo.
echo IF WEBHOOK TESTS FAIL (HTTP 000, timeout, or connection refused):
echo   • Check if n8n container is running: docker-compose ps
echo   • Check if workflow is ACTIVE in n8n interface
echo   • Check n8n logs: docker-compose logs n8n
echo   • Verify port 5678 is not blocked
echo.
echo IF WEBHOOK RETURNS HTTP 404:
echo   • Workflow is not active
echo   • Webhook path is incorrect
echo   • Go to n8n interface and activate workflow
echo.
echo IF MONGODB TESTS FAIL:
echo   • Run: populate-mongodb-quick.bat
echo   • Check MongoDB credentials in n8n workflow
echo   • Verify MongoDB container is running
echo.
echo IF REACT APP CONNECTION FAILS:
echo   • Check if React app is using correct URL
echo   • Restart React container: docker-compose restart client
echo   • Check browser console for CORS errors
echo   • Check network connectivity between containers
echo.

pause
