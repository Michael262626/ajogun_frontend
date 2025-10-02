"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AuthModal from "@/components/auth-modal"
import {
  Shield,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Lock,
  Globe,
  TrendingUp,
  Coins,
  FileText,
  Database,
  Menu,
  X,
  Play,
  Code,
  Network,
  Activity
} from "lucide-react"

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your wills are secured by cryptographic encryption and stored immutably on the Sui blockchain.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Multiple Beneficiaries",
      description: "Distribute your digital assets among up to 10 beneficiaries with precise percentage allocations.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Smart Execution",
      description: "Automatic execution based on customizable conditions with dead man's switch functionality.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Borderless inheritance planning accessible from anywhere in the world, 24/7.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Lock,
      title: "Private Keys Control",
      description: "You maintain full control of your private keys with optional multi-signature support.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description: "Deploy your will to the blockchain in minutes with our intuitive creation wizard.",
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  const stats = [
    { label: "Active Wills", value: "2,847", icon: FileText },
    { label: "Total Value Secured", value: "$12.4M", icon: Shield },
    { label: "Beneficiaries Protected", value: "8,291", icon: Users },
    { label: "Countries Served", value: "45+", icon: Globe }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Crypto Investor",
      content: "AjogunNet gave me peace of mind knowing my digital assets will be safely transferred to my family. The process was incredibly simple.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "DeFi Trader",
      content: "The blockchain security and smart contract automation are exactly what I needed for my inheritance planning. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "NFT Collector",
      content: "Finally, a solution that understands digital assets. The multi-beneficiary support is perfect for my complex family structure.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-900/50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-black font-bold" />
              </div>
              <span className="text-xl font-bold text-white">AjogunNet</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-blue-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-blue-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-blue-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-blue-300 hover:text-white transition-colors">Pricing</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => openAuthModal('login')}
                className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
              >
                Login
              </Button>
              <Button
                onClick={() => openAuthModal('signup')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-blue-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
          }`}>
            <div className="space-y-4">
              <a href="#features" className="block text-blue-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-blue-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="block text-blue-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="block text-blue-300 hover:text-white transition-colors">Pricing</a>
              <div className="pt-4 border-t border-blue-900/30 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => openAuthModal('login')}
                  className="w-full bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50"
                >
                  Login
                </Button>
                <Button
                  onClick={() => openAuthModal('signup')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-blue-950/30 to-black">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af10_1px,transparent_1px),linear-gradient(to_bottom,#1e40af10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Floating Network Nodes */}
          <div className="absolute top-20 right-20 w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-ping shadow-lg shadow-orange-500/50"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-ping delay-700 shadow-lg shadow-blue-500/50"></div>
          <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-ping delay-1000 shadow-lg shadow-purple-500/50"></div>
          
          {/* Connection Lines */}
          <div className="absolute top-24 right-24 w-32 h-px bg-gradient-to-r from-orange-500/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-44 left-24 w-24 h-px bg-gradient-to-r from-blue-500/30 to-transparent animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32 lg:py-40 relative">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-950/50 to-black/50 border border-blue-800/50 text-orange-400 px-6 py-3 rounded-xl text-sm font-medium backdrop-blur-sm shadow-2xl">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
              <Zap className="h-4 w-4" />
              <span className="text-blue-300">Powered by</span>
              <span className="text-orange-400 font-semibold">Sui Blockchain</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Secure Your
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Digital Legacy
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-blue-300 leading-relaxed max-w-4xl mx-auto">
              Create immutable digital wills on the blockchain. Secure your crypto assets and ensure seamless inheritance 
              with smart contract automation and military-grade security.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                onClick={() => openAuthModal('signup')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
              >
                Create Your Will
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50 px-8 py-4 text-lg rounded-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-16">
              <p className="text-blue-400 text-sm mb-8 font-medium">Trusted by crypto investors worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-950/50 to-black/50 border border-blue-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm">
                        <Icon className="w-7 h-7 text-blue-400 group-hover:text-orange-400 transition-colors duration-300" />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-blue-300 font-medium">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-black via-blue-950/10 to-black relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af08_1px,transparent_1px),linear-gradient(to_bottom,#1e40af08_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-950/50 to-black/50 border border-blue-800/50 text-orange-400 px-4 py-2 rounded-xl text-sm font-medium mb-6 backdrop-blur-sm">
              <Code className="h-4 w-4" />
              <span className="text-blue-300">Web3</span>
              <span className="text-orange-400 font-semibold">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Built for the Decentralized Future</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto leading-relaxed">
              Leveraging Sui blockchain's advanced capabilities to deliver enterprise-grade security and performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-gradient-to-br from-blue-950/50 to-black/50 border border-blue-800/50 hover:border-orange-500/30 transition-all duration-300 group backdrop-blur-sm shadow-2xl hover:shadow-orange-500/10">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-300 leading-relaxed text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-blue-950/20 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Create your digital will in three simple steps and secure your legacy on the blockchain.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up and connect your crypto wallet to get started with our secure platform.",
                icon: Users
              },
              {
                step: "02",
                title: "Add Beneficiaries",
                description: "Specify your beneficiaries and define how your digital assets should be distributed.",
                icon: FileText
              },
              {
                step: "03",
                title: "Deploy to Blockchain",
                description: "Your will is deployed as a smart contract, secured by cryptographic encryption.",
                icon: Network
              }
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-black" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-blue-300 leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-b from-black to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">What Our Users Say</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who trust AjogunNet with their digital legacy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-950/50 to-black border border-blue-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-orange-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-blue-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-black font-bold text-lg">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-blue-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-b from-blue-950/20 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include blockchain security and smart contract deployment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "Free",
                description: "Perfect for getting started",
                features: ["1 Digital Will", "Up to 3 Beneficiaries", "Basic Security", "Email Support"],
                popular: false
              },
              {
                name: "Pro",
                price: "$29/mo",
                description: "Most popular for individuals",
                features: ["5 Digital Wills", "Up to 10 Beneficiaries", "Advanced Security", "Priority Support", "Multi-signature", "Custom Conditions"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For organizations and families",
                features: ["Unlimited Wills", "Unlimited Beneficiaries", "Enterprise Security", "24/7 Support", "Custom Integration", "Legal Compliance", "White-label Solution"],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative bg-gradient-to-br from-blue-950/50 to-black border ${
                plan.popular ? 'border-orange-500/50 ring-2 ring-orange-500/20' : 'border-blue-800/50'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <CardDescription className="text-blue-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-blue-300">{feature}</span>
                    </div>
                  ))}
                  <Button
                    onClick={() => openAuthModal('signup')}
                    className={`w-full mt-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black'
                        : 'bg-transparent border border-blue-600 text-blue-300 hover:bg-blue-900/50'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-orange-500/10 via-blue-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Digital Legacy?
          </h2>
          <p className="text-xl text-blue-300 mb-8 leading-relaxed">
            Join thousands of users who trust AjogunNet with their most valuable digital assets. 
            Start creating your blockchain-secured will today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => openAuthModal('signup')}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-4 text-lg rounded-xl"
            >
              Create Your Will Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900/50 px-8 py-4 text-lg rounded-xl"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}