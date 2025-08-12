"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lock } from "lucide-react";

interface GroupTypeSelectorProps {
  groupType: "public" | "private";
  onGroupTypeChange: (type: "public" | "private") => void;
}

export default function GroupTypeSelector({ groupType, onGroupTypeChange }: GroupTypeSelectorProps) {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="public" className="flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Public Group
      </TabsTrigger>
      <TabsTrigger value="private" className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Private Group
      </TabsTrigger>
    </TabsList>
  );
}
