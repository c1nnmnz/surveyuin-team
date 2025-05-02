import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Breadcrumb component with Apple/Shadcn UI style
 * 
 * @param {Object[]} items - Array of breadcrumb items
 * @param {string} items[].path - URL path for the item (optional for current page)
 * @param {string} items[].label - Display text for the breadcrumb item
 * @param {React.ReactNode} items[].icon - Optional icon for the breadcrumb item
 * @param {boolean} items[].current - Whether this is the current page (active)
 * @param {string} className - Additional CSS classes for the breadcrumb
 */
const Breadcrumb = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`relative z-10 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap space-x-1.5 text-sm">
        {/* Home is always the first item */}
        <li className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors duration-200 group"
          >
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm border border-gray-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-all duration-200">
              <Home className="w-4 h-4 text-secondary-600 group-hover:text-primary-600" />
            </span>
            <span className="ml-2 font-medium hidden sm:inline-block">Beranda</span>
          </Link>
        </li>

        {/* Map through the rest of the items */}
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          
          // Determine the appropriate element
          const content = (
            <div className="flex items-center">
              {item.icon && (
                <span className="flex-shrink-0 mr-1">
                  {item.icon}
                </span>
              )}
              <span className="truncate max-w-[120px] sm:max-w-[160px] md:max-w-none">
                {item.label}
              </span>
            </div>
          );
          
          return (
            <React.Fragment key={`breadcrumb-${index}`}>
              <li className="flex items-center">
                {isLast ? (
                  // Current page (not a link)
                  <span className={`flex items-center py-1 px-2 text-gray-600 font-medium ${isLast ? 'text-primary-700' : 'text-gray-500'}`}>
                    {content}
                  </span>
                ) : (
                  // Link to previous path
                  <Link 
                    to={item.path} 
                    className="flex items-center py-1 px-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                  >
                    {content}
                  </Link>
                )}
              </li>
              
              {/* Separator (not for last item) */}
              {!isLast && (
                <li className="flex items-center text-gray-400 flex-shrink-0">
                  <ChevronRight className="h-3 w-3" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
