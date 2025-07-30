"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Lock, TrendingUp, Coins, Globe, LogOut } from "lucide-react"
import Link from "next/link"
import WalletConnectModal from "@/components/wallet-connect-modal"

export default function HomePage() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check wallet connection on mount
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("connected-wallet")
      const savedAddress = localStorage.getItem("wallet-address")

      if (savedWallet && savedAddress) {
        setWalletConnected(true)
        setWalletType(savedWallet)
        setAddress(savedAddress)
      }
    }
  }, [])

  const handleWalletConnect = (walletType: string) => {
    const mockAddress = "0x1234567890abcdef1234567890abcdef12345678"

    if (typeof window !== "undefined") {
      localStorage.setItem("connected-wallet", walletType)
      localStorage.setItem("wallet-address", mockAddress)
    }

    setWalletConnected(true)
    setWalletType(walletType)
    setAddress(mockAddress)
    setShowWalletModal(false)
  }

  const handleDisconnect = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("connected-wallet")
      localStorage.removeItem("wallet-address")
    }
    setWalletConnected(false)
    setWalletType(null)
    setAddress(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Save Circle</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/groups" className="text-gray-600 hover:text-gray-900">
              Groups
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <Link href="/reputation" className="text-gray-600 hover:text-gray-900">
              Reputation
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {!walletConnected ? (
              <Button variant="outline" onClick={() => setShowWalletModal(true)}>
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {walletType}
                </Badge>
                <span className="text-sm text-gray-600 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Button asChild>
              <Link href="/dashboard">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Built on Starknet</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Decentralized Savings Circles</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of community savings with Save Circle. Create or join Esusu groups, build your reputation,
            and grow your wealth together on Starknet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/dashboard">Start Saving</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/groups">Explore Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to participate in decentralized savings circles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Public & Private Groups</CardTitle>
              <CardDescription>
                Create private invitation-only circles or join public groups based on reputation criteria
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Reputation System</CardTitle>
              <CardDescription>
                Build your onchain reputation through successful participation and unlock better opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Trust-Based Lock System</CardTitle>
              <CardDescription>
                Lock additional tokens to build trust and guarantee early withdrawal rights. Higher lock amounts
                demonstrate commitment and unlock premium benefits.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Smart Contract Security</CardTitle>
              <CardDescription>
                All savings are secured by audited smart contracts on Starknet with transparent operations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Global Access</CardTitle>
              <CardDescription>
                Participate in savings circles from anywhere in the world with just a Starknet wallet
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Multi-Token Support</CardTitle>
              <CardDescription>
                Accept any Starknet token (ETH, STRK, USDT, etc.) with automatic conversion to USDC through integrated
                DEX protocols for seamless savings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Save Circle Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple steps to start your savings journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Build Reputation</h3>
              <p className="text-gray-600">
                Connect your Starknet wallet and start building your reputation through successful transactions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Create or Join Groups</h3>
              <p className="text-gray-600">
                Create your own savings circle or join existing public groups that match your criteria
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Earn Together</h3>
              <p className="text-gray-600">
                Participate in rotating savings, receive payouts, and grow your wealth with the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Save Circle</span>
              </div>
              <p className="text-gray-400">
                Decentralized savings circles built on Starknet for global financial inclusion.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="hover:text-white">
                    Groups
                  </Link>
                </li>
                <li>
                  <Link href="/reputation" className="hover:text-white">
                    Reputation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Smart Contracts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Save Circle. Built on Starknet.</p>
          </div>
        </div>
      </footer>
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  )
}
