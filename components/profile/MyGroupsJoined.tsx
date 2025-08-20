import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAccount, useReadContract } from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";

const CONTRACT_ADDRESS = "0x037c49f99be664a2d5ede866a619e7ff629adf7a021ad6ba99f9ba94bbcd5923"; 

// Helper function to validate and format Starknet address
const formatStarknetAddress = (address: string | undefined): `0x${string}` | undefined => {
  if (!address) return undefined;
  
  // Remove any whitespace
  const cleanAddress = address.trim();
  
  // Check if it's a valid hex string (only contains 0-9, a-f, A-F)
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  if (!hexRegex.test(cleanAddress)) {
    console.error('Invalid address format:', cleanAddress);
    return undefined;
  }
  
  // Ensure it's the right length (Starknet addresses should be 64 characters + 0x prefix)
  if (cleanAddress.length !== 66) {
    // Pad with zeros if too short
    const paddedAddress = cleanAddress.replace('0x', '').padStart(64, '0');
    return `0x${paddedAddress}`;
  }
  
  return cleanAddress as `0x${string}`;
};

// Skeleton loading component for individual groups
const GroupSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="p-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-14 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Progress bar skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gray-300 h-2 rounded-full w-1/3 animate-pulse"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced loading state component
const LoadingState = () => (
  <div className="space-y-6">
    {/* Summary stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Loading indicator */}
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-blue-200 rounded-full animate-ping"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-1">Loading your groups...</p>
          <p className="text-sm text-gray-600">Fetching data from the blockchain</p>
        </div>
      </div>
    </div>

    {/* Group skeletons */}
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <GroupSkeleton key={i} />
      ))}
    </div>
  </div>
);

interface JoinedGroup {
  id: string;
  name: string;
  type: "public" | "private";
  members: number;
  maxMembers: number;
  contribution: string;
  frequency: string;
  status: "active" | "completed" | "paused" | "created";
  joinedAt: string;
  currentCycle: number;
  totalCycles: number;
  nextPayoutDate: string;
  userPosition: number;
  totalContributed: number;
  expectedPayout: string;
  paymentStatus: "up-to-date" | "pending" | "late";
  hasBeenPaid: boolean;
  isActive: boolean;
  contributionCount: number;
  missedContributions: number;
  totalReceived: number;
}

interface MyGroupsJoinedProps {
  userAddress?: string;
  
}

export default function MyGroupsJoined({ userAddress }: MyGroupsJoinedProps) {
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>([]);
  const [processedError, setProcessedError] = useState<string | null>(null);
  const { address } = useAccount();

  // Use the target address (prop or connected wallet) and format it properly
  const rawTargetAddress = userAddress || address;
  const targetAddress = formatStarknetAddress(rawTargetAddress);
  const formattedContractAddress = formatStarknetAddress(CONTRACT_ADDRESS);

  // Use useReadContract hook instead of manual contract calls
  const {
    data: contractResult,
    error: contractError,
    isLoading,
    isSuccess,
    isError
  } = useReadContract({
    abi: MY_CONTRACT_ABI,
    functionName: "get_user_joined_groups",
    address: formattedContractAddress!,
    args: [!!targetAddress ? targetAddress : ""],
    enabled: !!(targetAddress && formattedContractAddress), // Only run query when we have valid addresses
    watch: false, // Don't refetch on every block
  });

  // Helper function to format U256 values from contract
  const formatU256 = (value: any) => {
    if (!value) return 0;
    if (typeof value === 'object' && value.low !== undefined) {
      return Number(value.low) / 1e6; // Assuming 6 decimal places for USDC
    }
    return Number(value) / 1e6;
  };

  // Helper function to get time unit string
  const getTimeUnitString = (unit: any) => {
    const timeUnits = ["Minutes", "Hours", "Days", "Weeks", "Months"];
    const unitIndex = typeof unit === 'object' ? Object.keys(unit)[0] : unit;
    const unitMap: { [key: string]: number } = {
      'Minutes': 0, 'Hours': 1, 'Days': 2, 'Weeks': 3, 'Months': 4
    };
    return timeUnits[unitMap[unitIndex] || 0] || "Unknown";
  };

  // Helper function to get group state string
  const getGroupStateString = (state: any) => {
    const states = ["created", "active", "completed", "paused"];
    const stateIndex = typeof state === 'object' ? Object.keys(state)[0] : state;
    const stateMap: { [key: string]: number } = {
      'Created': 0, 'Active': 1, 'Completed': 2, 'Defaulted': 3
    };
    return states[stateMap[stateIndex] || 0] || "created";
  };

  // Helper function to get visibility string
  const getVisibilityString = (visibility: any) => {
    const visibilities = ["public", "private"];
    const visIndex = typeof visibility === 'object' ? Object.keys(visibility)[0] : visibility;
    const visMap: { [key: string]: number } = {
      'Public': 0, 'Private': 1
    };
    return visibilities[visMap[visIndex] || 0] || "public";
  };

  // Process contract result when it changes
  useEffect(() => {
    console.log('Contract call state:', { 
      isLoading, 
      isSuccess, 
      isError, 
      targetAddress, 
      formattedContractAddress,
      hasResult: !!contractResult 
    });

    if (isSuccess && contractResult) {
      try {
        console.log('Contract result:', contractResult);

        if (Array.isArray(contractResult) && contractResult.length > 0) {
          const processedGroups: JoinedGroup[] = contractResult.map((groupDetail: any, index: number) => {
            console.log(`Processing group ${index}:`, groupDetail);
            
            const groupInfo = groupDetail?.group_info || {};
            const memberData = groupDetail?.member_data || {};
            
            // Calculate next payout date
            const nextPayoutTimestamp = groupDetail?.next_payout_date;
            const nextPayoutDate = nextPayoutTimestamp 
              ? new Date(Number(nextPayoutTimestamp) * 1000).toLocaleDateString()
              : "TBD";

            // Calculate expected payout
            const expectedPayout = formatU256(groupDetail?.expected_payout_amount);
            
            // Determine payment status based on contribution count and current cycle
            let paymentStatus: "up-to-date" | "pending" | "late" = "up-to-date";
            const missedContributions = Number(memberData?.missed_contributions || 0);
            const contributionCount = Number(memberData?.contribution_count || 0);
            const currentCycle = Number(groupInfo?.current_cycle || 0);
            
            if (missedContributions > 0) {
              paymentStatus = "late";
            } else if (contributionCount < currentCycle) {
              paymentStatus = "pending";
            }

            const processedGroup: JoinedGroup = {
              id: (groupInfo?.group_id || index).toString(),
              name: groupInfo?.group_name || `Group ${groupInfo?.group_id || index}`,
              type: getVisibilityString(groupInfo?.visibility) as "public" | "private",
              members: Number(groupInfo?.members || 0),
              maxMembers: Number(groupInfo?.member_limit || 0),
              contribution: `${formatU256(groupInfo?.contribution_amount || 0)} USDC`,
              frequency: getTimeUnitString(groupInfo?.cycle_unit),
              status: getGroupStateString(groupInfo?.state) as "active" | "completed" | "paused" | "created",
              joinedAt: memberData?.joined_at ? new Date(Number(memberData.joined_at) * 1000).toLocaleDateString() : "Unknown",
              currentCycle: Number(groupInfo?.current_cycle || 0),
              totalCycles: Number(groupInfo?.total_cycles || 0),
              nextPayoutDate,
              userPosition: Number(groupDetail?.position_in_queue || 0),
              totalContributed: formatU256(groupDetail?.total_contributed_so_far || 0),
              expectedPayout: `${expectedPayout.toLocaleString()} USDC`,
              paymentStatus,
              hasBeenPaid: Boolean(memberData?.has_been_paid),
              isActive: Boolean(memberData?.is_active),
              contributionCount,
              missedContributions,
              totalReceived: formatU256(memberData?.total_recieved || memberData?.total_received || 0),
            };
            
            console.log(`Processed group ${index}:`, processedGroup);
            return processedGroup;
          });

          console.log('Final processed groups:', processedGroups);
          setJoinedGroups(processedGroups);
          setProcessedError(null);
        } else {
          console.log('No groups found or empty result');
          setJoinedGroups([]);
          setProcessedError(null);
        }
      } catch (err) {
        console.error('Error processing contract result:', err);
        setProcessedError('Failed to process group data. Please try again.');
        setJoinedGroups([]);
      }
    } else if (isError) {
      console.error('Contract call error:', contractError);
      setProcessedError(contractError?.message || 'Failed to load groups. Please try again.');
      setJoinedGroups([]);
    }
  }, [contractResult, isSuccess, isError, contractError, targetAddress, formattedContractAddress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "created":
        return "bg-yellow-100 text-yellow-800";
      case "paused":
        return "bg-red-100 text-red-800";
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

  // Show enhanced loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (processedError || isError) {
    const errorMessage = processedError || contractError?.message || 'An error occurred';
    return (
      <div className="bg-white rounded-lg border border-red-200 shadow-sm">
        <div className="text-center py-12 px-6">
          <div className="text-red-600 mb-4">
            <Users className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium">Error loading groups</p>
          </div>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div>Target Address: {targetAddress || 'Not available'}</div>
            <div>Contract Address: {formattedContractAddress || 'Invalid'}</div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no address state
  if (!targetAddress || !formattedContractAddress) {
    return (
      <div className="bg-white rounded-lg border border-yellow-200 shadow-sm">
        <div className="text-center py-12 px-6">
          <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {!targetAddress ? 'Connect Your Wallet' : 'Invalid Contract Address'}
          </h3>
          <p className="text-gray-600 mb-4">
            {!targetAddress 
              ? 'Please connect your wallet to view your joined groups.'
              : 'The contract address is invalid. Please check the configuration.'
            }
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (joinedGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center py-12 px-6">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Groups Joined Yet
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't joined any savings groups yet. Start your savings
            journey today!
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Browse Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Total Groups</span>
            </div>
            <p className="text-2xl font-bold mt-1">{joinedGroups.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
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
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Active Groups</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {joinedGroups.filter((group) => group.status === "active").length}
            </p>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {joinedGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(group.status)}`}>
                      {group.status}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-gray-300 text-gray-600 bg-white">
                      {group.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Position #{group.userPosition} • Joined{" "}
                    {group.joinedAt}
                  </p>
                </div>
                {/* FIXED: Proper Link structure */}
                <Link 
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </Link>
              </div>

              {/* Stats Grid */}
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
                  <p className={`font-semibold ${getPaymentStatusColor(group.paymentStatus)}`}>
                    {group.paymentStatus
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
              </div>

              {/* Progress for active groups */}
              {group.status === "active" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      Cycle {group.currentCycle} of {group.totalCycles}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${group.totalCycles > 0 ? (group.currentCycle / group.totalCycles) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Next payout: {group.nextPayoutDate}</span>
                    <span>Expected: {group.expectedPayout}</span>
                  </div>
                </div>
              )}

              {/* Completed status */}
              {group.status === "completed" && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Completed Successfully</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Total contributed: {group.totalContributed.toLocaleString()}{" "}
                    USDC • Total received: {group.totalReceived.toLocaleString()} USDC
                  </p>
                </div>
              )}

              {/* Payout received indicator */}
              {group.hasBeenPaid && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-3">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Payout Received</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    You have received your payout for this group
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}