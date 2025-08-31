// Deployment Configuration for Product Feedback Tool
// This file contains settings for both development and production environments

const deployConfig = {
  development: {
    apiBaseUrl: 'http://localhost:8000/api',
    environment: 'development',
    enableDebug: true,
    enableSourceMaps: true,
    enableHotReload: true,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  },
  
  production: {
    apiBaseUrl: 'https://feedbacktool.onthis.website/api', // Update with your Hostinger domain
    environment: 'production',
    enableDebug: false,
    enableSourceMaps: false,
    enableHotReload: false,
    cors: {
      origin: 'https://feedbacktool.onthis.website', // Update with your Hostinger domain
      credentials: true
    },
    // Production optimizations
    minify: true,
    compress: true,
    cacheControl: {
      static: 'public, max-age=31536000', // 1 year
      dynamic: 'public, max-age=3600'     // 1 hour
    }
  }
};

// Get current environment
const getCurrentConfig = () => {
  const env = process.env.REACT_APP_ENVIRONMENT || 'development';
  return deployConfig[env] || deployConfig.development;
};

// Export configurations
export { deployConfig, getCurrentConfig };
export default getCurrentConfig();
