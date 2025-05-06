import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useDeviceDetection from '@/hooks/useDeviceDetection';

/**
 * Reusable statistic card component with consistent styling and animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main statistic value
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.bgGradient - Background gradient classes
 * @param {string} props.overlayGradient - Overlay gradient for background
 * @param {string} props.textColor - Text color class
 * @param {string} props.iconBg - Icon background class
 * @param {string} props.iconRing - Icon ring class
 * @param {string} props.iconBorder - Icon border class
 * @param {string} props.link - Optional link path
 * @param {string} props.colorClass - Optional color class for value text
 * @param {boolean} props.starRating - Whether to display star rating
 * @param {React.ReactNode} props.ratingComponent - Custom rating component
 * @param {string} props.interpretation - Optional interpretation text
 * @returns {React.ReactNode}
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bgGradient,
  overlayGradient,
  textColor,
  iconBg,
  iconRing,
  iconBorder,
  link,
  colorClass,
  starRating = false,
  ratingComponent = null,
  interpretation,
  onClick,
  className = '',
  ...props
}) => {
  const { isAndroid } = useDeviceDetection();

  // Define the card content
  const cardContent = (
    <>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
      
      <div className="flex flex-col items-center flex-grow relative z-10">
        <div 
          className={`w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full flex items-center justify-center mb-3 md:mb-4 ${iconBg} shadow-sm ring-1 ${iconRing} ring-inset relative z-10 group-hover:scale-105 transition-transform duration-200`}
          style={{ boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 3px 6px -1px rgba(0, 0, 0, 0.06)' }}
        >
          {icon}
        </div>
        <h3 className={`text-2xl md:text-3xl font-bold mb-1 font-display tracking-tight ${colorClass || textColor}`}>
          {value}
        </h3>
        {starRating && ratingComponent}
        <p className="text-sm md:text-base font-medium opacity-90">{title}</p>
        {subtitle && (
          <p className="text-xs opacity-70 mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="mt-auto relative z-10">
        {interpretation && (
          <p className={`text-xs md:text-sm font-medium mt-1 ${colorClass || 'opacity-80'}`}>{interpretation}</p>
        )}
        {link && (
          <div className="mt-2 text-xs flex items-center justify-center opacity-80 group-hover:opacity-100">
            <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        )}
      </div>
    </>
  );

  // Base classnames for the card
  const baseClassNames = `
    rounded-2xl 
    bg-gradient-to-br ${bgGradient} 
    backdrop-blur-sm 
    p-4 md:p-6 
    text-center 
    shadow-lg hover:shadow-xl 
    transition-all duration-200 
    relative 
    overflow-hidden 
    group 
    flex flex-col 
    min-h-[180px] md:min-h-[200px] 
    justify-between 
    ${link || onClick ? 'hover:-translate-y-1 active:translate-y-0 active:shadow-md cursor-pointer' : ''}
    ${className}
  `;

  // Card style with optimizations for Android
  const cardStyle = {
    ...(isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {}),
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
    background: overlayGradient,
    borderColor: 'rgba(255, 255, 255, 0.9)'
  };

  // Return the card wrapped in a link if link prop is provided, otherwise a div
  if (link) {
    return (
      <Link to={link} className={baseClassNames} style={cardStyle} {...props}>
        {cardContent}
      </Link>
    );
  }

  // If onClick is provided without a link, use a button
  if (onClick) {
    return (
      <button onClick={onClick} className={baseClassNames} style={cardStyle} {...props}>
        {cardContent}
      </button>
    );
  }

  // Otherwise, use a div
  return (
    <motion.div className={baseClassNames} style={cardStyle} {...props}>
      {cardContent}
    </motion.div>
  );
};

export default StatCard; 