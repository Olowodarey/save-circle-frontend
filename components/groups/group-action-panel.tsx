"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { FormattedGroupDetails } from "@/hooks/use-group-details";
import GroupActivationButton from "./group-activation-button";
import JoinGroupButton from "./joingroupbutton";

interface GroupActionPanelProps {
  groupDetails: FormattedGroupDetails;
  loading: boolean;
  onRefetch: () => void;
}

export default function GroupActionPanel({ 
  groupDetails, 
  loading, 
  onRefetch 
}: GroupActionPanelProps) {
  return (
    <div className="lg:w-80 space-y-4">
      {/* Group Activation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Group Management</CardTitle>
          <CardDescription>
            Activate this group to start contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GroupActivationButton 
            groupDetails={groupDetails}
            onActivationSuccess={onRefetch}
          />
          
          {/* Debug Refresh Button */}
          <Button 
            variant="outline" 
            onClick={onRefetch} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Force Refresh Status
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Join Group Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Join This Group</CardTitle>
          <CardDescription>
            {groupDetails.userCanJoin
              ? "You meet all requirements to join this group"
              : "You don't meet the requirements to join this group"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <JoinGroupButton 
            groupDetails={groupDetails}
            onJoinSuccess={onRefetch}
          />

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Created by:</span>
              <span className="font-medium">{groupDetails.creator.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">{new Date(groupDetails.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Group Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Group Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created by:</span>
            <span className="font-medium">{groupDetails.creator.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">{new Date(groupDetails.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={groupDetails.status === "active" ? "default" : "secondary"}
                className={groupDetails.status === "active" ? "bg-green-100 text-green-800 border-green-200" : ""}
              >
                {groupDetails.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
                {groupDetails.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefetch}
                disabled={loading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          {groupDetails.status === "active" && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Next Payout:</span>
              <span className="font-medium">{groupDetails.nextPayoutDate}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
