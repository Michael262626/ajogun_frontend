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
import { CryptoIcon } from "@/components/ui/crypto-icons"

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
    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
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
        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold text-foreground mt-2">${(1247.89 + 5000 + 4900).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Active Wills</p>
                <p className="text-3xl font-bold text-foreground mt-2">{wills.filter(w => w.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-orange-500 text-sm font-medium">
              <Activity className="w-4 h-4 mr-2" />
              {wills.filter(w => w.status === 'active').length} monitoring
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Beneficiaries</p>
                <p className="text-3xl font-bold text-foreground mt-2">{wills.reduce((sum, w) => sum + w.heirs.length, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-purple-500 text-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Across {wills.length} wills
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Executed Wills</p>
                <p className="text-3xl font-bold text-foreground mt-2">{wills.filter(w => w.status === 'executed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-500 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Successfully distributed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Distribution */}
        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-xl font-bold">Portfolio Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">Your asset allocation breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
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
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CryptoIcon symbol={item.name} size={16} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wills Over Time */}
        <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-xl font-bold">Wills Activity</CardTitle>
            <CardDescription className="text-muted-foreground">Monthly will status changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={willsOverTimeData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="executed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revoked" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Executed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Revoked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wills List */}
      <Card className="bg-card border border-border hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-2xl font-bold">Your Digital Wills</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">Manage and monitor your blockchain-secured wills</CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Create New Will
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {wills.map((will) => {
            const timeRemaining = calculateTimeRemaining(will)
            return (
              <div key={will.willIndex} className="bg-muted/30 rounded-xl p-6 border border-border hover:shadow-md transition-all duration-300 hover:bg-muted/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Will #{will.willIndex}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{will.heirs.length} beneficiaries • ${will.totalValue?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${will.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      will.status === 'executed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Timer for active wills */}
                {will.status === 'active' && timeRemaining && !timeRemaining.expired && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 dark:bg-orange-900/10 dark:border-orange-800/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Timer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <span className="text-lg font-semibold text-foreground">Time until execution</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.days}</div>
                        <div className="text-sm text-muted-foreground mt-1">Days</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.hours}</div>
                        <div className="text-sm text-muted-foreground mt-1">Hours</div>
                      </div>
                      <div className="bg-card rounded-lg p-3 border border-border">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.minutes}</div>
                        <div className="text-sm text-muted-foreground mt-1">Minutes</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Will Analytics */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Beneficiary Distribution</h4>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={will.heirs.map((heir, index) => ({
                        name: `Heir ${index + 1}`,
                        percentage: will.shares[index],
                        value: (will.totalValue || 0) * (will.shares[index] / 100)
                      }))} barCategoryGap="15%">
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Bar dataKey="percentage" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>

                  {will.status === 'active' && (
                    <>
                      <Button
                        onClick={() => handleUpdateActivity(will.willIndex)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Activity
                      </Button>

                      <Button
                        onClick={() => handleRevokeWill(will.willIndex)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
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