import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Hook for prefetching routes on hover/focus
export const usePrefetch = () => {
  const navigate = useNavigate();

  const prefetchRoute = (path) => {
    // Create a link element to trigger prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
    
    // Clean up after a short delay
    setTimeout(() => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }, 5000);
  };

  return { prefetchRoute };
};

// Component for route preloading
const RoutePreloader = () => {
  const location = useLocation();
  const { prefetchRoute } = usePrefetch();

  useEffect(() => {
    // Prefetch likely next routes based on current location
    const currentPath = location.pathname;
    
    const prefetchMap = {
      '/': ['/destinations', '/tours', '/about'],
      '/destinations': ['/tours', '/search'],
      '/tours': ['/destinations', '/search'],
      '/about': ['/contact', '/tours'],
      '/search': ['/tours', '/destinations'],
    };

    const routesToPrefetch = prefetchMap[currentPath] || [];
    
    // Delay prefetching to not interfere with current page load
    const prefetchTimer = setTimeout(() => {
      routesToPrefetch.forEach((route) => {
        prefetchRoute(route);
      });
    }, 2000);

    return () => clearTimeout(prefetchTimer);
  }, [location.pathname, prefetchRoute]);

  return null;
};

export default RoutePreloader;
