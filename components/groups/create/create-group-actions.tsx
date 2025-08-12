"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CreateGroupActionsProps {
  isCreating: boolean;
  isConnected: boolean;
  onCreateGroup: () => void;
}

export default function CreateGroupActions({ isCreating, isConnected, onCreateGroup }: CreateGroupActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button variant="outline" asChild>
        <Link href="/groups">Cancel</Link>
      </Button>
      <Button 
        className="px-8" 
        onClick={onCreateGroup}
        disabled={isCreating || !isConnected}
      >
        {isCreating ? "Creating..." : "Create Group"}
      </Button>
    </div>
  );
}
