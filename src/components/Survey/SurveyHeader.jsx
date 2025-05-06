import React from 'react';
import { ArrowLeft, Info, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SurveyHeader = ({ serviceData, onBack }) => {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 pt-4">
        
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Back to service details"
          >

          </button>
        </div>
        
        <div className="mt-8 mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
            SURVEI PERSEPSI KORUPSI
          </h1>
          
          <p className="text-gray-600 text-lg">
            {serviceData?.name || 'Layanan'}
          </p>
          
          <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
            <Info className="w-4 h-4 mr-2" />
            <p>Jawab semua pertanyaan untuk menyelesaikan survei</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 max-w-5xl mx-auto">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p>
                Survei ini bertujuan untuk mengevaluasi kualitas layanan dan persepsi korupsi.
                Jawaban Anda akan sangat membantu kami meningkatkan kualitas layanan.
                Semua jawaban dijamin kerahasiaannya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyHeader; 