import apiClient from './apiClient';

/**
 * Service object for managing survey responses
 */
const responseService = {
  /**
   * Get responses for a survey with pagination and filtering
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @param {string} [params.sortBy='createdAt'] - Sort field
   * @param {string} [params.sortOrder='desc'] - Sort order
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.search] - Search term
   * @param {Date|string} [params.startDate] - Filter by start date
   * @param {Date|string} [params.endDate] - Filter by end date
   * @returns {Promise<Object>} Paginated responses data
   */
  getSurveyResponses: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/responses`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get responses for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Get a specific response by ID
   * @param {string|number} responseId - Response ID
   * @returns {Promise<Object>} Response data
   */
  getResponseById: async (responseId) => {
    try {
      const response = await apiClient.get(`/responses/${responseId}`);
      return response.data;
    } catch (error) {
      console.error(`Get response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Submit a new response for a survey
   * @param {string|number} surveyId - Survey ID
   * @param {Object} responseData - Response data
   * @param {Object} responseData.answers - Answers to survey questions
   * @param {Object} [responseData.metadata] - Response metadata
   * @returns {Promise<Object>} Created response data
   */
  submitResponse: async (surveyId, responseData) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/responses`, responseData);
      return response.data;
    } catch (error) {
      console.error(`Submit response for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Update a response (partial or administrative update)
   * @param {string|number} responseId - Response ID
   * @param {Object} responseData - Updated response data
   * @returns {Promise<Object>} Updated response data
   */
  updateResponse: async (responseId, responseData) => {
    try {
      const response = await apiClient.patch(`/responses/${responseId}`, responseData);
      return response.data;
    } catch (error) {
      console.error(`Update response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a response
   * @param {string|number} responseId - Response ID
   * @returns {Promise<Object>} Result data
   */
  deleteResponse: async (responseId) => {
    try {
      const response = await apiClient.delete(`/responses/${responseId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Bulk delete multiple responses
   * @param {Array<string|number>} responseIds - Array of response IDs to delete
   * @returns {Promise<Object>} Result data
   */
  bulkDeleteResponses: async (responseIds) => {
    try {
      const response = await apiClient.post('/responses/bulk-delete', { responseIds });
      return response.data;
    } catch (error) {
      console.error('Bulk delete responses error:', error);
      throw error;
    }
  },

  /**
   * Export survey responses in specified format
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Export parameters
   * @param {string} [params.format='csv'] - Export format (csv, xlsx, json)
   * @param {boolean} [params.includeMetadata=true] - Include metadata in export
   * @param {Array<string>} [params.questionIds] - Filter for specific questions
   * @param {Object} [params.filters] - Additional filters
   * @returns {Promise<Blob>} Exported data as blob
   */
  exportResponses: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/responses/export`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Export responses for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Get summary statistics for survey responses
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Query parameters
   * @param {Date|string} [params.startDate] - Filter by start date
   * @param {Date|string} [params.endDate] - Filter by end date
   * @returns {Promise<Object>} Response statistics
   */
  getResponsesStats: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/responses/stats`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get response stats for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Add a note to a response
   * @param {string|number} responseId - Response ID
   * @param {Object} noteData - Note data
   * @param {string} noteData.content - Note content
   * @param {string} [noteData.type='general'] - Note type
   * @returns {Promise<Object>} Updated response data
   */
  addResponseNote: async (responseId, noteData) => {
    try {
      const response = await apiClient.post(`/responses/${responseId}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Add note to response ${responseId} error:`, error);
      throw error;
    }
  },
  
  /**
   * Update a response note
   * @param {string|number} responseId - Response ID
   * @param {string|number} noteId - Note ID
   * @param {Object} noteData - Updated note data
   * @param {string} noteData.content - Updated note content
   * @returns {Promise<Object>} Updated response data
   */
  updateResponseNote: async (responseId, noteId, noteData) => {
    try {
      const response = await apiClient.put(`/responses/${responseId}/notes/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Update note ${noteId} for response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a response note
   * @param {string|number} responseId - Response ID
   * @param {string|number} noteId - Note ID
   * @returns {Promise<Object>} Updated response data
   */
  deleteResponseNote: async (responseId, noteId) => {
    try {
      const response = await apiClient.delete(`/responses/${responseId}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete note ${noteId} for response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Flag a response (for review, spam, etc.)
   * @param {string|number} responseId - Response ID
   * @param {Object} flagData - Flag data
   * @param {string} flagData.reason - Reason for flagging
   * @param {string} [flagData.notes] - Additional notes
   * @returns {Promise<Object>} Updated response data
   */
  flagResponse: async (responseId, flagData) => {
    try {
      const response = await apiClient.post(`/responses/${responseId}/flag`, flagData);
      return response.data;
    } catch (error) {
      console.error(`Flag response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Clear flag from a response
   * @param {string|number} responseId - Response ID
   * @returns {Promise<Object>} Updated response data
   */
  clearResponseFlag: async (responseId) => {
    try {
      const response = await apiClient.delete(`/responses/${responseId}/flag`);
      return response.data;
    } catch (error) {
      console.error(`Clear flag from response ${responseId} error:`, error);
      throw error;
    }
  },

  /**
   * Save partial response (for resuming later)
   * @param {string|number} surveyId - Survey ID
   * @param {Object} responseData - Partial response data
   * @param {string} [resumeToken] - Token for existing partial response
   * @returns {Promise<Object>} Partial response data with resume token
   */
  savePartialResponse: async (surveyId, responseData, resumeToken = null) => {
    try {
      const url = resumeToken 
        ? `/surveys/${surveyId}/responses/partial/${resumeToken}`
        : `/surveys/${surveyId}/responses/partial`;
      const method = resumeToken ? 'put' : 'post';
      
      const response = await apiClient[method](url, responseData);
      return response.data;
    } catch (error) {
      console.error(`Save partial response for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Get partial response by resume token
   * @param {string} resumeToken - Resume token
   * @returns {Promise<Object>} Partial response data
   */
  getPartialResponse: async (resumeToken) => {
    try {
      const response = await apiClient.get(`/responses/partial/${resumeToken}`);
      return response.data;
    } catch (error) {
      console.error(`Get partial response with token ${resumeToken} error:`, error);
      throw error;
    }
  }
};

export default responseService; 