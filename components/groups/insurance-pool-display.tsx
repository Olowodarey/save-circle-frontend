"use client";

import { useState, useEffect } from "react";
import { useContract } from "@starknet-react/core";
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
  const [insuranceBalance, setInsuranceBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const fetchInsuranceBalance = async () => {
    if (!contract || !groupId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching insurance pool balance for group ${groupId}...`);
      
      const result = await contract.call("get_insurance_pool_balance", [parseInt(groupId.toString())]);
      
      console.log("Raw insurance pool balance result:", result);
      
      // Convert from USDC units (6 decimals) to readable format
      const balanceInTokens = Number(result) / Math.pow(10, 6);
      setInsuranceBalance(balanceInTokens.toFixed(2));
      
      console.log("Formatted insurance pool balance:", balanceInTokens.toFixed(2));
    } catch (err) {
      console.error("Error fetching insurance pool balance:", err);
      setError("Failed to fetch insurance pool balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsuranceBalance();
  }, [contract, groupId]);

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0.00";
    return num.toFixed(2);
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
          onClick={fetchInsuranceBalance}
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
          ) : insuranceBalance !== null ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatBalance(insuranceBalance)} USDC
              </div>
              <Badge 
                variant={getInsuranceStatus(insuranceBalance).variant}
                className="text-xs"
              >
                {getInsuranceStatus(insuranceBalance).status}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Insurance pool protects against defaults
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
