"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import TrustLockSection from "./trust-lock-section";
import InviteMembersSection from "./invite-members-section";

interface FormData {
  groupName: string;
  description: string;
  maxMembers: string;
  contributionAmount: string;
  frequency: string;
  minReputation: string;
}

interface PrivateGroupFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  selectedToken: string;
  onTokenChange: (token: string) => void;
  supportedTokens: Array<{ value: string; label: string; icon: string }>;
  lockEnabled: boolean;
  onLockEnabledChange: (enabled: boolean) => void;
  lockAmount: string;
  onLockAmountChange: (amount: string) => void;
  invitedMembers: string[];
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  addAddress: () => void;
  removeAddress: (address: string) => void;
}

export default function PrivateGroupForm({
  formData,
  onInputChange,
  selectedToken,
  onTokenChange,
  supportedTokens,
  lockEnabled,
  onLockEnabledChange,
  lockAmount,
  onLockAmountChange,
  invitedMembers,
  currentAddress,
  setCurrentAddress,
  addAddress,
  removeAddress
}: PrivateGroupFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          Private Group Settings
        </CardTitle>
        <CardDescription>Create an invitation-only group for selected members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="privateGroupName">Group Name</Label>
            <Input 
              id="privateGroupName" 
              placeholder="e.g., Private Investors Circle" 
              value={formData.groupName}
              onChange={(e) => onInputChange("groupName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privateMaxMembers">Maximum Members</Label>
            <Input
              id="privateMaxMembers"
              type="number"
              placeholder="Enter max members (2-50)"
              min="2"
              max="50"
              value={formData.maxMembers}
              onChange={(e) => onInputChange("maxMembers", e.target.value)}
            />
            <p className="text-sm text-gray-500">Minimum 2 members, maximum 50 members for private groups</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privateDescription">Description</Label>
          <Textarea
            id="privateDescription"
            placeholder="Describe your private group's purpose..."
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="privateContribution">Contribution Amount</Label>
            <div className="flex">
              <Input 
                id="privateContribution" 
                placeholder="500" 
                className="rounded-r-none" 
                value={formData.contributionAmount}
                onChange={(e) => onInputChange("contributionAmount", e.target.value)}
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
            <p className="text-xs text-gray-500">
              {selectedToken !== "usdc" && "Will be automatically converted to USDC"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="privateFrequency">Payment Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => onInputChange("frequency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TrustLockSection
          lockEnabled={lockEnabled}
          onLockEnabledChange={onLockEnabledChange}
          lockAmount={lockAmount}
          onLockAmountChange={onLockAmountChange}
          selectedToken={selectedToken}
          onTokenChange={onTokenChange}
          supportedTokens={supportedTokens}
          isPrivate={true}
        />

        <InviteMembersSection
          invitedMembers={invitedMembers}
          currentAddress={currentAddress}
          setCurrentAddress={setCurrentAddress}
          addAddress={addAddress}
          removeAddress={removeAddress}
        />
      </CardContent>
    </Card>
  );
}
