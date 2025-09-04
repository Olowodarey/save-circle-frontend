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
  Clock,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  RefreshCw,
  Loader2,
  Calendar,
  Timer,
} from "lucide-react";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { Call } from "starknet";

interface DeadlinePenaltyManagerProps {
  groupId: string;
}

export default function DeadlinePenaltyManager({
  groupId,
}: DeadlinePenaltyManagerProps) {
  const { address } = useAccount();
  const { sendAsync } = useSendTransaction({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Convert groupId to proper format for contract calls
  const formattedGroupId = useMemo(() => {
    return BigInt(groupId);
  }, [groupId]);

  // Get contribution deadline for current user
  const {
    data: contributionDeadline,
    isLoading: isLoadingDeadline,
    error: deadlineError,
    refetch: refetchDeadline,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_contribution_deadline",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  // Get missed deadline penalty for current user
  const {
    data: missedDeadlinePenalty,
    isLoading: isLoadingPenalty,
    error: penaltyError,
    refetch: refetchPenalty,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_missed_deadline_penalty",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  // Get time until deadline for current user
  const {
    data: timeUntilDeadline,
    isLoading: isLoadingTime,
    error: timeError,
    refetch: refetchTime,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_time_until_deadline",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  // Format deadline timestamp to readable date
  const formatDeadline = (timestamp: any) => {
    if (!timestamp) return "No deadline set";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  // Format time until deadline
  const formatTimeUntil = (seconds: any) => {
    if (!seconds) return "No time data";
    const totalSeconds = Number(seconds);

    if (totalSeconds <= 0) return "Deadline passed";

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Format penalty amount
  const formatPenalty = (penalty: any) => {
    if (!penalty) return "0.0000";
    const penaltyNum = Number(penalty) / 1e6; // USDC has 6 decimals
    return penaltyNum.toFixed(4);
  };

  // Check if deadline is overdue
  const isOverdue = useMemo(() => {
    if (!timeUntilDeadline) return false;
    return Number(timeUntilDeadline) <= 0;
  }, [timeUntilDeadline]);

  // Track missed deadline penalty
  const handleTrackPenalty = async () => {
    if (!address || !missedDeadlinePenalty) return;

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
      const penaltyAmountU256 = formatU256(
        BigInt(missedDeadlinePenalty.toString())
      );

      const call: Call = {
        entrypoint: "track_missed_deadline_penalty",
        contractAddress: CONTRACT_ADDRESS,
        calldata: [
          groupIdU256.low,
          groupIdU256.high,
          address,
          penaltyAmountU256.low,
          penaltyAmountU256.high,
        ],
      };

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setSuccess("Penalty tracking recorded successfully!");
        // Refresh data
        refetchPenalty();
        refetchDeadline();
        refetchTime();
      }
    } catch (err: any) {
      console.error("Track penalty error:", err);
      setError(err.message || "Failed to track penalty");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check and apply deadline penalty
  const handleApplyPenalty = async () => {
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
        entrypoint: "check_and_apply_deadline_penalty",
        contractAddress: CONTRACT_ADDRESS,
        calldata: [groupIdU256.low, groupIdU256.high, address],
      };

      const result = await sendAsync([call]);

      if (result?.transaction_hash) {
        setSuccess("Deadline penalty applied successfully!");
        // Refresh data
        refetchPenalty();
        refetchDeadline();
        refetchTime();
      }
    } catch (err: any) {
      console.error("Apply penalty error:", err);
      setError(err.message || "Failed to apply penalty");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefreshAll = () => {
    refetchDeadline();
    refetchPenalty();
    refetchTime();
  };

  const isLoading = isLoadingDeadline || isLoadingPenalty || isLoadingTime;

  return (
    <div className="space-y-4">
      {/* Deadline Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Contribution Deadline
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
                Loading deadline info...
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Deadline Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deadline:</span>
                <Badge variant={isOverdue ? "destructive" : "default"}>
                  {formatDeadline(contributionDeadline)}
                </Badge>
              </div>

              {/* Time Until Deadline */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  Time Remaining:
                </span>
                <Badge variant={isOverdue ? "destructive" : "secondary"}>
                  {formatTimeUntil(timeUntilDeadline)}
                </Badge>
              </div>

              {/* Deadline Status */}
              {isOverdue && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Your contribution deadline has passed. Penalties may apply.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Penalty Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Penalty Management
          </CardTitle>
          <CardDescription>
            Track and apply deadline penalties for missed contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Penalty Amount */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Current Penalty:</span>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                {formatPenalty(missedDeadlinePenalty)} USDC
              </div>
              <div className="text-xs text-gray-500">
                Accumulated penalty amount
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleTrackPenalty}
              disabled={
                isProcessing ||
                !missedDeadlinePenalty ||
                Number(missedDeadlinePenalty) === 0
              }
              className="w-full"
              variant="outline"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Track Missed Deadline Penalty
                </>
              )}
            </Button>

            <Button
              onClick={handleApplyPenalty}
              disabled={isProcessing || !isOverdue}
              className="w-full"
              variant={isOverdue ? "destructive" : "secondary"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Check & Apply Deadline Penalty
                </>
              )}
            </Button>
          </div>

          {/* Status Messages */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
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
