"use client";

import { FormattedGroupDetails } from "@/hooks/use-group-details";
import DeadlinePenaltyManager from "./deadline-penalty-manager";


interface PenaltyPayoutManagementProps {
  groupId: string;
  groupDetails: FormattedGroupDetails;
}

export default function PenaltyPayoutManagement({ 
  groupId, 
  groupDetails 
}: PenaltyPayoutManagementProps) {
  return (
    <div className="space-y-8">
      {/* Deadline & Penalty Management Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Deadline & Penalty Management</h2>
        <DeadlinePenaltyManager groupId={groupId} />
      </div>

   
    </div>
  );
}
