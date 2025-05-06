import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import useDeviceDetection from '@/hooks/useDeviceDetection';

/**
 * OptimizedImage - A performance-optimized image component with:
 * - Lazy loading
 * - Responsive image loading based on device
 * - Blur-up image loading effect
 * - Fallback support
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional classes
 * @param {string} props.placeholderSrc - Low quality placeholder image (optional)
 * @param {Object} props.srcSet - Different image sizes for different devices
 * @param {string} props.fallbackSrc - Fallback image if main image fails to load
 * @param {boolean} props.priority - Whether to load the image with priority (disables lazy loading)
 * @param {string} props.objectFit - CSS object-fit property
 * @param {string} props.objectPosition - CSS object-position property
 * @param {Function} props.onLoad - Callback when image loads
 * @param {Function} props.onError - Callback when image fails to load
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  placeholderSrc,
  srcSet,
  fallbackSrc,
  priority = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);
  
  // Determine the appropriate image source based on device
  useEffect(() => {
    if (srcSet) {
      if (isMobile && srcSet.mobile) {
        setCurrentSrc(srcSet.mobile);
      } else if (isTablet && srcSet.tablet) {
        setCurrentSrc(srcSet.tablet);
      } else if (isDesktop && srcSet.desktop) {
        setCurrentSrc(srcSet.desktop);
      }
    }
  }, [isMobile, isTablet, isDesktop, srcSet]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (!error && fallbackSrc) {
      setError(true);
      setCurrentSrc(fallbackSrc);
    }
    if (onError) onError(e);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        className
      )}
      style={{
        backgroundColor: 'rgba(229, 231, 235, 0.3)', // Light gray background
      }}
    >
      {!isLoaded && placeholderSrc && (
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover bg-center blur-sm scale-105 transition-opacity"
          style={{ 
            backgroundImage: `url(${placeholderSrc})`,
            opacity: 0.6,
          }}
        />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
        )}
        style={{
          objectPosition,
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage; 