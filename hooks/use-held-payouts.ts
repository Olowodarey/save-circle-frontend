"use client";

import { useMemo } from "react";
import { useReadContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export function useHeldPayouts(groupId: string | number) {
  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    if (typeof groupId === 'string') {
      return BigInt(groupId);
    }
    return BigInt(groupId);
  }, [groupId]);

  // Get held payouts count using useReadContract hook
  const { 
    data: heldPayoutsCount, 
    isLoading, 
    error 
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_held_payouts",
    args: [formattedGroupId],
    enabled: !!groupId,
    watch: true,
  });

  return {
    heldPayoutsCount: heldPayoutsCount ? Number(heldPayoutsCount) : 0,
    isLoading,
    error,
  };
}
