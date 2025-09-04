"use client";

import { useState, useEffect, useMemo } from "react";
import { useContract, useAccount, useSendTransaction } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, RefreshCw, Clock, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { Call } from "starknet";

interface NextPayoutDisplayProps {
  groupId: string;
}

export function NextPayoutDisplay({ groupId }: NextPayoutDisplayProps) {
  const { address } = useAccount();
  const { sendAsync } = useSendTransaction({});
  const [nextRecipient, setNextRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const fetchNextPayoutRecipient = async () => {
    if (!contract || !groupId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching next payout recipient for group ${groupId}...`);
      
      const result = await contract.call("get_next_payout_recipient", [parseInt(groupId.toString())]);
      
      console.log("Raw next payout recipient result:", result);
      
      // Convert the address to string format
      const recipientAddress = result.toString();
      setNextRecipient(recipientAddress);
      
      console.log("Next payout recipient:", recipientAddress);
    } catch (err) {
      console.error("Error fetching next payout recipient:", err);
      setError("Failed to fetch next recipient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextPayoutRecipient();
  }, [contract, groupId]);

  const formatAddress = (address: string) => {
    if (!address || address === "0" || address === "0x0") {
      return "No recipient yet";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRecipientStatus = (address: string) => {
    if (!address || address === "0" || address === "0x0") {
      return { status: "Pending", variant: "secondary" as const };
    }
    return { status: "Next in Queue", variant: "default" as const };
  };

  const getInitials = (address: string) => {
    if (!address || address === "0" || address === "0x0") {
      return "?";
    }
    return address.slice(2, 4).toUpperCase();
  };

  // Check if current user is the next payout recipient
  const isNextRecipient = useMemo(() => {
    if (!nextRecipient || !address) return false;
    return nextRecipient.toLowerCase() === address.toLowerCase();
  }, [nextRecipient, address]);

  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    return BigInt(groupId);
  }, [groupId]);

  // Handle claim payout transaction
  const handleClaimPayout = async () => {
    if (!address || !isNextRecipient) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      // Format U256 values
      const formatU256 = (value: bigint) => {
        const MAX_U128 = BigInt("0xffffffffffffffffffffffffffffffff");
        return {
          low: value & MAX_U128,
          high: value >> BigInt(128),
        };
      };

      const groupIdU256 = formatU256(formattedGroupId);

      const call: Call = {
        entrypoint: "claim_payout",
        contractAddress: CONTRACT_ADDRESS,
        calldata: [groupIdU256.low, groupIdU256.high],
      };

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setSuccess("Payout claimed successfully! Check your wallet for the USDC transfer.");
        // Refresh the next recipient data
        fetchNextPayoutRecipient();
      }
    } catch (err: any) {
      console.error("Claim payout error:", err);
      setError(err.message || "Failed to claim payout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Next Payout
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchNextPayoutRecipient}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <Badge variant="destructive" className="text-xs">
              {error}
            </Badge>
          ) : nextRecipient !== null ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {getInitials(nextRecipient)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {formatAddress(nextRecipient)}
                  </div>
                  <Badge 
                    variant={getRecipientStatus(nextRecipient).variant}
                    className="text-xs mt-1"
                  >
                    {getRecipientStatus(nextRecipient).status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {nextRecipient === "0" || nextRecipient === "0x0" 
                  ? "Waiting for cycle to begin"
                  : "Next member to receive payout"
                }
              </p>
              
              {/* Claim Payout Button - Only show if user is next recipient */}
              {isNextRecipient && nextRecipient !== "0" && nextRecipient !== "0x0" && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900 text-sm">You're Next!</span>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      You are the next payout recipient. Click below to claim your payout.
                    </p>
                    <Button
                      onClick={handleClaimPayout}
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Claiming Payout...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Claim My Payout
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No data available
            </div>
          )}
          
          {/* Status Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50 mt-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 mt-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
