"use client"

import { SimpleUsdcLock } from "@/components/liquidity/simple-usdc-lock"
import { FormattedGroupDetails } from "@/hooks/use-group-details"

interface GroupLiquidityLockProps {
  groupDetails: FormattedGroupDetails
  onLockSuccess?: () => void
}

export default function GroupLiquidityLock({ 
  groupDetails, 
  onLockSuccess 
}: GroupLiquidityLockProps) {
  return (
    <SimpleUsdcLock 
      groupId={groupDetails.id}
      onSuccess={onLockSuccess}
    />
  )
}
