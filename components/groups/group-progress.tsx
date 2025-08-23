"use client";

import { Progress } from "@/components/ui/progress";
import { FormattedGroupDetails } from "@/hooks/use-group-details";

interface GroupProgressProps {
  groupDetails: FormattedGroupDetails;
}

export default function GroupProgress({ groupDetails }: GroupProgressProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Group Progress</span>
          <span className="text-sm text-gray-600">
            Cycle {groupDetails.currentCycle} of {groupDetails.totalCycles}
          </span>
        </div>
        <Progress value={(groupDetails.currentCycle / groupDetails.totalCycles) * 100} />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Next payout: {groupDetails.nextPayoutDate}</span>
        {/* <span>Total pool: {groupDetails.totalPoolAmount}</span> */}
      </div>
    </div>
  );
}
