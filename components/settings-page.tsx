"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import SharedLayout from "@/components/shared-layout"
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Eye,
  EyeOff,
  Copy,
  Check,
  Save,
  Camera,
  Wallet,
  QrCode,
  ExternalLink,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
  Fingerprint,
  Key,
  Lock,
  Unlock
} from "lucide-react"

export default function SettingsPage() {
  const { userId, logout } = useAuth()
  const { address, balance } = useWallet()
  
  // Settings state
  const [activeTab, setActiveTab] = useState("profile")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [copied, setCopied] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    displayName: userId || "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: ""
  })
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: true,
    autoLockEnabled: true,
    autoLockTime: "5",
    transactionConfirmation: true,
    passwordRequired: true,
    sessionTimeout: "30"
  })
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    priceAlerts: true,
    newsUpdates: false,
    marketingEmails: false,
    soundEnabled: true,
    vibrationEnabled: true
  })
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    compactMode: false,
    animationsEnabled: true,
    highContrast: false
  })
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    hideBalance: false,
    analyticsEnabled: true,
    crashReportsEnabled: true,
    dataSharing: false,
    locationTracking: false,
    advertisingId: true,
    cookiesEnabled: true
  })

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    showToast(`${type} copied to clipboard`)
    setTimeout(() => setCopied(""), 2000)
  }

  const handleSave = () => {
    showToast("Settings saved successfully")
  }

  const handleExportData = () => {
    showToast("Data export initiated")
  }

  const handleImportData = () => {
    showToast("Data import feature coming soon")
  }

  const mockPrivateKey = "0x1234567890abcdef1234567890abcdef12345678"
  const mockSeedPhrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

  const headerAction = (
    <div className="flex items-center gap-3">
      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )

  return (
    <SharedLayout
      title="Settings"
      subtitle="Manage your account, security, and preferences"
      headerAction={headerAction}
      toastMessage={toastMessage}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{userId?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Display Name</Label>
                  <Input
                    value={profileData.displayName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email Address</Label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Location</Label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter your location"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Bio</Label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full h-20 bg-input border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Wallet Information */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Wallet Information</CardTitle>
                <CardDescription>Your connected wallet details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Primary Wallet</p>
                        <p className="text-sm text-muted-foreground">SUI Network</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-foreground">
                          {address ? `${address.slice(0, 8)}...${address.slice(-8)}` : 'Not connected'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => address && handleCopy(address, "Address")}
                          className="h-6 w-6 p-0"
                        >
                          {copied === "Address" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="text-sm font-semibold text-foreground">{balance} SUI</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <span className="text-sm text-foreground">SUI Mainnet</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Authentication</CardTitle>
                <CardDescription>Manage your login and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Biometric Authentication</p>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                  </div>
                  <Switch
                    checked={securitySettings.biometricEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, biometricEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Auto Lock</p>
                    <p className="text-sm text-muted-foreground">Lock app when inactive</p>
                  </div>
                  <Switch
                    checked={securitySettings.autoLockEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, autoLockEnabled: checked }))
                    }
                  />
                </div>

                {securitySettings.autoLockEnabled && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Auto Lock Time (minutes)</Label>
                    <select
                      value={securitySettings.autoLockTime}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, autoLockTime: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                    >
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Transaction Confirmation</p>
                    <p className="text-sm text-muted-foreground">Require confirmation for transactions</p>
                  </div>
                  <Switch
                    checked={securitySettings.transactionConfirmation}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, transactionConfirmation: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup & Recovery */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Backup & Recovery</CardTitle>
                <CardDescription>Secure your wallet with backup options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 dark:bg-orange-900/20 dark:border-orange-800">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Backup Your Wallet</p>
                      <p className="text-sm text-muted-foreground">Save your recovery phrase securely</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground">Recovery Phrase</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                        >
                          {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted border border-border rounded-lg p-3">
                      <span className="text-sm font-mono text-foreground">
                        {showSeedPhrase ? mockSeedPhrase : "•••••••• •••••••• •••••••• •••••••• •••••••• ••••••••"}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(mockSeedPhrase, "Recovery Phrase")}
                      >
                        {copied === "Recovery Phrase" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Private Key</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                      >
                        {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted border border-border rounded-lg p-3">
                    <span className="text-sm font-mono text-foreground">
                      {showPrivateKey ? mockPrivateKey : "••••••••••••••••••••••••••••••••••••••••"}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(mockPrivateKey, "Private Key")}
                    >
                      {copied === "Private Key" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
  
      {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">General Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Get updates via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive text messages</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Alert Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Transaction Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify on transactions</p>
                    </div>
                    <Switch
                      checked={notificationSettings.transactionAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, transactionAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Price Alerts</p>
                      <p className="text-sm text-muted-foreground">Market price changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.priceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, priceAlerts: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">News Updates</p>
                      <p className="text-sm text-muted-foreground">Crypto news and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newsUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, newsUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Appearance Settings</CardTitle>
              <CardDescription>Customize how the app looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={appearanceSettings.theme === "light" ? "default" : "outline"}
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: "light" }))}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Sun className="w-5 h-5 mb-2" />
                        Light
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: "dark" }))}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Moon className="w-5 h-5 mb-2" />
                        Dark
                      </Button>
                      <Button
                        variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: "system" }))}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Monitor className="w-5 h-5 mb-2" />
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Language</Label>
                    <select
                      value={appearanceSettings.language}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Currency</Label>
                    <select
                      value={appearanceSettings.currency}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Date Format</Label>
                    <select
                      value={appearanceSettings.dateFormat}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Time Format</Label>
                    <select
                      value={appearanceSettings.timeFormat}
                      onChange={(e) => setAppearanceSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
                      className="w-full bg-input border border-border rounded-lg p-3 text-foreground"
                    >
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) => 
                        setAppearanceSettings(prev => ({ ...prev, compactMode: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                    </div>
                    <Switch
                      checked={appearanceSettings.animationsEnabled}
                      onCheckedChange={(checked) => 
                        setAppearanceSettings(prev => ({ ...prev, animationsEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Display Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Hide Balance</p>
                      <p className="text-sm text-muted-foreground">Hide wallet balance from view</p>
                    </div>
                    <Switch
                      checked={privacySettings.hideBalance}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, hideBalance: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Data Collection</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Analytics</p>
                      <p className="text-sm text-muted-foreground">Help improve the app</p>
                    </div>
                    <Switch
                      checked={privacySettings.analyticsEnabled}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, analyticsEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Crash Reports</p>
                      <p className="text-sm text-muted-foreground">Send crash data to developers</p>
                    </div>
                    <Switch
                      checked={privacySettings.crashReportsEnabled}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, crashReportsEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Data Sharing</p>
                      <p className="text-sm text-muted-foreground">Share usage data with partners</p>
                    </div>
                    <Switch
                      checked={privacySettings.dataSharing}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Location Tracking</p>
                      <p className="text-sm text-muted-foreground">Allow location-based features</p>
                    </div>
                    <Switch
                      checked={privacySettings.locationTracking}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, locationTracking: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Advertising ID</p>
                      <p className="text-sm text-muted-foreground">Allow personalized ads</p>
                    </div>
                    <Switch
                      checked={privacySettings.advertisingId}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, advertisingId: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Cookies</p>
                      <p className="text-sm text-muted-foreground">Enable cookies for better experience</p>
                    </div>
                    <Switch
                      checked={privacySettings.cookiesEnabled}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, cookiesEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Management */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Data Management</CardTitle>
                <CardDescription>Import, export, and manage your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExportData} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                
                <Button onClick={handleImportData} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
                
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Export your account data, transaction history, and settings for backup or migration purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Developer Options */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Developer Options</CardTitle>
                <CardDescription>Advanced settings for developers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Network</Label>
                  <select className="w-full bg-input border border-border rounded-lg p-3 text-foreground">
                    <option value="mainnet">Mainnet</option>
                    <option value="testnet">Testnet</option>
                    <option value="devnet">Devnet</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground">RPC Endpoint</Label>
                  <Input
                    className="bg-input border-border text-foreground"
                    placeholder="https://fullnode.mainnet.sui.io"
                    readOnly
                  />
                </div>
                
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    These settings are for advanced users only. Changing these values may affect app functionality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </SharedLayout>
  )
}