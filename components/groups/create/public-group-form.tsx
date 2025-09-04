"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import TrustLockSection from "./trust-lock-section";

interface FormData {
  groupName: string;
  description: string;
  maxMembers: string;
  contributionAmount: string;
  frequency: string;
  minReputation: string;
}

interface PublicGroupFormProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  selectedToken: string;
  onTokenChange: (token: string) => void;
  supportedTokens: Array<{ value: string; label: string; icon: string }>;
  lockEnabled: boolean;
  onLockEnabledChange: (enabled: boolean) => void;
  lockAmount: string;
  onLockAmountChange: (amount: string) => void;
}

export default function PublicGroupForm({
  formData,
  onInputChange,
  selectedToken,
  onTokenChange,
  supportedTokens,
  lockEnabled,
  onLockEnabledChange,
  lockAmount,
  onLockAmountChange
}: PublicGroupFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Public Group Settings
        </CardTitle>
        <CardDescription>
          Create a public group that anyone can join based on reputation criteria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input 
              id="groupName" 
              placeholder="e.g., Crypto Enthusiasts Circle" 
              value={formData.groupName}
              onChange={(e) => onInputChange("groupName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <Input 
              id="maxMembers" 
              type="number" 
              placeholder="Enter max members (2-100)" 
              min="2" 
              max="100" 
              value={formData.maxMembers}
              onChange={(e) => onInputChange("maxMembers", e.target.value)}
            />
            <p className="text-sm text-gray-500">Minimum 2 members, maximum 100 members</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your group's purpose and goals..."
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contribution">Contribution Amount</Label>
            <div className="space-y-2">
              <Input 
                id="contribution" 
                placeholder="100" 
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
            <Label htmlFor="frequency">Payment Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => onInputChange("frequency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minReputation">Minimum Reputation</Label>
            <Select value={formData.minReputation} onValueChange={(value) => onInputChange("minReputation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select minimum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No minimum (0)</SelectItem>
                <SelectItem value="25">Beginner (25+)</SelectItem>
                <SelectItem value="50">Intermediate (50+)</SelectItem>
                <SelectItem value="75">Advanced (75+)</SelectItem>
                <SelectItem value="90">Expert (90+)</SelectItem>
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
          isPrivate={false}
        />
      </CardContent>
    </Card>
  );
}
