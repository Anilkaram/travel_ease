@echo off
echo ==========================================
echo     POPULATING MONGODB WITH SAMPLE DATA
echo ==========================================
echo.

echo Adding sample destinations...
docker exec travel_ease_mongodb_1 mongosh --username admin --password admin123 --authenticationDatabase admin --eval "use travelease; db.destinations.insertMany([ { name: 'Paris, France', location: 'Western Europe', description: 'The City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.', featured: true, imageUrl: '/images/paris.jpg', popularity: 95 }, { name: 'Tokyo, Japan', location: 'East Asia', description: 'A vibrant metropolis blending traditional culture with modern technology.', featured: true, imageUrl: '/images/tokyo.jpg', popularity: 90 }, { name: 'Bali, Indonesia', location: 'Southeast Asia', description: 'Tropical paradise known for beautiful beaches, temples, and rich culture.', featured: true, imageUrl: '/images/bali.jpg', popularity: 88 }, { name: 'New York, USA', location: 'North America', description: 'The Big Apple - iconic skyline, Broadway shows, and endless entertainment.', featured: true, imageUrl: '/images/new-york.jpg', popularity: 85 } ]); console.log('✅ Sample destinations added');"

echo.
echo Adding sample tours...
docker exec travel_ease_mongodb_1 mongosh --username admin --password admin123 --authenticationDatabase admin --eval "use travelease; db.tours.insertMany([ { title: 'Paris City Explorer', location: 'Paris, France', duration: '5 days', price: 899, description: 'Explore the best of Paris including Eiffel Tower, Louvre, and Seine River cruise.', isFeatured: true, category: 'city' }, { title: 'Tokyo Adventure', location: 'Tokyo, Japan', duration: '7 days', price: 1299, description: 'Experience modern Tokyo and traditional culture with guided city tours.', isFeatured: true, category: 'cultural' }, { title: 'Bali Beach Retreat', location: 'Bali, Indonesia', duration: '6 days', price: 699, description: 'Relax on pristine beaches and explore ancient temples in paradise.', isFeatured: true, category: 'beach' }, { title: 'New York City Break', location: 'New York, USA', duration: '4 days', price: 799, description: 'See the best of NYC - Times Square, Central Park, and Broadway show.', isFeatured: true, category: 'city' }, { title: 'Budget Paris Weekend', location: 'Paris, France', duration: '3 days', price: 449, description: 'Affordable Paris experience with essential sights and local cuisine.', isFeatured: false, category: 'budget' }, { title: 'Tokyo Budget Tour', location: 'Tokyo, Japan', duration: '4 days', price: 599, description: 'Experience Tokyo on a budget with local transportation and street food.', isFeatured: false, category: 'budget' } ]); console.log('✅ Sample tours added');"

echo.
echo Verifying data was added...
docker exec travel_ease_mongodb_1 mongosh --username admin --password admin123 --authenticationDatabase admin --eval "use travelease; console.log('Destinations count:', db.destinations.countDocuments()); console.log('Tours count:', db.tours.countDocuments()); console.log('✅ MongoDB populated successfully'); console.log('Sample destination:', JSON.stringify(db.destinations.findOne(), null, 2)); console.log('Sample tour:', JSON.stringify(db.tours.findOne(), null, 2));"

echo.
echo ==========================================
echo     DATA POPULATION COMPLETE!
echo ==========================================
echo Now test your n8n workflow with:
echo curl -X POST http://localhost:5678/webhook/chat -H "Content-Type: application/json" -d "{\"message\": \"show me destinations\"}"
echo.
pause
