"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, Award, Users, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReputationPage() {
  const reputationScore = 85
  const nextTierScore = 90
  const progressToNext = ((reputationScore - 75) / (nextTierScore - 75)) * 100

  const reputationHistory = [
    {
      date: "2024-01-15",
      action: "Completed savings cycle in Tech Professionals Circle",
      points: "+10",
      type: "positive",
    },
    {
      date: "2024-01-10",
      action: "Made on-time contribution to DeFi Builders",
      points: "+5",
      type: "positive",
    },
    {
      date: "2024-01-05",
      action: "Successfully received payout without issues",
      points: "+3",
      type: "positive",
    },
    {
      date: "2023-12-28",
      action: "Late contribution to previous group",
      points: "-2",
      type: "negative",
    },
    {
      date: "2023-12-20",
      action: "Joined first savings circle",
      points: "+15",
      type: "positive",
    },
  ]

  const achievements = [
    {
      title: "First Circle",
      description: "Joined your first savings circle",
      icon: Users,
      earned: true,
      date: "Dec 2023",
    },
    {
      title: "Perfect Contributor",
      description: "Made 10 consecutive on-time contributions",
      icon: CheckCircle,
      earned: true,
      date: "Jan 2024",
    },
    {
      title: "Circle Completer",
      description: "Successfully completed 3 full savings cycles",
      icon: Award,
      earned: true,
      date: "Jan 2024",
    },
    {
      title: "Community Builder",
      description: "Created your first savings group",
      icon: Star,
      earned: false,
      date: null,
    },
    {
      title: "Trusted Member",
      description: "Reach reputation score of 90+",
      icon: TrendingUp,
      earned: false,
      date: null,
    },
  ]

  const getTierInfo = (score: number) => {
    if (score >= 90) return { name: "Expert", color: "text-purple-600", bgColor: "bg-purple-100" }
    if (score >= 75) return { name: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (score >= 50) return { name: "Intermediate", color: "text-green-600", bgColor: "bg-green-100" }
    if (score >= 25) return { name: "Beginner", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { name: "New", color: "text-gray-600", bgColor: "bg-gray-100" }
  }

  const currentTier = getTierInfo(reputationScore)
  const nextTier = getTierInfo(nextTierScore)

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

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress to {nextTier.name}</span>
                  <span className="font-medium">
                    {reputationScore}/{nextTierScore}
                  </span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <p className="text-sm text-gray-500">
                  {nextTierScore - reputationScore} points needed to reach {nextTier.name} tier
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reputation Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Access to Advanced groups</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Lower collateral requirements</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Priority in group selection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle className="w-4 h-4 text-gray-400" />
                <span>Create premium groups</span>
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
                <CardDescription>Your reputation changes over the last few months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputationHistory.map((item, index) => (
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
                      <p className="text-sm text-gray-600">Earned in {achievement.date}</p>
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
                  className={`border-${tier.color}-200 ${reputationScore >= tier.min ? `bg-${tier.color}-50` : ""}`}
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
