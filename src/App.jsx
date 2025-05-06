import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazyImport, prefetchComponent } from './utils/lazyImport';
import { initRoutePrefetcher } from './utils/routePrefetcher';
import Layout from './components/Layout/Layout';
import { useUserStore } from './store/userStore';
import AuthCheck from './components/Auth/AuthCheck';
// import LoadingPage from './components/ui/LoadingPage';
import LoadingEffect from './components/ui/LoadingEffect';
import PageTransition from './components/ui/PageTransition';
import useDeviceDetection from './hooks/useDeviceDetection';
import { BreadcrumbProvider } from './components/ui/breadcrumb';

// Core components (high priority)
const HomePage = lazyImport(() => import('./pages/HomePage'), null, true);
const DirectoryPage = lazyImport(() => import('./pages/DirectoryPage'));
const ServiceDetailPage = lazyImport(() => import('./pages/ServiceDetailPage'));
const LoginPage = lazyImport(() => import('./pages/LoginPage'));
const NotFoundPage = lazyImport(() => import('./pages/NotFoundPage'));

// Secondary components (medium priority)
const SurveyPage = lazyImport(() => import('./pages/SurveyPage.jsx'));
const SurveyHistoryPage = lazyImport(() => import('./pages/SurveyHistoryPage'));
const SurveyDetailPage = lazyImport(() => import('./pages/SurveyDetailPage'));

// Non-critical components (low priority)
const AboutPage = lazyImport(() => import('./pages/AboutPage'));
const ProfilePage = lazyImport(() => import('./pages/ProfilePage'));
const EndingPage = lazyImport(() => import('./pages/EndingPage'));
const TestimonialsPage = lazyImport(() => import('./pages/TestimonialsPage'));

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

// Enhanced loading component with fluid loading effects
const PageLoader = ({ text }) => {
  const { isLowEnd } = useDeviceDetection();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
      <LoadingEffect 
        variant={isLowEnd ? "minimal" : "shimmer"} 
        size="lg" 
        text={text || "Memuat halaman..."} 
        color="blue"
      />
    </div>
  );
};

function App() {
  // Prefetch critical pages after initial load
  useEffect(() => {
    // Wait for initial render to complete
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        prefetchComponent(() => import('./pages/LoginPage'));
        prefetchComponent(() => import('./pages/DirectoryPage'));
        
        // Initialize the route prefetcher
        initRoutePrefetcher();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Add AuthCheck component to verify authentication state on startup */}
      <AuthCheck />
      
      {/* Add scroll restoration */}
      <ScrollToTop />
      
      <BreadcrumbProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
              <Route index element={
                <PageTransition variant="scale">
                  <HomePage />
                </PageTransition>
              } />
              <Route path="directory" element={
                <PageTransition variant="fade">
                  <DirectoryPage />
                </PageTransition>
              } />
              <Route path="service/:id" element={
                <PageTransition variant="slide">
                  <ServiceDetailPage />
                </PageTransition>
              } />
            <Route path="survey/:serviceId" element={
                <PageTransition variant="blur">
              <ProtectedRoute>
                <SurveyPage />
              </ProtectedRoute>
                </PageTransition>
            } />
              <Route path="login" element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } />
              <Route path="about" element={
                <PageTransition>
                  <AboutPage />
                </PageTransition>
              } />
              <Route path="testimonials" element={
                <PageTransition>
                  <TestimonialsPage />
                </PageTransition>
              } />
              <Route path="testimonials/:serviceId" element={
                <PageTransition>
                  <TestimonialsPage />
                </PageTransition>
              } />
            <Route path="profile" element={
                <PageTransition>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
                </PageTransition>
            } />
            <Route path="history" element={
                <PageTransition>
              <ProtectedRoute>
                <SurveyHistoryPage />
              </ProtectedRoute>
                </PageTransition>
            } />
            <Route path="history/:responseId" element={
                <PageTransition>
              <ProtectedRoute>
                <SurveyDetailPage />
              </ProtectedRoute>
                </PageTransition>
            } />
              <Route path="ending/:serviceId" element={
                <PageTransition>
                  <EndingPage />
                </PageTransition>
              } />
            {/* Redirect from feedback to testimonials */}
            <Route path="feedback/:serviceId" element={<Navigate to={location => `/testimonials/${location.pathname.split('/').pop()}`} replace />} />
              <Route path="*" element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              } />
          </Route>
        </Routes>
      </Suspense>
      </BreadcrumbProvider>
    </>
  );
}

export default App;
