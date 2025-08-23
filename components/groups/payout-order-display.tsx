"use client";

import { useState, useEffect } from "react";
import { useContract } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { List, RefreshCw, Users, Crown } from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

interface PayoutOrderDisplayProps {
  groupId: string;
}

interface PayoutOrder {
  position: number;
  address: string;
  status: "pending" | "completed" | "current";
}

export function PayoutOrderDisplay({ groupId }: PayoutOrderDisplayProps) {
  const [payoutOrder, setPayoutOrder] = useState<PayoutOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  const fetchPayoutOrder = async () => {
    if (!contract || !groupId) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching payout order for group ${groupId}...`);
      
      const result = await contract.call("get_payout_order", [parseInt(groupId.toString())]);
      
      console.log("Raw payout order result:", result);
      
      // Process the result - this will depend on your contract's return format
      // Assuming it returns an array of addresses in payout order
      let processedOrder: PayoutOrder[] = [];
      
      if (Array.isArray(result)) {
        processedOrder = result.map((address: any, index: number) => ({
          position: index + 1,
          address: String(address),
          status: index === 0 ? "current" : "pending" as const
        }));
      } else if (result) {
        // Handle single result or different format
        processedOrder = [{
          position: 1,
          address: String(result),
          status: "current" as const
        }];
      }
      
      setPayoutOrder(processedOrder);
      console.log("Processed payout order:", processedOrder);
    } catch (err) {
      console.error("Error fetching payout order:", err);
      setError("Failed to fetch payout order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutOrder();
  }, [contract, groupId]);

  const formatAddress = (address: string) => {
    if (!address || address === "0" || address === "0x0") {
      return "No address";
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getInitials = (address: string) => {
    if (!address || address === "0" || address === "0x0") {
      return "?";
    }
    return address.slice(2, 4).toUpperCase();
  };

  const getStatusBadge = (status: string, position: number) => {
    switch (status) {
      case "current":
        return <Badge variant="default" className="text-xs">Next</Badge>;
      case "completed":
        return <Badge variant="secondary" className="text-xs">Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">#{position}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <List className="h-4 w-4" />
          Payout Order
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchPayoutOrder}
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
          ) : payoutOrder.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground mb-2">
                {payoutOrder.length} member{payoutOrder.length !== 1 ? 's' : ''} in queue
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {payoutOrder.map((member, index) => (
                  <div 
                    key={`${member.address}-${index}`}
                    className={`flex items-center space-x-3 p-2 rounded-lg border ${
                      member.status === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {member.position}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(member.address)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs">
                        {formatAddress(member.address)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {member.status === 'current' && (
                        <Crown className="h-3 w-3 text-blue-600" />
                      )}
                      {getStatusBadge(member.status, member.position)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              No payout order available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
