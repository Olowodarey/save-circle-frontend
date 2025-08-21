"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Users,
  TrendingUp,
  Wallet,
  Clock,
  Star,
  Lock,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import WalletConnectModal from "@/components/wallet/wallet-connect-modal";
import { useReadContract, useAccount } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants";

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userRegistered, setUserRegistered] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address, isConnected } = useAccount();

  // Fetch user profile view data (includes profile, activities, groups, statistics)
  const { data: profileViewData, error: profileError, isPending: profilePending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_profile_view_data",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0"],
    enabled: !!address && isConnected,
  });

  // Fetch user's joined groups
  const { data: joinedGroups, error: groupsError, isPending: groupsPending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_joined_groups",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0"],
    enabled: !!address && isConnected,
  });

  // Fetch user activities
  const { data: userActivities, error: activitiesError, isPending: activitiesPending } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_activities",
    address: CONTRACT_ADDRESS,
    args: [address || "0x0", 10], // Limit to 10 recent activities
    enabled: !!address && isConnected,
  });

  useEffect(() => {
    // Check wallet connection on mount
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("connected-wallet");
      const savedAddress = localStorage.getItem("wallet-address");

      if (savedWallet && savedAddress) {
        setWalletConnected(true);
        setWalletType(savedWallet);
      }
    }
  }, []);

  // Check if user is registered based on profile data
  useEffect(() => {
    if (profileViewData?.profile) {
      setUserRegistered(profileViewData.profile.is_registered);
    }
  }, [profileViewData]);

  // Format user statistics from contract data
  const stats = profileViewData ? {
    totalSaved: `${Number(profileViewData.statistics.total_saved) / 1e18} USDC`, // Convert from wei
    activeGroups: Number(profileViewData.profile.active_groups),
    completedCycles: Number(profileViewData.profile.completed_cycles),
    reputationScore: Number(profileViewData.profile.reputation_score),
  } : {
    totalSaved: "0 USDC",
    activeGroups: 0,
    completedCycles: 0,
    reputationScore: 0,
  };

  // Format groups data
  const myGroups = joinedGroups?.map((groupDetail: any, index: number) => {
    const group = groupDetail.group_info;
    const member = groupDetail.member_data;
    
    return {
      id: Number(group.group_id),
      name: group.group_name,
      type: group.visibility === 0 ? "public" : "private", // Assuming 0 = Public, 1 = Private
      members: Number(group.members),
      maxMembers: Number(group.member_limit),
      contribution: `${Number(group.contribution_amount) / 1e18} USDC`,
      nextPayout: calculateNextPayout(group.last_payout_time, group.cycle_duration),
      status: getGroupStatus(group.state),
      locked: group.requires_lock,
      myTurn: group.next_payout_recipient === address,
    };
  }) || [];

  // Format activities data
  const activities = userActivities?.slice(0, 5).map((activity: any) => {
    return {
      type: getActivityType(activity.activity_type),
      description: activity.description,
      amount: Number(activity.amount) / 1e18,
      timestamp: new Date(Number(activity.timestamp) * 1000),
      isPositive: activity.is_positive_amount,
    };
  }) || [];

  function calculateNextPayout(lastPayoutTime: bigint, cycleDuration: bigint): string {
    const lastPayout = Number(lastPayoutTime) * 1000; // Convert to milliseconds
    const duration = Number(cycleDuration) * 1000; // Convert to milliseconds
    const nextPayout = lastPayout + duration;
    const now = Date.now();
    const daysLeft = Math.ceil((nextPayout - now) / (24 * 60 * 60 * 1000));
    return daysLeft > 0 ? `${daysLeft} days` : "Due now";
  }

  function getGroupStatus(state: number): string {
    const states = ["Created", "Active", "Completed", "Defaulted"];
    return states[state]?.toLowerCase() || "unknown";
  }

  function getActivityType(activityType: number): string {
    const types = [
      "Contribution", "PayoutReceived", "GroupJoined", "GroupCreated",
      "GroupCompleted", "GroupLeft", "LockDeposited", "LockWithdrawn",
      "PenaltyPaid", "ReputationGained", "ReputationLost", "UserRegistered"
    ];
    return types[activityType] || "Unknown";
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "PayoutReceived":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "Contribution":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "ReputationGained":
        return <Star className="w-4 h-4 text-purple-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  }

  function getActivityColor(type: string, isPositive: boolean) {
    if (type === "PayoutReceived" || isPositive) return "text-green-600";
    if (type === "Contribution" || !isPositive) return "text-red-600";
    return "text-blue-600";
  }

  const handleConnect = () => {
    setShowWalletModal(true);
  };

  const handleWalletConnect = (walletType: string) => {
    const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";

    if (typeof window !== "undefined") {
      localStorage.setItem("connected-wallet", walletType);
      localStorage.setItem("wallet-address", mockAddress);
    }

    setWalletConnected(true);
    setWalletType(walletType);
    setShowWalletModal(false);
  };

  const handleDisconnect = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("connected-wallet");
      localStorage.removeItem("wallet-address");
    }
    setWalletConnected(false);
    setWalletType(null);
  };

  // Show loading state while fetching data
  if (isConnected && (profilePending || groupsPending || activitiesPending)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error fetching data
  if (profileError || groupsError || activitiesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
            <CardDescription>
              {profileError?.message || groupsError?.message || activitiesError?.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Save Circle
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link href="/groups" className="text-gray-600 hover:text-gray-900">
              Groups
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <Link
              href="/reputation"
              className="text-gray-600 hover:text-gray-900"
            >
              Reputation
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!isConnected ? (
              <Button onClick={handleConnect}>Connect Wallet</Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Connected
                </Badge>
                <span className="text-sm text-gray-600 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            )}
            {isConnected && (
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {isConnected && !userRegistered && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Welcome to Save Circle!</CardTitle>
              <CardDescription>
                Complete your profile to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setShowOnboarding(true)}
                className="w-full"
              >
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Let&apos;s complete your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setShowOnboarding(false)}
                className="w-full"
              >
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSaved}</div>
              <p className="text-xs text-muted-foreground">
                Total contributions made
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Groups
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">
                Currently participating
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Cycles
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCycles}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reputation Score
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reputationScore}</div>
              <Progress value={stats.reputationScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="groups">My Groups</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/groups/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/groups">Browse Groups</Link>
              </Button>
            </div>
          </div>

          <TabsContent value="groups" className="space-y-4">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Groups Yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Join or create your first savings circle to get started
                  </p>
                  <Button asChild>
                    <Link href="/groups/create">Create Your First Group</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              group.type === "private" ? "secondary" : "outline"
                            }
                          >
                            {group.type}
                          </Badge>
                          {group.locked && (
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          {group.myTurn && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Your Turn
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          group.status === "active" ? "default" : "secondary"
                        }
                      >
                        {group.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {group.members}/{group.maxMembers} members •{" "}
                      {group.contribution} per cycle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {group.members} members
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Next payout in {group.nextPayout}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/groups/${group.id}`}>View Details</Link>
                        </Button>
                        {group.myTurn && <Button size="sm">Claim Payout</Button>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest transactions and group activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Activity Yet
                    </h3>
                    <p className="text-gray-500">
                      Start participating in groups to see your activity here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-gray-500">
                              {activity.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-medium ${getActivityColor(activity.type, activity.isPositive)}`}>
                          {activity.isPositive ? '+' : '-'}{activity.amount.toFixed(2)} USDC
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}