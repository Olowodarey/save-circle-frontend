"use client";

import { useState, useEffect } from "react";
import { useContract } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, RefreshCw, Clock } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface NextPayoutDisplayProps {
  groupId: string;
}

export function NextPayoutDisplay({ groupId }: NextPayoutDisplayProps) {
  const [nextRecipient, setNextRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
