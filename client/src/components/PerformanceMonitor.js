import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`Performance metric: ${entry.name}`, entry);
          
          // Log important metrics
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', {
              DNS: entry.domainLookupEnd - entry.domainLookupStart,
              TCP: entry.connectEnd - entry.connectStart,
              Request: entry.responseStart - entry.requestStart,
              Response: entry.responseEnd - entry.responseStart,
              Processing: entry.domInteractive - entry.responseEnd,
              Load: entry.loadEventEnd - entry.loadEventStart
            });
          }
          
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          
          if (entry.entryType === 'first-input') {
            console.log('FID:', entry.processingStart - entry.startTime);
          }
          
          if (entry.entryType === 'layout-shift') {
            if (!entry.hadRecentInput) {
              console.log('CLS:', entry.value);
            }
          }
        });
      });

      // Observe different types of performance entries
      try {
        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        // Fallback for older browsers
        console.log('Performance observer not fully supported');
      }

      // Monitor route changes
      let routeChangeTime = performance.now();
      const measureRouteChange = () => {
        const currentTime = performance.now();
        const routeChangeDelay = currentTime - routeChangeTime;
        console.log(`Route change took: ${routeChangeDelay.toFixed(2)}ms`);
        routeChangeTime = currentTime;
      };

      // Listen for route changes
      window.addEventListener('popstate', measureRouteChange);

      return () => {
        observer.disconnect();
        window.removeEventListener('popstate', measureRouteChange);
      };
    }
  }, []);

  return null;
};

export default PerformanceMonitor;
