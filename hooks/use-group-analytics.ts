"use client";

import { useReadContract, useAccount } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { useMemo } from "react";

interface LockedFundsData {
  totalAmount: bigint;
  userContributions: Array<{
    userAddress: string;
    amount: bigint;
    formattedAmount: string;
  }>;
}

interface DeadlineData {
  deadline: number;
  timeUntilDeadline: number;
  isOverdue: boolean;
  formattedDeadline: string;
  formattedTimeRemaining: string;
}

export function useGroupAnalytics(groupId: string | number) {
  const { address } = useAccount();

  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    if (typeof groupId === 'string') {
      return BigInt(groupId);
    }
    return BigInt(groupId);
  }, [groupId]);

  // Get group locked funds
  const {
    data: lockedFundsRaw,
    isLoading: isLoadingLockedFunds,
    error: lockedFundsError,
    refetch: refetchLockedFunds,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_group_locked_funds",
    args: [formattedGroupId],
    enabled: !!groupId,
  });

  // Get contribution deadline for current user
  const {
    data: contributionDeadlineRaw,
    isLoading: isLoadingDeadline,
    error: deadlineError,
    refetch: refetchDeadline,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_contribution_deadline",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  // Get time until deadline for current user
  const {
    data: timeUntilDeadlineRaw,
    isLoading: isLoadingTimeUntilDeadline,
    error: timeUntilDeadlineError,
    refetch: refetchTimeUntilDeadline,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_time_until_deadline",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  // Process locked funds data
  const lockedFundsData: LockedFundsData | null = useMemo(() => {
    if (!lockedFundsRaw) return null;

    try {

      
      // Handle different possible return formats
      let totalAmount: bigint;
      let userContributionsArray: Array<[string, bigint]> = [];
      
      if (Array.isArray(lockedFundsRaw)) {
        // Format: [total_amount, Array<(user_address, amount)>]
        if (lockedFundsRaw.length >= 2) {
          totalAmount = BigInt(lockedFundsRaw[0] || 0);
          const contributionsData = lockedFundsRaw[1];
          
          if (Array.isArray(contributionsData)) {
            userContributionsArray = contributionsData;
          }
        } else {
          totalAmount = BigInt(lockedFundsRaw[0] || 0);
        }
      } else if (typeof lockedFundsRaw === 'object' && lockedFundsRaw !== null) {
        // Handle object format
        const data = lockedFundsRaw as any;
        totalAmount = BigInt(data.total_amount || data[0] || 0);
        
        if (data.user_contributions || data[1]) {
          const contributions = data.user_contributions || data[1];
          if (Array.isArray(contributions)) {
            userContributionsArray = contributions;
          }
        }
      } else {
        // Single value - just total amount
        totalAmount = BigInt(lockedFundsRaw || 0);
      }

      // Safely process user contributions
      let userContributions: Array<{
        userAddress: string;
        amount: bigint;
        formattedAmount: string;
      }> = [];
      
      if (Array.isArray(userContributionsArray) && userContributionsArray.length > 0) {
        try {
          userContributions = userContributionsArray
            .filter(item => Array.isArray(item) && item.length >= 2) // Ensure each item is a valid array
            .map(([userAddress, amount]) => ({
              userAddress: userAddress?.toString() || 'Unknown',
              amount: BigInt(amount || 0),
              formattedAmount: formatUSDC(BigInt(amount || 0)),
            }));
        } catch (mapError) {
          console.error("Error mapping user contributions:", mapError);
          console.error("User contributions array:", userContributionsArray);
          userContributions = [];
        }
      }



      return {
        totalAmount,
        userContributions,
      };
    } catch (error) {
      console.error("Error processing locked funds data:", error);

      return null;
    }
  }, [lockedFundsRaw]);

  // Process deadline data
  const deadlineData: DeadlineData | null = useMemo(() => {
    if (!contributionDeadlineRaw || !timeUntilDeadlineRaw) return null;

    try {

      
      // Handle different possible formats for deadline
      let deadline: number;
      let timeUntilDeadline: number;
      
      // Convert deadline to number
      if (typeof contributionDeadlineRaw === 'bigint') {
        deadline = Number(contributionDeadlineRaw);
      } else if (typeof contributionDeadlineRaw === 'object' && contributionDeadlineRaw !== null) {
        deadline = Number((contributionDeadlineRaw as any).low || (contributionDeadlineRaw as any)[0] || contributionDeadlineRaw);
      } else {
        deadline = Number(contributionDeadlineRaw);
      }
      
      // Convert time until deadline to number
      if (typeof timeUntilDeadlineRaw === 'bigint') {
        timeUntilDeadline = Number(timeUntilDeadlineRaw);
      } else if (typeof timeUntilDeadlineRaw === 'object' && timeUntilDeadlineRaw !== null) {
        timeUntilDeadline = Number((timeUntilDeadlineRaw as any).low || (timeUntilDeadlineRaw as any)[0] || timeUntilDeadlineRaw);
      } else {
        timeUntilDeadline = Number(timeUntilDeadlineRaw);
      }
      
      const isOverdue = timeUntilDeadline <= 0;
      

      
      return {
        deadline,
        timeUntilDeadline,
        isOverdue,
        formattedDeadline: formatTimestamp(deadline),
        formattedTimeRemaining: formatTimeRemaining(timeUntilDeadline),
      };
    } catch (error) {
      console.error("Error processing deadline data:", error);

      return null;
    }
  }, [contributionDeadlineRaw, timeUntilDeadlineRaw]);

  // Refetch all data
  const refetchAll = () => {
    refetchLockedFunds();
    refetchDeadline();
    refetchTimeUntilDeadline();
  };

  return {
    // Locked funds data
    lockedFunds: lockedFundsData,
    isLoadingLockedFunds,
    lockedFundsError,
    
    // Deadline data
    deadline: deadlineData,
    isLoadingDeadline: isLoadingDeadline || isLoadingTimeUntilDeadline,
    deadlineError: deadlineError || timeUntilDeadlineError,
    
    // Utility functions
    refetchAll,
    refetchLockedFunds,
    refetchDeadline,
    
    // Loading states
    isLoading: isLoadingLockedFunds || isLoadingDeadline || isLoadingTimeUntilDeadline,
  };
}

// Helper function to format USDC amounts (6 decimals)
function formatUSDC(amount: bigint): string {
  const amountInTokens = Number(amount) / Math.pow(10, 6);
  return amountInTokens.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

// Helper function to format timestamps
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to format time remaining
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) {
    return "Overdue";
  }

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Hook for getting locked funds for a specific user in a group
export function useUserLockedFunds(groupId: string | number, userAddress?: string) {
  const { lockedFunds, isLoadingLockedFunds, lockedFundsError, refetchLockedFunds } = useGroupAnalytics(groupId);

  const userContribution = useMemo(() => {
    if (!lockedFunds || !userAddress) return null;
    
    return lockedFunds.userContributions.find(
      contribution => contribution.userAddress.toLowerCase() === userAddress.toLowerCase()
    );
  }, [lockedFunds, userAddress]);

  return {
    userContribution,
    totalLockedFunds: lockedFunds?.totalAmount,
    isLoading: isLoadingLockedFunds,
    error: lockedFundsError,
    refetch: refetchLockedFunds,
  };
}
