"use client";

import { useState, useMemo } from "react";
import {
  useReadContract,
  useAccount,
  useSendTransaction,
} from "@starknet-react/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Send,
  Download,
  CheckCircle,
  RefreshCw,
  Loader2,
  Users,
  Calendar,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { Call } from "starknet";
import { FormattedGroupDetails } from "@/hooks/use-group-details";

interface PayoutManagerProps {
  groupId: string;
  groupDetails: FormattedGroupDetails;
}

export default function PayoutManager({
  groupId,
  groupDetails,
}: PayoutManagerProps) {
  const { address } = useAccount();
  const { sendAsync } = useSendTransaction({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    return BigInt(groupId);
  }, [groupId]);

  // Get next payout recipient
  const {
    data: nextPayoutRecipient,
    isLoading: isLoadingRecipient,
    error: recipientError,
    refetch: refetchRecipient,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_next_payout_recipient",
    args: [formattedGroupId],
    enabled: !!groupId,
  });

  // Get payout order
  const {
    data: payoutOrder,
    isLoading: isLoadingOrder,
    error: orderError,
    refetch: refetchOrder,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_payout_order",
    args: [formattedGroupId],
    enabled: !!groupId,
  });

  // Check if current user is the group creator/admin
  const isGroupAdmin = useMemo(() => {
    return address && groupDetails.creator.address === address;
  }, [address, groupDetails.creator.address]);

  // Check if current user is the next payout recipient
  const isNextRecipient = useMemo(() => {
    if (!nextPayoutRecipient || !address) return false;
    // nextPayoutRecipient is a GroupMember struct, need to access the address field
    const recipientAddress =
      (nextPayoutRecipient as any)?.address ||
      (nextPayoutRecipient as any)?.user_address;
    return recipientAddress === address;
  }, [nextPayoutRecipient, address]);

  // Format payout amount
  const formatPayoutAmount = (amount: any) => {
    if (!amount) return "0.0000";
    const amountNum = Number(amount) / 1e6; // USDC has 6 decimals
    return amountNum.toFixed(4);
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "Unknown";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Distribute payout (admin only)
  const handleDistributePayout = async () => {
    if (!address || !isGroupAdmin) return;

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
        entrypoint: "distribute_payout",
        contractAddress: CONTRACT_ADDRESS,
        calldata: [groupIdU256.low, groupIdU256.high],
      };

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setSuccess(
          "Payout distributed successfully! Recipients can now claim their funds."
        );
        // Refresh data
        refetchRecipient();
        refetchOrder();
      }
    } catch (err: any) {
      console.error("Distribute payout error:", err);
      setError(err.message || "Failed to distribute payout");
    } finally {
      setIsProcessing(false);
    }
  };

  // Claim payout (for eligible users)
  const handleClaimPayout = async () => {
    if (!address) return;

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
        setSuccess(
          "Payout claimed successfully! Check your wallet for the USDC transfer."
        );
        // Refresh data
        refetchRecipient();
        refetchOrder();
      }
    } catch (err: any) {
      console.error("Claim payout error:", err);
      setError(err.message || "Failed to claim payout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefreshAll = () => {
    refetchRecipient();
    refetchOrder();
  };

  const isLoading = isLoadingRecipient || isLoadingOrder;

  return (
    <div className="space-y-4">
      {/* Payout Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payout Management
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading payout info...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Next Payout Information */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Next Payout
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-300"
                  >
                    {groupDetails.nextPayoutDate}
                  </Badge>
                </div>

                {nextPayoutRecipient && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Recipient:</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isNextRecipient ? "default" : "secondary"}
                        >
                          {formatAddress(
                            (nextPayoutRecipient as any)?.address ||
                              (nextPayoutRecipient as any)?.user_address
                          )}
                        </Badge>
                        {isNextRecipient && (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 border-green-300"
                          >
                            You!
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">Expected Amount:</span>
                      <span className="font-semibold text-blue-900">
                        {groupDetails.contribution} USDC
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payout Order Display */}
              {payoutOrder &&
                Array.isArray(payoutOrder) &&
                payoutOrder.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Payout Order
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {payoutOrder
                        .slice(0, 5)
                        .map((member: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span>
                                {formatAddress(
                                  member?.address || member?.user_address
                                )}
                              </span>
                            </div>
                            {index === 0 && (
                              <Badge
                                variant="default"
                                className="bg-blue-100 text-blue-800 border-blue-300"
                              >
                                Next
                              </Badge>
                            )}
                          </div>
                        ))}
                      {payoutOrder.length > 5 && (
                        <div className="text-xs text-gray-500 text-center pt-2">
                          +{payoutOrder.length - 5} more members
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payout Actions</CardTitle>
          <CardDescription>
            {isGroupAdmin
              ? "Distribute payouts to eligible members"
              : "Claim your payout when eligible"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Admin Actions */}
          {isGroupAdmin && (
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-900">
                    Admin Actions
                  </span>
                </div>
                <p className="text-sm text-orange-800 mb-3">
                  As the group creator, you can distribute payouts to eligible
                  members.
                </p>
                <Button
                  onClick={handleDistributePayout}
                  disabled={isProcessing || groupDetails.status !== "active"}
                  className="w-full"
                  variant="default"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Distributing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Distribute Payout
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* User Actions */}
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Claim Payout</span>
              </div>
              <p className="text-sm text-green-800 mb-3">
                {isNextRecipient
                  ? "You are the next payout recipient! You can claim your payout once it's distributed."
                  : "Claim your payout when you become eligible and it's distributed."}
              </p>
              <Button
                onClick={handleClaimPayout}
                disabled={isProcessing || !isNextRecipient}
                className="w-full"
                variant={isNextRecipient ? "default" : "secondary"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Claiming...
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

          {/* Status Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
