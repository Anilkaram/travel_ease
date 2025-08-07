// Service Worker for caching and performance optimization
const CACHE_NAME = 'travelease-v1';
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/logo.png',
  '/manifest.json'
];

const API_CACHE_NAME = 'travelease-api-v1';
const IMAGE_CACHE_NAME = 'travelease-images-v1';

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper function to handle API requests
const handleApiRequest = (request) => {
  return caches.open(API_CACHE_NAME).then((cache) => {
    return fetch(request).then((response) => {
      // Only cache successful GET requests
      if (request.method === 'GET' && response.status === 200) {
        // Cache with a short TTL for API responses
        const responseClone = response.clone();
        cache.put(request, responseClone);
        
        // Set cache expiration
        setTimeout(() => {
          cache.delete(request);
        }, 5 * 60 * 1000); // 5 minutes
      }
      return response;
    }).catch(() => {
      // Return cached version if network fails
      return cache.match(request);
    });
  });
};

// Helper function to handle image requests
const handleImageRequest = (request) => {
  return caches.open(IMAGE_CACHE_NAME).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request).then((response) => {
        if (response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      });
    });
  });
};

// Helper function to handle other requests
const handleOtherRequest = (request) => {
  return caches.match(request).then((response) => {
    if (response) {
      return response;
    }
    
    return fetch(request).then((response) => {
      // Only cache successful responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    });
  });
};

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(handleOtherRequest(request));
});
