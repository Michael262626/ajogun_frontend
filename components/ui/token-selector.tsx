/**
 * Token Selector Component with Crypto Icons
 */

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CryptoIcon } from './crypto-icons'

interface Token {
  symbol: string
  name: string
}

interface TokenSelectorProps {
  value: string
  onChange: (value: string) => void
  tokens?: Token[]
  className?: string
}

const defaultTokens: Token[] = [
  { symbol: 'SUI', name: 'Sui' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'SOL', name: 'Solana' }
]

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  value,
  onChange,
  tokens = defaultTokens,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedToken = tokens.find(token => token.symbol === value) || tokens[0]

  const handleSelect = (tokenSymbol: string) => {
    onChange(tokenSymbol)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-primary/5 border border-primary/20 text-foreground rounded-lg p-3 flex items-center justify-between hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <CryptoIcon symbol={selectedToken.symbol} size={20} />
          <span className="font-medium">{selectedToken.symbol}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                type="button"
                onClick={() => handleSelect(token.symbol)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-muted transition-colors text-left ${
                  token.symbol === value ? 'bg-primary/10' : ''
                }`}
              >
                <CryptoIcon symbol={token.symbol} size={20} />
                <div>
                  <div className="font-medium text-foreground">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TokenSelector