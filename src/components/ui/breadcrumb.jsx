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
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap space-x-2 text-sm">
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
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.label}>
              {/* Separator between items */}
              <li className="flex items-center text-secondary-400">
                <ChevronRight className="w-4 h-4 mx-1" strokeWidth={1.5} />
              </li>
              
              {/* Item */}
              <li className="flex items-center">
                {isLast ? (
                  // Current/last item (not a link)
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-primary-50/80 text-primary-900 font-medium shadow-sm backdrop-blur-sm border border-primary-100/50 max-w-[220px]">
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </div>
                ) : (
                  // Link to previous path
                  <Link 
                    to={item.path} 
                    className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors duration-200 group"
                  >
                    <span className="py-1.5 px-3 rounded-full bg-white/80 shadow-sm backdrop-blur-sm border border-gray-100 font-medium group-hover:bg-primary-50/50 group-hover:border-primary-100/50 transition-all duration-200 flex items-center">
                      {item.icon && <span className="mr-1.5">{item.icon}</span>}
                      <span>{item.label}</span>
                    </span>
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
