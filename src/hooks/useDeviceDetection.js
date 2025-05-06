import { useState, useEffect } from 'react';

/**
 * Custom hook for device detection and optimization settings
 * 
 * @returns {Object} Device information and optimization flags
 * @property {boolean} isMobile - Whether the device is a mobile device
 * @property {boolean} isIOS - Whether the device is running iOS
 * @property {boolean} isAndroid - Whether the device is running Android
 * @property {boolean} isLowEnd - Whether the device is detected as a low-end device
 * @property {boolean} shouldOptimizeScroll - Whether scroll optimization should be applied
 */
export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [shouldOptimizeScroll, setShouldOptimizeScroll] = useState(false);

  useEffect(() => {
    // Device detection
    const checkDeviceCapabilities = () => {
      // Check mobile device
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Check iOS
      const iOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOS(iOS);
      
      // Check Android
      const android = /Android/i.test(navigator.userAgent);
      setIsAndroid(android);
      
      // Set scroll optimization for mobile devices
      setShouldOptimizeScroll(mobile || android);
      
      // Enhanced Android detection - some Android devices need optimization even if they're not technically "low-end"
      if (android) {
        // Check for Android version as some older Android versions have rendering issues
        const androidVersionMatch = navigator.userAgent.match(/Android\s([0-9.]+)/);
        const androidVersion = androidVersionMatch ? parseFloat(androidVersionMatch[1]) : 0;
        
        // Android devices with older OS or slower processors should be treated as low-end
        if (androidVersion < 10) {
          setIsLowEnd(true);
          return;
        }
      }
      
      // Low-end device detection
      const memoryLimit = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      
      // More comprehensive connection check
      const connectionType = navigator.connection ? 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' || 
         navigator.connection.effectiveType === '3g' ||
         navigator.connection.downlink < 1.5) : false;
        
      const screenSize = window.screen.width * window.screen.height;
      const isSmallScreen = screenSize < 1000000; // ~HD resolution threshold
      
      // Detect if device is reporting low battery - some devices throttle performance
      const isBatteryLow = 'getBattery' in navigator ? 
        navigator.getBattery().then(battery => battery.level < 0.15) : false;
      
      // For iOS devices, assume better performance but still considerate
      // If it's iOS but with slow connection, still consider it low-end
      if (iOS && connectionType) {
        setIsLowEnd(true);
        return;
      }
      
      // Consider Android devices that have any performance limitations as needing optimization
      const isLowEndDevice = android ? 
        (memoryLimit || connectionType || isSmallScreen || isBatteryLow) :
        ((memoryLimit || connectionType) && mobile);
        
      setIsLowEnd(isLowEndDevice);
    };
    
    // Add CSS classes to body based on device
    const addDeviceClasses = () => {
      if (isIOS) {
        document.body.classList.add('ios-device');
        
        // Add meta viewport tag with viewport-fit=cover if not present
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (existingViewport && !existingViewport.content.includes('viewport-fit=cover')) {
          existingViewport.content = `${existingViewport.content}, viewport-fit=cover`;
        }
      }
      
      if (isAndroid) {
        document.body.classList.add('android-device');
        
        // Force hardware acceleration for Android
        document.body.style.transform = 'translateZ(0)';
        document.body.style.backfaceVisibility = 'hidden';
        document.body.style.perspective = '1000px';
      }
    };
    
    try {
      checkDeviceCapabilities();
      addDeviceClasses();
    } catch (error) {
      console.error("Error detecting device capabilities:", error);
      // If there's any error in detection, default to safe values
      setIsLowEnd(false);
      setIsAndroid(false);
      setIsIOS(false);
      setShouldOptimizeScroll(false);
    }
    
    // Handle window resize
    const handleResize = () => {
      checkDeviceCapabilities();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up body classes
      document.body.classList.remove('ios-device', 'android-device');
    };
  }, []);

  return {
    isMobile,
    isIOS,
    isAndroid,
    isLowEnd,
    shouldOptimizeScroll
  };
};

export default useDeviceDetection; 