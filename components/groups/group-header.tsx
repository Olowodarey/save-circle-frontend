"use client";

import { Badge } from "@/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import { FormattedGroupDetails } from "@/hooks/use-group-details";

interface GroupHeaderProps {
  groupDetails: FormattedGroupDetails;
}

export default function GroupHeader({ groupDetails }: GroupHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{groupDetails.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Globe className="w-3 h-3 mr-1" />
              {groupDetails.type}
            </Badge>
            {groupDetails.locked && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
            <Badge variant={groupDetails.status === "active" ? "default" : "secondary"}>
              {groupDetails.status}
            </Badge>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{groupDetails.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {groupDetails.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
