import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';
import useDeviceDetection from '@/hooks/useDeviceDetection';

const Layout = () => {
  const location = useLocation();
  const { isLowEndDevice, setCriticalPath, reportError } = usePerformanceMonitor();
  const { isLowEnd, isMobile } = useDeviceDetection();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  
  // Critical paths require more resources, so we mark them for the performance monitor
  useEffect(() => {
    // These paths are considered critical (high interaction, important for UX)
    const criticalPaths = ['/survey', '/login', '/directory'];
    
    // Check if current path is a critical one
    const isCriticalPath = criticalPaths.some(path => location.pathname.startsWith(path));
    
    // Update the performance monitor
    setCriticalPath(isCriticalPath);
    
    // On low-end devices, disable animations for non-critical paths
    if ((isLowEndDevice || isLowEnd) && !isCriticalPath) {
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
  }, [location.pathname, isLowEndDevice, isLowEnd, setCriticalPath]);
  
  // Error boundaries
  useEffect(() => {
    const originalOnError = window.onerror;
    
    // Set up global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      reportError({ message, source, lineno, colno });
      
      // Call original handler if it exists
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    // Clean up
    return () => {
      window.onerror = originalOnError;
    };
  }, [reportError]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-secondary-50">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 