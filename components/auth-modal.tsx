"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Wallet,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  X,
  Fingerprint,
  Smartphone,
  Globe,
  Key,
  Loader2
} from "lucide-react"
import WalletCreationModal from "@/components/wallet-creation-modal"
import { GeneratedWallet, ImportedWallet } from "@/lib/wallet-generator"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const router = useRouter()
  const { login } = useAuth()
  const { setWalletFromCreation } = useWallet()
  const [authStep, setAuthStep] = useState<'auth' | 'zk-login' | 'wallet-setup'>('auth')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [zkProvider, setZkProvider] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletMode, setWalletMode] = useState<'create' | 'import'>('create')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (mode === 'signup') {
      if (!formData.username) {
        newErrors.username = "Username is required"
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms and conditions"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate traditional auth, then move to ZK login
    setTimeout(() => {
      setIsLoading(false)
      setAuthStep('zk-login')
    }, 1500)
  }

  const handleZkLogin = async (provider: string) => {
    setZkProvider(provider)
    setIsLoading(true)
    
    // Simulate ZK login process
    setTimeout(() => {
      setIsLoading(false)
      setAuthStep('wallet-setup')
    }, 2000)
  }

  const handleWalletSetup = (walletType: 'create' | 'import') => {
    setWalletMode(walletType)
    setShowWalletModal(true)
  }

  const handleWalletCreated = (wallet: GeneratedWallet | ImportedWallet) => {
    const username = formData.username || formData.email.split('@')[0]
    
    // Set wallet in context with mock balance
    setWalletFromCreation({
      address: wallet.address,
      balance: "1247.89" // Mock initial balance
    }, username)
    
    // Login user
    login(username)
    
    // Close modals and redirect
    setShowWalletModal(false)
    onClose()
    router.push('/dashboard')
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      agreeToTerms: false
    })
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleModeChange = (newMode: 'login' | 'signup') => {
    onModeChange(newMode)
    resetForm()
    setAuthStep('auth')
  }

  const handleClose = () => {
    resetForm()
    setAuthStep('auth')
    setZkProvider(null)
    setShowWalletModal(false)
    onClose()
  }

  const handleBack = () => {
    if (authStep === 'zk-login') {
      setAuthStep('auth')
    } else if (authStep === 'wallet-setup') {
      setAuthStep('zk-login')
    }
    setIsLoading(false)
  }

  const getStepTitle = () => {
    switch (authStep) {
      case 'auth':
        return mode === 'login' ? 'Welcome Back' : 'Create Account'
      case 'zk-login':
        return 'Zero-Knowledge Login'
      case 'wallet-setup':
        return 'Setup Wallet'
      default:
        return 'Authentication'
    }
  }

  const getStepDescription = () => {
    switch (authStep) {
      case 'auth':
        return mode === 'login' 
          ? 'Sign in to access your digital wills' 
          : 'Join thousands securing their digital legacy'
      case 'zk-login':
        return 'Choose your ZK provider for enhanced privacy'
      case 'wallet-setup':
        return 'Create or import your Sui wallet'
      default:
        return 'Secure authentication process'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-xl bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-black font-bold" />
              </div>
              <div>
                <DialogTitle className="text-xl lg:text-2xl font-bold text-white">
                  {getStepTitle()}
                </DialogTitle>
                <DialogDescription className="text-blue-300 text-sm lg:text-base">
                  {getStepDescription()}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-blue-300 hover:text-white hover:bg-blue-900/30"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {['auth', 'zk-login', 'wallet-setup'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  authStep === step ? 'bg-orange-500' : 
                  ['auth', 'zk-login', 'wallet-setup'].indexOf(authStep) > index ? 'bg-green-400' : 'bg-blue-800'
                }`} />
                {index < 2 && <div className="w-8 h-px bg-blue-800" />}
              </div>
            ))}
          </div>

          {/* Network Status */}
          <div className="bg-black/30 rounded-xl p-3 border border-blue-800/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-blue-300">Connected to Sui Network</span>
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: Traditional Auth */}
        {authStep === 'auth' && (
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label className="text-blue-300 flex items-center gap-2 text-sm lg:text-base">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateFormData('username', e.target.value)}
                  className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-blue-300 flex items-center gap-2 text-sm lg:text-base">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-blue-300 flex items-center gap-2 text-sm lg:text-base">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400 pr-10"
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label className="text-blue-300 flex items-center gap-2 text-sm lg:text-base">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400 pr-10"
                      placeholder="Confirm your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Switch
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                      className="mt-1"
                    />
                    <Label className="text-sm text-blue-300 leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-orange-400 hover:text-orange-300 underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-orange-400 hover:text-orange-300 underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-3 text-base lg:text-lg rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Verifying...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Continue to ZK Login
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            {/* Mode Switch */}
            <div className="text-center pt-4 border-t border-blue-900/30">
              <p className="text-blue-300 text-sm">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
                  className="text-orange-400 hover:text-orange-300 font-semibold ml-1 p-0 h-auto"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </Button>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: ZK Login */}
        {authStep === 'zk-login' && (
          <div className="space-y-4 lg:space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Fingerprint className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Zero-Knowledge Authentication</h3>
                <p className="text-blue-300 text-sm lg:text-base">Choose your preferred ZK login provider for enhanced privacy and security</p>
              </div>
            </div>

            {/* ZK Provider Options */}
            <div className="space-y-3 lg:space-y-4">
              {[
                { id: 'google', name: 'Google ZK', icon: Globe, color: 'from-red-500 to-red-600', description: 'Login with Google using zero-knowledge proofs' },
                { id: 'apple', name: 'Apple ZK', icon: Smartphone, color: 'from-gray-500 to-gray-600', description: 'Secure Apple ID authentication with privacy' },
                { id: 'facebook', name: 'Facebook ZK', icon: User, color: 'from-blue-500 to-blue-600', description: 'Facebook login with zero-knowledge technology' },
                { id: 'twitter', name: 'Twitter ZK', icon: Globe, color: 'from-sky-500 to-sky-600', description: 'Twitter authentication with enhanced privacy' }
              ].map((provider) => {
                const Icon = provider.icon
                return (
                  <Button
                    key={provider.id}
                    onClick={() => handleZkLogin(provider.id)}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full p-4 lg:p-6 bg-gradient-to-r from-blue-950/50 to-black/50 border-blue-800/50 hover:border-orange-500/30 text-left h-auto"
                  >
                    <div className="flex items-center gap-3 lg:gap-4 w-full">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${provider.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm lg:text-base">{provider.name}</span>
                          {isLoading && zkProvider === provider.id && (
                            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                          )}
                        </div>
                        <p className="text-blue-300 text-xs lg:text-sm">{provider.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Back Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                Back
              </Button>
            </div>

            {/* ZK Security Info */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm lg:text-base">
                <Key className="w-4 h-4 text-purple-400" />
                Zero-Knowledge Benefits
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">No personal data shared</span>
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">Cryptographic proof of identity</span>
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">Enhanced privacy protection</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Wallet Setup */}
        {authStep === 'wallet-setup' && (
          <div className="space-y-4 lg:space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 lg:w-10 lg:h-10 text-black" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Setup Your Wallet</h3>
                <p className="text-blue-300 text-sm lg:text-base">Create or import a wallet to secure your digital assets on Sui blockchain</p>
              </div>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3 lg:space-y-4">
              <Button
                onClick={() => handleWalletSetup('create')}
                disabled={isLoading}
                className="w-full p-4 lg:p-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold h-auto rounded-xl"
              >
                <div className="flex items-center gap-3 lg:gap-4 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm lg:text-base">Create New Wallet</span>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </div>
                    <p className="text-black/70 text-xs lg:text-sm">Generate a new secure wallet with recovery phrase</p>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                </div>
              </Button>

              <Button
                onClick={() => handleWalletSetup('import')}
                disabled={isLoading}
                variant="outline"
                className="w-full p-4 lg:p-6 bg-gradient-to-r from-blue-950/50 to-black/50 border-blue-800/50 hover:border-orange-500/30 text-white h-auto rounded-xl"
              >
                <div className="flex items-center gap-3 lg:gap-4 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm lg:text-base">Import Existing Wallet</span>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                      )}
                    </div>
                    <p className="text-blue-300 text-xs lg:text-sm">Import wallet using recovery phrase or private key</p>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
                </div>
              </Button>
            </div>

            {/* Back Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                Back
              </Button>
            </div>

            {/* Wallet Security Info */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm lg:text-base">
                <Shield className="w-4 h-4 text-green-400" />
                Wallet Security
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">Hardware-grade encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">Secure recovery phrase backup</span>
                </div>
                <div className="flex items-center gap-2 text-xs lg:text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-blue-300">Multi-signature support</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Wallet Creation Modal */}
      <WalletCreationModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletCreated={handleWalletCreated}
        mode={walletMode}
      />
    </Dialog>
  )
}