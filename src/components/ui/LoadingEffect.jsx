import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

/**
 * LoadingEffect - An advanced loading component inspired by Apple UI design trends
 * Features fluid animations, shimmer effects, and dynamic adaptations
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - 'minimal', 'shimmer', 'blur', 'logo', 'progress'
 * @param {string} props.size - 'sm', 'md', 'lg', 'xl', 'full'
 * @param {string} props.text - Optional text to display
 * @param {string} props.logo - Optional logo image path
 * @param {string} props.color - Primary color theme (default: 'blue')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.transparent - Whether background should be transparent
 * @param {number} props.progress - Progress value (0-100) for progress variant
 */
const LoadingEffect = ({
  variant = 'shimmer',
  size = 'md',
  text,
  logo,
  color = 'blue',
  className,
  transparent = false,
  progress = null,
  ...props
}) => {
  const { isLowEnd, isMobile } = useDeviceDetection();
  const { isLowEndDevice } = usePerformanceMonitor();
  const [localProgress, setLocalProgress] = useState(0);
  
  // If progress is not provided, simulate progress for progress variant
  useEffect(() => {
    if (variant === 'progress' && progress === null) {
      const interval = setInterval(() => {
        setLocalProgress(prev => {
          if (prev >= 100) return 0;
          const increment = Math.random() * 15;
          return Math.min(prev + increment, 99);
        });
      }, 800);
      
      return () => clearInterval(interval);
    } else if (progress !== null) {
      setLocalProgress(progress);
    }
  }, [variant, progress]);
  
  // Use a simpler variant on low-end devices
  const effectiveVariant = (isLowEnd || isLowEndDevice) && variant !== 'minimal' ? 'minimal' : variant;
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    full: 'w-full h-full min-h-[200px]',
  };
  
  // Text size mappings
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    full: 'text-xl',
  };
  
  // Color mappings for different variants
  const colorClasses = {
    blue: 'from-blue-400 to-indigo-600',
    green: 'from-emerald-400 to-green-600',
    purple: 'from-purple-400 to-indigo-600',
    red: 'from-red-400 to-rose-600',
    orange: 'from-orange-400 to-amber-600',
    pink: 'from-pink-400 to-rose-600',
  };
  
  // Container class based on transparency setting
  const containerClass = transparent
    ? 'bg-transparent backdrop-blur-sm'
    : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md';
  
  // Render minimal variant (for low-end devices)
  if (effectiveVariant === 'minimal') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center",
          containerClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "rounded-full border-t-primary-500 border-r-transparent border-b-primary-300 border-l-transparent animate-spin border-2",
            sizeClasses[size]
          )} />
          {text && <p className={cn("text-gray-500 dark:text-gray-400 font-light", textSizeClasses[size])}>{text}</p>}
        </div>
      </div>
    );
  }
  
  // Shimmer effect variant (Apple-like)
  if (effectiveVariant === 'shimmer') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center overflow-hidden",
          containerClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn("relative", sizeClasses[size])}>
            {/* Base circle */}
            <motion.div 
              className={cn(
                "absolute inset-0 rounded-full border-[1.5px] border-gray-200 dark:border-gray-700",
              )}
            />
            
            {/* Inner rotating gradient */}
            <motion.div
              className={cn(
                "absolute inset-1 rounded-full bg-gradient-to-tr",
                colorClasses[color],
                "opacity-10 blur-sm"
              )}
              animate={{ 
                rotate: [0, 360],
                scale: [0.8, 1, 0.8],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.8), transparent)`,
              }}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Highlight reflection */}
            <motion.div
              className="absolute rounded-full w-[30%] h-[30%] bg-white/60 blur-sm"
              style={{ top: "10%", left: "10%" }}
            />
          </div>
          
          {text && (
            <motion.p 
              className={cn(
                "text-gray-600 dark:text-gray-300 tracking-wide font-light",
                textSizeClasses[size]
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }
  
  // Blur effect variant (morphing blob)
  if (effectiveVariant === 'blur') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center",
          containerClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn("relative", sizeClasses[size])}>
            {/* Morphing background blob */}
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-r blur-md",
                colorClasses[color],
                "opacity-40"
              )}
              animate={{
                borderRadius: [
                  "60% 40% 30% 70%/60% 30% 70% 40%",
                  "30% 60% 70% 40%/50% 60% 30% 60%",
                  "60% 40% 30% 70%/60% 30% 70% 40%"
                ],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Center spinning dot */}
            <motion.div
              className={cn(
                "absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-white/80 dark:bg-gray-800/80",
              )}
              animate={{
                scale: [1, 0.8, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          {text && (
            <motion.p 
              className={cn(
                "text-gray-600 dark:text-gray-300 tracking-wide font-light",
                textSizeClasses[size]
              )}
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }
  
  // Logo variant (Apple app loading style)
  if (effectiveVariant === 'logo') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center",
          containerClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn("relative", sizeClasses[size])}>
            {/* Logo container with 3D-like effects */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg flex items-center justify-center"
              initial={{ rotateY: 0 }}
              animate={{ 
                rotateY: [0, 10, 0, -10, 0],
                rotateX: [0, -10, 0, 10, 0],
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Logo image */}
              {logo ? (
                <img 
                  src={logo} 
                  alt="Loading" 
                  className="w-1/2 h-1/2 object-contain" 
                />
              ) : (
                <div className="text-primary-500 font-bold text-2xl">UIN</div>
              )}
            </motion.div>
            
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/40 to-transparent"
              animate={{
                backgroundPosition: ["200% 0%", "-200% 0%"]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 100%"
              }}
            />
          </div>
          
          {text && (
            <motion.p 
              className={cn(
                "text-gray-600 dark:text-gray-300 tracking-wide font-light",
                textSizeClasses[size]
              )}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }
  
  // Progress bar variant (Apple macOS style)
  if (effectiveVariant === 'progress') {
    return (
      <div 
        className={cn(
          "flex items-center justify-center",
          containerClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {/* Progress track */}
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Progress fill */}
            <motion.div
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                colorClasses[color]
              )}
              style={{ width: `${localProgress}%`, originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          </div>
          
          {text && (
            <div className="flex justify-between w-full">
              <motion.p 
                className={cn(
                  "text-gray-600 dark:text-gray-300 font-light",
                  textSizeClasses[size]
                )}
              >
                {text}
              </motion.p>
              
              <motion.p 
                className={cn(
                  "text-gray-500 dark:text-gray-400 font-light",
                  textSizeClasses[size]
                )}
                key={localProgress}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(localProgress)}%
              </motion.p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      {text && <p className="ml-3">{text}</p>}
    </div>
  );
};

export default LoadingEffect; 