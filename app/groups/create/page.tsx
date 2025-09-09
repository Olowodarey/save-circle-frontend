"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "@starknet-react/core"
import { useGroupContract } from "@/hooks/use-group-contract"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import GroupTypeSelector from "@/components/groups/create/group-type-selector"
import PublicGroupForm from "@/components/groups/create/public-group-form"
import PrivateGroupForm from "@/components/groups/create/private-group-form"
import TokenSupportInfo from "@/components/groups/create/token-support-info"
import CreateGroupActions from "@/components/groups/create/create-group-actions"

export default function CreateGroupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { account } = useAccount()
  const {
    createPublicGroup,
    createPrivateGroup,
    isCreating,
    resetState,
    isConnected,
  } = useGroupContract()

  const [groupType, setGroupType] = useState<"public" | "private">("public")
  const [lockEnabled, setLockEnabled] = useState(false)
  const [invitedMembers, setInvitedMembers] = useState<string[]>([])
  const [currentAddress, setCurrentAddress] = useState("")
  const [selectedToken, setSelectedToken] = useState("usdc")
  const [lockAmount, setLockAmount] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    maxMembers: "",
    contributionAmount: "",
    cycleDuration: "1",
    cycleUnit: "days",
    minReputation: "0",
  })

  const supportedTokens = [
    { value: "usdc", label: "USDC", icon: "💵" },
    { value: "eth", label: "ETH", icon: "⟠" },
    { value: "strk", label: "STRK", icon: "🔺" },
    { value: "usdt", label: "USDT", icon: "₮" },
    { value: "dai", label: "DAI", icon: "◈" },
    { value: "wbtc", label: "WBTC", icon: "₿" },
  ]

  const addAddress = () => {
    if (currentAddress && !invitedMembers.includes(currentAddress)) {
      // Basic validation for Starknet addresses
      if (!currentAddress.startsWith('0x') || currentAddress.length < 10) {
        toast({
          title: "Invalid Address",
          description: "Please enter a valid Starknet wallet address starting with 0x",
          variant: "destructive",
        })
        return
      }
      setInvitedMembers([...invitedMembers, currentAddress])
      setCurrentAddress("")
    }
  }

  const removeAddress = (address: string) => {
    setInvitedMembers(invitedMembers.filter((a) => a !== address))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { groupName, maxMembers, contributionAmount, cycleDuration, cycleUnit } = formData
    
    if (!groupName.trim()) {
      toast({ title: "Error", description: "Group name is required", variant: "destructive" })
      return false
    }
    
    if (!maxMembers || parseInt(maxMembers) < 2) {
      toast({ title: "Error", description: "Minimum 2 members required", variant: "destructive" })
      return false
    }
    
    if (groupType === "public" && parseInt(maxMembers) > 100) {
      toast({ title: "Error", description: "Maximum 100 members for public groups", variant: "destructive" })
      return false
    }
    
    if (groupType === "private" && parseInt(maxMembers) > 50) {
      toast({ title: "Error", description: "Maximum 50 members for private groups", variant: "destructive" })
      return false
    }
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({ title: "Error", description: "Valid contribution amount is required", variant: "destructive" })
      return false
    }
    
    if (!cycleDuration || parseInt(cycleDuration) < 1) {
      toast({ title: "Error", description: "Cycle duration must be at least 1", variant: "destructive" })
      return false
    }
    
    if (!cycleUnit) {
      toast({ title: "Error", description: "Cycle unit is required", variant: "destructive" })
      return false
    }
    
    if (groupType === "private" && invitedMembers.length === 0) {
      toast({
        title: "Missing invitations",
        description: "Please invite at least one member to your private group.",
        variant: "destructive",
      })
      return false
    }
    
    return true
  }

  const handleCreateGroup = async () => {
    if (!isConnected || !account) {
      toast({ 
        title: "Wallet Connection Error", 
        description: "Please ensure your wallet is properly connected and try again.", 
        variant: "destructive" 
      })
      return
    }

    if (!validateForm()) return

    try {
      resetState()
      
      const groupParams = {
        groupName: formData.groupName,
        description: formData.description,
        maxMembers: formData.maxMembers,
        contributionAmount: formData.contributionAmount,
        cycleDuration: formData.cycleDuration,
        cycleUnit: formData.cycleUnit,
        lockEnabled,
        lockAmount,
        selectedToken,
      }

      let result
      if (groupType === "public") {
        result = await createPublicGroup({
          ...groupParams,
          minReputation: formData.minReputation,
        })
      } else {
        result = await createPrivateGroup({
          ...groupParams,
          minReputation: formData.minReputation,
          invitedMembers,
        })
      }

      if (result?.transaction_hash) {
        toast({
          title: "Success!",
          description: `Group created successfully! Transaction: ${result.transaction_hash.slice(0, 10)}...`,
        })
        
        // Redirect to groups page after a short delay
        setTimeout(() => {
          router.push("/groups")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error creating group:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create group. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
   

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Savings Group</h1>
          <p className="text-gray-600">Set up a new savings circle for your community</p>
        </div>

        <Tabs
          value={groupType}
          onValueChange={(value) => setGroupType(value as "public" | "private")}
          className="space-y-6"
        >
          <GroupTypeSelector groupType={groupType} onGroupTypeChange={setGroupType} />

          <TabsContent value="public" className="space-y-6">
            <PublicGroupForm
              formData={formData}
              onInputChange={handleInputChange}
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              supportedTokens={supportedTokens}
              lockEnabled={lockEnabled}
              onLockEnabledChange={setLockEnabled}
              lockAmount={lockAmount}
              onLockAmountChange={setLockAmount}
            />
          </TabsContent>

          <TabsContent value="private" className="space-y-6">
            <PrivateGroupForm
              formData={formData}
              onInputChange={handleInputChange}
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              supportedTokens={supportedTokens}
              lockEnabled={lockEnabled}
              onLockEnabledChange={setLockEnabled}
              lockAmount={lockAmount}
              onLockAmountChange={setLockAmount}
              invitedMembers={invitedMembers}
              currentAddress={currentAddress}
              setCurrentAddress={setCurrentAddress}
              addAddress={addAddress}
              removeAddress={removeAddress}
            />
          </TabsContent>
        </Tabs>

        <TokenSupportInfo supportedTokens={supportedTokens} />

        <CreateGroupActions
          isCreating={isCreating}
          isConnected={isConnected ?? false}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </div>
  )
}
