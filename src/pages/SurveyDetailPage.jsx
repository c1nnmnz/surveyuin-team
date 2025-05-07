import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, BarChart2, Home, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useSurveyStore } from '../store/surveyStore';
import { useUserStore } from '../store/userStore';
import { useDirectoryStore } from '../store/directoryStore';
import { surveyQuestions } from '../components/SurveyQuestion';
import { formatDate } from '@/utils/dateUtils';
import { getScoreColorClass, getScoreInterpretation } from '@/utils/scoreUtils';
import Breadcrumb from '../components/ui/breadcrumb';
import LoadingEffect from '../components/ui/LoadingEffect';
import { FileText, ClipboardCheck } from 'lucide-react';

const SurveyDetailPage = () => {
  const { responseId } = useParams(); // We're using the route param as responseId
  const navigate = useNavigate();
  const { allResponses, getResponsesForService, isServiceCompleted } = useSurveyStore();
  const { user } = useUserStore();
  const { getServiceById } = useDirectoryStore();
  const [surveyResponse, setSurveyResponse] = useState(null);
  const [surveyDetails, setSurveyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedScores, setCalculatedScores] = useState({
    overall: 0,
    corruptionPerception: 0,
    serviceQuality: 0,
    surveyIntegrity: 0,
    dimensions: {}
  });
  const [expandedSections, setExpandedSections] = useState({
    responses: true, // Default to open
    summary: true,   // Default to open
    detailedScores: false // Default to closed
  });

  useEffect(() => {
    // Find the response for this service ID
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching survey detail for responseId:", responseId);
        console.log("All responses available:", allResponses);
        
        // Get service data from directory
        const serviceData = getServiceById(responseId);
        console.log("Service data from directory:", serviceData);
        
        // Get all responses for this service
        let serviceResponses = [];
        
        // First try using the getResponsesForService function
        if (typeof getResponsesForService === 'function') {
          serviceResponses = getResponsesForService(responseId);
          console.log("Responses from getResponsesForService:", serviceResponses);
        }
        
        // Fallback to filtering allResponses manually if needed
        if (!serviceResponses || serviceResponses.length === 0) {
          serviceResponses = allResponses.filter(r => r.serviceId === responseId);
          console.log("Responses from manual filtering:", serviceResponses);
        }
        
        // Group the survey questions by category
        const questionsByCategory = {
          'corruption_perception': surveyQuestions.filter(q => q.category === 'corruption_perception'),
          'service_quality': surveyQuestions.filter(q => q.category === 'service_quality'),
          'survey_integrity': surveyQuestions.filter(q => q.category === 'survey_integrity')
        };
        
        // Flatten all questions into a single array
        const allQuestions = [
          ...questionsByCategory.corruption_perception,
          ...questionsByCategory.service_quality,
          ...questionsByCategory.survey_integrity
        ];
        
        // Get service name regardless of response existence
        const serviceName = serviceData ? serviceData.name : `Survei Layanan ${responseId}`;
        
        if (serviceResponses.length > 0) {
          // Use the most recent response
          const latestResponse = serviceResponses[serviceResponses.length - 1];
          console.log("Found latest response:", latestResponse);
          
          // Ensure the response has an answers array
          if (!latestResponse.answers || !Array.isArray(latestResponse.answers)) {
            latestResponse.answers = [];
            console.warn("Response has no answers array or it's not an array, creating empty one");
          }
          
          setSurveyResponse(latestResponse);
          
          setSurveyDetails({
            id: responseId,
            title: serviceName, 
            description: serviceData?.description || 'Detail survei yang telah Anda isi untuk layanan ini.',
            questions: allQuestions,
            questionsByCategory
          });
          
          // Calculate detailed scores
          calculateDetailedScores(latestResponse, questionsByCategory);
        } else {
          // If response not found, check if user completed this service
          const isCompleted = isServiceCompleted(responseId);
          console.log("Service completion status:", { isCompleted, responseId });
          
          // Create skeleton data for display even if no response found
          setSurveyDetails({
            id: responseId,
            title: serviceName, 
            description: isCompleted 
              ? 'Detail respons survei tidak tersedia tetapi layanan telah diselesaikan.' 
              : 'Detail survei tidak ditemukan.',
            questions: allQuestions,
            questionsByCategory
          });
          
          if (!isCompleted) {
            console.log("Survey not found and not marked as completed");
          } else {
            console.log("Service marked as completed but no response data found");
          }
        }
      } catch (error) {
        console.error("Error fetching survey details:", error);
        // Set minimal survey details even on error
        setSurveyDetails({
          id: responseId,
          title: 'Survei Layanan', 
          description: 'Terjadi kesalahan saat memuat detail survei.',
          questions: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [responseId, allResponses, navigate, isServiceCompleted, getResponsesForService, getServiceById]);

  // Calculate detailed scores for all categories and dimensions
  const calculateDetailedScores = (response, questionsByCategory) => {
    if (!response || !response.answers || !questionsByCategory) {
      console.warn("Cannot calculate scores: missing response data or questions", {
        hasResponse: !!response,
        hasAnswers: response && !!response.answers,
        hasQuestionsByCategory: !!questionsByCategory
      });
      return;
    }
    
    // Ensure answers is an array
    const answers = Array.isArray(response.answers) ? response.answers : [];
    console.log("Calculating scores for answers:", answers);
    
    // Calculate scores for each category
    const cpQuestions = questionsByCategory.corruption_perception || [];
    const sqQuestions = questionsByCategory.service_quality || [];
    const siQuestions = questionsByCategory.survey_integrity || [];
    
    // For corruption perception, higher values (6) are better - no inversion needed
    const cpScore = calculateCategoryScore(answers, cpQuestions);
    
    // For service quality, higher values (6) are better - no inversion needed
    const sqScore = calculateCategoryScore(answers, sqQuestions);
    
    // For survey integrity, higher values (6) are better - no inversion needed
    const siScore = calculateCategoryScore(answers, siQuestions);
    
    console.log("Category scores:", { cpScore, sqScore, siScore });
    
    // Calculate dimension scores for service quality
    const dimensions = {};
    const dimensionTypes = [...new Set(sqQuestions.map(q => q.dimension).filter(Boolean))];
    
    dimensionTypes.forEach(dimension => {
      const dimensionQuestions = sqQuestions.filter(q => q.dimension === dimension);
      dimensions[dimension] = calculateCategoryScore(answers, dimensionQuestions);
    });
    
    // Special case (1): if all individual category scores are 100%, overall should be 100%
    // This is a definitive check that overrides any calculation
    if (
      (cpQuestions.length > 0 && Math.round(cpScore) === 100) && 
      (sqQuestions.length > 0 && Math.round(sqScore) === 100) &&
      (siQuestions.length === 0 || Math.round(siScore) === 100)
    ) {
      setCalculatedScores({
        overall: 100,
        corruptionPerception: cpScore,
        serviceQuality: sqScore,
        surveyIntegrity: siScore,
        dimensions
      });
      return;
    }
    
    // Calculate total questions count for each answered category
    const answeredCpQuestions = cpQuestions.filter(q => 
      q.id !== 'q34' && answers.some(a => a.questionId === q.id && a.answer)
    );
    
    const answeredSqQuestions = sqQuestions.filter(q => 
      q.id !== 'q34' && answers.some(a => a.questionId === q.id && a.answer)
    );
    
    const answeredSiQuestions = siQuestions.filter(q => 
      q.id !== 'q34' && answers.some(a => a.questionId === q.id && a.answer)
    );
    
    // Calculate weight based on the number of actually answered questions
    const totalAnsweredQuestions = 
      answeredCpQuestions.length + 
      answeredSqQuestions.length + 
      answeredSiQuestions.length;
    
    // Avoid division by zero
    if (totalAnsweredQuestions === 0) {
      console.warn("No answered questions found in any category");
      setCalculatedScores({
        overall: 0,
        corruptionPerception: 0,
        serviceQuality: 0,
        surveyIntegrity: 0,
        dimensions
      });
      return;
    }
    
    // Calculate precise weights
    const cpWeight = answeredCpQuestions.length / totalAnsweredQuestions;
    const sqWeight = answeredSqQuestions.length / totalAnsweredQuestions;
    const siWeight = answeredSiQuestions.length / totalAnsweredQuestions;
    
    // Calculate weighted overall score with precise math
    let overallScore = 0;
    
    if (answeredCpQuestions.length > 0) {
      overallScore += cpScore * cpWeight;
    }
    
    if (answeredSqQuestions.length > 0) {
      overallScore += sqScore * sqWeight;
    }
    
    if (answeredSiQuestions.length > 0) {
      overallScore += siScore * siWeight;
    }
    
    // Special case (2): Check for high scores in all categories
    // This handles cases where the weighted calculation might result in values like 99.8%
    const allScoresVeryHigh = 
      (answeredCpQuestions.length === 0 || cpScore >= 99) &&
      (answeredSqQuestions.length === 0 || sqScore >= 99) &&
      (answeredSiQuestions.length === 0 || siScore >= 99);
    
    // If all scores are very high and overall is close to 100, round up to 100
    if (allScoresVeryHigh && overallScore > 99) {
      overallScore = 100;
    }
    
    // Round to 2 decimal places to avoid floating-point display issues
    overallScore = Math.round(overallScore * 100) / 100;
    
    // Special case (3): Final validation to ensure consistency
    // If all categories are 100% (or very close) but overall isn't exactly 100%
    if (
      ((answeredCpQuestions.length === 0 || cpScore > 99.5) &&
       (answeredSqQuestions.length === 0 || sqScore > 99.5) &&
       (answeredSiQuestions.length === 0 || siScore > 99.5)) &&
      overallScore > 99.5
    ) {
      overallScore = 100;
    }
    
    // Final check to ensure consistency - if all component scores are 100%, overall should be 100%
    if (Math.round(cpScore) === 100 && Math.round(sqScore) === 100 && 
       (answeredSiQuestions.length === 0 || Math.round(siScore) === 100)) {
      overallScore = 100;
    }
    
    console.log("Final calculated scores:", {
      overall: overallScore,
      corruptionPerception: cpScore,
      serviceQuality: sqScore,
      surveyIntegrity: siScore,
      dimensions
    });
    
    setCalculatedScores({
      overall: overallScore,
      corruptionPerception: cpScore,
      serviceQuality: sqScore,
      surveyIntegrity: siScore,
      dimensions
    });
  };
  
  // Calculate score for a category (0-100 scale)
  const calculateCategoryScore = (answers, questions) => {
    if (!questions.length) return 0;
    
    // Ensure answers is an array
    const answersArray = Array.isArray(answers) ? answers : [];
    
    // Get answered questions, excluding those with score 0 (like question 34)
    const answeredQuestions = questions.filter(q => 
      answersArray.some(a => {
        // Find the answer for this question
        if (a.questionId === q.id && a.answer) {
          // Check if this is question 34 or any question with score 0
          if (q.id === 'q34') return false;
          
          // For other questions with options, check if the selected option has score 0
          if (q.options) {
            const selectedOption = q.options.find(opt => opt.value === a.answer || opt.label === a.answer);
            if (selectedOption && selectedOption.score === 0) return false;
          }
          
          return true;
        }
        return false;
      })
    );
    
    if (!answeredQuestions.length) return 0;
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    let allMaxScore = true;  // Track if all answers have max score
    
    // For each answered question, find its answer and score
    answeredQuestions.forEach(question => {
      const answer = answersArray.find(a => a.questionId === question.id);
      if (!answer) return;
      
      // Get the score value from the question options
      const answerValue = parseInt(answer.answer);
      if (isNaN(answerValue)) return;
      
      // The max score for a question is 6 (assuming 1-6 scale)
      const maxScore = 6;
      
      // Check if this answer is less than max score
      if (answerValue < maxScore) {
        allMaxScore = false;
      }
      
      totalScore += answerValue;
      maxPossibleScore += maxScore;
    });
    
    // If all answers have maximum score, return exactly 100%
    if (allMaxScore && maxPossibleScore > 0) {
      return 100;
    }
    
    // Convert to percentage (0-100) with proper rounding to 2 decimal places
    const score = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    
    // Handle floating-point errors by rounding to 2 decimal places
    return Math.round(score * 100) / 100;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getLabelForValue = (question, value) => {
    if (!question.options) return value;
    const option = question.options.find(opt => opt.value === value || opt.label === value);
    return option ? option.label : value;
  };

  // Get interpretation text based on score
  const getScoreInterpretation = (score) => {
    if (score >= 80) return 'Sangat Baik';
    if (score >= 60) return 'Baik';
    if (score >= 40) return 'Cukup';
    return 'Perlu Ditingkatkan';
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingEffect variant="shimmer" size="lg" text="Memuat detail survei..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
      {/* Modern Apple-inspired Breadcrumb */}
      <Breadcrumb
        items={[
          { path: '/history', label: 'Riwayat Survei', icon: <FileText className="h-4 w-4" /> },
          { path: `/history/${responseId}`, label: surveyDetails?.title || 'Detail Survei', icon: <ClipboardCheck className="h-4 w-4" />, current: true }
        ]}
      />
      
      {surveyDetails ? (
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-display font-bold text-secondary-900 mb-2">{surveyDetails.title}</h1>
            <p className="text-secondary-600 mb-4">{surveyDetails.description}</p>
            
            {surveyResponse && (
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-4">
                <div className="flex items-center text-secondary-600">
                  <Clock size={18} className="mr-2" />
                  <span>Diisi pada: {formatDate(surveyResponse.completedAt)}</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-2" />
                  <span>Status: Selesai</span>
                </div>
                <div className="flex items-center text-secondary-900 font-medium">
                  <span>Skor: <span className={getScoreColorClass(calculatedScores.overall)}>{Math.round(calculatedScores.overall)}%</span></span>
                </div>
              </div>
            )}
          </div>
          
          {surveyResponse && calculatedScores.overall > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-primary-50 cursor-pointer"
                onClick={() => toggleSection('summary')}
              >
                <h2 className="text-lg font-medium text-secondary-900">Ringkasan Analisis</h2>
                {expandedSections.summary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.summary && (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">Skor Keseluruhan</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${calculatedScores.overall >= 80 ? 'bg-green-500' : calculatedScores.overall >= 60 ? 'bg-blue-500' : calculatedScores.overall >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${calculatedScores.overall}%` }}
                        ></div>
                      </div>
                      <span className={`font-medium ${getScoreColorClass(calculatedScores.overall)}`}>{Math.round(calculatedScores.overall)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">Interpretasi</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className={getScoreColorClass(calculatedScores.overall)}>
                        {getScoreInterpretation(calculatedScores.overall)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-secondary-900">Skor Detail</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection('detailedScores');
                      }} 
                      className="inline-flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <BarChart2 size={18} className="mr-2" />
                      <span>{expandedSections.detailedScores ? 'Sembunyikan Detail' : 'Lihat Detail'}</span>
                    </button>
                  </div>
                  
                  {expandedSections.detailedScores && (
                    <div className="mt-4 space-y-6">
                      {/* Corruption Perception Score */}
                      {calculatedScores.corruptionPerception > 0 && (
                        <div className="border border-gray-100 rounded-lg p-4">
                          <h4 className="font-medium text-secondary-900 mb-2">Persepsi Korupsi</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${calculatedScores.corruptionPerception >= 80 ? 'bg-green-500' : calculatedScores.corruptionPerception >= 60 ? 'bg-blue-500' : calculatedScores.corruptionPerception >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${calculatedScores.corruptionPerception}%` }}
                              ></div>
                            </div>
                            <span className={`font-medium ${getScoreColorClass(calculatedScores.corruptionPerception)}`}>{Math.round(calculatedScores.corruptionPerception)}%</span>
                          </div>
                          <p className={`text-sm ${getScoreColorClass(calculatedScores.corruptionPerception)}`}>
                            {getScoreInterpretation(calculatedScores.corruptionPerception)}
                          </p>
                        </div>
                      )}
                      
                      {/* Service Quality Score */}
                      {calculatedScores.serviceQuality > 0 && (
                        <div className="border border-gray-100 rounded-lg p-4">
                          <h4 className="font-medium text-secondary-900 mb-2">Kualitas Layanan</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${calculatedScores.serviceQuality >= 80 ? 'bg-green-500' : calculatedScores.serviceQuality >= 60 ? 'bg-blue-500' : calculatedScores.serviceQuality >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${calculatedScores.serviceQuality}%` }}
                              ></div>
                            </div>
                            <span className={`font-medium ${getScoreColorClass(calculatedScores.serviceQuality)}`}>{Math.round(calculatedScores.serviceQuality)}%</span>
                          </div>
                          <p className={`text-sm ${getScoreColorClass(calculatedScores.serviceQuality)}`}>
                            {getScoreInterpretation(calculatedScores.serviceQuality)}
                          </p>
                        </div>
                      )}
                      
                      {/* Survey Integrity Score */}
                      {calculatedScores.surveyIntegrity > 0 && (
                        <div className="border border-gray-100 rounded-lg p-4">
                          <h4 className="font-medium text-secondary-900 mb-2">Integritas Survei</h4>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full ${calculatedScores.surveyIntegrity >= 80 ? 'bg-green-500' : calculatedScores.surveyIntegrity >= 60 ? 'bg-blue-500' : calculatedScores.surveyIntegrity >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${calculatedScores.surveyIntegrity}%` }}
                              ></div>
                            </div>
                            <span className={`font-medium ${getScoreColorClass(calculatedScores.surveyIntegrity)}`}>{Math.round(calculatedScores.surveyIntegrity)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {surveyResponse && surveyDetails.questions.length > 0 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-primary-50 cursor-pointer"
                onClick={() => toggleSection('responses')}
              >
                <h2 className="text-lg font-medium text-secondary-900">Respons Anda</h2>
                {expandedSections.responses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {expandedSections.responses && (
                <div className="p-4">
                  {/* Group questions by category for better organization */}
                  {Object.entries(surveyDetails.questionsByCategory || {}).map(([category, questions]) => {
                    if (!questions || questions.length === 0) return null;
                    
                    // Skip categories with no answers
                    const hasAnswers = questions.some(q => 
                      surveyResponse.answers?.some(a => a.questionId === q.id)
                    );
                    
                    if (!hasAnswers) return null;
                    
                    // Convert category to readable title
                    const categoryTitle = 
                      category === 'corruption_perception' ? 'Persepsi Korupsi' :
                      category === 'service_quality' ? 'Kualitas Layanan' :
                      category === 'survey_integrity' ? 'Integritas Survei' : 
                      'Pertanyaan Lainnya';
                    
                    return (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-medium text-secondary-800 mb-3 pb-2 border-b border-gray-100">
                          {categoryTitle}
                        </h3>
                        <div className="divide-y divide-gray-200">
                          {questions.map((question, index) => {
                            const answer = surveyResponse.answers?.find(a => a.questionId === question.id);
                            const answerValue = answer ? answer.answer : null;
                            
                            if (!answer) return null; // Skip unanswered questions
                            
                            return (
                              <div key={question.id} className="py-4">
                                <p className="font-medium text-secondary-900 mb-2">
                                  {question.text}
                                </p>
                                
                                <div className="mt-2">
                                  {question.options ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                      <div className="flex items-center">
                                        <span className="font-medium mr-2">Jawaban:</span>
                                        <span className="bg-primary-50 py-1 px-3 rounded-full text-primary-700">
                                          {getLabelForValue(question, answerValue)} ({answerValue})
                                        </span>
                                      </div>
                                      <div className="w-full max-w-xs mt-2 sm:mt-0">
                                        <div className="h-2 bg-gray-200 rounded-full">
                                          <div 
                                            className="h-2 bg-primary-500 rounded-full" 
                                            style={{ width: `${(parseInt(answerValue) / 6) * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="font-medium mr-2">Jawaban:</span>
                                      <p className="mt-1 bg-gray-50 p-3 rounded text-secondary-800">
                                        {answerValue || '-'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center text-yellow-600 mb-4">
            <AlertCircle size={24} className="mr-2" />
            <p>Detail survei tidak ditemukan.</p>
          </div>
          <Link to="/history" className="btn-primary">
            Kembali ke Riwayat Survei
          </Link>
        </div>
      )}
    </div>
  );
};

export default SurveyDetailPage; 