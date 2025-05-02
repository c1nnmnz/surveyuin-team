import React from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

const SurveySubmitSection = ({ 
  isSubmitting, 
  success, 
  progressPercentage, 
  onSubmit, 
  onResetProgress 
}) => {
  return (
    <div className="mt-12">
      {/* Reset progress text button (placed above the submit button) */}
      {progressPercentage > 0 && (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={onResetProgress}
            className="text-sm text-red-500 hover:text-red-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            Reset Progres
          </button>
        </div>
      )}
      
      {/* Submit button with enhanced styling */}
      <div className="flex justify-center">
        <motion.button
          type="submit"
          disabled={isSubmitting || success || progressPercentage < 100}
          onClick={onSubmit}
          className={`py-4 px-10 rounded-xl text-white font-semibold shadow-lg flex items-center justify-center transition-all ${
            progressPercentage === 100 
              ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          whileHover={progressPercentage === 100 ? { scale: 1.03, y: -2 } : {}}
          whileTap={progressPercentage === 100 ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Mengirim Respon...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-3" />
              Berhasil Terkirim
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-3" />
              Kirim Survei
            </>
          )}
        </motion.button>
      </div>
      
      {/* Progress indicator */}
      {progressPercentage < 100 && (
        <div className="mt-4 text-center">
          <p className="text-amber-600 text-sm">
            Mohon isi semua pertanyaan sebelum mengirim.
          </p>
        </div>
      )}
      {progressPercentage === 100 && (
        <div className="mt-4 text-center">
          <p className="text-green-600 flex items-center justify-center text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Semua pertanyaan telah dijawab
          </p>
        </div>
      )}
      
      {/* Auto-save indicator */}
      {progressPercentage > 0 && (
        <div className="mt-2 flex items-center justify-center text-xs text-green-600">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Progres tersimpan otomatis
        </div>
      )}
    </div>
  );
};

export default SurveySubmitSection; 