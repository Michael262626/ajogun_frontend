/**
 * Mock data for testing without backend integration
 */

export interface MockWill {
    willIndex: number
    title?: string
    description?: string
    heirs: string[]
    shares: number[]
    amount: string
    status: 'active' | 'executed' | 'revoked'
    createdAt: string
    lastActivity: string
    contractAddress?: string
    transactionHash?: string
    totalValue?: number
    executionDate?: string
    duration?: number // in days
    durationConfig?: {
        type: 'months' | 'years'
        value: number
    }
}

export interface MockWallet {
    address: string
    balance: string
    tokens: {
        SUI: number
        USDC: number
        ETH: number
    }
}

export interface MockUser {
    userId: string
    password: string
    address?: string
    isAuthenticated: boolean
}

// Mock wallet data
export const mockWallet: MockWallet = {
    address: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
    balance: "1,247.89",
    tokens: {
        SUI: 1247.89,
        USDC: 5000.00,
        ETH: 2.45
    }
}

// Mock wills data
export const mockWills: MockWill[] = [
    {
        willIndex: 1,
        title: "Family Inheritance Will",
        description: "Primary family inheritance distribution for my children",
        heirs: [
            "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
            "0xa1b2c3d4e5f6789012345678901234567890abcd",
            "0x9c8b7a6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b"
        ],
        shares: [40, 35, 25],
        amount: "1000",
        status: 'active',
        createdAt: "2024-01-15T10:30:00Z",
        lastActivity: "2024-02-01T14:22:00Z",
        contractAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        totalValue: 7500.34,
        duration: 365, // 1 year
        durationConfig: { type: 'years', value: 1 }
    },
    {
        willIndex: 2,
        title: "Emergency Fund Will",
        description: "Emergency inheritance for spouse in case of unexpected events",
        heirs: [
            "0x5d4c3b2a1f9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c"
        ],
        shares: [100],
        amount: "500",
        status: 'active',
        createdAt: "2024-01-20T16:45:00Z",
        lastActivity: "2024-01-28T09:15:00Z",
        contractAddress: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
        transactionHash: "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a",
        totalValue: 2500.00,
        duration: 180, // 6 months
        durationConfig: { type: 'months', value: 6 }
    },
    {
        willIndex: 3,
        title: "Business Assets Will",
        description: "Distribution of business-related digital assets and investments",
        heirs: [
            "0x6e5d4c3b2a1f9e8d7c6b5a4f3e2d1c9b8a7f6e5d",
            "0x7f6e5d4c3b2a1f9e8d7c6b5a4f3e2d1c9b8a7f6e"
        ],
        shares: [60, 40],
        amount: "2000",
        status: 'executed',
        createdAt: "2023-12-10T12:00:00Z",
        lastActivity: "2023-12-10T12:00:00Z",
        contractAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
        transactionHash: "0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        totalValue: 15000.00,
        executionDate: "2024-01-25T18:30:00Z",
        duration: 365, // 1 year
        durationConfig: { type: 'years', value: 1 }
    }
]

// Mock beneficiaries data
export const mockBeneficiaries = [
    {
        id: "1",
        name: "Sarah Johnson",
        relationship: "Daughter",
        email: "sarah.johnson@email.com",
        walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
        percentage: 40,
        status: "verified",
        type: "individual",
    },
    {
        id: "2",
        name: "Michael Johnson",
        relationship: "Son",
        email: "michael.johnson@email.com",
        walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
        percentage: 35,
        status: "verified",
        type: "individual",
    },
    {
        id: "3",
        name: "Red Cross Foundation",
        relationship: "Charity",
        email: "donations@redcross.org",
        walletAddress: "0x9c8b7a6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b",
        percentage: 25,
        status: "pending",
        type: "organization",
    }
]

// Utility functions
export const generateMockAddress = (): string => {
    const chars = '0123456789abcdef'
    let result = '0x'
    for (let i = 0; i < 40; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export const generateMockHash = (): string => {
    const chars = '0123456789abcdef'
    let result = '0x'
    for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatHash = (hash: string): string => {
    return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}

// Mock API delay simulation
export const mockDelay = (ms: number = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
}