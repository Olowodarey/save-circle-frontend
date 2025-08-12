import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useJoinGroup } from '@/hooks/use-join-group'
import { toast } from 'sonner'

interface GroupDetails {
  id: string
  name: string
  contribution: string
  frequency: string
  members: number
  totalPoolAmount: string
  userCanJoin: boolean
  minReputation: number
  userReputation: number
}

interface JoinGroupButtonProps {
  groupDetails: GroupDetails
  onJoinSuccess?: () => void
}

const JoinGroupButton: React.FC<JoinGroupButtonProps> = ({
  groupDetails,
  onJoinSuccess
}) => {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const { joinGroup, isJoining, error, clearError } = useJoinGroup()

  const handleJoinGroup = async () => {
    try {
      const success = await joinGroup(groupDetails.id)
      
      if (success) {
        toast.success('Successfully joined the group!')
        setShowJoinModal(false)
        // Call the success callback to refetch group data
        onJoinSuccess?.()
      } else {
        toast.error('Failed to join group. Please try again.')
      }
    } catch (err: any) {
      console.error('Join group error:', err)
      toast.error(err.message || 'Failed to join group')
    }
  }

  // Clear error when modal opens
  const handleOpenModal = () => {
    clearError()
    setShowJoinModal(true)
  }

  // Check if user meets reputation requirement explicitly
  const meetsReputationRequirement = groupDetails.userReputation >= groupDetails.minReputation
  
  // User can join if they meet reputation requirement (even if userCanJoin is false due to other logic)
  const canActuallyJoin = meetsReputationRequirement && groupDetails.userCanJoin

  return (
    <>
      {/* Join Button Section */}
      <div className="space-y-4">
        {meetsReputationRequirement ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">
                Reputation requirement met ({groupDetails.userReputation}/{groupDetails.minReputation})
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Spots available</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleOpenModal}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Group
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Reputation too low (have {groupDetails.userReputation}, need {groupDetails.minReputation}+)
              </span>
            </div>
            <Button disabled className="w-full">
              Cannot Join
            </Button>
          </div>
        )}
      </div>

      {/* Join Confirmation Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Join {groupDetails.name}?</CardTitle>
              <CardDescription>
                You're about to join this savings group. Please confirm the details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contribution:</span>
                  <span className="font-medium">{groupDetails.contribution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Frequency:</span>
                  <span className="font-medium">{groupDetails.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Your position:</span>
                  <span className="font-medium">#{groupDetails.members + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected payout:</span>
                  <span className="font-medium">{groupDetails.totalPoolAmount}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent" 
                  onClick={() => setShowJoinModal(false)}
                  disabled={isJoining}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleJoinGroup}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    'Confirm & Join'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default JoinGroupButton