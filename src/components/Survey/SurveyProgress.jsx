import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';

const SurveyProgress = ({ progressPercentage, answeredCount, totalQuestions, onToggleQuestionNav }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* The main progress pill that is always visible */}
        <motion.div 
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-full 
            py-2 px-3.5
            flex flex-row items-center gap-2
            border border-gray-100 cursor-pointer"
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={onToggleQuestionNav}
        >
          {/* Compact layout for all screen sizes */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-xs font-medium text-white shadow-sm">
              {answeredCount}
            </div>
            <span className="text-gray-600 text-xs font-medium">/ {totalQuestions}</span>
          </div>
          
          {/* Progress percentage */}
          <span className="text-teal-500 font-semibold text-xs">
            {Math.round(progressPercentage)}%
          </span>
          
          {/* Progress bar */}
          <div className="w-12 h-2 bg-gray-100/70 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage || 0}%` }}
              className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            />
          </div>
          
          {/* Navigator icon */}
          <ClipboardCheck className="h-4 w-4 text-gray-500" />
        </motion.div>
      </div>
      
      {/* CSS for question highlighting */}
      <style jsx="true">{`
        .highlight-question {
          animation: pulse-border 0.8s ease-in-out;
        }
        
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.2); }
          50% { box-shadow: 0 0 0 4px rgba(56, 189, 248, 0); }
        }
      `}</style>
    </div>
  );
};

export default SurveyProgress; 