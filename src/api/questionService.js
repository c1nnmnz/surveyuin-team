import apiClient from './apiClient';

/**
 * Service object for managing survey questions
 */
const questionService = {
  /**
   * Get all questions for a survey
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Query parameters
   * @param {boolean} [params.includeLogic=false] - Include conditional logic settings
   * @param {boolean} [params.includeValidation=false] - Include validation settings
   * @returns {Promise<Array>} Array of question objects
   */
  getSurveyQuestions: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/questions`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get questions for survey ${surveyId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Get a specific question by ID
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} [params] - Query parameters
   * @param {boolean} [params.includeLogic=false] - Include conditional logic
   * @param {boolean} [params.includeValidation=false] - Include validation rules
   * @returns {Promise<Object>} Question data
   */
  getQuestionById: async (surveyId, questionId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/questions/${questionId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new question
   * @param {string|number} surveyId - Survey ID
   * @param {Object} questionData - Question data
   * @param {string} questionData.type - Question type
   * @param {string} questionData.text - Question text
   * @param {Object} [questionData.settings] - Question settings
   * @param {Array} [questionData.options] - Question options (for multiple choice, etc.)
   * @param {Object} [questionData.validation] - Validation rules
   * @param {Object} [questionData.logic] - Conditional logic
   * @param {number} [questionData.order] - Question order in survey
   * @returns {Promise<Object>} Created question data
   */
  createQuestion: async (surveyId, questionData) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/questions`, questionData);
      return response.data;
    } catch (error) {
      console.error(`Create question for survey ${surveyId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Update an existing question
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise<Object>} Updated question data
   */
  updateQuestion: async (surveyId, questionId, questionData) => {
    try {
      const response = await apiClient.put(`/surveys/${surveyId}/questions/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      console.error(`Update question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a question
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @returns {Promise<Object>} Result data
   */
  deleteQuestion: async (surveyId, questionId) => {
    try {
      const response = await apiClient.delete(`/surveys/${surveyId}/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Reorder questions in a survey
   * @param {string|number} surveyId - Survey ID
   * @param {Array<Object>} orderData - Array of question order objects
   * @param {string|number} orderData[].id - Question ID
   * @param {number} orderData[].order - New position/order
   * @returns {Promise<Object>} Result data
   */
  reorderQuestions: async (surveyId, orderData) => {
    try {
      const response = await apiClient.put(`/surveys/${surveyId}/questions/reorder`, { questions: orderData });
      return response.data;
    } catch (error) {
      console.error(`Reorder questions for survey ${surveyId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Duplicate a question
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID to duplicate
   * @param {Object} [options] - Duplication options
   * @param {boolean} [options.includeLogic=true] - Copy logic rules
   * @param {boolean} [options.includeValidation=true] - Copy validation rules
   * @returns {Promise<Object>} Created question data
   */
  duplicateQuestion: async (surveyId, questionId, options = {}) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/questions/${questionId}/duplicate`, options);
      return response.data;
    } catch (error) {
      console.error(`Duplicate question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Update question validation rules
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} validationRules - Validation rules object
   * @returns {Promise<Object>} Updated question data
   */
  updateQuestionValidation: async (surveyId, questionId, validationRules) => {
    try {
      const response = await apiClient.put(
        `/surveys/${surveyId}/questions/${questionId}/validation`,
        validationRules
      );
      return response.data;
    } catch (error) {
      console.error(`Update validation for question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Update question conditional logic
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} logicRules - Logic rules object
   * @returns {Promise<Object>} Updated question data
   */
  updateQuestionLogic: async (surveyId, questionId, logicRules) => {
    try {
      const response = await apiClient.put(
        `/surveys/${surveyId}/questions/${questionId}/logic`,
        logicRules
      );
      return response.data;
    } catch (error) {
      console.error(`Update logic for question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Get question statistics
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} [params] - Query parameters
   * @returns {Promise<Object>} Question statistics
   */
  getQuestionStats: async (surveyId, questionId, params = {}) => {
    try {
      const response = await apiClient.get(
        `/surveys/${surveyId}/questions/${questionId}/stats`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Get stats for question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Import questions from another survey or template
   * @param {string|number} targetSurveyId - Target survey ID
   * @param {Object} importData - Import details
   * @param {string|number} importData.sourceSurveyId - Source survey ID
   * @param {Array<string|number>} [importData.questionIds] - Specific question IDs to import (all if not specified)
   * @param {number} [importData.position] - Position to insert in target survey (end if not specified)
   * @returns {Promise<Array>} Imported questions
   */
  importQuestions: async (targetSurveyId, importData) => {
    try {
      const response = await apiClient.post(`/surveys/${targetSurveyId}/questions/import`, importData);
      return response.data;
    } catch (error) {
      console.error(`Import questions to survey ${targetSurveyId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Get available question types with their configurations
   * @returns {Promise<Array>} Available question types
   */
  getQuestionTypes: async () => {
    try {
      const response = await apiClient.get('/question-types');
      return response.data;
    } catch (error) {
      console.error('Get question types error:', error);
      throw error;
    }
  },
  
  /**
   * Get question templates by category
   * @param {string} [category] - Template category
   * @returns {Promise<Array>} Question templates
   */
  getQuestionTemplates: async (category) => {
    try {
      const params = category ? { category } : {};
      const response = await apiClient.get('/question-templates', { params });
      return response.data;
    } catch (error) {
      console.error('Get question templates error:', error);
      throw error;
    }
  },
  
  /**
   * Save a question as template
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Object} templateData - Template data
   * @param {string} templateData.name - Template name
   * @param {string} [templateData.category] - Template category
   * @returns {Promise<Object>} Template data
   */
  saveQuestionAsTemplate: async (surveyId, questionId, templateData) => {
    try {
      const response = await apiClient.post(
        `/surveys/${surveyId}/questions/${questionId}/save-as-template`, 
        templateData
      );
      return response.data;
    } catch (error) {
      console.error(`Save question ${questionId} as template error:`, error);
      throw error;
    }
  },
  
  /**
   * Add conditions to a question (for conditional logic)
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @param {Array} conditions - Array of condition objects
   * @returns {Promise<Object>} Updated question data
   */
  addQuestionConditions: async (surveyId, questionId, conditions) => {
    try {
      const response = await apiClient.post(
        `/surveys/${surveyId}/questions/${questionId}/conditions`,
        { conditions }
      );
      return response.data;
    } catch (error) {
      console.error(`Add conditions to question ${questionId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Get question analytics/statistics
   * @param {string|number} surveyId - Survey ID
   * @param {string|number} questionId - Question ID
   * @returns {Promise<Object>} Question analytics data
   */
  getQuestionAnalytics: async (surveyId, questionId) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/questions/${questionId}/analytics`);
      return response.data;
    } catch (error) {
      console.error(`Get question ${questionId} analytics error:`, error);
      throw error;
    }
  },
  
  // Add validation rule to a question
  addQuestionValidation: async (surveyId, questionId, validationRule) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/questions/${questionId}/validations`, validationRule);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Remove validation rule from a question
  removeQuestionValidation: async (surveyId, questionId, validationId) => {
    try {
      const response = await apiClient.delete(`/surveys/${surveyId}/questions/${questionId}/validations/${validationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default questionService; 