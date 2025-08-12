"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Loader2, AlertCircle, CheckCircle, Calendar, Users } from "lucide-react"
import { useGroupContribution } from "@/hooks/use-group-contribution"
import { useAccount } from "@starknet-react/core"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupContributionProps {
  groupDetails: FormattedGroupDetails
  onContributionSuccess?: () => void
}

export default function GroupContribution({ 
  groupDetails, 
  onContributionSuccess 
}: GroupContributionProps) {
  const { address, isConnected } = useAccount()
  const { contribute, isContributing, contributionError, clearError } = useGroupContribution()
  const [showSuccess, setShowSuccess] = useState(false)

  // Check if user can contribute
  const canContribute = () => {
    if (!isConnected || !address) return false
    if (groupDetails.status !== "active") return false
    if (!groupDetails.isUserMember) return false
    return true
  }

  const handleContribution = async () => {
    clearError()
    const success = await contribute(groupDetails.id)
    
    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      onContributionSuccess?.()
    }
  }

  const getContributionMessage = () => {
    if (!isConnected) return "Connect wallet to contribute"
    if (groupDetails.status !== "active") return "Group must be active to accept contributions"
    if (!groupDetails.isUserMember) return "You must be a group member to contribute"
    return "Ready to make your contribution"
  }

  const getStatusBadge = () => {
    if (groupDetails.status === "active") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active - Accepting Contributions
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="text-gray-600 border-gray-200">
        {groupDetails.status} - Not Accepting Contributions
      </Badge>
    )
  }

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Contribution successful! Your payment has been recorded and will be included in the next payout cycle.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Make Contribution
        </CardTitle>
        <CardDescription>
          Contribute to this group's savings pool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Group Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {getStatusBadge()}
        </div>

        {/* Contribution Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{groupDetails.contribution}</div>
            <div className="text-sm text-gray-600">Required Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{groupDetails.frequency}</div>
            <div className="text-sm text-gray-600">Frequency</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Next Payout:</span>
            <span className="font-medium">{groupDetails.nextPayoutDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Current Cycle:</span>
            <span className="font-medium">{groupDetails.currentCycle} of {groupDetails.totalCycles}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Pool:</span>
            <span className="font-medium">{groupDetails.totalPoolAmount}</span>
          </div>
        </div>

        {/* Error Display */}
        {contributionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{contributionError}</AlertDescription>
          </Alert>
        )}

        {/* Status Message */}
        <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
          {getContributionMessage()}
        </div>

        {/* Contribution Button */}
        {canContribute() && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="w-full" 
                disabled={isContributing}
                size="lg"
              >
                {isContributing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Contribution...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Contribute {groupDetails.contribution}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Contribution</AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    You are about to contribute <strong>{groupDetails.contribution}</strong> to "{groupDetails.name}".
                  </p>
                  <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                    <div className="font-semibold text-blue-900">Contribution Details:</div>
                    <div className="text-sm space-y-1">
                      <div>• Amount: {groupDetails.contribution}</div>
                      <div>• Frequency: {groupDetails.frequency}</div>
                      <div>• Current Cycle: {groupDetails.currentCycle} of {groupDetails.totalCycles}</div>
                      <div>• Next Payout: {groupDetails.nextPayoutDate}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    This contribution will be added to the group's savings pool and will be included in the payout rotation.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleContribution} disabled={isContributing}>
                  {isContributing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Contributing...
                    </>
                  ) : (
                    "Confirm Contribution"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Info for non-contributors */}
        {!canContribute() && (
          <Button 
            className="w-full" 
            disabled
            variant="outline"
            size="lg"
          >
            {!isConnected && "Connect Wallet to Contribute"}
            {isConnected && groupDetails.status !== "active" && "Group Not Active"}
            {isConnected && groupDetails.status === "active" && !groupDetails.isUserMember && "Join Group to Contribute"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
