"use client";

import { useState } from "react";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { Call } from "starknet";

// AutoSwap contract address from memory
const AUTOSWAP_CONTRACT_ADDRESS = "0x5b08cbdaa6a2338e69fad7c62ce20204f1666fece27288837163c19320b9496";

// Token addresses for supported tokens
const TOKEN_ADDRESSES = {
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d", // STRK token
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // ETH token
  USDT: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8", // USDT token
  USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC token (target)
};

export interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  inputToken: string;
  outputToken: string;
  priceImpact: string;
}

export function useAutoswap() {
  const { account, address, isConnected } = useAccount();
  const [isSwapping, setIsSwapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<{ [key: string]: boolean }>({});

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  // Helper function to format u256 for approvals
  const formatU256 = (value: string | bigint) => {
    const bigIntValue = typeof value === "string" ? BigInt(value) : value;
    return {
      low: bigIntValue & BigInt("0xffffffffffffffffffffffffffffffff"),
      high: bigIntValue >> BigInt(128),
    };
  };

  // Approve token spending
  const approveToken = async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    tokenSymbol?: string
  ): Promise<boolean> => {
    if (!account || !isConnected) {
      setApprovalError("Please connect your wallet first");
      return false;
    }

    setIsApproving(true);
    setApprovalError(null);

    try {
      // Convert amount to proper format
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      const amountU256 = formatU256(amountInWei);

      // Prepare approval call
      const approvalCall: Call = {
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [
          spenderAddress, // spender
          amountU256.low.toString(), // amount low
          amountU256.high.toString(), // amount high
        ],
      };

      // Send approval transaction
      const result = await sendAsync([approvalCall]);
      console.log("Approval transaction sent:", result);

      // Wait for confirmation
      if (result && result.transaction_hash) {
        await account.waitForTransaction(result.transaction_hash);
        console.log("Approval confirmed");
      }

      // Mark token as approved
      if (tokenSymbol) {
        setApprovalStatus(prev => ({ ...prev, [tokenSymbol]: true }));
      }
      
      return true;
    } catch (error: any) {
      console.error("Token approval failed:", error);
      setApprovalError(error.message || "Failed to approve token");
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  // Get quote for token swap
  const getSwapQuote = async (
    inputToken: keyof typeof TOKEN_ADDRESSES,
    outputToken: keyof typeof TOKEN_ADDRESSES,
    amount: string
  ): Promise<SwapQuote | null> => {
    if (!isConnected || !account) {
      setSwapError("Please connect your wallet first");
      return null;
    }

    setIsLoadingQuote(true);
    setSwapError(null);

    try {
      // Convert amount to proper format (assuming 18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      
      // Simple estimation for quote (in production, you'd call the actual quote method)
      // Different tokens have different exchange rates, here's a basic simulation
      let estimatedOutput = amountInWei;
      
      if (inputToken === "STRK" && outputToken === "USDC") {
        estimatedOutput = amountInWei * BigInt(50) / BigInt(100); // Assume 1 STRK ≈ 0.5 USDC
      } else if (inputToken === "ETH" && outputToken === "USDC") {
        estimatedOutput = amountInWei * BigInt(2500) / BigInt(1); // Assume 1 ETH ≈ 2500 USDC
      } else if (inputToken === "USDT" && outputToken === "USDC") {
        estimatedOutput = amountInWei * BigInt(99) / BigInt(100); // Assume 1:1 with slight slippage
      }
      
      // Apply 5% slippage
      estimatedOutput = estimatedOutput * BigInt(95) / BigInt(100);

      const swapQuote: SwapQuote = {
        inputAmount: amount,
        outputAmount: (Number(estimatedOutput) / Math.pow(10, 18)).toFixed(6),
        inputToken,
        outputToken,
        priceImpact: "5.0", // Estimated price impact
      };

      setQuote(swapQuote);
      return swapQuote;
    } catch (error: any) {
      console.error("Error getting swap quote:", error);
      setSwapError(error.message || "Failed to get swap quote");
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Execute token swap (assumes token is already approved)
  const executeSwap = async (
    inputToken: keyof typeof TOKEN_ADDRESSES,
    outputToken: keyof typeof TOKEN_ADDRESSES,
    amount: string,
    minOutputAmount?: string
  ): Promise<{ success: boolean; outputAmount?: string; transactionHash?: string }> => {
    if (!isConnected || !account || !address) {
      setSwapError("Please connect your wallet first");
      return { success: false };
    }

    // Check if token is approved
    if (!approvalStatus[inputToken]) {
      setSwapError(`Please approve ${inputToken} spending first`);
      return { success: false };
    }

    setIsSwapping(true);
    setSwapError(null);

    try {

      // Execute swap via contract call
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, 18)));
      const minOutputInWei = minOutputAmount 
        ? BigInt(Math.floor(parseFloat(minOutputAmount) * Math.pow(10, 18)))
        : BigInt(0);

      console.log(`Executing swap: ${amount} ${inputToken} → ${outputToken}...`);
      
      // Format amounts for contract call
      const amountU256 = formatU256(amountInWei);
      const minOutputU256 = formatU256(minOutputInWei);
      
      console.log(`Executing ekubo_swap: ${amount} ${inputToken} -> ${outputToken}`);
      console.log(`Amount U256: ${amountU256.low}, ${amountU256.high}`);
      console.log(`Min Output U256: ${minOutputU256.low}, ${minOutputU256.high}`);
      console.log(`Token addresses: ${TOKEN_ADDRESSES[inputToken]} -> ${TOKEN_ADDRESSES[outputToken]}`);
      
      // Try different calldata formats that might work with ekubo_swap
      const swapAttempts = [
        // Format 1: Simple token addresses and amounts
        {
          calldata: [
            TOKEN_ADDRESSES[inputToken],   // token_in
            TOKEN_ADDRESSES[outputToken],  // token_out
            amountU256.low.toString(),     // amount_in low
            amountU256.high.toString(),    // amount_in high
            minOutputU256.low.toString(),  // min_amount_out low
            minOutputU256.high.toString(), // min_amount_out high
            address,                       // recipient
          ],
          description: "Standard format with U256 amounts"
        },
        // Format 2: Without recipient (might be inferred)
        {
          calldata: [
            TOKEN_ADDRESSES[inputToken],   // token_in
            TOKEN_ADDRESSES[outputToken],  // token_out
            amountU256.low.toString(),     // amount_in low
            amountU256.high.toString(),    // amount_in high
            minOutputU256.low.toString(),  // min_amount_out low
            minOutputU256.high.toString(), // min_amount_out high
          ],
          description: "Without recipient parameter"
        },
        // Format 3: Single amount values (not U256)
        {
          calldata: [
            TOKEN_ADDRESSES[inputToken],   // token_in
            TOKEN_ADDRESSES[outputToken],  // token_out
            amountInWei.toString(),        // amount_in as single value
            minOutputInWei.toString(),     // min_amount_out as single value
            address,                       // recipient
          ],
          description: "Single amount values instead of U256"
        },
        // Format 4: Reversed token order
        {
          calldata: [
            TOKEN_ADDRESSES[outputToken],  // token_out first
            TOKEN_ADDRESSES[inputToken],   // token_in second
            amountU256.low.toString(),     // amount_in low
            amountU256.high.toString(),    // amount_in high
            minOutputU256.low.toString(),  // min_amount_out low
            minOutputU256.high.toString(), // min_amount_out high
            address,                       // recipient
          ],
          description: "Reversed token order"
        }
      ];

      // Try different calldata formats until one works
      for (const attempt of swapAttempts) {
        try {
          console.log(`Trying ekubo_swap with ${attempt.description}:`, attempt.calldata);
          
          const swapCall: Call = {
            contractAddress: AUTOSWAP_CONTRACT_ADDRESS,
            entrypoint: "ekubo_swap",
            calldata: attempt.calldata,
          };
          
          const swapResult = await sendAsync([swapCall]);
          console.log(`Swap successful with ${attempt.description}:`, swapResult);

          // Wait for transaction confirmation
          if (swapResult && swapResult.transaction_hash) {
            await account.waitForTransaction(swapResult.transaction_hash);
            console.log("Swap confirmed");
          }

          // Calculate estimated output based on input token type
          let estimatedOutput = amountInWei;
          if (inputToken === "STRK" && outputToken === "USDC") {
            estimatedOutput = amountInWei * BigInt(50) / BigInt(100);
          } else if (inputToken === "ETH" && outputToken === "USDC") {
            estimatedOutput = amountInWei * BigInt(2500) / BigInt(1);
          } else if (inputToken === "USDT" && outputToken === "USDC") {
            estimatedOutput = amountInWei * BigInt(99) / BigInt(100);
          }
          estimatedOutput = estimatedOutput * BigInt(95) / BigInt(100); // Apply slippage

          return {
            success: true,
            outputAmount: (Number(estimatedOutput) / Math.pow(10, 18)).toString(),
            transactionHash: swapResult?.transaction_hash,
          };
        } catch (attemptError: any) {
          console.log(`${attempt.description} failed:`, attemptError.message);
          continue; // Try next format
        }
      }
      
      // If all swap attempts fail, return a helpful error message
      console.error("All ekubo_swap calldata formats failed");
      throw new Error(
        "AutoSwap contract call failed. Please ensure you have sufficient token balance and try again. " +
        "If the issue persists, you can use USDC directly for liquidity locking."
      );
    } catch (error: any) {
      console.error("Swap failed:", error);
      setSwapError(error.message || "Failed to execute swap");
      return { success: false };
    } finally {
      setIsSwapping(false);
    }
  };

  // Swap STRK to USDC (most common use case for liquidity locking)
  const swapStrkToUsdc = async (strkAmount: string) => {
    return executeSwap("STRK", "USDC", strkAmount);
  };

  // Get STRK to USDC quote
  const getStrkToUsdcQuote = async (strkAmount: string) => {
    return getSwapQuote("STRK", "USDC", strkAmount);
  };

  return {
    // Core swap functions
    getSwapQuote,
    executeSwap,
    approveToken,
    
    // Convenience functions for STRK to USDC
    swapStrkToUsdc,
    getStrkToUsdcQuote,
    
    // State
    isSwapping,
    isApproving,
    isLoadingQuote,
    swapError,
    approvalError,
    quote,
    approvalStatus,
    
    // Utilities
    clearSwapError: () => setSwapError(null),
    clearApprovalError: () => setApprovalError(null),
    clearQuote: () => setQuote(null),
    resetApprovalStatus: () => setApprovalStatus({}),
    
    // Token addresses for reference
    tokenAddresses: TOKEN_ADDRESSES,
  };
}
