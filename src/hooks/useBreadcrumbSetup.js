import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';

/**
 * Hook to automatically set up breadcrumbs for a page
 *
 * @param {Array} items - Array of breadcrumb items
 * @param {string} pageTitle - Title of the current page
 * @param {boolean} maintainTrail - Whether to maintain the breadcrumb trail or set new ones
 * @param {object} deps - Dependencies array to trigger breadcrumb updates
 */
const useBreadcrumbSetup = (items = [], pageTitle = '', maintainTrail = false, deps = []) => {
  const { setBreadcrumbTrail, updatePageTitle } = useBreadcrumb();
  const location = useLocation();
  
  useEffect(() => {
    if (pageTitle) {
      updatePageTitle(pageTitle);
    }
    
    if (items && items.length > 0) {
      if (maintainTrail) {
        // Add the current page to existing trail
        const lastItem = items[items.length - 1];
        if (lastItem && lastItem.path === location.pathname) {
          setBreadcrumbTrail(items);
        }
      } else {
        // Replace the trail with new items
        setBreadcrumbTrail(items);
      }
    }
  }, [pageTitle, location.pathname, maintainTrail, ...deps]);
  
  return { setBreadcrumbTrail, updatePageTitle };
};

export default useBreadcrumbSetup; 