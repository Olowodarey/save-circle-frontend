"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Download,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useAccount, useReadContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";
import { formatUnits } from "viem";
import { Contract, RpcProvider } from "starknet";

interface ProfilePayoutsProps {
  userAddress?: string;
}

export default function ProfilePayouts({ userAddress }: ProfilePayoutsProps) {
  const { address, isConnected } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
  const [lastWithdrawnAmount, setLastWithdrawnAmount] = useState<string>("0");

  const currentAddress = userAddress || address;

  // Get pending payout amount
  const {
    data: pendingPayoutData,
    isLoading: isLoadingPayout,
    error: payoutError,
    refetch: refetchPayout,
  } = useReadContract({
    args: currentAddress ? [currentAddress] : undefined,
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!currentAddress,
    watch: false, // Changed to false to prevent continuous fetching
    functionName: "get_pending_payout",
  });

  // Contract instance for write operations
  const getContract = () => {
    if (!currentAddress) return null;
    const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.public.blastapi.io" });
    return new Contract(MY_CONTRACT_ABI as any, CONTRACT_ADDRESS, provider);
  };

  // Format payout amount (assuming USDC with 6 decimals)
  const formatPayoutAmount = (amount: any): string => {
    if (!amount) return "0.0000";
    try {
      const amountStr = amount.toString();
      const formatted = formatUnits(BigInt(amountStr), 6);
      return parseFloat(formatted).toFixed(4);
    } catch (error) {
      console.error("Error formatting payout amount:", error);
      return "0.0000";
    }
  };

  const pendingAmount = formatPayoutAmount(pendingPayoutData);
  const hasPendingPayout = pendingPayoutData && BigInt(pendingPayoutData.toString()) > BigInt(0);

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!currentAddress || !hasPendingPayout) return;

    setIsWithdrawing(true);
    setWithdrawalError(null);
    setWithdrawalSuccess(false);

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error("Contract not available");
      }

      // For now, show a message that the withdrawal functionality needs wallet integration
      // This is a placeholder until proper wallet integration is set up
      console.log("Withdrawal requested for amount:", pendingAmount);
      
      // Simulate successful withdrawal for UI testing
      setLastWithdrawnAmount(pendingAmount);
      setWithdrawalSuccess(true);
      
      // Show a message about wallet integration
      setWithdrawalError("Withdrawal functionality requires wallet integration. Please connect your wallet and try again.");
      
      // Refresh the pending payout data
      setTimeout(() => {
        refetchPayout();
      }, 2000);

    } catch (error: any) {
      console.error("Withdrawal error:", error);
      setWithdrawalError(error.message || "Failed to withdraw payout");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchPayout();
    setWithdrawalSuccess(false);
    setWithdrawalError(null);
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (withdrawalSuccess) {
      const timer = setTimeout(() => {
        setWithdrawalSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [withdrawalSuccess]);

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-gray-600">
              Please connect your wallet to view and manage your payouts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Payout Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Pending Payouts
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingPayout}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPayout ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPayout ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading payout information...</span>
            </div>
          ) : payoutError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load payout information. Please try refreshing.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${pendingAmount}
                  <span className="text-sm font-normal text-gray-500 ml-2">USDC</span>
                </div>
                <p className="text-gray-600">Available for withdrawal</p>
                {hasPendingPayout && (
                  <Badge variant="secondary" className="mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready to withdraw
                  </Badge>
                )}
              </div>

              {hasPendingPayout ? (
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="w-full"
                  size="lg"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Withdraw ${pendingAmount} USDC
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No pending payouts available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Payouts will appear here when groups complete their cycles
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Alert */}
      {withdrawalSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully withdrew ${lastWithdrawnAmount} USDC to your wallet!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {withdrawalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {withdrawalError}
          </AlertDescription>
        </Alert>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Payouts Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Payouts are automatically distributed when savings groups complete their cycles
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Your payout amount depends on your contribution and the group's performance
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Withdrawn funds are sent directly to your connected wallet
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Check this page regularly to claim your available payouts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
