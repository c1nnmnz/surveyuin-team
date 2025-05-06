import { prefetchComponent } from './lazyImport';

// Route component mapping for prefetching
const routeComponents = {
  '/': () => import('../pages/HomePage'),
  '/directory': () => import('../pages/DirectoryPage'),
  '/login': () => import('../pages/LoginPage'),
  '/history': () => import('../pages/SurveyHistoryPage'),
  '/survey': () => import('../pages/SurveyPage'),
  '/testimonials': () => import('../pages/TestimonialsPage'),
  '/about': () => import('../pages/AboutPage'),
  '/profile': () => import('../pages/ProfilePage'),
  '/service': () => import('../pages/ServiceDetailPage'),
};

// Common navigation patterns - which routes users often navigate to after visiting a specific route
const navigationPatterns = {
  '/': ['/directory', '/login', '/about'],
  '/directory': ['/service', '/testimonials'],
  '/login': ['/directory', '/'],
  '/service': ['/survey', '/testimonials'],
  '/survey': ['/ending', '/directory'],
  '/history': ['/directory', '/profile'],
};

/**
 * Prefetch components for likely next routes based on current route
 * @param {string} currentPath - Current route path
 */
export const prefetchLikelyRoutes = (currentPath) => {
  // Skip if not browser environment
  if (typeof window === 'undefined') return;
  
  // Check if we're in the middle of actual user interaction, not initial load
  // This helps avoid unnecessary prefetches during the initial app load
  if (!document.body.classList.contains('app-ready')) {
    // Mark app as ready after a bit to enable future prefetching
    setTimeout(() => {
      document.body.classList.add('app-ready');
    }, 2000);
    return;
  }
  
  // Get the base path without parameters
  let basePath = currentPath.split('/').slice(0, 2).join('/');
  if (basePath === '') basePath = '/';
  
  // Predict likely next routes based on navigation patterns
  const likelyNextRoutes = navigationPatterns[basePath] || [];
  
  // Prefetch the components for these routes
  likelyNextRoutes.forEach(route => {
    const importFn = routeComponents[route];
    if (importFn) {
      // Use requestIdleCallback or a slight delay to avoid impacting current route rendering
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => prefetchComponent(importFn));
      } else {
        setTimeout(() => prefetchComponent(importFn), 1000);
      }
    }
  });
};

/**
 * Initialize route prefetching based on navigation
 * Should be called in the root component
 */
export const initRoutePrefetcher = () => {
  // Skip if not browser environment
  if (typeof window === 'undefined') return;
  
  // Track navigation and prefetch likely next routes
  // Listen for route changes
  let currentPath = window.location.pathname;
  
  // First prefetch after initial load
  setTimeout(() => {
    prefetchLikelyRoutes(currentPath);
  }, 2000);
  
  // Create a listener for future navigation
  const pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(history, arguments);
    currentPath = window.location.pathname;
    prefetchLikelyRoutes(currentPath);
  };
  
  // Also track back/forward navigation
  window.addEventListener('popstate', () => {
    currentPath = window.location.pathname;
    prefetchLikelyRoutes(currentPath);
  });
};

export default initRoutePrefetcher; 