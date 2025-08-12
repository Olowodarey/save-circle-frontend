"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Info } from "lucide-react";

interface TrustLockSectionProps {
  lockEnabled: boolean;
  onLockEnabledChange: (enabled: boolean) => void;
  lockAmount: string;
  onLockAmountChange: (amount: string) => void;
  selectedToken: string;
  onTokenChange: (token: string) => void;
  supportedTokens: Array<{ value: string; label: string; icon: string }>;
  isPrivate?: boolean;
}

export default function TrustLockSection({
  lockEnabled,
  onLockEnabledChange,
  lockAmount,
  onLockAmountChange,
  selectedToken,
  onTokenChange,
  supportedTokens,
  isPrivate = false
}: TrustLockSectionProps) {
  const lockId = isPrivate ? "privateLockToggle" : "lockToggle";
  const lockAmountId = isPrivate ? "privateLockAmount" : "lockAmount";

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <Label htmlFor={lockId} className="font-medium">
              Enable Trust Lock System
            </Label>
          </div>
          <p className="text-sm text-gray-600">
            Lock additional tokens to build trust and guarantee early withdrawal rights
          </p>
        </div>
        <Switch id={lockId} checked={lockEnabled} onCheckedChange={onLockEnabledChange} />
      </div>

      {lockEnabled && (
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={lockAmountId}>Lock Amount (Optional)</Label>
              <div className="flex">
                <Input
                  id={lockAmountId}
                  placeholder="0"
                  value={lockAmount}
                  onChange={(e) => onLockAmountChange(e.target.value)}
                  className="rounded-r-none"
                />
                <Select value={selectedToken} onValueChange={onTokenChange}>
                  <SelectTrigger className="w-32 rounded-l-none border-l-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedTokens.map((token) => (
                      <SelectItem key={token.value} value={token.value}>
                        <div className="flex items-center gap-2">
                          <span>{token.icon}</span>
                          <span>{token.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{isPrivate ? "Trust Benefits" : "Lock Benefits"}</Label>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>{isPrivate ? "Emergency withdrawal priority" : "Higher lock = Early withdrawal priority"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>{isPrivate ? "Demonstrates commitment" : "Builds trust with other members"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>{isPrivate ? "Higher group reputation" : "Unlocks premium group features"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {isPrivate ? "Private Group Lock Benefits:" : "How Trust Lock Works:"}
                </p>
                <ul className="space-y-1 text-xs">
                  {isPrivate ? (
                    <>
                      <li>• Higher locks provide emergency withdrawal guarantees</li>
                      <li>• Shows serious commitment to invited members</li>
                      <li>• Locked tokens earn reputation bonuses</li>
                      <li>• All conversions handled automatically via DEX integration</li>
                    </>
                  ) : (
                    <>
                      <li>• Lock additional tokens beyond your contribution to demonstrate commitment</li>
                      <li>• Higher lock amounts guarantee early withdrawal rights in emergencies</li>
                      <li>• Locked tokens are returned when you complete the full cycle</li>
                      <li>• All tokens are automatically converted to USDC for consistency</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
