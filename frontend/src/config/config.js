// Frontend configuration
const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  
  // App Configuration
  APP_NAME: process.env.REACT_APP_NAME || 'Product Feedback Tool',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true' || process.env.NODE_ENV === 'development',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 15,
  MAX_PAGE_SIZE: 100,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      USER: '/auth/user',
    },
    FEEDBACK: {
      LIST: '/feedback',
      CREATE: '/feedback',
      SHOW: (id) => `/feedback/${id}`,
      UPDATE: (id) => `/feedback/${id}`,
      DELETE: (id) => `/feedback/${id}`,
      BY_CATEGORY: (category) => `/feedback/category/${category}`,
      BY_STATUS: (status) => `/feedback/status/${status}`,
    },
    COMMENTS: {
      LIST: (feedbackId) => `/feedback/${feedbackId}/comments`,
      CREATE: (feedbackId) => `/feedback/${feedbackId}/comments`,
      SHOW: (feedbackId, commentId) => `/feedback/${feedbackId}/comments/${commentId}`,
      UPDATE: (feedbackId, commentId) => `/feedback/${feedbackId}/comments/${commentId}`,
      DELETE: (feedbackId, commentId) => `/feedback/${feedbackId}/comments/${commentId}`,
      BY_USER: (userId) => `/comments/user/${userId}`,
    },
    HEALTH: '/health',
  },
};

export default config;
