"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, DollarSign, Users } from "lucide-react"
import { useAccount, useSendTransaction, useReadContract } from "@starknet-react/core"
import { Call } from "starknet"
import { FormattedGroupDetails } from "@/hooks/use-group-details"
import { CONTRACT_ADDRESS } from "@/constants"

// USDC token address on Starknet
const USDC_TOKEN_ADDRESS = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"

// ERC20 ABI for USDC token interactions
const ERC20_ABI = [
  {
    type: "function",
    name: "balance_of",
    state_mutability: "view",
    inputs: [
      { name: "account", type: "core::starknet::contract_address::ContractAddress" },
    ],
    outputs: [{ type: "core::integer::u256" }],
  },
] as const

interface SimpleUsdcContributionProps {
  groupDetails: FormattedGroupDetails
  onSuccess?: () => void
}

export function SimpleUsdcContribution({ groupDetails, onSuccess }: SimpleUsdcContributionProps) {
  const { address, status } = useAccount()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { sendAsync } = useSendTransaction({})

  // Check USDC balance
  const { data: balance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balance_of",
    address: USDC_TOKEN_ADDRESS,
    args: address ? [address] : undefined,
    enabled: Boolean(address),
  })

  const formatBalance = (balance: any) => {
    if (!balance) return "0"
    const balanceNum = Number(balance) / 1e6 // USDC has 6 decimals
    return balanceNum.toFixed(2)
  }

  // Check if user can contribute
  const canContribute = () => {
    if (status !== "connected" || !address) return false
    if (groupDetails.status !== "active") return false
    if (!groupDetails.isUserMember) return false
    return true
  }

  const handleApproveAndContribute = async () => {
    if (!address || !canContribute()) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert contribution amount to proper format (USDC has 6 decimals)
      const contributionAmountInWei = BigInt(Math.floor(Number(groupDetails.contributionAmount) * 1e6))
      const groupIdBigInt = BigInt(groupDetails.id)
      
      // Format U256 values - split into low and high 128-bit parts
      const formatU256 = (value: bigint) => {
        const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff")
        return {
          low: value & MAX_U128,
          high: value >> BigInt(128),
        }
      }
      
      const amountU256 = formatU256(contributionAmountInWei)
      const groupIdU256 = formatU256(groupIdBigInt)

      console.log("Multicall: Approve and Contribute USDC:", {
        contributionAmount: groupDetails.contributionAmount,
        amountInWei: contributionAmountInWei.toString(),
        groupId: groupDetails.id,
        amountU256: { low: amountU256.low.toString(), high: amountU256.high.toString() },
        groupIdU256: { low: groupIdU256.low.toString(), high: groupIdU256.high.toString() },
      })

      // Create multicall with both approve and contribute operations
      const calls: Call[] = [
        {
          entrypoint: "approve",
          contractAddress: USDC_TOKEN_ADDRESS,
          calldata: [
            CONTRACT_ADDRESS, // spender (group contract)
            amountU256.low.toString(), // amount low
            amountU256.high.toString(), // amount high
          ],
        },
        {
          entrypoint: "contribute",
          contractAddress: CONTRACT_ADDRESS,
          calldata: [
            groupIdU256.low.toString(), // group_id low
            groupIdU256.high.toString(), // group_id high
          ],
        },
      ]

      console.log("Multicall details:", calls)

      const result = await sendAsync(calls)
      console.log("Multicall transaction sent:", result)

      if (result?.transaction_hash) {
        setTxHash(result.transaction_hash)
        setIsSuccess(true)
        onSuccess?.()
      }
    } catch (error: any) {
      console.error("Multicall failed:", error)
      setError(error.message || "Failed to approve and contribute USDC")
    } finally {
      setIsProcessing(false)
    }
  }

  const isConnected = status === "connected"
  const userBalance = formatBalance(balance)
  const hasInsufficientBalance = groupDetails.contributionAmount > parseFloat(userBalance)
  
  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">Contribution successful!</p>
                <p>Amount: {groupDetails.contributionAmount} USDC</p>
                <p className="text-sm text-green-600">
                  ✅ Approved and contributed in a single transaction
                </p>
                {txHash && (
                  <p className="text-xs font-mono">
                    Tx: {txHash.slice(0, 20)}...
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button
              onClick={() => {
                setIsSuccess(false)
                setTxHash(null)
                setError(null)
              }}
              variant="outline"
              className="w-full"
            >
              Make Another Contribution
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contribute to Group
        </CardTitle>
        <CardDescription>
          Contribute {(() => {
            // Convert contributionAmount to number, handling both bigint and string types
            let baseAmount: number;
            if (typeof groupDetails.contributionAmount === 'bigint') {
              // If it's a bigint, convert from USDC units (6 decimals) to readable number
              baseAmount = Number(groupDetails.contributionAmount) / Math.pow(10, 6);
            } else {
              // If it's already a string/number, parse it directly
              baseAmount = parseFloat(String(groupDetails.contributionAmount));
            }
            const poolFee = baseAmount * 0.01; // 1% pool fee
            const totalAmount = baseAmount + poolFee;
            return totalAmount.toFixed(2);
          })()} USDC to {groupDetails.name} in a single transaction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to contribute to this group.
            </AlertDescription>
          </Alert>
        )}

        {isConnected && !canContribute() && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {groupDetails.status !== "active" 
                ? "This group is not currently active for contributions."
                : !groupDetails.isUserMember 
                ? "You must be a member of this group to contribute."
                : "Unable to contribute at this time."
              }
            </AlertDescription>
          </Alert>
        )}

        {isConnected && canContribute() && (
          <>
            {/* Balance Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Your USDC Balance: <span className="font-semibold">{userBalance} USDC</span>
              </p>
            </div>

            {/* Contribution Amount Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Required Contribution</Label>
                  <p className="text-2xl font-bold text-gray-900">
                    {groupDetails.contributionAmount} USDC
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {hasInsufficientBalance && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Insufficient balance. You need {groupDetails.contributionAmount} USDC but only have {userBalance} USDC available.
                </AlertDescription>
              </Alert>
            )}

            {/* Multicall Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">One-Step Process</p>
                  <p>Both approval and contribution will happen in a single transaction, saving you time and gas fees.</p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Button */}
            <Button
              onClick={handleApproveAndContribute}
              disabled={isProcessing || hasInsufficientBalance}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Contribute {groupDetails.contributionAmount} USDC
                </>
              )}
            </Button>

            {/* Process Info */}
            <div className="text-center text-sm text-gray-600">
              <p>This will approve and contribute your USDC in one transaction</p>
            </div>

            {/* Transaction Hash */}
            {txHash && !isSuccess && (
              <div className="text-center">
                <p className="text-xs text-gray-600 font-mono">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-10)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Transaction submitted. Waiting for confirmation...
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
