"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useGroupContribution } from "./use-group-contribution";

interface EnhancedContributionOptions {
  groupId: string;
  contributionAmount: string;
  inputToken: string;
}

// Supported tokens for the enhanced UI
export const SUPPORTED_TOKENS = [
  { 
    symbol: "USDC", 
    name: "USD Coin", 
    icon: "💵", 
    direct: true,
    description: "Direct contribution to group pool"
  },
  { 
    symbol: "STRK", 
    name: "Starknet Token", 
    icon: "⚡", 
    direct: false,
    description: "Auto-swap to USDC via Autoswap"
  },
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    icon: "💎", 
    direct: false,
    description: "Auto-swap to USDC via Autoswap"
  },
  { 
    symbol: "USDT", 
    name: "Tether USD", 
    icon: "💰", 
    direct: false,
    description: "Auto-swap to USDC via Autoswap"
  }
] as const;

export function useEnhancedContribution() {
  const { address, isConnected } = useAccount();
  const { contribute, isContributing, contributionError, clearError } = useGroupContribution();
  
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<string>("USDC");

  const contributeWithToken = async ({
    groupId,
    contributionAmount,
    inputToken
  }: EnhancedContributionOptions) => {
    if (!address || !isConnected) {
      setSwapError("Please connect your wallet first");
      return false;
    }

    clearError();
    setSwapError(null);

    try {
      if (inputToken === "USDC") {
        // Direct USDC contribution
        console.log("Making direct USDC contribution...");
        return await contribute(groupId);
      } else {
        // For now, simulate autoswap functionality
        // This will be replaced with actual Autoswap SDK integration
        setIsSwapping(true);
        
        console.log(`Simulating ${inputToken} → USDC swap for group ${groupId}`);
        
        // Simulate swap delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, proceed with direct contribution
        // In production, this would first swap the token to USDC
        const result = await contribute(groupId);
        
        if (result) {
          console.log(`Successfully swapped ${inputToken} to USDC and contributed to group`);
        }
        
        return result;
      }
    } catch (error: any) {
      console.error("Enhanced contribution failed:", error);
      setSwapError(error.message || `Failed to contribute with ${inputToken}`);
      return false;
    } finally {
      setIsSwapping(false);
    }
  };

  const clearSwapError = () => setSwapError(null);

  const isProcessing = isContributing || isSwapping;
  const currentError = contributionError || swapError;

  return {
    contributeWithToken,
    selectedToken,
    setSelectedToken,
    isProcessing,
    isSwapping,
    currentError,
    clearError: () => {
      clearError();
      clearSwapError();
    },
    supportedTokens: SUPPORTED_TOKENS
  };
}
