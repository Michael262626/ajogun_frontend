/**
 * Real Crypto Icons Component
 * SVG icons for major cryptocurrencies
 */

import React from 'react'

interface CryptoIconProps {
  className?: string
  size?: number
}

// SUI Icon
export const SuiIcon: React.FC<CryptoIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#4DA2FF"/>
    <path
      d="M8.5 7.5C8.5 6.67157 9.17157 6 10 6H14C14.8284 6 15.5 6.67157 15.5 7.5V16.5C15.5 17.3284 14.8284 18 14 18H10C9.17157 18 8.5 17.3284 8.5 16.5V7.5Z"
      fill="white"
    />
    <path
      d="M10.5 8.5H13.5V15.5H10.5V8.5Z"
      fill="#4DA2FF"
    />
  </svg>
)

// USDC Icon
export const UsdcIcon: React.FC<CryptoIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#2775CA"/>
    <path
      d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
      fill="white"
    />
    <circle cx="12" cy="12" r="7" fill="#2775CA"/>
    <path
      d="M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7Z"
      fill="white"
    />
    <text x="12" y="13.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#2775CA">
      $
    </text>
  </svg>
)

// Ethereum Icon
export const EthIcon: React.FC<CryptoIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path
      d="M12 3L12.0025 10.5525L18 12L12 3Z"
      fill="white"
      fillOpacity="0.602"
    />
    <path
      d="M12 3L6 12L12 10.5525V3Z"
      fill="white"
    />
    <path
      d="M12 16.476L12.0025 21L18 13.24L12 16.476Z"
      fill="white"
      fillOpacity="0.602"
    />
    <path
      d="M12 21V16.476L6 13.24L12 21Z"
      fill="white"
    />
    <path
      d="M12 15.24L18 12L12 10.5525V15.24Z"
      fill="white"
      fillOpacity="0.2"
    />
    <path
      d="M6 12L12 15.24V10.5525L6 12Z"
      fill="white"
      fillOpacity="0.602"
    />
  </svg>
)

// Bitcoin Icon
export const BtcIcon: React.FC<CryptoIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#F7931A"/>
    <path
      d="M15.5 10.5C15.5 9.11929 14.3807 8 13 8H9V6H11V4H9V6H7V8H9V16H7V18H9V20H11V18H13C14.3807 18 15.5 16.8807 15.5 15.5C15.5 14.5 15 13.6 14.2 13.1C14.7 12.6 15 11.9 15.5 10.5Z"
      fill="white"
    />
    <path
      d="M11 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H11V10Z"
      fill="#F7931A"
    />
    <path
      d="M11 13H13C13.5523 13 14 13.4477 14 14C14 14.5523 13.5523 15 13 15H11V13Z"
      fill="#F7931A"
    />
  </svg>
)

// Solana Icon
export const SolIcon: React.FC<CryptoIconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="url(#solanaGradient)"/>
    <defs>
      <linearGradient id="solanaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF"/>
        <stop offset="100%" stopColor="#14F195"/>
      </linearGradient>
    </defs>
    <path
      d="M6 8.5C6 8.22386 6.22386 8 6.5 8H17.5C17.7761 8 18 8.22386 18 8.5C18 8.77614 17.7761 9 17.5 9H6.5C6.22386 9 6 8.77614 6 8.5Z"
      fill="white"
    />
    <path
      d="M6 12C6 11.7239 6.22386 11.5 6.5 11.5H17.5C17.7761 11.5 18 11.7239 18 12C18 12.2761 17.7761 12.5 17.5 12.5H6.5C6.22386 12.5 6 12.2761 6 12Z"
      fill="white"
    />
    <path
      d="M6 15.5C6 15.2239 6.22386 15 6.5 15H17.5C17.7761 15 18 15.2239 18 15.5C18 15.7761 17.7761 16 17.5 16H6.5C6.22386 16 6 15.7761 6 15.5Z"
      fill="white"
    />
  </svg>
)

// Generic Crypto Icon Component
interface GenericCryptoIconProps extends CryptoIconProps {
  symbol: string
}

export const CryptoIcon: React.FC<GenericCryptoIconProps> = ({ symbol, className, size = 24 }) => {
  const upperSymbol = symbol.toUpperCase()
  
  switch (upperSymbol) {
    case 'SUI':
      return <SuiIcon className={className} size={size} />
    case 'USDC':
      return <UsdcIcon className={className} size={size} />
    case 'ETH':
      return <EthIcon className={className} size={size} />
    case 'BTC':
      return <BtcIcon className={className} size={size} />
    case 'SOL':
      return <SolIcon className={className} size={size} />
    default:
      // Fallback generic crypto icon
      return (
        <div 
          className={`rounded-full bg-primary flex items-center justify-center text-white font-bold ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {upperSymbol.charAt(0)}
        </div>
      )
  }
}