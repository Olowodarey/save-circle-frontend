"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export function useLiquidityLock() {
  const { account, address, isConnected } = useAccount();
  const [isLocking, setIsLocking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [lockedBalance, setLockedBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

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

  // Lock liquidity for a group
  const lockLiquidity = async (
    groupId: string,
    amount: string,
    tokenAddress: string = CONTRACT_ADDRESS
  ) => {
    if (!account || !isConnected || !address) {
      setLockError("Please connect your wallet first");
      return false;
    }

    setIsLocking(true);
    setLockError(null);

    try {
      // Format parameters
      const groupIdU256 = formatU256(groupId);
      const amountU256 = formatAmountForContract(amount);

      // Prepare the contract call
      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "lock_liquidity",
        calldata: [
          tokenAddress, // token_address
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
      console.error("Liquidity lock failed:", error);
      setLockError(error.message || "Failed to lock liquidity");
      return false;
    } finally {
      setIsLocking(false);
    }
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
    lockLiquidity,
    withdrawLocked,
    fetchLockedBalance,
    lockedBalance,
    isLocking,
    isWithdrawing,
    isLoadingBalance,
    lockError,
    withdrawError,
    clearLockError: () => setLockError(null),
    clearWithdrawError: () => setWithdrawError(null),
  };
}
