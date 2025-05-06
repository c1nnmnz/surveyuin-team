import { useState, useCallback, useEffect } from 'react';
import useDeviceDetection from './useDeviceDetection';

/**
 * Hook for managing loading states with loading effects
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.initialState - Initial loading state
 * @param {number} options.minLoadingTime - Minimum loading time in ms
 * @param {boolean} options.simulateProgress - Whether to simulate progress automatically
 * @param {Function} options.onLoadStart - Callback when loading starts
 * @param {Function} options.onLoadComplete - Callback when loading completes
 * @returns {Object} Loading state and controls
 */
const useLoading = ({
  initialState = false,
  minLoadingTime = 500,
  simulateProgress = false,
  onLoadStart,
  onLoadComplete
} = {}) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);
  const [loadingVariant, setLoadingVariant] = useState('shimmer');
  const { isMobile, isLowEnd } = useDeviceDetection();
  
  // Start loading with optional minimum time
  const startLoading = useCallback((variant = 'shimmer') => {
    setIsLoading(true);
    setProgress(0);
    setLoadingVariant(variant);
    
    if (onLoadStart) {
      onLoadStart();
    }
  }, [onLoadStart]);
  
  // Stop loading with optional minimum time
  const stopLoading = useCallback(() => {
    // If minimum loading time is set, ensure loading shows for at least that duration
    if (minLoadingTime > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(100);
        
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, minLoadingTime);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setProgress(100);
      
      if (onLoadComplete) {
        onLoadComplete();
      }
    }
  }, [minLoadingTime, onLoadComplete]);
  
  // Update progress manually
  const updateProgress = useCallback((newProgress) => {
    setProgress(Math.min(Math.max(0, newProgress), 100));
    
    // Automatically stop loading when progress reaches 100
    if (newProgress >= 100) {
      stopLoading();
    }
  }, [stopLoading]);
  
  // Function to handle progress simulation for progress bar variant
  useEffect(() => {
    if (!isLoading || !simulateProgress || progress >= 100) {
      return;
    }
    
    let interval;
    
    // Different progression speeds based on current progress
    if (progress < 30) {
      // Fast initial progress
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 5, 30));
      }, 200);
    } else if (progress < 70) {
      // Medium speed for middle section
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 3, 70));
      }, 300);
    } else if (progress < 90) {
      // Slower for final stretch
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 2, 90));
      }, 400);
    }
    
    return () => clearInterval(interval);
  }, [isLoading, progress, simulateProgress]);
  
  // Determine best loading variant based on device capabilities
  useEffect(() => {
    if (isLowEnd) {
      setLoadingVariant('minimal');
    } else if (isMobile) {
      setLoadingVariant('shimmer');
    }
  }, [isLowEnd, isMobile]);
  
  return {
    isLoading,
    progress,
    loadingVariant,
    startLoading,
    stopLoading,
    updateProgress,
    setLoadingVariant
  };
};

export default useLoading; 