"use client";

import { useState } from "react";
import {
  useAccount,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export function useGroupActivation() {
  const { account, address, isConnected } = useAccount();
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  const activateGroup = async (groupId: string) => {
    if (!account || !isConnected || !address) {
      setActivationError("Please connect your wallet first");
      return false;
    }

    setIsActivating(true);
    setActivationError(null);

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
        entrypoint: "activate_group",
        calldata: [groupIdU256.low.toString(), groupIdU256.high.toString()],
      };

      // Send the transaction using the proper hook
      const result = await sendAsync([call]);

      console.log("Group activation transaction sent:", result);

      // Wait for the transaction to be processed
      if (result && result.transaction_hash) {
        await account.waitForTransaction(result.transaction_hash);
        console.log("Group activation confirmed");
      }

      return true;
    } catch (error: any) {
      console.error("Group activation failed:", error);
      setActivationError(error.message || "Failed to activate group");
      return false;
    } finally {
      setIsActivating(false);
    }
  };

  return {
    activateGroup,
    isActivating,
    activationError,
    clearError: () => setActivationError(null),
  };
}
