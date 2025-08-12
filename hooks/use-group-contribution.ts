"use client";

import { useState } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export function useGroupContribution() {
  const { account, address, isConnected } = useAccount();
  const [isContributing, setIsContributing] = useState(false);
  const [contributionError, setContributionError] = useState<string | null>(
    null
  );

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  const contribute = async (groupId: string) => {
    if (!account || !isConnected || !address) {
      setContributionError("Please connect your wallet first");
      return false;
    }

    setIsContributing(true);
    setContributionError(null);

    try {
      // Convert groupId to the proper u256 format for the contract
      const groupIdBigInt = BigInt(groupId);

      // Format as u256 object (low, high)
      const groupIdU256 = {
        low: groupIdBigInt & BigInt("0xffffffffffffffffffffffffffffffff"),
        high: groupIdBigInt >> BigInt(128),
      };

      // Prepare the contract call
      const call = {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "contribute",
        calldata: [groupIdU256.low.toString(), groupIdU256.high.toString()],
      };

      // Send the transaction using the proper hook
      const result = await sendAsync([call]);

      console.log("Contribution transaction sent:", result);

      // Wait for the transaction to be processed
      if (result && result.transaction_hash) {
        await account.waitForTransaction(result.transaction_hash);
        console.log("Contribution confirmed");
      }

      return true;
    } catch (error: any) {
      console.error("Contribution failed:", error);
      setContributionError(error.message || "Failed to make contribution");
      return false;
    } finally {
      setIsContributing(false);
    }
  };

  return {
    contribute,
    isContributing,
    contributionError,
    clearError: () => setContributionError(null),
  };
}
