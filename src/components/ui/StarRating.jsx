import React, { memo } from 'react';
import { Star } from 'lucide-react';

/**
 * Memoized StarRating component that displays rating as stars
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.score - Rating score
 * @param {number} props.maxScore - Maximum score (default: 5)
 * @param {boolean} props.showEmpty - Whether to show empty stars (default: true)
 * @param {boolean} props.allowHalf - Whether to allow half stars (default: true)
 * @param {boolean} props.showScore - Whether to show the numeric score (default: false)
 * @param {string} props.size - Size of the stars (default: 'md')
 * @param {string} props.color - Color of filled stars (default: 'amber')
 * @param {string} props.emptyColor - Color of empty stars (default: 'gray')
 * @returns {React.ReactNode}
 */
const StarRating = memo(({ 
  score, 
  maxScore = 5, 
  showEmpty = true, 
  allowHalf = true,
  showScore = false,
  size = 'md',
  color = 'amber',
  emptyColor = 'gray'
}) => {
  // Return null if score is not available
  if (score === "N/A") return null;
  
  // Parse score as number
  const numericScore = parseFloat(score);
  
  // Calculate full and half stars
  const fullStars = Math.floor(numericScore);
  const hasHalfStar = allowHalf && (numericScore - fullStars >= 0.5);
  const emptyStars = maxScore - fullStars - (hasHalfStar ? 1 : 0);
  
  // Size classes for the stars
  const sizeClasses = {
    'sm': 'w-3 h-3',
    'md': 'w-4 h-4',
    'lg': 'w-5 h-5',
    'xl': 'w-6 h-6'
  };
  
  // Color classes for the stars
  const colorClasses = {
    'amber': `text-amber-500 fill-amber-500`,
    'yellow': `text-yellow-500 fill-yellow-500`,
    'orange': `text-orange-500 fill-orange-500`,
    'red': `text-red-500 fill-red-500`,
    'green': `text-green-500 fill-green-500`,
    'blue': `text-blue-500 fill-blue-500`
  };
  
  // Empty star color classes
  const emptyColorClasses = {
    'gray': 'text-gray-300',
    'slate': 'text-slate-300',
    'zinc': 'text-zinc-300'
  };
  
  // Get the appropriate size and color classes
  const starSize = sizeClasses[size] || sizeClasses.md;
  const starColor = colorClasses[color] || colorClasses.amber;
  const starEmptyColor = emptyColorClasses[emptyColor] || emptyColorClasses.gray;
  
  return (
    <div className="flex justify-center mt-1 mb-1">
      {/* Render full stars */}
      {fullStars > 0 && 
        <>
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className={`${starSize} ${starColor}`} />
          ))}
        </>
      }
      
      {/* Render half star if needed */}
      {hasHalfStar && (
        <span className="relative">
          <Star className={`${starSize} ${starEmptyColor}`} />
          <Star 
            className={`${starSize} ${starColor} absolute inset-0 overflow-hidden`} 
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} 
          />
        </span>
      )}
      
      {/* Render empty stars */}
      {showEmpty && emptyStars > 0 && 
        <>
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className={`${starSize} ${starEmptyColor}`} />
          ))}
        </>
      }
      
      {/* Show numeric score if enabled */}
      {showScore && (
        <span className={`ml-2 text-sm font-medium ${starColor}`}>
          {numericScore.toFixed(1)}
        </span>
      )}
    </div>
  );
});

/**
 * Simplified star rating rendering optimized for low-end devices
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.score - Rating score
 * @param {number} props.maxScore - Maximum score
 * @param {boolean} props.showScore - Whether to show the numeric score
 * @param {string} props.size - Size of the stars
 * @param {string} props.color - Color of filled stars
 * @returns {React.ReactNode}
 */
export const SimpleStarRating = memo(({ 
  score, 
  maxScore = 5,
  showScore = false,
  size = 'md',
  color = 'amber'
}) => {
  if (score === "N/A") return null;
  
  const numericScore = parseFloat(score);
  const roundedScore = Math.round(numericScore);
  
  // Size classes for the stars
  const sizeClasses = {
    'sm': 'w-3 h-3',
    'md': 'w-4 h-4',
    'lg': 'w-5 h-5',
    'xl': 'w-6 h-6'
  };
  
  // Color classes for the stars
  const colorClasses = {
    'amber': `text-amber-500 fill-amber-500`,
    'yellow': `text-yellow-500 fill-yellow-500`,
    'orange': `text-orange-500 fill-orange-500`,
    'red': `text-red-500 fill-red-500`,
    'green': `text-green-500 fill-green-500`,
    'blue': `text-blue-500 fill-blue-500`
  };
  
  // Get the appropriate size and color classes
  const starSize = sizeClasses[size] || sizeClasses.md;
  const starColor = colorClasses[color] || colorClasses.amber;
  
  return (
    <div className="flex justify-center mt-1 mb-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`${starSize} ${star <= roundedScore ? starColor : 'text-gray-300'}`} 
          />
        ))}
        
        {/* Show numeric score if enabled */}
        {showScore && (
          <span className={`ml-2 text-sm font-medium ${starColor}`}>
            {numericScore.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
});

export default StarRating; 