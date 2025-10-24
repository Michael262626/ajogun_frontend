/**
 * API Configuration
 * Switch between mock and real API services
 */

import { ENV_CONFIG } from './env-config'

// Set to true to use mock API, false to use real backend
export const USE_MOCK_API = ENV_CONFIG.USE_MOCK_API

// Backend configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
}

// Development mode detection
export const IS_DEVELOPMENT = ENV_CONFIG.IS_DEVELOPMENT

// API endpoints
export const ENDPOINTS = {
  // Wallet endpoints
  WALLET: {
    CREATE: '/wallet/create',
    GET: (userId: string) => `/wallet/${userId}`,
    BALANCE: (userId: string) => `/wallet/${userId}/balance`,
    TRANSFER: (userId: string) => `/wallet/${userId}/transfer`,
    VERIFY_ACTIVATE: '/wallet/verify-activate',
    ACTIVATE_ALTERNATIVE: '/wallet/activate-alternative',
    IMPORT: '/wallet/import',
    STATUS: (userId: string) => `/wallet/${userId}/status`,
  },

  // Will endpoints
  WILL: {
    CREATE: '/will/create',
    UPDATE_ACTIVITY: (willIndex: number) => `/will/update-activity/${willIndex}`,
    INITIATE: (willIndex: number, ownerAddress: string) => `/will/initiate/${willIndex}/${ownerAddress}`,
    EXECUTE: (willIndex: number, ownerAddress: string) => `/will/execute/${willIndex}/${ownerAddress}`,
    EXECUTE_AUTO: (ownerAddress: string, willIndex: number) => `/will/execute-automatically/${ownerAddress}/${willIndex}`,
    REVOKE: (willIndex: number) => `/will/revoke/${willIndex}`,
    CHECK_READY: (ownerAddress: string, willIndex: number) => `/will/check-ready/${ownerAddress}/${willIndex}`,
    MONITORED: '/will/monitored-wills',
    ALL: (ownerAddress: string) => `/will/all/${ownerAddress}`,
  }
}