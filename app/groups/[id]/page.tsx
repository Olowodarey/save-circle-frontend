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
import GroupContribution from "@/components/groups/group-contribution"
import GroupLiquidityLock from "@/components/groups/group-liquidity-lock"
import GroupHeader from "@/components/groups/group-header"
import GroupStats from "@/components/groups/group-stats"
import { LockedBalanceDisplay } from "@/components/groups/locked-balance-display"
import { InsurancePoolDisplay } from "@/components/groups/insurance-pool-display"
import { NextPayoutDisplay } from "@/components/groups/next-payout-display"
import { DistributePayoutAction } from "@/components/groups/distribute-payout-action"
import { WithdrawLockedAction } from "@/components/groups/withdraw-locked-action"
import { PayoutOrderDisplay } from "@/components/groups/payout-order-display"
import GroupProgress from "@/components/groups/group-progress"
import GroupActionPanel from "@/components/groups/group-action-panel"
import GroupMembersList from "@/components/groups/group-members-list"
import GroupPaymentHistory from "@/components/groups/group-payment-history"
import GroupRulesTerms from "@/components/groups/group-rules-terms"
import GroupAnalytics from "@/components/groups/group-analytics"
import PenaltyPayoutManagement from "@/components/groups/penalty-payout-management"

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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/groups">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Link>
            </Button>
          </div>
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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/groups">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Link>
            </Button>
          </div>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h2 className="text-xl font-semibold text-gray-900">Group Not Found</h2>
                <p className="text-gray-600">
                  {error || "The group you're looking for doesn't exist or you don't have permission to view it."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button asChild>
                    <Link href="/groups">Browse Groups</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/groups">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Link>
          </Button>
        </div>
        {/* Group Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <GroupHeader groupDetails={groupDetails} />
                <GroupStats groupDetails={groupDetails} />
                <GroupProgress groupDetails={groupDetails} />
                
                {/* New Contract Functions - Quick Analytics */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Group Analytics </h4>
                  <GroupAnalytics groupId={groupId} className="bg-white" />
                </div>
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="lock">Lock Liquidity</TabsTrigger>
            <TabsTrigger value="management">Group Actions</TabsTrigger>
            <TabsTrigger value="penalties">Penalties & Payouts</TabsTrigger>
            {/* <TabsTrigger value="history">Payment History</TabsTrigger> */}
            <TabsTrigger value="rules">Rules & Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <GroupMembersList groupDetails={groupDetails} members={members} />
          </TabsContent>

          <TabsContent value="contribute" className="space-y-4">
            {/* Group Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <LockedBalanceDisplay groupId={params.id as string} />
              <InsurancePoolDisplay groupId={params.id as string} />
              <NextPayoutDisplay groupId={params.id as string} />
            </div>
            
            {/* Contribution Form */}
            <GroupContribution 
              groupDetails={groupDetails}
              onContributionSuccess={refetch}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* New Contract Functions Analytics */}
            <GroupAnalytics groupId={groupId} />
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            {/* Payout Order Display */}
            <PayoutOrderDisplay groupId={params.id as string} />
            
            {/* Admin and User Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DistributePayoutAction 
                groupId={params.id as string}
                groupDetails={groupDetails}
                onSuccess={refetch}
              />
              <WithdrawLockedAction 
                groupId={params.id as string}
                onSuccess={refetch}
              />
            </div>
          </TabsContent>

          <TabsContent value="penalties" className="space-y-4">
            <PenaltyPayoutManagement 
              groupId={groupId} 
              groupDetails={groupDetails} 
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
