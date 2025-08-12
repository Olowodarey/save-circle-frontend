"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Lock, Unlock, Loader2, AlertCircle, CheckCircle, Shield, DollarSign } from "lucide-react"
import { useLiquidityLock } from "@/hooks/use-liquidity-lock"
import { useAccount } from "@starknet-react/core"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupLiquidityLockProps {
  groupDetails: FormattedGroupDetails
  onLockSuccess?: () => void
}

export default function GroupLiquidityLock({ 
  groupDetails, 
  onLockSuccess 
}: GroupLiquidityLockProps) {
  const { address, isConnected } = useAccount()
  const { 
    lockLiquidity, 
    withdrawLocked, 
    lockedBalance, 
    isLocking, 
    isWithdrawing, 
    isLoadingBalance,
    lockError, 
    withdrawError, 
    clearLockError, 
    clearWithdrawError 
  } = useLiquidityLock()
  
  const [lockAmount, setLockAmount] = useState("")
  const [showLockSuccess, setShowLockSuccess] = useState(false)
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false)

  // Check if user can lock liquidity
  const canLock = () => {
    if (!isConnected || !address) return false
    if (!groupDetails.requiresLock) return false
    if (!lockAmount || parseFloat(lockAmount) <= 0) return false
    return true
  }

  // Check if user can withdraw
  const canWithdraw = () => {
    if (!isConnected || !address) return false
    if (parseFloat(lockedBalance) <= 0) return false
    return true
  }

  const handleLock = async () => {
    clearLockError()
    const success = await lockLiquidity(groupDetails.id, lockAmount)
    
    if (success) {
      setShowLockSuccess(true)
      setTimeout(() => setShowLockSuccess(false), 5000)
      setLockAmount("")
      onLockSuccess?.()
    }
  }

  const handleWithdraw = async () => {
    clearWithdrawError()
    const success = await withdrawLocked(groupDetails.id)
    
    if (success) {
      setShowWithdrawSuccess(true)
      setTimeout(() => setShowWithdrawSuccess(false), 5000)
      onLockSuccess?.()
    }
  }

  const getLockStatusBadge = () => {
    if (groupDetails.requiresLock) {
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200">
          <Lock className="w-3 h-3 mr-1" />
          Lock Required
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="text-gray-600 border-gray-200">
        <Unlock className="w-3 h-3 mr-1" />
        Lock Optional
      </Badge>
    )
  }

  if (showLockSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Liquidity locked successfully! Your funds are now secured for this group.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (showWithdrawSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Locked liquidity withdrawn successfully! Your funds have been returned to your wallet.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Lock Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Liquidity Lock
          </CardTitle>
          <CardDescription>
            Lock liquidity to secure your participation in this group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lock Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Lock Status:</span>
            {getLockStatusBadge()}
          </div>

          {/* Current Locked Balance */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">Your Locked Balance</div>
                <div className="text-2xl font-bold text-blue-900">
                  {isLoadingBalance ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    `${lockedBalance} USDC`
                  )}
                </div>
              </div>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Group Lock Requirements */}
          {groupDetails.requiresLock && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-sm text-orange-800">
                <strong>Lock Required:</strong> This group requires members to lock liquidity as collateral for participation.
              </div>
            </div>
          )}

          {/* Lock Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Group Type:</span>
              <span className="font-medium ml-2 capitalize">{groupDetails.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Lock Required:</span>
              <span className="font-medium ml-2">{groupDetails.requiresLock ? "Yes" : "No"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lock Liquidity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Lock Liquidity
          </CardTitle>
          <CardDescription>
            Lock USDC tokens to secure your group participation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="lockAmount">Amount to Lock (USDC)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="lockAmount"
                type="number"
                placeholder="Enter amount to lock"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Error Display */}
          {lockError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lockError}</AlertDescription>
            </Alert>
          )}

          {/* Lock Button */}
          {canLock() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full" 
                  disabled={isLocking}
                  size="lg"
                >
                  {isLocking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Locking Liquidity...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Lock {lockAmount} USDC
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Liquidity Lock</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>
                      You are about to lock <strong>{lockAmount} USDC</strong> for group "{groupDetails.name}".
                    </p>
                    <div className="p-4 bg-orange-50 rounded-lg space-y-2">
                      <div className="font-semibold text-orange-900">Important:</div>
                      <div className="text-sm space-y-1 text-orange-800">
                        <div>• Locked funds serve as collateral for group participation</div>
                        <div>• Funds will be locked until you withdraw or group completion</div>
                        <div>• Early withdrawal may incur penalties</div>
                        <div>• Ensure you have sufficient balance for the lock</div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLock} disabled={isLocking}>
                    {isLocking ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Locking...
                      </>
                    ) : (
                      "Confirm Lock"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Info for invalid lock */}
          {!canLock() && (
            <Button 
              className="w-full" 
              disabled
              variant="outline"
              size="lg"
            >
              {!isConnected && "Connect Wallet to Lock"}
              {isConnected && !groupDetails.requiresLock && "Lock Not Required for This Group"}
              {isConnected && groupDetails.requiresLock && (!lockAmount || parseFloat(lockAmount) <= 0) && "Enter Amount to Lock"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Locked Card */}
      {parseFloat(lockedBalance) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5" />
              Withdraw Locked Liquidity
            </CardTitle>
            <CardDescription>
              Withdraw your locked liquidity from this group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Balance Display */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Available to Withdraw:</div>
              <div className="text-lg font-bold text-gray-900">{lockedBalance} USDC</div>
            </div>

            {/* Error Display */}
            {withdrawError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{withdrawError}</AlertDescription>
              </Alert>
            )}

            {/* Withdraw Button */}
            {canWithdraw() && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    disabled={isWithdrawing}
                    variant="outline"
                    size="lg"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Withdrawing...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Withdraw {lockedBalance} USDC
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <p>
                        You are about to withdraw <strong>{lockedBalance} USDC</strong> from group "{groupDetails.name}".
                      </p>
                      <div className="p-4 bg-yellow-50 rounded-lg space-y-2">
                        <div className="font-semibold text-yellow-900">Warning:</div>
                        <div className="text-sm text-yellow-800">
                          Withdrawing locked liquidity may affect your participation in the group and could incur penalties depending on the group rules.
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleWithdraw} disabled={isWithdrawing}>
                      {isWithdrawing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Withdrawing...
                        </>
                      ) : (
                        "Confirm Withdrawal"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
