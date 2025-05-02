import apiClient from './apiClient';

/**
 * Service object for authentication and user management
 */
const authService = {
  /**
   * Login a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and token
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.password_confirmation - Password confirmation
   * @returns {Promise<Object>} User data and token
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      // Store token and user data if returned
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Call logout endpoint if your API requires it
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },
  
  /**
   * Get the current authenticated user info
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user');
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
  
  /**
   * Get stored user data
   * @returns {Object|null} User data or null if not logged in
   */
  getUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  /**
   * Change user password
   * @param {string} current_password - Current password
   * @param {string} new_password - New password
   * @param {string} new_password_confirmation - New password confirmation
   * @returns {Promise<Object>} Response data
   */
  changePassword: async (current_password, new_password, new_password_confirmation) => {
    try {
      const response = await apiClient.put('/auth/password', {
        current_password,
        new_password,
        new_password_confirmation
      });
      
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Response data
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset password token
   * @param {string} email - User email
   * @param {string} password - New password
   * @param {string} password_confirmation - New password confirmation
   * @returns {Promise<Object>} Response data
   */
  resetPassword: async (token, email, password, password_confirmation) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation
      });
      
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default authService; 