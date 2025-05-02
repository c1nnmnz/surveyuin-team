import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { useUserStore } from './store/userStore';
import AuthCheck from './components/Auth/AuthCheck';

// Load spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const DirectoryPage = lazy(() => import('./pages/DirectoryPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SurveyHistoryPage = lazy(() => import('./pages/SurveyHistoryPage'));
const SurveyDetailPage = lazy(() => import('./pages/SurveyDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const EndingPage = lazy(() => import('./pages/EndingPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // When route changes, scroll to top with a slight delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate feedback
      });
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
  
  return null;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      {/* Add AuthCheck component to verify authentication state on startup */}
      <AuthCheck />
      
      {/* Add scroll restoration */}
      <ScrollToTop />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="directory" element={<DirectoryPage />} />
            <Route path="service/:id" element={<ServiceDetailPage />} />
            <Route path="survey/:serviceId" element={
              <ProtectedRoute>
                <SurveyPage />
              </ProtectedRoute>
            } />
            <Route path="login" element={<LoginPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="testimonials/:serviceId" element={<TestimonialsPage />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="history" element={
              <ProtectedRoute>
                <SurveyHistoryPage />
              </ProtectedRoute>
            } />
            <Route path="history/:responseId" element={
              <ProtectedRoute>
                <SurveyDetailPage />
              </ProtectedRoute>
            } />
            <Route path="ending/:serviceId" element={<EndingPage />} />
            {/* Redirect from feedback to testimonials */}
            <Route path="feedback/:serviceId" element={<Navigate to={location => `/testimonials/${location.pathname.split('/').pop()}`} replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
