"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Lock, TrendingUp, Coins, Globe } from "lucide-react";
import { ProtectedLink } from "@/components/ProtectedLinks";
import Link from "next/link";
import WalletConnectModal from "@/components/wallet/wallet-connect-modal";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useAccount } from "@starknet-react/core";
// import {toast} from "sonner"

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleWalletConnect = (walletType: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("connected-wallet", walletType);
    }
    setShowWalletModal(false);
  };

  // const handleProtectedAction = () => {
  //   if (!isConnected || !address) {
  //     toast.error("Wallet Connection Required", {
  //       description: "Please connect your wallet to continue",
  //       action: {
  //         label: "Connect Wallet",
  //         onClick: () => setShowWalletModal(true)
  //       }
  //     })
  //     return
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <Navbar setShowWalletModal={setShowWalletModal} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Built on Starknet
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Decentralized Savings Circles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of community savings with Save Circle. Create or
            join Esusu groups, build your reputation, and grow your wealth
            together on Starknet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/dashboard"
              >
                Start Saving
              </ProtectedLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
              asChild
            >
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/groups"
              >
                Explore Groups
              </ProtectedLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
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
                Create private invitation-only circles or join public groups
                based on reputation criteria
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
                Build your onchain reputation through successful participation
                and unlock better opportunities
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
                Lock additional tokens to build trust and guarantee early
                withdrawal rights. Higher lock amounts demonstrate commitment
                and unlock premium benefits.
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
                All savings are secured by audited smart contracts on Starknet
                with transparent operations
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
                Participate in savings circles from anywhere in the world with
                just a Starknet wallet
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
                Accept any Starknet token (ETH, STRK, USDT, etc.) with automatic
                conversion to USDC through integrated DEX protocols for seamless
                savings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Save Circle Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to start your savings journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Connect & Build Reputation
              </h3>
              <p className="text-gray-600">
                Connect your Starknet wallet and start building your reputation
                through successful transactions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create or Join Groups
              </h3>
              <p className="text-gray-600">
                Create your own savings circle or join existing public groups
                that match your criteria
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Save & Earn Together
              </h3>
              <p className="text-gray-600">
                Participate in rotating savings, receive payouts, and grow your
                wealth with the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}
