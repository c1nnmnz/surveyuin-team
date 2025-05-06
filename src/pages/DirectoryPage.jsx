import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  Clock,
  MapPin,
  Settings,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  Heart,
  Building,
  BookOpen,
  Laptop,
  Users,
  FlaskConical,
  Building2,
  Briefcase,
  TrendingUp,
  LineChart,
  BarChart,
  BookText,
  Camera,
  Handshake,
  Film,
  Lightbulb,
  Globe,
  Newspaper,
  Bell,
  Banknote,
  DollarSign,
  CircleDollarSign,
  Home,
  ChevronRight,
  Award,
  RefreshCcw,
  HelpCircle,
  HeartPulse,
  Wallet,
  Library,
  Microscope,
  School,
  Paperclip,
  SmilePlus,
  Medal
} from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import Skeleton from '../components/ui/skeleton';
import { CardGridSkeleton, TextSkeleton } from '../components/ui/skeleton';
import LoadingEffect from '../components/ui/LoadingEffect';

const DirectoryPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    facultyFilter,
    setFacultyFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    sortOrder,
    setSorting,
    getFilteredServices,
    getFaculties,
    getCategories,
    isServiceFavorite,
    toggleFavorite,
    isServiceCompleted,
  } = useDirectoryStore();

  // Local state for filters UI
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update local state when store changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay (you can remove this setTimeout when using real API)
    const timer = setTimeout(() => {
    setFilteredServices(getFilteredServices());
    setFaculties(getFaculties());
    setCategories(getCategories());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, facultyFilter, categoryFilter, sortBy, sortOrder, getFilteredServices, getFaculties, getCategories]);

  // Toggle filters panel on mobile
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFacultyFilter('all');
    setCategoryFilter('all');
    setSorting('name', 'asc');
    
    // Focus search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Change sort order
  const handleSortChange = (e) => {
    const value = e.target.value;
    
    switch (value) {
      case 'name-asc':
        setSorting('name', 'asc');
        break;
      case 'name-desc':
        setSorting('name', 'desc');
        break;
      case 'faculty-asc':
        setSorting('faculty', 'asc');
        break;
      case 'category-asc':
        setSorting('category', 'asc');
        break;
      default:
        setSorting('name', 'asc');
    }
  };
  
  // Improve the getServiceGradient function to create more distinct colors
  // IMPORTANT: Core hue selection logic stays in sync with ServiceDetailPage.jsx
  // but using brighter pastel colors for the thumbnails
  const getServiceGradient = (serviceName) => {
    // Simple hash function for string
    const hash = serviceName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate distinct hue based on name
    // Use a preset list of well-spaced hues and select based on name hash
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
    
    // Generate softer, more luxurious gradients with lower saturation
    // Dual-tone approach with white/neutral as the first color
    return {
      from: '#FFFFFF',  // Start with white/neutral
      via: `hsl(${finalHue}, 65%, 85%)`,  // Mid-point with color (reduced saturation)
      to: `hsl(${finalHue}, 50%, 75%)`,   // End with slightly deeper tone (reduced saturation)
      angle: '135deg', // Top-left to bottom-right direction
    };
  };

  // Generate icon based on service category or name
  const getServiceIcon = (service) => {
    const category = service.category.toLowerCase();
    const name = service.name.toLowerCase();
    
    // Define color style with black icons for better visibility
    const iconClass = `text-primary-800 w-10 h-10`;
    
    // Check for specific service names first
    if (name.includes('keuangan')) return <Wallet className={iconClass} />;
    if (name.includes('kehumasan')) return <Globe className={iconClass} />;
    if (name.includes('kerjasama')) return <Handshake className={iconClass} />;
    if (name.includes('lp2m')) return <FlaskConical className={iconClass} />;
    if (name.includes('lpm')) return <Award className={iconClass} />;
    if (name.includes('perpustakaan') || name.includes('library')) return <BookOpen className={iconClass} />;
    if (name.includes('umum')) return <Building className={iconClass} />;
    if (name.includes('mahad') || name.includes('al jamiah')) return <Building2 className={iconClass} />;
    if (name.includes('upkk')) return <TrendingUp className={iconClass} />;
    
    // Then check categories
    if (category.includes('keuangan')) return <Wallet className={iconClass} />;
    if (category.includes('humas') || category.includes('publikasi')) return <Globe className={iconClass} />;
    if (category.includes('kerjasama')) return <Handshake className={iconClass} />;
    if (category.includes('penelitian')) return <Microscope className={iconClass} />;
    if (category.includes('pengembangan') && category.includes('akademik')) return <Award className={iconClass} />;
    if (category.includes('perpustakaan') || category.includes('library')) return <Library className={iconClass} />;
    if (category.includes('akademik')) return <GraduationCap className={iconClass} />;
    if (category.includes('admin')) return <ClipboardList className={iconClass} />;
    if (category.includes('kesehatan')) return <HeartPulse className={iconClass} />;
    if (category.includes('teknologi')) return <Laptop className={iconClass} />;
    if (category.includes('humas')) return <Users className={iconClass} />;
    
    // Default icon based on first letter with improved styling
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 rounded-full"></div>
        <span className="text-black text-3xl font-bold relative z-10 drop-shadow-md">
          {service.name.charAt(0)}
        </span>
      </div>
    );
  };

  // Add the faculty abbreviation function before the return statement
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

  // Add this CSS class for the icon shadow effect
  const styles = document.createElement('style');
  styles.innerHTML = `
    .filter-shadow {
      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.25));
    }
  `;
  document.head.appendChild(styles);

  return (
    <div className="pt-16 pb-8 px-4 md:px-6">
      {/* Using the consistent Breadcrumb component */}
      <Breadcrumb 
        items={[
          { path: '/directory', label: 'Layanan', current: true }
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 max-w-4xl mt-6"
      >
        <h1 className="text-4xl font-display font-bold text-secondary-900 sm:text-5xl tracking-tight">
          Unit Layanan UIN Antasari Banjarmasin
        </h1>
        <p className="mt-3 text-xl text-secondary-600 max-w-3xl">
          Silakan memilih layanan yang ingin Anda akses
        </p>
      </motion.div>

      {/* Search and filter bar */}
      <div className="mb-16 max-w-6xl">
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className={`relative flex-grow transition-all duration-300`}
            animate={{ 
              scale: isSearchFocused ? 1.005 : 1,
              y: isSearchFocused ? -1 : 0
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300
                ${isSearchFocused ? 'text-primary-600 scale-110' : 'text-secondary-400'}`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari layanan"
              className={`py-3 px-12 w-full rounded-full border-2 text-lg
                ${isSearchFocused 
                  ? 'border-primary-400 shadow-lg shadow-primary-300/20 outline-none ring-2 ring-primary-300/30' 
                  : 'border-secondary-200 shadow-md hover:border-primary-300/70 hover:shadow-lg'
                }
                bg-white/90 backdrop-blur-md transition-all duration-300`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute right-7 top-4 -translate-y-1/2 h-6 w-6 text-red-500 hover:text-red-700 
                  bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center 
                  transition-all hover:shadow-sm"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            )}
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-3">
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                aria-label="Filter by faculty"
              >
                {faculties.map((faculty) => (
                  <option key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                aria-label="Sort by"
              >
                <option value="name-asc">Nama (A-Z)</option>
                <option value="name-desc">Nama (Z-A)</option>
                <option value="faculty-asc">Fakultas</option>
                <option value="category-asc">Kategori</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            {(searchQuery || facultyFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') && (
              <motion.button
                className="py-0.5 px-5 flex items-center text-red-600 hover:text-red-800 rounded-full 
                  bg-red-50 hover:bg-red-100 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-red-200"
                onClick={clearFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <RefreshCcw size={15} className="mr-1.5 animate-pulse-slow" />
                <span className="font-medium">Reset Filter</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Results count */}
      <motion.div 
        className="mb-6 text-secondary-600 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <TextSkeleton width="180px" height="20px" />
        ) : (
          <>
          {filteredServices.length} layanan ditemukan
            {facultyFilter !== 'all' && ` dari ${facultyFilter}`}
            {categoryFilter !== 'all' && ` kategori ${categoryFilter}`}
            {searchQuery && ` dengan kata kunci "${searchQuery}"`}
          </>
        )}
      </motion.div>
      
      {/* Service cards - consistent grid layout for improved readability */}
      {isLoading ? (
        <CardGridSkeleton count={6} columns={3} height={180} />
      ) : filteredServices.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredServices.map((service, index) => {
            const gradient = getServiceGradient(service.name);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.3)
                }}
                whileHover={{ 
                  scale: 1.01,
                  y: -2,
                  transition: { type: "spring", stiffness: 300, damping: 50 }
                }}
                className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg border-0"
              >
                <Link to={`/service/${service.id}`} className="flex flex-col h-full">
                  {/* Color Banner with Service Icon */}
                  <div 
                    className="h-40 flex relative overflow-hidden"
                    style={{
                      background: `linear-gradient(${gradient.angle}, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`,
                    }}
                  >
                    {/* Glassmorphism layer */}
                    <div className="absolute inset-0 bg-white/10 backdrop-filter backdrop-blur-[8px] z-0"></div>
                    
                    {/* Background effects */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 bg-white"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10 bg-white"></div>
                    
                    {/* Service icon with 3D effect */}
                    <div className="m-auto relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="p-4 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        {getServiceIcon(service)}
                      </div>
                    </div>
                    
                    {/* Favorite button - Apple-style minimal button */}
                    <motion.button
                      className="absolute right-5 top-4 z-10 p-2 rounded-full bg-white/70 shadow-sm
                        hover:bg-white/90 transition-all duration-300 group/star"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(service.id);
                      }}
                      aria-label={isServiceFavorite(service.id) ? "Remove from favorites" : "Add to favorites"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Star
                        className={`${
                          isServiceFavorite(service.id)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-secondary-600 group-hover/star:text-amber-400'
                        } transition-all duration-300`}
                        style={{ width: '18px', height: '18px' }}
                      />
                    </motion.button>
                    
                    {/* Completion badge - Refined Apple-style badge */}
                    {isServiceCompleted(service.id) && (
                      <div className="absolute left-4 top-4 z-10 py-1 px-2.5 rounded-full
                        bg-white/60 text-primary-700 text-xs font-medium flex items-center gap-1.5 backdrop-blur-md border-[0.5px] border-primary-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span>Sudah Disurvei</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content - Apple-inspired minimal design */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-semibold text-secondary-900 
                      tracking-tight line-clamp-2 mb-1.5">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm text-secondary-600 line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start">
                        <MapPin size={14} className="mt-0.5 mr-2 flex-shrink-0 text-secondary-500" />
                        <span className="text-xs text-secondary-700 line-clamp-1">
                          {service.location}
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock size={14} className="mt-0.5 mr-2 flex-shrink-0 text-secondary-500" />
                        <span className="text-xs text-secondary-700 line-clamp-1">
                          {service.operationalHours}
                        </span>
                      </div>
                    </div>
                    
                    {/* Apple-inspired tags */}
                    <div className="flex items-center gap-2 pt-3 border-t border-secondary-100/80">
                      <span className="inline-flex text-[11px] font-medium py-0.5 px-2 rounded-md
                        items-center truncate max-w-[48%] bg-secondary-50 text-secondary-800">
                        <span className="truncate">
                          {getFacultyAbbreviation(service.faculty)}
                        </span>
                      </span>
                      <span className="inline-flex text-[11px] font-medium py-0.5 px-2 rounded-md
                        items-center truncate max-w-[48%] bg-secondary-50 text-secondary-800">
                        <span className="truncate">{service.category}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div 
          className="py-16 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-secondary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center max-w-md">
            <AlertTriangle size={52} className="mx-auto mb-4 text-secondary-300" strokeWidth={1.5} />
            <h3 className="text-xl font-medium text-secondary-900 mb-2">
              Tidak ada layanan yang ditemukan
            </h3>
            <p className="text-secondary-600 mb-6">
              Coba ubah kata kunci pencarian atau filter Anda untuk menemukan layanan yang sesuai.
            </p>
            <motion.button
              className="mx-auto py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl
                shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center"
              onClick={clearFilters}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RefreshCcw size={15} className="mr-2" />
              Reset Filter
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DirectoryPage; 