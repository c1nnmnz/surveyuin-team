import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const NotFoundPage = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [randomTip, setRandomTip] = useState('');
  
  // Helpful tips for lost users
  const helpfulTips = [
    "Cek URL dan pastikan tidak ada kesalahan pengetikan.",
    "Halaman yang Anda cari mungkin telah dipindahkan atau diperbarui.",
    "Jika Anda menggunakan bookmark, mungkin perlu diperbarui.",
    "Coba gunakan menu navigasi untuk menemukan halaman yang Anda cari.",
    "Halaman ini mungkin sedang dalam pemeliharaan, silakan coba lagi nanti."
  ];
  
  // Change the tip every 5 seconds
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * helpfulTips.length);
    setRandomTip(helpfulTips[randomIndex]);
    
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * helpfulTips.length);
      setRandomTip(helpfulTips[newIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <AnimatePresence>
        <motion.div 
          className="max-w-3xl w-full mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-6 mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative z-10 mx-auto"
            >
              <img 
                src="/404_page.png" 
                alt="404 Halaman Tidak Ditemukan" 
                className="h-64 md:h-80 mx-auto object-contain"
              />
            </motion.div>
            
            <motion.div 
              className="absolute inset-0 bg-blue-500 rounded-full opacity-5 blur-3xl"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.05, 0.08, 0.05]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-primary-600 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Ups! Sepertinya Anda Tersesat
          </motion.h2>
          
          <motion.p 
            className="text-secondary-600 mt-3 max-w-md mx-auto text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke halaman utama.
          </motion.p>
          
          <motion.div
            className="mt-6 mb-8 max-w-md mx-auto bg-blue-50 p-4 rounded-xl border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex items-start">
              <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="ml-2 text-sm text-blue-700">{randomTip}</p>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <Link to="/">
              <motion.button
                className="px-6 py-3 bg-primary-600 text-white rounded-full flex items-center shadow-lg shadow-primary-100 hover:shadow-xl hover:shadow-primary-200 transition-all duration-300 font-medium"
                whileHover={{ 
                  scale: 1.03,
                  backgroundColor: "#0052cc" 
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Halaman Utama
                <motion.span
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: isHovering ? 4 : 0, opacity: isHovering ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 ml-1" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NotFoundPage; 