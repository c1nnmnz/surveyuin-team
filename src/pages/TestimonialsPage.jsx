import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Star, ChevronLeft, ThumbsUp, MessageSquare, Search, Filter, Award, 
  Sparkles, Home, ChevronRight, Clock, Calendar, Share, AlertTriangle, 
  ArrowUp, Heart, Reply, Flag, Bookmark, Send, X, BarChart3, ChevronDown,
  RefreshCw, Download, Sliders, SlidersHorizontal, Check, CircleUser, 
  BadgeCheck, ArrowUpRight, Plus, MessageSquarePlus
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useDirectoryStore } from '../store/directoryStore';
import { generateGradient } from '../utils/colorUtils';
import { format, formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import { useUserStore } from '../store/userStore';
import useTestimonialStore from '@/store/testimonialStore';

// Import UI components
import Button3D from '../components/Button3D';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Skeleton } from '../components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ScrollArea } from '../components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Toaster } from '@/components/ui/use-toast.jsx';

// Import custom components
import TestimonialHeader from '@/components/testimonials/TestimonialHeader';
import TestimonialStats from '@/components/testimonials/TestimonialStats';
import TestimonialListFilters from '@/components/testimonials/TestimonialListFilters';
import TestimonialList from '@/components/testimonials/TestimonialList';
import TestimonialDialog from '@/components/testimonials/TestimonialDialog';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Skeleton loading component for testimonial cards
const TestimonialSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
    <div className="flex items-start">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="ml-4 space-y-3 flex-1">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-16 bg-gray-200 rounded w-full"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Chart options and configs
const getRatingChartOptions = (isDarkMode = false) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? '#444' : '#ddd',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => 'Jumlah Ulasan',
          label: (context) => `${context.raw} ulasan`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#aaa' : '#777'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          precision: 0,
          color: isDarkMode ? '#aaa' : '#777'
        }
      }
    }
  };
};

const TestimonialsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { getServiceById } = useDirectoryStore();
  const { isAdmin = false, isAuthenticated = false } = useUserStore();
  const { 
    fetchTestimonials,
    fetchStats,
    fetchTrends,
    isLoading,
    setFilters,
    error
  } = useTestimonialStore();
  
  const [service, setService] = React.useState(null);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  
  // Scroll handler for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Load more trigger for infinite scrolling
  const [loadMoreRef, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  // Get service details if serviceId is provided
  useEffect(() => {
    if (serviceId) {
      const serviceData = getServiceById(serviceId);
      setService(serviceData);
    
      // Set filter by serviceId if provided
      if (serviceData) {
        setFilters({ serviceId });
      }
          } else {
      // Reset serviceId filter if on the main testimonials page
      setFilters({ serviceId: null });
    }
  }, [serviceId, getServiceById, setFilters]);
  
  // Fetch data on initial load
  useEffect(() => {
    fetchTestimonials(true);
    fetchStats();
    fetchTrends();
  }, [fetchTestimonials, fetchStats, fetchTrends]);
  
  // Handle loading more when at bottom of page
  useEffect(() => {
    if (inView) {
      const { pagination } = useTestimonialStore.getState();
      if (pagination.hasMore && !isLoading) {
        useTestimonialStore.getState().loadMore();
      }
    }
  }, [inView, isLoading]);
  
  // Handle retry if error occurs
  const handleRetry = () => {
    fetchTestimonials(true);
    fetchStats();
    fetchTrends();
  };
  
  const title = serviceId ? `Ulasan ${service?.name || 'Layanan'}` : 'Semua Ulasan Layanan UIN Antasari';
  const subtitle = serviceId 
    ? service?.description || 'Ulasan dari pengguna sistem UIN Antasari'
    : 'Lihat apa kata pengguna tentang layanan UIN Antasari Banjarmasin';
  
    return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Toast notifications */}
      <Toaster />
      
      {/* Main content with proper spacing for fixed header */}
      <div className="pt-20 sm:pt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header with title and breadcrumb */}
          <div className="relative z-10 bg-slate-50/95 backdrop-blur-sm py-3 -mt-2 mb-6">
            <TestimonialHeader 
              title={title}
              subtitle={subtitle}
              service={service}
              isAdmin={isAdmin}
        />
      </div>

          {/* Statistics panel - full width on top (Apple style) */}
          <div className="mb-8">
            <TestimonialStats />
      </div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-6">
            {/* Filter and Add button */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="w-full md:w-auto flex-grow">
                  <TestimonialListFilters />
        </div>

                <div className="w-full md:w-auto flex justify-end">
                  <TestimonialDialog 
                    triggerClassName="bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/20"
                  />
                </div>
              </div>
                </div>
                
            {/* Testimonial List */}
                <div>
              <TestimonialList loadMoreRef={loadMoreRef} />
              
              {/* Load more indicator */}
              {isLoading && (
                <div className="flex justify-center my-8">
                  <RefreshCw className="h-6 w-6 text-primary-500 animate-spin" />
              </div>
              )}
              
              {/* Error display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Loading Testimonials</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Coba Lagi
                      </button>
                </div>
            </div>
          </div>
            )}
          </div>
              </div>
              </div>
            </div>
      
      {/* Back to top button */}
            <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
            </AnimatePresence>
    </div>
  );
};

// Component to render a single testimonial card
const TestimonialCard = ({ testimonial, isFeatured, isExpanded, pendingReply, onToggleExpand, onToggleReply, onMarkHelpful, onShareTestimonial, onReplyChange, onReplySubmit, gradient, isAdmin, serviceId, getProfileImage }) => {
  const isAnonymous = testimonial.name.toLowerCase().includes('anonymous');
  const isNegative = testimonial.rating < 3;
  const verified = testimonial.isVerified;
  
  const MAX_CONTENT_LENGTH = 180;
  const shouldTruncate = testimonial.content.length > MAX_CONTENT_LENGTH;
  const displayContent = isExpanded || !shouldTruncate
    ? testimonial.content
    : `${testimonial.content.substring(0, MAX_CONTENT_LENGTH)}...`;
  
  return (
    <Card 
      className={clsx(
        "overflow-hidden transition-all duration-300",
        isFeatured ? "border-2 border-amber-300 dark:border-amber-500" : "",
        isAnonymous || isNegative 
          ? "bg-gray-50 dark:bg-gray-900" 
          : "bg-white dark:bg-gray-800",
      )}
    >
      {/* Featured badge */}
      {isFeatured && (
        <div className="absolute -top-3 -right-3 transform rotate-12">
          <span className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium text-xs rounded-full">
            <Award className="h-5 w-5 text-amber-500" />
          </span>
        </div>
      )}
      
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 border-2" style={{ borderColor: testimonial.isVerified ? '#10b981' : '#e5e7eb' }}>
              <AvatarImage
                src={testimonial.profileImage || getProfileImage(testimonial.gender)}
                alt={testimonial.name}
              />
              <AvatarFallback>
                {isAnonymous ? 'AN' : testimonial.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {testimonial.name}
                </h3>
                {testimonial.isVerified && (
                  <TooltipProvider>
                    <TooltipUI>
                      <TooltipTrigger asChild>
                        <BadgeCheck className="h-4 w-4 ml-1 text-emerald-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pengguna Terverifikasi</p>
                      </TooltipContent>
                    </TooltipUI>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
            </div>
          </div>
          
          {/* Rating stars */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-3">
        {/* Warning for negative or anonymous reviews */}
        {(isAnonymous || isNegative) && (
          <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-amber-800 dark:text-amber-200">
              {isAnonymous && isNegative 
                ? 'Ulasan anonim dengan rating rendah. Mohon pertimbangkan konteks.' 
                : isAnonymous 
                  ? 'Ulasan anonim. Identitas pengguna tidak diverifikasi.'
                  : 'Ulasan dengan rating rendah. Mohon evaluasi konteks sebelum mengambil tindakan.'}
            </span>
          </div>
        )}
        
        {/* Testimonial content */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayContent}
        </p>
        
        {/* Show more/less toggle */}
        {shouldTruncate && (
          <button
            onClick={() => onToggleExpand()}
            className="mt-2 text-sm font-medium"
            style={{ color: testimonial.serviceId ? gradient.accent : '#6366f1' }}
          >
            {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Lebih Banyak'}
          </button>
        )}
        
        {/* Posted time */}
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {testimonial.timestamp}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 border-t border-gray-100 dark:border-gray-700 mt-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Helpful button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkHelpful()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              <span className="text-xs">
                {testimonial.helpfulCount > 0 ? testimonial.helpfulCount : ''} Bantu
              </span>
            </Button>
            
            {/* Reply button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleReply()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Reply className="h-4 w-4 mr-1.5" />
              <span className="text-xs">
                {testimonial.replies.length > 0 ? testimonial.replies.length : ''} Balas
              </span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Share button */}
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShareTestimonial()}
                    className="p-1 h-8 w-8"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bagikan Ulasan</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
            
            {/* Admin: Flag button */}
            {isAdmin && (
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tandai sebagai tidak pantas</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardFooter>
      
      {/* Replies section */}
      {testimonial.replies.length > 0 && (
        <div className="px-5 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {testimonial.replies.length} Balasan
          </p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {testimonial.replies.map(reply => (
              <div key={reply.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={reply.isAdmin ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                    {reply.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-white flex items-center">
                      {reply.author}
                      {reply.isAdmin && (
                        <Badge variant="outline" className="ml-2 text-[10px] h-4 bg-blue-50 text-blue-700 border-blue-200">
                          Admin
                        </Badge>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">{reply.timestamp}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Reply input */}
      {testimonial.showReplyInput && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={isAdmin ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                {isAdmin ? "AD" : "ME"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Tulis balasan..."
                className="mb-2"
                value={pendingReply}
                onChange={(e) => onReplyChange(e)}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onToggleReply()}
                >
                  Batal
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onReplySubmit()}
                  disabled={!pendingReply?.trim()}
                  style={{ 
                    backgroundColor: testimonial.serviceId ? gradient.accent : undefined,
                    opacity: !pendingReply?.trim() ? 0.5 : 1
                  }}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Kirim
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TestimonialsPage; 