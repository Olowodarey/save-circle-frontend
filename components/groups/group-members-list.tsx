"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { FormattedGroupDetails, FormattedMember } from "@/hooks/use-group-details";

interface GroupMembersListProps {
  groupDetails: FormattedGroupDetails;
  members: FormattedMember[];
}

export default function GroupMembersList({ groupDetails, members }: GroupMembersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Members</CardTitle>
        <CardDescription>Current members and their payment status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={member.address} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.isCreator && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{member.name}</h4>
                    {member.isCreator && (
                      <Badge variant="outline" className="text-xs">
                        Creator
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-mono">{member.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{member.reputation} reputation</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Position #{member.position}</p>
                  <Badge
                    variant={member.paymentStatus === "paid" ? "default" : "secondary"}
                    className={
                      member.paymentStatus === "paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                    }
                  >
                    {member.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
