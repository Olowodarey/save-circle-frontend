"use client";

import { useState, useMemo } from "react";
import { useReadContract } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  RefreshCw, 
  Loader2, 
  AlertCircle,
  Clock
} from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface HeldPayoutsDisplayProps {
  groupId: string | number;
  className?: string;
}

export function HeldPayoutsDisplay({ groupId, className }: HeldPayoutsDisplayProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    if (typeof groupId === 'string') {
      return BigInt(groupId);
    }
    return BigInt(groupId);
  }, [groupId]);

  // Get held payouts count using useReadContract hook
  const { 
    data: heldPayoutsCount, 
    isLoading: loading, 
    error,
    refetch 
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_held_payouts",
    args: [formattedGroupId],
    enabled: !!groupId,
    watch: true,
    refetchInterval: refreshKey > 0 ? 1000 : false,
  });

  // Debug logging
  console.log("Held Payouts Debug:", {
    groupId,
    formattedGroupId: formattedGroupId.toString(),
    heldPayoutsCount,
    heldPayoutsCountString: heldPayoutsCount?.toString(),
    loading,
    error,
    contractAddress: CONTRACT_ADDRESS,
    enabled: !!groupId
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    // Reset refresh after a short time
    setTimeout(() => setRefreshKey(0), 2000);
  };

  const getPayoutStatus = (count: number) => {
    if (count === 0) return { status: "No Held Payouts", variant: "secondary" as const, description: "All payouts have been distributed" };
    if (count === 1) return { status: "1 Held Payout", variant: "default" as const, description: "One payout is being held" };
    return { status: `${count} Held Payouts`, variant: "destructive" as const, description: "Multiple payouts are being held" };
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Held Payouts
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
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading held payouts...</span>
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to load held payouts count
              </AlertDescription>
            </Alert>
          ) : heldPayoutsCount !== null && heldPayoutsCount !== undefined ? (
            <div className="space-y-3">
              {/* Held Payouts Count */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Number(heldPayoutsCount)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Payouts Currently Held
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant={getPayoutStatus(Number(heldPayoutsCount)).variant}
                  className="text-xs"
                >
                  {getPayoutStatus(Number(heldPayoutsCount)).status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-center text-muted-foreground">
                {getPayoutStatus(Number(heldPayoutsCount)).description}
              </p>

              {/* Additional Info */}
              {Number(heldPayoutsCount) > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-xs">
                    Held payouts may indicate pending distributions or administrative holds.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Badge variant="secondary" className="text-xs">
                No data available
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default HeldPayoutsDisplay;
