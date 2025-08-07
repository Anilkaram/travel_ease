import { useEffect } from 'react';

const logNavigationTiming = (entry) => {
  console.log('Navigation timing:', {
    DNS: entry.domainLookupEnd - entry.domainLookupStart,
    TCP: entry.connectEnd - entry.connectStart,
    Request: entry.responseStart - entry.requestStart,
    Response: entry.responseEnd - entry.responseStart,
    Processing: entry.domInteractive - entry.responseEnd,
    Load: entry.loadEventEnd - entry.loadEventStart
  });
};

const logPerformanceEntry = (entry) => {
  console.log(`Performance metric: ${entry.name}`, entry);
  
  if (entry.entryType === 'navigation') {
    logNavigationTiming(entry);
  }
  
  if (entry.entryType === 'largest-contentful-paint') {
    console.log('LCP:', entry.startTime);
  }
  
  if (entry.entryType === 'first-input') {
    console.log('FID:', entry.processingStart - entry.startTime);
  }
  
  if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
    console.log('CLS:', entry.value);
  }
};

const createPerformanceObserver = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(logPerformanceEntry);
  });

  try {
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    console.log('Performance observer not fully supported');
  }

  return observer;
};

const setupRouteMonitoring = () => {
  let routeChangeTime = performance.now();
  
  const measureRouteChange = () => {
    const currentTime = performance.now();
    const routeChangeDelay = currentTime - routeChangeTime;
    console.log(`Route change took: ${routeChangeDelay.toFixed(2)}ms`);
    routeChangeTime = currentTime;
  };

  window.addEventListener('popstate', measureRouteChange);
  return measureRouteChange;
};

const PerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const observer = createPerformanceObserver();
    const measureRouteChange = setupRouteMonitoring();

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', measureRouteChange);
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
