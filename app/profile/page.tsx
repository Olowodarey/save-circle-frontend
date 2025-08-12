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
} from "lucide-react";
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

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    data: contractProfileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useReadContract({
    args: [address ? address : ""],
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_profile",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    avatar: "/placeholder.svg?height=120&width=120",
    walletAddress: address || "",
    isRegistered: false,
    totalLockAmount: 0,
    profileCreatedAt: "",
    reputationScore: 0,
  });

  useEffect(() => {
    if (contractProfileData && address) {
      const contractData = {
        name: contractProfileData.name || `User ${address.slice(0, 6)}`,
        avatar:
          contractProfileData.avatar || "/placeholder.svg?height=120&width=120",
        walletAddress: address,
        isRegistered: contractProfileData.is_registered || false,
        totalLockAmount: contractProfileData.total_lock_amount || 0,
        profileCreatedAt: contractProfileData.profile_created_at
          ? new Date(
              Number(contractProfileData.profile_created_at)
            ).toLocaleDateString()
          : "",
        reputationScore: 0,
      };

      setProfileData({
        name: String(contractData.name),
        avatar: String(contractData.avatar),
        walletAddress: contractData.walletAddress,
        isRegistered: contractData.isRegistered,
        totalLockAmount: Number(contractData.totalLockAmount),
        profileCreatedAt: contractData.profileCreatedAt,
        reputationScore: contractData.reputationScore,
      });
    }
  }, [contractProfileData, address]);

  // Analytics data
  const analytics = {
    totalSaved: 3750,
    activeGroups: 2,
    completedCycles: 5,
    totalEarned: 1250,
    averageContribution: 125,
    onTimePayments: 23,
    totalPayments: 25,
    joinedGroups: 7,
    createdGroups: 1,
  };

  const recentActivity = [
    {
      type: "payout",
      description: "Received payout from DeFi Builders",
      amount: "+400 USDC",
      date: "2 hours ago",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      type: "contribution",
      description: "Made contribution to Tech Professionals Circle",
      amount: "-100 USDC",
      date: "1 day ago",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      type: "joined",
      description: "Joined Crypto Enthusiasts group",
      amount: "",
      date: "3 days ago",
      icon: UsersIcon,
      color: "text-purple-600",
    },
  ];

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

  // Show loading state while fetching profile
  if (isLoadingProfile) {
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
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Profile</span>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups Joined</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProfileOverview analytics={analytics} profileData={profileData} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ProfileActivity recentActivity={recentActivity} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <ProfileStatistics analytics={analytics} />
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <MyGroupsJoined userAddress={address} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
