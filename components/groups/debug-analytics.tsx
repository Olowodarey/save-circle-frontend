"use client";

import { useReadContract, useAccount } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DebugAnalyticsProps {
  groupId: string | number;
}

export default function DebugAnalytics({ groupId }: DebugAnalyticsProps) {
  const { address } = useAccount();
  const [showRawData, setShowRawData] = useState(false);

  // Convert groupId to proper format
  const formattedGroupId = BigInt(groupId);

  // Test get_group_locked_funds
  const {
    data: lockedFundsRaw,
    isLoading: isLoadingLockedFunds,
    error: lockedFundsError,
    refetch: refetchLockedFunds,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_group_locked_funds",
    args: [formattedGroupId],
    enabled: !!groupId,
  });

  // Test get_contribution_deadline
  const {
    data: deadlineRaw,
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

  // Test get_time_until_deadline
  const {
    data: timeUntilDeadlineRaw,
    isLoading: isLoadingTimeUntilDeadline,
    error: timeUntilDeadlineError,
    refetch: refetchTimeUntilDeadline,
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "get_time_until_deadline",
    args: [formattedGroupId, address || "0x0"],
    enabled: !!groupId && !!address,
  });

  const refetchAll = () => {
    refetchLockedFunds();
    refetchDeadline();
    refetchTimeUntilDeadline();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🔍 Debug Analytics - Group {groupId}</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setShowRawData(!showRawData)} variant="outline" size="sm">
              {showRawData ? "Hide" : "Show"} Raw Data
            </Button>
            <Button onClick={refetchAll} variant="outline" size="sm">
              Refresh All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Address Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm"><strong>Contract:</strong> {CONTRACT_ADDRESS}</p>
          <p className="text-sm"><strong>Group ID:</strong> {groupId} (BigInt: {formattedGroupId.toString()})</p>
          <p className="text-sm"><strong>Your Address:</strong> {address || "Not connected"}</p>
        </div>

        {/* Locked Funds Test */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">💰 get_group_locked_funds</h3>
          <div className="p-3 border rounded-lg">
            <p><strong>Loading:</strong> {isLoadingLockedFunds ? "Yes" : "No"}</p>
            <p><strong>Error:</strong> {lockedFundsError ? lockedFundsError.message : "None"}</p>
            <p><strong>Has Data:</strong> {lockedFundsRaw ? "Yes" : "No"}</p>
            
            {showRawData && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <strong>Raw Data:</strong>
                <pre>{JSON.stringify(lockedFundsRaw, null, 2)}</pre>
              </div>
            )}

            {lockedFundsRaw && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">✅ Contract call successful!</p>
                <p className="text-sm">Data type: {typeof lockedFundsRaw}</p>
                <p className="text-sm">Is Array: {Array.isArray(lockedFundsRaw) ? "Yes" : "No"}</p>
                {Array.isArray(lockedFundsRaw) && (
                  <p className="text-sm">Array length: {lockedFundsRaw.length}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Deadline Test */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">⏰ get_contribution_deadline</h3>
          <div className="p-3 border rounded-lg">
            <p><strong>Loading:</strong> {isLoadingDeadline ? "Yes" : "No"}</p>
            <p><strong>Error:</strong> {deadlineError ? deadlineError.message : "None"}</p>
            <p><strong>Has Data:</strong> {deadlineRaw ? "Yes" : "No"}</p>
            
            {showRawData && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <strong>Raw Data:</strong>
                <pre>{JSON.stringify(deadlineRaw, null, 2)}</pre>
              </div>
            )}

            {deadlineRaw && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">✅ Contract call successful!</p>
                <p className="text-sm">Value: {deadlineRaw.toString()}</p>
                <p className="text-sm">As Date: {new Date(Number(deadlineRaw) * 1000).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Time Until Deadline Test */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">⏱️ get_time_until_deadline</h3>
          <div className="p-3 border rounded-lg">
            <p><strong>Loading:</strong> {isLoadingTimeUntilDeadline ? "Yes" : "No"}</p>
            <p><strong>Error:</strong> {timeUntilDeadlineError ? timeUntilDeadlineError.message : "None"}</p>
            <p><strong>Has Data:</strong> {timeUntilDeadlineRaw ? "Yes" : "No"}</p>
            
            {showRawData && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <strong>Raw Data:</strong>
                <pre>{JSON.stringify(timeUntilDeadlineRaw, null, 2)}</pre>
              </div>
            )}

            {timeUntilDeadlineRaw && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-medium">✅ Contract call successful!</p>
                <p className="text-sm">Seconds: {timeUntilDeadlineRaw.toString()}</p>
                <p className="text-sm">Minutes: {Math.floor(Number(timeUntilDeadlineRaw) / 60)}</p>
                <p className="text-sm">Hours: {Math.floor(Number(timeUntilDeadlineRaw) / 3600)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800">📋 Summary</h4>
          <ul className="text-sm text-blue-700 mt-1 space-y-1">
            <li>• Locked Funds: {lockedFundsRaw ? "✅ Working" : lockedFundsError ? "❌ Error" : "⏳ Loading"}</li>
            <li>• Deadline: {deadlineRaw ? "✅ Working" : deadlineError ? "❌ Error" : "⏳ Loading"}</li>
            <li>• Time Until: {timeUntilDeadlineRaw ? "✅ Working" : timeUntilDeadlineError ? "❌ Error" : "⏳ Loading"}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
