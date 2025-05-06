import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { scrollToQuestion as scrollToQuestionUtil } from '../../utils/scrollUtils';

const QuestionNavigator = ({ 
  showQuestionNav, 
  questionNavRef, 
  corruptionQuestions, 
  serviceQualityQuestions, 
  integrityQuestions, 
  formValues, 
  scrollToQuestion, 
  onClose 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position
  useEffect(() => {
    if (!showQuestionNav) return; // Only track when dialog is open
    
    const handleScroll = () => {
      // Consider scrolled after 100px
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showQuestionNav]);
  
  if (!showQuestionNav) return null;

  // Helper function to determine if a question is answered
  const isQuestionAnswered = (questionId) => {
    return formValues && !!formValues[questionId];
  };

  // Count answered questions per section
  const getAnsweredCount = (questions) => {
    return questions.filter(q => isQuestionAnswered(q.id)).length;
  };
  
  const corruptionAnswered = getAnsweredCount(corruptionQuestions);
  const serviceQualityAnswered = getAnsweredCount(serviceQualityQuestions);
  const integrityAnswered = getAnsweredCount(integrityQuestions);
  const totalAnswered = corruptionAnswered + serviceQualityAnswered + integrityAnswered;
  const totalQuestions = corruptionQuestions.length + serviceQualityQuestions.length + integrityQuestions.length;

  // Style function for navigation buttons - Apple-style with enhanced visual cues
  const getButtonStyle = (questionId) => {
    const isAnswered = isQuestionAnswered(questionId);
    
    return isAnswered
      ? "bg-green-50 text-green-700 border-green-100 shadow-sm hover:bg-green-100 hover:border-green-200"
      : "bg-red-50 text-red-600 border-red-100 shadow-sm hover:bg-red-100 hover:border-red-200";
  };

  // Helper to extract question number from ID
  const getQuestionNumber = (questionId) => {
    // Extract only the numeric part, removing the 'q' prefix
    return questionId.replace(/[^0-9]/g, '');
  };
  
  // Handle question navigation with closing dialog
  const handleQuestionClick = (questionId) => {
    // If using the passed scrollToQuestion function (for backward compatibility)
    if (typeof scrollToQuestion === 'function') {
      scrollToQuestion(questionId);
    } else {
      // Use the utility function directly
      scrollToQuestionUtil(questionId, { margin: 120 });
    }
    
    // Close the dialog
    onClose();
  };

  return (
    <Dialog.Root open={showQuestionNav} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Overlay with higher opacity and stronger blur - Apple style */}
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-xl animate-fade-in z-[999]" />
        
        {/* Content with Apple-inspired design */}
        <Dialog.Content 
          ref={questionNavRef} 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl w-[90%] max-w-md max-h-[85vh] z-[1000] data-[state=open]:animate-scale-in overflow-hidden border border-gray-200/50"
          style={{
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.2), 0 16px 36px -18px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
              <Dialog.Title className="text-base font-medium text-gray-800">
                Navigasi Pertanyaan
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm font-medium rounded-full bg-gray-50 px-2.5 py-1 border border-gray-100 text-gray-600">
                  <span className="text-green-600 font-semibold">{totalAnswered}</span>
                  <span className="text-gray-400 mx-0.5">/</span>
                  <span>{totalQuestions}</span>
                </div>
              <Dialog.Close asChild>
                <button 
                    className="rounded-full h-8 w-8 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors"
                  aria-label="Close"
                >
                    <X size={14} />
                </button>
              </Dialog.Close>
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar space-y-6 bg-white/50" style={{ maxHeight: 'calc(85vh - 9rem)' }}>
              {/* Persepsi Korupsi section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">
                  Persepsi Korupsi
                </h3>
                  <div className="text-xs font-medium text-gray-500">
                    {corruptionAnswered}/{corruptionQuestions.length} dijawab
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {corruptionQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question.id)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 border ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Kualitas Layanan section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">
                  Kualitas Layanan
                </h3>
                  <div className="text-xs font-medium text-gray-500">
                    {serviceQualityAnswered}/{serviceQualityQuestions.length} dijawab
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {serviceQualityQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question.id)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 border ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Integritas Survei section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider">
                  Integritas Survei
                </h3>
                  <div className="text-xs font-medium text-gray-500">
                    {integrityAnswered}/{integrityQuestions.length} dijawab
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {integrityQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionClick(question.id)}
                      className={`py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 border ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-5 py-4 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between sticky bottom-0 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs text-gray-700 font-medium">Dijawab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs text-gray-700 font-medium">Belum Dijawab</span>
                </div>
              </div>
              
              <div className="text-xs font-medium rounded-full bg-gray-100/80 backdrop-blur-sm px-3 py-1.5 text-gray-700 border border-gray-200/50">
                {Math.round((totalAnswered / totalQuestions) * 100)}% selesai
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default QuestionNavigator;

// Add this to your global CSS or import it where needed
/* 
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.25);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.2s cubic-bezier(0.2, 0.95, 0.35, 1);
}

.animate-fade-in {
  animation: fade-in 0.18s cubic-bezier(0.2, 0.95, 0.35, 1);
}
*/ 