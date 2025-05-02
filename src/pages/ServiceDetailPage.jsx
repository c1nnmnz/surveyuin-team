import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ExternalLink,
  Sparkles,
  Globe,
  Handshake, 
  FlaskConical,
  Award, 
  BookOpen,
  Building2,
  TrendingUp,
  GraduationCap, 
  ClipboardList, 
  Stethoscope, 
  Laptop, 
  Users, 
  Banknote,
  Info,
  MessageSquare,
  ChevronRight,
  Share,
  Star,
  ArrowLeft,
  MapPin,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  Mail,
  Building,
  Check,
  Home,
  ArrowRight,
  PenLine,
  ChevronDown,
  Wallet,
  Library,
  Microscope,
  School,
  BookText,
  Camera,
  Film,
  Lightbulb,
  Newspaper,
  Bell,
  DollarSign,
  CircleDollarSign,
  Briefcase,
  LineChart,
  BarChart,
  HeartPulse,
  Medal,
  ClipboardCheck
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Lottie from 'lottie-react';
import Button3D from '../components/Button3D';
import { useDirectoryStore } from '../store/directoryStore';
import { useUserStore } from '../store/userStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Badge } from "../components/ui/badge";
import { toast } from "../hooks/use-toast.jsx";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, isServiceFavorite, toggleFavorite, isServiceCompleted } = useDirectoryStore();
  const { isAuthenticated } = useUserStore();
  const [service, setService] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  
  // Refs
  const pageRef = useRef(null);
  const qrWrapperRef = useRef(null);
  const headerRef = useRef(null);
  
  // Handle scroll for header opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Service data fetching
  useEffect(() => {
    const serviceData = getServiceById(id);
    
    if (serviceData) {
      document.title = `${serviceData.name} | UIN Antasari`;
      setService(serviceData);
    } else {
      navigate('/not-found');
    }
    
    return () => {
      document.title = 'UIN Antasari';
    };
  }, [id, getServiceById, navigate]);
  
  // Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${service.name} | UIN Antasari`,
        text: `Informasi tentang layanan ${service.name} di UIN Antasari`,
        url: window.location.href
      }).catch(err => {
        console.error('Sharing failed:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard');
    }
  };

  if (!service) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full border-t-2 border-l-2 border-r-2 border-transparent border-t-primary-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute text-primary-500 font-light text-sm tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            UIN
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Get gradient from service name
  const getServiceGradient = (serviceName) => {
    // Simple hash function
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
    
    return {
      from: `hsl(${finalHue}, 80%, 92%)`,  // Very light pastel
      to: `hsl(${finalHue}, 70%, 85%)`,     // Slightly more saturated
      accent: `hsl(${finalHue}, 70%, 45%)`, // Accent color for icons
      text: `hsl(${finalHue}, 80%, 35%)`,   // Text color matching the theme
      buttonBg: '#3b82f6',                 // Button background color (fixed for all services)
      buttonGradient: '#0ea5e9',           // Button gradient highlight color
      // Ultra-soft versions for backgrounds
      soft: `hsl(${finalHue}, 30%, 97%)`,
      veryLight: `hsl(${finalHue}, 30%, 99%)`,
    };
  };
  
  // Get icon for service based on category and name
  const getServiceIcon = (service) => {
    const category = service.category.toLowerCase();
    const name = service.name.toLowerCase();
    
    const iconProps = { size: 20, className: "text-white" };
    
    // Check service names first
    if (name.includes('keuangan')) return <Wallet {...iconProps} />;
    if (name.includes('kehumasan')) return <Globe {...iconProps} />;
    if (name.includes('kerjasama')) return <Handshake {...iconProps} />;
    if (name.includes('lp2m')) return <FlaskConical {...iconProps} />;
    if (name.includes('lpm')) return <Award {...iconProps} />;
    if (name.includes('perpustakaan') || name.includes('library')) return <BookOpen {...iconProps} />;
    if (name.includes('umum')) return <Building {...iconProps} />;
    if (name.includes('mahad') || name.includes('al jamiah')) return <Building2 {...iconProps} />;
    if (name.includes('upkk')) return <TrendingUp {...iconProps} />;
    if (name.includes('akademik')) return <GraduationCap {...iconProps} />;
    if (name.includes('it') || name.includes('teknologi informasi')) return <Laptop {...iconProps} />;
    if (name.includes('bank')) return <Banknote {...iconProps} />;
    if (name.includes('beasiswa')) return <Medal {...iconProps} />;
    if (name.includes('alumni')) return <Users {...iconProps} />;
    if (name.includes('publikasi')) return <Newspaper {...iconProps} />;
    if (name.includes('pendaftaran')) return <ClipboardList {...iconProps} />;
    if (name.includes('komunikasi')) return <MessageSquare {...iconProps} />;
    if (name.includes('media') || name.includes('dokumentasi')) return <Camera {...iconProps} />;
    if (name.includes('riset')) return <Microscope {...iconProps} />;
    
    // Then check categories
    if (category.includes('keuangan')) return <Wallet {...iconProps} />;
    if (category.includes('humas') || category.includes('publikasi')) return <Globe {...iconProps} />;
    if (category.includes('kerjasama')) return <Handshake {...iconProps} />;
    if (category.includes('penelitian')) return <Microscope {...iconProps} />;
    if (category.includes('pengembangan') && category.includes('akademik')) return <Award {...iconProps} />;
    if (category.includes('perpustakaan') || category.includes('library')) return <Library {...iconProps} />;
    if (category.includes('akademik')) return <GraduationCap {...iconProps} />;
    if (category.includes('admin')) return <ClipboardList {...iconProps} />;
    if (category.includes('kesehatan')) return <HeartPulse {...iconProps} />;
    if (category.includes('teknologi')) return <Laptop {...iconProps} />;
    if (category.includes('humas')) return <Users {...iconProps} />;
    if (category.includes('pendaftaran')) return <ClipboardList {...iconProps} />;
    if (category.includes('informasi')) return <Info {...iconProps} />;
    if (category.includes('pendidikan')) return <School {...iconProps} />;
    if (category.includes('pengajaran')) return <BookText {...iconProps} />;
    if (category.includes('media')) return <Camera {...iconProps} />;
    if (category.includes('arsip')) return <BookOpen {...iconProps} />;
    if (category.includes('dokumentasi')) return <Camera {...iconProps} />;
    if (category.includes('video')) return <Film {...iconProps} />;
    if (category.includes('inovasi') || category.includes('kreativitas')) return <Lightbulb {...iconProps} />;
    if (category.includes('beasiswa') || category.includes('bantuan')) return <Medal {...iconProps} />;
    if (category.includes('statistik') || category.includes('data')) return <BarChart {...iconProps} />;
    if (category.includes('pelatihan') || category.includes('training')) return <Briefcase {...iconProps} />;
    
    // Default icon
    return <Sparkles {...iconProps} />;
  };

  const gradient = getServiceGradient(service.name);
  
  // Define the custom gradient for the icons
  const iconBgStyle = {
    background: `linear-gradient(135deg, ${gradient.accent}, ${gradient.text})`,
    boxShadow: `0 4px 10px -2px rgba(0, 0, 0, 0.2)`
  };

  return (
    <motion.div 
      ref={pageRef}
      className="min-h-screen bg-white font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Using the consistent Breadcrumb component */}
      <div className="pt-20">
        <Breadcrumb 
          items={[
            { path: '/directory', label: 'Layanan' },
            { label: service.name, current: true }
          ]}
        />
      </div>

      {/* Main content */}
      <div className="pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 md:pb-32">
        {/* Service completed notice */}
        <AnimatePresence>
        {isServiceCompleted(service.id) && (
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            className="mb-6"
          >
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center">
                <div className="bg-blue-100 rounded-full p-1.5 mr-2 flex-shrink-0">
                  <Check className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-blue-800 text-xs">
                    Anda telah mengisi survei untuk layanan ini
                  </h3>
                </div>
                <Link
                  to={`/history/${service.id}`}
                  className="flex items-center text-xs font-medium text-blue-700 hover:text-blue-800 ml-2 flex-shrink-0"
                >
                  Lihat
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        
        {/* Desktop: Two-column layout container */}
        <div className="md:flex md:gap-6 md:items-start">
          {/* Left column for desktop - Service info */}
          <div className="md:w-7/12 lg:w-8/12">
            {/* Service icon & name header - Side by side layout */}
            <div className="pb-5 mb-5">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* Icon with gradient background - Left side */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mb-3 md:mb-0 md:mr-6 flex-shrink-0"
                >
                  <div className="relative">
                    {/* Subtle glow effect */}
                  <div 
                      className="absolute -inset-2 rounded-full opacity-30 blur-xl md:-inset-3"
                    style={{
                        background: `radial-gradient(circle at center, ${gradient.accent} 0%, transparent 70%)`,
                    }}
                  ></div>
                    
                  <div 
                      className="h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center relative"
                      style={iconBgStyle}
                    >
                      {getServiceIcon(service)}
                    </div>
                  </div>
                </motion.div>
              
                {/* Service name & tags - Right side */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center md:text-left flex-grow"
              >
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-gray-900 mb-2 md:mb-3 leading-tight break-words">
                  {service.name}
                </h1>
                
                  <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center md:justify-start mb-3 md:mb-4">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="inline-flex text-xs font-medium py-0.5 px-2 md:py-1 md:px-3 rounded-full"
                      style={{ 
                        backgroundColor: `${gradient.accent}15`,
                        color: gradient.accent
                      }}
                    >
                    {service.faculty}
                    </motion.span>
                    
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="inline-flex text-xs font-medium py-0.5 px-2 md:py-1 md:px-3 rounded-full"
                      style={{ 
                        backgroundColor: `${gradient.accent}15`,
                        color: gradient.accent
                      }}
                    >
                    {service.category}
                    </motion.span>
                    
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="inline-flex items-center text-xs font-medium py-0.5 px-2 md:py-1 md:px-3 rounded-full"
                      style={{ 
                        backgroundColor: service.status === 'Aktif' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(252, 165, 165, 0.1)',
                        color: service.status === 'Aktif' ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)'
                      }}
                    >
                      <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mr-1 md:mr-1.5 ${
                        service.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    {service.status}
                    </motion.span>
                </div>
                  
                  {/* Emotional welcome text */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-gray-600 text-sm max-w-md mx-auto md:mx-0 leading-relaxed md:text-base"
                  >
                    Bantu kami berkembang lebih baik.
                  </motion.p>
              </motion.div>
              </div>
            </div>
            
            {/* Mobile only - QR Code and Survey Section */}
            <div className="md:hidden mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden"
              >
                <div 
                  className="px-4 py-5 relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradient.veryLight}, white)` 
                  }}
                >
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Survei Layanan</h2>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      Pendapat Anda sangat berharga bagi kami.
                    </p>
                  </div>
                  
                  <div className="mb-4 flex justify-center">
                    <motion.div
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      className="rounded-xl p-3 bg-white shadow-md relative"
                    >
                      <QRCodeSVG 
                        value={service.qrCode}
                        size={120}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                        includeMargin={false}
                      />
                      
                      {/* QR code watermark */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-900/[0.03] text-xl font-medium">UIN</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="text-center mb-4">
                    {!isServiceCompleted(service.id) && (
                      <Link
                        to={isAuthenticated ? `/survey/${service.id}` : '/login'}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center justify-center py-3 px-8 rounded-full text-white text-sm font-medium shadow-lg"
                          style={{ 
                            background: `linear-gradient(to right, ${gradient.accent}, ${gradient.text})`,
                            boxShadow: `0 8px 20px -5px rgba(0, 0, 0, 0.2)`
                          }}
                        >
                          <PenLine className="h-4 w-4 mr-2" />
                          Isi Survei
                        </motion.button>
                      </Link>
                    )}
                  </div>
                  
                  {/* Action buttons for mobile - Added to match desktop */}
                  <div className="flex justify-center gap-2 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="h-9 flex items-center justify-center px-4 rounded-full bg-white border border-gray-100 shadow-sm"
                      onClick={() => toggleFavorite(service.id)}
                      aria-label={isServiceFavorite(service.id) ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
                    >
                      <Star
                        className={isServiceFavorite(service.id) ? 'fill-amber-400 text-amber-400 mr-1.5' : 'text-gray-400 mr-1.5'}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {isServiceFavorite(service.id) ? "Favorit" : "Tambahkan ke Favorit"}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="h-9 flex items-center justify-center px-4 rounded-full bg-white border border-gray-100 shadow-sm"
                      onClick={handleShare}
                      aria-label="Share"
                    >
                      <Share
                        fontSize="small"
                        className="text-gray-400 mr-1.5"
                      />
                      <span className="text-xs font-medium text-gray-700">Share</span>
                    </motion.button>
                  </div>
                </div>
            </motion.div>
            </div>
            
            {/* Service info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6 md:mb-8">
              {/* Location card */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm md:rounded-2xl"
              >
                <div className="flex items-start">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mb-1"
                    style={iconBgStyle}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1.5">Lokasi</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{service.location}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Hours card */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm md:rounded-2xl"
              >
                <div className="flex items-start">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mb-1"
                    style={iconBgStyle}
                  >
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1.5">Jam Operasional</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{service.operationalHours}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Contact card */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm md:rounded-2xl sm:col-span-2 md:col-span-1"
              >
                <div className="flex items-start">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mb-1"
                    style={iconBgStyle}
                  >
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1.5">Kontak</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{service.contactPerson}</p>
                  </div>
              </div>
              </motion.div>
            </div>
            
            {/* User feedback section - New design */}
            <div className="bg-white py-8">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Ulasan Pengguna
                  </h2>
                  <Link 
                    className="font-medium flex items-center"
                    to={`/testimonials/${service.id}`}
                    style={{ color: gradient.accent }}
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </div>

                {/* Ahmad Fauzi review */}
                <div className="p-5 rounded-xl mb-3" style={{ backgroundColor: gradient.soft }}>
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2" style={{ borderColor: gradient.accent }}>
                        <img 
                          src="/profile_picture_male.png" 
                          alt="Ahmad Fauzi" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 mr-1.5">Ahmad Fauzi</h4>
                        <span className="text-xs" style={{ color: gradient.accent }}>Dosen Fakultas Ekonomi</span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3.5 w-3.5 text-amber-400 fill-amber-400" 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">2 minggu yang lalu</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat membantu kami meningkatkan kualitas layanan.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mahasiswa review */}
                <div className="p-5 rounded-xl" style={{ backgroundColor: gradient.soft }}>
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2" style={{ borderColor: gradient.accent }}>
                        <img 
                          src="/profile_picture_male.png" 
                          alt="Mahasiswa" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">Mahasiswa</h4>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="h-3.5 w-3.5 text-amber-400 fill-amber-400" 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Sangat terbantu dengan layanan ini. Prosesnya cepat dan penjelasannya sangat jelas. Terima kasih!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                </div>
                
          {/* Right column for desktop - Survey CTA */}
          <div className="md:w-5/12 lg:w-4/12">
            {/* Survey CTA Section - Hidden on mobile, only visible on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block sticky top-24 rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden mb-6"
            >
              <div 
                className="px-6 py-8 lg:px-8"
                style={{ 
                  background: `linear-gradient(135deg, ${gradient.veryLight}, white)` 
                }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Survei Layanan</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Pendapat Anda sangat berharga bagi kami.
                    </p>
                </div>
                
                <div className="mb-7 flex justify-center">
                  <motion.div 
                    ref={qrWrapperRef}
                    whileHover={{ 
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    className="rounded-xl p-5 bg-white shadow-md relative"
                  >
                        <QRCodeSVG 
                          value={service.qrCode}
                      size={160}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="H"
                          includeMargin={false}
                        />
                        
                    {/* QR code watermark */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-900/[0.03] text-2xl font-medium">UIN</span>
                    </div>
                  </motion.div>
                  </div>
                  
                <div className="text-center mb-6">
                    {!isServiceCompleted(service.id) && (
                      <Link
                        to={isAuthenticated ? `/survey/${service.id}` : '/login'}
                        className="w-full block"
                      >
                      <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center py-3.5 px-6 w-full rounded-full text-white text-base font-medium shadow-lg"
                          style={{
                          background: `linear-gradient(to right, ${gradient.accent}, ${gradient.text})`,
                          boxShadow: `0 8px 20px -5px rgba(0, 0, 0, 0.2)`
                          }}
                        >
                        <PenLine className="h-4 w-4 mr-2" />
                        Isi Survei
                      </motion.button>
                      </Link>
                    )}
                </div>
                
                {/* Action buttons - Moved from header */}
                <div className="flex justify-center gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="h-15 flex items-center justify-center px-6 rounded-full bg-white border border-gray-100 shadow-sm"
                    onClick={() => toggleFavorite(service.id)}
                    aria-label={isServiceFavorite(service.id) ? "Hapus dari Favorit" : "Tambahkan ke Favorit"}
                  >
                    <Star
                      className={isServiceFavorite(service.id) ? 'fill-amber-400 text-amber-400 mr-2' : 'text-gray-400 mr-2'}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {isServiceFavorite(service.id) ? "Favorit" : "Tambahkan ke Favorit"}
                    </span>
                  </motion.button>
                  
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="h-10 flex items-center justify-center px-5 rounded-full bg-white border border-gray-100 shadow-sm"
                      onClick={handleShare}
                    aria-label="Share"
                    >
                    <Share
                      fontSize="small"
                      className="text-gray-400 mr-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Share</span>
                    </motion.button>
                  </div>
                
                {/* Hero card image - Now positioned below buttons */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="rounded-xl overflow-hidden shadow-md w-full"
                  >
                    <img
                      src="/hero_card.png"
                      alt="UIN Antasari Survey"
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to format URL
const formatUrl = (url) => {
  try {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 30) + (url.length > 30 ? '...' : '');
  } catch (e) {
    return url;
  }
};

export default ServiceDetailPage; 