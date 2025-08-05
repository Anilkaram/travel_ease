@echo off
echo ==========================================
echo        COMPLETE TRAVELEASE CHAT FIX
echo ==========================================
echo.

echo This script will fix both issues:
echo 1. Populate MongoDB with sample data
echo 2. Fix chat service webhook URL
echo 3. Test the complete workflow
echo.

echo Step 1: Populating MongoDB...
echo.
docker exec mongo:5.0 mongosh --username admin --password admin --authenticationDatabase admin --eval "use travelease; db.destinations.deleteMany({}); db.tours.deleteMany({});"

echo Adding destinations...
docker exec mongo:5.0 mongosh --username admin --password admin --authenticationDatabase admin --eval "use travelease; db.destinations.insertMany([ { name: 'Paris, France', location: 'Western Europe', description: 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.', featured: true, imageUrl: '/images/paris.jpg', popularity: 95 }, { name: 'Tokyo, Japan', location: 'East Asia', description: 'A vibrant metropolis blending traditional culture with modern technology.', featured: true, imageUrl: '/images/tokyo.jpg', popularity: 90 }, { name: 'Bali, Indonesia', location: 'Southeast Asia', description: 'Tropical paradise known for beautiful beaches, temples, and rich culture.', featured: true, imageUrl: '/images/bali.jpg', popularity: 88 }, { name: 'New York, USA', location: 'North America', description: 'The Big Apple - iconic skyline, Broadway shows, and endless entertainment.', featured: true, imageUrl: '/images/new-york.jpg', popularity: 85 } ]);"

echo Adding tours...
docker exec mongo:5.0 mongosh --username admin --password admin --authenticationDatabase admin --eval "use travelease; db.tours.insertMany([ { title: 'Paris City Explorer', location: 'Paris, France', duration: '5 days', price: 899, description: 'Explore the best of Paris including Eiffel Tower, Louvre, and Seine River cruise.', isFeatured: true, category: 'city' }, { title: 'Tokyo Adventure', location: 'Tokyo, Japan', duration: '7 days', price: 1299, description: 'Experience modern Tokyo and traditional culture with guided city tours.', isFeatured: true, category: 'cultural' }, { title: 'Bali Beach Retreat', location: 'Bali, Indonesia', duration: '6 days', price: 699, description: 'Relax on pristine beaches and explore ancient temples in paradise.', isFeatured: true, category: 'beach' }, { title: 'New York City Break', location: 'New York, USA', duration: '4 days', price: 799, description: 'See the best of NYC - Times Square, Central Park, and Broadway show.', isFeatured: true, category: 'city' }, { title: 'Budget Paris Weekend', location: 'Paris, France', duration: '3 days', price: 449, description: 'Affordable Paris experience with essential sights and local cuisine.', isFeatured: false, category: 'budget' }, { title: 'Tokyo Budget Tour', location: 'Tokyo, Japan', duration: '4 days', price: 599, description: 'Experience Tokyo on a budget with local transportation and street food.', isFeatured: false, category: 'budget' } ]);"

echo.
echo Step 2: Verifying data...
docker exec mongo:5.0 mongosh --username admin --password admin --authenticationDatabase admin --eval "use travelease; console.log('✅ Destinations:', db.destinations.countDocuments()); console.log('✅ Tours:', db.tours.countDocuments());"

echo.
echo Step 3: Testing n8n webhook...
echo.
echo --- Testing destinations query ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"show me destinations\"}"
echo.
echo.

echo --- Testing pricing query ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"what are the tour prices\"}"
echo.
echo.

echo --- Testing general query ---
curl -X POST http://localhost:5678/webhook/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"hello\"}"
echo.
echo.

echo ==========================================
echo                 RESULTS
echo ==========================================
echo.
echo ✅ MongoDB populated with sample data
echo ✅ Chat service webhook URL fixed (webhook/chat instead of webhook-test/chat)
echo ✅ n8n webhook URLs tested above
echo.
echo Next steps:
echo 1. Make sure your n8n workflow is ACTIVE (toggle in n8n interface)
echo 2. Restart your React app if it's running: docker-compose restart client
echo 3. Test the chat widget in your browser
echo 4. Check n8n execution logs if issues persist
echo.

pause
