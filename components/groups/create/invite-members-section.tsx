"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, X } from "lucide-react";

interface InviteMembersSectionProps {
  inviteEmails: string[];
  currentEmail: string;
  onCurrentEmailChange: (email: string) => void;
  onAddEmail: () => void;
  onRemoveEmail: (email: string) => void;
}

export default function InviteMembersSection({
  inviteEmails,
  currentEmail,
  onCurrentEmailChange,
  onAddEmail,
  onRemoveEmail
}: InviteMembersSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onAddEmail();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-blue-600" />
        <Label className="font-medium">Invite Members</Label>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter wallet address or email"
          value={currentEmail}
          onChange={(e) => onCurrentEmailChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={onAddEmail} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {inviteEmails.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Invited Members:</Label>
          <div className="flex flex-wrap gap-2">
            {inviteEmails.map((email) => (
              <Badge key={email} variant="secondary" className="flex items-center gap-1">
                {email}
                <button onClick={() => onRemoveEmail(email)} className="ml-1 hover:text-red-600">
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
