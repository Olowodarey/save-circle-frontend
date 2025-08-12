"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, AlertCircle } from "lucide-react";
import { FormattedGroupDetails } from "@/hooks/use-group-details";

interface GroupRulesTermsProps {
  groupDetails: FormattedGroupDetails;
}

export default function GroupRulesTerms({ groupDetails }: GroupRulesTermsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Rules & Terms</CardTitle>
        <CardDescription>Important information about this savings group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Payment Rules
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 ml-6">
            <li>• Contributions must be made every {groupDetails.frequency.toLowerCase()}</li>
            <li>• Late payments may result in reputation penalties</li>
            <li>• Payouts are distributed in order of joining</li>
            <li>• All transactions are recorded on the blockchain</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            Membership Requirements
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 ml-6">
            <li>• Minimum reputation score: {groupDetails.minReputation}</li>
            <li>• Must have a verified Starknet wallet</li>
            <li>• Commitment to complete full cycle</li>
            <li>• Follow community guidelines</li>
          </ul>
        </div>

        {groupDetails.locked && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-600" />
              Trust Lock System Active
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 ml-6">
              <li>• Additional tokens locked to demonstrate commitment and build trust</li>
              <li>• Higher lock amounts guarantee early withdrawal priority in emergencies</li>
              <li>• Locked tokens are returned upon successful cycle completion</li>
              <li>• All tokens automatically converted to USDC for consistency</li>
              <li>• Lock volume determines withdrawal priority ranking</li>
            </ul>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Important Notes
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 ml-6">
            <li>• Smart contracts are audited but use at your own risk</li>
            <li>• Group creator has administrative privileges</li>
            <li>• Disputes are resolved through community governance</li>
            <li>• All members must maintain minimum reputation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
