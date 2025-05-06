/**
 * Performance monitoring web worker
 * 
 * This worker runs in the background to monitor application performance metrics
 * and implements optimizations without blocking the main thread
 */

const IDLE_TIME = 5000; // Time in ms before considering the app idle
const LOW_MEMORY_THRESHOLD = 200; // Memory threshold in MB to trigger cleanup
const CACHE_PREFIX = 'uin-survey-cache';
const CACHE_VERSION = 'v1';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

// Performance metrics tracking
let metrics = {
  idleTime: 0,
  lastActivity: Date.now(),
  memoryUsage: 0,
  isCriticalPath: true,
  networkRequests: 0,
  errors: 0,
  interactionCount: 0,
  longTasks: 0
};

// Flag to indicate if we should run aggressive optimizations
let isLowEndDevice = false;

/**
 * Initialization check for device capabilities
 */
function checkDeviceCapabilities() {
  // Determine if we're on a low-end device based on available info
  const hardwareConcurrency = self.navigator?.hardwareConcurrency || 4;
  const deviceMemory = self.navigator?.deviceMemory || 4;
  
  isLowEndDevice = hardwareConcurrency <= 4 || deviceMemory <= 4;
  
  self.postMessage({
    type: 'deviceCapabilities',
    data: {
      isLowEndDevice,
      hardwareConcurrency,
      deviceMemory
    }
  });
}

/**
 * Regularly clean memory and cleanup resources when the app is idle
 */
function monitorAndCleanup() {
  const now = Date.now();
  const timeSinceLastActivity = now - metrics.lastActivity;
  
  // If app is idle for sufficient time, perform cleanup
  if (timeSinceLastActivity > IDLE_TIME && !metrics.isCriticalPath) {
    // Cleanup operations for an idle app
    
    // Clean old caches
    if ('caches' in self) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old cache versions
            if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      });
    }
    
    // If memory usage is high, request garbage collection
    if (metrics.memoryUsage > LOW_MEMORY_THRESHOLD) {
      self.postMessage({
        type: 'optimizationRequired',
        data: {
          action: 'memoryCleanup',
          isLowEndDevice
        }
      });
    }
  }
  
  // Update total idle time for analytics
  if (!metrics.isCriticalPath) {
    metrics.idleTime += 1000; // Incremented every second when we check
  }
  
  // Schedule the next check
  setTimeout(monitorAndCleanup, 1000);
}

/**
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'init':
      // Initialize the worker
      checkDeviceCapabilities();
      monitorAndCleanup();
      break;
      
    case 'activityUpdate':
      // Update the last activity timestamp
      metrics.lastActivity = Date.now();
      metrics.isCriticalPath = data.isCriticalPath;
      metrics.interactionCount++;
      break;
      
    case 'memoryUpdate':
      // Update memory usage information
      metrics.memoryUsage = data.memory;
      break;
      
    case 'networkRequest':
      // Track network requests
      metrics.networkRequests++;
      
      // If we're seeing a lot of network activity while the app should be established,
      // suggest using more caching
      if (metrics.networkRequests > 50 && !metrics.isCriticalPath) {
        self.postMessage({
          type: 'optimizationRequired',
          data: {
            action: 'increaseCaching',
            isLowEndDevice
          }
        });
      }
      break;
      
    case 'error':
      // Track errors
      metrics.errors++;
      break;
      
    case 'longTask':
      // Track long tasks that might cause jank
      metrics.longTasks++;
      
      // If we're seeing a lot of long tasks, suggest optimizations
      if (metrics.longTasks > 5) {
        self.postMessage({
          type: 'optimizationRequired',
          data: {
            action: 'optimizeRendering',
            isLowEndDevice
          }
        });
      }
      break;
      
    case 'healthCheck':
      // Return current metrics for health monitoring
      self.postMessage({
        type: 'healthReport',
        data: metrics
      });
      break;
  }
});

// Signal that the worker is ready
self.postMessage({ type: 'ready' }); 