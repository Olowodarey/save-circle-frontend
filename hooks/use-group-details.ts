"use client";

import { useState, useEffect } from "react";
import { useAccount, useContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { GroupInfo } from "./use-groups";

// Type definitions for group members
export interface GroupMember {
  user: string;
  group_id: bigint | number;
  locked_amount: bigint | number;
  joined_at: bigint | number;
  member_index: number | bigint;
  payout_cycle: number | bigint;
  has_been_paid: boolean;
  contribution_count: number | bigint;
  late_contributions: number | bigint;
  missed_contributions: number | bigint;
}

export interface FormattedMember {
  address: string;
  name: string;
  avatar: string;
  reputation: number;
  joinedAt: string;
  isCreator: boolean;
  paymentStatus: "paid" | "pending";
  position: number;
  lockedAmount: string;
  contributionCount: number;
  lateContributions: number;
  missedContributions: number;
}

export interface FormattedGroupDetails {
  id: string;
  name: string;
  description: string;
  type: "public" | "private";
  members: number;
  maxMembers: number;
  contribution: string;
  frequency: string;
  minReputation: number;
  locked: boolean;
  creator: {
    address: string;
    name: string;
    reputation: number;
  };
  tags: string[];
  status: string;
  createdAt: string;
  nextPayoutDate: string;
  currentCycle: number;
  totalCycles: number;
  totalPoolAmount: string;
  isUserMember: boolean;
  userCanJoin: boolean;
  userReputation: number;
  contributionAmount: bigint;
  state: string;
  visibility: "public" | "private";
  cycleUnit: any;
  cycleDuration: any;
  lockType: any;
  requiresLock: boolean;
  startTime: string;
}

export function useGroupDetails(groupId: string) {
  const { account, address, isConnected } = useAccount();
  const [groupDetails, setGroupDetails] =
    useState<FormattedGroupDetails | null>(null);
  const [members, setMembers] = useState<FormattedMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  // Helper function to format group details
  const formatGroupDetails = (
    groupInfo: GroupInfo,
    groupId: string
  ): FormattedGroupDetails => {
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
      return `${amountInTokens} USDC`;
    };

    // Get state string - handle GroupState enum from contract
    const getStateString = (state: any) => {
      console.log("Processing state:", state, "Type:", typeof state);

      // Handle enum object with variant property
      if (typeof state === "object" && state !== null) {
        // First check for variant property (Starknet enum format)
        if (state.variant) {
          console.log("State has variant property:", state.variant);
          console.log("Variant type:", typeof state.variant);

          if (typeof state.variant === "object" && state.variant !== null) {
            const variantKeys = Object.keys(state.variant);
            console.log("All variant keys:", variantKeys);
            console.log("Variant keys length:", variantKeys.length);

            // Log each key and its value
            variantKeys.forEach((key, index) => {
              console.log(
                `Variant key ${index}:`,
                key,
                "=",
                state.variant[key]
              );
            });

            // Find the key that has a truthy value or is an object
            const activeKey = variantKeys.find((key) => {
              const value = state.variant[key];
              console.log(`Checking key '${key}' with value:`, value);
              // In Starknet enums, the active variant usually has an object value {}
              // while inactive variants might be null/undefined
              return value !== null && value !== undefined;
            });

            if (activeKey) {
              console.log("Found active variant key:", activeKey);
              return activeKey.toLowerCase();
            }

            // Fallback to first key if no active key found
            if (variantKeys.length > 0) {
              const variantKey = variantKeys[0];
              console.log("Using first variant key as fallback:", variantKey);
              return variantKey.toLowerCase();
            }
          }
        }

        // Handle direct enum variant (e.g., { Active: {} } or { Created: {} })
        const allKeys = Object.keys(state);
        console.log("All state keys:", allKeys);

        // Filter out non-enum keys and look for enum variants
        const enumVariants = ["Created", "Active", "Completed", "Defaulted"];
        const foundVariant = allKeys.find((key) => enumVariants.includes(key));

        if (foundVariant) {
          console.log("Found direct enum variant:", foundVariant);
          return foundVariant.toLowerCase();
        }

        // Fallback: use first key if no variant property
        if (allKeys.length > 0 && !state.variant) {
          const enumKey = allKeys[0];
          console.log("Using first key as enum:", enumKey);
          return enumKey.toLowerCase();
        }
      }

      // Handle numeric enum values (fallback)
      if (typeof state === "number" || !isNaN(Number(state))) {
        const stateNum = Number(state);
        console.log("Processing numeric state:", stateNum);
        switch (stateNum) {
          case 0:
            return "created";
          case 1:
            return "active";
          case 2:
            return "completed";
          case 3:
            return "defaulted";
          default:
            return "unknown";
        }
      }

      // Handle string values
      if (typeof state === "string") {
        console.log("Processing string state:", state);
        return state.toLowerCase();
      }

      console.log("Unknown state format:", state);
      return "unknown";
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

    const visibilityValue =
      typeof groupInfo.visibility === "object" && groupInfo.visibility.variant
        ? Object.keys(groupInfo.visibility.variant)[0]
        : Number(groupInfo.visibility);

    const isPublic = visibilityValue === 0 || visibilityValue === "Public";
    const state = getStateString(groupInfo.state);
    const memberCount = Number(groupInfo.members);
    const maxMembers = Number(groupInfo.member_limit);
    const currentCycle = Number(groupInfo.current_cycle);
    const totalCycles = Number(groupInfo.total_cycles);

    // Calculate total pool amount (contribution * max members)
    const contributionAmount = Number(groupInfo.contribution_amount);
    const totalPoolAmount = formatContribution(contributionAmount * maxMembers);

    // Calculate next payout date (mock for now)
    const nextPayoutDate = new Date();
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 7); // Add 7 days as example

    // Mock user reputation (in a real app, this would come from user context or contract)
    const userReputation = 0; // Assuming new user with 0 reputation
    const minReputationRequired = Number(groupInfo.requires_reputation_score);

    // Debug logging
    console.log("Reputation Debug:", {
      userReputation,
      minReputationRequired,
      rawRequiredScore: groupInfo.requires_reputation_score,
      comparison: userReputation >= minReputationRequired,
    });

    // Check if user meets reputation requirement
    const meetsReputationRequirement = userReputation >= minReputationRequired;

    return {
      id: groupId,
      name: `Savings Group #${groupId}`,
      description: `A ${
        isPublic ? "public" : "private"
      } savings group with ${maxMembers} members contributing ${formatContribution(
        contributionAmount
      )} ${getFrequency(
        groupInfo.cycle_unit,
        groupInfo.cycle_duration
      ).toLowerCase()}.`,
      type: isPublic ? "public" : "private",
      members: memberCount,
      maxMembers,
      contribution: formatContribution(contributionAmount),
      frequency: getFrequency(groupInfo.cycle_unit, groupInfo.cycle_duration),
      minReputation: minReputationRequired,
      locked: groupInfo.requires_lock,
      creator: {
        address: String(groupInfo.creator),
        name: `User ${String(groupInfo.creator).slice(0, 6)}...${String(
          groupInfo.creator
        ).slice(-4)}`,
        reputation: 95, // Mock reputation for now
      },
      tags: generateTags(groupInfo),
      status: state,
      createdAt: new Date(Number(groupInfo.start_time) * 1000)
        .toISOString()
        .split("T")[0],
      nextPayoutDate: nextPayoutDate.toISOString().split("T")[0],
      currentCycle,
      totalCycles,
      totalPoolAmount,
      isUserMember: false, // Will be determined when fetching members
      userCanJoin:
        memberCount < maxMembers &&
        state === "active" &&
        meetsReputationRequirement,
      userReputation, // Add user reputation to the returned object
      contributionAmount:
        typeof groupInfo.contribution_amount === "bigint"
          ? groupInfo.contribution_amount
          : BigInt(groupInfo.contribution_amount),
      state,
      visibility: isPublic ? "public" : "private",
      cycleUnit: groupInfo.cycle_unit,
      cycleDuration: groupInfo.cycle_duration,
      lockType: groupInfo.lock_type,
      requiresLock: groupInfo.requires_lock,
      startTime: new Date(Number(groupInfo.start_time) * 1000).toISOString(),
    };
  };

  // Helper function to format member data
  const formatMember = (
    member: GroupMember,
    index: number,
    isCreator: boolean = false
  ): FormattedMember => {
    const formatAmount = (amount: any) => {
      const amountInTokens = Number(amount) / Math.pow(10, 18);
      return `${amountInTokens} USDC`;
    };

    // Safely convert address to string
    const userAddress = String(member.user);

    return {
      address: userAddress,
      name: `User ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`,
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: Math.floor(Math.random() * 30) + 70, // Mock reputation 70-100
      joinedAt: new Date(Number(member.joined_at) * 1000)
        .toISOString()
        .split("T")[0],
      isCreator,
      paymentStatus: member.has_been_paid ? "paid" : "pending",
      position: Number(member.member_index) + 1,
      lockedAmount: formatAmount(member.locked_amount),
      contributionCount: Number(member.contribution_count),
      lateContributions: Number(member.late_contributions),
      missedContributions: Number(member.missed_contributions),
    };
  };

  // Fetch group details and members
  const fetchGroupDetails = async () => {
    if (!contract || !groupId) {
      setError("Contract not available or invalid group ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get the group info
      const groupInfo = (await contract.call("get_group_info", [
        { low: groupId, high: 0 },
      ])) as GroupInfo;

      console.log("=== GROUP INFO DEBUG ===");
      console.log("Raw group info from contract:", groupInfo);
      console.log("Group state from contract:", groupInfo.state);
      console.log("State type:", typeof groupInfo.state);
      console.log("State JSON:", JSON.stringify(groupInfo.state, null, 2));
      console.log(
        "State keys:",
        groupInfo.state ? Object.keys(groupInfo.state) : "null"
      );

      if (Number(groupInfo.group_id) === 0) {
        setError("Group not found");
        return;
      }

      const formattedGroup = formatGroupDetails(groupInfo, groupId);
      console.log("Formatted group status:", formattedGroup.status);
      setGroupDetails(formattedGroup);

      // Then, fetch all members
      const memberCount = Number(groupInfo.members);
      const memberPromises: Promise<GroupMember>[] = [];

      for (let i = 0; i < memberCount; i++) {
        memberPromises.push(
          contract.call("get_group_member", [
            { low: groupId, high: 0 },
            i,
          ]) as Promise<GroupMember>
        );
      }

      if (memberPromises.length > 0) {
        const memberInfos = await Promise.all(memberPromises);

        const formattedMembers = memberInfos.map((member, index) => {
          const isCreator =
            String(member.user).toLowerCase() ===
            String(groupInfo.creator).toLowerCase();
          return formatMember(member, index, isCreator);
        });

        setMembers(formattedMembers);

        // Check if current user is a member
        if (address) {
          console.log("=== MEMBERSHIP CHECK DEBUG ===");
          console.log("Current user address:", address);

          // Helper function to normalize addresses for comparison
          const normalizeAddress = (addr: string): string[] => {
            const cleaned = addr.toLowerCase().replace(/^0x/, "");
            const formats = [];

            // Add hex format (with and without 0x)
            formats.push(`0x${cleaned}`);
            formats.push(cleaned);

            // Convert hex to decimal if it's a valid hex
            try {
              const decimal = BigInt(`0x${cleaned}`).toString();
              formats.push(decimal);
            } catch (e) {
              // If not valid hex, treat as decimal and try to convert to hex
              try {
                const hex = BigInt(addr).toString(16);
                formats.push(`0x${hex}`);
                formats.push(hex);
              } catch (e2) {
                // Keep original if conversion fails
              }
            }

            return [...new Set(formats)]; // Remove duplicates
          };

          const userFormats = normalizeAddress(address);
          console.log("User address formats:", userFormats);
          console.log(
            "Group members:",
            formattedMembers.map((m) => ({ name: m.name, address: m.address }))
          );

          const isUserMember = formattedMembers.some((member) => {
            const memberFormats = normalizeAddress(member.address);

            // Check if any user format matches any member format
            const isMatch = userFormats.some((userFormat) =>
              memberFormats.some(
                (memberFormat) =>
                  userFormat.toLowerCase() === memberFormat.toLowerCase()
              )
            );

            console.log(`Comparing member '${member.name}':`, {
              memberFormats,
              userFormats,
              isMatch,
            });

            return isMatch;
          });

          console.log("Final membership result:", isUserMember);
          setGroupDetails((prev) => (prev ? { ...prev, isUserMember } : null));
        }
      }
    } catch (error: any) {
      console.error("Error fetching group details:", error);
      setError(error.message || "Failed to fetch group details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch group details on mount and when dependencies change
  useEffect(() => {
    if (contract && groupId && isConnected) {
      fetchGroupDetails();
    }
  }, [contract, groupId, isConnected, address]);

  return {
    groupDetails,
    members,
    loading,
    error,
    refetch: fetchGroupDetails,
    isConnected,
  };
}
