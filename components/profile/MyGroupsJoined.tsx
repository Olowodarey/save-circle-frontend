import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";

// Mock data - in a real app, this would come from the contract
interface JoinedGroup {
  id: string;
  name: string;
  type: "public" | "private";
  members: number;
  maxMembers: number;
  contribution: string;
  frequency: string;
  status: "active" | "completed" | "paused";
  joinedAt: string;
  currentCycle: number;
  totalCycles: number;
  nextPayoutDate: string;
  userPosition: number;
  totalContributed: number;
  expectedPayout: string;
  paymentStatus: "up-to-date" | "pending" | "late";
}

interface MyGroupsJoinedProps {
  userAddress?: string;
}

export default function MyGroupsJoined({ userAddress }: MyGroupsJoinedProps) {
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  // Mock data - replace with real contract calls
  useEffect(() => {
    const fetchJoinedGroups = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock joined groups data
      const mockGroups: JoinedGroup[] = [
        {
          id: "1",
          name: "Tech Professionals Circle",
          type: "public",
          members: 8,
          maxMembers: 10,
          contribution: "100 USDC",
          frequency: "Monthly",
          status: "active",
          joinedAt: "2024-01-15",
          currentCycle: 3,
          totalCycles: 10,
          nextPayoutDate: "2024-02-15",
          userPosition: 3,
          totalContributed: 300,
          expectedPayout: "1,000 USDC",
          paymentStatus: "up-to-date",
        },
        {
          id: "2",
          name: "DeFi Builders",
          type: "private",
          members: 5,
          maxMembers: 5,
          contribution: "200 USDC",
          frequency: "Bi-weekly",
          status: "active",
          joinedAt: "2024-02-01",
          currentCycle: 2,
          totalCycles: 5,
          nextPayoutDate: "2024-02-20",
          userPosition: 2,
          totalContributed: 400,
          expectedPayout: "1,000 USDC",
          paymentStatus: "pending",
        },
        {
          id: "3",
          name: "Crypto Enthusiasts",
          type: "public",
          members: 12,
          maxMembers: 12,
          contribution: "50 USDC",
          frequency: "Weekly",
          status: "completed",
          joinedAt: "2023-12-01",
          currentCycle: 12,
          totalCycles: 12,
          nextPayoutDate: "Completed",
          userPosition: 7,
          totalContributed: 600,
          expectedPayout: "600 USDC",
          paymentStatus: "up-to-date",
        },
      ];

      setJoinedGroups(mockGroups);
      setLoading(false);
    };

    if (address || userAddress) {
      fetchJoinedGroups();
    }
  }, [address, userAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "late":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your groups...</span>
        </div>
      </div>
    );
  }

  if (joinedGroups.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Groups Joined Yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't joined any savings groups yet. Start your savings
            journey today!
          </p>
          <Button asChild>
            <Link href="/groups">Browse Groups</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Total Groups</span>
            </div>
            <p className="text-2xl font-bold mt-1">{joinedGroups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium">Total Contributed</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {joinedGroups
                .reduce((sum, group) => sum + group.totalContributed, 0)
                .toLocaleString()}{" "}
              USDC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Active Groups</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {joinedGroups.filter((group) => group.status === "active").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {joinedGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {group.name}
                    <Badge
                      variant="outline"
                      className={getStatusColor(group.status)}
                    >
                      {group.status}
                    </Badge>
                    <Badge variant="outline">{group.type}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Position #{group.userPosition} • Joined{" "}
                    {new Date(group.joinedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/groups/${group.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="font-semibold">
                    {group.members}/{group.maxMembers}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Contribution</p>
                  <p className="font-semibold">{group.contribution}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="font-semibold">{group.frequency}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p
                    className={`font-semibold ${getPaymentStatusColor(
                      group.paymentStatus
                    )}`}
                  >
                    {group.paymentStatus
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
              </div>

              {group.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      Cycle {group.currentCycle} of {group.totalCycles}
                    </span>
                  </div>
                  <Progress
                    value={(group.currentCycle / group.totalCycles) * 100}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Next payout: {group.nextPayoutDate}</span>
                    <span>Expected: {group.expectedPayout}</span>
                  </div>
                </div>
              )}

              {group.status === "completed" && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Completed Successfully</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Total contributed: {group.totalContributed.toLocaleString()}{" "}
                    USDC • Final payout: {group.expectedPayout}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
