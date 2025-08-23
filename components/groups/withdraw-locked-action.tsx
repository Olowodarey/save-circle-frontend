"use client";

import { useState } from "react";
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Unlock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface WithdrawLockedActionProps {
  groupId: string;
  onSuccess?: () => void;
}

export function WithdrawLockedAction({ 
  groupId, 
  onSuccess 
}: WithdrawLockedActionProps) {
  const { account, address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendAsync } = useSendTransaction({});

  const handleWithdrawLocked = async () => {
    if (!account || !contract) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      console.log(`Withdrawing locked funds for group ${groupId}...`);
      
      // Prepare the contract call
      const groupIdNumber = parseInt(groupId.toString());
      const call = contract.populate("withdraw_locked", [groupIdNumber]);

      console.log("Sending withdraw_locked transaction...");
      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setTxHash(result.transaction_hash);
        setSuccess(true);
        console.log("Withdraw locked successful:", result.transaction_hash);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Error withdrawing locked funds:", err);
      setError(err instanceof Error ? err.message : "Failed to withdraw locked funds");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Unlock className="h-4 w-4" />
          Withdraw Locked Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Withdrawal Successful!</span>
            </div>
            {txHash && (
              <div className="text-xs text-muted-foreground break-all">
                Transaction: {txHash}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Withdraw your locked funds from this group.
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleWithdrawLocked}
              disabled={isProcessing || !account}
              className="w-full"
              variant="outline"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Withdraw Locked
                </>
              )}
            </Button>

            {!account && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your wallet to withdraw locked funds.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
