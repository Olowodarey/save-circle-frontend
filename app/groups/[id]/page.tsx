"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Star,
  Globe,
  Lock,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useGroupDetails } from "@/hooks/use-group-details"
import { useAccount } from "@starknet-react/core"
import JoinGroupButton from "@/components/groups/joingroupbutton"

export default function GroupDetailsPage() {
  const params = useParams()
  const groupId = params.id as string
  const { address, isConnected } = useAccount()
  
  // Use the group details hook to fetch real contract data
  const { groupDetails, members, loading, error, refetch } = useGroupDetails(groupId)

  // Members data now comes from the contract via useGroupDetails hook

  // Payment history would need additional contract functions to implement
  const paymentHistory: any[] = [] // Placeholder for now



  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/groups">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Groups
                </Link>
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Save Circle</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading group details...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !groupDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/groups">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Groups
                </Link>
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Save Circle</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-red-600 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <span className="text-lg font-semibold">Error loading group</span>
                <p className="text-sm mt-2">{error || "Group not found"}</p>
              </div>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
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
              <Link href="/groups">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Save Circle</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Group Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{groupDetails.name}</h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <Globe className="w-3 h-3 mr-1" />
                          {groupDetails.type}
                        </Badge>
                        {groupDetails.locked && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                        <Badge variant={groupDetails.status === "active" ? "default" : "secondary"}>
                          {groupDetails.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{groupDetails.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {groupDetails.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Group Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Members</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900">
                      {groupDetails.members}/{groupDetails.maxMembers}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Contribution</span>
                    </div>
                    <p className="text-xl font-bold text-green-900">{groupDetails.contribution}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Frequency</span>
                    </div>
                    <p className="text-xl font-bold text-purple-900">{groupDetails.frequency}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Min. Reputation</span>
                    </div>
                    <p className="text-xl font-bold text-yellow-900">{groupDetails.minReputation}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Group Progress</span>
                      <span className="text-sm text-gray-600">
                        Cycle {groupDetails.currentCycle} of {groupDetails.totalCycles}
                      </span>
                    </div>
                    <Progress value={(groupDetails.currentCycle / groupDetails.totalCycles) * 100} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Next payout: {groupDetails.nextPayoutDate}</span>
                    <span>Total pool: {groupDetails.totalPoolAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action Panel */}
              <div className="lg:w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Join This Group</CardTitle>
                    <CardDescription>
                      {groupDetails.userCanJoin
                        ? "You meet all requirements to join this group"
                        : "You don't meet the requirements to join this group"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <JoinGroupButton 
                      groupDetails={groupDetails}
                      onJoinSuccess={refetch}
                    />

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Created by:</span>
                        <span className="font-medium">{groupDetails.creator.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{new Date(groupDetails.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">Members ({groupDetails.members})</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="rules">Rules & Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Members</CardTitle>
                <CardDescription>Current members and their payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div key={member.address} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.isCreator && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{member.name}</h4>
                            {member.isCreator && (
                              <Badge variant="outline" className="text-xs">
                                Creator
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-mono">{member.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">{member.reputation} reputation</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">Position #{member.position}</p>
                          <Badge
                            variant={member.paymentStatus === "paid" ? "default" : "secondary"}
                            className={
                              member.paymentStatus === "paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            }
                          >
                            {member.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Previous payouts and cycle completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Cycle {payment.cycle} Payout</h4>
                          <p className="text-sm text-gray-600">
                            Paid to {payment.recipient} on {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{payment.amount}</p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Rules & Terms</CardTitle>
                <CardDescription>Important information about this savings group</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Payment Rules
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 ml-6">
                    <li>• Contributions must be made every {groupDetails.frequency.toLowerCase()}</li>
                    <li>• Late payments may result in reputation penalties</li>
                    <li>• Payouts are distributed in order of joining</li>
                    <li>• All transactions are recorded on the blockchain</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Membership Requirements
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 ml-6">
                    <li>• Minimum reputation score: {groupDetails.minReputation}</li>
                    <li>• Must have a verified Starknet wallet</li>
                    <li>• Commitment to complete full cycle</li>
                    <li>• Follow community guidelines</li>
                  </ul>
                </div>

                {groupDetails.locked && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-600" />
                      Trust Lock System Active
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 ml-6">
                      <li>• Additional tokens locked to demonstrate commitment and build trust</li>
                      <li>• Higher lock amounts guarantee early withdrawal priority in emergencies</li>
                      <li>• Locked tokens are returned upon successful cycle completion</li>
                      <li>• All tokens automatically converted to USDC for consistency</li>
                      <li>• Lock volume determines withdrawal priority ranking</li>
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Important Notes
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 ml-6">
                    <li>• Smart contracts are audited but use at your own risk</li>
                    <li>• Group creator has administrative privileges</li>
                    <li>• Disputes are resolved through community governance</li>
                    <li>• All members must maintain minimum reputation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  )
}
