import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
// Replace MUI icons with Lucide icons
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  BarChart, 
  User, 
  RefreshCcw 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSurveyStore } from "@/store/surveyStore";
import { useUserStore } from "@/store/userStore";
import { useDirectoryStore } from "@/store/directoryStore";

const DuplicateWarning = ({ previousResponse, serviceId, onContinue, onBack }) => {
  const { allResponses, getResponsesForService } = useSurveyStore();
  const { user } = useUserStore();
  const { getServiceById } = useDirectoryStore();
  const [serviceHistory, setServiceHistory] = useState(null);
  const [serviceName, setServiceName] = useState('');

  // Get service name
  useEffect(() => {
    if (serviceId) {
      const service = getServiceById(serviceId);
      setServiceName(service?.name || `Layanan ${serviceId}`);
    }
  }, [serviceId, getServiceById]);

  // Find the most recent response for this service
  useEffect(() => {
    const findServiceHistory = () => {
      try {
        // First try using direct service responses if available
        if (previousResponse && Object.keys(previousResponse).length > 0) {
          setServiceHistory(previousResponse);
          return;
        }

        // Otherwise, search through all responses
        if (serviceId) {
          let serviceResponses = typeof getResponsesForService === 'function' 
            ? getResponsesForService(serviceId)
            : allResponses.filter(r => r.serviceId === serviceId && (!user?.id || r.userId === user.id));
          
          // Sort by date, newest first
          if (serviceResponses.length > 0) {
            const sortedResponses = [...serviceResponses].sort((a, b) => {
              const dateA = new Date(a.completedAt || a.timestamp || a.createdAt || 0);
              const dateB = new Date(b.completedAt || b.timestamp || b.createdAt || 0);
              return dateB - dateA;
            });
            
            setServiceHistory(sortedResponses[0]);
          }
        }
      } catch (error) {
        console.error("Error finding service history:", error);
      }
    };
    
    findServiceHistory();
  }, [previousResponse, serviceId, allResponses, getResponsesForService, user]);

  // Get response data from either provided previousResponse or found serviceHistory
  const responseData = serviceHistory || previousResponse || {};
  
  // Format date and time
  const formattedDate = responseData?.completedAt 
    ? format(new Date(responseData.completedAt), 'dd MMMM yyyy', { locale: id })
    : responseData?.createdAt 
      ? format(new Date(responseData.createdAt), 'dd MMMM yyyy', { locale: id })
      : responseData?.timestamp 
        ? format(new Date(responseData.timestamp), 'dd MMMM yyyy', { locale: id })
        : responseData?.date
          ? format(new Date(responseData.date), 'dd MMMM yyyy', { locale: id })
          : '';
  
  const formattedTime = responseData?.completedAt 
    ? format(new Date(responseData.completedAt), 'HH:mm', { locale: id })
    : responseData?.createdAt 
      ? format(new Date(responseData.createdAt), 'HH:mm', { locale: id })
      : responseData?.timestamp
        ? format(new Date(responseData.timestamp), 'HH:mm', { locale: id })
        : responseData?.time || '';

  // Get response ID and score
  const responseId = responseData?.id || responseData?.responseId || '';
  const overallScore = responseData?.scores?.overall || responseData?.score || 0;
  
  // Check if we have valid data to show
  const hasValidData = responseData && Object.keys(responseData).length > 0;

  // Time passed since submission (simplified)
  const getTimePassed = () => {
    if (!responseData.completedAt && !responseData.createdAt && !responseData.timestamp) return '';
    
    const submissionDate = new Date(responseData.completedAt || responseData.createdAt || responseData.timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'hari ini';
    if (diffInDays === 1) return 'kemarin';
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
  };
  
  const timePassed = getTimePassed();

  // Handle reset and continue
  const handleResetAndContinue = () => {
    try {
      // Clear any saved progress from localStorage
      localStorage.removeItem(`survey_progress_${serviceId}`);
      
      // Also check for any variations that might exist
      if (typeof serviceId === 'string' || typeof serviceId === 'number') {
        localStorage.removeItem(`survey_${serviceId}`);
        localStorage.removeItem(`survey-progress-${serviceId}`);
      }
      
      // Add a console log to confirm reset
      console.log(`Reset survey progress for service ${serviceId}`);
    } catch (error) {
      console.error("Error resetting survey progress:", error);
    }
    
    // Call the onContinue callback
    onContinue();
  };

  return (
    <div className="container mx-auto px-3 py-6 max-w-md md:max-w-xl lg:max-w-2xl mt-12 md:mt-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 5, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border border-gray-100 shadow-xl overflow-hidden bg-white">
          <CardHeader className="pb-2 pt-4 px-3 md:px-6 md:pt-6 md:pb-3 relative text-center">
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-teal-50 text-teal-600 hover:bg-teal-100 border-none">
                <CheckCircle className="h-3.5 w-3.5 mr-1 text-teal-600" />
                Sudah Terisi
              </Badge>
              
              {timePassed && (
                <Badge variant="outline" className="font-normal text-xs bg-gray-50 border-gray-200 text-gray-500">
                  {timePassed}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-lg md:text-2xl font-bold text-gray-800 mt-1">
              Anda telah mengisi survei ini
            </CardTitle>
            
            {serviceName && (
              <CardDescription className="text-gray-500 mt-1 md:mt-2 text-sm">
                <span className="font-medium text-teal-600">{serviceName}</span>
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="pb-2 px-3 md:px-6 text-center">
            {hasValidData && (
              <div className=" p-3 md:p-4 mb-3 ">
                <div className="flex items-center flex-wrap justify-center gap-1 md:gap-3">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs md:text-sm font-medium bg-teal-50 text-teal-700 border border-teal-100">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-teal-600" />
                    {formattedDate}
                  </div>
                  
                  {formattedTime && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs md:text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">
                      <Clock className="h-3.5 w-3.5 mr-1 text-sky-600" />
                      {formattedTime}
                    </div>
                  )}
                  
                  {user?.name && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs md:text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <User className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                      {user.name}
                    </div>
                  )}
                </div>
                
                {overallScore > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex justify-center">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs md:text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <BarChart className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      Skor: <span className="font-medium ml-1">{Math.round(overallScore)}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-xs md:text-sm text-gray-500 mb-3">
              Setiap pengisian baru akan disimpan sebagai tanggapan terpisah tanpa menimpa data Anda sebelumnya.
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center px-3 md:px-6 pt-0 pb-4 md:pb-5 gap-1 md:gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 md:max-w-[150px] md:h-10 bg-white border-gray-200 text-xs md:text-sm py-1.5"
              onClick={onBack}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Kembali
            </Button>
            
            {hasValidData && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 md:max-w-[150px] md:h-10 bg-white border-gray-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-xs md:text-sm py-1.5"
                onClick={() => window.open(`/history/${serviceId || responseData.serviceId}`, '_blank')}
              >
                <BarChart className="h-3.5 w-3.5 mr-1" />
                Lihat
              </Button>
            )}
            
            <Button 
              size="sm"
              className="flex-1 md:max-w-[150px] md:h-10 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white text-xs md:text-sm py-1.5"
              onClick={handleResetAndContinue}
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Isi Ulang
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DuplicateWarning; 