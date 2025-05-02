import axios from 'axios';

// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    
    // Get the token from storage if exists
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code between 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of the range of 2xx
      
      const { status } = error.response;
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          // This will be handled by the userService setupTokenRefresh
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', error.response.data);
          break;
          
        case 404:
          // Not found
          console.error('Resource not found:', error.response.data);
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', error.response.data);
          break;
          
        case 500:
          // Server error
          console.error('Server error:', error.response.data);
          break;
          
        default:
          console.error(`HTTP Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 