"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useAccount, useSendTransaction, useReadContract } from "@starknet-react/core"
import { Call } from "starknet"

// USDC token address on Starknet
const USDC_TOKEN_ADDRESS = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"

// Liquidity lock contract address
const LIQUIDITY_LOCK_CONTRACT = "0x06d90ff3e08a68b4969717d8ca1924c87873a700dae1e30a321e2dd1ebd0e794"

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

interface SimpleUsdcLockProps {
  groupId: string
  onSuccess?: () => void
}

export function SimpleUsdcLock({ groupId, onSuccess }: SimpleUsdcLockProps) {
  const { address, status } = useAccount()
  const [amount, setAmount] = useState("")
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

  const handleApproveAndLock = async () => {
    if (!address || !amount) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert amount to proper format (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6))
      const groupIdBigInt = BigInt(groupId)
      
      // Format U256 values - split into low and high 128-bit parts
      const formatU256 = (value: bigint) => {
        const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff")
        return {
          low: value & MAX_U128,
          high: value >> BigInt(128),
        }
      }
      
      const amountU256 = formatU256(amountInWei)
      const groupIdU256 = formatU256(groupIdBigInt)

      console.log("Multicall: Approve and Lock USDC:", {
        amount: amount,
        amountInWei: amountInWei.toString(),
        groupId: groupId,
        amountU256: { low: amountU256.low.toString(), high: amountU256.high.toString() },
        groupIdU256: { low: groupIdU256.low.toString(), high: groupIdU256.high.toString() },
      })

      // Create multicall with both approve and lock operations
      const calls: Call[] = [
        {
          entrypoint: "approve",
          contractAddress: USDC_TOKEN_ADDRESS,
          calldata: [
            LIQUIDITY_LOCK_CONTRACT, // spender
            amountU256.low.toString(), // amount low
            amountU256.high.toString(), // amount high
          ],
        },
        {
          entrypoint: "lock_liquidity",
          contractAddress: LIQUIDITY_LOCK_CONTRACT,
          calldata: [
            USDC_TOKEN_ADDRESS, // token_address
            amountU256.low.toString(), // amount low
            amountU256.high.toString(), // amount high
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
      setError(error.message || "Failed to approve and lock USDC")
    } finally {
      setIsProcessing(false)
    }
  }

  const isConnected = status === "connected"
  const userBalance = formatBalance(balance)
  const hasInsufficientBalance = parseFloat(amount || "0") > parseFloat(userBalance)
  
  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">Liquidity locked successfully!</p>
                <p>Amount: {amount} USDC</p>
                <p className="text-sm text-green-600">
                  ✅ Approved and locked in a single transaction
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
                setAmount("")
                setTxHash(null)
                setError(null)
              }}
              variant="outline"
              className="w-full"
            >
              Lock More USDC
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
          <DollarSign className="h-5 w-5" />
          Lock USDC Liquidity
        </CardTitle>
        <CardDescription>
          Lock your USDC tokens for this group in a single transaction. This ensures commitment and builds trust.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to lock liquidity.
            </AlertDescription>
          </Alert>
        )}

        {isConnected && (
          <>
            {/* Balance Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Your USDC Balance: <span className="font-semibold">{userBalance} USDC</span>
              </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Lock (USDC)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
              />
              {hasInsufficientBalance && amount && (
                <p className="text-sm text-red-600">
                  Insufficient balance. You have {userBalance} USDC available.
                </p>
              )}
            </div>

            {/* Multicall Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-medium">One-Step Process</p>
                  <p>Both approval and locking will happen in a single transaction, saving you time and gas fees.</p>
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
              onClick={handleApproveAndLock}
              disabled={!amount || isProcessing || hasInsufficientBalance || parseFloat(amount) <= 0}
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
                  <DollarSign className="h-4 w-4" />
                  Lock {amount || "0"} USDC
                </>
              )}
            </Button>

            {/* Process Info */}
            

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