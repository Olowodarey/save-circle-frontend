"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGroupAnalytics } from "@/hooks/use-group-analytics";
import { InsurancePoolDisplay } from "@/components/groups/insurance-pool-display"
import { 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GroupAnalyticsProps {
  groupId: string | number;
  className?: string;
}

export default function GroupAnalytics({ groupId, className }: GroupAnalyticsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  
  const {
    lockedFunds,
    deadline,
    isLoading,
    isLoadingLockedFunds,
    isLoadingDeadline,
    lockedFundsError,
    deadlineError,
    refetchAll,
  } = useGroupAnalytics(groupId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchAll();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Group Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasError = lockedFundsError || deadlineError;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Group Analytics
            </CardTitle>
            <CardDescription>
              Real-time group financial data and deadlines
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
    

        {/* Locked Funds Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Locked Funds</h3>
          </div>
          
          {isLoadingLockedFunds ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading locked funds...</span>
            </div>
          ) : lockedFunds ? (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-800">Total Locked</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${Number(lockedFunds.totalAmount) / Math.pow(10, 6)} USDC
                  </span>
                </div>
              </div>
                            <div className="space-y-3">
               
                
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {lockedFunds.userContributions.map((contribution, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                              🔒
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 text-sm">
                                Locked Funds User #{index + 1}
                              </div>
                              <div className="font-mono text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                {contribution.userAddress.slice(0, 10)}...{contribution.userAddress.slice(-8)}
                              </div>
                            </div>
                          </div>
                          <div className="ml-13 space-y-1">
                            <div className="text-xs text-gray-600">
                              <strong>Full Wallet Address:</strong>
                            </div>
                            <div className="text-xs font-mono text-gray-700 bg-white p-2 rounded border break-all">
                              {contribution.userAddress}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Locked Amount
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${contribution.formattedAmount}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            USDC
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No locked funds data available
            </div>
          )}
        </div>

        <Separator />

        {/* Deadline Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Your Contribution Deadline</h3>
          </div>
          
          {isLoadingDeadline ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading deadline...</span>
            </div>
          ) : deadline ? (
            <div className="space-y-3">
              <div className={`p-4 border rounded-lg ${
                deadline.isOverdue 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Deadline</span>
                  <span className="font-mono text-sm">
                    {deadline.formattedDeadline}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium">Time Remaining</span>
                  <div className="flex items-center gap-2">
                    {deadline.isOverdue ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <Badge variant={deadline.isOverdue ? "destructive" : "default"}>
                      {deadline.formattedTimeRemaining}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {deadline.isOverdue && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium text-sm">Payment Overdue</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Your contribution deadline has passed. Please make your payment as soon as possible.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No deadline information available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Insurance Pool Analytics Component
export function GroupAnalyticsWithInsurance({ groupId, className }: GroupAnalyticsProps) {
  return (
    <div className="space-y-4">
      <GroupAnalytics groupId={groupId} className={className} />
      <InsurancePoolDisplay groupId={groupId} />
    </div>
  );
}

// Compact version for smaller spaces
export function GroupAnalyticsCompact({ groupId, className }: GroupAnalyticsProps) {
  const { lockedFunds, deadline, isLoading } = useGroupAnalytics(groupId);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {lockedFunds && (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">
            ${Number(lockedFunds.totalAmount) / Math.pow(10, 6)} locked
          </span>
        </div>
      )}
      
      {deadline && (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-blue-600" />
          <Badge 
            variant={deadline.isOverdue ? "destructive" : "secondary"}
            className="text-xs"
          >
            {deadline.formattedTimeRemaining}
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-1">
       <InsurancePoolDisplay groupId={groupId} />
      </div>
    </div>
  );
}
