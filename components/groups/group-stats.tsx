"use client";

import { Users, DollarSign, Calendar, Star, Clock } from "lucide-react";
import { FormattedGroupDetails } from "@/hooks/use-group-details";
import { useHeldPayouts } from "@/hooks/use-held-payouts";

interface GroupStatsProps {
  groupDetails: FormattedGroupDetails;
}

export default function GroupStats({ groupDetails }: GroupStatsProps) {
  const { heldPayoutsCount, isLoading } = useHeldPayouts(groupDetails.id);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Members</span>
        </div>
        <p className="text-xl font-bold text-blue-900">
          {groupDetails.members}/{groupDetails.maxMembers}
        </p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">Contribution amount</span>
        </div>
        <p className="text-xl font-bold text-green-900">{groupDetails.contribution}</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">Frequency</span>
        </div>
        <p className="text-xl font-bold text-purple-900">{groupDetails.frequency}</p>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-900">Min. Reputation</span>
        </div>
        <p className="text-xl font-bold text-yellow-900">{groupDetails.minReputation}</p>
      </div>
      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-900">Held Payouts</span>
        </div>
        <p className="text-xl font-bold text-orange-900">
          {isLoading ? "..." : heldPayoutsCount}
        </p>
      </div>
    </div>
  );
}
