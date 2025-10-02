"use client"

import { useState } from "react"
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
  Copy,
  Eye,
  EyeOff,
  Wallet,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  Key,
  Loader2,
  AlertTriangle,
  FileText
} from "lucide-react"
import { 
  createWallet, 
  importWalletFromMnemonic, 
  importWalletFromPrivateKey,
  GeneratedWallet,
  ImportedWallet,
  formatPrivateKey
} from "@/lib/wallet-generator"

interface WalletCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletCreated: (wallet: GeneratedWallet | ImportedWallet) => void
  mode: 'create' | 'import'
}

export default function WalletCreationModal({ 
  isOpen, 
  onClose, 
  onWalletCreated, 
  mode 
}: WalletCreationModalProps) {
  const [step, setStep] = useState<'setup' | 'creating' | 'backup' | 'verify' | 'import-form' | 'importing'>('setup')
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null)
  const [importData, setImportData] = useState({
    mnemonic: '',
    privateKey: '',
    importType: 'mnemonic' as 'mnemonic' | 'privateKey'
  })
  const [backupConfirmed, setBackupConfirmed] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [verificationWords, setVerificationWords] = useState<number[]>([])
  const [userVerification, setUserVerification] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateWallet = async () => {
    setStep('creating')
    setIsLoading(true)
    setError(null)
    
    try {
      const newWallet = await createWallet()
      setWallet(newWallet)
      setStep('backup')
      
      // Generate random word positions for verification
      const positions = Array.from({ length: 3 }, () => 
        Math.floor(Math.random() * 12)
      ).sort((a, b) => a - b)
      setVerificationWords(positions)
      setUserVerification(new Array(3).fill(''))
    } catch (err) {
      setError('Failed to create wallet. Please try again.')
      setStep('setup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportWallet = async () => {
    setStep('importing')
    setIsLoading(true)
    setError(null)
    
    try {
      let importedWallet: ImportedWallet
      
      if (importData.importType === 'mnemonic') {
        importedWallet = await importWalletFromMnemonic(importData.mnemonic)
      } else {
        importedWallet = await importWalletFromPrivateKey(importData.privateKey)
      }
      
      if (!importedWallet.isValid) {
        setError('Invalid mnemonic phrase or private key. Please check and try again.')
        setStep('import-form')
        return
      }
      
      onWalletCreated(importedWallet)
      onClose()
    } catch (err) {
      setError('Failed to import wallet. Please try again.')
      setStep('import-form')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyMnemonic = () => {
    if (!wallet) return
    
    const isCorrect = verificationWords.every((position, index) => 
      userVerification[index].toLowerCase().trim() === wallet.mnemonic[position].toLowerCase()
    )
    
    if (isCorrect) {
      onWalletCreated(wallet)
      onClose()
    } else {
      setError('Verification failed. Please check the words and try again.')
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const downloadBackup = () => {
    if (!wallet) return
    
    const backupData = {
      address: wallet.address,
      mnemonic: wallet.mnemonic.join(' '),
      derivationPath: wallet.derivationPath,
      createdAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sui-wallet-backup-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetModal = () => {
    setStep(mode === 'create' ? 'setup' : 'import-form')
    setWallet(null)
    setImportData({ mnemonic: '', privateKey: '', importType: 'mnemonic' })
    setBackupConfirmed(false)
    setShowPrivateKey(false)
    setVerificationWords([])
    setUserVerification([])
    setError(null)
    setIsLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl bg-gradient-to-br from-blue-950 to-black border border-blue-800/50 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <DialogTitle className="text-xl lg:text-2xl font-bold text-white">
                {mode === 'create' ? 'Create New Wallet' : 'Import Wallet'}
              </DialogTitle>
              <DialogDescription className="text-blue-300">
                {mode === 'create' 
                  ? 'Generate a secure Sui wallet with recovery phrase'
                  : 'Import your existing wallet using mnemonic or private key'
                }
              </DialogDescription>
            </div>
          </div>

          {/* Progress Indicator for Create Mode */}
          {mode === 'create' && (
            <div className="flex items-center gap-2">
              {['setup', 'backup', 'verify'].map((stepName, index) => (
                <div key={stepName} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full transition-colors ${
                    step === stepName ? 'bg-orange-500' : 
                    ['setup', 'backup', 'verify'].indexOf(step) > index ? 'bg-green-400' : 'bg-blue-800'
                  }`} />
                  {index < 2 && <div className="w-8 h-px bg-blue-800" />}
                </div>
              ))}
            </div>
          )}
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Step 1: Setup (Create Mode) */}
        {mode === 'create' && step === 'setup' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Secure Wallet Generation</h3>
                <p className="text-blue-300">Your wallet will be generated locally with military-grade encryption</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-blue-800/30 space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-orange-400" />
                What You'll Get
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-300">Unique Sui wallet address</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-300">12-word recovery phrase</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-300">Private & public key pair</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-blue-300">Full control of your assets</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-orange-400 font-semibold mb-1">Important Security Notice</h4>
                  <p className="text-orange-300 text-sm">
                    Your recovery phrase is the only way to restore your wallet. 
                    Keep it safe and never share it with anyone.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreateWallet}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-4 text-lg rounded-xl"
            >
              <Shield className="w-5 h-5 mr-2" />
              Generate Secure Wallet
            </Button>
          </div>
        )}

        {/* Step 2: Creating Wallet */}
        {step === 'creating' && (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-black animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Generating Your Wallet</h3>
              <p className="text-blue-300">Creating secure keys and connecting to Sui network...</p>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-blue-900/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-blue-400 text-sm">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Step 3: Backup Recovery Phrase */}
        {step === 'backup' && wallet && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Backup Recovery Phrase</h3>
                <p className="text-blue-300">Write down these 12 words in order. You'll need them to verify and restore your wallet.</p>
              </div>
            </div>

            {/* Mnemonic Display */}
            <div className="bg-black/50 rounded-xl p-6 border border-blue-800/30">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {wallet.mnemonic.map((word, index) => (
                  <div key={index} className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 text-sm font-mono">{index + 1}.</span>
                      <span className="text-white font-semibold">{word}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => copyToClipboard(wallet.mnemonic.join(' '), 'mnemonic')}
                variant="outline"
                className="flex-1 bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Phrase
              </Button>
              <Button
                onClick={downloadBackup}
                variant="outline"
                className="flex-1 bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
            </div>

            {/* Confirmation */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Switch
                  checked={backupConfirmed}
                  onCheckedChange={setBackupConfirmed}
                  className="mt-1"
                />
                <Label className="text-sm text-blue-300 leading-relaxed">
                  I have safely stored my recovery phrase and understand that losing it means losing access to my wallet forever.
                </Label>
              </div>

              <Button
                onClick={() => setStep('verify')}
                disabled={!backupConfirmed}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-3 rounded-xl disabled:opacity-50"
              >
                Continue to Verification
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Verify Recovery Phrase */}
        {step === 'verify' && wallet && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Verify Recovery Phrase</h3>
                <p className="text-blue-300">Enter the requested words from your recovery phrase to confirm you've saved it correctly.</p>
              </div>
            </div>

            <div className="space-y-4">
              {verificationWords.map((position, index) => (
                <div key={position} className="space-y-2">
                  <Label className="text-blue-300">
                    Word #{position + 1}
                  </Label>
                  <Input
                    value={userVerification[index]}
                    onChange={(e) => {
                      const newVerification = [...userVerification]
                      newVerification[index] = e.target.value
                      setUserVerification(newVerification)
                    }}
                    className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400"
                    placeholder={`Enter word #${position + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('backup')}
                variant="outline"
                className="flex-1 bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleVerifyMnemonic}
                disabled={userVerification.some(word => !word.trim())}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl"
              >
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Import Form */}
        {mode === 'import' && step === 'import-form' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Key className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Import Your Wallet</h3>
                <p className="text-blue-300">Enter your recovery phrase or private key to restore your wallet</p>
              </div>
            </div>

            {/* Import Type Selection */}
            <div className="flex gap-2 bg-blue-900/20 rounded-xl p-1">
              <Button
                onClick={() => setImportData(prev => ({ ...prev, importType: 'mnemonic' }))}
                variant={importData.importType === 'mnemonic' ? 'default' : 'ghost'}
                className={`flex-1 ${importData.importType === 'mnemonic' 
                  ? 'bg-orange-500 text-black' 
                  : 'text-blue-300 hover:text-white'
                }`}
              >
                Recovery Phrase
              </Button>
              <Button
                onClick={() => setImportData(prev => ({ ...prev, importType: 'privateKey' }))}
                variant={importData.importType === 'privateKey' ? 'default' : 'ghost'}
                className={`flex-1 ${importData.importType === 'privateKey' 
                  ? 'bg-orange-500 text-black' 
                  : 'text-blue-300 hover:text-white'
                }`}
              >
                Private Key
              </Button>
            </div>

            {/* Import Input */}
            <div className="space-y-2">
              <Label className="text-blue-300">
                {importData.importType === 'mnemonic' ? 'Recovery Phrase (12 or 24 words)' : 'Private Key'}
              </Label>
              {importData.importType === 'mnemonic' ? (
                <textarea
                  value={importData.mnemonic}
                  onChange={(e) => setImportData(prev => ({ ...prev, mnemonic: e.target.value }))}
                  className="w-full h-32 bg-blue-900/20 border border-blue-700 rounded-lg p-3 text-white placeholder:text-blue-400 resize-none"
                  placeholder="Enter your 12 or 24 word recovery phrase separated by spaces"
                />
              ) : (
                <div className="relative">
                  <Input
                    type={showPrivateKey ? "text" : "password"}
                    value={importData.privateKey}
                    onChange={(e) => setImportData(prev => ({ ...prev, privateKey: e.target.value }))}
                    className="bg-blue-900/20 border-blue-700 text-white placeholder:text-blue-400 pr-10 font-mono"
                    placeholder="Enter your private key (64 characters)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              )}
            </div>

            <Button
              onClick={handleImportWallet}
              disabled={isLoading || (!importData.mnemonic.trim() && !importData.privateKey.trim())}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-3 text-lg rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing Wallet...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Import Wallet
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Importing State */}
        {step === 'importing' && (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Importing Your Wallet</h3>
              <p className="text-blue-300">Validating and restoring your wallet...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}