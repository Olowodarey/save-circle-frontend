"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { AutoSwappr, TOKEN_ADDRESSES } from "autoswap-sdk";
import { Account, RpcProvider } from "starknet";

export interface SwapQuote {
  inputAmount: number;
  outputAmount: number;
  inputToken: keyof typeof TOKEN_ADDRESSES;
  outputToken: keyof typeof TOKEN_ADDRESSES;
  priceImpact: number;
}

export function useAutoswap() {
  const { account, address, isConnected } = useAccount();
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Execute token swap using AutoSwap SDK
  const executeSwap = async (
    inputToken: keyof typeof TOKEN_ADDRESSES,
    outputToken: keyof typeof TOKEN_ADDRESSES,
    amount: number
  ): Promise<{
    success: boolean;
    transactionHash?: string;
  }> => {
    if (!isConnected || !address) {
      setSwapError("Please connect your wallet first");
      return { success: false };
    }

    setIsSwapping(true);
    setSwapError(null);

    try {
      console.log(`Executing swap: ${amount} ${inputToken} → ${outputToken}`);

      // Get the actual token addresses based on the input parameters
      const inputTokenAddress = TOKEN_ADDRESSES[inputToken];
      const outputTokenAddress = TOKEN_ADDRESSES[outputToken];

      console.log("Token addresses:", {
        inputToken,
        outputToken,
        inputTokenAddress,
        outputTokenAddress,
      });

      // Validate that we have a connected account
      if (!account || !address) {
        throw new Error("No account connected");
      }

      console.log("Using AutoSwap SDK with connected wallet");

      // Create a custom AutoSwappr instance that uses the connected wallet
      // We'll create our own provider and account setup
      const provider = new RpcProvider({
        nodeUrl: "https://starknet-mainnet.public.blastapi.io",
      });

      // Create AutoSwappr with minimal config - we'll override the account
      const autoswappr = new AutoSwappr({
        contractAddress:
          "0x05582ad635c43b4c14dbfa53cbde0df32266164a0d1b36e5b510e5b34aeb364b",
        rpcUrl: "https://starknet-mainnet.public.blastapi.io",
        accountAddress: address,
        privateKey: "0x1", // Dummy private key, we'll override with connected account
      });

      // Override the internal account with the connected wallet account
      (autoswappr as any).account = account;

      console.log("AutoSwappr configured with:", {
        contractAddress:
          "0x05582ad635c43b4c14dbfa53cbde0df32266164a0d1b36e5b510e5b34aeb364b",
        accountAddress: address,
        inputTokenAddress,
        outputTokenAddress,
        amount,
      });

      // Use the SDK's executeSwap method with proper options
      const swapOptions = {
        amount: amount.toString(),
      };

      console.log("Calling SDK executeSwap with:", swapOptions);

      const swapResult = await autoswappr.executeSwap(
        inputTokenAddress,
        outputTokenAddress,
        swapOptions
      );

      console.log("Swap executed successfully:", swapResult);

      // Extract transaction hash from the SDK result
      const transactionHash = swapResult?.result?.transaction_hash;

      if (!transactionHash) {
        throw new Error("No transaction hash returned from swap");
      }

      return {
        success: true,
        transactionHash,
      };
    } catch (error: any) {
      console.error("Swap execution failed:", error);
      setSwapError(error.message || "Failed to execute swap");
      return { success: false };
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    executeSwap,
    isSwapping,
    swapError,
    clearSwapError: () => setSwapError(null),
  };
}
