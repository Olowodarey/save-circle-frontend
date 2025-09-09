"use client";

import { useState } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import {  CairoCustomEnum } from "starknet";

// Enum mappings for contract calls (matching contract ABI)
export const GroupVisibility = {
  Public: 0,
  Private: 1,
};

export const TimeUnit = {
  Hours: 0,    // Contract: Hours = 0
  Days: 1,     // Contract: Days = 1
  Weeks: 2,    // Contract: Weeks = 2
  Months: 3,   // Contract: Months = 3
};

export const LockType = {
  Progressive: 0,
  None: 1,
};

// Helper functions for enum variant names
const getLockTypeVariant = (type: number): string => {
  return type === LockType.Progressive ? "Progressive" : "None";
};

const getTimeUnitVariant = (unit: number): string => {
  switch (unit) {
    case TimeUnit.Hours: return "Hours";
    case TimeUnit.Days: return "Days";
    case TimeUnit.Weeks: return "Weeks";
    case TimeUnit.Months: return "Months";
    default: return "Hours";
  }
};

// Type definitions for group creation
export interface CreatePublicGroupParams {
  memberLimit: number;
  contributionAmount: string;
  lockType: number;
  cycleDuration: number;
  cycleUnit: number;
  visibility: number;
  requiresLock: boolean;
  minReputationScore: number;
}

export interface CreatePrivateGroupParams {
  memberLimit: number;
  contributionAmount: string;
  cycleDuration: number;
  cycleUnit: number;
  invitedMembers: string[];
  requiresLock: boolean;
  lockType: number;
  minReputationScore: number;
}

export function useGroupContract() {
  const { account, address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  // Helper function to convert frequency to time unit and duration
  const convertFrequencyToTimeUnit = (frequency: string) => {
    console.log("=== FREQUENCY CONVERSION DEBUG ===");
    console.log("Input frequency:", frequency);
    console.log("Lowercase frequency:", frequency.toLowerCase());
    
    let result;
    switch (frequency.toLowerCase()) {
      // hours
      case "hours":
      case "every hour":
        result = { unit: TimeUnit.Hours, duration: 1 };
        break;
      case "every 2 hours":
        result = { unit: TimeUnit.Hours, duration: 2 };
        break;
      case "every 3 hours":
        result = { unit: TimeUnit.Hours, duration: 3 };
        break;
      case "every 6 hours":
        result = { unit: TimeUnit.Hours, duration: 6 };
        break;
      case "every 12 hours":
        result = { unit: TimeUnit.Hours, duration: 12 };
        break;
      case "every 24 hours":
        result = { unit: TimeUnit.Hours, duration: 24 };
        break;
      // Days
      case "daily":
      case "every day":
        result = { unit: TimeUnit.Days, duration: 1 };
        break;
      case "every 3 days":
        result = { unit: TimeUnit.Days, duration: 3 };
        break;
      
      // Weeks
      case "weekly":
      case "every week":
        result = { unit: TimeUnit.Weeks, duration: 1 };
        break;
      case "biweekly":
      case "bi-weekly":
      case "every 2 weeks":
        result = { unit: TimeUnit.Weeks, duration: 2 };
        break;
      
      // Months
      case "monthly":
      case "every month":
        result = { unit: TimeUnit.Months, duration: 1 };
        break;
      case "quarterly":
      case "every 3 months":
        result = { unit: TimeUnit.Months, duration: 3 };
        break;
      
      // Default to weekly for unknown frequencies
      default:
        console.warn(`Unknown frequency: ${frequency}, defaulting to weekly`);
        result = { unit: TimeUnit.Weeks, duration: 1 };
        break;
    }
    
    console.log("Conversion result:", result);
    console.log("Unit enum value:", result.unit);
    console.log("Unit variant name:", getTimeUnitVariant(result.unit));
    console.log("Duration:", result.duration);
    console.log("=== END FREQUENCY CONVERSION DEBUG ===");
    
    return result;
  };

  // Helper function to convert reputation string to number
  const convertReputationToNumber = (reputation: string) => {
    switch (reputation) {
      case "0":
        return 0;
      case "25":
        return 25;
      case "50":
        return 50;
      case "75":
        return 75;
      case "90":
        return 90;
      default:
        return 0;
    }
  };

  const createPublicGroup = async (params: {
    groupName: string;
    description: string;
    maxMembers: string;
    contributionAmount: string;
    cycleDuration: string;
    cycleUnit: string;
    minReputation: string;
    lockEnabled: boolean;
    lockAmount?: string;
    selectedToken: string;
  }) => {
    if (!account || !contract) {
      throw new Error("Wallet not connected or contract not available");
    }

    setIsCreating(true);
    setCreateError(null);
    setCreateSuccess(false);
    setTransactionHash(null);

    try {
      // Convert cycle unit string to TimeUnit enum value
      const unit = (() => {
        switch (params.cycleUnit.toLowerCase()) {
          case "hours": return TimeUnit.Hours;
          case "days": return TimeUnit.Days;
          case "weeks": return TimeUnit.Weeks;
          case "months": return TimeUnit.Months;
          default: return TimeUnit.Days;
        }
      })();
      
      const duration = parseInt(params.cycleDuration) || 1;
      const reputationScore = convertReputationToNumber(params.minReputation);

      // Convert contribution amount to USDC units (6 decimals)
      const contributionAmountWei = BigInt(
        Math.floor(parseFloat(params.contributionAmount) * Math.pow(10, 6))
      );
      
      console.log("=== CONTRIBUTION AMOUNT CONVERSION ===");
      console.log("Input amount:", params.contributionAmount);
      console.log("Parsed amount:", parseFloat(params.contributionAmount));
      console.log("Converted to USDC units:", contributionAmountWei.toString());
      console.log("=== END CONTRIBUTION CONVERSION ===");

      const lockType = params.lockEnabled
        ? params.lockAmount && parseFloat(params.lockAmount) > 0
          ? LockType.Progressive
          : LockType.None
        : LockType.None;

      const callData = [
        params.groupName, // name: ByteArray
        params.description, // description: ByteArray
        parseInt(params.maxMembers), // member_limit: u32
        contributionAmountWei, // contribution_amount: u256
        new CairoCustomEnum({ [getLockTypeVariant(lockType)]: {} }), // lock_type: LockType enum
        BigInt(duration), // cycle_duration: u64
        new CairoCustomEnum({ [getTimeUnitVariant(unit)]: {} }), // cycle_unit: TimeUnit enum
        params.lockEnabled, // requires_lock: bool
        reputationScore, // min_reputation_score: u32
      ] as const;

      const call = contract.populate("create_public_group", callData);

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setTransactionHash(result.transaction_hash);
        setCreateSuccess(true);

        // Store group metadata in localStorage for now (in production, this would be handled by backend)
        const groupMetadata = {
          name: params.groupName,
          description: params.description,
          transactionHash: result.transaction_hash,
          createdAt: new Date().toISOString(),
          creator: address,
        };

        const existingGroups = JSON.parse(
          localStorage.getItem("created-groups") || "[]"
        );
        existingGroups.push(groupMetadata);
        localStorage.setItem("created-groups", JSON.stringify(existingGroups));
      }

      return result;
    } catch (error: any) {
      console.error("Error creating public group:", error);
      setCreateError(error.message || "Failed to create group");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const createPrivateGroup = async (params: {
    groupName: string;
    description: string;
    maxMembers: string;
    contributionAmount: string;
    cycleDuration: string;
    cycleUnit: string;
    minReputation: string;
    invitedMembers: string[]; // Changed from inviteEmails to invitedMembers (wallet addresses)
    lockEnabled: boolean;
    lockAmount?: string;
    selectedToken: string;
  }) => {
    if (!account || !contract) {
      throw new Error("Wallet not connected or contract not available");
    }

    setIsCreating(true);
    setCreateError(null);
    setCreateSuccess(false);
    setTransactionHash(null);

    try {
      // Convert cycle unit string to TimeUnit enum value
      const unit = (() => {
        switch (params.cycleUnit.toLowerCase()) {
          case "hours": return TimeUnit.Hours;
          case "days": return TimeUnit.Days;
          case "weeks": return TimeUnit.Weeks;
          case "months": return TimeUnit.Months;
          default: return TimeUnit.Days;
        }
      })();
      
      const duration = parseInt(params.cycleDuration) || 1;
      const reputationScore = convertReputationToNumber(params.minReputation);

      // Convert contribution amount to USDC units (6 decimals)
      const contributionAmountWei = BigInt(
        Math.floor(parseFloat(params.contributionAmount) * Math.pow(10, 6))
      );

      const lockType = params.lockEnabled
        ? params.lockAmount && parseFloat(params.lockAmount) > 0
          ? LockType.Progressive
          : LockType.None
        : LockType.None;

      // Validate and format wallet addresses
      const invitedAddresses = params.invitedMembers.map((address) => {
        // Basic validation for Starknet addresses
        if (!address.startsWith('0x') || address.length < 10) {
          throw new Error(`Invalid wallet address: ${address}`);
        }
        return address;
      });

      const callData = [
        params.groupName, // name: ByteArray
        params.description, // description: ByteArray
        parseInt(params.maxMembers), // member_limit: u32
        contributionAmountWei, // contribution_amount: u256
        BigInt(duration), // cycle_duration: u64
        new CairoCustomEnum({ [getTimeUnitVariant(unit)]: {} }), // cycle_unit: TimeUnit enum
        invitedAddresses, // invited_members: Array<ContractAddress>
        params.lockEnabled, // requires_lock: bool
        new CairoCustomEnum({ [getLockTypeVariant(lockType)]: {} }), // lock_type: LockType enum
        reputationScore, // min_reputation_score: u32
      ] as const;

      const call = contract.populate("create_private_group", callData);

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setTransactionHash(result.transaction_hash);
        setCreateSuccess(true);

        // Store group metadata
        const groupMetadata = {
          name: params.groupName,
          description: params.description,
          transactionHash: result.transaction_hash,
          createdAt: new Date().toISOString(),
          creator: address,
          type: "private",
          invitedMembers: params.invitedMembers,
        };

        const existingGroups = JSON.parse(
          localStorage.getItem("created-groups") || "[]"
        );
        existingGroups.push(groupMetadata);
        localStorage.setItem("created-groups", JSON.stringify(existingGroups));
      }

      return result;
    } catch (error: any) {
      console.error("Error creating private group:", error);
      setCreateError(error.message || "Failed to create group");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const resetState = () => {
    setCreateError(null);
    setCreateSuccess(false);
    setTransactionHash(null);
  };

  return {
    createPublicGroup,
    createPrivateGroup,
    isCreating,
    createError,
    createSuccess,
    transactionHash,
    resetState,
    isConnected,
    address,
  };
}
