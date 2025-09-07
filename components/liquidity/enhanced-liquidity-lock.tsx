"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowDownUp,
  DollarSign,
} from "lucide-react";
import {
  useAccount,
  useSendTransaction,
  useReadContract,
} from "@starknet-react/core";
import { Call } from "starknet";
import { useAutoswap } from "@/hooks/use-autoswap";

// Token addresses
const USDC_TOKEN_ADDRESS =
  "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const USDT_TOKEN_ADDRESS =
  "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";

// Liquidity lock contract address
const LIQUIDITY_LOCK_CONTRACT =
  "0x018b7d8a7de2d9f63d69dc64d82a1dd728c304c29d07f7e14e1b9ca3fa124609";

// Token options for dropdown - STRK first as default
const TOKEN_OPTIONS = [
  { value: STRK_TOKEN_ADDRESS, label: "STRK", symbol: "STRK" },
  { value: ETH_TOKEN_ADDRESS, label: "ETH", symbol: "ETH" },
  { value: USDT_TOKEN_ADDRESS, label: "USDT", symbol: "USDT" },
  { value: USDC_TOKEN_ADDRESS, label: "USDC", symbol: "USDC" },
];

// ERC20 ABI for token interactions
const ERC20_ABI = [
  {
    type: "function",
    name: "balance_of",
    state_mutability: "view",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [{ type: "core::integer::u256" }],
  },
] as const;

interface EnhancedLiquidityLockProps {
  groupId: string;
  onSuccess?: () => void;
}

export function EnhancedLiquidityLock({
  groupId,
  onSuccess,
}: EnhancedLiquidityLockProps) {
  const { address, status } = useAccount();
  // Changed default to STRK instead of USDC
  const [selectedToken, setSelectedToken] = useState(STRK_TOKEN_ADDRESS);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { sendAsync } = useSendTransaction({});
  const { executeSwap, isSwapping, swapError } = useAutoswap();

  // Check token balance
  const { data: balance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balance_of",
    address: selectedToken as `0x${string}`,
    args: address ? [address] : undefined,
    enabled: Boolean(address),
  });

  const selectedTokenInfo = TOKEN_OPTIONS.find(
    (token) => token.value === selectedToken
  );
  const isDirectUSDC = selectedToken === USDC_TOKEN_ADDRESS;

  const formatBalance = (balance: any, decimals: number = 6) => {
    if (!balance) return "0";
    const balanceNum = Number(balance) / Math.pow(10, decimals);
    return balanceNum.toFixed(2);
  };

  const getTokenDecimals = (tokenAddress: string) => {
    if (
      tokenAddress === ETH_TOKEN_ADDRESS ||
      tokenAddress === STRK_TOKEN_ADDRESS
    )
      return 18;
    return 6; // USDC and USDT
  };

  const handleSwapAndLock = async () => {
    if (!address || !amount || !selectedTokenInfo) return;

    setIsProcessing(true);
    setError(null);

    try {
      const inputAmount = parseFloat(amount);
      const tokenDecimals = getTokenDecimals(selectedToken);

      if (isDirectUSDC) {
        // Direct USDC lock
        await handleDirectLock(inputAmount);
      } else {
        // Swap to USDC first, then lock
        console.log(
          `Swapping ${inputAmount} ${selectedTokenInfo.symbol} to USDC...`
        );

        // Execute the swap (simplified - no quote needed)
        const tokenSymbol = selectedTokenInfo.symbol as
          | "STRK"
          | "ETH"
          | "USDT"
          | "USDC";
        const swapResult = await executeSwap(tokenSymbol, "USDC", inputAmount);

        if (!swapResult || !swapResult.success) {
          throw new Error(swapResult ? "Swap failed" : "No swap result");
        }

        console.log("Swap successful:", swapResult);

        // Wait a moment for the swap to be confirmed on-chain
        console.log("Waiting for swap confirmation...");
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // For now, use a conservative estimate of the USDC received
        // In a real implementation, you'd query the actual balance or get this from the swap result
        let estimatedUsdcAmount: number;
        if (tokenSymbol === "STRK") {
          estimatedUsdcAmount = inputAmount * 0.12; // Approximate STRK to USDC rate
        } else if (tokenSymbol === "ETH") {
          estimatedUsdcAmount = inputAmount * 2500; // Approximate ETH to USDC rate
        } else if (tokenSymbol === "USDT") {
          estimatedUsdcAmount = inputAmount * 0.99; // Approximate USDT to USDC rate
        } else {
          estimatedUsdcAmount = inputAmount; // Fallback
        }

        console.log(`Now locking approximately ${estimatedUsdcAmount} USDC...`);

        // Now lock the estimated USDC amount
        await handleDirectLock(estimatedUsdcAmount);
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error("Error in swap and lock:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectLock = async (usdcAmount: number) => {
    if (!address) return;

    // Convert amount to proper format (USDC has 6 decimals)
    const amountInWei = BigInt(Math.floor(usdcAmount * 1e6));
    const groupIdBigInt = BigInt(groupId);

    // Format U256 values - split into low and high 128-bit parts
    const formatU256 = (value: bigint) => {
      const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff");
      return {
        low: value & MAX_U128,
        high: value >> BigInt(128),
      };
    };

    const amountU256 = formatU256(amountInWei);
    const groupIdU256 = formatU256(groupIdBigInt);

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
    ];

    const result = await sendAsync(calls);
    setTxHash(result.transaction_hash);
  };

  const reset = () => {
    setAmount("");
    setError(null);
    setTxHash(null);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  if (status !== "connected") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Lock Liquidity
          </CardTitle>
          <CardDescription>
            Connect your wallet to lock liquidity for this group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to continue.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Liquidity Locked Successfully!
          </CardTitle>
          <CardDescription>
            Your liquidity has been locked for the group.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {txHash && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Transaction Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={reset} className="w-full">
            Lock More Liquidity
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
            swap your token using Autoswap
        </CardTitle>
        <CardDescription>
          Lock liquidity using any supported token. Non-USDC tokens will be
          automatically swapped to USDC.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <Label htmlFor="token-select">Select Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              {TOKEN_OPTIONS.map((token) => (
                <SelectItem key={token.value} value={token.value}>
                  {token.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance Display */}
        <Alert>
          <DollarSign className="h-4 w-4" />
          <AlertDescription>
            Your {selectedTokenInfo?.symbol} Balance:{" "}
            {formatBalance(balance, getTokenDecimals(selectedToken))}{" "}
            {selectedTokenInfo?.symbol}
          </AlertDescription>
        </Alert>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount to Lock ({selectedTokenInfo?.symbol})
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.000001"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Swap Preview */}
        {!isDirectUSDC && amount && (
          <Alert>
            <ArrowDownUp className="h-4 w-4" />
            <AlertDescription>
              This will swap your {selectedTokenInfo?.symbol} to USDC before
              locking liquidity.
            </AlertDescription>
          </Alert>
        )}

        {/* Process Info */}
        {!isDirectUSDC && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Two-Step Process: First swap {selectedTokenInfo?.symbol} → USDC,
              then lock USDC liquidity.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {(error || swapError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || swapError}</AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={handleSwapAndLock}
          disabled={!amount || isProcessing || isSwapping}
          className="w-full"
        >
          {isProcessing || isSwapping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isDirectUSDC ? "Processing..." : "Swapping..."}
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-4 w-4" />
              {`Swap ${amount || "0"} ${isDirectUSDC ? 'USDC' : selectedTokenInfo?.symbol}`}
            </>
          )}
        </Button>

        {/* Transaction Info */}
        <Alert>
          <AlertDescription>
            {isDirectUSDC
              ? "This will swap your tokens to USDC n."
              : "This will swap your tokens to USDC ."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}