/**
 * Real API service for backend integration
 */

import { API_CONFIG, ENDPOINTS } from './api-config'

const API_BASE_URL = API_CONFIG.BASE_URL

// Types based on your backend specifications
export interface CreateWalletRequest {
  password: string
  userId: string
}

export interface VerifyAndActivateWalletRequest {
  userId: string
  mnemonic: string
  password: string
}

export interface GetWalletRequest {
  password: string
}

export interface TransferTokensRequest {
  recipient: string
  amount: number
  password: string
}

export interface CreateWillRequest {
  userId: string
  password: string
  heirs: string[]
  shares: number[]
}

export interface UpdateActivityRequest {
  userId: string
  password: string
}

export interface ExecuteWillRequest {
  userId: string
  password: string
}

export interface ExecuteWillAutomaticallyRequest {
  userId: string
  password: string
}

export interface RevokeWillRequest {
  userId: string
  password: string
}

// Response types
export interface CreateWalletResponse {
  address?: string
  mnemonic?: string
  requiresVerification?: boolean
  success?: boolean
  message?: string
}

export interface WillResponse {
  willIndex?: number
  contractAddress?: string
  transactionHash?: string
  status?: string
  success?: boolean
  message?: string
}

// Legacy type for backward compatibility
export interface TransferRequest {
  password: string
  recipientAddress: string
  amount: number
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Wallet Management
  async createWallet(walletData: CreateWalletRequest): Promise<CreateWalletResponse> {
    return this.makeRequest<CreateWalletResponse>('/wallet/create', {
      method: 'POST',
      body: JSON.stringify({
        password: walletData.password,
        userId: walletData.userId
      }),
    })
  }

  async verifyAndActivateWallet(verifyData: VerifyAndActivateWalletRequest): Promise<any> {
    return this.makeRequest<any>('/wallet/verify-activate', {
      method: 'POST',
      body: JSON.stringify({
        userId: verifyData.userId,
        mnemonic: verifyData.mnemonic,
        password: verifyData.password
      }),
    })
  }

  async getWallet(userId: string, walletData: GetWalletRequest): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        password: walletData.password
      }),
    })
  }

  async getWalletBalance(userId: string): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/balance`)
  }

  async transferTokens(userId: string, transferData: TransferTokensRequest): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/transfer`, {
      method: 'POST',
      body: JSON.stringify({
        recipient: transferData.recipient,
        amount: transferData.amount,
        password: transferData.password
      }),
    })
  }

  async getWalletStatus(userId: string): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/status`)
  }

  // Will Management
  async createWill(willData: CreateWillRequest): Promise<WillResponse> {
    return this.makeRequest<WillResponse>('/will/create', {
      method: 'POST',
      body: JSON.stringify({
        userId: willData.userId,
        password: willData.password,
        heirs: willData.heirs,
        shares: willData.shares
      }),
    })
  }

  async updateActivity(willIndex: number, activityData: UpdateActivityRequest): Promise<any> {
    return this.makeRequest<any>(`/will/update-activity/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: activityData.userId,
        password: activityData.password
      }),
    })
  }

  async initiateWillExecution(
    willIndex: number, 
    ownerAddress: string, 
    executeData: ExecuteWillRequest
  ): Promise<any> {
    return this.makeRequest<any>(`/will/initiate/${willIndex}/${ownerAddress}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: executeData.userId,
        password: executeData.password
      }),
    })
  }

  async executeWill(
    willIndex: number, 
    ownerAddress: string, 
    executeData: ExecuteWillRequest
  ): Promise<any> {
    return this.makeRequest<any>(`/will/execute/${willIndex}/${ownerAddress}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: executeData.userId,
        password: executeData.password
      }),
    })
  }

  async executeWillAutomatically(
    ownerAddress: string, 
    willIndex: number, 
    executeData: ExecuteWillAutomaticallyRequest
  ): Promise<any> {
    return this.makeRequest<any>(`/will/execute-automatically/${ownerAddress}/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: executeData.userId,
        password: executeData.password
      }),
    })
  }

  async revokeWill(willIndex: number, revokeData: RevokeWillRequest): Promise<any> {
    return this.makeRequest<any>(`/will/revoke/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: revokeData.userId,
        password: revokeData.password
      }),
    })
  }

  async checkWillReadyForExecution(ownerAddress: string, willIndex: number): Promise<any> {
    return this.makeRequest<any>(`/will/check-ready/${ownerAddress}/${willIndex}`)
  }

  async getMonitoredWills(): Promise<any[]> {
    return this.makeRequest<any[]>('/will/monitored-wills')
  }

  async getAllWillsForOwner(ownerAddress: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/will/all/${ownerAddress}`)
  }

  // Additional methods for backward compatibility
  async activateWalletAlternative(activateData: any): Promise<any> {
    return this.makeRequest<any>('/wallet/activate-alternative', {
      method: 'POST',
      body: JSON.stringify(activateData),
    })
  }

  async importWallet(importData: any): Promise<any> {
    return this.makeRequest<any>('/wallet/import', {
      method: 'POST',
      body: JSON.stringify(importData),
    })
  }
}

export const apiService = new ApiService()