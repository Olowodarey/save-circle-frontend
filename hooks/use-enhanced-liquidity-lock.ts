"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { useAutoswap } from "./use-autoswap";

export interface LiquidityLockOptions {
  groupId: string;
  amount: string;
  tokenType: "USDC" | "STRK" | "ETH" | "USDT";
  enableAutoswap?: boolean;
}

export function useEnhancedLiquidityLock() {
  const { account, address, isConnected } = useAccount();
  const [isLocking, setIsLocking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [lockedBalance, setLockedBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [swapPreview, setSwapPreview] = useState<{
    inputAmount: string;
    outputAmount: string;
    inputToken: string;
    outputToken: string;
  } | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  const {
    executeSwap,
    getSwapQuote,
    approveToken,
    isSwapping,
    isApproving,
    swapError,
    approvalError,
    approvalStatus,
    clearSwapError,
    clearApprovalError,
    tokenAddresses,
  } = useAutoswap();

  // Helper function to format u256 for contract calls
  const formatU256 = (value: string | bigint) => {
    const bigIntValue = typeof value === "string" ? BigInt(value) : value;
    return {
      low: bigIntValue & BigInt("0xffffffffffffffffffffffffffffffff"),
      high: bigIntValue >> BigInt(128),
    };
  };

  // Helper function to format amount with decimals
  const formatAmountForContract = (amount: string) => {
    // Convert to wei (multiply by 10^18 for USDC)
    const amountInWei = BigInt(
      Math.floor(parseFloat(amount) * Math.pow(10, 18))
    );
    return formatU256(amountInWei);
  };

  // Get user's locked balance
  const fetchLockedBalance = async () => {
    if (!contract || !address || !isConnected) return;

    setIsLoadingBalance(true);
    try {
      const balance = (await contract.call("get_locked_balance", [
        address,
      ])) as bigint;
      const balanceInTokens = Number(balance) / Math.pow(10, 18);
      setLockedBalance(balanceInTokens.toFixed(2));
    } catch (error: any) {
      console.error("Error fetching locked balance:", error);
      setLockedBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Get swap preview for non-USDC tokens
  const getSwapPreview = async (tokenType: string, amount: string) => {
    if (tokenType === "USDC") {
      setSwapPreview(null);
      return;
    }

    try {
      const quote = await getSwapQuote(
        tokenType as keyof typeof tokenAddresses,
        "USDC",
        amount
      );
      
      if (quote) {
        setSwapPreview({
          inputAmount: quote.inputAmount,
          outputAmount: quote.outputAmount,
          inputToken: quote.inputToken,
          outputToken: quote.outputToken,
        });
      }
    } catch (error) {
      console.error("Error getting swap preview:", error);
    }
  };

  // Enhanced lock liquidity with autoswap support
  const lockLiquidityWithAutoswap = async (options: LiquidityLockOptions) => {
    const { groupId, amount, tokenType, enableAutoswap = true } = options;

    if (!account || !isConnected || !address) {
      setLockError("Please connect your wallet first");
      return false;
    }

    setIsLocking(true);
    setLockError(null);
    clearSwapError();

    try {
      let finalAmount = amount;
      let tokenAddress = tokenAddresses.USDC; // Default to USDC

      // If not USDC and autoswap is enabled, perform swap first
      if (tokenType !== "USDC" && enableAutoswap) {
        console.log(`Swapping ${amount} ${tokenType} to USDC...`);
        
        const swapResult = await executeSwap(
          tokenType as keyof typeof tokenAddresses,
          "USDC",
          amount
        );

        if (!swapResult.success) {
          setLockError("Failed to swap tokens before locking");
          return false;
        }

        if (swapResult.outputAmount) {
          finalAmount = swapResult.outputAmount;
          console.log(`Swap successful: ${finalAmount} USDC received`);
          
          // After swap, we need to approve USDC for the liquidity lock contract
          console.log(`Approving ${finalAmount} USDC for liquidity lock...`);
          const approvalSuccess = await approveToken(
            tokenAddresses.USDC,
            CONTRACT_ADDRESS,
            finalAmount,
            "USDC"
          );

          if (!approvalSuccess) {
            setLockError("Failed to approve USDC for liquidity lock");
            return false;
          }
        }
      } else if (tokenType !== "USDC") {
        // If autoswap is disabled but token is not USDC, use the original token
        tokenAddress = tokenAddresses[tokenType as keyof typeof tokenAddresses];
      }

      // Format parameters for contract call
      const groupIdU256 = formatU256(groupId);
      const amountU256 = formatAmountForContract(finalAmount);

      // Prepare the contract call
      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "lock_liquidity",
        calldata: [
          tokenAddress, // token_address (USDC after swap or original token)
          amountU256.low.toString(), // amount low
          amountU256.high.toString(), // amount high
          groupIdU256.low.toString(), // group_id low
          groupIdU256.high.toString(), // group_id high
        ],
      };

      // Send the transaction
      const result = await sendAsync([call]);

      console.log("Liquidity lock transaction sent:", result);

      // Wait for confirmation
      if (result && result.transaction_hash) {
        await account.waitForTransaction(result.transaction_hash);
        console.log("Liquidity lock confirmed");
        // Refresh balance after successful lock
        await fetchLockedBalance();
      }

      return true;
    } catch (error: any) {
      console.error("Enhanced liquidity lock failed:", error);
      setLockError(error.message || "Failed to lock liquidity");
      return false;
    } finally {
      setIsLocking(false);
    }
  };

  // Original lock liquidity function (for backward compatibility)
  const lockLiquidity = async (
    groupId: string,
    amount: string,
    tokenAddress: string = tokenAddresses.USDC
  ) => {
    return lockLiquidityWithAutoswap({
      groupId,
      amount,
      tokenType: "USDC",
      enableAutoswap: false,
    });
  };

  // Withdraw locked liquidity
  const withdrawLocked = async (groupId: string) => {
    if (!account || !isConnected || !address) {
      setWithdrawError("Please connect your wallet first");
      return false;
    }

    setIsWithdrawing(true);
    setWithdrawError(null);

    try {
      // Format group ID
      const groupIdU256 = formatU256(groupId);

      // Prepare the contract call
      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "withdraw_locked",
        calldata: [
          groupIdU256.low.toString(), // group_id low
          groupIdU256.high.toString(), // group_id high
        ],
      };

      // Send the transaction
      const result = await sendAsync([call]);

      console.log("Withdraw locked transaction sent:", result);

      // Wait for confirmation
      if (result && result.transaction_hash) {
        await account.waitForTransaction(result.transaction_hash);
        console.log("Withdraw locked confirmed");
        // Refresh balance after successful withdrawal
        await fetchLockedBalance();
      }

      return true;
    } catch (error: any) {
      console.error("Withdraw locked failed:", error);
      setWithdrawError(error.message || "Failed to withdraw locked liquidity");
      return false;
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Fetch balance on mount and when dependencies change
  useEffect(() => {
    if (contract && address && isConnected) {
      fetchLockedBalance();
    }
  }, [contract, address, isConnected]);

  return {
    // Enhanced functions
    lockLiquidityWithAutoswap,
    getSwapPreview,
    
    // Original functions (backward compatibility)
    lockLiquidity,
    withdrawLocked,
    fetchLockedBalance,
    
    // Approval functions from autoswap hook
    approveToken,
    
    // State
    lockedBalance,
    isLocking: isLocking || isSwapping,
    isWithdrawing,
    isLoadingBalance,
    lockError: lockError || swapError,
    withdrawError,
    swapPreview,
    isApproving,
    approvalError,
    approvalStatus,
    
    // Utilities
    clearLockError: () => {
      setLockError(null);
      clearSwapError();
    },
    clearWithdrawError: () => setWithdrawError(null),
    clearSwapPreview: () => setSwapPreview(null),
    clearApprovalError,
    
    // Token addresses for reference
    supportedTokens: Object.keys(tokenAddresses) as Array<keyof typeof tokenAddresses>,
    tokenAddresses,
  };
}
