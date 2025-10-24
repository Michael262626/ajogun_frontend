"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { mockWallet, formatAddress } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import SharedLayout from "@/components/shared-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Wallet,
  Send,
  RefreshCw,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Shield,
  ShoppingCart,
  ArrowUpDown,
  CreditCard,
  Repeat,
  BarChart3,
  Zap,
  Star,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { CryptoIcon } from "@/components/ui/crypto-icons"
import TokenSelector from "@/components/ui/token-selector"

export default function WalletPage() {
  const { address, balance } = useWallet()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")
  const [swapFromToken, setSwapFromToken] = useState("SUI")
  const [swapToToken, setSwapToToken] = useState("USDC")
  const [swapAmount, setSwapAmount] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleTransfer = () => {
    showToast(`Transfer of ${transferAmount} SUI initiated successfully`)
    setTransferAmount("")
    setRecipientAddress("")
  }

  const handleBuy = () => {
    showToast(`Buy order for $${buyAmount} worth of ${swapFromToken} placed successfully`)
    setBuyAmount("")
  }

  const handleSell = () => {
    showToast(`Sell order for ${sellAmount} ${swapFromToken} placed successfully`)
    setSellAmount("")
  }

  const handleSwap = () => {
    showToast(`Swap of ${swapAmount} ${swapFromToken} to ${swapToToken} initiated`)
    setSwapAmount("")
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address || "")
    showToast("Wallet address copied to clipboard")
  }

  // Mock market data
  const marketTrends = [
    {
      symbol: 'SUI',
      name: 'Sui',
      price: 2.45,
      change: 12.5,
      volume: '1.2B',
      marketCap: '6.8B',
      chart: [2.1, 2.3, 2.2, 2.4, 2.45],
      trending: 'up'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2847.32,
      change: -3.2,
      volume: '15.6B',
      marketCap: '342.1B',
      chart: [2950, 2900, 2850, 2820, 2847],
      trending: 'down'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67234.56,
      change: 8.7,
      volume: '28.4B',
      marketCap: '1.3T',
      chart: [62000, 64000, 65500, 66800, 67234],
      trending: 'up'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 156.78,
      change: 15.3,
      volume: '3.8B',
      marketCap: '72.4B',
      chart: [135, 142, 148, 152, 156.78],
      trending: 'up'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1.00,
      change: 0.1,
      volume: '4.2B',
      marketCap: '32.8B',
      chart: [0.999, 1.001, 0.998, 1.002, 1.00],
      trending: 'stable'
    }
  ]

  // Mock transaction history
  const transactionHistory = [
    { date: "2024-02-01", type: "Received", amount: 500, from: "0x123...abc" },
    { date: "2024-01-31", type: "Swap", amount: -100, details: "SUI → USDC" },
    { date: "2024-01-30", type: "Buy", amount: 250, details: "Purchased SUI" },
    { date: "2024-01-28", type: "Sent", amount: -250, to: "0x456...def" },
    { date: "2024-01-27", type: "Sell", amount: -150, details: "Sold ETH" },
    { date: "2024-01-25", type: "Will Created", amount: -1000, contract: "0x789...ghi" },
    { date: "2024-01-20", type: "Received", amount: 2000, from: "0xabc...123" }
  ]

  // Mock balance history for chart
  const balanceHistory = [
    { date: "Jan 20", balance: 500 },
    { date: "Jan 25", balance: 1500 },
    { date: "Jan 28", balance: 1250 },
    { date: "Feb 01", balance: 1750 },
    { date: "Feb 05", balance: 1247.89 }
  ]

  const tokenData = [
    { name: 'SUI', amount: mockWallet.tokens.SUI, value: mockWallet.tokens.SUI * 2.45, color: '#FF8C00' },
    { name: 'USDC', amount: mockWallet.tokens.USDC, value: mockWallet.tokens.USDC, color: '#1E40AF' },
    { name: 'ETH', amount: mockWallet.tokens.ETH, value: mockWallet.tokens.ETH * 2847, color: '#6B7280' },
    { name: 'BTC', amount: 0.05, value: 0.05 * 67234, color: '#F7931A' },
    { name: 'SOL', amount: 12.5, value: 12.5 * 156.78, color: '#9945FF' }
  ]

  // Trading signals
  const tradingSignals = [
    { token: 'SUI', signal: 'BUY', strength: 'Strong', reason: 'Breaking resistance at $2.40' },
    { token: 'ETH', signal: 'HOLD', strength: 'Moderate', reason: 'Consolidating around $2850' },
    { token: 'BTC', signal: 'BUY', strength: 'Strong', reason: 'Golden cross formation' },
    { token: 'SOL', signal: 'BUY', strength: 'Very Strong', reason: 'High volume breakout' }
  ]

  const headerAction = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => showToast("Balance refreshed")}
        className="bg-transparent border-primary text-primary hover:bg-primary/10"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button
        onClick={() => setActiveTab("buy-sell")}
        className="bg-primary text-white font-semibold px-4 py-2 rounded-xl"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Buy/Sell
      </Button>
      <Button
        onClick={() => setActiveTab("swap")}
        className="bg-primary text-white font-semibold px-4 py-2 rounded-xl"
      >
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Swap
      </Button>
      <Button
        onClick={() => setActiveTab("send")}
        className="bg-primary hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-xl"
      >
        <Send className="w-4 h-4 mr-2" />
        Send
      </Button>
    </div>
  )

  return (
    <SharedLayout
      title="Crypto Wallet"
      subtitle="Complete crypto trading and portfolio management"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market
          </TabsTrigger>
          <TabsTrigger value="buy-sell" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy/Sell
          </TabsTrigger>
          <TabsTrigger value="swap" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Swap
          </TabsTrigger>
          <TabsTrigger value="send" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <Send className="w-4 h-4 mr-2" />
            Send
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <Activity className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-xl">Portfolio Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground text-sm">Connected to Sui Network</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Wallet Address</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-foreground font-mono text-lg">{address ? formatAddress(address) : 'Not connected'}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="text-primary hover:text-primary/80"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">Total Portfolio Value</p>
                      <p className="text-3xl font-bold text-foreground mt-1">$8,247.89</p>
                      <p className="text-green-500 text-sm">+12.5% (24h)</p>
                    </div>
                  </div>
                </div>

                {/* Token Balances */}
                <div className="space-y-4">
                  <h3 className="text-foreground font-semibold">Token Holdings</h3>
                  {tokenData.map((token) => (
                    <div key={token.name} className="bg-muted rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <CryptoIcon symbol={token.name} size={40} />
                          </div>
                          <div>
                            <p className="text-foreground font-semibold">{token.name}</p>
                            <p className="text-muted-foreground text-sm">{token.amount.toLocaleString()} tokens</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-semibold">${token.value.toLocaleString()}</p>
                          <p className="text-primary text-sm">+5.2%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">24h P&L</p>
                      <p className="text-xl font-bold text-green-500">+$247.89</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Active Wills</p>
                      <p className="text-xl font-bold text-foreground">3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Total Trades</p>
                      <p className="text-xl font-bold text-foreground">127</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Chart */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={balanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#60a5fa" />
                  <YAxis stroke="#60a5fa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      border: '1px solid #1e40af',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Tab */}
        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Overview */}
            <Card className="lg:col-span-2 bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-xl">Market Overview</CardTitle>
                <p className="text-muted-foreground">Real-time crypto market data and trends</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketTrends.map((coin) => (
                    <div key={coin.symbol} className="bg-muted rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                            <CryptoIcon symbol={coin.symbol} size={48} />
                          </div>
                          <div>
                            <p className="text-foreground font-semibold text-lg">{coin.name}</p>
                            <p className="text-muted-foreground text-sm">{coin.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-bold text-xl">${coin.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            {coin.change > 0 ? (
                              <ArrowUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`font-medium ${coin.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {coin.change > 0 ? '+' : ''}{coin.change}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Volume (24h)</p>
                          <p className="text-foreground font-semibold">${coin.volume}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Market Cap</p>
                          <p className="text-foreground font-semibold">${coin.marketCap}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Signals */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Trading Signals</CardTitle>
                <p className="text-muted-foreground text-sm">AI-powered market insights</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {tradingSignals.map((signal, index) => (
                  <div key={index} className="bg-muted rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-semibold">{signal.token}</span>
                      <Badge
                        className={`${signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                          signal.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}
                      >
                        {signal.signal}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">Strength: {signal.strength}</p>
                    <p className="text-foreground text-xs">{signal.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Buy/Sell Tab */}
        <TabsContent value="buy-sell" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-xl">Buy Crypto</CardTitle>
                <p className="text-muted-foreground">Purchase crypto with fiat currency</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Select Token</Label>
                  <TokenSelector
                    value={swapFromToken}
                    onChange={setSwapFromToken}
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount (USD)</Label>
                  <Input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="bg-primary/5 border-primary/20 text-foreground"
                    placeholder="100.00"
                  />
                </div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Estimated tokens:</span>
                    <span className="text-foreground">{buyAmount ? (parseFloat(buyAmount) / 2.45).toFixed(4) : '0'} {swapFromToken}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span className="text-foreground">$2.50</span>
                  </div>
                </div>
                <Button
                  onClick={handleBuy}
                  disabled={!buyAmount}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy {swapFromToken}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-xl">Sell Crypto</CardTitle>
                <p className="text-muted-foreground">Convert crypto to fiat currency</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Select Token</Label>
                  <TokenSelector
                    value={swapFromToken}
                    onChange={setSwapFromToken}
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount ({swapFromToken})</Label>
                  <Input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="bg-primary/5 border-primary/20 text-foreground"
                    placeholder="10.00"
                  />
                </div>
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Estimated USD:</span>
                    <span className="text-foreground">${sellAmount ? (parseFloat(sellAmount) * 2.45).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network fee:</span>
                    <span className="text-foreground">$2.50</span>
                  </div>
                </div>
                <Button
                  onClick={handleSell}
                  disabled={!sellAmount}
                  className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white font-semibold py-3"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Sell {swapFromToken}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Swap Tab */}
        <TabsContent value="swap" className="space-y-6">
          <Card className="max-w-2xl mx-auto bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl text-center">Token Swap</CardTitle>
              <p className="text-muted-foreground text-center">Exchange one token for another instantly</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">From</Label>
                  <div className="flex gap-2">
                    <TokenSelector
                      value={swapFromToken}
                      onChange={setSwapFromToken}
                      className="w-32"
                    />
                    <Input
                      type="number"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="bg-primary/5 border-primary/20 text-foreground flex-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const temp = swapFromToken
                      setSwapFromToken(swapToToken)
                      setSwapToToken(temp)
                    }}
                    className="text-primary hover:text-primary/80"
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </Button>
                </div>

                <div>
                  <Label className="text-muted-foreground">To</Label>
                  <div className="flex gap-2">
                    <TokenSelector
                      value={swapToToken}
                      onChange={setSwapToToken}
                      className="w-32"
                    />
                    <Input
                      type="number"
                      value={swapAmount ? (parseFloat(swapAmount) * 2.45).toFixed(4) : ''}
                      readOnly
                      className="bg-primary/5 border-primary/20 text-foreground flex-1"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="text-foreground">1 {swapFromToken} = 2.45 {swapToToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee:</span>
                  <span className="text-foreground">0.001 SUI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Slippage:</span>
                  <span className="text-foreground">0.5%</span>
                </div>
              </div>

              <Button
                onClick={handleSwap}
                disabled={!swapAmount}
                className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white font-semibold py-3"
              >
                <Repeat className="w-4 h-4 mr-2" />
                Swap Tokens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Tab */}
        <TabsContent value="send" className="space-y-6">
          <Card className="max-w-2xl mx-auto bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl text-center">Send Tokens</CardTitle>
              <p className="text-muted-foreground text-center">Transfer tokens to another wallet</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Recipient Address</Label>
                <Input
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-primary/5 border-primary/20 text-foreground font-mono"
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Token</Label>
                <TokenSelector
                  value={swapFromToken}
                  onChange={setSwapFromToken}
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <Input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="bg-primary/5 border-primary/20 text-foreground"
                  placeholder="0.00"
                />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Network fee:</span>
                  <span className="text-foreground">0.001 SUI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total cost:</span>
                  <span className="text-foreground">{transferAmount ? (parseFloat(transferAmount) + 0.001).toFixed(3) : '0'} SUI</span>
                </div>
              </div>
              <Button
                onClick={handleTransfer}
                disabled={!transferAmount || !recipientAddress}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Tokens
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-2xl">Transaction History</CardTitle>
              <p className="text-muted-foreground">Complete record of all wallet activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionHistory.map((tx, index) => (
                  <div key={index} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'Received' ? 'bg-green-500/20 text-green-400' :
                          tx.type === 'Sent' ? 'bg-red-500/20 text-red-400' :
                            tx.type === 'Buy' ? 'bg-green-500/20 text-green-400' :
                              tx.type === 'Sell' ? 'bg-yellow-500/20 text-yellow-400' :
                                tx.type === 'Swap' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-orange-500/20 text-orange-400'
                          }`}>
                          {tx.type === 'Received' ? '↓' :
                            tx.type === 'Sent' ? '↑' :
                              tx.type === 'Buy' ? '$' :
                                tx.type === 'Sell' ? '$' :
                                  tx.type === 'Swap' ? '⇄' : '⚡'}
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">{tx.type}</p>
                          <p className="text-muted-foreground text-sm">{tx.date}</p>
                          {tx.details && <p className="text-muted-foreground text-xs">{tx.details}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} SUI
                        </p>
                        <p className="text-muted-foreground text-sm font-mono">
                          {tx.from && `From: ${formatAddress(tx.from)}`}
                          {tx.to && `To: ${formatAddress(tx.to)}`}
                          {tx.contract && `Contract: ${formatAddress(tx.contract)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SharedLayout>
  )
}