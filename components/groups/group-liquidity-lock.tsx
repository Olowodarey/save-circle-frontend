"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimpleUsdcLock } from "@/components/liquidity/simple-usdc-lock"
import { EnhancedLiquidityLock } from "@/components/liquidity/enhanced-liquidity-lock"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupLiquidityLockProps {
  groupDetails: FormattedGroupDetails
  onLockSuccess?: () => void
}

export default function GroupLiquidityLock({ 
  groupDetails, 
  onLockSuccess 
}: GroupLiquidityLockProps) {
  const [activeTab, setActiveTab] = useState("direct")

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="direct">Direct</TabsTrigger>
          <TabsTrigger value="autoswap">AutoSwap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="direct" className="mt-6">
          <SimpleUsdcLock 
            groupId={groupDetails.id}
            onSuccess={onLockSuccess}
          />
        </TabsContent>
        
        <TabsContent value="autoswap" className="mt-6">
          <EnhancedLiquidityLock 
            groupId={groupDetails.id}
            onSuccess={onLockSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
