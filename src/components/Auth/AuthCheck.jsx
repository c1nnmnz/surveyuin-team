import { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * AuthCheck component
 * Verifies user authentication state on app startup
 * Ensures no stale user data persists between different users
 */
const AuthCheck = () => {
  const { isAuthenticated, user } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for inconsistent auth state on app startup
    const storedUser = localStorage.getItem('user-store');
    
    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);
        
        // If auth states don't match, clear everything
        if (isAuthenticated !== parsedData.state.isAuthenticated || 
            (isAuthenticated && user?.id !== parsedData.state.user?.id)) {
          console.warn('Inconsistent auth state detected, clearing data');
          
          // Clear all user-specific localStorage data
          const keys = Object.keys(localStorage);
          for (const key of keys) {
            if (key.includes('survey_progress_') || 
                key.includes('survey-storage') || 
                key.includes('user-') || 
                key.includes('form-')) {
              localStorage.removeItem(key);
            }
          }
          
          // Reload page to reset app state
          window.location.reload();
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
      }
    }

    // Save current path if it's a protected route (for redirect after login)
    const pathname = location.pathname;
    if (pathname.startsWith('/survey/') && !isAuthenticated) {
      // Extract serviceId safely by making sure there's content after /survey/
      const pathParts = pathname.split('/');
      const serviceId = pathParts.length > 2 ? pathParts[2] : null;
      
      // Only redirect with valid serviceId
      if (serviceId) {
        navigate('/login', { 
          state: { 
            from: pathname, 
            serviceId: serviceId
          },
          replace: true 
        });
      } else {
        // If no valid serviceId, just redirect to login
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, user, location, navigate]);

  // This is a utility component that doesn't render anything
  return null;
};

export default AuthCheck; 