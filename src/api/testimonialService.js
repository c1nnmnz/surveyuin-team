import apiClient from './apiClient';
import mockHandler from './mockHandler';

// Use mock data in development or when apiClient fails
const useMockData = true;

/**
 * Fetch all testimonials with optional filtering
 * @param {Object} params - Query parameters
 * @param {string} params.serviceId - Filter by service ID
 * @param {number} params.rating - Filter by rating (1-5)
 * @param {string} params.sortBy - Sort by: 'newest', 'oldest', 'highest', 'lowest', 'helpful'
 * @param {string} params.sentiment - Filter by sentiment: 'positive', 'neutral', 'negative'
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of testimonials per page
 * @param {string} params.search - Search text in testimonial content
 * @returns {Promise<Object>} - Paginated testimonials data
 */
export const getTestimonials = async (params = {}) => {
  try {
    if (useMockData) {
      console.log('Using mock data for testimonials');
      return mockHandler.getTestimonials(params);
    }
    
    const response = await apiClient.get('/testimonials', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    
    // Fallback to mock data if API fails
    console.log('Falling back to mock data');
    return mockHandler.getTestimonials(params);
  }
};

/**
 * Fetch a specific testimonial by ID
 * @param {string} id - Testimonial ID
 * @returns {Promise<Object>} - Testimonial data
 */
export const getTestimonialById = async (id) => {
  try {
    if (useMockData) {
      return mockHandler.getTestimonialById(id);
    }
    
    const response = await apiClient.get(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching testimonial #${id}:`, error);
    
    // Fallback to mock data if API fails
    return mockHandler.getTestimonialById(id);
  }
};

/**
 * Create a new testimonial
 * @param {Object} testimonialData - Testimonial data
 * @returns {Promise<Object>} - Created testimonial
 */
export const createTestimonial = async (testimonialData) => {
  try {
    const response = await apiClient.post('/testimonials', testimonialData);
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

/**
 * Update an existing testimonial
 * @param {string} id - Testimonial ID
 * @param {Object} updates - Updated testimonial data
 * @returns {Promise<Object>} - Updated testimonial
 */
export const updateTestimonial = async (id, updates) => {
  try {
    const response = await apiClient.put(`/testimonials/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating testimonial #${id}:`, error);
    throw error;
  }
};

/**
 * Delete a testimonial
 * @param {string} id - Testimonial ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteTestimonial = async (id) => {
  try {
    const response = await apiClient.delete(`/testimonials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting testimonial #${id}:`, error);
    throw error;
  }
};

/**
 * Add a reply to a testimonial
 * @param {string} testimonialId - Testimonial ID
 * @param {Object} replyData - Reply data
 * @returns {Promise<Object>} - Updated testimonial with reply
 */
export const addReply = async (testimonialId, replyData) => {
  try {
    if (useMockData) {
      console.log('Using mock data for adding reply');
      return { success: true, message: 'Reply added successfully' };
    }
    
    const response = await apiClient.post(`/testimonials/${testimonialId}/replies`, replyData);
    return response.data;
  } catch (error) {
    console.error(`Error adding reply to testimonial #${testimonialId}:`, error);
    
    // Fallback to mock data if API fails
    if (useMockData) {
      console.log('Falling back to mock data for reply');
      return { success: true, message: 'Reply added successfully (mock)' };
    }
    throw error;
  }
};

/**
 * Mark a testimonial as helpful (increment helpful count)
 * @param {string} id - Testimonial ID
 * @returns {Promise<Object>} - Updated testimonial
 */
export const markAsHelpful = async (id) => {
  try {
    if (useMockData) {
      console.log('Using mock data for marking as helpful');
      return { success: true, message: 'Testimonial marked as helpful' };
    }
    
    const response = await apiClient.post(`/testimonials/${id}/helpful`);
    return response.data;
  } catch (error) {
    console.error(`Error marking testimonial #${id} as helpful:`, error);
    
    // Fallback to mock data if API fails
    if (useMockData) {
      console.log('Falling back to mock data for helpful marking');
      return { success: true, message: 'Testimonial marked as helpful (mock)' };
    }
    throw error;
  }
};

/**
 * Flag a testimonial as inappropriate
 * @param {string} id - Testimonial ID
 * @param {Object} reason - Flagging reason
 * @returns {Promise<Object>} - Confirmation
 */
export const flagTestimonial = async (id, reason) => {
  try {
    const response = await apiClient.post(`/testimonials/${id}/flag`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error flagging testimonial #${id}:`, error);
    throw error;
  }
};

/**
 * Fetch testimonial statistics
 * @param {Object} params - Query parameters
 * @param {string} params.serviceId - Filter by service ID
 * @param {string} params.period - Time period: 'week', 'month', 'year', 'all'
 * @returns {Promise<Object>} - Testimonial statistics
 */
export const getTestimonialStats = async (params = {}) => {
  try {
    if (useMockData) {
      return mockHandler.getTestimonialStats(params);
    }
    
    const response = await apiClient.get('/testimonials/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonial statistics:', error);
    
    // Fallback to mock data if API fails
    return mockHandler.getTestimonialStats(params);
  }
};

/**
 * Fetch testimonial trends over time
 * @param {Object} params - Query parameters
 * @param {string} params.serviceId - Filter by service ID
 * @param {string} params.period - Time period: 'week', 'month', 'year'
 * @param {string} params.interval - Interval: 'day', 'week', 'month'
 * @returns {Promise<Object>} - Testimonial trends data
 */
export const getTestimonialTrends = async (params = {}) => {
  try {
    if (useMockData) {
      return mockHandler.getTestimonialTrends(params);
    }
    
    const response = await apiClient.get('/testimonials/trends', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonial trends:', error);
    
    // Fallback to mock data if API fails
    return mockHandler.getTestimonialTrends(params);
  }
};

// Create the default export object
const testimonialService = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  addReply,
  markAsHelpful,
  flagTestimonial,
  getTestimonialStats,
  getTestimonialTrends
};

// Export the service as default
export default testimonialService; 