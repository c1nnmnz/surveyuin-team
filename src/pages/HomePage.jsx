import React, { useState, useEffect, useRef, lazy, Suspense, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  CheckCircle,
  BarChart,
  Search,
  Star,
  Clock,
  Calendar,
  ArrowUp,
  HelpCircle,
  FileText,
  PenLine,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Sparkles,
  MessageSquare,
  SmilePlus,
  MapPin,
  ChevronRight,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  Heart,
  Building,
  Library,
  Laptop,
  FlaskConical,
  Building2,
  Briefcase,
  LineChart,
  BarChart2,
  BookText,
  Camera,
  Handshake,
  Film,
  Lightbulb,
  Globe,
  Newspaper,
  Bell,
  Banknote,
  CircleDollarSign,
  DollarSign,
  Settings
} from 'lucide-react';
import { useDirectoryStore } from '@/store/directoryStore';
import { useUserStore } from '@/store/userStore';
import { useSurveyStore } from '@/store/surveyStore';
import Button3D from '@/components/Button3D';
import clsx from 'clsx';

// Import the TestimonialSection directly instead of lazy loading for now
// We'll fix lazy loading after we get the page working
import TestimonialSection from '@/components/home/TestimonialSection';

// Import new utility functions and hooks
import useDeviceDetection from '@/hooks/useDeviceDetection';
import useOptimizedScroll from '@/hooks/useOptimizedScroll';
import { calculateAverageRating, getScoreColorClass, getScoreInterpretation } from '@/utils/scoreUtils';
import { formatDate, formatShortDate, formatRelativeDate } from '@/utils/dateUtils';
import StarRating, { SimpleStarRating } from '@/components/ui/StarRating';
import StatCard from '@/components/ui/StatCard';
import { TextSkeleton, CardSkeleton, ListSkeleton } from '@/components/ui/Skeleton';

// Lightweight loading component for suspense fallback
const LoadingFallback = () => (
  <div className="h-20 w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
);

// Optimized CountUp component with better performance
const CountUp = ({ end, duration = 1550 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const endValue = useRef(end);
  const { isLowEnd, isAndroid } = useDeviceDetection();

  useEffect(() => {
    endValue.current = end;
    
    // For low-end devices, just set the final value without animation
    if (isLowEnd || isAndroid) {
      setCount(end);
      return;
    }
    
    startTime.current = Date.now();
    
    // More efficient animation using timestamp-based updates
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * endValue.current);
      
      setCount(currentCount);
      
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };
    
    countRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration, isLowEnd, isAndroid]);
  
  return <>{count}</>;
};

// Optimized placeholder with reduced animation for Android
const ImagePlaceholder = () => {
  const { isAndroid } = useDeviceDetection();
  
  return (
    <div className={`bg-gray-100 ${!isAndroid ? 'animate-pulse' : ''} w-full h-full rounded-lg`}></div>
  );
};

const HomePage = () => {
  const { 
    services, 
    favorites, 
    isServiceFavorite, 
    isServiceCompleted,
    getFilteredServices
  } = useDirectoryStore();
  const { isAuthenticated, user } = useUserStore();
  const { completedServices, allResponses } = useSurveyStore();
  const navigate = useNavigate();
  
  // States
  const [activeTab, setActiveTab] = useState('favorites');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSection, setVisibleSection] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const { isLowEnd, isAndroid: detectedAndroid } = useDeviceDetection();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [renderedServices, setRenderedServices] = useState([]);
  const [shouldOptimizeScroll, setShouldOptimizeScroll] = useState(false);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const scrollToRef = useRef(null);
  
  // Setup optimized scroll handling
  const handleScroll = (scrollY) => {
    setIsScrolled(scrollY > 60);
  };
  
  // Use our custom optimized scroll hook at the top level, not inside useEffect
  const { scrollToElement } = useOptimizedScroll(handleScroll, {
    throttleMs: isLowEnd ? 100 : 50,
    dependencies: [isLowEnd]
  });
  
  // Refs for scroll tracking - use fewer refs for performance
  const sectionRefs = useRef({
    hero: null,
    stats: null,
    services: null,
    testimonials: null
  });
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500,
        mass: 0.8
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        duration: 0.4
      }
    }
  };
  
  // Get services based on active tab
  const getTabServices = () => {
    if (activeTab === 'favorites') {
      return services.filter(service => isServiceFavorite(service.id)).slice(0, 4);
    } else if (activeTab === 'recent') {
      return services.filter(service => isServiceCompleted(service.id)).slice(0, 4);
    } else {
      return services.slice(0, 4);
    }
  };
  
  const displayServices = getTabServices();
  
  // Stats data
  const stats = [
    { 
      title: 'Unit Layanan', 
      value: services.length, 
      subtitle: 'Tersedia untuk disurvei',
      icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />,
      bgGradient: 'from-[#f8fffa] via-[#f0fcf4] to-[#e6f7ee]',
      overlayGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.03))',
      textColor: 'text-emerald-700',
      link: "/directory",
      iconBg: 'bg-gradient-to-br from-white to-emerald-100',
      iconRing: 'ring-emerald-200/30',
      iconBorder: 'border-emerald-200/40',
      interpretation: `${services.length > 20 ? 'Pilih layanan yang Anda terima selama 3 bulan terakhir' : 'Layanan akan selalu di update'}`
    },
    { 
      title: 'Survey Terakhir', 
      value: allResponses.length > 0 ? new Date(Math.max(...allResponses.map(r => new Date(r.completedAt || r.timestamp || Date.now())))).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : '-', 
      subtitle: allResponses.length > 0 ? 'Terakhir mengisi survey' : 'Belum ada survey terisi',
      icon: <Calendar className="w-5 h-5 md:w-6 md:h-6 text-violet-600" />,
      bgGradient: 'from-[#fdfaff] via-[#f9f5ff] to-[#f3ebff]',
      overlayGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.03))',
      textColor: 'text-violet-700',
      iconBg: 'bg-gradient-to-br from-white to-violet-100',
      iconRing: 'ring-violet-200/30',
      iconBorder: 'border-violet-200/40',
      interpretation: `${allResponses.length} survei telah Anda isi`
    },
    { 
      title: 'Layanan Difavoritkan', 
      value: favorites.length, 
      subtitle: 'Ditandai sebagai favorit',
      icon: <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />,
      bgGradient: 'from-[#fffcf5] via-[#fffaf0] to-[#fff8e6]',
      overlayGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.03))',
      textColor: 'text-amber-700',
      iconBg: 'bg-gradient-to-br from-white to-amber-100',
      iconRing: 'ring-amber-200/30',
      iconBorder: 'border-amber-200/40',
      interpretation: favorites.length > 0 ? 'Akses cepat tersedia' : 'Tandai favorit Anda'
    },
    { 
      title: 'Kepuasan Anda', 
      subtitle: `Berdasarkan ${allResponses.length} Survei Layanan`,
      value: allResponses.length > 0 ? calculateAverageRating(allResponses) : 'N/A', 
      starRating: true,
      interpretation: allResponses.length > 0 
        ? getScoreInterpretation(calculateAverageRating(allResponses)) 
        : 'Belum ada penilaian',
      colorClass: getScoreColorClass(
        allResponses.length > 0 ? calculateAverageRating(allResponses) : 'N/A'
      ),
      icon: <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />,
      link: "/history",
      bgGradient: 'from-[#f5faff] via-[#f0f7ff] to-[#e6f0ff]',
      overlayGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.03))',
      textColor: 'text-blue-700',
      iconBg: 'bg-gradient-to-br from-white to-blue-100',
      iconRing: 'ring-blue-200/30',
      iconBorder: 'border-blue-200/40'
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Muhamad Arianoor',
      role: 'Mahasiswa Politeknik Negeri Tanah Laut',
      content: 'Aplikasi yang sangat membantu untuk memberikan feedback ke layanan kampus. Tampilannya mudah digunakan dan responsif.',
      rating: 5,
      isFeatured: true,
      profileImage: null,
      gender: 'male'
    },
    {
      id: 2,
      name: 'Salwa Fitria',
      role: 'Mahasiswa FTK',
      content: 'Sangat membantu aku dalam memberikan penilaian terhadap layanan MIKWA FTK, semoga bisa dikembangkan lagi',
      rating: 4,
      isFeatured: false,
      profileImage: null,
      gender: 'female'
    },
    {
      id: 3,
      name: 'Muhammad Sumbul',
      role: 'Dosen FEBI',
      content: 'Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat merekomendasikan untuk digunakan di semua layanan kampus.',
      rating: 5,
      isFeatured: false,
      profileImage: null,
      gender: 'male'
    },
    {
      id: 4,
      name: 'Aulia Nisa',
      role: 'Staff',
      content: 'Sangat membantu kami untuk mengavaluasi layanan yang telah diterima pengguna',
      rating: 5,
      isFeatured: false,
      profileImage: null,
      gender: 'female'
    }
  ];
  
  // Detect mobile device and iOS/Android on mount
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Detect iOS
      const iOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOS(iOS);
      
      // Detect Android
      const android = /Android/i.test(navigator.userAgent);
      setIsAndroid(android);
      
      // Set scroll optimization for mobile devices
      setShouldOptimizeScroll(mobile || android);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    // Add class to body for platform-specific CSS
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      document.body.classList.add('ios-device');
    }
    
    if (/Android/i.test(navigator.userAgent)) {
      document.body.classList.add('android-device');
      
      // Force hardware acceleration for Android
      document.body.style.transform = 'translateZ(0)';
      document.body.style.backfaceVisibility = 'hidden';
      document.body.style.perspective = '1000px';
    }
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);
  
  // Preload critical assets with priority
  useEffect(() => {
    // Skip intensive preloads on low-end devices
    if (isLowEnd || isAndroid) {
      setImagesLoaded(true);
      return;
    }
    
    // Load critical assets
    const heroImage = new Image();
    heroImage.fetchPriority = "high";
    heroImage.loading = "eager";
    heroImage.src = '/3D_illustration.png';
    heroImage.onload = () => setImagesLoaded(true);
    heroImage.onerror = () => {
      console.error("Error loading hero image");
      setImagesLoaded(true);
    };

    // Set a timeout to ensure imagesLoaded gets set to true even if loading fails
    const timeout = setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isLowEnd, isAndroid]);
  
  // Generate gradient colors for service cards
  const getServiceGradient = (serviceName) => {
    // Simple hash function for string
    const hash = serviceName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate distinct hue based on name
    const huePresets = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345];
    const hue = huePresets[Math.abs(hash) % huePresets.length];
    const hueOffset = ((hash % 10) - 5);
    const finalHue = (hue + hueOffset) % 360;
    
    // Generate brighter, softer pastel gradients for thumbnails
    return {
      from: `hsl(${finalHue}, 85%, 75%)`,
      to: `hsl(${finalHue}, 45%, 55%)`
    };
  };
  
  // Generate service icon
  const getServiceIcon = (serviceName, category) => {
    const name = serviceName.toLowerCase();
    const cat = (category || '').toLowerCase();
    
    // Define color style
    const iconClass = "w-8 h-8 text-white";
    
    // Check for specific service names first
    if (name.includes('keuangan')) return <Banknote className={iconClass} />;
    if (name.includes('kehumasan')) return <Globe className={iconClass} />;
    if (name.includes('kerjasama')) return <Handshake className={iconClass} />;
    if (name.includes('lp2m')) return <FlaskConical className={iconClass} />;
    if (name.includes('lpm')) return <Award className={iconClass} />;
    if (name.includes('perpustakaan') || name.includes('library')) return <BookOpen className={iconClass} />;
    if (name.includes('umum')) return <Building className={iconClass} />;
    if (name.includes('mahad') || name.includes('al jamiah')) return <Building className={iconClass} />;
    if (name.includes('upkk')) return <TrendingUp className={iconClass} />;
    
    // Then check categories
    if (cat.includes('keuangan')) return <Banknote className={iconClass} />;
    if (cat.includes('humas') || cat.includes('publikasi')) return <Globe className={iconClass} />;
    if (cat.includes('kerjasama')) return <Handshake className={iconClass} />;
    if (cat.includes('penelitian')) return <FlaskConical className={iconClass} />;
    if (cat.includes('pengembangan') && cat.includes('akademik')) return <Award className={iconClass} />;
    if (cat.includes('perpustakaan') || cat.includes('library')) return <BookOpen className={iconClass} />;
    if (cat.includes('akademik')) return <GraduationCap className={iconClass} />;
    if (cat.includes('administrasi')) return <ClipboardList className={iconClass} />;
    if (cat.includes('kesehatan')) return <SmilePlus className={iconClass} />;
    if (cat.includes('teknologi')) return <Laptop className={iconClass} />;
    if (cat.includes('humas')) return <Users className={iconClass} />;
    
    // Default icon based on first letter
    return <div className="text-white font-display font-bold text-2xl">{serviceName.charAt(0)}</div>;
  };
  
  // Generate category-specific colors for better visual distinction
  const getCategoryColor = (category) => {
    const categoryLower = (category || '').toLowerCase();
    
    if (categoryLower.includes('akademik')) return { bg: 'bg-blue-50', text: 'text-blue-700' };
    if (categoryLower.includes('kesehatan')) return { bg: 'bg-green-50', text: 'text-green-700' };
    if (categoryLower.includes('keuangan')) return { bg: 'bg-amber-50', text: 'text-amber-700' };
    if (categoryLower.includes('perpustakaan')) return { bg: 'bg-purple-50', text: 'text-purple-700' };
    if (categoryLower.includes('kerjasama')) return { bg: 'bg-cyan-50', text: 'text-cyan-700' };
    if (categoryLower.includes('kemahasiswaan')) return { bg: 'bg-pink-50', text: 'text-pink-700' };
    if (categoryLower.includes('penelitian')) return { bg: 'bg-indigo-50', text: 'text-indigo-700' };
    if (categoryLower.includes('teknologi')) return { bg: 'bg-orange-50', text: 'text-orange-700' };
    if (categoryLower.includes('kepegawaian')) return { bg: 'bg-teal-50', text: 'text-teal-700' };
    
    // Default colors if no match
    return { bg: 'bg-gray-50', text: 'text-gray-700' };
  };

  // Generate faculty-specific colors
  const getFacultyColor = (faculty) => {
    const facultyLower = (faculty || '').toLowerCase();
    
    if (facultyLower.includes('tarbiyah')) return { bg: 'bg-rose-50', text: 'text-rose-700' };
    if (facultyLower.includes('syariah')) return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
    if (facultyLower.includes('dakwah')) return { bg: 'bg-violet-50', text: 'text-violet-700' };
    if (facultyLower.includes('ushuluddin')) return { bg: 'bg-yellow-50', text: 'text-yellow-700' };
    if (facultyLower.includes('ekonomi')) return { bg: 'bg-sky-50', text: 'text-sky-700' };
    if (facultyLower.includes('teknologi')) return { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' };
    if (facultyLower.includes('rektorat')) return { bg: 'bg-red-50', text: 'text-red-700' };
    if (facultyLower.includes('administrasi')) return { bg: 'bg-indigo-50', text: 'text-indigo-700' };
    
    // Default color for other faculties
    return { bg: 'bg-slate-50', text: 'text-slate-700' };
  };
  
  // Handle favorite click
  const handleFavoriteClick = (e, serviceId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle the favorite status in the store
    if (isServiceFavorite(serviceId)) {
      useDirectoryStore.getState().removeFromFavorites(serviceId);
    } else {
      useDirectoryStore.getState().addToFavorites(serviceId);
    }
  };
  
  // Check if service survey is completed
  const isServiceSurveyCompleted = (serviceId) => {
    // Check both as string and as number to handle type mismatches
    const serviceIdNum = parseInt(serviceId, 10);
    const serviceIdStr = serviceId.toString();
    
    return completedServices.some(id => {
      const completedIdNum = parseInt(id, 10);
      const completedIdStr = id.toString();
      
      return (
        completedIdStr === serviceIdStr || 
        (
          !isNaN(serviceIdNum) && 
          !isNaN(completedIdNum) && 
          completedIdNum === serviceIdNum
        )
      );
    });
  };
  
  // Update the renderStarRating function to remove the duplicate score display
  const renderStarRating = (score) => {
    if (score === "N/A" || !score) {
      return <div className="text-gray-400 text-sm">Belum ada penilaian</div>;
    }
    
    // Parse score as number and ensure it's valid
    const numericScore = typeof score === 'number' ? 
      score : 
      (parseFloat(score) || 0);
    
    // Round to nearest 0.1 for display
    const displayScore = Math.round(numericScore * 10) / 10;
    
    // Use the optimized simple star rating for Android or low-end devices
    if (isAndroid || isLowEnd) {
      return <SimpleStarRating score={displayScore} showScore={false} size="md" />;
    }
    
    // Use the full-featured star rating for other devices
    return <StarRating score={displayScore} showScore={false} size="md" />;
  };
  
  // Optimized stats section for Android
  const renderStatsSection = () => (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
      style={isAndroid ? { 
        willChange: 'transform', 
        transform: 'translateZ(0)',
      } : {}}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          bgGradient={stat.bgGradient}
          overlayGradient={stat.overlayGradient}
          textColor={stat.textColor}
          iconBg={stat.iconBg}
          iconRing={stat.iconRing}
          link={stat.link}
          colorClass={stat.colorClass}
          starRating={stat.starRating}
          ratingComponent={stat.starRating ? renderStarRating(stat.value) : null}
          interpretation={stat.interpretation}
          onClick={() => stat.link && navigate(stat.link)}
        />
      ))}
    </div>
  );
  
  // Add virtual list rendering for service lists
  const VirtualizedList = ({ items, renderItem, itemHeight = 100, windowSize = 10 }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);
    const { shouldOptimizeScroll } = useDeviceDetection();
    
    // Optimized scroll handler
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };
    
    // Set up optimized scroll tracking
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      
      // Use passive listener for better performance
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }, []);
    
    // Virtual rendering calculations
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - windowSize);
    const endIndex = Math.min(items.length - 1, Math.floor((scrollTop + containerRef.current?.clientHeight || 0) / itemHeight) + windowSize);
    
    // Render only visible items plus buffer
    const visibleItems = shouldOptimizeScroll
      ? items.slice(startIndex, endIndex + 1)
      : items;
    
    // Get spacer size
    const topSpacerHeight = shouldOptimizeScroll ? startIndex * itemHeight : 0;
    const bottomSpacerHeight = shouldOptimizeScroll ? (items.length - endIndex - 1) * itemHeight : 0;
    
    return (
      <div 
        ref={containerRef} 
        className="overflow-auto rounded-lg"
        style={{ height: '100%', position: 'relative' }}
      >
        {/* Top spacer */}
        {shouldOptimizeScroll && topSpacerHeight > 0 && (
          <div style={{ height: `${topSpacerHeight}px` }} />
        )}
        
        {/* Visible items */}
        {visibleItems.map((item, index) => (
          <div key={`${item.id || index}`} style={{ height: `${itemHeight}px` }}>
            {renderItem(item, startIndex + index)}
          </div>
        ))}
        
        {/* Bottom spacer */}
        {shouldOptimizeScroll && bottomSpacerHeight > 0 && (
          <div style={{ height: `${bottomSpacerHeight}px` }} />
        )}
        
        {/* Show all items rendered indicator during dev */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-0 right-0 bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-tl-lg">
            Rendering {visibleItems.length} of {items.length} items
          </div>
        )}
      </div>
    );
  };
  
  // Replace the Dynamic Island useEffect with a simplified version
  useEffect(() => {
    // Set up iOS specific CSS if needed
    if (isIOS) {
      // Add meta viewport tag with viewport-fit=cover if not present
      const existingViewport = document.querySelector('meta[name="viewport"]');
      if (existingViewport && !existingViewport.content.includes('viewport-fit=cover')) {
        existingViewport.content = `${existingViewport.content}, viewport-fit=cover`;
      }
      
      // Add basic iOS classes
      const style = document.createElement('style');
      style.textContent = `
        .ios-safe-area {
          padding-top: env(safe-area-inset-top, 0);
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isIOS]);

  // Add this function before the return statement
  const getFacultyAbbreviation = (facultyName) => {
    // Map full faculty names to their abbreviations
    const facultyMap = {
      'Fakultas Ekonomi dan Bisnis Islam': 'FEBI',
      'Fakultas Dakwah dan Ilmu Komunikasi': 'FDIK',
      'Fakultas Syariah': 'FS',
      'Fakultas Tarbiyah dan Keguruan': 'FTK',
      'Fakultas Ushuluddin dan Humaniora': 'FUH',
      'Pascasarjana': 'Pasca',
      'Unit Pelaksana Teknis': 'UPT',
      'Universitas': 'Kampus',
      'Rektorat': 'Rektorat',
      'Kantor Pusat': 'Pusat'
    };
    
    return facultyMap[facultyName] || facultyName;
  };

  return (
    <div 
      className={`min-h-screen flex flex-col bg-gradient-to-br from-white to-white pb-16 overflow-hidden smooth-scroll-container ${isIOS ? 'ios-safe-area' : ''} ${isAndroid ? 'android-optimized' : ''}`}
      style={isAndroid ? { 
        contain: 'content',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 1000px',
        overscrollBehavior: 'contain'
      } : {}}
    >
      {/* Hero Section - with proper mobile padding */}
      <section 
        ref={el => sectionRefs.current.hero = el} 
        className="relative pt-20 pb-12 md:pb-16 overflow-hidden scroll-snap-item"
        style={isAndroid ? { contain: 'paint layout', containIntrinsicSize: '0 600px' } : {}}
      >
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-optimized layout with reversed order for small screens */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mt-2">
            {/* Image area - now first on mobile for better visibility */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isAndroid ? 0.1 : 0.3, delay: isAndroid ? 0 : 0.1 }}
              className="relative mt-0 order-first md:order-last"
              style={isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {}}
            >
              <div className="relative flex items-center justify-center pt-0 md:pt-20 pb-4 md:pb-10">
                {imagesLoaded ? (
                  <img 
                    src="/3D_illustration.png" 
                    alt="UIN Antasari Survey Platform" 
                    loading={isAndroid ? "eager" : "lazy"}
                    width="550"
                    height="440"
                    className="relative z-30 w-[85%] md:w-[95%] h-auto object-contain mx-auto"
                    style={isAndroid ? { transform: 'translateZ(0)' } : {}}
                  />
                ) : (
                  <div className="relative z-30 w-[85%] md:w-[95%] h-[300px] md:h-[440px] mx-auto bg-gray-50 rounded-xl animate-pulse"></div>
                )}
              </div>
            </motion.div>
            
            {/* Text content area - now second on mobile for better thumb access */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: isLowEnd || isAndroid ? 0.1 : 0.5, delay: isAndroid ? 0 : 0.05 }}
              className="flex flex-col items-start pt-0 order-last md:order-first"
              style={isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {}}
            >
        
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-secondary-900 leading-tight">
                Survey Layanan
                <br />
                <span className="text-green-600 whitespace-nowrap">UIN Antasari Banjarmasin</span>
              </h1>
              
              <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-primary-800 max-w-lg">
              Mari bersama-sama untuk membuat layanan kampus menjadi lebih baik dengan berbagi pendapat kalian secara jujur, karena setiap masukan kalian sangat berarti untuk kami.
              </p>
              
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 w-full">
                <Link 
                  to="/directory" 
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button3D 
                    variant="primary" 
                    size="lg" 
                    className={`w-full px-8 py-4 rounded-full shadow-lg hover:shadow-primary-600/30 hover:shadow-xl transition-all duration-300 border-2 border-primary-700/10 ${isIOS ? 'ios-touch-button' : ''}`}
                  >
                    <span className="text-base">Lihat Direktori</span>
                    <ArrowRight className="ml-2 h-5 w-5 animate-pulse-fast" />
                  </Button3D>
                </Link>
                
                <Link 
                  to="/about" 
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button3D 
                    variant="light" 
                    size="lg" 
                    className={`w-full px-8 py-4 rounded-full border border-gray-200 ${isIOS ? 'ios-touch-button' : ''}`}
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowUp className="ml-2 h-5 w-5" />
                  </Button3D>
                </Link>
              </div>
              
              <div className="mt-8 md:mt-12 flex items-center">
                <div className="flex -space-x-3">
                  {[
                    { color: '#f87171', image: '/profile_picture_male.png' },
                    { color: '#60a5fa', image: '/profile_picture_female.png' },
                    { color: '#34d399', image: '/profile_picture_male.png' }
                  ].map((avatar, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm overflow-hidden relative"
                    >
                      <div className="absolute inset-0" style={{ backgroundColor: avatar.color }}></div>
                      <img 
                        src={avatar.image} 
                        alt="User Avatar" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/profile_picture_male.png'; // Fallback image
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-xs md:text-sm font-medium text-secondary-900">Bergabung dengan 300+ pengguna</p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="ml-2 text-xs text-secondary-600">dari 250+ ulasan</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24"></div>
      </section>
      
      {/* Stats Section - with optimized animations */}
      <section 
        ref={el => sectionRefs.current.stats = el} 
        className="py-8 md:py-10 relative will-change-transform scroll-snap-item"
        style={isAndroid ? { 
          contain: 'paint layout', 
          containIntrinsicSize: '0 400px',
          contentVisibility: isLowEnd ? 'auto' : 'visible' 
        } : {}}
      >
        <div className="absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 sm:text-4xl">
              Platform Survei Layanan UIN Antasari Banjarmasin
            </h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-secondary-600 max-w-3xl mx-auto">
              Membantu civitas akademika dan masyarakat umum untuk memberikan pendapat dan evaluasi terhadap seluruh layanan di UIN Antasari Banjarmasin
            </p>
          </motion.div>
          
          {/* Optimized stats rendering */}
          {renderStatsSection()}
          
          <motion.div 
            className="grid md:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-10"
            style={isAndroid ? { willChange: 'auto', containIntrinsicSize: '0 500px' } : {}}
          >
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 shadow-sm ring-1 ring-blue-200/30 ring-inset"
              >
                <PenLine className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Survei Terstruktur</h3>
              <p className="text-secondary-700">
                Kuesioner dirancang berdasarkan standar pelayanan publik dengan kategori penilaian yang terukur
              </p>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 shadow-sm ring-1 ring-green-200/30 ring-inset"
              >
                <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Analisis Real-time</h3>
              <p className="text-secondary-700">
                Dapatkan analisis lengkap hasil survei secara real-time dengan visualisasi data yang mudah dipahami
              </p>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 shadow-sm ring-1 ring-amber-200/30 ring-inset"
              >
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Peningkatan Berkelanjutan</h3>
              <p className="text-secondary-700">
                Evaluasi berkala untuk memastikan peningkatan kualitas layanan yang berkelanjutan
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Favorite Services Section - optimized rendering */}
      <section 
        ref={el => sectionRefs.current.services = el}
        className="py-10 relative scroll-snap-item"
        style={isAndroid ? { 
          contain: 'paint layout',
          containIntrinsicSize: '0 600px',
          contentVisibility: isLowEnd ? 'auto' : 'visible'
        } : {}}
      >
        <div className="absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-900 sm:text-4xl">
                Layanan Favorit Anda
              </h2>
              <p className="mt-3 text-lg text-secondary-600 max-w-3xl">
                Akses cepat ke layanan yang Anda tandai sebagai favorit
              </p>
            </div>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length > 0 ? (
              services.filter(service => isServiceFavorite(service.id)).slice(0, 6).map((service, index) => {
                // Create a simple gradient function that doesn't rely on external functions
                const createGradient = (name) => {
                  const str = name || '';
                  const hash = str.split('').reduce((acc, char) => {
                    return char.charCodeAt(0) + ((acc << 5) - acc);
                  }, 0);
                  
                  // Generate distinct hue based on name
                  const huePresets = [
                    15,    // Orange-red
                    45,    // Yellow-orange
                    75,    // Yellow-green
                    105,   // Green
                    135,   // Teal
                    165,   // Cyan
                    195,   // Light blue
                    225,   // Blue
                    255,   // Purple-blue
                    285,   // Purple
                    315,   // Pink
                    345    // Red-pink
                  ];
                  
                  // Select hue from presets based on hash
                  const hue = huePresets[Math.abs(hash) % huePresets.length];
                  
                  // Add a small random offset to create more variation
                  const hueOffset = ((hash % 10) - 5);
                  const finalHue = (hue + hueOffset) % 360;
                  
                  return {
                    hue: finalHue
                  };
                };
                
                const gradient = createGradient(service.name);
                
                return (
                  <div 
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all duration-200 relative border border-gray-100 hover:border-gray-200"
                  >
                    {/* Favorite star button - positioned absolutely in top-right */}
                    <div 
                      onClick={(e) => handleFavoriteClick(e, service.id)}
                      className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 border border-amber-200 p-1 cursor-pointer shadow-sm hover:bg-amber-100 transition-colors duration-150"
                    >
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    
                    <Link 
                      to={`/service/${service.id}`}
                      className="block outline-none focus:outline-none h-full p-5"
                      tabIndex={0}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Service icon with circular design */}
                          <div 
                          className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center relative"
                            style={{
                            background: `linear-gradient(135deg, hsl(${gradient.hue}, 95%, 55%), hsl(${gradient.hue}, 85%, 40%))`,
                            boxShadow: `0 3px 10px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 15px rgba(${Math.round(Math.sin(gradient.hue * 0.0174533) * 127 + 128)}, ${Math.round(Math.sin((gradient.hue + 120) * 0.0174533) * 127 + 128)}, ${Math.round(Math.sin((gradient.hue + 240) * 0.0174533) * 127 + 128)}, 0.15)`
                          }}
                        >
                          <div className="absolute inset-0 rounded-full" style={{
                            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 50%)',
                            mixBlendMode: 'overlay'
                          }}></div>
                          <div className="relative z-10">
                              {getServiceIcon(service.name, service.category)}
                            </div>
                          </div>
                          
                        {/* Service name - cleaner with more space */}
                        <div className="pt-1">
                          <h3 className="font-medium text-base text-secondary-800 pr-7">
                                {service.name}
                              </h3>
                              </div>
                            </div>
                            
                      {/* Tags section - clean Shadcn UI style with more vertical spacing */}
                      <div className="flex items-center gap-2 mt-5">
                        <span className="inline-flex text-xs font-medium bg-red-50 text-red-700 py-1.5 px-3 rounded-full border border-red-100 items-center shadow-sm">
                          <MapPin size="small" className="mr-1 text-red-600 flex-shrink-0 w-3.5 h-3.5" />
                          <span>{getFacultyAbbreviation(service.faculty)}</span>
                                </span>
                        <span className="inline-flex text-xs font-medium bg-green-50 text-green-700 py-1.5 px-3 rounded-full border border-green-100 items-center shadow-sm">
                          <Settings size="small" className="mr-1 text-green-600 flex-shrink-0 w-3.5 h-3.5" />
                          <span>{service.category}</span>
                              </span>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-5 shadow-sm border border-amber-200">
                  <Star className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Belum ada layanan favorit</h3>
                <p className="text-secondary-600 max-w-md text-center mb-6">
                  Jelajahi direktori layanan dan tandai beberapa sebagai favorit untuk akses cepat
                </p>
                <Link to="/directory">
                  <Button3D 
                    variant="primary" 
                    size="md" 
                    className="px-6 py-2.5 rounded-full focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:outline-none"
                  >
                    <span>Jelajahi Direktori</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button3D>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials - optimized */}
      <TestimonialSection 
        testimonialsRef={el => sectionRefs.current.testimonials = el}
        testimonials={testimonials}
        isMobile={isMobile}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isLowEnd={isLowEnd}
        optimizedCardVariants={cardVariants}
        optimizedIconVariants={iconVariants}
      />
    </div>
  );
};

export default HomePage; 