/**
 * Unified API service that switches between mock and real API
 */

import { USE_MOCK_API } from './api-config'
import { apiService } from './api-service'
import { mockApiService } from './mock-api-service'

// Create a unified interface
interface UnifiedApiService {
  createWallet: typeof apiService.createWallet
  getWallet: typeof apiService.getWallet
  getWalletBalance: typeof apiService.getWalletBalance
  transferTokens: typeof apiService.transferTokens
  verifyAndActivateWallet: typeof apiService.verifyAndActivateWallet
  activateWalletAlternative: typeof apiService.activateWalletAlternative
  importWallet: typeof apiService.importWallet
  getWalletStatus: typeof apiService.getWalletStatus
  createWill: typeof apiService.createWill
  updateActivity: typeof apiService.updateActivity
  initiateWillExecution: typeof apiService.initiateWillExecution
  executeWill: typeof apiService.executeWill
  executeWillAutomatically: typeof apiService.executeWillAutomatically
  revokeWill: typeof apiService.revokeWill
  checkWillReadyForExecution: typeof apiService.checkWillReadyForExecution
  getMonitoredWills: typeof apiService.getMonitoredWills
  getAllWillsForOwner: typeof apiService.getAllWillsForOwner
}

// Export the appropriate service based on configuration
export const unifiedApiService: UnifiedApiService = USE_MOCK_API ? mockApiService as any : apiService

// Re-export types
export type {
  CreateWalletRequest,
  CreateWalletResponse,
  CreateWillRequest,
  WillResponse,
  TransferRequest,
  TransferTokensRequest,
  VerifyAndActivateWalletRequest,
  GetWalletRequest,
  UpdateActivityRequest,
  ExecuteWillRequest,
  ExecuteWillAutomaticallyRequest,
  RevokeWillRequest
} from './api-service'