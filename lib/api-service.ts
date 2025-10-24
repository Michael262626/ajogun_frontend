/**
 * Real API service for backend integration
 */

import { API_CONFIG, ENDPOINTS } from './api-config'

const API_BASE_URL = API_CONFIG.BASE_URL

// Types
export interface CreateWalletRequest {
  userId: string
  password: string
}

export interface CreateWalletResponse {
  address?: string
  mnemonic?: string
  requiresVerification?: boolean
  success?: boolean
  message?: string
}

export interface CreateWillRequest {
  userId: string
  password: string
  heirs: string[]
  shares: number[]
  amount?: string
}

export interface WillResponse {
  willIndex?: number
  contractAddress?: string
  transactionHash?: string
  status?: string
  success?: boolean
  message?: string
}

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
      body: JSON.stringify(walletData),
    })
  }

  async getWallet(userId: string): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}`)
  }

  async getWalletBalance(userId: string): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/balance`)
  }

  async transferTokens(userId: string, transferData: TransferRequest): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/transfer`, {
      method: 'POST',
      body: JSON.stringify(transferData),
    })
  }

  async getWalletStatus(userId: string): Promise<any> {
    return this.makeRequest<any>(`/wallet/${userId}/status`)
  }

  // Will Management
  async createWill(willData: CreateWillRequest): Promise<WillResponse> {
    return this.makeRequest<WillResponse>('/will/create', {
      method: 'POST',
      body: JSON.stringify(willData),
    })
  }

  async updateActivity(willIndex: number, activityData: { userId: string; password: string }): Promise<any> {
    return this.makeRequest<any>(`/will/update-activity/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    })
  }

  async initiateWillExecution(
    willIndex: number, 
    ownerAddress: string, 
    executeData: { userId: string; password: string }
  ): Promise<any> {
    return this.makeRequest<any>(`/will/initiate/${willIndex}/${ownerAddress}`, {
      method: 'POST',
      body: JSON.stringify(executeData),
    })
  }

  async executeWill(
    willIndex: number, 
    ownerAddress: string, 
    executeData: { userId: string; password: string }
  ): Promise<any> {
    return this.makeRequest<any>(`/will/execute/${willIndex}/${ownerAddress}`, {
      method: 'POST',
      body: JSON.stringify(executeData),
    })
  }

  async executeWillAutomatically(
    ownerAddress: string, 
    willIndex: number, 
    executeData: { password: string }
  ): Promise<any> {
    return this.makeRequest<any>(`/will/execute-automatically/${ownerAddress}/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify(executeData),
    })
  }

  // Additional methods to match mock service interface
  async verifyAndActivateWallet(verifyData: any): Promise<any> {
    return this.makeRequest<any>('/wallet/verify-activate', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    })
  }

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

  async revokeWill(willIndex: number, revokeData: { userId: string; password: string }): Promise<any> {
    return this.makeRequest<any>(`/will/revoke/${willIndex}`, {
      method: 'POST',
      body: JSON.stringify(revokeData),
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
}

export const apiService = new ApiService()