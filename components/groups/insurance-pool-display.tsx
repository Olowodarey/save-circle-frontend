"use client";

import { useState, useMemo } from "react";
import { useReadContract } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface InsurancePoolDisplayProps {
  groupId: string;
}

export function InsurancePoolDisplay({ groupId }: InsurancePoolDisplayProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Convert groupId to proper format for contract calls (same as group analytics)
  const formattedGroupId = useMemo(() => {
    if (typeof groupId === 'string') {
      return BigInt(groupId);
    }
    return BigInt(groupId);
  }, [groupId]);

  // Get insurance pool balance using modern useReadContract hook
  const { data: insurancePoolBalance, isLoading: loading, error } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_insurance_pool_balance",
    args: [formattedGroupId],
    enabled: !!groupId,
    // Add refresh key to force refetch when needed
    refetchInterval: refreshKey > 0 ? 1000 : false,
  });

  // Debug logging
  console.log("Insurance Pool Debug:", {
    groupId,
    formattedGroupId: formattedGroupId.toString(),
    insurancePoolBalance,
    insurancePoolBalanceString: insurancePoolBalance?.toString(),
    loading,
    error,
    contractAddress: CONTRACT_ADDRESS,
    enabled: !!groupId
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Reset refresh after a short time
    setTimeout(() => setRefreshKey(0), 2000);
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0.0000";
    return num.toFixed(4); // Show 4 decimal places for small amounts
  };

  const getInsuranceStatus = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return { status: "No Coverage", variant: "secondary" as const };
    if (num < 10) return { status: "Low Coverage", variant: "destructive" as const };
    if (num < 50) return { status: "Medium Coverage", variant: "default" as const };
    return { status: "High Coverage", variant: "default" as const };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Insurance Pool
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
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
              Failed to load insurance pool balance
            </Badge>
          ) : insurancePoolBalance !== null && insurancePoolBalance !== undefined ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(() => {
                  const balanceNum = Number(insurancePoolBalance) / 1e6; // USDC has 6 decimals
                  return balanceNum.toFixed(4); // Show 4 decimal places for small amounts
                })()} USDC
              </div>
              <Badge 
                variant={(() => {
                  const balanceNum = Number(insurancePoolBalance) / 1e6;
                  return getInsuranceStatus(balanceNum.toFixed(2)).variant;
                })()}
                className="text-xs"
              >
                {(() => {
                  const balanceNum = Number(insurancePoolBalance) / 1e6;
                  return getInsuranceStatus(balanceNum.toFixed(2)).status;
                })()}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Insurance pool protects against defaults
              </p>
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs">
              No data available
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
