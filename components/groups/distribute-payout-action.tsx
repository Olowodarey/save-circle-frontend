"use client";

import { useState } from "react";
import { useAccount, useContract, useSendTransaction } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Loader2, CheckCircle, AlertCircle, Crown } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface DistributePayoutActionProps {
  groupId: string;
  groupDetails: any; // You can type this properly based on your group details interface
  onSuccess?: () => void;
}

export function DistributePayoutAction({ 
  groupId, 
  groupDetails, 
  onSuccess 
}: DistributePayoutActionProps) {
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

  const handleDistributePayout = async () => {
    if (!account || !contract) {
      setError("Please connect your wallet");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);

    try {
      console.log(`Distributing payout for group ${groupId}...`);
      
      // Prepare the contract call
      const groupIdNumber = parseInt(groupId.toString());
      const call = contract.populate("distribute_payout", [groupIdNumber]);

      console.log("Sending distribute_payout transaction...");
      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setTxHash(result.transaction_hash);
        setSuccess(true);
        console.log("Payout distribution successful:", result.transaction_hash);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error("Error distributing payout:", err);
      setError(err instanceof Error ? err.message : "Failed to distribute payout");
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Send className="h-4 w-4" />
          Distribute Payout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Payout Distributed!</span>
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
              Distribute payout to the next recipient in the cycle.
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleDistributePayout}
              disabled={isProcessing}
              className="w-full"
              variant="default"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Distributing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Distribute Payout
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
