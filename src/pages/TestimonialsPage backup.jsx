import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Star, ChevronLeft, ThumbsUp, MessageSquare, Search, Filter, Award, 
  Sparkles, Home, ChevronRight, Clock, Calendar, Share, AlertTriangle, 
  ArrowUp, Heart, Reply, Flag, Bookmark, Send, X, BarChart3, ChevronDown,
  RefreshCw, Download, Sliders, SlidersHorizontal, Check, CircleUser, 
  BadgeCheck, ArrowUpRight, Plus 
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

// Import UI components
import Button3D from '../components/Button3D';
import Breadcrumb from '../components/ui/Breadcrumb';
import Skeleton from '../components/ui/skeleton';
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
  
  // Refs for animations and intersections
  const ratingRef = useRef(null);
  const [topButtonRef, topButtonInView] = useInView();
  const [loadMoreRef, loadMoreInView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showTrends, setShowTrends] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pendingReplies, setPendingReplies] = useState({});
  const [expandedTestimonials, setExpandedTestimonials] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get service details if serviceId is provided
  const service = useMemo(() => {
    if (!serviceId) return null;
    return getServiceById(serviceId);
  }, [serviceId, getServiceById]);
  
  // Generate color scheme based on service
  const gradient = useMemo(() => {
    if (service) {
      return generateGradient(service.name);
    }
    return {
      primary: '#6366f1',
      accent: '#4f46e5',
      soft: '#f0f4ff',
      veryLight: '#fafbff'
    };
  }, [service]);

  // Animation values
  const ratingCount = useMotionValue(0);
  const roundedRating = useTransform(ratingCount, value => value.toFixed(1));
  const springRating = useSpring(ratingCount, { stiffness: 100, damping: 30 });
  
  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load testimonials data with pagination
  useEffect(() => {
    const loadTestimonials = async () => {
      if (page === 1) setIsLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Mock testimonials data with additional fields for enhanced UI
        const mockTestimonials = [
          {
            id: 1,
            name: 'Ari Ganteng',
            role: 'Mahasiswa Politeknik Negeri Tanah Laut',
            content: 'Aplikasi yang sangat membantu untuk memberikan feedback ke layanan kampus. Tampilannya mudah digunakan dan responsif. Saya sangat senang bisa menggunakan platform ini untuk menyampaikan aspirasi mahasiswa. Semoga terus berkembang!',
            rating: 5,
            sentiment: 'positive',
            isFeatured: true,
            isVerified: true,
            timestamp: '3 hari yang lalu',
            date: '2023-04-20T10:30:00',
            dateFormatted: 'Apr 20, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 12,
            serviceId: '1',
            replies: [
              {
                id: 101,
                author: 'Admin Layanan',
                isAdmin: true,
                content: 'Terima kasih atas feedback positifnya! Kami senang layanan ini bermanfaat.',
                timestamp: '2 hari yang lalu',
                date: '2023-04-21T08:45:00'
              }
            ]
          },
          {
            id: 2,
            name: 'Anonymous',
            role: 'Anonymous',
            content: 'Kok Ngeleg di HP Aku yah 😑 Sering banget error pas submit form.',
            rating: 1,
            sentiment: 'negative',
            isFeatured: false,
            isVerified: false,
            timestamp: 'Baru Saja',
            date: '2023-04-25T09:15:00',
            dateFormatted: 'Apr 25, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'female',
            helpfulCount: 0,
            serviceId: '2',
            replies: []
          },
          {
            id: 3,
            name: 'Ahmad Fauzi',
            role: 'Dosen Fakultas Ekonomi',
            content: 'Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat merekomendasikan untuk digunakan di semua layanan kampus. Tampilan bersih dan mudah digunakan.',
            rating: 5,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: true,
            timestamp: '2 minggu yang lalu',
            date: '2023-04-12T13:45:00',
            dateFormatted: 'Apr 12, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 8,
            serviceId: '1',
            replies: []
          },
          {
            id: 4,
            name: 'Anonymous',
            role: 'Mahasiswa Politeknik Negeri Tanah Laut',
            content: 'Semangat ketua!',
            rating: 5,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: false,
            timestamp: 'Baru Saja',
            date: '2023-04-25T08:20:00',
            dateFormatted: 'Apr 25, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 2,
            serviceId: '3',
            replies: []
          },
          {
            id: 5,
            name: 'Fadiyah Nur',
            role: 'Mahasiswa Fakultas Ekonomi',
            content: 'Fitur surveinya bagus, tapi kadang masih ada lag di beberapa bagian. Semoga bisa diperbaiki di update selanjutnya. Saya sangat menantikan perbaikan pada sistem notifikasi.',
            rating: 4,
            sentiment: 'mixed',
            isFeatured: false,
            isVerified: true,
            timestamp: '1 minggu yang lalu',
            date: '2023-04-18T11:30:00',
            dateFormatted: 'Apr 18, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'female',
            helpfulCount: 5,
            serviceId: '2',
            replies: []
          },
          {
            id: 6,
            name: 'Arif Rahman',
            role: 'Mahasiswa Fakultas Teknik',
            content: 'Sangat membantu untuk memberikan feedback ke layanan kampus. Semoga layanan kampus jadi lebih baik dengan adanya survei ini. Respons dari admin juga cepat!',
            rating: 5,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: true,
            timestamp: '5 hari yang lalu',
            date: '2023-04-20T14:20:00',
            dateFormatted: 'Apr 20, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 7,
            serviceId: '3',
            replies: []
          },
          {
            id: 7,
            name: 'Bayu Pratama',
            role: 'Alumni 2022',
            content: 'Kualitas surveinya bagus, tapi perlu ditambahkan fitur untuk melacak perbaikan setelah masukan diberikan. Juga masih ada beberapa bug di halaman profil.',
            rating: 3,
            sentiment: 'mixed',
            isFeatured: false,
            isVerified: true,
            timestamp: '3 minggu yang lalu',
            date: '2023-04-05T16:10:00',
            dateFormatted: 'Apr 5, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 3,
            serviceId: '4',
            replies: []
          },
          {
            id: 8,
            name: 'Dina Permata',
            role: 'Staff TU Fakultas Ekonomi',
            content: 'Platform yang mudah digunakan untuk mendapatkan feedback dari mahasiswa. Sangat membantu untuk meningkatkan kualitas layanan. Form survei sangat jelas dan mudah diisi.',
            rating: 4,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: true,
            timestamp: '2 minggu yang lalu',
            date: '2023-04-12T10:15:00',
            dateFormatted: 'Apr 12, 2023',
            month: 'Apr 2023',
            profileImage: null,
            gender: 'female',
            helpfulCount: 6,
            serviceId: '1',
            replies: []
          },
          {
            id: 9,
            name: 'Budi Santoso',
            role: 'Mahasiswa Pascasarjana',
            content: 'Saya sangat puas dengan sistem survei ini. Mudah digunakan dan responsif. Saran saya untuk menambahkan opsi bahasa Inggris juga agar lebih inklusif.',
            rating: 5,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: true,
            timestamp: '1 bulan yang lalu',
            date: '2023-03-25T14:30:00',
            dateFormatted: 'Mar 25, 2023',
            month: 'Mar 2023',
            profileImage: null,
            gender: 'male',
            helpfulCount: 10,
            serviceId: '1',
            replies: []
          },
          {
            id: 10,
            name: 'Ratna Dewi',
            role: 'Dosen Fakultas Sains',
            content: 'Sistemnya mempermudah kami mendapatkan feedback yang jujur dari mahasiswa. Dashboard analitiknya sangat informatif untuk evaluasi layanan.',
            rating: 5,
            sentiment: 'positive',
            isFeatured: false,
            isVerified: true,
            timestamp: '2 bulan yang lalu',
            date: '2023-02-20T09:15:00',
            dateFormatted: 'Feb 20, 2023',
            month: 'Feb 2023',
            profileImage: null,
            gender: 'female',
            helpfulCount: 15,
            serviceId: '2',
            replies: [
              {
                id: 102,
                author: 'Admin IT',
                isAdmin: true,
                content: 'Terima kasih atas review positifnya, Bu Ratna. Kami terus berupaya meningkatkan fitur analitik kami.',
                timestamp: '2 bulan yang lalu',
                date: '2023-02-21T10:20:00'
              }
            ]
          }
        ];
        
        // Filter by serviceId if provided
        let newTestimonials = [...mockTestimonials];
        if (serviceId) {
          newTestimonials = newTestimonials.filter(t => t.serviceId === serviceId);
        }
        
        // Simulate pagination
        const totalItems = newTestimonials.length;
        const itemsPerPage = 4;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginatedData = newTestimonials.slice(0, page * itemsPerPage);
        
        if (page === 1) {
          setTestimonials(paginatedData);
          setFilteredTestimonials(paginatedData);
        } else {
          setTestimonials(prev => [...prev, ...paginatedData.slice((page-1) * itemsPerPage)]);
          setFilteredTestimonials(prev => [...prev, ...paginatedData.slice((page-1) * itemsPerPage)]);
        }
        
        setHasMore(page < totalPages);
        setIsLoading(false);
        
        // Animate rating count
        if (page === 1 && ratingRef.current) {
          setTimeout(() => {
            const stats = calculateStats(newTestimonials);
            ratingCount.set(stats.average);
          }, 500);
        }
      }, 1200); // Simulate loading time
    };
    
    loadTestimonials();
  }, [serviceId, page, ratingCount]);
  
  // Calculate monthly trend data for chart
  const calculateTrendData = (data) => {
    const months = {};
    
    // Group reviews by month
    data.forEach(review => {
      const month = review.month;
      if (!months[month]) {
        months[month] = { count: 0, totalRating: 0 };
      }
      months[month].count += 1;
      months[month].totalRating += review.rating;
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(months).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
    
    // Calculate average rating per month
    const labels = sortedMonths;
    const ratings = sortedMonths.map(month => 
      months[month].totalRating / months[month].count
    );
    const counts = sortedMonths.map(month => months[month].count);
    
    return { labels, ratings, counts };
  };
  
  // Get profile image based on gender
  const getProfileImage = (gender) => {
    return gender === 'female' ? '/profile_picture_female.png' : '/profile_picture_male.png';
  };

  // Calculate overall statistics
  const calculateStats = (data = testimonials) => {
    if (data.length === 0) return { average: 0, total: 0, distribution: [] };
    
    const total = data.length;
    const totalRating = data.reduce((sum, t) => sum + t.rating, 0);
    const average = totalRating / total;
    
    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = data.filter(t => t.rating === rating).length;
      const percentage = (count / total) * 100;
      return { rating, count, percentage };
    });
    
    return { average, total, distribution };
  };
  
  // Stats data
  const stats = calculateStats();
  const trendData = useMemo(() => calculateTrendData(testimonials), [testimonials]);
  
  // Chart data
  const barChartData = {
    labels: ['5★', '4★', '3★', '2★', '1★'],
    datasets: [
      {
        data: stats.distribution.map(d => d.count),
        backgroundColor: stats.distribution.map((_, index) => {
          if (service) {
            // Create a gradient of colors based on the service accent color
            const opacity = 1 - (index * 0.15);
            return `${gradient.accent}${Math.floor(opacity * 100)}`;
          } else {
            return [
              'rgba(243, 186, 47, 0.9)',
              'rgba(243, 186, 47, 0.7)',
              'rgba(243, 186, 47, 0.5)',
              'rgba(243, 186, 47, 0.3)',
              'rgba(243, 186, 47, 0.2)'
            ][index];
          }
        }),
        borderRadius: 6,
        borderWidth: 0,
        borderColor: 'transparent',
      }
    ]
  };
  
  const lineChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Rating Rata-rata',
        data: trendData.ratings,
        borderColor: service ? gradient.accent : '#6366f1',
        backgroundColor: service ? `${gradient.accent}30` : 'rgba(99, 102, 241, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: service ? gradient.accent : '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      }
    ]
  };
  
  // Handle search term change with typeahead
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterRating, sortBy);
  };
  
  // Handle rating filter change
  const handleRatingFilter = (rating) => {
    setFilterRating(rating);
    applyFilters(searchTerm, rating, sortBy);
  };
  
  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    applyFilters(searchTerm, filterRating, sort);
  };
  
  // Toggle expanded testimonial
  const toggleExpandTestimonial = (id) => {
    setExpandedTestimonials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Toggle trends view
  const handleToggleTrends = () => {
    setShowTrends(!showTrends);
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    let ratingValue = 'all';
    switch (tab) {
      case 'positive':
        ratingValue = '5';
        break;
      case 'neutral':
        ratingValue = '3';
        break;
      case 'negative':
        ratingValue = '1';
        break;
      default:
        ratingValue = 'all';
    }
    
    setFilterRating(ratingValue);
    applyFilters(searchTerm, ratingValue, sortBy);
  };
  
  // Apply all filters
  const applyFilters = (term, rating, sort) => {
    // First filter by search term and rating
    let filtered = testimonials.filter(testimonial => {
      const matchesTerm = term === '' || 
        testimonial.content.toLowerCase().includes(term) || 
        testimonial.name.toLowerCase().includes(term) ||
        testimonial.role.toLowerCase().includes(term);
      
      const matchesRating = rating === 'all' || testimonial.rating === parseInt(rating);
      
      return matchesTerm && matchesRating;
    });
    
    // Then sort the filtered results
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        break;
    }
    
    setFilteredTestimonials(filtered);
  };
  
  // Mark a testimonial as helpful
  const handleMarkHelpful = (id) => {
    const updatedTestimonials = testimonials.map(testimonial => {
      if (testimonial.id === id) {
        return {
          ...testimonial,
          helpfulCount: testimonial.helpfulCount + 1
        };
      }
      return testimonial;
    });
    
    setTestimonials(updatedTestimonials);
    
    // Re-apply current filters to update the filtered list
    applyFilters(searchTerm, filterRating, sortBy);
  };
  
  // Toggle reply input for a testimonial
  const toggleReply = (id) => {
    const updatedTestimonials = testimonials.map(testimonial => {
      if (testimonial.id === id) {
        return {
          ...testimonial,
          showReplyInput: !testimonial.showReplyInput
        };
      }
      return testimonial;
    });
    
    setTestimonials(updatedTestimonials);
    
    // Re-apply current filters to update the filtered list
    applyFilters(searchTerm, filterRating, sortBy);
  };
  
  // Handle reply input change
  const handleReplyChange = (id, value) => {
    setPendingReplies({
      ...pendingReplies,
      [id]: value
    });
  };
  
  // Submit reply
  const handleReplySubmit = (id) => {
    if (!pendingReplies[id]?.trim()) return;
    
    const updatedTestimonials = testimonials.map(testimonial => {
      if (testimonial.id === id) {
        return {
          ...testimonial,
          replies: [
            ...testimonial.replies,
            {
              id: Date.now(),
              author: 'You',
              isAdmin: isAdmin,
              content: pendingReplies[id],
              timestamp: 'Baru saja',
              date: new Date().toISOString()
            }
          ]
        };
      }
      return testimonial;
    });
    
    setTestimonials(updatedTestimonials);
    
    // Clear the reply input
    setPendingReplies({
      ...pendingReplies,
      [id]: ''
    });
    
    // Re-apply current filters to update the filtered list
    applyFilters(searchTerm, filterRating, sortBy);
  };
  
  // Handle load more
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Share testimonial
  const handleShareTestimonial = (testimonial) => {
    let shareText = `"${testimonial.content.substring(0, 100)}..." - ${testimonial.name}, ${testimonial.role}`;
    if (service) {
      shareText += `\nUlasan untuk layanan ${service.name} di UIN Antasari`;
    } else {
      shareText += `\nUlasan layanan di UIN Antasari`;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'Ulasan UIN Antasari',
        text: shareText,
        url: window.location.href
      }).catch(err => {
        console.error('Sharing failed:', err);
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard');
    }
  };
  
  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 dark:border-t-primary-400 animate-spin"></div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-primary-500 dark:text-primary-400 font-light text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            UIN
          </motion.div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Memuat ulasan...</p>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 md:pt-24 ${isDarkMode ? 'dark' : ''}`}>
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            ref={topButtonRef}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: service ? gradient.accent : undefined,
              color: service ? 'white' : undefined
            }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Using the consistent Breadcrumb component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb 
          items={[
            { path: '/directory', label: 'Layanan', icon: <Home className="h-4 w-4" /> },
            ...(service ? [{ path: `/service/${serviceId}`, label: service.name }] : []),
            { label: 'Ulasan Pengguna', icon: <MessageSquare className="h-4 w-4" />, current: true }
          ]}
        />
      </div>

      {/* Page title */}
      <div className="mt-4 mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {service && (
            <button 
              onClick={() => navigate(`/service/${serviceId}`)}
              className="inline-flex items-center justify-center p-1.5 rounded-full transition-all"
              style={{ backgroundColor: gradient.soft }}
            >
              <ChevronLeft 
                className="h-5 w-5" 
                style={{ color: gradient.accent }}
              />
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {service ? `Ulasan ${service.name}` : 'Ulasan Pengguna'}
          </h1>
          
          {/* Dark mode toggle */}
          <div className="ml-auto">
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm"
                  >
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tabs for quick filtering - Mobile only */}
        <div className="mb-6 md:hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="positive">
                <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                <span>5★</span>
              </TabsTrigger>
              <TabsTrigger value="neutral">
                <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                <span>3★</span>
              </TabsTrigger>
              <TabsTrigger value="negative">
                <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                <span>1★</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Analytics Card */}
        <Card className="mb-8 overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Side - Rating Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Rating Rata-rata</CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-trends" className="text-xs cursor-pointer">
                    Tampilkan Tren
                  </Label>
                  <Switch 
                    id="show-trends" 
                    checked={showTrends}
                    onCheckedChange={handleToggleTrends}
                  />
                </div>
              </div>

              {/* Average Rating Display */}
              <div className="flex items-center gap-4">
                <div className="relative" ref={ratingRef}>
                  <div 
                    className="text-5xl md:text-6xl font-bold"
                    style={{ color: service ? gradient.accent : '#1a1a1a' }}
                  >
                    <motion.span>{roundedRating}</motion.span>
                  </div>
                  <motion.div 
                    className="absolute -inset-1 rounded-full opacity-30 blur-md"
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{
                      background: service 
                        ? `radial-gradient(circle at center, ${gradient.accent} 0%, transparent 70%)`
                        : 'radial-gradient(circle at center, #6366f1 0%, transparent 70%)',
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 ${
                          rating <= Math.round(stats.average)
                            ? 'fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        style={{ 
                          color: rating <= Math.round(stats.average) 
                            ? (service ? gradient.accent : '#f59e0b') 
                            : undefined 
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    dari <span className="font-medium text-gray-700 dark:text-gray-300">{stats.total}</span> ulasan
                  </p>
                </div>
                
                {service && (
                  <Badge 
                    className="ml-auto"
                    style={{ 
                      backgroundColor: `${gradient.accent}20`, 
                      color: gradient.accent 
                    }}
                  >
                    {service.name}
                  </Badge>
                )}
              </div>

              {/* Distribution or Trend Chart */}
              <div className="h-[180px] mt-4">
                <AnimatePresence mode="wait">
                  {showTrends ? (
                    <motion.div 
                      key="trend-chart"
                      className="h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Line 
                        data={lineChartData} 
                        options={getRatingChartOptions(isDarkMode)} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="distribution-chart"
                      className="h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Bar 
                        data={barChartData} 
                        options={getRatingChartOptions(isDarkMode)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Right Side - Search & Filter */}
            <div className="space-y-4">
              <CardTitle className="text-lg font-semibold">Filter & Pencarian</CardTitle>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Cari ulasan..."
                  className="pl-10 pr-3 py-2 dark:bg-gray-800"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Filter Rating</Label>
                  <Select value={filterRating} onValueChange={handleRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Rating</SelectItem>
                      <SelectItem value="5">
                        <div className="flex items-center">
                          <span className="mr-2">5</span>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      </SelectItem>
                      <SelectItem value="4">
                        <div className="flex items-center">
                          <span className="mr-2">4</span>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex items-center">
                          <span className="mr-2">3</span>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex items-center">
                          <span className="mr-2">2</span>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      </SelectItem>
                      <SelectItem value="1">
                        <div className="flex items-center">
                          <span className="mr-2">1</span>
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Urutkan</Label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="oldest">Terlama</SelectItem>
                      <SelectItem value="highest">Rating Tertinggi</SelectItem>
                      <SelectItem value="lowest">Rating Terendah</SelectItem>
                      <SelectItem value="helpful">Paling Membantu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Active filters */}
              {(searchTerm || filterRating !== 'all') && (
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Filter Aktif:</p>
                  
                  {searchTerm && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800">
                      <Search className="h-3 w-3" />
                      <span className="truncate max-w-[120px]">{searchTerm}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          setSearchTerm('');
                          applyFilters('', filterRating, sortBy);
                        }}
                      />
                    </Badge>
                  )}
                  
                  {filterRating !== 'all' && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span>{filterRating} bintang</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          setFilterRating('all');
                          applyFilters(searchTerm, 'all', sortBy);
                        }}
                      />
                    </Badge>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 px-2"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterRating('all');
                      applyFilters('', 'all', sortBy);
                    }}
                  >
                    Reset Semua
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Testimonials list */}
        <div className="mb-12">
          {/* Results count */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan {filteredTestimonials.length} dari {stats.total} ulasan
            </div>
            
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            )}
          </div>

          {/* Empty state */}
          {filteredTestimonials.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak Ada Ulasan Ditemukan</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                Belum ada ulasan yang cocok dengan filter yang Anda pilih.
                Coba gunakan filter lain atau jadilah yang pertama memberikan ulasan!
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRating('all');
                    applyFilters('', 'all', sortBy);
                  }}
                >
                  Reset Filter
                </Button>
                <Button 
                  variant="default"
                  style={{ 
                    backgroundColor: service ? gradient.accent : undefined,
                    color: 'white'  
                  }}
                >
                  Berikan Ulasan
                </Button>
              </div>
            </div>
          )}

          {/* Masonry layout for testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Featured testimonial - full width */}
            {filteredTestimonials.length > 0 && filteredTestimonials.find(t => t.isFeatured) && (
              <motion.div 
                className="md:col-span-2 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TestimonialCard 
                  testimonial={filteredTestimonials.find(t => t.isFeatured)}
                  isFeatured={true}
                  isExpanded={expandedTestimonials[filteredTestimonials.find(t => t.isFeatured).id]}
                  pendingReply={pendingReplies[filteredTestimonials.find(t => t.isFeatured).id] || ''}
                  onToggleExpand={() => toggleExpandTestimonial(filteredTestimonials.find(t => t.isFeatured).id)}
                  onToggleReply={() => toggleReply(filteredTestimonials.find(t => t.isFeatured).id)}
                  onMarkHelpful={() => handleMarkHelpful(filteredTestimonials.find(t => t.isFeatured).id)}
                  onShareTestimonial={() => handleShareTestimonial(filteredTestimonials.find(t => t.isFeatured))}
                  onReplyChange={(e) => handleReplyChange(filteredTestimonials.find(t => t.isFeatured).id, e.target.value)}
                  onReplySubmit={() => handleReplySubmit(filteredTestimonials.find(t => t.isFeatured).id)}
                  gradient={gradient}
                  isAdmin={isAdmin}
                  serviceId={serviceId}
                  getProfileImage={getProfileImage}
                />
              </motion.div>
            )}
            
            {/* Regular testimonials */}
            <AnimatePresence>
              {filteredTestimonials
                .filter(t => !t.isFeatured)
                .map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05
                    }}
                    layout
                  >
                    <TestimonialCard 
                      testimonial={testimonial}
                      isFeatured={false}
                      isExpanded={expandedTestimonials[testimonial.id]}
                      pendingReply={pendingReplies[testimonial.id] || ''}
                      onToggleExpand={() => toggleExpandTestimonial(testimonial.id)}
                      onToggleReply={() => toggleReply(testimonial.id)}
                      onMarkHelpful={() => handleMarkHelpful(testimonial.id)}
                      onShareTestimonial={() => handleShareTestimonial(testimonial)}
                      onReplyChange={(e) => handleReplyChange(testimonial.id, e.target.value)}
                      onReplySubmit={() => handleReplySubmit(testimonial.id)}
                      gradient={gradient}
                      isAdmin={isAdmin}
                      serviceId={serviceId}
                      getProfileImage={getProfileImage}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          
          {/* Loading more testimonials */}
          {isLoading && page > 1 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(2)].map((_, index) => (
                <TestimonialSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}
          
          {/* Load more button */}
          {hasMore && !isLoading && (
            <div 
              ref={loadMoreRef}
              className="mt-10 text-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={handleLoadMore}
              >
                <div className="flex items-center">
                  <span>Muat Lebih Banyak</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </div>
              </Button>
            </div>
          )}
          
          {/* No more testimonials message */}
          {!hasMore && filteredTestimonials.length > 0 && (
            <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Anda telah melihat semua ulasan yang tersedia.
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom action buttons for mobile */}
      {service && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
          <div className="flex justify-between items-center">
            <Link
              to={`/service/${serviceId}`}
              className="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:opacity-90 w-full text-white"
              style={{ 
                backgroundColor: gradient.accent,
                boxShadow: `0 2px 5px -1px rgba(0, 0, 0, 0.15)`
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              Kembali ke Layanan {service.name ? service.name.split(' ')[0] : ''}
            </Link>
          </div>
        </div>
      )}
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