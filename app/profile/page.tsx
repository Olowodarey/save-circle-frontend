"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Edit,
  Wallet,
  TrendingUp,
  Users,
  Clock,
  Star,
  Calendar,
  DollarSign,
  ArrowLeft,
  Save,
  X,
  Contact,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import {useAccount, useContract, useReadContract} from '@starknet-react/core'
import {MY_CONTRACT_ABI} from "@/constants/abi/MyContract"
import {CONTRACT_ADDRESS} from "@/constants/address"


export default function ProfilePage() {
  const {address, isConnected} = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // const contract = useContract({
  //   abi: MY_CONTRACT_ABI,
  //   address: CONTRACT_ADDRESS,
  // });
  

  const {
    data: contractProfileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useReadContract({
    args: [address?address:""],
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_profile",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "/placeholder.svg?height=120&width=120",
    walletAddress: address || "",
    isRegistered: false,
    totalLockAmount: 0,
    profileCreatedAt: "",
    reputationScore: 0,
  })

  const [editForm, setEditForm] = useState({
    name: profileData.name,
    avatar: profileData.avatar,
  })

  useEffect(() => {
    if (contractProfileData && address) {

      const contractData = {
        name: contractProfileData.name || `User ${address.slice(0, 6)}`,
        avatar: contractProfileData.avatar || "/placeholder.svg?height=120&width=120",
        walletAddress: address,
        isRegistered: contractProfileData.is_registered || false,
        totalLockAmount: contractProfileData.total_lock_amount || 0,
        profileCreatedAt: contractProfileData.profile_created_at ? new Date(Number(contractProfileData.profile_created_at)).toLocaleDateString() : "",
        reputationScore:  0,
      }

      setProfileData({
        name: String(contractData.name),
        avatar: String(contractData.avatar),
        walletAddress: contractData.walletAddress,
        isRegistered: contractData.isRegistered,
        totalLockAmount: Number(contractData.totalLockAmount),
        profileCreatedAt: contractData.profileCreatedAt,
        reputationScore: contractData.reputationScore,
      });

      setEditForm({
        name: String(contractData.name),
        avatar: String(contractData.avatar),
      })
    }
  }, [contractProfileData, address]);


  // Analytics data
  const analytics = {
    totalSaved: 3750,
    activeGroups: 2,
    completedCycles: 5,
    totalEarned: 1250,
    averageContribution: 125,
    onTimePayments: 23,
    totalPayments: 25,
    joinedGroups: 7,
    createdGroups: 1,
  }

  const recentActivity = [
    {
      type: "payout",
      description: "Received payout from DeFi Builders",
      amount: "+400 USDC",
      date: "2 hours ago",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      type: "contribution",
      description: "Made contribution to Tech Professionals Circle",
      amount: "-100 USDC",
      date: "1 day ago",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      type: "joined",
      description: "Joined Crypto Enthusiasts group",
      amount: "",
      date: "3 days ago",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const handleSaveProfile = async () => {
    setLoading(true);

    try{

    setProfileData({ ...profileData, ...editForm })
    setIsEditing(false)

    await refetchProfile()
    }catch (error) {
      console.error("Failed to update profile:", error)
    }finally {
      setLoading(false)
    }
    // Here you would call the smart contract to update the profile
  }

  const generateNewAvatar = () => {
    const avatars = [
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
    ]
    const newAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    setEditForm({ ...editForm, avatar: newAvatar })
  }

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  // Show error state if profile fetch failed
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Profile</h2>
            <p className="text-gray-600 mb-4">There was an error loading your profile data.</p>
            <Button onClick={() => refetchProfile()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Show message if user is not registered
  if (!profileData.isRegistered && !isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">You need to register to view your profile.</p>
            <Button asChild>
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Profile</span>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={isEditing ? editForm.avatar : profileData.avatar} />
                  <AvatarFallback className="text-4xl">
                    {(isEditing ? editForm.name : profileData.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" onClick={generateNewAvatar}>
                    Generate New
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="editName">Display Name</Label>
                      <Input
                        id="editName"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                      <p className="text-gray-600 font-mono text-sm mt-1">{profileData.walletAddress}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {profileData.isRegistered ?(
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <User className="w-3 h-3 mr-1" />
                        Registered Member
                      </Badge>
                      ):(
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <User className="w-3 h-3 mr-1" />
                        Not Registered
                      </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{profileData.reputationScore} Reputation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Member since {new Date(profileData.profileCreatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Total Locked</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {profileData.totalLockAmount.toLocaleString()} USDC
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">Total Saved</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900 mt-1">
                          {analytics.totalSaved.toLocaleString()} USDC
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-900">Active Groups</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{analytics.activeGroups}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Cycles</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.completedCycles}</div>
                  <p className="text-xs text-muted-foreground">100% completion rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalEarned.toLocaleString()} USDC</div>
                  <p className="text-xs text-muted-foreground">From completed cycles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Contribution</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageContribution} USDC</div>
                  <p className="text-xs text-muted-foreground">Per cycle</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((analytics.onTimePayments / analytics.totalPayments) * 100)}%
                  </div>
                  <Progress value={(analytics.onTimePayments / analytics.totalPayments) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Reputation Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Reputation Progress</CardTitle>
                <CardDescription>Your journey to the next reputation tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Advanced (75+)</span>
                    <span className="text-sm text-gray-600">{profileData.reputationScore}/90</span>
                  </div>
                  <Progress value={((profileData.reputationScore - 75) / (90 - 75)) * 100} />
                  <p className="text-sm text-gray-600">
                    {90 - profileData.reputationScore} points needed to reach Expert tier
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions and group activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <span
                          className={`font-medium ${activity.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Group Participation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Groups Joined</span>
                    <span className="font-semibold">{analytics.joinedGroups}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Groups Created</span>
                    <span className="font-semibold">{analytics.createdGroups}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Currently Active</span>
                    <span className="font-semibold">{analytics.activeGroups}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Cycles</span>
                    <span className="font-semibold">{analytics.completedCycles}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Payments</span>
                    <span className="font-semibold">{analytics.totalPayments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Time Payments</span>
                    <span className="font-semibold text-green-600">{analytics.onTimePayments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Late Payments</span>
                    <span className="font-semibold text-red-600">
                      {analytics.totalPayments - analytics.onTimePayments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold">
                      {Math.round((analytics.onTimePayments / analytics.totalPayments) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}