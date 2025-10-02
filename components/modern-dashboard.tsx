"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
import { mockWills } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SharedLayout from "@/components/shared-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts"
import {
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  Trash2,
  RefreshCw,
  Plus,
  Eye,
  Timer
} from "lucide-react"

interface Will {
  willIndex: number
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
}

export default function ModernDashboard() {
  const { userId } = useAuth()
  const { revokeWill, updateActivity } = useApi()
  const [wills, setWills] = useState<Will[]>(mockWills)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Toast notification function
  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Timer calculation for active wills
  const calculateTimeRemaining = (will: Will) => {
    if (will.status !== 'active') return null
    
    const lastActivity = new Date(will.lastActivity)
    const duration = will.duration || 365 // default 1 year
    const expiryDate = new Date(lastActivity.getTime() + duration * 24 * 60 * 60 * 1000)
    const now = new Date()
    const timeRemaining = expiryDate.getTime() - now.getTime()
    
    if (timeRemaining <= 0) return { expired: true }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes, expired: false }
  }

  // Handle will revocation
  const handleRevokeWill = async (willIndex: number) => {
    try {
      await revokeWill(willIndex, userId!, "password")
      setWills(prev => prev.map(w => 
        w.willIndex === willIndex ? { ...w, status: 'revoked' as const } : w
      ))
      showToast(`Will #${willIndex} has been revoked successfully`)
    } catch (error) {
      showToast("Failed to revoke will. Please try again.")
    }
  }

  // Handle activity update
  const handleUpdateActivity = async (willIndex: number) => {
    try {
      await updateActivity(willIndex, userId!, "password")
      setWills(prev => prev.map(w => 
        w.willIndex === willIndex ? { ...w, lastActivity: new Date().toISOString() } : w
      ))
      showToast(`Activity updated for Will #${willIndex}`)
    } catch (error) {
      showToast("Failed to update activity. Please try again.")
    }
  }

  // Chart data
  const portfolioData = [
    { name: 'SUI', value: 1247.89, color: '#FF8C00' },
    { name: 'USDC', value: 5000.00, color: '#1E40AF' },
    { name: 'ETH', value: 2.45 * 2000, color: '#374151' }
  ]

  const willsOverTimeData = [
    { month: 'Jan', active: 2, executed: 0, revoked: 0 },
    { month: 'Feb', active: 3, executed: 0, revoked: 0 },
    { month: 'Mar', active: 3, executed: 1, revoked: 0 },
    { month: 'Apr', active: 2, executed: 1, revoked: 1 }
  ]

  const valueDistributionData = wills.map(will => ({
    name: `Will #${will.willIndex}`,
    value: will.totalValue || 0,
    status: will.status
  }))

  const headerAction = (
    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
      <Plus className="w-4 h-4 mr-2" />
      New Will
    </Button>
  )

  return (
    <SharedLayout
      title="Dashboard"
      subtitle="Manage your digital wills and crypto assets"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Total Balance</p>
                    <p className="text-3xl font-bold text-white mt-2">${(1247.89 + 5000 + 4900).toLocaleString()}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Active Wills</p>
                    <p className="text-3xl font-bold text-white mt-2">{wills.filter(w => w.status === 'active').length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-7 h-7 text-black" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-orange-400 text-sm font-medium">
                  <Activity className="w-4 h-4 mr-2" />
                  {wills.filter(w => w.status === 'active').length} monitoring
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Beneficiaries</p>
                    <p className="text-3xl font-bold text-white mt-2">{wills.reduce((sum, w) => sum + w.heirs.length, 0)}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Across {wills.length} wills
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Executed Wills</p>
                    <p className="text-3xl font-bold text-white mt-2">{wills.filter(w => w.status === 'executed').length}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Successfully distributed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Portfolio Distribution */}
            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold">Portfolio Distribution</CardTitle>
                <CardDescription className="text-blue-300">Your asset allocation breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000', 
                        border: '1px solid #1e40af',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Wills Over Time */}
            <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold">Wills Activity</CardTitle>
                <CardDescription className="text-blue-300">Monthly will status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={willsOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#60a5fa" fontSize={12} />
                    <YAxis stroke="#60a5fa" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000', 
                        border: '1px solid #1e40af',
                        borderRadius: '12px',
                        color: '#ffffff'
                      }}
                    />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="executed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="revoked" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Wills List */}
          <Card className="bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl font-bold">Your Digital Wills</CardTitle>
                  <CardDescription className="text-blue-300 mt-2">Manage and monitor your blockchain-secured wills</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold px-6 py-3 rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Will
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {wills.map((will) => {
                const timeRemaining = calculateTimeRemaining(will)
                return (
                  <div key={will.willIndex} className="bg-gradient-to-r from-black to-blue-950/50 rounded-xl p-6 border border-blue-800/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Will #{will.willIndex}</h3>
                          <p className="text-blue-300 text-sm mt-1">{will.heirs.length} beneficiaries • ${will.totalValue?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                          will.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          will.status === 'executed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Timer for active wills */}
                    {will.status === 'active' && timeRemaining && !timeRemaining.expired && (
                      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Timer className="w-5 h-5 text-orange-400" />
                          <span className="text-lg font-semibold text-white">Time until execution</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-3xl font-bold text-orange-400">{timeRemaining.days}</div>
                            <div className="text-sm text-blue-300 mt-1">Days</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-3xl font-bold text-orange-400">{timeRemaining.hours}</div>
                            <div className="text-sm text-blue-300 mt-1">Hours</div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-3xl font-bold text-orange-400">{timeRemaining.minutes}</div>
                            <div className="text-sm text-blue-300 mt-1">Minutes</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Will Analytics */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Beneficiary Distribution</h4>
                      <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
                        <ResponsiveContainer width="100%" height={120}>
                          <BarChart data={will.heirs.map((heir, index) => ({
                            name: `Heir ${index + 1}`,
                            percentage: will.shares[index],
                            value: (will.totalValue || 0) * (will.shares[index] / 100)
                          }))}>
                            <XAxis dataKey="name" stroke="#60a5fa" fontSize={12} />
                            <YAxis stroke="#60a5fa" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#000000', 
                                border: '1px solid #1e40af',
                                borderRadius: '12px',
                                color: '#ffffff'
                              }}
                            />
                            <Bar dataKey="percentage" fill="#f97316" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50 hover:text-white flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {will.status === 'active' && (
                        <>
                          <Button 
                            onClick={() => handleUpdateActivity(will.willIndex)}
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold flex-1"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Update Activity
                          </Button>
                          
                          <Button 
                            onClick={() => handleRevokeWill(will.willIndex)}
                            variant="outline" 
                            size="sm"
                            className="bg-transparent border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Revoke
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
    </SharedLayout>
  )
}