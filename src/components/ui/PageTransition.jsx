import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

/**
 * PageTransition - Provides smooth transitions between pages
 * Inspired by Apple's fluid UI transitions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.variant - Transition style: 'fade', 'slide', 'scale', 'blur', 'none'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.enabled - Whether transitions are enabled
 */
const PageTransition = ({
  children,
  variant = 'fade',
  className,
  enabled = true,
  ...props
}) => {
  const location = useLocation();
  const { isLowEnd, isMobile } = useDeviceDetection();
  const { isLowEndDevice, setCriticalPath } = usePerformanceMonitor();
  
  // Disable animations on low-end devices for better performance
  const shouldAnimate = enabled && !(isLowEnd || isLowEndDevice);
  
  // Set a shorter duration for mobile devices
  const duration = isMobile ? 0.3 : 0.5;
  
  // Track when navigation happens for performance monitoring
  useEffect(() => {
    // Critical paths (important user flows) require higher performance priority
    const criticalPaths = ['/survey', '/login', '/directory'];
    const isCriticalPath = criticalPaths.some(path => location.pathname.startsWith(path));
    
    // Update performance monitoring to prioritize resources
    setCriticalPath(isCriticalPath);
  }, [location.pathname, setCriticalPath]);
  
  // Define transition variants
  const getTransitionProps = () => {
    if (!shouldAnimate) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
      };
    }
    
    switch (variant) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 15 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -15 },
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration
          }
        };
        
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.02 },
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration
          }
        };
        
      case 'blur':
        return {
          initial: { opacity: 0, filter: 'blur(8px)' },
          animate: { opacity: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, filter: 'blur(8px)' },
          transition: { duration }
        };
        
      case 'none':
        return {
          initial: {},
          animate: {},
          exit: {},
          transition: { duration: 0 }
        };
        
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration }
        };
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        {...getTransitionProps()}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 