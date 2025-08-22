"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleUsdcContribution } from "@/components/groups/simple-usdc-contribution"
import { EnhancedContribution } from "@/components/groups/enhanced-contribution"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupContributionProps {
  groupDetails: FormattedGroupDetails
  onContributionSuccess?: () => void
}

export default function GroupContribution({ 
  groupDetails, 
  onContributionSuccess 
}: GroupContributionProps) {
  const [activeTab, setActiveTab] = useState("direct")

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct">Direct</TabsTrigger>
          <TabsTrigger value="autoswap">AutoSwap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="direct" className="mt-6">
          <SimpleUsdcContribution 
            groupDetails={groupDetails}
            onSuccess={onContributionSuccess}
          />
        </TabsContent>
        
        <TabsContent value="autoswap" className="mt-6">
          <EnhancedContribution 
            groupDetails={groupDetails}
            onSuccess={onContributionSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
