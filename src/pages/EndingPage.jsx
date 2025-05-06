import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Heart, MessageSquare, Send, Star, Home } from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';
import { useSurveyStore } from '../store/surveyStore';
import useTestimonialStore from '../store/testimonialStore';
import confetti from 'canvas-confetti';

// Map emoji to rating value
const emojiToRating = {
  '😞': 1, // Buruk
  '😐': 2, // Biasa
  '🙂': 3, // Baik
  '😃': 4, // Sangat Baik
  '🤩': 5  // Luar Biasa
};

// Map emoji to sentiment
const emojiToSentiment = {
  '😞': 'negative', // Buruk
  '😐': 'neutral',  // Biasa
  '🙂': 'positive', // Baik
  '😃': 'positive', // Sangat Baik
  '🤩': 'positive'  // Luar Biasa
};

const EmojiFeedback = ({ selected, onClick, emoji, label, color }) => {
  const isSelected = selected === emoji;
  
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(emoji)}
      className={`flex flex-col items-center space-y-2 transition-all ${
        isSelected ? 'scale-110' : 'opacity-70'
      }`}
    >
      <div 
        className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full ${
          isSelected ? `bg-${color}-100 shadow-lg shadow-${color}-100/50` : 'bg-gray-100'
        }`}
      >
        <span className="text-3xl md:text-4xl">{emoji}</span>
      </div>
      <span className={`text-sm font-medium ${isSelected ? `text-${color}-500` : 'text-gray-500'}`}>{label}</span>
    </motion.button>
  );
};

const EndingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getServiceById } = useDirectoryStore();
  const { updateFeedback, getResponsesForService } = useSurveyStore();
  const { createTestimonial } = useTestimonialStore();
  
  // Log what state was passed to help debug
  console.log('EndingPage received state:', location.state);
  console.log('EndingPage serviceId param:', serviceId);
  
  // Get data passed from SurveyPage
  const surveyData = location.state || {};
  const { serviceName: passedServiceName, overallScore, responseId, completedAt } = surveyData;
  
  const [serviceName, setServiceName] = useState(passedServiceName || 'Layanan');
  const [feedbackEmoji, setFeedbackEmoji] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cachedResponseId, setCachedResponseId] = useState(responseId || null);
  
  // Emoji options
  const emojiOptions = [
    { emoji: '😞', label: 'Buruk', color: 'red' },
    { emoji: '😐', label: 'Biasa', color: 'yellow' },
    { emoji: '🙂', label: 'Baik', color: 'blue' },
    { emoji: '😃', label: 'Sangat Baik', color: 'green' },
    { emoji: '🤩', label: 'Luar Biasa', color: 'purple' }
  ];
  
  // Launch confetti effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [showConfetti]);
  
  // Get service info and latest response if not passed from previous page
  useEffect(() => {
    if (!serviceId) {
      console.warn('No serviceId provided to EndingPage');
      return;
    }
    
    // Try to get the service information
      try {
        console.log('Fetching service info for ID:', serviceId);
        // Try both string and number ID versions
        const service = getServiceById(serviceId) || 
                       getServiceById(parseInt(serviceId, 10)) || 
                       getServiceById(serviceId.toString());
        
        if (service) {
          console.log('Found service:', service);
          setServiceName(service.name || 'Layanan');
        } else {
          console.warn('Service not found for ID:', serviceId);
        }
      } catch (error) {
        console.error('Error getting service info:', error);
      }
    
    // If we don't have a response ID, try to get the latest response
    if (!responseId) {
      try {
        const responses = getResponsesForService(serviceId);
        console.log('Found responses for service:', responses);
        
        if (responses && responses.length > 0) {
          // Sort by timestamp descending to get most recent
          const sortedResponses = [...responses].sort(
            (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
          );
          
          const latestResponse = sortedResponses[0];
          console.log('Using latest response:', latestResponse);
          
          if (latestResponse && latestResponse.id) {
            setCachedResponseId(latestResponse.id);
          }
        }
      } catch (error) {
        console.error('Error finding latest response:', error);
      }
    }
  }, [serviceId, getServiceById, responseId, getResponsesForService]);
  
  // Show a warning if no state but continue anyway
  useEffect(() => {
    if (!location.state && serviceId) {
      console.warn('No survey data passed to ending page, will use minimal information');
      // We'll still show the page, but with limited information
    }
  }, [location.state, serviceId]);
  
  const handleSubmitFeedback = async () => {
    if (!feedbackEmoji) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting feedback for serviceId:', serviceId);
      
      // Generate fallback ID with service prefix for better tracking
      const fallbackId = `${serviceId}-fallback-${Date.now()}`;
      const responseIdToUse = cachedResponseId || responseId || fallbackId;
      
      // 1. Create the feedback data
      const feedbackData = {
        emoji: feedbackEmoji,
        comment: '',
        timestamp: new Date().toISOString(),
        responseId: responseIdToUse,
        score: overallScore || 0
      };
      
      // 2. Update feedback in the survey store
      updateFeedback(serviceId, feedbackData);
      
      // 3. Create a testimonial from the emoji feedback
      const rating = emojiToRating[feedbackEmoji] || 3;
      const sentiment = emojiToSentiment[feedbackEmoji] || 'neutral';
      
      // User may not be logged in, use anonymous if no user info
      const userData = JSON.parse(localStorage.getItem('user-store') || '{}');
      const userName = userData.name || 'Pengguna';
      const userRole = userData.role || 'Responden Survey';
      
      // Create testimonial messages based on emoji and service
      let testimonialContent = '';
      if (rating >= 4) {
        testimonialContent = `Layanan ${serviceName} sangat membantu. Pengalaman menggunakan layanan ini memuaskan dan akan saya rekomendasikan.`;
      } else if (rating === 3) {
        testimonialContent = `Layanan ${serviceName} cukup baik. Ada beberapa hal yang bisa ditingkatkan tetapi secara keseluruhan memenuhi kebutuhan.`;
      } else {
        testimonialContent = `Layanan ${serviceName} perlu perbaikan. Beberapa masalah yang saya alami menghambat penggunaan layanan ini.`;
      }

      const testimonialData = {
        name: userName,
        role: userRole,
        content: testimonialContent,
        rating: rating,
        sentiment: sentiment,
        serviceId: serviceId || '1',
        serviceName: serviceName,
        timestamp: 'Baru saja'
      };
      
      // Add testimonial to the testimonial system
      const createdTestimonial = await createTestimonial(testimonialData);
      console.log('Testimonial created from feedback:', createdTestimonial);
      
      // Save the created testimonial ID for later navigation
      localStorage.setItem('latest_testimonial_id', createdTestimonial.id);
      
      // Show confetti and set submitted state
      setShowConfetti(true);
      setSubmitted(true);
      
      // Redirect to history page after 3 seconds
      setTimeout(() => {
        console.log('Redirecting to testimonials page');
        navigate('/testimonials');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Terjadi kesalahan saat mengirim feedback. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipFeedback = () => {
    navigate('/beranda');
  };
  
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full space-y-8 rounded-3xl shadow-xl overflow-hidden relative bg-white/90 backdrop-blur-sm"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-100 opacity-20"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-teal-100 opacity-20"></div>
        
        {/* Content */}
        <div className="px-10 pt-14 pb-10 relative z-10">
          {submitted ? (
            <>
              <motion.div
                variants={itemVariants}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center rounded-full text-white mb-8"
              >
                <Check className="w-12 h-12" />
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-center text-3xl font-bold text-gray-800 mb-3"
              >
                Terima Kasih!
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-center text-gray-600 mb-6"
              >
                Ulasan Anda telah ditambahkan ke halaman Testimonial dan akan membantu pengguna lain.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-sm text-gray-500 mb-4">
                  Anda akan dialihkan ke halaman testimonial dalam beberapa saat...
                </p>
                
                <Link
                  to="/testimonials"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Lihat Testimonial
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                variants={itemVariants}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center rounded-full text-white mb-8"
              >
                <Check className="w-12 h-12" />
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-center text-3xl font-bold text-gray-800 mb-2"
              >
                Terima Kasih!
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-center text-gray-600 mb-2"
              >
                Survei Anda telah berhasil disimpan.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm mb-6 flex items-start"
              >
                <Star className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  Bagikan pengalaman Anda dengan layanan ini. Rating Anda akan ditampilkan sebagai testimonial publik di halaman Testimonial untuk membantu pengguna lain.
                </p>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mb-8"
              >
                <p className="text-center font-medium text-gray-700 mb-5">
                  Evaluasi {serviceName}
                </p>
                
                <div className="flex justify-between items-center flex-wrap gap-4 px-4 md:px-8">
                  {emojiOptions.map((option) => (
                    <EmojiFeedback
                      key={option.emoji}
                      selected={feedbackEmoji}
                      onClick={setFeedbackEmoji}
                      emoji={option.emoji}
                      label={option.label}
                      color={option.color}
                    />
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex justify-between gap-4 mt-10"
              >
                <motion.button
                  onClick={handleSkipFeedback}
                  className="px-6 py-3 rounded-xl flex items-center justify-center font-medium shadow-md transition-all border border-gray-200 text-gray-600 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </motion.button>
                
                <motion.button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackEmoji || isSubmitting}
                  className={`px-6 py-3 rounded-xl flex items-center justify-center font-medium shadow-md transition-all ${
                    feedbackEmoji && !isSubmitting 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={feedbackEmoji && !isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={feedbackEmoji && !isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Rating
                    </>
                  )}
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EndingPage; 