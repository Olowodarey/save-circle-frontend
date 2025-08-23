"use client";

import { useState, useEffect } from "react";
import { useContract } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, RefreshCw } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface LockedBalanceDisplayProps {
  groupId: string;
}

export function LockedBalanceDisplay({ groupId }: LockedBalanceDisplayProps) {
  const [lockedBalance, setLockedBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const fetchLockedBalance = async () => {
    if (!contract || !groupId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching locked balance for group ${groupId}...`);
      
      const result = await contract.call("get_locked_balance", [parseInt(groupId.toString())]);
      
      console.log("Raw locked balance result:", result);
      
      // Convert from USDC units (6 decimals) to readable format
      const balanceInTokens = Number(result) / Math.pow(10, 6);
      setLockedBalance(balanceInTokens.toFixed(2));
      
      console.log("Formatted locked balance:", balanceInTokens.toFixed(2));
    } catch (err) {
      console.error("Error fetching locked balance:", err);
      setError("Failed to fetch locked balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedBalance();
  }, [contract, groupId]);

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0.00";
    return num.toFixed(2);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Locked Balance
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLockedBalance}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <Badge variant="destructive" className="text-xs">
              {error}
            </Badge>
          ) : lockedBalance !== null ? (
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {formatBalance(lockedBalance)} USDC
              </div>
              <p className="text-xs text-muted-foreground">
                Total amount locked in this group
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
