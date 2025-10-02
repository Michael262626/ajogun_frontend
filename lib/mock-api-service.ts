/**
 * Mock API service for testing without backend
 */

import { 
  mockWallet, 
  mockWills, 
  mockBeneficiaries,
  generateMockAddress,
  generateMockHash,
  mockDelay,
  type MockWill 
} from './mock-data'

// Store for simulating persistent data
let mockStorage = {
  wills: [...mockWills],
  wallet: { ...mockWallet },
  user: null as any,
  nextWillIndex: 4
}

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

class MockApiService {
  // Wallet Management
  async createWallet(walletData: CreateWalletRequest): Promise<CreateWalletResponse> {
    await mockDelay(1500)
    
    const mockMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const mockAddress = generateMockAddress()
    
    mockStorage.wallet.address = mockAddress
    mockStorage.user = { userId: walletData.userId, address: mockAddress }
    
    return {
      success: true,
      address: mockAddress,
      mnemonic: mockMnemonic,
      requiresVerification: true,
      message: "Wallet created successfully"
    }
  }

  async verifyAndActivateWallet(verifyData: any): Promise<any> {
    await mockDelay(1000)
    
    return {
      success: true,
      address: mockStorage.wallet.address,
      activated: true,
      message: "Wallet activated successfully"
    }
  }

  async getWallet(userId: string): Promise<any> {
    await mockDelay(500)
    
    return {
      success: true,
      address: mockStorage.wallet.address,
      balance: mockStorage.wallet.balance
    }
  }

  async getWalletBalance(userId: string): Promise<any> {
    await mockDelay(300)
    
    return {
      success: true,
      balance: mockStorage.wallet.balance,
      tokens: mockStorage.wallet.tokens
    }
  }

  async transferTokens(transferData: any): Promise<any> {
    await mockDelay(2000)
    
    // Simulate random success/failure
    const success = Math.random() > 0.1 // 90% success rate
    
    if (success) {
      return {
        success: true,
        transactionHash: generateMockHash(),
        message: "Transfer successful"
      }
    } else {
      return {
        success: false,
        message: "Insufficient balance or network error"
      }
    }
  }

  // Will Management
  async createWill(willData: CreateWillRequest): Promise<WillResponse> {
    await mockDelay(3000) // Simulate blockchain deployment time
    
    const newWill: MockWill = {
      willIndex: mockStorage.nextWillIndex++,
      heirs: willData.heirs,
      shares: willData.shares,
      amount: willData.amount || "1000",
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      contractAddress: generateMockAddress(),
      transactionHash: generateMockHash(),
      totalValue: parseFloat(willData.amount || "1000")
    }
    
    mockStorage.wills.push(newWill)
    
    return {
      success: true,
      willIndex: newWill.willIndex,
      contractAddress: newWill.contractAddress,
      transactionHash: newWill.transactionHash,
      status: 'active',
      message: "Will created and deployed successfully"
    }
  }

  async getAllWillsForOwner(ownerAddress: string): Promise<MockWill[]> {
    await mockDelay(800)
    
    // Return all wills for demo purposes
    return mockStorage.wills.map(will => ({
      ...will,
      // Add some randomization to make it feel more real
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
  }

  async updateActivity(willIndex: number, activityData: any): Promise<any> {
    await mockDelay(1000)
    
    const will = mockStorage.wills.find(w => w.willIndex === willIndex)
    if (will) {
      will.lastActivity = new Date().toISOString()
    }
    
    return {
      success: true,
      message: "Activity updated successfully",
      transactionHash: generateMockHash()
    }
  }

  async revokeWill(willIndex: number, revokeData: any): Promise<any> {
    await mockDelay(2000)
    
    const will = mockStorage.wills.find(w => w.willIndex === willIndex)
    if (will) {
      will.status = 'revoked'
    }
    
    return {
      success: true,
      message: "Will revoked successfully",
      transactionHash: generateMockHash()
    }
  }

  async executeWill(willIndex: number, ownerAddress: string, executeData: any): Promise<any> {
    await mockDelay(3000)
    
    const will = mockStorage.wills.find(w => w.willIndex === willIndex)
    if (will) {
      will.status = 'executed'
    }
    
    return {
      success: true,
      message: "Will executed successfully",
      transactionHash: generateMockHash(),
      distributionDetails: will?.heirs.map((heir, index) => ({
        recipient: heir,
        amount: (will.totalValue! * (will.shares[index] / 100)).toFixed(2),
        percentage: will.shares[index]
      }))
    }
  }

  async checkWillReadyForExecution(ownerAddress: string, willIndex: number): Promise<any> {
    await mockDelay(500)
    
    const will = mockStorage.wills.find(w => w.willIndex === willIndex)
    if (!will) {
      return {
        isReady: false,
        reason: "Will not found"
      }
    }
    
    const daysSinceActivity = Math.floor((Date.now() - new Date(will.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
    const daysUntilExecution = Math.max(0, 365 - daysSinceActivity)
    
    return {
      isReady: daysSinceActivity >= 365,
      reason: daysSinceActivity >= 365 ? "Inactivity period exceeded" : "Still within activity period",
      daysUntilExecution,
      lastActivity: will.lastActivity
    }
  }

  async getMonitoredWills(): Promise<any[]> {
    await mockDelay(600)
    
    return mockStorage.wills
      .filter(will => will.status === 'active')
      .map(will => {
        const daysSinceActivity = Math.floor((Date.now() - new Date(will.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
        return {
          willIndex: will.willIndex,
          ownerAddress: mockStorage.wallet.address,
          status: will.status,
          lastActivity: will.lastActivity,
          daysUntilExecution: Math.max(0, 365 - daysSinceActivity)
        }
      })
  }
}

export const mockApiService = new MockApiService()