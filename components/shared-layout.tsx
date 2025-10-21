"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { formatAddress } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Activity,
  Plus,
  Users,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SharedLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  headerAction?: React.ReactNode
  toastMessage?: string | null
}

export default function SharedLayout({ 
  children, 
  title, 
  subtitle, 
  headerAction,
  toastMessage 
}: SharedLayoutProps) {
  const { userId, logout } = useAuth()
  const { address } = useWallet()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/create", label: "Create Will", icon: Plus },
    { href: "/beneficiaries", label: "Beneficiaries", icon: Users },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="h-screen  text-white flex overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-orange-500 text-black px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right border border-orange-400">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Static Sidebar */}
      <div className={`w-72 bg-gradient-to-b from-blue-950 to-black border-r border-blue-900/50 flex flex-col fixed inset-y-0 left-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:transform-none`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-black/50 border-b border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AjogunNet</span>
              <p className="text-xs text-blue-300">Digital Will Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">Main Menu</p>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20 shadow-sm'
                        : 'text-blue-200 hover:text-white hover:bg-blue-900/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">Settings</p>
            <div className="space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-xl transition-all duration-200">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-blue-900/30">
          <div className="bg-gradient-to-r from-blue-900/50 to-black/50 rounded-xl p-4 border border-blue-800/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">{userId?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userId}</p>
                <p className="text-xs text-blue-300 truncate">{address ? formatAddress(address) : 'Not connected'}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-blue-700 text-blue-200 hover:bg-blue-900/50 hover:text-white hover:border-blue-600 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <header className="bg-gradient-to-r from-blue-950 to-black border-b border-blue-900/50 px-6 py-5 shadow-lg sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-blue-300 hover:text-white p-2 rounded-lg hover:bg-blue-900/30 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{title}</h1>
                <p className="text-blue-300 mt-1">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-black/50 px-4 py-2 rounded-xl border border-blue-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">Sui Network</span>
                </div>
              </div>
              {headerAction}
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 bg-black overflow-y-auto min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}