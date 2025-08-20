"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, Award, Users, Clock, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useReadContract, useAccount } from "@starknet-react/core"
import { MY_CONTRACT_ABI } from "@/constants/abi"
import { CONTRACT_ADDRESS } from "@/constants"
import { useEffect, useState } from "react"

export default function ReputationPage() {
  const { address, isConnected } = useAccount()
  const [processedActivities, setProcessedActivities] = useState<any[]>([])

  // Fetch user profile data
  const { data: profileData, error: profileError, isPending: profilePending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_profile",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0"],
    enabled: !!address && isConnected,
  })

  // Fetch user activities for reputation history
  const { data: activitiesData, error: activitiesError, isPending: activitiesPending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_activities",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0", 20], // Get last 20 activities
    enabled: !!address && isConnected,
  })

  // Fetch user statistics
  const { data: statisticsData, error: statisticsError, isPending: statisticsPending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_statistics",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0"],
    enabled: !!address && isConnected,
  })

  // Process activities to show reputation-related events
  useEffect(() => {
    if (activitiesData) {
      const reputationActivities = activitiesData
        .filter((activity: any) => {
          const activityType = Number(activity.activity_type)
          // Filter for reputation-affecting activities
          return [0, 1, 2, 4, 8, 9, 10].includes(activityType) // Contribution, PayoutReceived, GroupJoined, GroupCompleted, PenaltyPaid, ReputationGained, ReputationLost
        })
        .map((activity: any) => {
          const activityType = Number(activity.activity_type)
          const timestamp = new Date(Number(activity.timestamp) * 1000)
          
          let action = ""
          let points = ""
          let type = "positive"
          
          switch (activityType) {
            case 0: // Contribution
              action = "Made on-time contribution"
              points = "+2"
              type = "positive"
              break
            case 1: // PayoutReceived
              action = "Successfully received payout"
              points = "+3"
              type = "positive"
              break
            case 2: // GroupJoined
              action = "Joined savings circle"
              points = "+5"
              type = "positive"
              break
            case 4: // GroupCompleted
              action = "Successfully completed savings cycle"
              points = "+10"
              type = "positive"
              break
            case 8: // PenaltyPaid
              action = "Late contribution penalty"
              points = "-5"
              type = "negative"
              break
            case 9: // ReputationGained
              action = activity.description || "Reputation increased"
              points = `+${Math.floor(Number(activity.amount) / 1e18)}`
              type = "positive"
              break
            case 10: // ReputationLost
              action = activity.description || "Reputation decreased"
              points = `-${Math.floor(Number(activity.amount) / 1e18)}`
              type = "negative"
              break
            default:
              action = activity.description || "Activity recorded"
              points = "0"
              type = "positive"
          }
          
          return {
            date: timestamp.toLocaleDateString(),
            action,
            points,
            type,
            timestamp
          }
        })
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
        .slice(0, 10) // Show last 10 reputation-related activities
      
      setProcessedActivities(reputationActivities)
    }
  }, [activitiesData])

  // Get reputation score and other data from contract
  const reputationScore = profileData ? Number(profileData.reputation_score) : 0
  const completedCycles = profileData ? Number(profileData.completed_cycles) : 0
  const totalGroups = profileData ? Number(profileData.total_joined_groups) : 0
  const createdGroups = profileData ? Number(profileData.total_created_groups) : 0
  const paymentRate = profileData ? Number(profileData.payment_rate) : 0
  const onTimePayments = profileData ? Number(profileData.on_time_payments) : 0
  const totalPayments = profileData ? Number(profileData.total_payments) : 0

  const getTierInfo = (score: number) => {
    if (score >= 90) return { name: "Expert", color: "text-purple-600", bgColor: "bg-purple-100", min: 90, next: null }
    if (score >= 75) return { name: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100", min: 75, next: 90 }
    if (score >= 50) return { name: "Intermediate", color: "text-green-600", bgColor: "bg-green-100", min: 50, next: 75 }
    if (score >= 25) return { name: "Beginner", color: "text-yellow-600", bgColor: "bg-yellow-100", min: 25, next: 50 }
    return { name: "New", color: "text-gray-600", bgColor: "bg-gray-100", min: 0, next: 25 }
  }

  const currentTier = getTierInfo(reputationScore)
  const nextTierScore = currentTier.next || 100
  const progressToNext = currentTier.next 
    ? ((reputationScore - currentTier.min) / (nextTierScore - currentTier.min)) * 100
    : 100

  // Dynamic achievements based on contract data
  const achievements = [
    {
      title: "First Circle",
      description: "Joined your first savings circle",
      icon: Users,
      earned: totalGroups > 0,
      date: totalGroups > 0 ? "Achieved" : null,
    },
    {
      title: "Perfect Contributor",
      description: "Maintain 90%+ on-time payment rate",
      icon: CheckCircle,
      earned: (onTimePayments / Math.max(totalPayments, 1)) >= 0.9 && totalPayments >= 5,
      date: (onTimePayments / Math.max(totalPayments, 1)) >= 0.9 && totalPayments >= 5 ? "Achieved" : null,
    },
    {
      title: "Circle Completer",
      description: "Successfully completed 3 full savings cycles",
      icon: Award,
      earned: completedCycles >= 3,
      date: completedCycles >= 3 ? "Achieved" : null,
    },
    {
      title: "Community Builder",
      description: "Created your first savings group",
      icon: Star,
      earned: createdGroups > 0,
      date: createdGroups > 0 ? "Achieved" : null,
    },
    {
      title: "Trusted Member",
      description: "Reach reputation score of 90+",
      icon: TrendingUp,
      earned: reputationScore >= 90,
      date: reputationScore >= 90 ? "Achieved" : null,
    },
    {
      title: "Veteran Saver",
      description: "Complete 10+ savings cycles",
      icon: Award,
      earned: completedCycles >= 10,
      date: completedCycles >= 10 ? "Achieved" : null,
    }
  ]

  // Calculate success rate percentage
  const successRate = statisticsData ? Number(statisticsData.success_rate) : 0

  // Show loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your reputation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profilePending || activitiesPending || statisticsPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your reputation data...</p>
        </div>
      </div>
    )
  }

  if (profileError || activitiesError || statisticsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Reputation</CardTitle>
            <CardDescription>
              {profileError?.message || activitiesError?.message || statisticsError?.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
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
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Reputation</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Reputation</h1>
          <p className="text-gray-600">Track your reputation score and unlock new opportunities</p>
        </div>

        {/* Reputation Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Reputation Score
              </CardTitle>
              <CardDescription>Your current reputation level and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl font-bold text-gray-900">{reputationScore}</div>
                <Badge className={`${currentTier.bgColor} ${currentTier.color} hover:${currentTier.bgColor}`}>
                  {currentTier.name}
                </Badge>
              </div>

              {currentTier.next && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress to {getTierInfo(nextTierScore).name}</span>
                    <span className="font-medium">
                      {reputationScore}/{nextTierScore}
                    </span>
                  </div>
                  <Progress value={progressToNext} className="h-2" />
                  <p className="text-sm text-gray-500">
                    {nextTierScore - reputationScore} points needed to reach {getTierInfo(nextTierScore).name} tier
                  </p>
                </div>
              )}

              {/* Additional Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{completedCycles}</div>
                  <div className="text-sm text-gray-600">Completed Cycles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reputation Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${reputationScore >= 50 ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={reputationScore >= 50 ? '' : 'text-gray-400'}>Access to Advanced groups</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${reputationScore >= 75 ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={reputationScore >= 75 ? '' : 'text-gray-400'}>Lower collateral requirements</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${reputationScore >= 75 ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={reputationScore >= 75 ? '' : 'text-gray-400'}>Priority in group selection</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className={`w-4 h-4 ${reputationScore >= 90 ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={reputationScore >= 90 ? '' : 'text-gray-400'}>Create premium groups</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="space-y-6">
          <TabsList>
            <TabsTrigger value="history">Reputation History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="tiers">Tier System</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your reputation changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                {processedActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reputation History</h3>
                    <p className="text-gray-500">Start participating in groups to build your reputation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {processedActivities.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.type === "positive" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {item.type === "positive" ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.action}</p>
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </div>
                        </div>
                        <Badge variant={item.type === "positive" ? "default" : "destructive"}>{item.points}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.earned ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <achievement.icon
                            className={`w-5 h-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <CardDescription className="text-sm">{achievement.description}</CardDescription>
                        </div>
                      </div>
                      {achievement.earned ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Earned</Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </CardHeader>
                  {achievement.earned && achievement.date && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">{achievement.date}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <div className="grid gap-4">
              {[
                {
                  name: "Expert",
                  min: 90,
                  color: "purple",
                  benefits: [
                    "Access to all groups",
                    "Create premium groups",
                    "Priority support",
                    "Lowest collateral requirements",
                  ],
                },
                {
                  name: "Advanced",
                  min: 75,
                  color: "blue",
                  benefits: [
                    "Access to advanced groups",
                    "Reduced collateral",
                    "Group creation privileges",
                    "Priority in selections",
                  ],
                },
                {
                  name: "Intermediate",
                  min: 50,
                  color: "green",
                  benefits: [
                    "Access to intermediate groups",
                    "Standard collateral rates",
                    "Basic group features",
                    "Community support",
                  ],
                },
                {
                  name: "Beginner",
                  min: 25,
                  color: "yellow",
                  benefits: [
                    "Access to beginner groups",
                    "Higher collateral required",
                    "Limited group options",
                    "Learning resources",
                  ],
                },
                {
                  name: "New",
                  min: 0,
                  color: "gray",
                  benefits: [
                    "Access to starter groups only",
                    "Highest collateral required",
                    "Basic features",
                    "Onboarding support",
                  ],
                },
              ].map((tier, index) => (
                <Card
                  key={index}
                  className={`${reputationScore >= tier.min ? `border-${tier.color}-200 bg-${tier.color}-50` : "border-gray-200"}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${tier.color}-100 rounded-full flex items-center justify-center`}>
                          <Star className={`w-6 h-6 text-${tier.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{tier.name}</CardTitle>
                          <CardDescription>{tier.min}+ reputation points required</CardDescription>
                        </div>
                      </div>
                      {reputationScore >= tier.min ? (
                        <Badge className={`bg-${tier.color}-100 text-${tier.color}-800 hover:bg-${tier.color}-100`}>
                          Current
                        </Badge>
                      ) : (
                        <Badge variant="outline">{tier.min - reputationScore} points needed</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Benefits:</h4>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle
                              className={`w-4 h-4 ${reputationScore >= tier.min ? "text-green-500" : "text-gray-400"}`}
                            />
                            <span className={reputationScore >= tier.min ? "text-gray-700" : "text-gray-400"}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}