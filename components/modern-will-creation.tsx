"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet-context";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  FileText,
  Users,
  Wallet,
  MessageSquare,
  Bot,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  walletAddress: string;
  percentage: number;
  status: "verified" | "pending";
}

const ModernWillCreation = () => {
  const router = useRouter();
  const { userId, password, logout } = useWallet();
  const { createWill, createWillState, fetchWills } = useApi();
  const [currentStep, setCurrentStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Daughter",
      walletAddress: "0x742d35Cc9Bf8D5d7c7a7c8D9b1234567890abcde",
      percentage: 40,
      status: "verified",
    },
    {
      id: "2",
      name: "Michael Johnson",
      relationship: "Son",
      walletAddress: "0x8f3a4b7c6d9e2f1a5b8c7d4e9f2a6b3c8d5e7f1a",
      percentage: 35,
      status: "verified",
    },
    {
      id: "3",
      name: "Red Cross Foundation",
      relationship: "Charity",
      walletAddress: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      percentage: 25,
      status: "pending",
    },
  ]);

  const [willAmount, setWillAmount] = useState("1000");

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Create Will", icon: FileText, href: "/create", active: true },
    { name: "Beneficiaries", icon: Users, href: "/beneficiaries" },
    { name: "Wallet", icon: Wallet, href: "/wallet" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "AI Assistant", icon: Bot, href: "/ai-assistant" },
  ];

  const steps = [
    { id: 1, title: "Beneficiaries", description: "Add recipients", icon: Users },
    { id: 2, title: "Assets", description: "Select digital assets", icon: Wallet },
    { id: 3, title: "Review & Deploy", description: "Finalize and deploy", icon: Shield },
  ];

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);

  const addBeneficiary = () => {
    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      walletAddress: "",
      percentage: 0,
      status: "pending",
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setBeneficiaries(beneficiaries.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = async () => {
    if (!termsAccepted) {
      setError("You must agree to the Terms and Conditions.");
      setToast({ message: "You must agree to the Terms and Conditions.", type: "error" });
      return;
    }

    const finalUserId = localStorage.getItem("ajogun-userId") || localStorage.getItem("walletUserId");
    const finalPassword = localStorage.getItem("ajogun-password");
    console.log("userid and password", finalUserId, finalPassword);

    try {
      // Transform willData to API format
      const apiWillData = {
        userId: finalUserId,
        password: finalPassword,
        heirs: beneficiaries.map(b => b.walletAddress).filter(addr => addr.trim() !== ''),
        shares: beneficiaries.map(b => b.percentage * 100),
      };

      console.log("Creating will with data:", apiWillData);

      const result = await createWill(apiWillData);

      if (result && result.success) {
        console.log(`🎉 === WILL CREATION SUCCESS ===
Will Index: ${result.willIndex}
Contract Address: ${result.contractAddress}
Transaction Hash: ${result.transactionHash}
Created At: ${new Date().toISOString()}
==================================`);

        // Show success toast
        setToast({ message: "Will created successfully!", type: "success" });

        // Fetch wills to update dashboard
        await fetchWills();

        // Navigate to dashboard
        router.push("/dashboard");
      } else {
        const errorMessage = `Will creation failed: ${result?.message || "Unknown error"}`;
        setError(errorMessage);
        setToast({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      const errorMessage = `Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`;
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === "success"
            ? "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <div className="w-5 h-5 text-red-600 dark:text-red-400">⚠️</div>
            )}
            <p className={`text-sm ${
              toast.type === "success"
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            }`}>
              {toast.type === "success" ? "Success" : "Error"}
            </p>
            <p className={`text-sm ${
              toast.type === "success"
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}>
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">AjogunNet</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                link.active
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon
                className={`w-5 h-5 mr-3 ${link.active ? "text-primary-foreground" : ""}`}
              />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Create Your Digital Will</h1>
                <p className="text-sm text-muted-foreground">
                  Follow the steps below to create and deploy your will on the blockchain
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userId?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Settings className="inline w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep >= step.id
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Add Beneficiaries</h2>
                    <p className="text-muted-foreground">
                      Specify who will inherit your digital assets
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{totalPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Total Allocation</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {beneficiaries.map((beneficiary) => (
                    <div key={beneficiary.id} className="p-4 border border-border rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`name-${beneficiary.id}`}>Name</Label>
                          <Input
                            id={`name-${beneficiary.id}`}
                            value={beneficiary.name}
                            onChange={(e) =>
                              updateBeneficiary(beneficiary.id, "name", e.target.value)
                            }
                            placeholder="Beneficiary name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`relationship-${beneficiary.id}`}>Relationship</Label>
                          <Input
                            id={`relationship-${beneficiary.id}`}
                            value={beneficiary.relationship}
                            onChange={(e) =>
                              updateBeneficiary(beneficiary.id, "relationship", e.target.value)
                            }
                            placeholder="e.g., Daughter, Son"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`address-${beneficiary.id}`}>Wallet Address</Label>
                          <Input
                            id={`address-${beneficiary.id}`}
                            value={beneficiary.walletAddress}
                            onChange={(e) =>
                              updateBeneficiary(beneficiary.id, "walletAddress", e.target.value)
                            }
                            placeholder="0x..."
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Label htmlFor={`percentage-${beneficiary.id}`}>Percentage</Label>
                            <Input
                              id={`percentage-${beneficiary.id}`}
                              type="number"
                              value={beneficiary.percentage}
                              onChange={(e) =>
                                updateBeneficiary(
                                  beneficiary.id,
                                  "percentage",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeBeneficiary(beneficiary.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={addBeneficiary} variant="outline" className="w-full mb-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Beneficiary
                </Button>

                {totalPercentage !== 100 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> Total allocation must equal 100%. Currently:{" "}
                      {totalPercentage}%
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" disabled>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNext} disabled={totalPercentage !== 100}>
                    Next: Select Assets
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Select Digital Assets
                </h2>
                <p className="text-muted-foreground mb-6">
                  Specify the amount to include in your will
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="amount">Amount (SUI)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={willAmount}
                      onChange={(e) => setWillAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This amount will be distributed among your beneficiaries according to their
                      percentages
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNext}>
                    Next: Review & Deploy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Review Your Will</h2>

                <div className="space-y-6 mb-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-3">
                      Beneficiaries ({beneficiaries.length})
                    </h3>
                    <div className="space-y-2">
                      {beneficiaries.map((beneficiary) => (
                        <div
                          key={beneficiary.id}
                          className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                        >
                          <span className="text-sm">
                            {beneficiary.name} ({beneficiary.relationship})
                          </span>
                          <span className="font-medium text-primary">{beneficiary.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-3">Total Amount</h3>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-lg font-semibold">{willAmount} SUI</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Security & Privacy
                      </h3>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Your will is secured on the Sui blockchain</li>
                        <li>• Smart contract ensures automatic execution</li>
                        <li>• Only beneficiaries can access after execution</li>
                        <li>• Immutable and tamper-proof storage</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                      />
                      <div>
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium text-foreground cursor-pointer"
                        >
                          I agree to the Terms and Conditions
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          By creating this will, I understand that:
                        </p>
                        <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                          <li>• This will is legally binding once deployed to the blockchain</li>
                          <li>• I am responsible for keeping my credentials secure</li>
                          <li>• The smart contract will execute automatically based on set conditions</li>
                          <li>• I can revoke or modify this will at any time before execution</li>
                        </ul>
                        <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
                          Read full Terms and Conditions
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleDeploy}
                    disabled={createWillState.loading || !termsAccepted}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createWillState.loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full"></div>
                        Deploying to Blockchain...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Deploy Will to Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModernWillCreation;