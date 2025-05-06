import { useState, useEffect, useRef } from 'react';
import useDeviceDetection from './useDeviceDetection';

/**
 * Hook for monitoring and optimizing application performance
 * Initializes a web worker to handle performance monitoring in the background
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether the monitor is enabled
 * @param {boolean} options.debug - Whether to show debug logs
 * @returns {Object} Performance monitoring tools and state
 */
const usePerformanceMonitor = ({ 
  enabled = true, 
  debug = false 
} = {}) => {
  const [worker, setWorker] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [optimizationsNeeded, setOptimizationsNeeded] = useState([]);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const { isLowEnd } = useDeviceDetection();
  
  // Use a ref for critical path to avoid re-renders
  const isCriticalPathRef = useRef(true);
  
  // Initialize the worker
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !window.Worker) {
      return;
    }
    
    try {
      // Create the web worker
      const performanceWorker = new Worker(
        new URL('../workers/performanceMonitor.js', import.meta.url),
        { type: 'module' }
      );
      
      // Set up message handler
      performanceWorker.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'ready':
            if (debug) console.log('[Performance Monitor] Worker ready');
            performanceWorker.postMessage({ type: 'init' });
            setIsInitialized(true);
            break;
            
          case 'deviceCapabilities':
            if (debug) console.log('[Performance Monitor] Device capabilities:', data);
            setIsLowEndDevice(data.isLowEndDevice || isLowEnd);
            break;
            
          case 'optimizationRequired':
            if (debug) console.log('[Performance Monitor] Optimization required:', data);
            setOptimizationsNeeded(prev => [...prev, data.action]);
            
            // Apply automatic optimizations for low-end devices
            if (data.isLowEndDevice && data.action === 'memoryCleanup') {
              // Clean up any large objects or caches
              if (window.caches) {
                window.caches.keys().then(cacheNames => {
                  cacheNames.forEach(cacheName => {
                    if (cacheName.includes('image-cache')) {
                      window.caches.delete(cacheName);
                    }
                  });
                });
              }
              
              // Release any held resources
              if (window.gc) {
                window.gc();
              }
            }
            break;
            
          case 'healthReport':
            if (debug) console.log('[Performance Monitor] Health report:', data);
            setMetrics(data);
            break;
            
          default:
            if (debug) console.log('[Performance Monitor] Unknown message:', event.data);
        }
      };
      
      // Handle worker errors
      performanceWorker.onerror = (error) => {
        console.error('[Performance Monitor] Worker error:', error);
      };
      
      setWorker(performanceWorker);
      
      // Cleanup
      return () => {
        performanceWorker.terminate();
      };
    } catch (error) {
      console.error('[Performance Monitor] Failed to initialize worker:', error);
    }
  }, [enabled, debug, isLowEnd]);
  
  // Update the worker about activity
  useEffect(() => {
    if (!worker || !isInitialized) return;
    
    // Update the worker about user activity
    const updateActivity = () => {
      worker.postMessage({ 
        type: 'activityUpdate', 
        data: { isCriticalPath: isCriticalPathRef.current } 
      });
      
      // Track memory usage if available
      if (performance.memory) {
        worker.postMessage({
          type: 'memoryUpdate',
          data: { memory: performance.memory.usedJSHeapSize / (1024 * 1024) }
        });
      }
    };
    
    // Set up activity tracking
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Track network requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      worker.postMessage({ type: 'networkRequest' });
      return originalFetch.apply(this, args);
    };
    
    // Track XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      worker.postMessage({ type: 'networkRequest' });
      return originalOpen.apply(this, args);
    };
    
    // Use PerformanceObserver to track long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Long tasks are > 50ms
              worker.postMessage({ type: 'longTask', data: { duration: entry.duration } });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('[Performance Monitor] PerformanceObserver not supported');
      }
    }
    
    // Initial update
    updateActivity();
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(() => {
      worker.postMessage({ type: 'healthCheck' });
    }, 10000);
    
    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalOpen;
      clearInterval(healthCheckInterval);
    };
  }, [worker, isInitialized]);
  
  // Functions to be exposed
  const setCriticalPath = (isCritical) => {
    isCriticalPathRef.current = isCritical;
    
    if (worker && isInitialized) {
      worker.postMessage({ 
        type: 'activityUpdate', 
        data: { isCriticalPath: isCritical } 
      });
    }
  };
  
  const reportError = (error) => {
    if (worker && isInitialized) {
      worker.postMessage({ type: 'error', data: { error } });
    }
  };
  
  return {
    isInitialized,
    isLowEndDevice,
    metrics,
    optimizationsNeeded,
    setCriticalPath,
    reportError
  };
};

export default usePerformanceMonitor; 