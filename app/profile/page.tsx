"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Edit,
  ArrowLeft,
  Loader2,
  TrendingUp,
  DollarSign,
  Users as UsersIcon,
  Shield,
  Activity,
  LucideIcon,
} from "lucide-react";

// Define types for the activity data
interface ActivityItem {
  type: string;
  description: string;
  amount: string;
  date: string;
  icon: LucideIcon;
  color: string;
}

import Link from "next/link";
import { useAccount, useReadContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

// Import new components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileActivity from "@/components/profile/ProfileActivity";
import ProfileStatistics from "@/components/profile/ProfileStatistics";
import MyGroupsJoined from "@/components/profile/MyGroupsJoined";
import ProfilePayouts from "@/components/profile/ProfilePayouts";

// Utility function to convert felt252 (hex) to string
function felt252ToString(felt: any): string {
  if (!felt) return '';
  
  try {
    // Convert to string if it's not already
    const hexString = felt.toString();
    
    // Remove '0x' prefix if present
    const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    
    // Convert hex to bytes
    const bytes = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      const byte = parseInt(cleanHex.substr(i, 2), 16);
      if (byte !== 0) { // Skip null bytes
        bytes.push(byte);
      }
    }
    
    // Convert bytes to string
    return String.fromCharCode(...bytes);
  } catch (error) {
    console.error('Error converting felt252 to string:', error);
    return '';
  }
}

// Alternative using TextDecoder (more robust for UTF-8)
function felt252ToStringAlt(felt: any): string {
  if (!felt) return '';
  
  try {
    const hexString = felt.toString();
    const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    
    // Convert hex string to Uint8Array
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    
    // Remove trailing null bytes
    let endIndex = bytes.length;
    while (endIndex > 0 && bytes[endIndex - 1] === 0) {
      endIndex--;
    }
    
    // Decode to string
    const decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    return decoder.decode(bytes.slice(0, endIndex));
  } catch (error) {
    console.error('Error converting felt252 to string:', error);
    return '';
  }
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // User Profile Data
  const {
    data: contractProfileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useReadContract({
    args: address ? [address] : undefined,
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_profile",
  });

  // User Activities Data
  const {
    data: userActivities,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useReadContract({
    args: address ? [address, 20] : undefined, // Get last 20 activities
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_activities",
  });

  // User Statistics Data
  const {
    data: userStatistics,
    isLoading: isLoadingStatistics,
    error: statisticsError,
  } = useReadContract({
    args: address ? [address] : undefined,
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_statistics",
  });

  // User Joined Groups Data
  const {
    data: userJoinedGroups,
    isLoading: isLoadingJoinedGroups,
    error: joinedGroupsError,
  } = useReadContract({
    args: address ? [address] : undefined,
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_joined_groups",
  });

  // User's Locked Balance
  const {
    data: lockedBalance,
    isLoading: isLoadingLockedBalance,
    error: lockedBalanceError,
  } = useReadContract({
    args: address ? [address] : undefined,
    abi: MY_CONTRACT_ABI as any,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_locked_balance",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "/placeholder.svg?height=120&width=120",
    walletAddress: address || "",
    isRegistered: false,
    totalLockAmount: 0,
    profileCreatedAt: "",
    reputationScore: 0,
    totalContribution: 0,
    totalJoinedGroups: 0,
    totalCreatedGroups: 0,
    totalEarned: 0,
    completedCycles: 0,
    activeGroups: 0,
    onTimePayments: 0,
    totalPayments: 0,
    paymentRate: 0,
    averageContribution: 0,
  });

  const [analytics, setAnalytics] = useState({
    totalSaved: 0,
    activeGroups: 0,
    completedCycles: 0,
    totalEarned: 0,
    averageContribution: 0,
    onTimePayments: 0,
    totalPayments: 0,
    joinedGroups: 0,
    createdGroups: 0,
    successRate: 0,
    lockedAmount: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  // Update profile data when contract data changes
  useEffect(() => {
    if (contractProfileData && address) {
      console.log('Raw contract profile data:', contractProfileData);
      
      const formatU256 = (value: any) => {
        if (!value || value === '0x0' || value === '0') return 0;
        try {
          // Handle both object format (low/high) and direct string/number
          if (typeof value === 'object' && value !== null) {
            // Handle Uint256 with low/high fields
            const low = BigInt(value.low || 0);
            const high = BigInt(value.high || 0);
            const bigValue = (high << BigInt(128)) + low;
            return Number(bigValue) / 1e6; // Convert to USDC (6 decimals)
          } else {
            // Handle direct number/string
            const numValue = typeof value === 'string' ? 
              (value.startsWith('0x') ? parseInt(value, 16) : parseFloat(value)) : 
              Number(value);
            return numValue / 1e6; // Convert to USDC (6 decimals)
          }
        } catch (e) {
          console.error('Error formatting U256 value:', e, value);
          return 0;
        }
      };

      // Extract data from contract response
      const rawData = Array.isArray(contractProfileData) ? 
        contractProfileData[0] : contractProfileData;
      
      // Debug log the raw data structure
      console.log('Processed contract data:', rawData);

      // Create profile data object with proper fallbacks
      const contractData = {
        name: felt252ToString(rawData.name) || `User ${address.slice(0, 6)}`,
        avatar: rawData.avatar || "/placeholder.svg?height=120&width=120",
        walletAddress: address,
        isRegistered: rawData.is_registered || false,
        totalLockAmount: formatU256(rawData.total_lock_amount || 0),
        profileCreatedAt: rawData.profile_created_at
          ? new Date(Number(rawData.profile_created_at) * 1000).toLocaleDateString()
          : new Date().toLocaleDateString(),
        reputationScore: Number(rawData.reputation_score || 0),
        totalContribution: formatU256(rawData.total_contribution || 0),
        totalJoinedGroups: Number(rawData.total_joined_groups || 0),
        totalCreatedGroups: Number(rawData.total_created_groups || 0),
        totalEarned: formatU256(rawData.total_earned || 0),
        completedCycles: Number(rawData.completed_cycles || 0),
        activeGroups: Number(rawData.active_groups || 0),
        onTimePayments: Number(rawData.on_time_payments || 0),
        totalPayments: Number(rawData.total_payments || 1), // Prevent division by zero
        paymentRate: Number(rawData.payment_rate || 0),
        averageContribution: formatU256(rawData.average_contribution || 0),
      };

      console.log('Processed profile data:', contractData);
      setProfileData(contractData);
    }
  }, [contractProfileData, address]);

  // Update analytics data from user statistics
  useEffect(() => {
    if (userStatistics) {
      console.log('Raw user statistics:', userStatistics);
      
      const formatU256 = (value: any) => {
        if (!value || value === '0x0' || value === '0') return 0;
        try {
          // Handle both object format (low/high) and direct string/number
          if (typeof value === 'object' && value !== null) {
            // Handle Uint256 with low/high fields
            const low = BigInt(value.low || 0);
            const high = BigInt(value.high || 0);
            const bigValue = (high << BigInt(128)) + low;
            return Number(bigValue) / 1e6; // Convert to USDC (6 decimals)
          } else {
            // Handle direct number/string
            const numValue = typeof value === 'string' ? 
              (value.startsWith('0x') ? parseInt(value, 16) : parseFloat(value)) : 
              Number(value);
            return numValue / 1e6; // Convert to USDC (6 decimals)
          }
        } catch (e) {
          console.error('Error formatting U256 value in analytics:', e, value);
          return 0;
        }
      };

      // Extract data from statistics response
      const stats = Array.isArray(userStatistics) ? userStatistics[0] : userStatistics;
      const locked = lockedBalance ? formatU256(lockedBalance) : 0;

      console.log('Processed statistics:', {
        totalSaved: formatU256(stats.total_saved || 0),
        activeGroups: stats.active_groups || profileData.activeGroups || 0,
        completedCycles: stats.completed_cycles || profileData.completedCycles || 0,
        totalEarned: formatU256(stats.total_earned || 0),
        averageContribution: formatU256(stats.average_contribution) || profileData.averageContribution || 0,
        onTimePayments: stats.on_time_payments || profileData.onTimePayments || 0,
        totalPayments: stats.total_payments || profileData.totalPayments || 1, // Prevent division by zero
        joinedGroups: stats.joined_groups || profileData.totalJoinedGroups || 0,
        createdGroups: stats.created_groups || profileData.totalCreatedGroups || 0,
        successRate: Number(stats.success_rate || 0),
        lockedAmount: locked,
      });

      setAnalytics({
        totalSaved: formatU256(stats.total_saved || 0),
        activeGroups: stats.active_groups || profileData.activeGroups || 0,
        completedCycles: stats.completed_cycles || profileData.completedCycles || 0,
        totalEarned: formatU256(stats.total_earned || 0),
        averageContribution: formatU256(stats.average_contribution) || profileData.averageContribution || 0,
        onTimePayments: stats.on_time_payments || profileData.onTimePayments || 0,
        totalPayments: stats.total_payments || profileData.totalPayments || 1, // Prevent division by zero
        joinedGroups: stats.joined_groups || profileData.totalJoinedGroups || 0,
        createdGroups: stats.created_groups || profileData.totalCreatedGroups || 0,
        successRate: Number(stats.success_rate || 0),
        lockedAmount: locked,
      });
    }
  }, [userStatistics, profileData, lockedBalance]);

  // Update recent activity from contract data
  useEffect(() => {
    if (userActivities && Array.isArray(userActivities)) {
      const formattedActivities = userActivities.slice(0, 10).map((activity: any) => {
        const formatU256 = (value: any) => {
          if (!value) return 0;
          return Number(value) / 1e6;
        };

        const getActivityDetails = (activityType: any) => {
          switch (activityType) {
            case 0: // Contribution
              return {
                type: "contribution",
                description: activity.description || "Made contribution to group",
                amount: `-${formatU256(activity.amount)} USDC`,
                icon: DollarSign,
                color: "text-blue-600",
              };
            case 1: // PayoutReceived
              return {
                type: "payout",
                description: activity.description || "Received payout",
                amount: `+${formatU256(activity.amount)} USDC`,
                icon: TrendingUp,
                color: "text-green-600",
              };
            case 2: // GroupJoined
              return {
                type: "joined",
                description: activity.description || "Joined a group",
                amount: "",
                icon: UsersIcon,
                color: "text-purple-600",
              };
            case 3: // GroupCreated
              return {
                type: "created",
                description: activity.description || "Created a group",
                amount: "",
                icon: UsersIcon,
                color: "text-blue-600",
              };
            case 6: // LockDeposited
              return {
                type: "lock",
                description: activity.description || "Deposited liquidity lock",
                amount: `${formatU256(activity.amount)} USDC locked`,
                icon: Shield,
                color: "text-orange-600",
              };
            default:
              return {
                type: "other",
                description: activity.description || "Activity",
                amount: activity.amount ? `${formatU256(activity.amount)} USDC` : "",
                icon: Activity,
                color: "text-gray-600",
              };
          }
        };

        const details = getActivityDetails(activity.activity_type);
        
        return {
          ...details,
          date: activity.timestamp 
            ? new Date(Number(activity.timestamp) * 1000).toLocaleTimeString() 
            : "Recently",
        };
      });

      setRecentActivity(formattedActivities);
    }
  }, [userActivities]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await refetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = isLoadingProfile || isLoadingActivities || isLoadingStatistics;

  // Show loading state while fetching profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show error state if profile fetch failed
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Failed to Load Profile
            </h2>
            <p className="text-gray-600 mb-4">
              There was an error loading your profile data.
            </p>
            <Button onClick={() => refetchProfile()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show message if user is not registered
  if (!profileData.isRegistered && !isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              You need to register to view your profile.
            </p>
            <Button asChild>
              <Link href="/register">Register Now</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Profile Header Component */}
        <ProfileHeader
          profileData={profileData}
          analytics={analytics}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSaveProfile={handleSaveProfile}
          loading={loading}
        />

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <span className="hidden sm:inline">Recent </span>Activity
              {recentActivity.length > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 hidden sm:inline">
                  {recentActivity.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <span className="hidden sm:inline">Statistics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              Payouts
            </TabsTrigger>
            <TabsTrigger value="my-groups" className="text-xs sm:text-sm px-2 sm:px-3 py-2">
              <span className="hidden sm:inline">My </span>Groups
              {analytics.joinedGroups > 0 && (
                <span className="ml-1 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 hidden sm:inline">
                  {analytics.joinedGroups}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <ProfileOverview analytics={analytics} profileData={profileData} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 sm:space-y-4">
            <ProfileActivity recentActivity={recentActivity} />
            {isLoadingActivities && (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
                <span className="text-sm sm:text-base">Loading activities...</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4 sm:space-y-6">
            <ProfileStatistics analytics={analytics} />
            {isLoadingStatistics && (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
                <span className="text-sm sm:text-base">Loading statistics...</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="payouts" className="space-y-4 sm:space-y-6">
            <ProfilePayouts userAddress={address} />
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-4 sm:space-y-6">
            <MyGroupsJoined 
              userAddress={address} 
              // groupsData={userJoinedGroups} 
              // isLoading={isLoadingJoinedGroups}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}