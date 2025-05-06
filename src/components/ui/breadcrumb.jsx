import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Create breadcrumb context
const BreadcrumbContext = createContext();

/**
 * Provider component for breadcrumb navigation
 * Allows setting and managing breadcrumb items throughout the app
 */
export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbItems, setBreadcrumbItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Hook to use breadcrumb context
 */
export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};

/**
 * Modern Apple-inspired floating Breadcrumb with 2025 design trends
 * Features glassmorphism, subtle animations, and elegant design
 * 
 * @param {Object[]} items - Array of breadcrumb items
 * @param {string} items[].path - URL path for the item (optional for current page)
 * @param {string} items[].label - Display text for the breadcrumb item
 * @param {React.ReactNode} items[].icon - Optional icon for the breadcrumb item
 * @param {boolean} items[].current - Whether this is the current page (active)
 * @param {string} className - Additional CSS classes for the breadcrumb
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  const [displayItems, setDisplayItems] = useState(items);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Update displayItems based on screen size
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      if (mobile && items.length > 2) {
        // For small screens, only show first and last item
        setDisplayItems([items[0], ...items.slice(-1)]);
      } else {
        // For larger screens, show all items
        setDisplayItems(items);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);
  
  if (!items || items.length === 0) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${className} sticky top-17 sm:top-16 z-30 py-2 sm:py-3 px-3 sm:px-4`}
      aria-label="Breadcrumb"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative backdrop-blur-md bg-white/45 dark:bg-gray-900/45 rounded-full shadow-lg border border-gray-100/40 dark:border-gray-800/40 px-4 sm:px-5 py-2.5 sm:py-3 overflow-hidden">
          {/* Subtle gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-indigo-50/15 to-purple-50/20 dark:from-blue-900/15 dark:via-indigo-900/10 dark:to-purple-900/15 opacity-50"></div>
          
          <ol className="flex items-center relative z-10 overflow-x-auto hide-scrollbar py-0.5">
            {/* Home item with back button for mobile */}
            <motion.li variants={itemVariants} className="flex items-center flex-shrink-0 mr-1.5">
              <Link 
                to="/" 
                className="group flex items-center mr-1.5"
              >
                <span className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/60 dark:bg-gray-800/60 shadow-sm border border-gray-100/40 dark:border-gray-700/40 group-hover:bg-blue-50/70 dark:group-hover:bg-blue-900/30 group-hover:border-blue-100/60 dark:group-hover:border-blue-700/40 transition-all duration-200">
                  <ArrowLeft className="w-4 h-4 sm:w-[16px] sm:h-[16px] text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 md:hidden" />
                  <Home className="w-4 h-4 sm:w-[16px] sm:h-[16px] text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 hidden md:block" />
                </span>
                <span className="ml-1.5 font-medium text-sm md:text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 hidden md:block">Beranda</span>
              </Link>
            </motion.li>

            {/* Ellipsis for truncated items on mobile */}
            {isMobile && items.length > 2 && (
              <motion.li variants={itemVariants} className="flex items-center text-gray-400 dark:text-gray-500 flex-shrink-0 mx-1.5">
                <div className="h-3.5 w-px bg-gray-200 dark:bg-gray-700 rounded-full mx-1 md:hidden"></div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 hidden md:block" />
                <span className="text-xs sm:text-sm mx-1">...</span>
              </motion.li>
            )}

            {/* Map through the display items */}
            {displayItems.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === displayItems.length - 1;
              
              // Skip Home item in the mapping since we render it separately
              if (isFirst && item.path === '/') return null;
              
              return (
                <React.Fragment key={`breadcrumb-${index}`}>
                  {/* Separator (not for first display item) */}
                  {!isFirst && (
                    <motion.li variants={itemVariants} className="flex items-center text-gray-400 dark:text-gray-500 flex-shrink-0 mx-1.5">
                      <div className="h-3.5 w-px bg-gray-200 dark:bg-gray-700 rounded-full mx-1 md:hidden"></div>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 hidden md:block" />
                    </motion.li>
                  )}
                  
                  <motion.li variants={itemVariants} className="flex items-center flex-shrink-0">
                    {isLast || item.current ? (
                      // Current page (not a link)
                      <span className="flex items-center px-2.5 sm:px-3 py-1.5 rounded-full bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium">
                        <span className="flex-shrink-0 mr-1.5 sm:mr-2">
                          {item.icon && React.cloneElement(item.icon, { className: 'h-3.5 w-3.5 sm:h-4 sm:w-4' })}
                        </span>
                        <span className="truncate max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-none">
                          {item.label}
                        </span>
                      </span>
                    ) : (
                      // Link to previous path
                      <Link 
                        to={item.path} 
                        className="flex items-center px-2.5 sm:px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 text-xs sm:text-sm transition-colors duration-200"
                      >
                        <span className="flex-shrink-0 mr-1.5 sm:mr-2">
                          {item.icon && React.cloneElement(item.icon, { className: 'h-3.5 w-3.5 sm:h-4 sm:w-4' })}
                        </span>
                        <span className="truncate max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-none">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </motion.li>
                </React.Fragment>
              );
            })}
          </ol>
        </div>
      </div>
    </motion.nav>
  );
};

export default Breadcrumb;
