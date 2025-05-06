/**
 * Utility functions for score and rating calculations across the application
 */

/**
 * Calculate average rating from response data
 * @param {Array} responses - Array of survey responses
 * @returns {number|string} - Formatted average rating or "N/A"
 */
export const calculateAverageRating = (responses) => {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return "N/A";
  
  // Calculate overall score for each response
  const responseScores = responses.map(response => {
    if (!response.answers || !Array.isArray(response.answers) || response.answers.length === 0) return 0;
    
    // Calculate total score based on answers (assuming 1-6 scale)
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    response.answers.forEach(answer => {
      // Only count numeric answers
      const answerValue = parseInt(answer.answer);
      if (!isNaN(answerValue)) {
        totalScore += answerValue;
        // Assuming max score is 6 for each question
        maxPossibleScore += 6;
      }
    });
    
    // Convert to percentage (0-100)
    const score = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  });
  
  // Filter out any zero scores
  const validScores = responseScores.filter(score => score > 0);
  
  if (validScores.length === 0) return "N/A";
  
  // Calculate the average score
  const averageScore = validScores.reduce((total, score) => total + score, 0) / validScores.length;
  
  // Convert to 5-star scale (since our star rating shows 5 stars)
  // 100% = 5 stars, so divide by 20
  const starRating = parseFloat((averageScore / 20).toFixed(1));
  
  return starRating;
};

/**
 * Get color class based on score
 * @param {string|number} score - Score value
 * @returns {string} - CSS class for the color
 */
export const getScoreColorClass = (score) => {
  if (score === "N/A" || !score) return "text-gray-500";
  
  const numericScore = parseFloat(score);
  if (isNaN(numericScore)) return "text-gray-500";
  
  if (numericScore >= 4.5) return 'text-green-600';
  if (numericScore >= 3.5) return 'text-blue-600';
  if (numericScore >= 2.5) return 'text-yellow-600';
  if (numericScore >= 1.5) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get score interpretation text based on score
 * @param {string|number} score - Score value
 * @returns {string} - Interpretation text
 */
export const getScoreInterpretation = (score) => {
  if (score === "N/A" || !score) return "Belum ada penilaian";
  
  const numericScore = parseFloat(score);
  if (isNaN(numericScore)) return "Belum ada penilaian";
  
  if (numericScore >= 4.5) return 'Sangat Memuaskan';
  if (numericScore >= 3.5) return 'Memuaskan';
  if (numericScore >= 2.5) return 'Cukup Memuaskan';
  if (numericScore >= 1.5) return 'Kurang Memuaskan';
  return 'Tidak Memuaskan';
};

/**
 * Format percentage change with + or - prefix
 * @param {number} percent - Percentage value
 * @returns {string} - Formatted percentage
 */
export const formatPercentageChange = (percent) => {
  if (percent === 0) return "0%";
  return `${percent > 0 ? '+' : ''}${percent}%`;
};

/**
 * Get sentiment color with opacity support
 * @param {string} sentiment - 'positive', 'neutral', or 'negative'
 * @param {number} alpha - Opacity value between 0-1
 * @returns {string} - RGBA color value
 */
export const getSentimentColor = (sentiment, alpha = 1) => {
  const colors = {
    positive: `rgba(34, 197, 94, ${alpha})`,  // green-500
    neutral: `rgba(168, 162, 158, ${alpha})`,  // gray-400
    negative: `rgba(239, 68, 68, ${alpha})`,  // red-500
  };
  
  return colors[sentiment] || colors.neutral;
};

/**
 * Get color based on rating
 * @param {number} rating - Rating value (1-5)
 * @param {number} alpha - Opacity value between 0-1
 * @returns {string} - RGBA color value
 */
export const getRatingColor = (rating, alpha = 1) => {
  const colors = {
    5: `rgba(34, 197, 94, ${alpha})`,     // green-500
    4: `rgba(132, 204, 22, ${alpha})`,    // lime-500
    3: `rgba(234, 179, 8, ${alpha})`,     // yellow-500
    2: `rgba(249, 115, 22, ${alpha})`,    // orange-500
    1: `rgba(239, 68, 68, ${alpha})`,     // red-500
  };
  
  return colors[Math.round(rating)] || colors[3];
}; 