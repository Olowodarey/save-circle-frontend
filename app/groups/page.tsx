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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Globe,
  Lock,
  Star,
  Clock,
  Plus,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import WalletConnectModal from "@/components/wallet/wallet-connect-modal";
import { useGroups } from "@/hooks/use-groups";
import { useAccount } from "@starknet-react/core";

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Use Starknet React hooks for wallet connection
  const { address, isConnected } = useAccount();

  // Use the groups hook to fetch contract data with optimizations
  const {
    publicGroups,
    userGroups,
    userInvites,
    loading,
    error,
    refetch,
    forceRefresh,
    initialLoad,
    isFromCache,
  } = useGroups();

  // Remove the old wallet connection effect since we're using Starknet React

  // Groups data now comes from the contract via useGroups hook

  const filteredGroups = publicGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "locked" && group.locked) ||
      (filterType === "unlocked" && !group.locked);
    return matchesSearch && matchesFilter;
  });

  const handleWalletConnect = (walletType: string) => {
    // Wallet connection is now handled by Starknet React
    setShowWalletModal(false);
  };

  const handleJoinGroup = (groupId: string) => {
    // Here you would implement the actual join group logic
    // For now, we'll simulate joining and redirect to group details
    console.log("Joining group:", groupId);
    // In a real app, this would call a smart contract function
    // then redirect to the group details page
    window.location.href = `/groups/${groupId}`;
  };

  const handleAcceptInvite = (inviteId: number) => {
    console.log("Accepting invite:", inviteId);
    // Simulate accepting invite and redirect
    // In real app, this would call smart contract
    window.location.href = `/groups/1`; // Redirect to the group
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Savings Groups
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover and join savings circles that match your goals
          </p>
        </div>

        <Tabs defaultValue="public" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 h-auto p-1">
              <TabsTrigger value="public" className="text-sm px-3 py-2">
                Public Groups
              </TabsTrigger>
              <TabsTrigger value="mygroups" className="text-sm px-3 py-2">
                <span className="hidden sm:inline">Private </span>Groups
              </TabsTrigger>
            </TabsList>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/groups/create">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create </span>Group
              </Link>
            </Button>
          </div>

          <TabsContent value="public" className="space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="locked">Locked Groups</SelectItem>
                  <SelectItem value="unlocked">Unlocked Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && initialLoad && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading groups...</span>
              </div>
            )}

            {/* Cache Status & Refresh */}
            {!loading && !error && publicGroups.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  {isFromCache && (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {/* <span>Loaded from cache</span> */}
                    </>
                  )}
                  <span>{publicGroups.length} groups found</span>
                </div>
                <Button
                  onClick={() => forceRefresh()}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <RefreshCw
                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="text-center py-8 sm:py-12 px-4">
                  <div className="text-red-600 mb-4">
                    <span className="text-base sm:text-lg font-semibold">
                      Error loading groups
                    </span>
                    <p className="text-xs sm:text-sm mt-2 break-words">
                      {error}
                    </p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="w-full sm:w-auto text-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGroups.length === 0 && (
              <Card>
                <CardContent className="text-center py-8 sm:py-12 px-4">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    No groups found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
                    {searchTerm || filterType !== "all"
                      ? "No groups match your current filters."
                      : "No groups have been created yet. Be the first to create one!"}
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/groups/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Groups Grid */}
            {!loading && !error && filteredGroups.length > 0 && (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3 sm:pb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <CardTitle className="text-lg sm:text-xl">
                              {group.name}
                            </CardTitle>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-200 text-xs"
                              >
                                <Globe className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Public</span>
                                <span className="sm:hidden">Pub</span>
                              </Badge>
                              {group.locked && (
                                <Badge
                                  variant="outline"
                                  className="text-orange-600 border-orange-200 text-xs"
                                >
                                  <Lock className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">
                                    Locked
                                  </span>
                                  <span className="sm:hidden">Lock</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-sm sm:text-base mb-3 line-clamp-2">
                            {group.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {group.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Members
                          </p>
                          <p className="font-semibold text-sm sm:text-base">
                            {group.members}/{group.maxMembers}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Contribution
                          </p>
                          <p className="font-semibold text-sm sm:text-base">
                            {group.contribution}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Frequency
                          </p>
                          <p className="font-semibold text-sm sm:text-base">
                            {group.frequency}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Min. Reputation
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            <span className="font-semibold text-sm sm:text-base">
                              {group.minReputation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          Created by {group.creator}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <Link href={`/groups/${group.id}`}>
                              <span className="hidden sm:inline">
                                View Details
                              </span>
                              <span className="sm:hidden">Details</span>
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleJoinGroup(group.id)}
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Join Group</span>
                            <span className="sm:hidden">Join</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mygroups" className="space-y-6">
            {/* Search and Filter for My Groups */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search my groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600">
                  ● {userGroups.length} groups found
                </span>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && initialLoad && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load groups
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && userGroups.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No groups found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven't created or joined any private groups yet.
                  </p>
                  <Button asChild>
                    <Link href="/groups/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Group
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* My Groups Grid */}
            {!loading && !error && userGroups.length > 0 && (
              <div className="grid gap-6">
                {userGroups
                  .filter((group) => {
                    const matchesSearch =
                      group.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      group.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    return matchesSearch;
                  })
                  .map((group) => (
                    <Card
                      key={group.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">
                                {group.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-purple-600 border-purple-200"
                                >
                                  <Lock className="w-3 h-3 mr-1" />
                                  Private
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
                              </div>
                            </div>
                            <CardDescription className="text-base mb-3">
                              {group.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {group.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Members
                            </div>
                            <div className="font-semibold">
                              {group.members}/{group.maxMembers}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Contribution
                            </div>
                            <div className="font-semibold">
                              {group.contribution}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Frequency
                            </div>
                            <div className="font-semibold">
                              {group.frequency}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Min. Reputation
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">
                                {group.minReputation}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Created by {group.creator}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/groups/${group.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invites" className="space-y-6">
            {userInvites?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No pending invites
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any pending group invitations at the moment.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/groups">Browse Public Groups</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userInvites.map((invite: any) => (
                  <Card key={invite.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {invite.groupName}
                          </CardTitle>
                          <CardDescription>
                            Invited by {invite.invitedBy}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-200"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Expires in {invite.expiresIn}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Members</p>
                          <p className="font-semibold">
                            {invite.members}/{invite.maxMembers}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contribution</p>
                          <p className="font-semibold">{invite.contribution}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <Badge variant="secondary">Private</Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline">Decline</Button>
                        <Button onClick={() => handleAcceptInvite(invite.id)}>
                          Accept Invitation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
