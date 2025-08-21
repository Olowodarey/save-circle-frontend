"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useGroupDetails } from "@/hooks/use-group-details"
import { useAccount } from "@starknet-react/core"
import { SimpleUsdcContribution } from "@/components/groups/simple-usdc-contribution"
import GroupLiquidityLock from "@/components/groups/group-liquidity-lock"
import GroupHeader from "@/components/groups/group-header"
import GroupStats from "@/components/groups/group-stats"
import GroupProgress from "@/components/groups/group-progress"
import GroupActionPanel from "@/components/groups/group-action-panel"
import GroupMembersList from "@/components/groups/group-members-list"
import GroupPaymentHistory from "@/components/groups/group-payment-history"
import GroupRulesTerms from "@/components/groups/group-rules-terms"

export default function GroupDetailsPage() {
  const params = useParams()
  const groupId = params.id as string
  const { address, isConnected } = useAccount()
  
  // Use the group details hook to fetch real contract data
  const { groupDetails, members, loading, error, refetch } = useGroupDetails(groupId)
  
  // No frontend permission checks - let the contract handle it

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
                <GroupHeader groupDetails={groupDetails} />
                <GroupStats groupDetails={groupDetails} />
                <GroupProgress groupDetails={groupDetails} />
              </div>

              <GroupActionPanel 
                groupDetails={groupDetails}
                loading={loading}
                onRefetch={refetch}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger value="members">Members ({groupDetails.members})</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
            <TabsTrigger value="lock">Lock Liquidity</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="rules">Rules & Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <GroupMembersList groupDetails={groupDetails} members={members} />
          </TabsContent>

          <TabsContent value="contribute" className="space-y-4">
            <SimpleUsdcContribution 
              groupDetails={groupDetails}
              onSuccess={refetch}
            />
          </TabsContent>

          <TabsContent value="lock" className="space-y-4">
            <GroupLiquidityLock 
              groupDetails={groupDetails}
              onLockSuccess={refetch}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <GroupPaymentHistory paymentHistory={paymentHistory} />
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <GroupRulesTerms groupDetails={groupDetails} />
          </TabsContent>
        </Tabs>
      </div>


    </div>
  )
}
