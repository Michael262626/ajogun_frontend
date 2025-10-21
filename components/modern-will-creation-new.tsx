"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { useApi } from "@/hooks/use-api"
import { mockBeneficiaries } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SharedLayout from "@/components/shared-layout"
import {
  Users,
  Wallet,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  Timer
} from "lucide-react"

interface Beneficiary {
  id: string
  name: string
  relationship: string
  walletAddress: string
  percentage: number
  status: "verified" | "pending"
}

interface WillDuration {
  type: 'months' | 'years'
  value: number
  customDate?: Date
}

export default function ModernWillCreationNew() {
  const { address } = useWallet()
  const { createWill } = useApi()
  const [currentStep, setCurrentStep] = useState(1)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries)
  const [willAmount, setWillAmount] = useState("1000")
  const [duration, setDuration] = useState<WillDuration>({ type: 'years', value: 1 })
  const [willTitle, setWillTitle] = useState("")
  const [willDescription, setWillDescription] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const steps = [
    { id: 1, title: "Will Details", description: "Basic information", icon: Shield },
    { id: 2, title: "Beneficiaries", description: "Add recipients", icon: Users },
    { id: 3, title: "Assets & Duration", description: "Assets and timing", icon: Wallet },
    { id: 4, title: "Review & Deploy", description: "Finalize and deploy", icon: CheckCircle },
  ]

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0)

  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      walletAddress: "",
      percentage: 0,
      status: "pending",
    }
    setBeneficiaries([...beneficiaries, newBeneficiary])
  }

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id))
  }

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ))
  }

  const calculateExpirationDate = () => {
    const now = new Date()
    if (duration.customDate) {
      return duration.customDate
    }
    
    if (duration.type === 'months') {
      return new Date(now.getFullYear(), now.getMonth() + duration.value, now.getDate())
    } else {
      return new Date(now.getFullYear() + duration.value, now.getMonth(), now.getDate())
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      const expirationDate = calculateExpirationDate()
      const willData = {
        userId: "user123",
        password: "password",
        title: willTitle,
        description: willDescription,
        heirs: beneficiaries.map(b => b.walletAddress),
        shares: beneficiaries.map(b => b.percentage),
        amount: willAmount,
        duration: duration,
        expirationDate: expirationDate.toISOString(),
        createdAt: new Date().toISOString()
      }
      
      const result = await createWill(willData)
      
      if (result?.success) {
        showToast(`Will "${willTitle}" created successfully! Countdown started.`)
        // Store will creation time for countdown
        localStorage.setItem(`will_${result.willIndex}_created`, new Date().toISOString())
        localStorage.setItem(`will_${result.willIndex}_expires`, expirationDate.toISOString())
      } else {
        showToast("Failed to create will. Please try again.")
      }
    } catch (error) {
      showToast("Error creating will. Please try again.")
    } finally {
      setIsDeploying(false)
    }
  }

  const headerAction = (
    <div className="flex items-center gap-4">
      <div className="text-sm text-muted-foreground">
        Step {currentStep} of {steps.length}
      </div>
      <Button 
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold px-6 py-2 rounded-xl"
        disabled={currentStep !== 4 || totalPercentage !== 100 || !willTitle.trim() || isDeploying}
        onClick={handleDeploy}
      >
        {isDeploying ? "Deploying..." : "Deploy Will"}
      </Button>
    </div>
  )

  return (
    <SharedLayout
      title="Create Digital Will"
      subtitle="Set up your blockchain-secured inheritance plan"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-orange-500/10 border border-orange-500/30' 
                    : isCompleted 
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-muted border border-border'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-orange-500 text-black' 
                      : isCompleted 
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-white'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-border mx-4"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Will Information</CardTitle>
            <p className="text-muted-foreground">Provide basic details about your digital will</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Will Title *</Label>
                <Input
                  value={willTitle}
                  onChange={(e) => setWillTitle(e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="e.g., Family Inheritance Will"
                />
                <p className="text-xs text-muted-foreground">Give your will a descriptive name</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Creator</Label>
                <Input
                  value={address || "Not connected"}
                  disabled
                  className="bg-muted border-border text-muted-foreground font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Your connected wallet address</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Description (Optional)</Label>
              <textarea
                value={willDescription}
                onChange={(e) => setWillDescription(e.target.value)}
                className="w-full h-24 bg-input border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none"
                placeholder="Describe the purpose of this will and any special instructions..."
              />
              <p className="text-xs text-muted-foreground">Additional context for beneficiaries</p>
            </div>

            <div className="bg-muted rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-green-500" />
                <h3 className="text-foreground font-semibold">Security Features</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Blockchain immutability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Smart contract automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Cryptographic security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Decentralized execution</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Add Beneficiaries</CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Specify who will inherit your digital assets</p>
              <div className="text-right">
                <div className={`text-2xl font-bold ${totalPercentage === 100 ? 'text-green-500' : 'text-orange-500'}`}>
                  {totalPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">Total Allocation</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-blue-300">Name</Label>
                    <Input
                      value={beneficiary.name}
                      onChange={(e) => updateBeneficiary(beneficiary.id, 'name', e.target.value)}
                      className="bg-blue-900/20 border-blue-700 text-white"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label className="text-blue-300">Relationship</Label>
                    <Input
                      value={beneficiary.relationship}
                      onChange={(e) => updateBeneficiary(beneficiary.id, 'relationship', e.target.value)}
                      className="bg-blue-900/20 border-blue-700 text-white"
                      placeholder="e.g., Son, Daughter"
                    />
                  </div>
                  <div>
                    <Label className="text-blue-300">Wallet Address</Label>
                    <Input
                      value={beneficiary.walletAddress}
                      onChange={(e) => updateBeneficiary(beneficiary.id, 'walletAddress', e.target.value)}
                      className="bg-blue-900/20 border-blue-700 text-white font-mono text-sm"
                      placeholder="0x..."
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-blue-300">Percentage</Label>
                      <Input
                        type="number"
                        value={beneficiary.percentage}
                        onChange={(e) => updateBeneficiary(beneficiary.id, 'percentage', parseInt(e.target.value) || 0)}
                        className="bg-blue-900/20 border-blue-700 text-white"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBeneficiary(beneficiary.id)}
                      className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              onClick={addBeneficiary}
              variant="outline"
              className="w-full bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Beneficiary
            </Button>

            {totalPercentage !== 100 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-400 text-sm">
                  Total allocation must equal 100%. Currently: {totalPercentage}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Assets & Duration</CardTitle>
            <p className="text-blue-300">Set the assets and execution timeline for your will</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assets Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-400" />
                Digital Assets
              </h3>
              <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
                <Label className="text-blue-300">Will Amount (SUI) *</Label>
                <Input
                  type="number"
                  value={willAmount}
                  onChange={(e) => setWillAmount(e.target.value)}
                  className="bg-blue-900/20 border-blue-700 text-white text-lg mt-2"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-blue-300 mt-2">
                  This amount will be locked in the smart contract and distributed to beneficiaries
                </p>
              </div>
            </div>

            {/* Duration Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Execution Timeline
              </h3>
              
              <div className="bg-black/30 rounded-xl p-4 border border-blue-800/30 space-y-4">
                <div>
                  <Label className="text-blue-300 mb-3 block">Duration Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setDuration(prev => ({ ...prev, type: 'months' }))}
                      variant={duration.type === 'months' ? 'default' : 'outline'}
                      className={`flex-1 ${duration.type === 'months' 
                        ? 'bg-orange-500 text-black' 
                        : 'bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Months
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setDuration(prev => ({ ...prev, type: 'years' }))}
                      variant={duration.type === 'years' ? 'default' : 'outline'}
                      className={`flex-1 ${duration.type === 'years' 
                        ? 'bg-orange-500 text-black' 
                        : 'bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50'
                      }`}
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Years
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-blue-300">
                    Duration ({duration.type === 'months' ? 'Months' : 'Years'}) *
                  </Label>
                  <Input
                    type="number"
                    value={duration.value}
                    onChange={(e) => setDuration(prev => ({ ...prev, value: parseInt(e.target.value) || 1 }))}
                    className="bg-blue-900/20 border-blue-700 text-white mt-2"
                    placeholder="1"
                    min="1"
                    max={duration.type === 'months' ? 120 : 10}
                  />
                  <p className="text-xs text-blue-400 mt-1">
                    {duration.type === 'months' ? 'Maximum 120 months (10 years)' : 'Maximum 10 years'}
                  </p>
                </div>

                <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-white font-medium">Execution Date</span>
                  </div>
                  <p className="text-blue-300 text-sm">
                    Will executes on: <span className="text-orange-400 font-semibold">
                      {calculateExpirationDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                  <p className="text-blue-400 text-xs mt-1">
                    Countdown will start immediately after deployment
                  </p>
                </div>
              </div>
            </div>

            {/* Duration Presets */}
            <div className="space-y-3">
              <Label className="text-blue-300">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '6 Months', type: 'months' as const, value: 6 },
                  { label: '1 Year', type: 'years' as const, value: 1 },
                  { label: '2 Years', type: 'years' as const, value: 2 },
                  { label: '5 Years', type: 'years' as const, value: 5 }
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    onClick={() => setDuration({ type: preset.type, value: preset.value })}
                    variant="outline"
                    size="sm"
                    className={`${
                      duration.type === preset.type && duration.value === preset.value
                        ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                        : 'bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50'
                    }`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Review & Deploy</CardTitle>
            <p className="text-blue-300">Review your will details before deployment</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Will Overview */}
            <div className="bg-black/30 rounded-xl p-6 border border-blue-800/30">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                Will Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-300 text-sm">Title:</span>
                    <p className="text-white font-semibold">{willTitle || "Untitled Will"}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 text-sm">Total Amount:</span>
                    <p className="text-white font-semibold text-lg">{willAmount} SUI</p>
                  </div>
                  <div>
                    <span className="text-blue-300 text-sm">Beneficiaries:</span>
                    <p className="text-white font-semibold">{beneficiaries.length} recipients</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-300 text-sm">Duration:</span>
                    <p className="text-white font-semibold">{duration.value} {duration.type}</p>
                  </div>
                  <div>
                    <span className="text-blue-300 text-sm">Execution Date:</span>
                    <p className="text-orange-400 font-semibold">
                      {calculateExpirationDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-300 text-sm">Status:</span>
                    <p className="text-green-400 font-semibold">Ready to Deploy</p>
                  </div>
                </div>
              </div>
              
              {willDescription && (
                <div className="mt-4 pt-4 border-t border-blue-800/30">
                  <span className="text-blue-300 text-sm">Description:</span>
                  <p className="text-white mt-1">{willDescription}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-white font-semibold">Beneficiaries</h3>
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="bg-black/30 rounded-xl p-4 border border-blue-800/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{beneficiary.name}</p>
                      <p className="text-blue-300 text-sm">{beneficiary.relationship}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 font-bold">{beneficiary.percentage}%</p>
                      <p className="text-blue-300 text-sm">{(parseFloat(willAmount) * beneficiary.percentage / 100).toFixed(2)} SUI</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          disabled={
            currentStep === 4 || 
            (currentStep === 1 && !willTitle.trim()) ||
            (currentStep === 2 && totalPercentage !== 100) ||
            (currentStep === 3 && (!willAmount || parseFloat(willAmount) <= 0))
          }
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </SharedLayout>
  )
}