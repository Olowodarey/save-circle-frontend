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
  ArrowRight,
  Zap,
  CheckCircle,
} from "lucide-react";
import { ProtectedLink } from "@/components/ProtectedLinks";
import Link from "next/link";
import WalletConnectModal from "@/components/wallet/wallet-connect-modal";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function HomePage() {
  // const { address, isConnected } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleWalletConnect = (walletType: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("connected-wallet", walletType);
    }
    setShowWalletModal(false);
  };

  return (
    <div className=" bg-gradient-to-br from-blue-100 to-indigo-200">
      {/* Header */}
      <Navbar setShowWalletModal={setShowWalletModal} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Save Together <span className="text-blue-600">Thrive Together</span>
          </h1>

          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to SaveCircle, a community driven integration where needs
            and demands meets smart contributive savings. Earn an extension of
            accumulated returns cancelling the daily interest and charges posed
            by traditional banking system while maintaining control, flexibility
            and a feasible planning system over your funds. Our rotating savings
            model ensures adequate and accurate payout.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              asChild
            >
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/groups"
                className="hover:scale-105 transform transition-transform"
              >
                Start Saving Now
              </ProtectedLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-white/80 hover:bg-white text-gray-800 border-gray-300 hover:border-blue-400 transition-colors"
              asChild
            >
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The SaveCircle Difference */}
      <section className="container mx-auto px-4 py-16 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm max-w-6xl my-8 border border-gray-100">
        <div className=" grid  gap-10 items-start">
          <div>
            <div className="text-center">
              <h2 className="text-3xl flex items-center justify-center font-bold text-gray-900 mb-4">
                <span className="mr-2">The SaveCircle difference</span>
              </h2>
              <p className="text-gray-700 mb-6 max-w-3xl mx-auto text-center">
                Most DeFi platforms return exactly what you locked. With
                SaveCircle, you get to choose an initial lock amount to join a
                group best suited for your contribution plan and get a priority
                payout based on the total number of people present in the group,
                the specified amount is saved either on a daily, weekly or
                monthly schedule based on the group plan subscribed to. Through
                rotating payouts, everyone takes a turn receiving requested
                contributions from other members while the rest members continue
                with the savings. At the end of the cycle, you get back your
                lock amount plus all your contributions. It's a smarter way to
                save together and access funds sooner enabling individuals to
                sort out pressing demands.
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
                    First come, first paid using the reputation level to judge
                    the scheduled payout system.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">Rotating payouts</p>
                  <p className="text-sm text-gray-600">
                    Everyone gets a turn as long as they keep up in avoiding
                    defaulting and penalties.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    You get everything back
                  </p>
                  <p className="text-sm text-gray-600">
                    Locked + contributed amounts are returned to individuals
                    after completing the circle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 -z-10" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/30 to-transparent -z-10" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How SaveCircle Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to start saving and earning with your
              community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Join or Create a Circle
              </h3>
              <p className="text-gray-600">
                Start a new savings group or join an existing one. Set your
                contribution amount and schedule.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Save & Earn Your Turn
              </h3>
              <p className="text-gray-600">
                Contribute, save & earn your turn contribute regularly and get a
                good reputation. Higher locked amounts raises ranks moving
                eligible users up the queue but payout is determined by the high
                lock and time stamp scheduled payout system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Get Paid & Continue
              </h3>
              <p className="text-gray-600">
                Receive your contribution when it's your turn, then keep saving
                until the cycle ends to get everything back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SaveCircle */}
      <section className="py-20  ">
        <div className="absolute left-0 w-full h-24  to-transparent -mt-24" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SaveCircle?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The modern way to save with your community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Better Than Traditional Savings and Contributions.
              </h3>
              <p className="text-gray-600 mb-4">
                Earn higher returns than traditional bank savings which are
                driven by high institutional fees causing reduction in funds to
                receive at the end of the cycle, while maintaining access to
                your funds through our rotating payout system.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Higher potential returns than banks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>No minimum lock-up periods</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Transparent on-chain operations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Built on Starknet
              </h3>
              <p className="text-gray-600 mb-4">
                Leveraging the power of Starknet's zk-rollup technology for
                fast, secure, and low-cost transactions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Near-instant transactions</span>
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Bank-grade security</span>
                </li>
                <li className="flex items-start">
                  <Coins className="w-5 h-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Low transaction fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
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
              <h3 className="font-semibold text-gray-900">
                Public & Private groups
              </h3>
              <p className="text-sm text-gray-600">
                Create invitation-only circles or join public ones gated by
                reputation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reputation system</h3>
              <p className="text-sm text-gray-600">
                Build onchain trust through consistent saving and payouts which
                over time can be minted as NFT and used across SaveCircle and
                the Starknet ecosystem.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Trust-based lock</h3>
              <p className="text-sm text-gray-600">
                Lock collateral for payout order. No locked funds, no
                contribution payout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Secure by contract
              </h3>
              <p className="text-sm text-gray-600">
                Audited smart contracts on Starknet; transparent operations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Global access</h3>
              <p className="text-sm text-gray-600">
                Join from anywhere with a Starknet wallet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Use any token</h3>
              <p className="text-sm text-gray-600">
                Pay with ETH, STRK, USDT—auto‑swapped to USDC for saving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Liquidity Options */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* How it Works */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-8">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-blue-600 font-bold">1</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Lock an Initial Amount
                    </h3>
                    <p className="text-gray-600">
                      Start by locking a small amount to join a savings circle
                      and secure your spot in the rotation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl text-blue-600 font-bold">2</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Make Regular Contributions
                    </h3>
                    <p className="text-gray-600">
                      Contributions are made based on agreed amount on the
                      schedule that works for your group's needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl text-blue-600 font-bold">3</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Receive Your Payout
                    </h3>
                    <p className="text-gray-600">
                      Get your lump sum when it's your turn in the rotation,
                      with the amount growing as more members join.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liquidity Options */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-8">Liquidity Options</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Public Lock</h3>
                  <p className="text-gray-600">
                    The collateral to be locked is determined by the
                    system/Admin, which is paid by everyone joining the cycle.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Private Lock</h3>
                  <p className="text-gray-600">
                    The locked collateral is set by the creator of the group
                    based on the amount to be contributed by each individual,
                    then the system verifies and approves the group creation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section id="who-can-join" className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Who can join SaveCircle?</h2>

          <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Traders and Crypto Enthusiasts
              </h3>
              <p className="text-gray-700">
                Dedication and maintaining of initial capital as well as gathering of funds to actually fund trading accounts or keep a backup capital is always a stretch in the trading world.
                We are dedicated to helping you accumulate your profits over a period of time and for as long as you wish, so as to be able to bounce bank into the system when it becomes necessary to add more...
                Every traders dream is to monitor and be able to replenish (fund) his/her trading accounts when need arises, we at SaveCircle is dedicated into holding you accountable for Taking charts to new heights.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Students and Young Professionals
              </h3>
              <p className="text-gray-700">
                This schooling and working system prove tedious and harsher daily as requirements to pay bills and meet up with certain demands such as monthly transportation, feeding, rents, and even departmental and school activities. Our SaveCircle system helps in securing such harsh realities and turning them into a Support system where by each individual can join a pool anticipating the time of their payment in the offline sectors and end up meeting up with all the demands at ease and at the right pace. SaveCircle turns imagination into hand stretched reality.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Business persons and Long term planners
              </h3>
              <p className="text-gray-700">
                What separates the rich from the poor isn't opportunities, it's pure capital and liquidity. In SaveCircle we turn lost of opportunities and imagination into serendipity, a combination of events which have come together by chance to make a surprisingly good or wonderful outcome.
                We'd build up those committed activities and contributive acts into a strong support system where you can finally meet up with your goals.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Community
              </h3>
              <p className="text-gray-700">
                Communities and close associate could decide to raise funds by coming together to achieve a result over an environmental assessment or fundraising to sort out certain issues. With SaveCircle, that can be easily achieved by setting up a limit and a time frame to help in spreading out and accumulating the required funds to cover up the process. Just out here touching grass nd recharging the community vaults.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Family and Friends
              </h3>
              <p className="text-gray-700">
                Illuminating ideas, bond and inspiration. In this regards close associates and families can set-up a pool and pitch in funds to plan an event, marriage, trip etc. with no fear of how payments can be made cause the accumulated funds can be used to setup any of those process and pay off any credit during those process. It unifies family and Friends ties while making payments easier and reliable coming as peace after the storm.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                Others
              </h3>
              <p className="text-gray-700">
                SaveCircle isn't limited to anyone to be honest was supposed to place this line at the top but placing it here still seems perfect. No age limitation or any other restrictions cause at SaveCircle we are a DAO and our community has the right in voting and implementing actions under the ecosystem. Our goal is to see everybody rise above ranks and win at every single step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}

      {/* Final CTA */}

      <div>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNTgiIHZpZXdCb3g9IjAgMCA3MiA1OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM2IDU4QzU1Ljg4MjcgNTggNzIgNDUuNjczMSA3MiAzMEM3MiAxNC4zMjY5IDU1Ljg4MjcgMiAzNiAyQzE2LjExNzMgMiAwIDE0LjMyNjkgMCAzMEMwIDQ1LjY3MzEgMTYuMTE3MyA1OCAzNiA1OFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+Cg==')]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Savings?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already growing their wealth with
            SaveCircle's innovative savings platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              asChild
            >
              <ProtectedLink
                setShowWalletModal={setShowWalletModal}
                href="/groups"
              >
                Get Started Now
              </ProtectedLink>
            </Button>
          </div>
          <div className="mt-6 text-sm text-blue-200">
            No credit check. No hidden fees. Just better savings.
          </div>
        </div>
       
      </section>
      <Footer />
      </div>
   



      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}
