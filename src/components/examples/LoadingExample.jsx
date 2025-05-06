import React, { useState } from 'react';
import LoadingEffect from '../ui/LoadingEffect';
import Skeleton from '../ui/skeleton';
import { CircularSkeleton, TextSkeleton, RectangularSkeleton, CardSkeleton } from '../ui/skeleton';
import useLoading from '@/hooks/useLoading';

/**
 * Example component demonstrating various loading effects
 */
const LoadingExample = () => {
  const [activeTab, setActiveTab] = useState('shimmer');
  
  // Example of using the loading hook for a button
  const {
    isLoading: isButtonLoading,
    progress: buttonProgress,
    loadingVariant,
    startLoading,
    stopLoading
  } = useLoading({
    minLoadingTime: 1500,
    simulateProgress: true
  });
  
  // Handle button click to simulate loading
  const handleLoadClick = () => {
    startLoading(activeTab);
    
    // Simulate API call completion
    setTimeout(() => {
      stopLoading();
    }, 3000);
  };
  
  return (
    <div className="space-y-12 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Loading Effects</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Modern, fluid loading effects for a better user experience.
          Adapts based on device capabilities for optimal performance.
        </p>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {['shimmer', 'blur', 'logo', 'progress', 'minimal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition-colors
              ${activeTab === tab 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Loading Effect Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Different sizes */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-medium">Different Sizes</h3>
          <div className="flex flex-col items-center gap-8">
            <LoadingEffect variant={activeTab} size="sm" />
            <LoadingEffect variant={activeTab} size="md" />
            <LoadingEffect variant={activeTab} size="lg" />
          </div>
        </div>
        
        {/* Different colors */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-medium">Different Colors</h3>
          <div className="flex flex-col items-center gap-8">
            <LoadingEffect variant={activeTab} color="blue" text="Primary" />
            <LoadingEffect variant={activeTab} color="green" text="Success" />
            <LoadingEffect variant={activeTab} color="red" text="Error" />
          </div>
        </div>
        
        {/* Logo variant */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-medium">With Logo & Text</h3>
          <div className="flex flex-col items-center gap-8">
            <LoadingEffect 
              variant="logo" 
              size="lg" 
              text="Loading UIN Services"
              logo="/logo.png" 
            />
          </div>
        </div>
        
        {/* Interactive example */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-medium">Interactive Example</h3>
          <div className="h-40 flex items-center justify-center">
            {isButtonLoading ? (
              <LoadingEffect 
                variant={loadingVariant} 
                text="Processing data..." 
                progress={buttonProgress}
              />
            ) : (
              <p className="text-center text-gray-500">Click the button below to simulate a loading process</p>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleLoadClick}
              disabled={isButtonLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isButtonLoading
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
              }`}
            >
              {isButtonLoading ? 'Loading...' : 'Start Loading Process'}
            </button>
          </div>
        </div>
        
        {/* Skeleton Loading */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 space-y-6 md:col-span-2">
          <h3 className="text-xl font-medium">Skeleton Loading</h3>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <CircularSkeleton width="60px" />
              <div className="space-y-2">
                <TextSkeleton width="60%" />
                <TextSkeleton width="40%" />
              </div>
            </div>
            
            <RectangularSkeleton height="200px" className="rounded-lg" />
            
            <div className="grid grid-cols-2 gap-2">
              <CardSkeleton height="100px" />
              <CardSkeleton height="100px" />
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
              <TextSkeleton width="100px" />
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">
                {isLoadingExample ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingExample; 