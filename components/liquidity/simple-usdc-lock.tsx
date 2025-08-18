"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useAccount, useSendTransaction, useReadContract } from "@starknet-react/core"
import { uint256 } from "starknet"

// USDC token address on Starknet
const USDC_TOKEN_ADDRESS = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"

// Liquidity lock contract address
const LIQUIDITY_LOCK_CONTRACT = "0x037c49f99be664a2d5ede866a619e7ff629adf7a021ad6ba99f9ba94bbcd5923"

// ERC20 ABI for USDC token interactions
const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    state_mutability: "external",
    inputs: [
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" },
    ],
    outputs: [{ type: "core::bool" }],
  },
  {
    type: "function",
    name: "allowance",
    state_mutability: "view",
    inputs: [
      { name: "owner", type: "core::starknet::contract_address::ContractAddress" },
      { name: "spender", type: "core::starknet::contract_address::ContractAddress" },
    ],
    outputs: [{ type: "core::integer::u256" }],
  },
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

// Liquidity lock contract ABI (simplified)
const LOCK_ABI = [
  {
    type: "function",
    name: "lock_liquidity", 
    state_mutability: "external",
    inputs: [
      { name: "token_address", type: "core::starknet::contract_address::ContractAddress" },
      { name: "amount", type: "core::integer::u256" },
      { name: "group_id", type: "core::integer::u256" },
    ],
    outputs: [],
  },
] as const

interface SimpleUsdcLockProps {
  groupId: string
  onSuccess?: () => void
}

export function SimpleUsdcLock({ groupId, onSuccess }: SimpleUsdcLockProps) {
  const { address, status } = useAccount()
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState<"approve" | "lock" | "success">("approve")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const { sendAsync } = useSendTransaction({})

  // Check USDC balance
  const { data: balance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balance_of",
    address: USDC_TOKEN_ADDRESS,
    args: address ? [address] : undefined,
    enabled: Boolean(address),
  })

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "allowance",
    address: USDC_TOKEN_ADDRESS,
    args: address ? [address, LIQUIDITY_LOCK_CONTRACT] : undefined,
    enabled: Boolean(address),
  })

  const formatBalance = (balance: any) => {
    if (!balance) return "0"
    const balanceNum = Number(balance) / 1e6 // USDC has 6 decimals
    return balanceNum.toFixed(2)
  }

  const handleApprove = async () => {
    if (!address || !amount) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert amount to proper format (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6))
      
      // Format U256 values using the same method as the working implementation
      const formatU256 = (value: bigint) => {
        const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff")
        return {
          low: value & MAX_U128,
          high: value >> BigInt(128),
        }
      }
      
      const amountU256 = formatU256(amountInWei)

      console.log("Approving USDC for liquidity lock:", {
        amount: amount,
        amountInWei: amountInWei.toString(),
        spender: LIQUIDITY_LOCK_CONTRACT,
        amountU256: { low: amountU256.low.toString(), high: amountU256.high.toString() },
      })

      const approveCall = {
        contractAddress: USDC_TOKEN_ADDRESS,
        entrypoint: "approve",
        calldata: [
          LIQUIDITY_LOCK_CONTRACT, // spender
          amountU256.low.toString(), // amount low
          amountU256.high.toString(), // amount high
        ],
      }

      console.log("Approve call details:", approveCall)

      const result = await sendAsync([approveCall])
      console.log("Approval transaction sent:", result)

      if (result?.transaction_hash) {
        setTxHash(result.transaction_hash)
        
        // Wait for transaction confirmation with polling
        let attempts = 0
        const maxAttempts = 20 // Wait up to 60 seconds (3s * 20)
        
        const pollForApproval = async () => {
          attempts++
          console.log(`Polling for approval confirmation, attempt ${attempts}/${maxAttempts}`)
          
          try {
            await refetchAllowance()
            
            // Check if approval went through
            const currentAllowanceValue = allowance ? Number(allowance) / 1e6 : 0
            const requiredAmount = parseFloat(amount)
            
            console.log(`Current allowance: ${currentAllowanceValue}, Required: ${requiredAmount}`)
            
            if (currentAllowanceValue >= requiredAmount) {
              console.log("Approval confirmed, moving to lock step")
              setStep("lock")
              setIsProcessing(false)
              return
            }
            
            if (attempts < maxAttempts) {
              setTimeout(pollForApproval, 3000)
            } else {
              console.log("Approval polling timeout")
              setError("Approval transaction is taking longer than expected. Please check your transaction and try again.")
              setIsProcessing(false)
            }
          } catch (error) {
            console.error("Error polling for approval:", error)
            if (attempts < maxAttempts) {
              setTimeout(pollForApproval, 3000)
            } else {
              setError("Failed to confirm approval. Please try again.")
              setIsProcessing(false)
            }
          }
        }
        
        // Start polling after initial delay
        setTimeout(pollForApproval, 3000)
      }
    } catch (error: any) {
      console.error("Approval failed:", error)
      setError(error.message || "Failed to approve USDC")
      setIsProcessing(false)
    }
  }

  const handleLock = async () => {
    if (!address || !amount) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert amount to proper format (USDC has 6 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e6))
      
      // Format U256 values using the same method as the working implementation
      const formatU256 = (value: bigint) => {
        const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff")
        return {
          low: value & MAX_U128,
          high: value >> BigInt(128),
        }
      }
      
      const amountU256 = formatU256(amountInWei)
      const groupIdU256 = formatU256(BigInt(groupId))

      console.log("Locking USDC liquidity:", {
        amount: amount,
        amountInWei: amountInWei.toString(),
        groupId: groupId,
        amountU256: { low: amountU256.low.toString(), high: amountU256.high.toString() },
        groupIdU256: { low: groupIdU256.low.toString(), high: groupIdU256.high.toString() },
      })

      const lockCall = {
        contractAddress: LIQUIDITY_LOCK_CONTRACT,
        entrypoint: "lock_liquidity",
        calldata: [
          USDC_TOKEN_ADDRESS, // token_address
          amountU256.low.toString(), // amount low
          amountU256.high.toString(), // amount high
          groupIdU256.low.toString(), // group_id low
          groupIdU256.high.toString(), // group_id high
        ],
      }

      console.log("Lock call details:", lockCall)

      const result = await sendAsync([lockCall])
      console.log("Lock transaction sent:", result)

      if (result?.transaction_hash) {
        setTxHash(result.transaction_hash)
        setStep("success")
        onSuccess?.()
      }
    } catch (error: any) {
      console.error("Lock failed:", error)
      setError(error.message || "Failed to lock USDC")
    } finally {
      setIsProcessing(false)
    }
  }

  const isConnected = status === "connected"
  const userBalance = formatBalance(balance)
  const currentAllowance = allowance ? Number(allowance) / 1e6 : 0
  const hasEnoughAllowance = currentAllowance >= parseFloat(amount || "0")
  
  // Auto-advance to lock step if user already has sufficient allowance
  const shouldShowLockStep = step === "approve" && amount && hasEnoughAllowance && currentAllowance > 0

  if (step === "success") {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p className="font-medium">Liquidity locked successfully!</p>
                <p>Amount: {amount} USDC</p>
                {txHash && (
                  <p className="text-xs font-mono">
                    Tx: {txHash.slice(0, 20)}...
                  </p>
                )}
              </div>
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
          <DollarSign className="h-5 w-5" />
          Lock USDC Liquidity
        </CardTitle>
        <CardDescription>
          Lock your USDC tokens for this group. This ensures commitment and builds trust.
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
              {currentAllowance > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  Current Allowance: {currentAllowance.toFixed(2)} USDC
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Lock (USDC)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
              />
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

            {/* Action Buttons */}
            <div className="space-y-3">
              {step === "approve" && !shouldShowLockStep && (
                <Button
                  onClick={handleApprove}
                  disabled={!amount || isProcessing || parseFloat(amount) > parseFloat(userBalance)}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    `Approve ${amount || "0"} USDC`
                  )}
                </Button>
              )}

              {(step === "lock" || shouldShowLockStep) && (
                <>
                  {shouldShowLockStep && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        ✅ USDC already approved! You can proceed to lock.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    onClick={handleLock}
                    disabled={!amount || isProcessing || !hasEnoughAllowance || parseFloat(amount) > parseFloat(userBalance)}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Locking...
                      </>
                    ) : (
                      `Lock ${amount || "0"} USDC`
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === "approve" ? "bg-blue-500 text-white" : 
                step === "lock" || step === "success" ? "bg-green-500 text-white" : "bg-gray-300"
              }`}>
                1
              </div>
              <span>Approve</span>
              <div className="w-8 h-px bg-gray-300"></div>
           
              <span>Lock</span>
            </div>

            {/* Transaction Hash */}
            {txHash && (
              <div className="text-center">
                <p className="text-xs text-gray-600 font-mono">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-10)}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
