import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/userStore';
import { useDirectoryStore } from '../store/directoryStore';
import { useSurveyStore } from '../store/surveyStore';
import { surveyQuestions } from '../components/SurveyQuestion';

// Import modular components
import SurveyHeader from '../components/Survey/SurveyHeader';
import SurveyProgress from '../components/Survey/SurveyProgress';
import QuestionNavigator from '../components/Survey/QuestionNavigator';
import DuplicateWarning from '../components/Survey/DuplicateWarning';
import SurveySubmitSection from '../components/Survey/SurveySubmitSection';

// Lazy-load the survey question list component
const SurveyQuestionList = React.lazy(() => import('../components/SurveyQuestion').then(module => ({
  default: module.SurveyQuestionList
})));

const SurveyPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  
  // States
  const [currentServiceData, setCurrentServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [previousResponse, setPreviousResponse] = useState(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  
  // Progress tracking
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  
  // For question navigation popup
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const questionNavRef = useRef(null);
  
  // Get data from stores
  const { isAuthenticated, user } = useUserStore();
  const { getServiceById } = useDirectoryStore();
  const { saveResponse, markServiceAsCompleted, isServiceCompleted, getResponsesForService } = useSurveyStore();
  
  // Get form values to track changes
  const formValues = watch();
  
  // Group questions by category for section navigation 
  const corruptionQuestions = surveyQuestions.filter(q => q.category === 'corruption_perception');
  const serviceQualityQuestions = surveyQuestions.filter(q => q.category === 'service_quality');
  const integrityQuestions = surveyQuestions.filter(q => q.category === 'survey_integrity');
  
  // Load saved answers on initial load
  useEffect(() => {
    const loadSavedAnswers = () => {
      try {
        // Load from localStorage using serviceId as part of the key
        const savedProgress = localStorage.getItem(`survey_progress_${serviceId}`);
        
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          
          // Set each value in the form
          Object.entries(parsedProgress).forEach(([questionId, value]) => {
            setValue(questionId, value);
          });
          
          console.log('Loaded saved progress from localStorage');
        }
      } catch (err) {
        console.error('Error loading saved progress:', err);
      }
    };
    
    // Only try to load saved answers after the component has fully initialized
    if (!loading && isAuthenticated) {
      loadSavedAnswers();
    }
  }, [loading, isAuthenticated, serviceId, setValue]);
  
  // Save answers to localStorage whenever formValues change
  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0 && isAuthenticated) {
      try {
        localStorage.setItem(`survey_progress_${serviceId}`, JSON.stringify(formValues));
      } catch (err) {
        console.error('Error saving progress to localStorage:', err);
      }
    }
  }, [formValues, serviceId, isAuthenticated]);
  
  // Calculate progress based on answered questions
  useEffect(() => {
    const totalQuestions = surveyQuestions.length;
    let answered = 0;
    
    surveyQuestions.forEach(question => {
      if (formValues && formValues[question.id]) {
        answered++;
      }
    });
    
    setAnsweredCount(answered);
    setProgressPercentage((answered / totalQuestions) * 100);
  }, [formValues]);
  
  // Handle selecting an option
  const handleSelectOption = (questionId, optionValue) => {
    setValue(questionId, optionValue);
  };
  
  // Handle click outside to close question navigator
  useEffect(() => {
    function handleClickOutside(event) {
      if (questionNavRef.current && !questionNavRef.current.contains(event.target)) {
        setShowQuestionNav(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [questionNavRef]);
  
  // Handle navigation to a specific question
  const scrollToQuestion = (questionId) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      // Scroll to the question with a small offset from the top
      window.scrollTo({
        top: questionElement.offsetTop - 120,
        behavior: 'smooth'
      });
      
      // Add a temporary highlight
      questionElement.classList.add('highlight-question');
      setTimeout(() => {
        questionElement.classList.remove('highlight-question');
      }, 1500);
      
      // Close the question navigator
      setShowQuestionNav(false);
    }
  };
  
  // Check if user is logged in and already completed this survey
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/survey/${serviceId}` } });
      return;
    }
    
    // Check if the user has already completed this survey
    const hasCompleted = isServiceCompleted(serviceId);
    
    if (hasCompleted) {
      // Get previous responses for this service
      const previousResponses = getResponsesForService(serviceId);
      const latestResponse = previousResponses.length > 0 ? 
        previousResponses[previousResponses.length - 1] : null;
      
      setIsDuplicate(true);
      setPreviousResponse(latestResponse);
      setShowDuplicateWarning(true);
    }
  }, [isAuthenticated, navigate, serviceId, isServiceCompleted, getResponsesForService]);
  
  // Get service data
  useEffect(() => {
    setLoading(true);
    try {
      // Parse serviceId as a number if possible
      const parsedServiceId = parseInt(serviceId, 10);
      const service = getServiceById(isNaN(parsedServiceId) ? serviceId : parsedServiceId);
      
      if (service) {
        setCurrentServiceData(service);
        setLoading(false);
      } else {
        // If service not found, use a fallback service
        console.warn(`Service with ID ${serviceId} not found, using fallback`);
        setCurrentServiceData({
          id: serviceId,
          name: 'Layanan Kampus',
          description: 'Deskripsi layanan kampus',
        });
        setLoading(false);
      }
    } catch (e) {
      console.error('Error loading service:', e);
      setError('Gagal memuat data layanan');
      setLoading(false);
    }
  }, [serviceId, getServiceById]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      // Calculate scores for different categories
      let corruptionScore = 0;
      let serviceQualityScore = 0;
      let surveyIntegrityScore = 0;
      
      // Track if all answers have max score in each category
      let allCorruptionMax = corruptionQuestions.length > 0;
      let allServiceQualityMax = serviceQualityQuestions.length > 0;
      let allIntegrityMax = integrityQuestions.length > 0;
      
      // Calculate scores for corruption perception questions
      corruptionQuestions.forEach(question => {
        const answer = parseInt(data[question.id]);
        corruptionScore += answer;
        
        // Check if this answer is less than max
        if (answer < 5) {
          allCorruptionMax = false;
        }
      });
      
      // Calculate scores for service quality questions
      serviceQualityQuestions.forEach(question => {
        const answer = parseInt(data[question.id]);
        serviceQualityScore += answer;
        
        // Check if this answer is less than max
        if (answer < 5) {
          allServiceQualityMax = false;
        }
      });
      
      // Calculate scores for survey integrity questions
      integrityQuestions.forEach(question => {
        const answer = parseInt(data[question.id]);
        surveyIntegrityScore += answer;
        
        // Check if this answer is less than max
        if (answer < 5) {
          allIntegrityMax = false;
        }
      });
      
      // Normalize scores to a 0-100 scale
      const normalizeScore = (score, questions) => {
        if (questions.length === 0) return 0;
        const maxPossible = questions.length * 5; // Assuming max score per question is 5
        return Math.round((score / maxPossible) * 100);
      };
      
      const normalizedCorruptionScore = normalizeScore(corruptionScore, corruptionQuestions);
      const normalizedServiceQualityScore = normalizeScore(serviceQualityScore, serviceQualityQuestions);
      const normalizedIntegrityScore = normalizeScore(surveyIntegrityScore, integrityQuestions);
      
      // Calculate overall score as weighted average
      const overallScore = Math.round(
        (normalizedCorruptionScore * 0.4) + 
        (normalizedServiceQualityScore * 0.4) + 
        (normalizedIntegrityScore * 0.2)
      );
      
      // Determine if this is a 5-star rating (all max scores)
      const isFiveStarRating = allCorruptionMax && allServiceQualityMax && allIntegrityMax;
      
      // Prepare the response data
      const responseData = {
        userId: user?.id || 'anonymous',
        serviceId: serviceId,
        serviceName: currentServiceData?.name || `Layanan ${serviceId}`,
        completedAt: new Date().toISOString(),
        // Convert raw form data to answers array
        answers: Object.entries(data).map(([questionId, answer]) => ({
          questionId,
          answer: answer,
        })),
        scores: {
          corruptionPerception: normalizedCorruptionScore,
          serviceQuality: normalizedServiceQualityScore,
          surveyIntegrity: normalizedIntegrityScore,
          overall: overallScore
        }
      };
      
      console.log('Saving survey response:', responseData);
      
      // Save the response
      const responseId = saveResponse(responseData);
      
      // Mark this service as completed by the user
      markServiceAsCompleted(serviceId);
      
      // Clear the localStorage progress for this survey
      localStorage.removeItem(`survey_progress_${serviceId}`);
      
      // Show success message
      setSuccess(true);
      
      // Wait before redirecting to the ending page
      setTimeout(() => {
        navigate(`/ending/${serviceId}`);
      }, 1500);
    } catch (e) {
      console.error('Error submitting survey:', e);
      setError('Gagal mengirim survei');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle going back
  const handleBack = () => {
    navigate(`/service/${serviceId}`);
  };
  
  // Handle resetting progress
  const handleResetProgress = () => {
    // Reset all form values
    surveyQuestions.forEach(question => {
      setValue(question.id, null);
    });
    
    // Clear localStorage
    localStorage.removeItem(`survey_progress_${serviceId}`);
    
    // Reset progress
    setProgressPercentage(0);
    setAnsweredCount(0);
  };
  
  // Handle dismissing the duplicate warning
  const handleDismissDuplicateWarning = () => {
    // Reset all form values before continuing
    handleResetProgress();
    
    // Hide the warning
    setShowDuplicateWarning(false);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  // Show duplicate warning if applicable
  if (isDuplicate && showDuplicateWarning) {
    return (
      <DuplicateWarning 
        previousResponse={previousResponse}
        serviceId={serviceId}
        onContinue={handleDismissDuplicateWarning}
        onBack={handleBack}
      />
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <SurveyHeader 
        serviceData={currentServiceData} 
        onBack={handleBack} 
      />
      
      {/* Progress Bar */}
      <SurveyProgress 
        progressPercentage={progressPercentage} 
        answeredCount={answeredCount} 
        totalQuestions={surveyQuestions.length} 
        onToggleQuestionNav={() => setShowQuestionNav(true)} 
      />
      
      {/* Question Navigator */}
      <QuestionNavigator 
        showQuestionNav={showQuestionNav} 
        questionNavRef={questionNavRef}
        corruptionQuestions={corruptionQuestions}
        serviceQualityQuestions={serviceQualityQuestions}
        integrityQuestions={integrityQuestions}
        formValues={formValues}
        scrollToQuestion={scrollToQuestion}
        onClose={() => setShowQuestionNav(false)}
      />
      
      {/* Main Survey Form */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              >
                <p className="text-green-700">
                  Survei berhasil dikirim! Terima kasih atas partisipasi Anda.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Survey Questions */}
          <React.Suspense 
            fallback={
              <div className="animate-pulse p-8 bg-gray-100 rounded-lg my-4 h-64 flex items-center justify-center">
                <p className="text-gray-500">Memuat pertanyaan survei...</p>
              </div>
            }
          >
            <SurveyQuestionList 
              watchedValues={(id) => formValues && formValues[id]}
              onSelectOption={handleSelectOption}
              register={register}
              errors={errors}
            />
          </React.Suspense>
          
          {/* Submit Section */}
          <SurveySubmitSection 
            isSubmitting={submitting}
            success={success}
            progressPercentage={progressPercentage}
            onSubmit={handleSubmit(onSubmit)}
            onResetProgress={handleResetProgress}
          />
        </form>
      </div>
    </div>
  );
};

export default SurveyPage; 