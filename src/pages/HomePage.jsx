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
import { useDirectoryStore } from '../store/directoryStore';
import { useUserStore } from '../store/userStore';
import { useSurveyStore } from '../store/surveyStore';
import Button3D from '../components/Button3D';
import clsx from 'clsx';

// Import the TestimonialSection directly instead of lazy loading for now
// We'll fix lazy loading after we get the page working
import TestimonialSection from '../components/home/TestimonialSection';

// Lightweight loading component for suspense fallback
const LoadingFallback = () => (
  <div className="h-20 w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
);

// First, enhance the device detection for newer iPhone models with Dynamic Island
const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  useEffect(() => {
    // Enhanced heuristic for low-end devices with Android optimization
    const checkDeviceCapabilities = () => {
      // Detect Android specifically
      const isAndroidDevice = /Android/i.test(navigator.userAgent);
      setIsAndroid(isAndroidDevice);
      
      // Detect iOS devices
      const isIOSDeviceCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOSDevice(isIOSDeviceCheck);
      
      // Enhanced Android detection - some Android devices need optimization even if they're not technically "low-end"
      if (isAndroidDevice) {
        // Check for Android version as some older Android versions have rendering issues
        const androidVersionMatch = navigator.userAgent.match(/Android\s([0-9.]+)/);
        const androidVersion = androidVersionMatch ? parseFloat(androidVersionMatch[1]) : 0;
        
        // Android devices with older OS or slower processors should be treated as low-end
        if (androidVersion < 10) {
          setIsLowEnd(true);
          return true;
        }
      }
      
      // Safely check for navigator properties that might not exist in all browsers
      const memoryLimit = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      
      // More comprehensive connection check
      const connectionType = navigator.connection ? 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' || 
         navigator.connection.effectiveType === '3g' ||
         navigator.connection.downlink < 1.5) : false;
        
      const screenSize = window.screen.width * window.screen.height;
      const isSmallScreen = screenSize < 1000000; // ~HD resolution threshold
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Detect if device is reporting low battery - some devices throttle performance
      const isBatteryLow = 'getBattery' in navigator ? 
        navigator.getBattery().then(battery => battery.level < 0.15) : false;
      
      // For iOS devices, assume better performance but still considerate
      // If it's iOS but with slow connection, still consider it low-end
      if (isIOSDeviceCheck && connectionType) return true;
      // Most modern iOS devices handle animations well
      if (isIOSDeviceCheck) return false;
      
      // Consider Android devices that have any performance limitations as needing optimization
      const isLowEndDevice = isAndroidDevice ? 
        (memoryLimit || connectionType || isSmallScreen || isBatteryLow) :
        ((memoryLimit || connectionType) && isMobile);
        
      setIsLowEnd(isLowEndDevice);
      return isLowEndDevice;
    };
    
    try {
      checkDeviceCapabilities();
    } catch (error) {
      // If there's any error in detection, default to false
      setIsLowEnd(false);
      setIsAndroid(false);
      setIsIOSDevice(false);
      console.error("Error detecting device capabilities:", error);
    }
  }, []);
  
  return { isLowEnd, isAndroid, isIOS: isIOSDevice };
};

// Optimized CountUp component with better performance
const CountUp = ({ end, duration = 1550 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const endValue = useRef(end);
  const { isLowEnd, isAndroid } = useLowEndDevice();

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

// Memoized StarRating component
const StarRating = memo(({ score }) => {
  if (score === "N/A") return null;
  
  const numericScore = parseFloat(score);
  const fullStars = Math.floor(numericScore);
  const hasHalfStar = numericScore - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex justify-center mt-1 mb-1">
      {fullStars > 0 && 
        <>
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="w-4 h-4 text-amber-500 fill-amber-500" />
          ))}
        </>
      }
      {hasHalfStar && (
        <span className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
        </span>
      )}
      {emptyStars > 0 && 
        <>
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
          ))}
        </>
      }
    </div>
  );
});

// Optimized placeholder with reduced animation for Android
const ImagePlaceholder = () => {
  const { isAndroid } = useLowEndDevice();
  
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
  const { isLowEnd, isAndroid: detectedAndroid } = useLowEndDevice();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [renderedServices, setRenderedServices] = useState([]);
  const [shouldOptimizeScroll, setShouldOptimizeScroll] = useState(false);
  
  // Last scroll position for scroll optimization
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  
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
  
  // Calculate average rating from completed surveys
  const calculateAverageRating = () => {
    if (allResponses.length === 0) return "N/A";
    
    // Calculate overall score for each response using similar logic to SurveyDetailPage
    const responseScores = allResponses.map(response => {
      if (!response.answers || !Array.isArray(response.answers) || response.answers.length === 0) return 0;
      
      // Calculate total score based on answers (assuming 1-6 scale like in SurveyDetailPage)
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      response.answers.forEach(answer => {
        // Only count numeric answers
        const answerValue = parseInt(answer.answer);
        if (!isNaN(answerValue)) {
          totalScore += answerValue;
          // Assuming max score is 6 for each question (from SurveyDetailPage logic)
          maxPossibleScore += 6;
        }
      });
      
      // Convert to percentage (0-100) similar to SurveyDetailPage
      const score = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
      return Math.round(score * 10) / 10; // Round to 1 decimal place
    });
    
    // Filter out any zero scores
    const validScores = responseScores.filter(score => score > 0);
    
    if (validScores.length === 0) return "N/A";
    
    // Calculate the average score
    const averageScore = validScores.reduce((total, score) => total + score, 0) / validScores.length;
    
    // Convert to 5-star scale (since our star rating shows 5 stars)
    // 100% = 5 stars, so divide by 20
    const starRating = (averageScore / 20).toFixed(1);
    
    return starRating;
  };

  // Get color class based on score - similar to SurveyDetailPage
  const getScoreColorClass = (score) => {
    if (score === "N/A") return "text-gray-500";
    
    const numericScore = parseFloat(score);
    if (numericScore >= 4.0) return 'text-green-600';
    if (numericScore >= 3.0) return 'text-blue-600';
    if (numericScore >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get interpretation text based on score - similar to SurveyDetailPage
  const getScoreInterpretation = (score) => {
    if (score === "N/A") return "Belum ada penilaian";
    
    const numericScore = parseFloat(score);
    if (numericScore >= 4.0) return 'Sangat Baik';
    if (numericScore >= 3.0) return 'Baik';
    if (numericScore >= 2.0) return 'Cukup';
    return 'Perlu Ditingkatkan';
  };

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
      value: allResponses.length > 0 ? new Date(Math.max(...allResponses.map(r => new Date(r.timestamp || Date.now())))).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : '-', 
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
      value: calculateAverageRating(), 
      starRating: true,
      interpretation: getScoreInterpretation(calculateAverageRating()),
      colorClass: getScoreColorClass(calculateAverageRating()),
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
      name: 'Ari Ganteng',
      role: 'Mahasiswa Politeknik Negeri Tanah Laut',
      content: 'Aplikasi yang sangat membantu untuk memberikan feedback ke layanan kampus. Tampilannya mudah digunakan dan responsif.',
      rating: 5,
      isFeatured: true,
      timestamp: '3 hari yang lalu',
      profileImage: null,
      gender: 'male'
    },
    {
      id: 2,
      name: 'Anonymous',
      role: 'Anonymous',
      content: 'Kok Ngeleg di HP Aku yah 😑',
      rating: 1,
      isFeatured: false,
      timestamp: 'Baru Saja',
      profileImage: null,
      gender: 'female'
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      role: 'Dosen Fakultas Ekonomi',
      content: 'Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat merekomendasikan untuk digunakan di semua layanan kampus.',
      rating: 5,
      isFeatured: false,
      timestamp: '2 minggu yang lalu',
      profileImage: null,
      gender: 'male'
    },
    {
      id: 4,
      name: 'Anonymous',
      role: 'Mahasiswa Politeknik Negeri Tanah Laut',
      content: 'Semangat ketua!',
      rating: 5,
      isFeatured: false,
      timestamp: 'Baru Saja',
      profileImage: null,
      gender: 'male'
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
  
  // Handle scroll effects with performance optimization
  useEffect(() => {
    // Skip complex scroll handling on low-end devices
    if (isLowEnd) {
      setVisibleSection('all');
      return;
    }
    
    const handleScroll = () => {
      // Use optimized scroll handling for mobile/Android
      if (shouldOptimizeScroll) {
        lastScrollY.current = window.scrollY;
        
        if (!ticking.current) {
          // Use requestAnimationFrame to limit scroll event processing
          requestAnimationFrame(() => {
            // Simple states that don't trigger expensive re-renders
            setIsScrolled(lastScrollY.current > 60);
            ticking.current = false;
          });
          
          ticking.current = true;
        }
        return;
      }
      
      // Regular scroll handling for desktop
      setIsScrolled(window.scrollY > 60);
      
      // Track section visibility
      const viewportHeight = window.innerHeight;
      
      // Use refs object for more efficient access
      const sections = Object.entries(sectionRefs.current).filter(([_, ref]) => ref);
      
      for (const [key, ref] of sections) {
        const rect = ref?.getBoundingClientRect();
        if (rect && rect.top < viewportHeight * 0.7) {
          setVisibleSection(key);
        }
      }
    };
    
    const optimizedScroll = isAndroid || isLowEnd 
      ? throttle(handleScroll, 100) // Use throttle for Android
      : handleScroll;
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [isLowEnd, isAndroid, shouldOptimizeScroll]);
  
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
  
  // Throttle function for scroll optimization
  function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback.apply(this, args);
      }
    };
  }
  
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
  
  // Use more efficient rendering for starred cards on Android
  const renderStarRating = (score) => {
    if (score === "N/A") return null;
    
    if (isAndroid) {
      // Simplified star rendering for Android
  return (
        <div className="flex justify-center mt-1 mb-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(parseFloat(score)) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Use the memoized version for normal devices
    return <StarRating score={score} />;
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
        <div
          key={stat.title} 
          className={`rounded-2xl bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm p-4 md:p-6 text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group flex flex-col min-h-[180px] md:min-h-[200px] justify-between ${stat.link ? 'hover:-translate-y-1 active:translate-y-0 active:shadow-md' : ''}`}
          style={{
            ...isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {},
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025), 0 0 0 1px rgba(255, 255, 255, 0.9) inset',
            background: stat.overlayGradient,
            borderColor: 'rgba(255, 255, 255, 0.9)'
          }}
          onClick={() => stat.link && navigate(stat.link)}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
          
          <div className="flex flex-col items-center flex-grow relative z-10">
            <div 
              className={`w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full flex items-center justify-center mb-3 md:mb-4 ${stat.iconBg} shadow-sm ring-1 ${stat.iconRing} ring-inset relative z-10 group-hover:scale-105 transition-transform duration-200`}
              style={{ boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 3px 6px -1px rgba(0, 0, 0, 0.06)' }}
            >
              {stat.icon}
            </div>
            <h3 className={`text-2xl md:text-3xl font-bold mb-1 font-display tracking-tight ${stat.colorClass || stat.textColor}`}>
              {stat.value}
            </h3>
            {stat.starRating && renderStarRating(stat.value)}
            <p className="text-sm md:text-base font-medium opacity-90">{stat.title}</p>
            {stat.subtitle && (
              <p className="text-xs opacity-70 mt-1">{stat.subtitle}</p>
            )}
          </div>
          
          <div className="mt-auto relative z-10">
            {stat.interpretation && (
              <p className={`text-xs md:text-sm font-medium mt-1 ${stat.colorClass || 'opacity-80'}`}>{stat.interpretation}</p>
            )}
            {stat.link && (
              <div className="mt-2 text-xs flex items-center justify-center opacity-80 group-hover:opacity-100">
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
  // Within the HomePage component, add a useEffect for scroll optimization
  useEffect(() => {
    // Apply CSS scroll behavior for smoother scrolling on low-end devices
    if (isLowEnd || isAndroid) {
      // Add CSS for smoother scrolling
      const style = document.createElement('style');
      style.textContent = `
        .smooth-scroll-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-snap-type: y proximity;
        }
        
        .scroll-snap-item {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        .android-optimized {
          backface-visibility: hidden;
          perspective: 1000;
          transform: translate3d(0,0,0);
          will-change: transform;
        }
        
        @supports (scroll-behavior: smooth) {
          html {
            scroll-behavior: ${isLowEnd ? 'auto' : 'smooth'};
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Limit framerate on very low-end devices
      if (isLowEnd) {
        // Use requestAnimationFrame throttling for ultra-smooth scrolling
        let lastKnownScrollPosition = 0;
        let ticking = false;
        let scrollTimeout;
        
        const handleScroll = () => {
          lastKnownScrollPosition = window.scrollY;
          
          if (!ticking) {
            // Use timeout to ensure we're not overloading the device
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              window.requestAnimationFrame(() => {
                // Do minimal work here - just what's absolutely necessary
                setIsScrolled(lastKnownScrollPosition > 60);
                ticking = false;
              });
            }, 50); // Lower interval for smoother feeling
            
            ticking = true;
          }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
          window.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
          document.head.removeChild(style);
        };
      }
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isLowEnd, isAndroid]);

  // Add virtual list rendering for service lists
  const VirtualizedList = ({ items, renderItem, itemHeight = 100, windowSize = 10 }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);
    
    useEffect(() => {
      const handleScroll = () => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
      };
      
      const current = containerRef.current;
      if (current) {
        current.addEventListener('scroll', handleScroll, { passive: true });
      }
      
      return () => {
        if (current) {
          current.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);
    
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - windowSize);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + (containerRef.current?.clientHeight || 0)) / itemHeight) + windowSize
    );
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    
    return (
      <div 
        ref={containerRef}
        className="overflow-auto h-[500px] will-change-scroll"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item, index) => (
            <div 
              key={startIndex + index}
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
          </div>
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