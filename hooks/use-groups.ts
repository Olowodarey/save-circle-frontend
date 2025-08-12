"use client";

import { useState, useEffect } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

// Type definitions based on contract structs
export interface GroupInfo {
  group_id: bigint | number;
  creator: string;
  member_limit: number | bigint;
  contribution_amount: bigint | number;
  lock_type: any; // CairoCustomEnum or number
  cycle_duration: bigint | number;
  cycle_unit: any; // CairoCustomEnum or number
  members: number | bigint;
  state: any; // CairoCustomEnum or number
  current_cycle: number | bigint;
  payout_order: number | bigint;
  start_time: bigint | number;
  total_cycles: number | bigint;
  visibility: any; // CairoCustomEnum or number
  requires_lock: boolean;
  requires_reputation_score: number | bigint;
  invited_members: number | bigint;
}

export interface FormattedGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  contribution: string;
  frequency: string;
  minReputation: number;
  locked: boolean;
  creator: string;
  tags: string[];
  visibility: "public" | "private";
  state: string;
  contributionAmount: bigint;
}

export function useGroups() {
  const { account, address, isConnected } = useAccount();
  const [groups, setGroups] = useState<FormattedGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  // Helper function to format group data
  const formatGroup = (
    groupInfo: GroupInfo,
    groupId: string
  ): FormattedGroup => {
    // Convert cycle unit enum to readable frequency
    const getFrequency = (unit: any, duration: any) => {
      const unitNum =
        typeof unit === "object" && unit.variant
          ? Object.keys(unit.variant)[0]
          : Number(unit);
      const durationNum = Number(duration);

      // Handle enum variants
      if (typeof unit === "object" && unit.variant) {
        const variantKey = Object.keys(unit.variant)[0];
        if (variantKey === "Days") {
          return durationNum === 1 ? "Daily" : `Every ${durationNum} days`;
        } else if (variantKey === "Weeks") {
          return durationNum === 1
            ? "Weekly"
            : durationNum === 2
            ? "Bi-weekly"
            : `Every ${durationNum} weeks`;
        } else if (variantKey === "Months") {
          return durationNum === 1 ? "Monthly" : `Every ${durationNum} months`;
        }
      }

      // Handle numeric values
      switch (unitNum) {
        case 0: // Days
          return durationNum === 1 ? "Daily" : `Every ${durationNum} days`;
        case 1: // Weeks
          return durationNum === 1
            ? "Weekly"
            : durationNum === 2
            ? "Bi-weekly"
            : `Every ${durationNum} weeks`;
        case 2: // Months
          return durationNum === 1 ? "Monthly" : `Every ${durationNum} months`;
        default:
          return "Unknown";
      }
    };

    // Convert contribution amount from wei to readable format
    const formatContribution = (amount: any) => {
      const amountInTokens = Number(amount) / Math.pow(10, 18);
      return `${amountInTokens} USDC`; // Assuming USDC for now
    };

    // Generate tags based on group properties
    const generateTags = (groupInfo: GroupInfo) => {
      const tags: string[] = [];

      if (groupInfo.requires_lock) tags.push("locked");

      // Handle visibility enum
      const visibilityValue =
        typeof groupInfo.visibility === "object" && groupInfo.visibility.variant
          ? Object.keys(groupInfo.visibility.variant)[0]
          : Number(groupInfo.visibility);

      if (visibilityValue === 0 || visibilityValue === "Public")
        tags.push("public");
      if (visibilityValue === 1 || visibilityValue === "Private")
        tags.push("private");

      // Add frequency-based tags
      const cycleUnit =
        typeof groupInfo.cycle_unit === "object" && groupInfo.cycle_unit.variant
          ? Object.keys(groupInfo.cycle_unit.variant)[0]
          : Number(groupInfo.cycle_unit);
      const cycleDuration = Number(groupInfo.cycle_duration);

      if ((cycleUnit === 1 || cycleUnit === "Weeks") && cycleDuration === 1)
        tags.push("weekly");
      if ((cycleUnit === 1 || cycleUnit === "Weeks") && cycleDuration === 2)
        tags.push("bi-weekly");
      if (cycleUnit === 2 || cycleUnit === "Months") tags.push("monthly");

      // Add member size tags
      const memberLimit = Number(groupInfo.member_limit);
      if (memberLimit <= 5) tags.push("small-group");
      else if (memberLimit <= 15) tags.push("medium-group");
      else tags.push("large-group");

      return tags;
    };

    // Get state string
    const getStateString = (state: number) => {
      switch (state) {
        case 0:
          return "Created";
        case 1:
          return "Active";
        case 2:
          return "Paused";
        case 3:
          return "Completed";
        case 4:
          return "Cancelled";
        default:
          return "Unknown";
      }
    };

    const visibilityValue =
      typeof groupInfo.visibility === "object" && groupInfo.visibility.variant
        ? Object.keys(groupInfo.visibility.variant)[0]
        : Number(groupInfo.visibility);

    const isPublic = visibilityValue === 0 || visibilityValue === "Public";

    return {
      id: groupId,
      name: `Savings Group #${groupId}`, // Since contract doesn't store names, we'll generate them
      description: `A ${
        isPublic ? "public" : "private"
      } savings group with ${Number(
        groupInfo.member_limit
      )} members contributing ${formatContribution(
        groupInfo.contribution_amount
      )} ${getFrequency(
        groupInfo.cycle_unit,
        groupInfo.cycle_duration
      ).toLowerCase()}.`,
      members: Number(groupInfo.members),
      maxMembers: Number(groupInfo.member_limit),
      contribution: formatContribution(groupInfo.contribution_amount),
      frequency: getFrequency(groupInfo.cycle_unit, groupInfo.cycle_duration),
      minReputation: Number(groupInfo.requires_reputation_score),
      locked: groupInfo.requires_lock,
      creator: groupInfo.creator,
      tags: generateTags(groupInfo),
      visibility: isPublic ? "public" : "private",
      state: getStateString(groupInfo.state),
      contributionAmount:
        typeof groupInfo.contribution_amount === "bigint"
          ? groupInfo.contribution_amount
          : BigInt(groupInfo.contribution_amount),
    };
  };

  // Fetch groups from contract
  const fetchGroups = async () => {
    if (!contract) {
      setError("Contract not available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Since we don't have a function to get total groups, we'll try to fetch groups
      // starting from ID 1 until we hit an error or empty group
      const maxGroupsToCheck = 50; // Reasonable limit to avoid infinite loops
      const validGroups: FormattedGroup[] = [];

      for (let i = 1; i <= maxGroupsToCheck; i++) {
        try {
          const groupInfo = (await contract.call("get_group_info", [
            i,
          ])) as GroupInfo;

          // If group_id is 0, it means the group doesn't exist
          if (Number(groupInfo.group_id) === 0) {
            continue;
          }

          const formattedGroup = formatGroup(groupInfo, i.toString());
          validGroups.push(formattedGroup);
        } catch (error) {
          // If we get an error, the group probably doesn't exist, so we continue
          console.log(`Group ${i} not found or error:`, error);
          continue;
        }
      }

      setGroups(validGroups);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      setError(error.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups on mount and when contract becomes available
  useEffect(() => {
    if (contract && isConnected) {
      fetchGroups();
    }
  }, [contract, isConnected]);

  // Get public groups only
  const publicGroups = groups.filter((group) => group.visibility === "public");

  // Get user's group invitations (this would need additional contract functions)
  const userInvites: any[] = []; // Placeholder for now

  return {
    groups,
    publicGroups,
    userInvites,
    loading,
    error,
    refetch: fetchGroups,
    isConnected,
  };
}
