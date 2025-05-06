import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import useDeviceDetection from '@/hooks/useDeviceDetection';

/**
 * Enhanced loading component with different variants
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Loading variant: 'page', 'component', 'overlay', 'inline', 'skeleton'
 * @param {string} props.size - Size: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} props.text - Optional text to display
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.optimized - Whether to use optimized version for low-end devices
 */
const LoadingPage = ({
  variant = 'page',
  size = 'md',
  text,
  className,
  optimized,
  ...props
}) => {
  const { isLowEnd } = useDeviceDetection();
  
  // Determine if we should show optimized version
  const shouldOptimize = optimized ?? isLowEnd;
  
  // Size mappings for the spinner
  const sizeMap = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-[5px]',
  };
  
  // Font size for the text
  const textSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  // Render optimized version for low-end devices
  if (shouldOptimize) {
    return (
      <div 
        className={cn(
          variant === 'page' && 'fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-50',
          variant === 'component' && 'w-full h-full flex items-center justify-center min-h-[100px]',
          variant === 'overlay' && 'absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10',
          variant === 'inline' && 'inline-flex items-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "rounded-full border-t-primary-500 border-b-primary-500 border-l-transparent border-r-transparent animate-spin", 
            sizeMap[size]
          )} />
          {text && <p className={cn("text-gray-500 dark:text-gray-400", textSizeMap[size])}>{text}</p>}
        </div>
      </div>
    );
  }

  // Skeleton loading variant
  if (variant === 'skeleton') {
    return (
      <div 
        className={cn(
          "w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
          className
        )}
        {...props}
      />
    );
  }

  // Enhanced spinner for modern devices with animations
  return (
    <div 
      className={cn(
        variant === 'page' && 'fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-50',
        variant === 'component' && 'w-full h-full flex items-center justify-center min-h-[100px]',
        variant === 'overlay' && 'absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10',
        variant === 'inline' && 'inline-flex items-center',
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <motion.div 
            className={cn(
              "rounded-full border-t-primary-500 border-b-primary-500 border-l-transparent border-r-transparent animate-spin", 
              sizeMap[size]
            )}
          />
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [0.85, 1.15, 0.85],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className={cn(
              "rounded-full border-r-primary-300 border-l-primary-300 border-t-transparent border-b-transparent", 
              sizeMap[size]
            )}></div>
          </motion.div>
          
          {variant === 'page' && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-primary-500 font-light text-sm">UIN</span>
            </motion.div>
          )}
        </div>
        
        {text && (
          <motion.p 
            className={cn("text-gray-500 dark:text-gray-400", textSizeMap[size])}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default LoadingPage; 