/**
 * Utility functions for scrolling to elements
 */

/**
 * Scrolls to a specified element with customizable behavior
 * 
 * @param {HTMLElement|string} target - Element or element ID to scroll to
 * @param {Object} options - Scroll options
 * @param {number} options.margin - Margin from the top of the viewport (default: 100)
 * @param {string} options.behavior - Scroll behavior (default: 'smooth')
 * @param {boolean} options.highlight - Whether to highlight the element (default: true)
 * @param {string} options.highlightClass - CSS class to add for highlighting (default: 'highlight-question')
 * @param {number} options.highlightDuration - Duration of highlight in ms (default: 800)
 * @returns {boolean} - Whether scroll was successful
 */
export const scrollToElement = (target, options = {}) => {
  // Default options
  const {
    margin = 100,
    behavior = 'smooth',
    highlight = true,
    highlightClass = 'highlight-question',
    highlightDuration = 800
  } = options;
  
  // Get the target element if string was provided
  const element = typeof target === 'string' 
    ? document.getElementById(target)
    : target;
  
  if (!element) return false;
  
  // Calculate window dimensions and position
  const windowHeight = window.innerHeight;
  const elementRect = element.getBoundingClientRect();
  const elementHeight = elementRect.height;
  
  // Calculate target scroll position
  // We want to position the element with enough margin at the top
  const targetScrollPosition = window.pageYOffset + elementRect.top - margin;
  
  // Check if element is too large for viewport
  const isElementTooLarge = elementHeight > (windowHeight - margin * 1.5);
  
  // Check if already in view and fully visible
  const isFullyVisible = (
    elementRect.top >= margin &&
    elementRect.bottom <= windowHeight - 20
  );
  
  // Only scroll if not fully visible
  if (!isFullyVisible) {
    window.scrollTo({
      top: targetScrollPosition,
      behavior
    });
    
    // Highlight element if requested
    if (highlight) {
      element.classList.add(highlightClass);
      setTimeout(() => {
        element.classList.remove(highlightClass);
      }, highlightDuration);
    }
  }
  
  return true;
};

/**
 * Scrolls to a question element by ID with standard formatting
 * 
 * @param {string} questionId - The ID of the question without the 'question-' prefix
 * @param {Object} options - Scroll options (see scrollToElement)
 * @returns {boolean} - Whether scroll was successful
 */
export const scrollToQuestion = (questionId, options = {}) => {
  return scrollToElement(`question-${questionId}`, options);
};

/**
 * Scrolls to the next question after the current one
 * 
 * @param {string} currentQuestionId - Current question ID
 * @param {Array} allQuestions - Array of all question objects with 'id' field
 * @param {Object} questionRefs - React refs object mapping question IDs to their DOM elements
 * @param {Function} setHighlighted - Function to set highlighted question ID (optional)
 * @returns {boolean} - Whether scroll was successful
 */
export const scrollToNextQuestion = (currentQuestionId, allQuestions, questionRefs = null, setHighlighted = null) => {
  // Find the next question
  const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
  
  // If found and not the last question, scroll to the next question
  if (currentIndex !== -1 && currentIndex < allQuestions.length - 1) {
    const nextQuestionId = allQuestions[currentIndex + 1].id;
    
    // If we have refs, use the ref element directly
    if (questionRefs && questionRefs[nextQuestionId]) {
      // Set highlight state if provided
      if (setHighlighted) {
        setHighlighted(nextQuestionId);
        setTimeout(() => {
          setHighlighted(null);
        }, 800);
      }
      
      return scrollToElement(questionRefs[nextQuestionId], { margin: 80 });
    }
    
    // Otherwise use the ID-based approach
    return scrollToQuestion(nextQuestionId, { margin: 80 });
  }
  
  return false;
}; 