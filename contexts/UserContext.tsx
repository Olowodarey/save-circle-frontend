"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useAccount,
  useContract,
  useReadContract,
  useSendTransaction,
} from "@starknet-react/core";
import { MY_CONTRACT_ABI } from "@/constants/abi";
import { CONTRACT_ADDRESS } from "@/constants/address";
import { shortString } from "starknet";
import type { StarknetTypedContract } from "@starknet-react/core";

// Type definitions
interface ProfileData {
  name: string;
  avatar: string;
  walletAddress: string;
  isRegistered: boolean;
  totalLockAmount: number;
  profileCreatedAt: string;
  reputationScore: number;
}

interface RegistrationData {
  name: string;
  avatar: string;
}

interface EditForm {
  name: string;
  avatar: string;
}

interface Analytics {
  totalSaved: number;
  activeGroups: number;
  completedCycles: number;
  totalEarned: number;
  averageContribution: number;
  onTimePayments: number;
  totalPayments: number;
  joinedGroups: number;
  createdGroups: number;
}

interface RecentActivity {
  type: string;
  description: string;
  amount: string;
  date: string;
  icon: string;
  color: string;
}

interface ContractProfileData {
  name?: string;
  avatar?: string;
  is_registered?: boolean;
  total_lock_amount?: number;
  profile_created_at?: number;
}

interface UserContextType {
  // Profile data
  profileData: ProfileData;
  analytics: Analytics;
  recentActivity: RecentActivity[];

  // Loading states
  loading: boolean;
  isLoadingProfile: boolean;
  error: string | null;

  // Registration state
  showRegistration: boolean;
  setShowRegistration: (show: boolean) => void;
  registrationData: RegistrationData;
  setRegistrationData: (data: RegistrationData) => void;
  isRegistrationPending: boolean;
  isRegistrationSuccess: boolean;
  isRegistrationError: boolean;
  registrationError: Error | null;
  registrationTxData: any;

  // Edit state
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editForm: EditForm;
  setEditForm: (form: EditForm) => void;

  // Wallet data
  address?: string;
  isConnected: boolean | undefined;

  // Contract
  contract?: StarknetTypedContract<typeof MY_CONTRACT_ABI>;

  // Functions
  refreshUserData: () => Promise<void>;
  refetchProfile: () => Promise<any>;
  handleRegistration: () => Promise<void>;
  handleSaveProfile: () => Promise<void>;
  generateNewRegistrationAvatar: () => void;
  generateNewEditAvatar: () => void;

  // Computed values
  isRegistered: boolean;
  userProfile: ProfileData; // Alias for compatibility
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { address, isConnected } = useAccount();

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    avatar: "/placeholder.svg?height=120&width=120",
    walletAddress: "",
    isRegistered: false,
    totalLockAmount: 0,
    profileCreatedAt: "",
    reputationScore: 0,
  });

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showRegistration, setShowRegistration] = useState<boolean>(false);

  // Form states
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    avatar: "",
  });

  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    avatar: "",
  });

  // Contract setup
  const { contract } = useContract({
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
  });

  // Read user profile from contract
  const {
    data: contractProfileData,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useReadContract({
    args: [address || ""],
    abi: MY_CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    enabled: !!address,
    watch: true,
    functionName: "get_user_profile",
  });

  // Registration transaction
  const {
    send: sendRegistration,
    isPending: isRegistrationPending,
    isSuccess: isRegistrationSuccess,
    isError: isRegistrationError,
    error: registrationError,
    data: registrationTxData,
  } = useSendTransaction({
    calls:
      contract && registrationData.name.trim()
        ? [
            contract.populate("register_user", [
              shortString.encodeShortString(registrationData.name.trim()),
              shortString.encodeShortString(
                registrationData.avatar || "default_avatar"
              ),
            ]),
          ]
        : undefined,
  });

  // Update profile data when contract data changes
  useEffect(() => {
    if (contractProfileData && address) {
      const contractData: ContractProfileData =
        contractProfileData as ContractProfileData;

      const processedData = {
        name: contractData.name || `User ${address.slice(0, 6)}`,
        avatar: contractData.avatar || "/placeholder.svg?height=120&width=120",
        walletAddress: address,
        isRegistered: contractData.is_registered || false,
        totalLockAmount: contractData.total_lock_amount || 0,
        profileCreatedAt: contractData.profile_created_at
          ? new Date(
              Number(contractData.profile_created_at) * 1000
            ).toLocaleDateString()
          : "",
        reputationScore: 0, // This might need to be calculated or fetched separately
      };

      const newProfileData: ProfileData = {
        name: String(processedData.name),
        avatar: String(processedData.avatar),
        walletAddress: processedData.walletAddress,
        isRegistered: processedData.isRegistered,
        totalLockAmount: Number(processedData.totalLockAmount),
        profileCreatedAt: processedData.profileCreatedAt,
        reputationScore: processedData.reputationScore,
      };

      setProfileData(newProfileData);
      setEditForm({
        name: String(processedData.name),
        avatar: String(processedData.avatar),
      });
      setError(null);
    }
  }, [contractProfileData, address]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setProfileData({
        name: "",
        avatar: "/placeholder.svg?height=120&width=120",
        walletAddress: "",
        isRegistered: false,
        totalLockAmount: 0,
        profileCreatedAt: "",
        reputationScore: 0,
      });
      setRegistrationData({ name: "", avatar: "" });
      setEditForm({ name: "", avatar: "" });
      setError(null);
      setIsEditing(false);
      setShowRegistration(false);
    }
  }, [isConnected]);

  // Handle successful registration
  useEffect(() => {
    if (isRegistrationSuccess && registrationTxData) {
      // Wait for blockchain confirmation then refresh
      setTimeout(async () => {
        await refetchProfile();
        setShowRegistration(false);
        setRegistrationData({ name: "", avatar: "" });
      }, 3000);
    }
  }, [isRegistrationSuccess, registrationTxData, refetchProfile]);

  // Profile management functions
  const refreshUserData = async (): Promise<void> => {
    if (address && contract) {
      setLoading(true);
      try {
        await refetchProfile();
      } catch (err) {
        setError("Failed to fetch user profile");
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegistration = async (): Promise<void> => {
    if (!registrationData.name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (!contract) {
      setError("Contract not loaded. Please try again.");
      return;
    }

    try {
      await sendRegistration();
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    }
  };

  const handleSaveProfile = async (): Promise<void> => {
    setLoading(true);
    try {
      // Update local state immediately for better UX
      setProfileData({ ...profileData, ...editForm });
      setIsEditing(false);

      // In a real implementation, you'd call a contract method to update profile
      // For now, we just refresh to get the latest data
      // await refetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const generateNewAvatar = (): string => {
    const avatars: string[] = [
      "avatar1",
      "avatar2",
      "avatar3",
      "avatar4",
      "avatar5",
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    return randomAvatar;
  };

  const generateNewRegistrationAvatar = (): void => {
    const newAvatar = generateNewAvatar();
    setRegistrationData({ ...registrationData, avatar: newAvatar });
  };

  const generateNewEditAvatar = (): void => {
    const newAvatar = generateNewAvatar();
    setEditForm({ ...editForm, avatar: newAvatar });
  };

  // Analytics data (this could be fetched from contract or calculated)
  const analytics: Analytics = {
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

  const recentActivity: RecentActivity[] = [
    {
      type: "payout",
      description: "Received payout from DeFi Builders",
      amount: "+400 USDC",
      date: "2 hours ago",
      icon: "TrendingUp",
      color: "text-green-600",
    },
    {
      type: "contribution",
      description: "Made contribution to Tech Professionals Circle",
      amount: "-100 USDC",
      date: "1 day ago",
      icon: "DollarSign",
      color: "text-blue-600",
    },
    {
      type: "joined",
      description: "Joined Crypto Enthusiasts group",
      amount: "",
      date: "3 days ago",
      icon: "Users",
      color: "text-purple-600",
    },
  ];

  const value: UserContextType = {
    // Profile data
    profileData,
    analytics,
    recentActivity,

    // Loading states
    loading: loading || isLoadingProfile,
    isLoadingProfile,
    error: error || (profileError as string | null),

    // Registration state
    showRegistration,
    setShowRegistration,
    registrationData,
    setRegistrationData,
    isRegistrationPending,
    isRegistrationSuccess,
    isRegistrationError,
    registrationError,
    registrationTxData,

    // Edit state
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,

    // Wallet data
    address,
    isConnected: isConnected ?? false,

    // Contract
    contract,

    // Functions
    refreshUserData,
    refetchProfile,
    handleRegistration,
    handleSaveProfile,
    generateNewRegistrationAvatar,
    generateNewEditAvatar,

    // Computed values
    isRegistered: profileData.isRegistered,
    userProfile: profileData, // Alias for compatibility
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
