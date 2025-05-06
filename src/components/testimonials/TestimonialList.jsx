import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Skeleton from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import TestimonialCard from './TestimonialCard';
import useTestimonialStore from '@/store/testimonialStore';

// Skeleton for loading states
const TestimonialSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-5 w-[40px]" />
        </div>
        <Skeleton className="h-3 w-[180px]" />
      </div>
    </div>
    <Skeleton className="h-24 w-full" />
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
);

const TestimonialList = ({ loadMoreRef }) => {
  const { 
    testimonials, 
    isLoading, 
    pagination, 
    error,
    fetchTestimonials, 
    loadMore
  } = useTestimonialStore();
  
  // Setup intersection observer for infinite loading
  const [inViewRef, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  // Combine refs
  const setRefs = React.useCallback(
    (node) => {
      // Ref for intersection observer
      inViewRef(node);
      // Ref passed from parent
      if (loadMoreRef) {
        loadMoreRef(node);
      }
    },
    [inViewRef, loadMoreRef]
  );
  
  // Load initial data
  useEffect(() => {
    fetchTestimonials(true);
  }, [fetchTestimonials]);
  
  // Handle load more when bottom ref is in view
  useEffect(() => {
    if (inView && pagination?.hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, pagination, isLoading, loadMore]);
  
  // Find featured testimonial if any
  const featuredTestimonial = testimonials.find(t => t.isFeatured);
  const regularTestimonials = testimonials.filter(t => !t.isFeatured);
  
  // Empty state when no testimonials
  if (testimonials.length === 0 && !isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-950 shadow-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Tidak Ada Ulasan Ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Belum ada ulasan yang cocok dengan filter yang Anda pilih.
            Coba gunakan filter lain atau jadilah yang pertama memberikan ulasan!
          </p>
          <Button onClick={() => fetchTestimonials(true)}>
            Muat Ulang
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-950 shadow-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Gagal Memuat Ulasan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Terjadi kesalahan saat memuat ulasan. Silakan coba lagi nanti.
          </p>
          <Button onClick={() => fetchTestimonials(true)}>
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Staggered animation for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan {testimonials.length} dari {pagination?.total || 0} ulasan
      </div>
      
      {/* Featured testimonial */}
      {featuredTestimonial && (
        <div className="mb-8">
          <TestimonialCard testimonial={featuredTestimonial} featured={true} />
        </div>
      )}
      
      {/* Regular testimonials */}
      <motion.div 
        className="grid grid-cols-1 gap-4 sm:gap-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {regularTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TestimonialCard testimonial={testimonial} />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Loading skeletons */}
      {isLoading && (
        <>
          {[...Array(4)].map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white dark:bg-gray-950 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <TestimonialSkeleton />
            </div>
          ))}
        </>
      )}
      
      {/* Load more trigger */}
      {pagination?.hasMore && (
        <div 
          ref={setRefs}
          className="flex justify-center mt-8"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="w-full max-w-md"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memuat...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>Muat Lebih Banyak</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      )}
      
      {/* End of results message */}
      {!pagination?.hasMore && testimonials.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          Anda telah melihat semua ulasan yang tersedia.
        </div>
      )}
    </div>
  );
};

export default TestimonialList; 