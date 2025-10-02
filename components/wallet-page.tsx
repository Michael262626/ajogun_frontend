"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { mockWallet, formatAddress } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Line
} from "recharts"
import {
  Wallet,
  Send,
  RefreshCw,
  Copy,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Activity,
  Shield
} from "lucide-react"

export default function WalletPage() {
  const { address, balance } = useWallet()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleTransfer = () => {
    showToast(`Transfer of ${transferAmount} SUI initiated successfully`)
    setTransferAmount("")
    setRecipientAddress("")
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address || "")
    showToast("Wallet address copied to clipboard")
  }

  // Mock transaction history
  const transactionHistory = [
    { date: "2024-02-01", type: "Received", amount: 500, from: "0x123...abc" },
    { date: "2024-01-28", type: "Sent", amount: -250, to: "0x456...def" },
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
    { name: 'SUI', amount: mockWallet.tokens.SUI, value: mockWallet.tokens.SUI * 2, color: '#FF8C00' },
    { name: 'USDC', amount: mockWallet.tokens.USDC, value: mockWallet.tokens.USDC, color: '#1E40AF' },
    { name: 'ETH', amount: mockWallet.tokens.ETH, value: mockWallet.tokens.ETH * 2000, color: '#6B7280' }
  ]

  const headerAction = (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => showToast("Balance refreshed")}
        className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold px-6 py-2 rounded-xl">
        <Send className="w-4 h-4 mr-2" />
        Send Tokens
      </Button>
    </div>
  )

  return (
    <SharedLayout
      title="Wallet"
      subtitle="Manage your crypto assets and transactions"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardHeader>
            <CardTitle className="text-white text-xl">Wallet Overview</CardTitle>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm">Connected to Sui Network</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-black/30 rounded-xl p-6 border border-blue-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-300 text-sm">Wallet Address</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-mono text-lg">{address ? formatAddress(address) : 'Not connected'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="text-blue-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-300 text-sm">Total Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">{balance} SUI</p>
                </div>
              </div>
            </div>

            {/* Token Balances */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Token Balances</h3>
              {tokenData.map((token) => (
                <div key={token.name} className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: token.color }}>
                        <span className="text-white font-bold text-sm">{token.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{token.name}</p>
                        <p className="text-blue-300 text-sm">{token.amount.toLocaleString()} tokens</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${token.value.toLocaleString()}</p>
                      <p className="text-green-400 text-sm">+5.2%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Stats */}
        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardHeader>
            <CardTitle className="text-white">Wallet Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Portfolio Value */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">$4,247.89</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">+12.5%</span>
                <span className="text-blue-300 text-sm">vs last month</span>
              </div>
            </div>

            {/* Active Wills */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">Active Wills</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-sm font-medium">2 Pending</span>
                <span className="text-blue-300 text-sm">• 1 Active</span>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">Network Status</p>
                  <p className="text-lg font-bold text-green-400">Online</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Gas Price:</span>
                  <span className="text-white">0.001 SUI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">Block Height:</span>
                  <span className="text-white font-mono">#1,234,567</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300">TPS:</span>
                  <span className="text-white">2,847</span>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm">Security Score</p>
                  <p className="text-lg font-bold text-green-400">Excellent</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-blue-300">2FA Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-blue-300">Hardware Wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-blue-300">Encrypted Backup</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardHeader>
            <CardTitle className="text-white">Send Tokens</CardTitle>
            <p className="text-blue-300">Transfer tokens to another wallet</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-blue-300">Recipient Address</Label>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-blue-900/20 border-blue-700 text-white font-mono"
                placeholder="0x..."
              />
            </div>
            <div>
              <Label className="text-blue-300">Amount (SUI)</Label>
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="bg-blue-900/20 border-blue-700 text-white"
                placeholder="0.00"
              />
            </div>
            <Button
              onClick={handleTransfer}
              disabled={!transferAmount || !recipientAddress}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold py-3"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Tokens
            </Button>
          </CardContent>
        </Card>

        {/* Token Distribution Chart */}
        <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
          <CardHeader>
            <CardTitle className="text-white">Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
                <XAxis dataKey="name" stroke="#60a5fa" />
                <YAxis stroke="#60a5fa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    border: '1px solid #1e40af',
                    borderRadius: '12px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Transaction History</CardTitle>
          <p className="text-blue-300">Recent wallet activity and transactions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactionHistory.map((tx, index) => (
              <div key={index} className="bg-gradient-to-r from-black to-blue-950/50 rounded-xl p-4 border border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'Received' ? 'bg-green-500/20 text-green-400' :
                      tx.type === 'Sent' ? 'bg-red-500/20 text-red-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {tx.type === 'Received' ? '↓' : tx.type === 'Sent' ? '↑' : '⚡'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{tx.type}</p>
                      <p className="text-blue-300 text-sm">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} SUI
                    </p>
                    <p className="text-blue-300 text-sm font-mono">
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
    </SharedLayout>
  )
}