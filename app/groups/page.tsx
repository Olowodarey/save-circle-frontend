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
  LogOut,
  Loader2,
  RefreshCw,
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
  
  // Use the groups hook to fetch contract data
  const { publicGroups, userInvites, loading, error, refetch } = useGroups();

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
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </Link>
            </nav>
            {!isConnected ? (
              <Button
                variant="outline"
                onClick={() => setShowWalletModal(true)}
              >
                Connect Wallet
              </Button>
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
            <Button asChild>
              <Link href="/groups/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Savings Groups
          </h1>
          <p className="text-gray-600">
            Discover and join savings circles that match your goals
          </p>
        </div>

        <Tabs defaultValue="public" className="space-y-6">
          <TabsList>
            <TabsTrigger value="public">Public Groups</TabsTrigger>
            <TabsTrigger value="invites">
              My Invites
              {userInvites.length > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                  {userInvites.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
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
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading groups...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-red-600 mb-4">
                    <span className="text-lg font-semibold">Error loading groups</span>
                    <p className="text-sm mt-2">{error}</p>
                  </div>
                  <Button onClick={refetch} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && filteredGroups.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No groups found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterType !== "all" 
                      ? "No groups match your current filters." 
                      : "No groups have been created yet. Be the first to create one!"}
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

            {/* Groups Grid */}
            {!loading && !error && filteredGroups.length > 0 && (
              <div className="grid gap-6">
                {filteredGroups.map((group) => (
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
                              className="text-green-600 border-green-200"
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              Public
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
                        <p className="text-sm text-gray-500">Members</p>
                        <p className="font-semibold">
                          {group.members}/{group.maxMembers}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contribution</p>
                        <p className="font-semibold">{group.contribution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-semibold">{group.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Min. Reputation</p>
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
                          <Link href={`/groups/${group.id}`}>View Details</Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          Join Group
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
