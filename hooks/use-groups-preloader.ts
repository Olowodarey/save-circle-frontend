"use client";

import { useEffect } from "react";
import { useContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

/**
 * Global groups preloader hook
 * This hook starts fetching groups data in the background as soon as the app loads
 * to improve perceived performance when users navigate to groups page
 */
export function useGroupsPreloader() {
  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  useEffect(() => {
    if (contract) {
      // Start preloading groups in the background
      console.log("🚀 Starting background groups preload...");
      
      // Use a small delay to not interfere with initial app loading
      const preloadTimer = setTimeout(() => {
        preloadGroups(contract);
      }, 1000); // 1 second delay

      return () => clearTimeout(preloadTimer);
    }
  }, [contract]);
}

async function preloadGroups(contract: any) {
  try {
    console.log("📦 Preloading groups data...");
    const startTime = Date.now();
    
    // Preload first 10 groups in parallel for quick initial display
    const preloadCount = 10;
    const promises = [];
    
    for (let i = 1; i <= preloadCount; i++) {
      promises.push(
        contract.call("get_group_info", [i])
          .then((groupInfo: any) => ({ id: i, data: groupInfo }))
          .catch((error: any) => ({ id: i, error }))
      );
    }

    const results = await Promise.all(promises);
    const validGroups = results.filter(result => 
      !('error' in result) && Number(result.data.group_id) !== 0
    );

    const endTime = Date.now();
    console.log(`✅ Preloaded ${validGroups.length} groups in ${endTime - startTime}ms`);
    
    // The actual caching will be handled by useGroups hook when it runs
    // This preload just warms up the network connections and contract calls
    
  } catch (error) {
    console.log("⚠️ Groups preload failed (non-critical):", error);
  }
}
