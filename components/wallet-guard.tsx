"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, TrendingUp } from "lucide-react"
import WalletConnectModal from "./wallet-connect-modal"
import { useWallet } from "@/hooks/use-wallet"

interface WalletGuardProps {
  children: React.ReactNode
}

export default function WalletGuard({ children }: WalletGuardProps) {
  const { isConnected, connect } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleConnect = async (walletType: string) => {
    try {
      await connect(walletType)
      setShowWalletModal(false)
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  if (isConnected) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl mb-2">Welcome to Save Circle</CardTitle>
          <CardDescription className="text-lg">
            Connect your Starknet wallet to start your decentralized savings journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Decentralized</h3>
              <p className="text-sm text-gray-600">Your funds are secured by smart contracts on Starknet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Build Reputation</h3>
              <p className="text-sm text-gray-600">Earn reputation points and unlock premium features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">Simple interface for managing your savings circles</p>
            </div>
          </div>

          {/* Connect Button */}
          <div className="text-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setShowWalletModal(true)}>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Continue
            </Button>
            <p className="text-sm text-gray-500 mt-3">Supported wallets: ArgentX, Braavos, OKX Wallet</p>
          </div>

          {/* Security Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Your Security is Our Priority</p>
                <p className="text-blue-700">
                  Save Circle never stores your private keys. Your wallet remains in your full control at all times. All
                  transactions are executed through secure smart contracts on Starknet.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnect}
      />
    </div>
  )
}
