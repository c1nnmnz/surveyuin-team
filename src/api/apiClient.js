import axios from 'axios';

// Default config for axios instance
const config = {
  // Use a localhost URL as fallback for development to prevent DNS resolution errors
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api/v1' : 'https://api.surveyuin.com/v1'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Log API configuration and environment
console.log('API Client environment:', import.meta.env.MODE);
console.log('API Client configured with baseURL:', config.baseURL);
console.log('Mock data enabled:', import.meta.env.VITE_USE_MOCK_DATA === 'true');

// Create axios instance
const apiClient = axios.create(config);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Get language preference from localStorage or use default
    const language = localStorage.getItem('language') || 'id'; // Indonesian by default
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language to headers for internationalization
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of the range of 2xx
      console.error('API Error Response:', error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user-store');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Return standardized error format
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || {},
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      // This is likely a network error
      
      // Log the error with clearer message
      console.error('Network Error - No response received:', error.request);
      
      // Use a more user-friendly message for network errors
      const errorMessage = 'Tidak dapat terhubung ke server. Silahkan periksa koneksi internet Anda.';
      
      // For DNS errors, provide more specific message
      if (error.message && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.warn('DNS resolution failed. The API server domain could not be resolved.');
      }
      
      return Promise.reject({
        status: 0,
        message: errorMessage,
        errors: {},
        data: null,
        isNetworkError: true
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
      
      return Promise.reject({
        status: 0,
        message: 'Terjadi kesalahan yang tidak terduga.',
        errors: {},
        data: null
      });
    }
  }
);

// Methods for API requests
export const apiService = {
  // GET request
  get: (url, params = {}) => apiClient.get(url, { params }),
  
  // POST request
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  
  // PUT request
  put: (url, data = {}) => apiClient.put(url, data),
  
  // PATCH request
  patch: (url, data = {}) => apiClient.patch(url, data),
  
  // DELETE request
  delete: (url) => apiClient.delete(url),
  
  // Upload file(s)
  upload: (url, formData) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Download file
  download: (url, filename) => {
    return apiClient.get(url, { responseType: 'blob' })
      .then(response => {
        // Create blob link to download
        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        
        // Append to html page
        document.body.appendChild(link);
        
        // Force download
        link.click();
        
        // Clean up and remove the link
        URL.revokeObjectURL(link.href);
      });
  }
};

export default apiClient; 