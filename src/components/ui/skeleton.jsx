import React from 'react';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { cn } from "@/lib/utils"

/**
 * Reusable skeleton component for loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional classes for the skeleton
 * @param {string} props.variant - Skeleton variant ('text', 'circular', 'rectangular', 'card')
 * @param {number} props.width - Width of the skeleton (for non-percentage values)
 * @param {number} props.height - Height of the skeleton (for non-percentage values)
 * @param {number} props.count - Number of skeleton items to render
 * @param {boolean} props.animated - Whether the skeleton should be animated (default: true)
 * @param {boolean} props.optimized - Force optimized mode for low-end devices
 * @returns {React.ReactNode}
 */
const Skeleton = ({ 
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
  animated = true,
  optimized,
  ...props
}) => {
  const { isLowEnd } = useDeviceDetection();
  
  // Determine if animations should be optimized
  const shouldOptimize = optimized ?? isLowEnd;
  
  // Base skeleton style
  const baseStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : null,
  };
  
  // Variant-specific classes
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-lg'
  };
  
  // Default height based on variant if not explicitly specified
  if (!height) {
    switch (variant) {
      case 'text':
        baseStyle.height = '1rem';
        break;
      case 'circular':
        baseStyle.height = baseStyle.width;
        break;
      case 'rectangular':
        baseStyle.height = '100px';
        break;
      case 'card':
        baseStyle.height = '200px';
        break;
    }
  }
  
  // Build full class name
  const skeletonClassName = cn(
    "bg-gray-200 dark:bg-gray-700",
    animated && !shouldOptimize && "animate-pulse",
    variantClasses[variant] || variantClasses.text,
    className
  );
  
  // For multiple skeletons, add spacing between them
  const skeletonItemClassName = count > 1 ? 'mb-2 last:mb-0' : '';
  
  // Generate skeletons
  const skeletons = [...Array(count)].map((_, index) => (
    <div
      key={index}
      className={cn("skeleton", skeletonClassName, skeletonItemClassName)}
      style={baseStyle}
      {...props}
    />
  ));
  
  // If optimized and multiple skeletons, use a simpler layout
  if (shouldOptimize && count > 3) {
    // Only render 3 items for performance
    return (
      <div className="skeleton-container">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={cn("skeleton", skeletonClassName, skeletonItemClassName)}
            style={baseStyle}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="skeleton-container">
      {skeletons}
    </div>
  );
};

// Pre-configured skeleton components for common use cases
export const TextSkeleton = (props) => (
  <Skeleton variant="text" {...props} />
);

export const CircularSkeleton = (props) => (
  <Skeleton variant="circular" {...props} />
);

export const RectangularSkeleton = (props) => (
  <Skeleton variant="rectangular" {...props} />
);

export const CardSkeleton = (props) => (
  <Skeleton variant="card" {...props} />
);

/**
 * Skeleton for a card grid
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of cards
 * @param {number} props.columns - Number of columns for the grid
 * @param {boolean} props.optimized - Force optimized mode for low-end devices
 * @returns {React.ReactNode}
 */
export const CardGridSkeleton = ({ 
  count = 4, 
  columns = 2,
  optimized,
  className = '',
  ...props 
}) => {
  const { isLowEnd } = useDeviceDetection();
  
  // Determine if optimizations should be applied
  const shouldOptimize = optimized ?? isLowEnd;
  
  // For low-end devices, limit the number of rendered skeletons
  const actualCount = shouldOptimize ? Math.min(count, 4) : count;
  
  // Grid configuration
  const gridClassName = cn(
    "grid gap-4",
    columns === 1 && "grid-cols-1",
    columns === 2 && "grid-cols-1 sm:grid-cols-2",
    columns === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    className
  );
  
  return (
    <div className={gridClassName}>
      {[...Array(actualCount)].map((_, index) => (
        <CardSkeleton 
          key={index} 
          animated={!shouldOptimize || index < 2} 
          {...props} 
        />
      ))}
    </div>
  );
};

/**
 * Skeleton for a list of items
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of list items
 * @param {number} props.height - Height of each item
 * @param {boolean} props.withImage - Whether to include an image placeholder
 * @param {boolean} props.optimized - Force optimized mode for low-end devices
 * @returns {React.ReactNode}
 */
export const ListSkeleton = ({
  count = 5,
  height = 80,
  withImage = false,
  optimized,
  ...props
}) => {
  const { isLowEnd } = useDeviceDetection();
  
  // Determine if animations should be optimized
  const shouldOptimize = optimized ?? isLowEnd;
  
  // For low-end devices, limit the number of rendered skeletons
  const actualCount = shouldOptimize ? Math.min(count, 3) : count;
  
  return (
    <div className="space-y-3">
      {[...Array(actualCount)].map((_, index) => (
        <div 
          key={index} 
          className={cn(
            "flex items-center p-4 rounded-lg",
            shouldOptimize ? "bg-gray-100 dark:bg-gray-800" : "animate-pulse bg-gray-100 dark:bg-gray-800"
          )}
          style={{ height: `${height}px` }}
        >
          {withImage && (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4" />
          )}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            {height > 70 && (
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
