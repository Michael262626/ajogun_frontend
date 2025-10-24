/**
 * Environment configuration
 */

// Environment variables with fallbacks
export const ENV_CONFIG = {
  // API Configuration
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ajogun-willon-sui-backend.onrender.com',
  
  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Debug flags
  DEBUG_API: process.env.NEXT_PUBLIC_DEBUG_API === 'true',
  DEBUG_WALLET: process.env.NEXT_PUBLIC_DEBUG_WALLET === 'true',
}

// Log configuration in development
if (ENV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    USE_MOCK_API: ENV_CONFIG.USE_MOCK_API,
    API_BASE_URL: ENV_CONFIG.API_BASE_URL,
    DEBUG_API: ENV_CONFIG.DEBUG_API,
    DEBUG_WALLET: ENV_CONFIG.DEBUG_WALLET,
  })
}