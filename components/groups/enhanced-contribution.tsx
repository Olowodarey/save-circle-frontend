"use client";

import { useState, useEffect } from "react";
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
import { FormattedGroupDetails } from "@/hooks/use-group-details";
import { CONTRACT_ADDRESS } from "@/constants";

// Token addresses
const USDC_TOKEN_ADDRESS =
  "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const USDT_TOKEN_ADDRESS =
  "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";

// Token configurations
const TOKENS = [
  {
    symbol: "USDC",
    address: USDC_TOKEN_ADDRESS,
    decimals: 6,
    icon: "💵",
  },
  {
    symbol: "STRK",
    address: STRK_TOKEN_ADDRESS,
    decimals: 18,
    icon: "⚡",
  },
  {
    symbol: "ETH",
    address: ETH_TOKEN_ADDRESS,
    decimals: 18,
    icon: "💎",
  },
  {
    symbol: "USDT",
    address: USDT_TOKEN_ADDRESS,
    decimals: 6,
    icon: "💰",
  },
];

// ERC20 ABI for token interactions
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
] as const;

interface EnhancedContributionProps {
  groupDetails: FormattedGroupDetails;
  onSuccess?: () => void;
}

export function EnhancedContribution({
  groupDetails,
  onSuccess,
}: EnhancedContributionProps) {
  const { address, status } = useAccount();
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { sendAsync } = useSendTransaction({});
  const { executeSwap, isSwapping, swapError, clearSwapError } = useAutoswap();

  const selectedTokenConfig = TOKENS.find((t) => t.symbol === selectedToken);
  const isDirectUSDC = selectedToken === "USDC";

  // Get token balance
  const { data: balance } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balance_of",
    address: selectedTokenConfig?.address as `0x${string}` | undefined,
    args: address ? [address] : undefined,
    watch: true,
  });

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

  const handleSwapAndContribute = async () => {
    if (!address || !amount || !selectedTokenConfig) return;

    setIsProcessing(true);
    setError(null);

    try {
      const inputAmount = parseFloat(amount);
      const tokenDecimals = getTokenDecimals(selectedTokenConfig.address);

      if (isDirectUSDC) {
        // Direct USDC contribution
        await handleDirectContribute(inputAmount);
      } else {
        // Swap to USDC first, then contribute
        console.log(
          `Swapping ${inputAmount} ${selectedTokenConfig.symbol} to USDC...`
        );

        // Execute the swap
        const tokenSymbol = selectedTokenConfig.symbol as
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

        console.log(`Now contributing approximately ${estimatedUsdcAmount} USDC...`);

        // Now contribute the estimated USDC amount
        await handleDirectContribute(estimatedUsdcAmount);
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error("Error in swap and contribute:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectContribute = async (usdcAmount: number) => {
    if (!address) return;

    // Convert amount to proper format (USDC has 6 decimals)
    const amountInWei = BigInt(Math.floor(usdcAmount * 1e6));

    // Format U256 values - split into low and high 128-bit parts
    const formatU256 = (value: bigint) => {
      const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff");
      const low = value & MAX_U128;
      const high = value >> BigInt(128);
      return [low.toString(), high.toString()];
    };

    const [amountLow, amountHigh] = formatU256(amountInWei);

    // Approve USDC for the group contract
    const approveCall: Call = {
      contractAddress: USDC_TOKEN_ADDRESS,
      entrypoint: "approve",
      calldata: [CONTRACT_ADDRESS, amountLow, amountHigh],
    };

    // Contribute to group
    const contributeCall: Call = {
      contractAddress: CONTRACT_ADDRESS,
      entrypoint: "contribute_to_group",
      calldata: [groupDetails.id],
    };

    const calls = [approveCall, contributeCall];
    const result = await sendAsync(calls);

    if (result.transaction_hash) {
      setTxHash(result.transaction_hash);
      console.log("Contribution successful:", result.transaction_hash);
    }
  };

  const canContribute = () => {
    if (status !== "connected" || !address) return false;
    if (groupDetails.status !== "active") return false;
    if (!groupDetails.isUserMember) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (!balance) return false;
    
    // Check if user has sufficient USDC balance
    const requiredAmount = BigInt(Math.floor(parseFloat(amount) * 1e6)); // USDC has 6 decimals
    const userBalance = typeof balance === 'bigint' ? balance : BigInt(balance.toString());
    
    if (requiredAmount > userBalance) return false;
    return true;
  };

  const getProcessingMessage = () => {
    return "Processing contribution...";
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Contribution successful! Your payment has been recorded.
              {txHash && (
                <div className="mt-2 text-sm">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Enhanced Contribution
        </CardTitle>
        <CardDescription>
          Contribute {groupDetails.contributionAmount} USDC using any supported token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Selection */}
        <div className="space-y-2">
          <Label htmlFor="token">Select Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              {TOKENS.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <span>{token.icon}</span>
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance Display */}
        {selectedTokenConfig && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">
              Your {selectedToken} Balance:{" "}
              <span className="font-medium">
                {formatBalance(balance, selectedTokenConfig.decimals)} {selectedToken}
              </span>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({selectedToken})</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Enter ${selectedToken} amount`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="any"
          />
        </div>

        {/* Swap Preview for non-USDC tokens */}
        {!isDirectUSDC && amount && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ArrowDownUp className="w-4 h-4" />
              Swap Preview
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>You pay:</span>
                <span className="font-medium">
                  {amount} {selectedToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span>You receive (est.):</span>
                <span className="font-medium">
                  ~{(parseFloat(amount) * 0.95).toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Required for group:</span>
                <span>{groupDetails.contributionAmount} USDC</span>
              </div>
            </div>
          </div>
        )}

        {/* Processing Steps */}
        {isProcessing && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{getProcessingMessage()}</span>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Both approval and contribution will happen in one transaction.
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={handleSwapAndContribute}
          disabled={!canContribute() || isProcessing || isSwapping}
          className="w-full"
          size="lg"
        >
          {isProcessing || isSwapping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isDirectUSDC ? "Contributing..." : "Swapping & Contributing..."}
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              {isDirectUSDC ? `Contribute ${amount || "0"} USDC` : `Swap & Contribute ${amount || "0"} ${selectedToken}`}
            </>
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          This will approve and contribute your USDC in one transaction
        </div>
      </CardContent>
    </Card>
  );
}
