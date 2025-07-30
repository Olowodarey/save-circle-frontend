"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, TrendingUp, Wallet, Clock, Star, Lock, LogOut } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [userRegistered, setUserRegistered] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)

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

  const myGroups = [
    {
      id: 1,
      name: "Tech Professionals Circle",
      type: "private",
      members: 12,
      maxMembers: 15,
      contribution: "100 USDC",
      nextPayout: "5 days",
      status: "active",
      locked: true,
      myTurn: false,
    },
    {
      id: 2,
      name: "DeFi Builders",
      type: "public",
      members: 8,
      maxMembers: 10,
      contribution: "50 USDC",
      nextPayout: "12 days",
      status: "active",
      locked: false,
      myTurn: true,
    },
  ]

  const stats = {
    totalSaved: "1,250 USDC",
    activeGroups: 2,
    completedCycles: 3,
    reputationScore: 85,
  }

  const handleConnect = () => {
    const mockAddress = "0x1234567890abcdef1234567890abcdef12345678"
    const mockWalletType = "ArgentX"

    if (typeof window !== "undefined") {
      localStorage.setItem("connected-wallet", mockWalletType)
      localStorage.setItem("wallet-address", mockAddress)
    }

    setWalletConnected(true)
    setWalletType(mockWalletType)
    setAddress(mockAddress)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Save Circle</span>
            </Link>
          </div>

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
              <Button onClick={handleConnect}>Connect Wallet</Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {walletType}
                </Badge>
                <span className="text-sm text-gray-600 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            )}
            {walletConnected && (
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {walletConnected && !userRegistered && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Welcome to Save Circle!</CardTitle>
              <CardDescription>Complete your profile to get started</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => setShowOnboarding(true)} className="w-full">
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>Let&apos;s complete your profile</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => setShowOnboarding(false)} className="w-full">
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSaved}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">2 groups participating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Cycles</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCycles}</div>
              <p className="text-xs text-muted-foreground">100% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reputationScore}</div>
              <Progress value={stats.reputationScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="groups">My Groups</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/groups/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/groups">Browse Groups</Link>
              </Button>
            </div>
          </div>

          <TabsContent value="groups" className="space-y-4">
            {myGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={group.type === "private" ? "secondary" : "outline"}>{group.type}</Badge>
                        {group.locked && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                        {group.myTurn && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Your Turn</Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={group.status === "active" ? "default" : "secondary"}>{group.status}</Badge>
                  </div>
                  <CardDescription>
                    {group.members}/{group.maxMembers} members • {group.contribution} per cycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Next payout in {group.nextPayout}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/groups/${group.id}`}>View Details</Link>
                      </Button>
                      {group.myTurn && <Button size="sm">Claim Payout</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions and group activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Received payout from DeFi Builders</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="font-medium text-green-600">+400 USDC</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Made contribution to Tech Professionals Circle</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <span className="font-medium text-red-600">-100 USDC</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Reputation score increased</p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <span className="font-medium text-blue-600">+5 points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
