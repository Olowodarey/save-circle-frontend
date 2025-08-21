"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, X } from "lucide-react";

interface InviteMembersSectionProps {
  invitedMembers: string[];
  currentAddress: string;
  setCurrentAddress: (address: string) => void;
  addAddress: () => void;
  removeAddress: (address: string) => void;
}

export default function InviteMembersSection({
  invitedMembers,
  currentAddress,
  setCurrentAddress,
  addAddress,
  removeAddress
}: InviteMembersSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addAddress();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-blue-600" />
        <Label className="font-medium">Invite Members</Label>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter Starknet wallet address (0x...)"
          value={currentAddress}
          onChange={(e) => setCurrentAddress(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={addAddress} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {invitedMembers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Invited Members:</Label>
          <div className="flex flex-wrap gap-2">
            {invitedMembers.map((address) => (
              <Badge key={address} variant="secondary" className="flex items-center gap-1">
                <span className="font-mono text-xs">{address.slice(0, 6)}...{address.slice(-4)}</span>
                <button onClick={() => removeAddress(address)} className="ml-1 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
