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

// Cache for group details to avoid refetching
const groupDetailsCache = new Map<string, { 
  groupDetails: FormattedGroupDetails, 
  members: FormattedMember[], 
  timestamp: number 
}>();
const CACHE_DURATION = 30000; // 30 seconds cache

export function useGroupDetails(groupId: string) {
  const { account, address, isConnected } = useAccount();
  const [groupDetails, setGroupDetails] =
    useState<FormattedGroupDetails | null>(null);
  const [members, setMembers] = useState<FormattedMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

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
      console.log("=== FREQUENCY DEBUG (Details) ===");
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
            unitKey = "Hours";    // Contract: 0 = Hours
            break;
          case 1:
            unitKey = "Days";     // Contract: 1 = Days
            break;
          case 2:
            unitKey = "Weeks";    // Contract: 2 = Weeks
            break;
          case 3:
            unitKey = "Months";   // Contract: 3 = Months
            break;
          default:
            console.log("Unknown numeric unit:", unitNum);
            return "Unknown";
        }
      }
      
      console.log("Final unit key:", unitKey);
      
      // Convert to readable frequency
      if (unitKey === "Hours") {
        return durationNum === 1 ? "Hourly" : `Every ${durationNum} hours`;
      } else if (unitKey === "Days") {
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
      return amountInTokens.toString(); // Return just the number, not with "USDC" suffix
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

        // Special case: Empty object {} typically means Active state in Starknet enums
        if (allKeys.length === 0) {
          console.log("Empty state object detected, defaulting to 'active'");
          return "active";
        }

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

    // Helper function to format creator name
    const formatCreatorName = (address: string) => {
      if (!address) return "Unknown Creator";
      const addr = String(address);
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // Helper function to get proper visibility string
    const getVisibilityString = (visibility: any) => {
      console.log("=== VISIBILITY DEBUG (Details) ===");
      console.log("Raw visibility:", visibility);
      console.log("Visibility type:", typeof visibility);
      
      // Handle different enum formats from Starknet
      let visibilityKey = null;
      
      // Case 1: Object with variant property
      if (typeof visibility === "object" && visibility !== null && visibility.variant) {
        console.log("Case 1: Object with variant", visibility.variant);
        if (typeof visibility.variant === "object" && visibility.variant !== null) {
          visibilityKey = Object.keys(visibility.variant)[0];
          console.log("Extracted variant key:", visibilityKey);
        }
      }
      // Case 2: Object with direct enum keys
      else if (typeof visibility === "object" && visibility !== null && !visibility.variant) {
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
      description: groupInfo.description || `A ${visibilityStr} savings group with ${maxMembers} members contributing ${formatContribution(
        contributionAmount
      )} ${getFrequency(
        groupInfo.cycle_unit,
        groupInfo.cycle_duration
      ).toLowerCase()}.`,
      type: visibilityStr as "public" | "private",
      members: memberCount,
      maxMembers,
      contribution: formatContribution(contributionAmount),
      frequency: getFrequency(groupInfo.cycle_unit, groupInfo.cycle_duration),
      minReputation: minReputationRequired,
      locked: groupInfo.requires_lock,
      creator: {
        address: creatorAddress,
        name: formatCreatorName(creatorAddress),
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

  // Address helpers and on-chain profile resolution
  const ensureHexAddress = (addr: string): string => {
    const s = String(addr).trim();
    if (!s) return s;
    if (s.startsWith("0x")) return s;
    if (/^[0-9a-fA-F]+$/.test(s)) return `0x${s}`;
    try {
      const hex = BigInt(s).toString(16);
      return `0x${hex}`;
    } catch {
      return s;
    }
  };

  const resolveProfiles = async (
    addrs: string[]
  ): Promise<Record<string, { name?: string; avatar?: string }>> => {
    const map: Record<string, { name?: string; avatar?: string }> = {};
    if (!contract) return map;

    const unique = Array.from(
      new Set(addrs.map((a) => ensureHexAddress(String(a)).toLowerCase()))
    );

    await Promise.all(
      unique.map(async (a) => {
        try {
          const res = (await contract.call("get_user_profile", [a])) as any;
          const nameVal = res?.name;
          const avatarVal = res?.avatar;
          const nameStr =
            typeof nameVal === "string" && nameVal.trim().length > 0
              ? nameVal
              : undefined;
          const avatarStr =
            typeof avatarVal === "string" && avatarVal.trim().length > 0
              ? avatarVal
              : undefined;
          if (nameStr || avatarStr) {
            map[a] = { name: nameStr, avatar: avatarStr };
          }
        } catch (e) {
          console.log("Profile resolve error for", a, e);
        }
      })
    );

    return map;
  };

  // Helper function to format member data
  const formatMember = (
    member: GroupMember,
    index: number,
    isCreator: boolean = false,
    profile?: { name?: string; avatar?: string }
  ): FormattedMember => {
    const formatAmount = (amount: any) => {
      // USDC uses 6 decimals on Starknet
      const amountInTokens = Number(amount) / Math.pow(10, 6);
      return `${amountInTokens} USDC`;
    };

    // Safely convert address to string and format it properly
    const userAddress = String(member.user);
    
    // Helper function to format member name with better profile display
    const formatMemberName = (
      address: string,
      isCreatorFlag: boolean,
      pf?: { name?: string }
    ) => {
      if (pf && pf.name && String(pf.name).trim().length > 0) {
        return String(pf.name);
      }
      if (!address) return "Unknown User";
      const addr = String(address);
      const shortAddr = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
      return isCreatorFlag ? `${shortAddr} (Creator)` : shortAddr;
    };

    return {
      address: userAddress,
      name: formatMemberName(userAddress, isCreator, profile),
      avatar: profile?.avatar || "/placeholder.svg?height=40&width=40",
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

  // Check cache first
  const getCachedGroupDetails = (cacheKey: string) => {
    const cached = groupDetailsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  };

  // Fetch group details and members with optimizations
  const fetchGroupDetails = async (useCache = true) => {
    if (!contract || !groupId) {
      setError("Contract not available or invalid group ID");
      return;
    }

    const cacheKey = `group_${groupId}_${CONTRACT_ADDRESS}`;
    
    // Check cache first
    if (useCache) {
      const cachedData = getCachedGroupDetails(cacheKey);
      if (cachedData) {
        console.log(`📦 Using cached data for group ${groupId}`);
        setGroupDetails(cachedData.groupDetails);
        setMembers(cachedData.members);
        setInitialLoad(false);
        return;
      }
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
      let formattedMembers: FormattedMember[] = [];

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

        // Resolve on-chain profiles for member names/avatars
        const memberAddresses = memberInfos.map((m) => String(m.user));
        const profiles = await resolveProfiles(memberAddresses);

        const creatorAddr = ensureHexAddress(String(groupInfo.creator)).toLowerCase();

        formattedMembers = memberInfos.map((member, index) => {
          const memberAddrKey = ensureHexAddress(String(member.user)).toLowerCase();
          const isCreator = memberAddrKey === creatorAddr;
          const profile = profiles[memberAddrKey];
          return formatMember(member, index, isCreator, profile);
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

      // Cache the results after successful fetch
      if (groupDetails && members.length >= 0) {
        groupDetailsCache.set(cacheKey, {
          groupDetails: formattedGroup,
          members: formattedMembers || [],
          timestamp: Date.now()
        });
        console.log(`✅ Cached group ${groupId} details`);
      }
    } catch (error: any) {
      console.error("Error fetching group details:", error);
      setError(error.message || "Failed to fetch group details");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Fetch group details immediately when contract and groupId are available
  useEffect(() => {
    if (contract && groupId) {
      fetchGroupDetails();
    }
  }, [contract, groupId]);

  // Additional effect for when user connects (for membership status)
  useEffect(() => {
    if (contract && groupId && isConnected && address) {
      const cacheKey = `group_${groupId}_${CONTRACT_ADDRESS}`;
      const cachedData = getCachedGroupDetails(cacheKey);
      if (!cachedData) {
        fetchGroupDetails();
      }
    }
  }, [isConnected, address]);

  return {
    groupDetails,
    members,
    loading,
    error,
    refetch: fetchGroupDetails,
    forceRefresh: () => fetchGroupDetails(false),
    isConnected,
    initialLoad,
    isFromCache: !loading && !initialLoad && groupDetails !== null,
  };
}
