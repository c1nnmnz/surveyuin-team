import apiClient from './apiClient';

/**
 * Service object for managing surveys
 */
const surveyService = {
  /**
   * Get surveys with pagination and sorting
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @param {string} [params.sortBy='createdAt'] - Sort field
   * @param {string} [params.sortOrder='desc'] - Sort order
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.search] - Search term
   * @returns {Promise<Object>} Paginated surveys data
   */
  getSurveys: async (params = {}) => {
    try {
      const response = await apiClient.get('/surveys', { params });
      return response.data;
    } catch (error) {
      console.error('Get surveys error:', error);
      throw error;
    }
  },

  /**
   * Get a specific survey by ID
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Query parameters
   * @param {boolean} [params.includeQuestions=false] - Include survey questions
   * @param {boolean} [params.includeResponses=false] - Include survey responses
   * @returns {Promise<Object>} Survey data
   */
  getSurveyById: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new survey
   * @param {Object} surveyData - Survey data
   * @param {string} surveyData.title - Survey title
   * @param {string} [surveyData.description] - Survey description
   * @param {Object} [surveyData.settings] - Survey settings
   * @param {string} [surveyData.status='draft'] - Survey status
   * @returns {Promise<Object>} Created survey data
   */
  createSurvey: async (surveyData) => {
    try {
      const response = await apiClient.post('/surveys', surveyData);
      return response.data;
    } catch (error) {
      console.error('Create survey error:', error);
      throw error;
    }
  },

  /**
   * Update an existing survey
   * @param {string|number} surveyId - Survey ID
   * @param {Object} surveyData - Updated survey data
   * @returns {Promise<Object>} Updated survey data
   */
  updateSurvey: async (surveyId, surveyData) => {
    try {
      const response = await apiClient.put(`/surveys/${surveyId}`, surveyData);
      return response.data;
    } catch (error) {
      console.error(`Update survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Delete a survey
   * @param {string|number} surveyId - Survey ID
   * @returns {Promise<Object>} Result data
   */
  deleteSurvey: async (surveyId) => {
    try {
      const response = await apiClient.delete(`/surveys/${surveyId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Update survey status
   * @param {string|number} surveyId - Survey ID
   * @param {string} status - New status ('draft', 'published', 'closed', 'archived')
   * @returns {Promise<Object>} Updated survey data
   */
  updateSurveyStatus: async (surveyId, status) => {
    try {
      const response = await apiClient.patch(`/surveys/${surveyId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Update survey ${surveyId} status error:`, error);
      throw error;
    }
  },

  /**
   * Duplicate a survey
   * @param {string|number} surveyId - Survey ID to duplicate
   * @param {Object} [options] - Duplication options
   * @param {string} [options.title] - New survey title
   * @param {boolean} [options.includeQuestions=true] - Copy questions
   * @param {boolean} [options.includeSettings=true] - Copy settings
   * @param {string} [options.status='draft'] - Status for the new survey
   * @returns {Promise<Object>} Created survey data
   */
  duplicateSurvey: async (surveyId, options = {}) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/duplicate`, options);
      return response.data;
    } catch (error) {
      console.error(`Duplicate survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Get survey settings
   * @param {string|number} surveyId - Survey ID
   * @returns {Promise<Object>} Survey settings
   */
  getSurveySettings: async (surveyId) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/settings`);
      return response.data;
    } catch (error) {
      console.error(`Get survey ${surveyId} settings error:`, error);
      throw error;
    }
  },

  /**
   * Update survey settings
   * @param {string|number} surveyId - Survey ID
   * @param {Object} settings - Updated settings
   * @returns {Promise<Object>} Updated survey settings
   */
  updateSurveySettings: async (surveyId, settings) => {
    try {
      const response = await apiClient.put(`/surveys/${surveyId}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error(`Update survey ${surveyId} settings error:`, error);
      throw error;
    }
  },

  /**
   * Get survey templates
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Items per page
   * @param {string} [params.category] - Template category
   * @param {string} [params.search] - Search term
   * @returns {Promise<Object>} Paginated templates data
   */
  getSurveyTemplates: async (params = {}) => {
    try {
      const response = await apiClient.get('/survey-templates', { params });
      return response.data;
    } catch (error) {
      console.error('Get survey templates error:', error);
      throw error;
    }
  },

  /**
   * Save survey as template
   * @param {string|number} surveyId - Survey ID
   * @param {Object} templateData - Template data
   * @param {string} templateData.name - Template name
   * @param {string} [templateData.description] - Template description
   * @param {string} [templateData.category] - Template category
   * @param {boolean} [templateData.isPublic=false] - Whether template is public
   * @returns {Promise<Object>} Created template data
   */
  saveAsTemplate: async (surveyId, templateData) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/save-as-template`, templateData);
      return response.data;
    } catch (error) {
      console.error(`Save survey ${surveyId} as template error:`, error);
      throw error;
    }
  },

  /**
   * Get survey statistics
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [params] - Query parameters
   * @param {string} [params.timeframe] - Timeframe for statistics
   * @returns {Promise<Object>} Survey statistics
   */
  getSurveyStatistics: async (surveyId, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${surveyId}/statistics`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get survey ${surveyId} statistics error:`, error);
      throw error;
    }
  },

  /**
   * Get survey collection link (for sharing)
   * @param {string|number} surveyId - Survey ID
   * @param {Object} [options] - Link options
   * @param {Date} [options.expiresAt] - Expiry date
   * @param {boolean} [options.passwordProtect=false] - Whether to password protect
   * @param {string} [options.password] - Password (if protected)
   * @returns {Promise<Object>} Survey link data
   */
  getSurveyLink: async (surveyId, options = {}) => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/collection-link`, options);
      return response.data;
    } catch (error) {
      console.error(`Get survey ${surveyId} link error:`, error);
      throw error;
    }
  },

  /**
   * Get survey by public access token
   * @param {string} accessToken - Public access token
   * @returns {Promise<Object>} Survey data
   */
  getSurveyByToken: async (accessToken) => {
    try {
      const response = await apiClient.get(`/public-surveys/${accessToken}`);
      return response.data;
    } catch (error) {
      console.error(`Get survey by token error:`, error);
      throw error;
    }
  },

  /**
   * Get survey responses
   * @param {string|number} id - Survey ID
   * @param {Object} params - Optional query parameters for pagination
   * @returns {Promise<Object>} Survey responses with pagination
   */
  getSurveyResponses: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/surveys/${id}/responses`, { params });
      return response.data;
    } catch (error) {
      console.error(`Get survey ${id} responses error:`, error);
      throw error;
    }
  },

  /**
   * Get surveys by user ID
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} List of user's surveys
   */
  getUserSurveys: async (userId, params = {}) => {
    try {
      const response = await apiClient.get(`/users/${userId}/surveys`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user surveys:', error);
      throw error;
    }
  },

  /**
   * Generate a share link or QR code for a public survey
   * @param {string|number} surveyId - Survey ID
   * @param {string} [type='link'] - Type of share (link, qr)
   * @returns {Promise<Object>} Share data
   */
  generateShareLink: async (surveyId, type = 'link') => {
    try {
      const response = await apiClient.post(`/surveys/${surveyId}/share`, { type });
      return response.data;
    } catch (error) {
      console.error(`Generate share link for survey ${surveyId} error:`, error);
      throw error;
    }
  },

  /**
   * Get a public survey by its share code
   * @param {string} shareCode - Share code
   * @returns {Promise<Object>} Survey data
   */
  getPublicSurvey: async (shareCode) => {
    try {
      const response = await apiClient.get(`/public-surveys/${shareCode}`);
      return response.data;
    } catch (error) {
      console.error(`Get public survey with code ${shareCode} error:`, error);
      throw error;
    }
  },

  /**
   * Create a survey from a template
   * @param {string|number} templateId - Template ID
   * @param {Object} [customData] - Custom data to override template defaults
   * @returns {Promise<Object>} Created survey data
   */
  createFromTemplate: async (templateId, customData = {}) => {
    try {
      const response = await apiClient.post(`/survey-templates/${templateId}/create`, customData);
      return response.data;
    } catch (error) {
      console.error(`Create survey from template ${templateId} error:`, error);
      throw error;
    }
  }
};

export default surveyService; 