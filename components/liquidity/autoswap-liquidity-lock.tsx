"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, Info } from "lucide-react";
import { useEnhancedLiquidityLock } from "@/hooks/use-enhanced-liquidity-lock";

interface AutoswapLiquidityLockProps {
  groupId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AutoswapLiquidityLock({
  groupId,
  onSuccess,
  onError,
}: AutoswapLiquidityLockProps) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"USDC" | "STRK" | "ETH" | "USDT">("USDC");
  const [showSwapPreview, setShowSwapPreview] = useState(false);

  const {
    lockLiquidityWithAutoswap,
    getSwapPreview,
    isLocking,
    lockError,
    swapPreview,
    clearLockError,
    clearSwapPreview,
    supportedTokens,
    lockedBalance,
    isLoadingBalance,
  } = useEnhancedLiquidityLock();

  // Get swap preview when token or amount changes
  useEffect(() => {
    if (amount && selectedToken !== "USDC" && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        getSwapPreview(selectedToken, amount);
        setShowSwapPreview(true);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timer);
    } else {
      clearSwapPreview();
      setShowSwapPreview(false);
    }
  }, [amount, selectedToken, getSwapPreview, clearSwapPreview]);

  const handleLockLiquidity = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      onError?.("Please enter a valid amount");
      return;
    }

    try {
      const success = await lockLiquidityWithAutoswap({
        groupId,
        amount,
        tokenType: selectedToken,
        enableAutoswap: selectedToken !== "USDC",
      });

      if (success) {
        onSuccess?.();
        setAmount("");
        clearSwapPreview();
      } else if (lockError) {
        onError?.(lockError);
      }
    } catch (error: any) {
      onError?.(error.message || "Failed to lock liquidity");
    }
  };

  const isSwapRequired = selectedToken !== "USDC";
  const canProceed = amount && parseFloat(amount) > 0 && !isLocking;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Lock Liquidity
          {isLoadingBalance && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        {lockedBalance !== "0" && (
          <p className="text-sm text-muted-foreground">
            Current locked balance: {lockedBalance} USDC
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <Label htmlFor="token-select">Select Token</Label>
          <Select
            value={selectedToken}
            onValueChange={(value) => {
              setSelectedToken(value as typeof selectedToken);
              clearLockError();
            }}
          >
            <SelectTrigger id="token-select">
              <SelectValue placeholder="Choose token" />
            </SelectTrigger>
            <SelectContent>
              {supportedTokens.map((token) => (
                <SelectItem key={token} value={token}>
                  {token}
                  {token === "USDC" && " (Direct)"}
                  {token !== "USDC" && " (Auto-swap to USDC)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({selectedToken})</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Enter ${selectedToken} amount`}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearLockError();
            }}
            min="0"
            step="0.000001"
          />
        </div>

        {/* Swap Preview */}
        {isSwapRequired && showSwapPreview && swapPreview && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Swap Preview:</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>{swapPreview.inputAmount} {swapPreview.inputToken}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>{swapPreview.outputAmount} {swapPreview.outputToken}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your {selectedToken} will be automatically swapped to USDC before locking
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Auto-swap Info */}
        {isSwapRequired && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Auto-swap enabled:</strong> Your {selectedToken} will be automatically 
                converted to USDC using the AutoSwap Protocol before locking liquidity.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {lockError && (
          <Alert variant="destructive">
            <AlertDescription>{lockError}</AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          onClick={handleLockLiquidity}
          disabled={!canProceed}
          className="w-full"
          size="lg"
        >
          {isLocking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSwapRequired ? "Swapping & Locking..." : "Locking..."}
            </>
          ) : (
            <>
              {isSwapRequired ? `Swap ${selectedToken} & Lock Liquidity` : "Lock Liquidity"}
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Locked liquidity helps secure the group and builds trust</p>
          <p>• You can withdraw your locked liquidity when the group cycle ends</p>
          {isSwapRequired && (
            <p>• Auto-swap uses the AutoSwap Protocol for best rates</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
