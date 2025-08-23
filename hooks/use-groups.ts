"use client";

import { useState, useEffect } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

// Type definitions based on contract structs
export interface GroupInfo {
  group_id: bigint | number;
  group_name: string;
  description: string;
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
  last_payout_time: bigint | number;
  total_cycles: number | bigint;
  visibility: any; // CairoCustomEnum or number
  requires_lock: boolean;
  requires_reputation_score: number | bigint;
  completed_cycles: number | bigint;
  total_pool_amount: bigint | number;
  remaining_pool_amount: bigint | number;
  next_payout_recipient: string;
  is_active: boolean;
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
      console.log("=== FREQUENCY DEBUG ===");
      console.log("Raw unit:", unit);
      console.log("Raw duration:", duration);
      console.log("Unit type:", typeof unit);
      console.log("Duration type:", typeof duration);

      const durationNum = Number(duration);
      console.log("Parsed duration:", durationNum);

      // Handle different enum formats from Starknet
      let unitKey = null;

      // Case 1: Object with variant property
      if (typeof unit === "object" && unit !== null && unit.variant) {
        console.log("✅ Case 1: Object with variant", unit.variant);
        console.log("Variant type:", typeof unit.variant);
        console.log("Variant keys:", Object.keys(unit.variant));
        console.log("Variant values:", Object.values(unit.variant));
        if (typeof unit.variant === "object" && unit.variant !== null) {
          // Find the key with a non-undefined value
          const variantKeys = Object.keys(unit.variant);
          const variantValues = Object.values(unit.variant);
          const activeIndex = variantValues.findIndex(value => value !== undefined);
          
          if (activeIndex !== -1) {
            unitKey = variantKeys[activeIndex];
            console.log("✅ Found active variant key:", unitKey, "at index:", activeIndex);
          } else {
            // Fallback to first key if no active variant found
            unitKey = variantKeys[0];
            console.log("⚠️ No active variant found, using first key:", unitKey);
          }
        } else {
          console.log("❌ Variant is not an object:", unit.variant);
        }
      }
      // Case 2: Object with direct enum keys
      else if (typeof unit === "object" && unit !== null && !unit.variant) {
        console.log("Case 2: Object with direct keys", Object.keys(unit));
        unitKey = Object.keys(unit)[0];
        console.log("Extracted direct key:", unitKey);
      }
      // Case 3: Numeric value
      else {
        const unitNum = Number(unit);
        console.log("Case 3: Numeric value", unitNum);
        switch (unitNum) {
          case 0:
            unitKey = "Days";     // Contract: 0 = Days
            break;
          case 1:
            unitKey = "Weeks";    // Contract: 1 = Weeks
            break;
          case 2:
            unitKey = "Months";   // Contract: 2 = Months
            break;
          default:
            console.log("Unknown numeric unit:", unitNum);
            return "Unknown";
        }
      }

      console.log("Final unit key:", unitKey);

      // Convert to readable frequency
      if (unitKey === "Days") {
        return durationNum === 1 ? "Daily" : `Every ${durationNum} days`;
      } else if (unitKey === "Weeks") {
        return durationNum === 1
          ? "Weekly"
          : durationNum === 2
          ? "Bi-weekly"
          : `Every ${durationNum} weeks`;
      } else if (unitKey === "Months") {
        return durationNum === 1 ? "Monthly" : `Every ${durationNum} months`;
      }

      console.log(`No matching unit key: ${unitKey}, returning Unknown`);
      return "Unknown";
    };

    // Convert contribution amount from USDC units to readable format
    const formatContribution = (amount: any) => {
      // USDC uses 6 decimals, not 18
      const amountInTokens = Number(amount) / Math.pow(10, 6);
      return `${amountInTokens} USDC`;
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

    // Helper function to format creator address
    const formatCreatorName = (address: string) => {
      if (!address) return "Unknown Creator";
      const addr = String(address);
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // Helper function to get proper visibility string
    const getVisibilityString = (visibility: any) => {
      console.log("=== VISIBILITY DEBUG ===");
      console.log("Raw visibility:", visibility);
      console.log("Visibility type:", typeof visibility);

      // Handle different enum formats from Starknet
      let visibilityKey = null;

      // Case 1: Object with variant property
      if (
        typeof visibility === "object" &&
        visibility !== null &&
        visibility.variant
      ) {
        console.log("Case 1: Object with variant", visibility.variant);
        if (
          typeof visibility.variant === "object" &&
          visibility.variant !== null
        ) {
          visibilityKey = Object.keys(visibility.variant)[0];
          console.log("Extracted variant key:", visibilityKey);
        }
      }
      // Case 2: Object with direct enum keys
      else if (
        typeof visibility === "object" &&
        visibility !== null &&
        !visibility.variant
      ) {
        console.log("Case 2: Object with direct keys", Object.keys(visibility));
        visibilityKey = Object.keys(visibility)[0];
        console.log("Extracted direct key:", visibilityKey);
      }
      // Case 3: Numeric value
      else {
        const visNum = Number(visibility);
        console.log("Case 3: Numeric value", visNum);
        switch (visNum) {
          case 0:
            visibilityKey = "Public";
            break;
          case 1:
            visibilityKey = "Private";
            break;
          default:
            console.log("Unknown numeric visibility:", visNum);
            return "public"; // Default to public
        }
      }

      console.log("Final visibility key:", visibilityKey);

      // Convert to lowercase for consistency
      if (visibilityKey) {
        return visibilityKey.toLowerCase();
      }

      console.log("No matching visibility key, defaulting to public");
      return "public"; // Default fallback
    };

    const visibilityStr = getVisibilityString(groupInfo.visibility);
    const creatorAddress = String(groupInfo.creator);

    return {
      id: groupId,
      name: groupInfo.group_name || `Savings Group #${groupId}`,
      description:
        groupInfo.description ||
        `A ${visibilityStr} savings group with ${Number(
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
      creator: formatCreatorName(creatorAddress),
      tags: generateTags(groupInfo),
      visibility: visibilityStr as "public" | "private",
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

          // Add comprehensive debugging for raw contract data
          console.log(`\n=== RAW GROUP DATA FOR GROUP ${i} ===`);
          console.log("Full groupInfo object:", groupInfo);
          console.log("Group ID:", groupInfo.group_id);
          console.log("Group Name:", groupInfo.group_name);
          console.log("Cycle Unit (raw):", groupInfo.cycle_unit);
          console.log("Cycle Duration (raw):", groupInfo.cycle_duration);
          console.log("Cycle Unit type:", typeof groupInfo.cycle_unit);
          console.log("Cycle Duration type:", typeof groupInfo.cycle_duration);
          
          // Try to inspect the cycle_unit structure
          if (typeof groupInfo.cycle_unit === 'object' && groupInfo.cycle_unit !== null) {
            console.log("Cycle Unit object keys:", Object.keys(groupInfo.cycle_unit));
            console.log("Cycle Unit object values:", Object.values(groupInfo.cycle_unit));
            console.log("Cycle Unit JSON:", JSON.stringify(groupInfo.cycle_unit, null, 2));
          }
          console.log("=== END RAW GROUP DATA ===\n");

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
