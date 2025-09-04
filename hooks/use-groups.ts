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

// Cache for groups to avoid refetching
const groupsCache = new Map<string, { data: FormattedGroup[], timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache

export function useGroups() {
  const { account, address, isConnected } = useAccount();
  const [groups, setGroups] = useState<FormattedGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

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
      console.log("Visibility JSON:", JSON.stringify(visibility, null, 2));

      // Handle different enum formats from Starknet
      let visibilityKey = null;

      // Case 1: Object with variant property (CairoCustomEnum format)
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
          const variantKeys = Object.keys(visibility.variant);
          console.log("Variant keys:", variantKeys);
          
          // Look for active variant or first key
          visibilityKey = variantKeys.find(key => 
            visibility.variant[key] === true || 
            visibility.variant[key] === 1 ||
            (typeof visibility.variant[key] === 'object' && visibility.variant[key] !== null)
          ) || variantKeys[0];
          
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
        const directKeys = Object.keys(visibility);
        
        // Look for active key or first key
        visibilityKey = directKeys.find(key => 
          visibility[key] === true || 
          visibility[key] === 1 ||
          (typeof visibility[key] === 'object' && visibility[key] !== null)
        ) || directKeys[0];
        
        console.log("Extracted direct key:", visibilityKey);
      }
      // Case 3: String value (direct enum name)
      else if (typeof visibility === "string") {
        console.log("Case 3: String value", visibility);
        visibilityKey = visibility;
      }
      // Case 4: Numeric value
      else {
        const visNum = Number(visibility);
        console.log("Case 4: Numeric value", visNum);
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

      // Convert to lowercase for consistency and validate
      if (visibilityKey) {
        const normalizedKey = visibilityKey.toLowerCase();
        if (normalizedKey === "public" || normalizedKey === "private") {
          return normalizedKey;
        }
      }

      console.log("No valid visibility key found, defaulting to public");
      return "public"; // Default fallback
    };

    const visibilityStr = getVisibilityString(groupInfo.visibility);
    console.log(`🎯 Final visibilityStr for group ${groupId}:`, visibilityStr);
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

  // Check cache first
  const getCachedGroups = (cacheKey: string) => {
    const cached = groupsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  // Fetch groups from contract with optimizations
  const fetchGroups = async (useCache = true) => {
    if (!contract) {
      setError("Contract not available");
      return;
    }

    const cacheKey = `groups_${CONTRACT_ADDRESS}`;
    
    // Check cache first
    if (useCache) {
      const cachedGroups = getCachedGroups(cacheKey);
      if (cachedGroups) {
        console.log("📦 Using cached groups data");
        setGroups(cachedGroups);
        setInitialLoad(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🚀 Fetching groups with parallel requests...");
      const startTime = Date.now();
      
      // Use parallel requests for better performance
      const maxGroupsToCheck = 20; // Reduced for better performance
      const batchSize = 5; // Process in smaller batches
      const validGroups: FormattedGroup[] = [];

      // Process groups in batches for better performance
      for (let batch = 0; batch < Math.ceil(maxGroupsToCheck / batchSize); batch++) {
        const batchStart = batch * batchSize + 1;
        const batchEnd = Math.min((batch + 1) * batchSize, maxGroupsToCheck);
        
        console.log(`📦 Processing batch ${batch + 1}: groups ${batchStart}-${batchEnd}`);
        
        // Create parallel promises for this batch
        const batchPromises = [];
        for (let i = batchStart; i <= batchEnd; i++) {
          batchPromises.push(
            contract.call("get_group_info", [i])
              .then((groupInfo: any) => ({ id: i, data: groupInfo as GroupInfo }))
              .catch((error) => ({ id: i, error }))
          );
        }

        // Wait for this batch to complete
        const batchResults = await Promise.all(batchPromises);
        
        // Process batch results
        for (const result of batchResults) {
          if ('error' in result) {
            console.log(`Group ${result.id} not found or error:`, result.error);
            continue;
          }

          const { id, data: groupInfo } = result;
          
          // If group_id is 0, it means the group doesn't exist
          if (Number(groupInfo.group_id) === 0) {
            continue;
          }

          try {
            console.log(`🔍 Raw group data for group ${id}:`, {
              group_id: groupInfo.group_id,
              group_name: groupInfo.group_name,
              visibility: groupInfo.visibility,
              visibility_type: typeof groupInfo.visibility,
              all_fields: Object.keys(groupInfo)
            });
            
            const formattedGroup = formatGroup(groupInfo, id.toString());
            console.log(`✅ Formatted group ${id} visibility:`, formattedGroup.visibility);
            validGroups.push(formattedGroup);
          } catch (formatError) {
            console.log(`Error formatting group ${id}:`, formatError);
          }
        }
        
        // Update UI progressively for better UX
        if (validGroups.length > 0) {
          setGroups([...validGroups]);
        }
      }

      // Cache the results
      groupsCache.set(cacheKey, {
        data: validGroups,
        timestamp: Date.now()
      });
      
      const endTime = Date.now();
      console.log(`✅ Fetched ${validGroups.length} groups in ${endTime - startTime}ms`);
      
      setGroups(validGroups);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      setError(error.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Preload groups as soon as contract is available (even without wallet connection)
  useEffect(() => {
    if (contract) {
      // Start fetching immediately when contract is available
      fetchGroups();
    }
  }, [contract]);

  // Additional effect for when user connects wallet (for user-specific data)
  useEffect(() => {
    if (contract && isConnected && address) {
      // Refresh groups when user connects (for membership status, etc.)
      const cacheKey = `groups_${CONTRACT_ADDRESS}`;
      const cachedGroups = getCachedGroups(cacheKey);
      if (!cachedGroups) {
        fetchGroups();
      }
    }
  }, [isConnected, address]);

  // Get public groups only
  const publicGroups = groups.filter((group) => group.visibility === "public");
  
  // Get private groups (for user's own groups or groups they're members of)
  const privateGroups = groups.filter((group) => group.visibility === "private");
  
  // Get user's groups (both public and private groups they created or are members of)
  const userGroups = groups.filter((group) => {
    if (!address) return false;
    // For now, show all private groups to the user
    // In a full implementation, this would check membership from contract
    return group.visibility === "private" || group.creator.toLowerCase().includes(address.toLowerCase().slice(-4));
  });

  // Get user's group invitations (this would need additional contract functions)
  const userInvites: any[] = []; // Placeholder for now

  return {
    groups,
    publicGroups,
    privateGroups,
    userGroups,
    userInvites,
    loading,
    error,
    refetch: fetchGroups,
    forceRefresh: () => fetchGroups(false), // Force refresh without cache
    isConnected,
    initialLoad,
    isFromCache: !loading && !initialLoad && groups.length > 0,
  };
}
