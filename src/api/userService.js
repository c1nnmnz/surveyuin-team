import apiClient from './apiClient';

/**
 * Service object for managing user authentication and profile
 */
const userService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User's full name
   * @param {string} [userData.role] - User role (if applicable)
   * @returns {Promise<Object>} Registered user data and token
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Log in a user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} [credentials.rememberMe=false] - Whether to remember the user
   * @returns {Promise<Object>} User data and auth token
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // Store auth token in localStorage or sessionStorage based on rememberMe
      if (response.data.token) {
        if (credentials.rememberMe) {
          localStorage.setItem('authToken', response.data.token);
        } else {
          sessionStorage.setItem('authToken', response.data.token);
        }
        // Set default Authorization header for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear stored tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      
      // Remove Authorization header
      delete apiClient.defaults.headers.common['Authorization'];
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove tokens on failed logout
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Result data
   */
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/users/me/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   * @param {Object} data - Reset request data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Result data
   */
  requestPasswordReset: async (data) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset data
   * @param {string} data.token - Reset token
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} Result data
   */
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Verify email address
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Result data
   */
  verifyEmail: async (token) => {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },

  /**
   * Request a new verification email
   * @param {Object} data - Request data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Result data
   */
  resendVerificationEmail: async (data) => {
    try {
      const response = await apiClient.post('/auth/resend-verification', data);
      return response.data;
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Setup interceptor for token refresh
   * This should be called when the app initializes
   */
  setupTokenRefresh: () => {
    // Check for stored token and set in headers if found
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor for handling token refresh
    apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Call your token refresh endpoint
            const response = await apiClient.post('/auth/refresh-token');
            const { token } = response.data;
            
            // Update stored token
            if (localStorage.getItem('authToken')) {
              localStorage.setItem('authToken', token);
            } else {
              sessionStorage.setItem('authToken', token);
            }
            
            // Update authorization headers
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            
            // Retry the original request
            return apiClient(originalRequest);
          } catch (refreshError) {
            // If refresh fails, log out
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
            
            // Redirect to login if needed
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  },

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  getUserPreferences: async () => {
    try {
      const response = await apiClient.get('/users/me/preferences');
      return response.data;
    } catch (error) {
      console.error('Get user preferences error:', error);
      throw error;
    }
  },

  /**
   * Update user preferences
   * @param {Object} preferences - Updated preferences
   * @returns {Promise<Object>} Updated preferences
   */
  updateUserPreferences: async (preferences) => {
    try {
      const response = await apiClient.put('/users/me/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update user preferences error:', error);
      throw error;
    }
  }
};

export default userService; 