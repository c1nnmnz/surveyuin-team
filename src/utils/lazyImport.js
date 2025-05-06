import { lazy } from 'react';

/**
 * Enhanced lazy loading utility with named exports support and prefetching
 * 
 * @param {Function} importFn - Dynamic import function
 * @param {string} exportName - Export name to extract (for named exports)
 * @param {boolean} prefetch - Whether to prefetch the component
 * @returns {React.LazyExoticComponent}
 */
export const lazyImport = (importFn, exportName = null, prefetch = false) => {
  if (prefetch) {
    // Start loading the component in the background
    const modulePromise = importFn();
    
    // For debugging in development
    if (import.meta.env.DEV) {
      modulePromise.catch(err => {
        console.warn(`Error prefetching component:`, err);
      });
    }
  }
  
  // For default exports
  if (!exportName) {
    return lazy(importFn);
  }
  
  // For named exports
  return lazy(async () => {
    const module = await importFn();
    return { default: module[exportName] };
  });
};

/**
 * Prefetch a component for future use
 * 
 * @param {Function} importFn - Dynamic import function 
 */
export const prefetchComponent = (importFn) => {
  try {
    const modulePromise = importFn();
    
    // For debugging in development
    if (import.meta.env.DEV) {
      modulePromise.catch(err => {
        console.warn(`Error prefetching component:`, err);
      });
    }
  } catch (error) {
    // Silently fail in production, log in development
    if (import.meta.env.DEV) {
      console.warn(`Error prefetching component:`, error);
    }
  }
};

export default lazyImport; 