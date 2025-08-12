import { useState } from "react";
import { useContract, useSendTransaction } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export const useJoinGroup = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({});

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!contract) {
      setError("Contract not available");
      return false;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Convert groupId to Uint256 format for the contract
      const groupIdUint256 = { low: groupId, high: 0 };

      // Populate the transaction
      const call = await contract.populate("join_group", [groupIdUint256]);

      // Send the transaction
      const result = await sendAsync([call]);

      if (result) {
        console.log("Successfully joined group:", result);
        return true;
      } else {
        setError("Transaction failed");
        return false;
      }
    } catch (err: any) {
      console.error("Error joining group:", err);
      setError(err.message || "Failed to join group");
      return false;
    } finally {
      setIsJoining(false);
    }
  };

  return {
    joinGroup,
    isJoining,
    error,
    clearError: () => setError(null),
  };
};
