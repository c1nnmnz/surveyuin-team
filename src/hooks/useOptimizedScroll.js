import { useEffect, useRef } from 'react';
import useDeviceDetection from './useDeviceDetection';

/**
 * Throttle function for limiting event frequency
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(callback, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(this, args);
    }
  };
}

/**
 * Hook for optimized scroll handling with device-specific optimizations
 * 
 * @param {Function} callback - Callback function to execute on scroll
 * @param {Object} options - Configuration options
 * @param {number} options.throttleMs - Throttle time in milliseconds
 * @param {boolean} options.passive - Whether to use passive event listener
 * @param {Object} options.dependencies - Dependencies to watch for effect recreation
 * @param {boolean} options.isLowEnd - Pass isLowEnd directly to avoid circular dependency
 * @param {boolean} options.isAndroid - Pass isAndroid directly to avoid circular dependency
 * @param {boolean} options.shouldOptimizeScroll - Pass shouldOptimizeScroll directly
 * @returns {Object} - Scroll state and utilities
 */
export const useOptimizedScroll = (
  callback,
  {
    throttleMs = 100,
    passive = true,
    dependencies = [],
    isLowEnd = false,
    isAndroid = false,
    shouldOptimizeScroll = false
  } = {}
) => {
  // Get device info if not provided directly
  const deviceInfo = useDeviceDetection();
  
  // Use provided values or fallback to detected values
  const isLowEndDevice = isLowEnd || deviceInfo.isLowEnd;
  const isAndroidDevice = isAndroid || deviceInfo.isAndroid;
  const shouldOptimize = shouldOptimizeScroll || deviceInfo.shouldOptimizeScroll;
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const scrollTimeoutRef = useRef(null);
  
  // Reference to store whether we're using throttling
  const isUsingThrottling = isAndroidDevice || isLowEndDevice;
  
  // Set up scroll event handler
  useEffect(() => {
    if (!callback) return;
    
    // LowEnd devices: simplified, highly throttled handler
    const handleScrollLowEnd = () => {
      lastScrollY.current = window.scrollY;
      
      if (!ticking.current) {
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Set new timeout with higher delay for low-end devices
        scrollTimeoutRef.current = setTimeout(() => {
          window.requestAnimationFrame(() => {
            callback(lastScrollY.current);
            ticking.current = false;
          });
        }, isLowEndDevice ? throttleMs * 2 : throttleMs);
        
        ticking.current = true;
      }
    };
    
    // Standard devices: optimized handler with RAF
    const handleScrollStandard = () => {
      lastScrollY.current = window.scrollY;
      
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          callback(lastScrollY.current);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    
    // Choose appropriate handler based on device capabilities
    const scrollHandler = shouldOptimize
      ? (isUsingThrottling ? throttle(handleScrollLowEnd, throttleMs) : handleScrollLowEnd)
      : handleScrollStandard;
    
    // Add the event listener
    window.addEventListener('scroll', scrollHandler, { passive });
    
    // Initial call if needed
    callback(window.scrollY);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, isAndroidDevice, isLowEndDevice, shouldOptimize, throttleMs, passive, ...dependencies]);

  // Add CSS for smoother scrolling on different devices
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .smooth-scroll-container {
        scroll-behavior: ${isLowEndDevice ? 'auto' : 'smooth'};
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scroll-snap-type: y proximity;
      }
      
      .scroll-snap-item {
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }
      
      .optimized-scroll {
        backface-visibility: hidden;
        perspective: 1000;
        transform: translate3d(0,0,0);
        will-change: transform;
      }
      
      @supports (scroll-behavior: smooth) {
        html {
          scroll-behavior: ${isLowEndDevice ? 'auto' : 'smooth'};
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [isLowEndDevice]);

  /**
   * Scroll to an element with optimization
   * @param {HTMLElement|string} target - Element or selector to scroll to
   * @param {Object} options - Scroll options
   */
  const scrollToElement = (target, options = {}) => {
    const { offset = 0, behavior = isLowEndDevice ? 'auto' : 'smooth' } = options;
    
    // Get the target element if string selector was provided
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior
    });
  };

  return {
    lastScrollY: lastScrollY.current,
    scrollToElement
  };
};

export default useOptimizedScroll; 