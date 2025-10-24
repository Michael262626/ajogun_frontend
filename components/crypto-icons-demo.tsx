/**
 * Demo component to showcase crypto icons
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CryptoIcon, SuiIcon, UsdcIcon, EthIcon, BtcIcon, SolIcon } from '@/components/ui/crypto-icons'

export default function CryptoIconsDemo() {
    const cryptos = [
        { symbol: 'SUI', name: 'Sui', price: '$2.45' },
        { symbol: 'USDC', name: 'USD Coin', price: '$1.00' },
        { symbol: 'ETH', name: 'Ethereum', price: '$2,847.32' },
        { symbol: 'BTC', name: 'Bitcoin', price: '$67,234.56' },
        { symbol: 'SOL', name: 'Solana', price: '$156.78' }
    ]

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Crypto Icons Showcase</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {/* Individual Icons */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Individual Icons</h3>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <SuiIcon size={48} />
                                <p className="text-sm mt-2">SUI</p>
                            </div>
                            <div className="text-center">
                                <UsdcIcon size={48} />
                                <p className="text-sm mt-2">USDC</p>
                            </div>
                            <div className="text-center">
                                <EthIcon size={48} />
                                <p className="text-sm mt-2">ETH</p>
                            </div>
                            <div className="text-center">
                                <BtcIcon size={48} />
                                <p className="text-sm mt-2">BTC</p>
                            </div>
                            <div className="text-center">
                                <SolIcon size={48} />
                                <p className="text-sm mt-2">SOL</p>
                            </div>
                        </div>
                    </div>

                    {/* Different Sizes */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Different Sizes</h3>
                        <div className="flex items-center gap-4">
                            <CryptoIcon symbol="SUI" size={16} />
                            <CryptoIcon symbol="SUI" size={24} />
                            <CryptoIcon symbol="SUI" size={32} />
                            <CryptoIcon symbol="SUI" size={48} />
                            <CryptoIcon symbol="SUI" size={64} />
                        </div>
                    </div>

                    {/* In List Format */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">In List Format</h3>
                        <div className="space-y-3">
                            {cryptos.map((crypto) => (
                                <div key={crypto.symbol} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                    <CryptoIcon symbol={crypto.symbol} size={32} />
                                    <div className="flex-1">
                                        <p className="font-semibold">{crypto.name}</p>
                                        <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                                    </div>
                                    <p className="font-bold">{crypto.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fallback Example */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Fallback for Unknown Tokens</h3>
                        <div className="flex items-center gap-4">
                            <CryptoIcon symbol="UNKNOWN" size={32} />
                            <CryptoIcon symbol="XYZ" size={32} />
                            <CryptoIcon symbol="TEST" size={32} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}