import React from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

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
  if (!showQuestionNav) return null;

  // Helper function to determine if a question is answered
  const isQuestionAnswered = (questionId) => {
    return formValues && !!formValues[questionId];
  };

  // Style function for navigation buttons - Apple-style
  const getButtonStyle = (questionId) => {
    const isAnswered = isQuestionAnswered(questionId);
    
    return isAnswered
      ? "bg-green-50 text-green-700 shadow-sm border-transparent"
      : "bg-red-50 text-red-600 shadow-sm border-transparent";
  };

  // Helper to extract question number from ID
  const getQuestionNumber = (questionId) => {
    // Extract only the numeric part, removing the 'q' prefix
    return questionId.replace(/[^0-9]/g, '');
  };

  return (
    <Dialog.Root open={showQuestionNav} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Higher opacity overlay with stronger blur */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-lg animate-fade-in z-[999]" />
        
        {/* Content with even higher z-index */}
        <Dialog.Content 
          ref={questionNavRef} 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[85%] max-w-sm max-h-[75vh] overflow-hidden z-[1000] data-[state=open]:animate-scale-in isolate"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Add a pseudo-element for additional background protection */}
          <div className="absolute inset-0 -z-10 bg-white rounded-2xl"></div>
          
          <div className="flex flex-col h-full border border-gray-200 relative z-10">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5 bg-white">
              <Dialog.Title className="text-base font-semibold text-gray-800">
                Navigasi Pertanyaan
              </Dialog.Title>
              <Dialog.Close asChild>
                <button 
                  className="rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/70 focus:outline-none"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar space-y-5 bg-white">
              {/* Persepsi Korupsi section */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-0.5">
                  Persepsi Korupsi
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {corruptionQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => scrollToQuestion(question.id)}
                      className={`py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Kualitas Layanan section */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-0.5">
                  Kualitas Layanan
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {serviceQualityQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => scrollToQuestion(question.id)}
                      className={`py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Integritas Survei section */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase text-gray-500 font-medium tracking-wider px-0.5">
                  Integritas Survei
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {integrityQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => scrollToQuestion(question.id)}
                      className={`py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none active:scale-95 ${getButtonStyle(question.id)}`}
                    >
                      {getQuestionNumber(question.id)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm"></div>
                  <span className="text-xs text-gray-600">Dijawab</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm"></div>
                  <span className="text-xs text-gray-600">Belum Dijawab</span>
                </div>
              </div>
              
              <span className="text-xs text-gray-500">
                {Object.keys(formValues || {}).length}/{corruptionQuestions.length + serviceQualityQuestions.length + integrityQuestions.length} pertanyaan dijawab
              </span>
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
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(180, 180, 180, 0.6);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(150, 150, 150, 0.8);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: translate(-50%, -45%) scale(0.95);
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
  animation: scale-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-in {
  animation: fade-in 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
*/ 