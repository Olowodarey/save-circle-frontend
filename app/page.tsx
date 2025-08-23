"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  Lock,
  TrendingUp,
  Coins,
  Globe,
  PiggyBank,
  Calendar,
  ArrowRight,
  Zap,
} from "lucide-react";
import { ProtectedLink } from "@/components/ProtectedLinks";
import Link from "next/link";
import WalletConnectModal from "@/components/wallet/wallet-connect-modal";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useAccount } from "@starknet-react/core";
// import {toast} from "sonner"

export default function HomePage() {
  // const { address, isConnected } = useAccount();
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
            Save together, get paid sooner
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Lock a little. Save a little. Receive a lump sum early—then pay
            yourself back over time. Unlike typical DeFi, you get your locked
            liquidity and your progressive contributions back at the end of the
            cycle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Button size="lg" variant="ghost" className="text-lg px-8" asChild>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2"
              >
                How it works <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The SaveCircle Difference */}
      <section className="container grid mx-auto px-4 py-12">
        <div className=" grid  gap-10 items-start">
          <div>
            <div className="text-center">
              <h2 className="text-3xl flex items-center justify-center font-bold text-gray-900 mb-4">
                <span className="mr-2">The SaveCircle difference</span>
              </h2>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto text-center">
                Most DeFi platforms return exactly what you locked. With SaveCircle, you <strong>lock an initial amount</strong> to join and set your payout priority, then <strong>save small amounts</strong> on a daily or weekly schedule. Through <strong>rotating payouts</strong>, everyone takes a turn receiving lump sums early while others continue saving. At the end of the cycle, you get back your lock amount plus all your contributions. It's a smarter way to save together and access funds sooner.
              </p>
              <div className="mt-6 text-blue-700 font-medium text-center">
                Pay with STRK, ETH, USDT, or USDC. We auto‑swap to USDC.
              </div>
            </div>
          </div>
          <div>
            <div>
              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">Priority by lock</p>
                  <p className="text-sm text-gray-600">
                    Higher locks are scheduled earlier.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">Rotating payouts</p>
                  <p className="text-sm text-gray-600">Everyone gets a turn.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    You get everything back
                  </p>
                  <p className="text-sm text-gray-600">
                    Locked + saved amounts.
                  </p>
                </div>
              </div>
            </div>
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Public & Private groups</h3>
              <p className="text-sm text-gray-600">Create invitation-only circles or join public ones gated by reputation.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reputation system</h3>
              <p className="text-sm text-gray-600">Build onchain trust through consistent saving and payouts.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Trust-based lock</h3>
              <p className="text-sm text-gray-600">Lock more to move earlier in the payout order.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure by contract</h3>
              <p className="text-sm text-gray-600">Audited smart contracts on Starknet; transparent operations.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Global access</h3>
              <p className="text-sm text-gray-600">Join from anywhere with a Starknet wallet.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Use any token</h3>
              <p className="text-sm text-gray-600">Pay with ETH, STRK, USDT—auto‑swapped to USDC for saving.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className=" py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Save Circle Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get a lump sum sooner, keep saving steadily, and end with
              everything that’s yours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Lock an initial amount
              </h3>
              <p className="text-gray-600">
                Lock any amount (e.g., $10) to join and set your payout priority
                in the rotation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Save small amounts on schedule
              </h3>
              <p className="text-gray-600">
                Contribute $1, $1, $1... daily or weekly. Everyone in your
                circle does the same.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Receive early, get everything back
              </h3>
              <p className="text-gray-600">
                You may get your payout early and keep contributing. At the end
                of the cycle, you get back your locked liquidity plus all your
                progressive contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Liquidity Options */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Liquidity Options
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join in the way that fits your capital today.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Progressive Lock</h3>
              <p className="text-sm text-gray-600">Save gradually—your lock boosts payout priority. More trust, earlier turns.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">No Lock</h3>
              <p className="text-sm text-gray-600">Join without locking liquidity. You’ll still save progressively; payouts come after locked members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className=" py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why this matters
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Consistency beats size. Start with what you have and build
              momentum together.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Day-to-day traders</h3>
                <p className="text-sm text-gray-600">Build a trading stack—receive a lump sum early, then keep contributing over time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-sm text-gray-600">Practice disciplined saving without needing large capital upfront.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Everyday savers</h3>
                <p className="text-sm text-gray-600">Join with any budget—consistency matters more than size.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="container pt-16 mx-auto px-4 pb-16">
        <div className="bg-blue-600 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">Start your first circle</h3>
            <p className="text-blue-100">
              Create a group or join existing ones in minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="px-8 bg-white text-blue-700 hover:bg-white/90"
              asChild
            >
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/groups/create"
              >
                Create a group
              </ProtectedLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/groups"
              >
                Explore groups
              </ProtectedLink>
            </Button>
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
