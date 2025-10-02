// Mock wallet generation utilities
// In a real implementation, this would use actual Sui SDK

export interface GeneratedWallet {
  address: string
  publicKey: string
  privateKey: string
  mnemonic: string[]
  derivationPath: string
}

export interface ImportedWallet {
  address: string
  publicKey: string
  privateKey: string
  isValid: boolean
}

// Generate a mock Sui wallet address
export const generateSuiAddress = (): string => {
  const prefix = "0x"
  const randomHex = Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return prefix + randomHex
}

// Generate a mock public key
export const generatePublicKey = (): string => {
  const randomHex = Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return randomHex
}

// Generate a mock private key
export const generatePrivateKey = (): string => {
  const randomHex = Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return randomHex
}

// Generate a 12-word mnemonic phrase
export const generateMnemonic = (): string[] => {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
    'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
    'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
    'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
    'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
    'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'article',
    'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
    'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
    'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
    'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis'
  ]
  
  return Array.from({ length: 12 }, () => 
    words[Math.floor(Math.random() * words.length)]
  )
}

// Create a new wallet
export const createWallet = async (): Promise<GeneratedWallet> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const privateKey = generatePrivateKey()
  const publicKey = generatePublicKey()
  const address = generateSuiAddress()
  const mnemonic = generateMnemonic()
  const derivationPath = "m/44'/784'/0'/0'/0'"
  
  return {
    address,
    publicKey,
    privateKey,
    mnemonic,
    derivationPath
  }
}

// Import wallet from mnemonic
export const importWalletFromMnemonic = async (mnemonic: string): Promise<ImportedWallet> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const words = mnemonic.trim().split(/\s+/)
  
  // Basic validation
  if (words.length !== 12 && words.length !== 24) {
    return {
      address: '',
      publicKey: '',
      privateKey: '',
      isValid: false
    }
  }
  
  // Mock validation - in real implementation, would validate against BIP39 wordlist
  const isValidMnemonic = words.every(word => word.length >= 3)
  
  if (!isValidMnemonic) {
    return {
      address: '',
      publicKey: '',
      privateKey: '',
      isValid: false
    }
  }
  
  // Generate wallet from mnemonic (mock)
  const privateKey = generatePrivateKey()
  const publicKey = generatePublicKey()
  const address = generateSuiAddress()
  
  return {
    address,
    publicKey,
    privateKey,
    isValid: true
  }
}

// Import wallet from private key
export const importWalletFromPrivateKey = async (privateKey: string): Promise<ImportedWallet> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Basic validation
  if (!privateKey || privateKey.length !== 64) {
    return {
      address: '',
      publicKey: '',
      privateKey: '',
      isValid: false
    }
  }
  
  // Check if it's valid hex
  const isValidHex = /^[0-9a-fA-F]+$/.test(privateKey)
  
  if (!isValidHex) {
    return {
      address: '',
      publicKey: '',
      privateKey: '',
      isValid: false
    }
  }
  
  // Generate corresponding public key and address (mock)
  const publicKey = generatePublicKey()
  const address = generateSuiAddress()
  
  return {
    address,
    publicKey,
    privateKey,
    isValid: true
  }
}

// Validate Sui address format
export const isValidSuiAddress = (address: string): boolean => {
  return /^0x[0-9a-fA-F]{64}$/.test(address)
}

// Format private key for display (hide most characters)
export const formatPrivateKey = (privateKey: string): string => {
  if (privateKey.length < 8) return privateKey
  return `${privateKey.slice(0, 4)}...${privateKey.slice(-4)}`
}

// Format mnemonic for display
export const formatMnemonic = (mnemonic: string[]): string => {
  return mnemonic.map((word, index) => `${index + 1}. ${word}`).join(' ')
}