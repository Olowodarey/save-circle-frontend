"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, Loader2, AlertCircle, CheckCircle, Zap, ArrowRightLeft, Sparkles } from "lucide-react";
import { useEnhancedContribution } from "@/hooks/use-enhanced-contribution";
import { useAccount } from "@starknet-react/core";
import { FormattedGroupDetails } from "@/hooks/use-group-details";

interface EnhancedGroupContributionProps {
  groupDetails: FormattedGroupDetails;
  onContributionSuccess?: () => void;
}

export default function EnhancedGroupContribution({ 
  groupDetails, 
  onContributionSuccess 
}: EnhancedGroupContributionProps) {
  const { address, isConnected } = useAccount();
  const { 
    contributeWithToken,
    selectedToken,
    setSelectedToken,
    isProcessing,
    isSwapping,
    currentError,
    clearError,
    supportedTokens
  } = useEnhancedContribution();
  
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if user can contribute
  const canContribute = () => {
    if (!isConnected || !address) return false;
    if (groupDetails.status !== "active") return false;
    if (!groupDetails.isUserMember) return false;
    return true;
  };

  const handleContribution = async () => {
    clearError();
    
    const success = await contributeWithToken({
      groupId: groupDetails.id,
      contributionAmount: groupDetails.contributionAmount.toString(),
      inputToken: selectedToken
    });
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setTimeout(() => {
        onContributionSuccess?.();
      }, 1000);
    }
  };

  const selectedTokenInfo = supportedTokens.find(token => token.symbol === selectedToken);

  if (!canContribute()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Make Contribution
          </CardTitle>
          <CardDescription>
            Contribute to this group's savings pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              {!isConnected && "Please connect your wallet to contribute."}
              {isConnected && !address && "Wallet connection required."}
              {isConnected && address && groupDetails.status !== "active" && "Group must be active to accept contributions."}
              {isConnected && address && groupDetails.status === "active" && !groupDetails.isUserMember && "You must be a group member to contribute."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Premium Badge */}
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Multi-Token
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Make Contribution
        </CardTitle>
        <CardDescription>
          Pay with any supported token - we'll handle the conversion
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contribution Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
          <div>
            <p className="text-sm text-gray-600">Required Amount</p>
            <p className="text-2xl font-bold text-green-600">{groupDetails.contributionAmount.toString()} USDC</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Frequency</p>
            <p className="text-lg font-semibold text-blue-600">{groupDetails.frequency}</p>
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Choose Payment Token
          </label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {supportedTokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol} className="h-16">
                  <div className="flex items-center gap-3 py-2">
                    <span className="text-2xl">{token.icon}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-500">({token.name})</span>
                        {!token.direct && (
                          <Badge variant="outline" className="text-xs">
                            <ArrowRightLeft className="w-3 h-3 mr-1" />
                            Auto-swap
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{token.description}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedToken !== "USDC" && (
            <Alert className="border-blue-200 bg-blue-50">
              <Zap className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Smart Payment:</strong> Your {selectedToken} will be automatically converted to USDC for the group contribution using advanced swap technology.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Payment Flow Visualization */}
        {selectedToken !== "USDC" && (
          <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{selectedTokenInfo?.icon} {selectedToken}</span>
              <ArrowRightLeft className="w-4 h-4 text-gray-400" />
              <span className="font-medium">💵 USDC</span>
              <ArrowRightLeft className="w-4 h-4 text-gray-400" />
              <span className="font-medium">🏦 Group Pool</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {currentError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{currentError}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Success!</strong> Your contribution has been processed and added to the group pool.
            </AlertDescription>
          </Alert>
        )}

        {/* Contribution Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSwapping ? `Swapping ${selectedToken}...` : "Contributing..."}
                </>
              ) : (
                <>
                  {selectedToken === "USDC" ? (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      Contribute {groupDetails.contributionAmount.toString()} USDC
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Pay with {selectedToken}
                    </>
                  )}
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Confirm Smart Payment
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                {selectedToken === "USDC" ? (
                  <div>
                    You are about to contribute <strong>{groupDetails.contributionAmount.toString()} USDC</strong> directly to the group savings pool.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      You are about to make a <strong>smart payment</strong> using {selectedToken}:
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{selectedTokenInfo?.icon}</span>
                        <span>1. Pay with your {selectedToken}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                        <span>2. Auto-convert to USDC</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>3. Add to group pool</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Final contribution: <strong>{groupDetails.contributionAmount.toString()} USDC</strong>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-3">
                  This action cannot be undone.
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleContribution}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {selectedToken === "USDC" ? "Contribute Now" : `Smart Pay with ${selectedToken}`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Payment Method Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          {selectedToken === "USDC" ? (
            <div>Direct USDC contribution to group pool</div>
          ) : (
            <div>
              <div>Powered by Advanced Swap Technology</div>
              <div className="text-blue-600">{selectedToken} → USDC conversion</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
