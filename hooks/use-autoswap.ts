"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { AutoSwappr, TOKEN_ADDRESSES } from "autoswap-sdk";

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

    
      const inputTokenAddress = TOKEN_ADDRESSES.STRK;
      const outputTokenAddress = TOKEN_ADDRESSES.USDC;

      console.log("Token addresses:", {
        inputToken,
        outputToken,
        inputTokenAddress,
        outputTokenAddress
      });

      // Convert amount to wei based on token decimals
      // STRK and ETH use 18 decimals, USDC and USDT use 6 decimals
      let decimals = 18;
      if (inputToken === "USDC" || inputToken === "USDT") {
        decimals = 6;
      }
      
      const amountInWei = BigInt(Math.floor(amount * 1e18));
      const finalAmount = Number(amountInWei);

      console.log("Amount conversion:", {
        originalAmount: amount,
        decimals,
        amountInWei: amountInWei.toString(),
        finalAmount
      });

      // Initialize AutoSwap SDK
      const autoswappr = new AutoSwappr({
        contractAddress:
          "0x05582ad635c43b4c14dbfa53cbde0df32266164a0d1b36e5b510e5b34aeb364b",
        rpcUrl: "https://starknet-mainnet.public.blastapi.io",
        accountAddress: address,
        privateKey: "",
      });

      // Execute swap with the correct token addresses
      console.log("Calling autoswappr.executeSwap with:", {
        inputTokenAddress,
        outputTokenAddress,
        amount: finalAmount
      });

      const swapResult = await autoswappr.executeSwap(
        inputTokenAddress,
        outputTokenAddress,
        {
          amount: finalAmount.toString(),
        }
      );

      console.log("Swap executed successfully:", swapResult);

      // Extract transaction hash from the SDK result
      const transactionHash =
        swapResult?.result?.transaction_hash ||
        (swapResult as any)?.transactionHash ||
        (swapResult as any)?.transaction_hash;

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
