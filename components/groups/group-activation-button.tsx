"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Play, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useGroupActivation } from "@/hooks/use-group-activation"
import { useAccount } from "@starknet-react/core"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupActivationButtonProps {
  groupDetails: FormattedGroupDetails
  onActivationSuccess?: () => void
}

export default function GroupActivationButton({ 
  groupDetails, 
  onActivationSuccess 
}: GroupActivationButtonProps) {
  const { address, isConnected } = useAccount()
  const { activateGroup, isActivating, activationError, clearError } = useGroupActivation()
  const [showSuccess, setShowSuccess] = useState(false)

  // Always allow activation attempt - let contract handle validation
  const canActivate = () => {
    if (!isConnected || !address) return false
    if (groupDetails.status === "active") return false
    return true
  }

  const handleActivation = async () => {
    clearError()
    const success = await activateGroup(groupDetails.id)
    
    if (success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      onActivationSuccess?.()
    }
  }

  const getActivationMessage = () => {
    if (!isConnected) return "Connect wallet to activate group"
    if (groupDetails.status === "active") return "Group is already active"
    return "Click to activate group for contributions"
  }

  const getStatusBadge = () => {
    switch (groupDetails.status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "created":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Play className="w-3 h-3 mr-1" />
            Ready to Activate
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            {groupDetails.status}
          </Badge>
        )
    }
  }

  if (showSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Group activated successfully! Members can now start making contributions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Group Status:</span>
        {getStatusBadge()}
      </div>

      {activationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{activationError}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-600 mb-4">
        {getActivationMessage()}
      </div>

      {canActivate() && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={isActivating}
              variant="default"
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating Group...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate Group
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Activate Group for Contributions</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Are you sure you want to activate "{groupDetails.name}" for contributions?
                </p>
                <p className="text-sm text-gray-600">
                  Once activated:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Members will be able to start making contributions</li>
                  <li>The contribution cycle will begin</li>
                  <li>Payouts will be distributed according to the schedule</li>
                  <li>This action cannot be undone</li>
                </ul>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm">
                    <strong>Group Details:</strong>
                    <br />
                    Members: {groupDetails.members}/{groupDetails.maxMembers}
                    <br />
                    Contribution: {groupDetails.contribution}
                    <br />
                    Frequency: {groupDetails.frequency}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleActivation} disabled={isActivating}>
                {isActivating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Activate Group"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
