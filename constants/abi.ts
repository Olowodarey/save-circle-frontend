export const  MY_CONTRACT_ABI = [
    {
      "name": "pause",
      "type": "function",
      "inputs": [],
      "outputs": [],
      "state_mutability": "external"
    },
    {
      "name": "unpause",
      "type": "function",
      "inputs": [],
      "outputs": [],
      "state_mutability": "external"
    },
    {
      "name": "add_admin",
      "type": "function",
      "inputs": [
        {
          "name": "new_admin",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ],
      "outputs": [],
      "state_mutability": "external"
    },
    {
      "name": "UpgradeableImpl",
      "type": "impl",
      "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
    },
    {
      "name": "openzeppelin_upgrades::interface::IUpgradeable",
      "type": "interface",
      "items": [
        {
          "name": "upgrade",
          "type": "function",
          "inputs": [
            {
              "name": "new_class_hash",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "SavecircleImpl",
      "type": "impl",
      "interface_name": "save_circle::interfaces::Isavecircle::Isavecircle"
    },
    {
      "name": "core::byte_array::ByteArray",
      "type": "struct",
      "members": [
        {
          "name": "data",
          "type": "core::array::Array::<core::bytes_31::bytes31>"
        },
        {
          "name": "pending_word",
          "type": "core::felt252"
        },
        {
          "name": "pending_word_len",
          "type": "core::integer::u32"
        }
      ]
    },
    {
      "name": "core::bool",
      "type": "enum",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "name": "core::integer::u256",
      "type": "struct",
      "members": [
        {
          "name": "low",
          "type": "core::integer::u128"
        },
        {
          "name": "high",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::UserProfile",
      "type": "struct",
      "members": [
        {
          "name": "user_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "name",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "avatar",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "is_registered",
          "type": "core::bool"
        },
        {
          "name": "total_lock_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "profile_created_at",
          "type": "core::integer::u64"
        },
        {
          "name": "reputation_score",
          "type": "core::integer::u32"
        },
        {
          "name": "total_contribution",
          "type": "core::integer::u256"
        },
        {
          "name": "total_joined_groups",
          "type": "core::integer::u32"
        },
        {
          "name": "total_created_groups",
          "type": "core::integer::u32"
        },
        {
          "name": "total_earned",
          "type": "core::integer::u256"
        },
        {
          "name": "completed_cycles",
          "type": "core::integer::u32"
        },
        {
          "name": "active_groups",
          "type": "core::integer::u32"
        },
        {
          "name": "on_time_payments",
          "type": "core::integer::u32"
        },
        {
          "name": "total_payments",
          "type": "core::integer::u32"
        },
        {
          "name": "payment_rate",
          "type": "core::integer::u256"
        },
        {
          "name": "average_contribution",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "name": "save_circle::enums::Enums::ActivityType",
      "type": "enum",
      "variants": [
        {
          "name": "Contribution",
          "type": "()"
        },
        {
          "name": "PayoutReceived",
          "type": "()"
        },
        {
          "name": "GroupJoined",
          "type": "()"
        },
        {
          "name": "GroupCreated",
          "type": "()"
        },
        {
          "name": "GroupCompleted",
          "type": "()"
        },
        {
          "name": "GroupLeft",
          "type": "()"
        },
        {
          "name": "LockDeposited",
          "type": "()"
        },
        {
          "name": "LockWithdrawn",
          "type": "()"
        },
        {
          "name": "PenaltyPaid",
          "type": "()"
        },
        {
          "name": "ReputationGained",
          "type": "()"
        },
        {
          "name": "ReputationLost",
          "type": "()"
        },
        {
          "name": "UserRegistered",
          "type": "()"
        }
      ]
    },
    {
      "name": "core::option::Option::<core::integer::u256>",
      "type": "enum",
      "variants": [
        {
          "name": "Some",
          "type": "core::integer::u256"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::UserActivity",
      "type": "struct",
      "members": [
        {
          "name": "activity_id",
          "type": "core::integer::u256"
        },
        {
          "name": "user_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "activity_type",
          "type": "save_circle::enums::Enums::ActivityType"
        },
        {
          "name": "description",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "amount",
          "type": "core::integer::u256"
        },
        {
          "name": "group_id",
          "type": "core::option::Option::<core::integer::u256>"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64"
        },
        {
          "name": "is_positive_amount",
          "type": "core::bool"
        }
      ]
    },
    {
      "name": "save_circle::enums::Enums::LockType",
      "type": "enum",
      "variants": [
        {
          "name": "Progressive",
          "type": "()"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "name": "save_circle::enums::Enums::TimeUnit",
      "type": "enum",
      "variants": [
        {
          "name": "Days",
          "type": "()"
        },
        {
          "name": "Weeks",
          "type": "()"
        },
        {
          "name": "Months",
          "type": "()"
        }
      ]
    },
    {
      "name": "save_circle::enums::Enums::GroupState",
      "type": "enum",
      "variants": [
        {
          "name": "Created",
          "type": "()"
        },
        {
          "name": "Active",
          "type": "()"
        },
        {
          "name": "Completed",
          "type": "()"
        },
        {
          "name": "Defaulted",
          "type": "()"
        }
      ]
    },
    {
      "name": "save_circle::enums::Enums::GroupVisibility",
      "type": "enum",
      "variants": [
        {
          "name": "Public",
          "type": "()"
        },
        {
          "name": "Private",
          "type": "()"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::GroupInfo",
      "type": "struct",
      "members": [
        {
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "name": "group_name",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "description",
          "type": "core::byte_array::ByteArray"
        },
        {
          "name": "creator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "member_limit",
          "type": "core::integer::u32"
        },
        {
          "name": "contribution_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "lock_type",
          "type": "save_circle::enums::Enums::LockType"
        },
        {
          "name": "cycle_duration",
          "type": "core::integer::u64"
        },
        {
          "name": "cycle_unit",
          "type": "save_circle::enums::Enums::TimeUnit"
        },
        {
          "name": "members",
          "type": "core::integer::u32"
        },
        {
          "name": "state",
          "type": "save_circle::enums::Enums::GroupState"
        },
        {
          "name": "current_cycle",
          "type": "core::integer::u64"
        },
        {
          "name": "payout_order",
          "type": "core::integer::u32"
        },
        {
          "name": "start_time",
          "type": "core::integer::u64"
        },
        {
          "name": "last_payout_time",
          "type": "core::integer::u64"
        },
        {
          "name": "total_cycles",
          "type": "core::integer::u32"
        },
        {
          "name": "visibility",
          "type": "save_circle::enums::Enums::GroupVisibility"
        },
        {
          "name": "requires_lock",
          "type": "core::bool"
        },
        {
          "name": "requires_reputation_score",
          "type": "core::integer::u32"
        },
        {
          "name": "completed_cycles",
          "type": "core::integer::u32"
        },
        {
          "name": "total_pool_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "remaining_pool_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "next_payout_recipient",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "is_active",
          "type": "core::bool"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::UserStatistics",
      "type": "struct",
      "members": [
        {
          "name": "user_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "total_saved",
          "type": "core::integer::u256"
        },
        {
          "name": "total_earned",
          "type": "core::integer::u256"
        },
        {
          "name": "success_rate",
          "type": "core::integer::u32"
        },
        {
          "name": "average_cycle_duration",
          "type": "core::integer::u64"
        },
        {
          "name": "favorite_contribution_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "longest_active_streak",
          "type": "core::integer::u32"
        },
        {
          "name": "current_active_streak",
          "type": "core::integer::u32"
        },
        {
          "name": "groups_completed_successfully",
          "type": "core::integer::u32"
        },
        {
          "name": "groups_left_early",
          "type": "core::integer::u32"
        },
        {
          "name": "total_penalties_paid",
          "type": "core::integer::u256"
        },
        {
          "name": "updated_at",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::ProfileViewData",
      "type": "struct",
      "members": [
        {
          "name": "profile",
          "type": "save_circle::structs::Structs::UserProfile"
        },
        {
          "name": "recent_activities",
          "type": "core::array::Array::<save_circle::structs::Structs::UserActivity>"
        },
        {
          "name": "joined_groups",
          "type": "core::array::Array::<save_circle::structs::Structs::GroupInfo>"
        },
        {
          "name": "statistics",
          "type": "save_circle::structs::Structs::UserStatistics"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::GroupMember",
      "type": "struct",
      "members": [
        {
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "name": "locked_amount",
          "type": "core::integer::u256"
        },
        {
          "name": "joined_at",
          "type": "core::integer::u64"
        },
        {
          "name": "member_index",
          "type": "core::integer::u32"
        },
        {
          "name": "payout_cycle",
          "type": "core::integer::u32"
        },
        {
          "name": "has_been_paid",
          "type": "core::bool"
        },
        {
          "name": "contribution_count",
          "type": "core::integer::u32"
        },
        {
          "name": "late_contributions",
          "type": "core::integer::u32"
        },
        {
          "name": "missed_contributions",
          "type": "core::integer::u32"
        },
        {
          "name": "total_contributed",
          "type": "core::integer::u256"
        },
        {
          "name": "total_recieved",
          "type": "core::integer::u256"
        },
        {
          "name": "is_active",
          "type": "core::bool"
        }
      ]
    },
    {
      "name": "save_circle::structs::Structs::UserGroupDetails",
      "type": "struct",
      "members": [
        {
          "name": "group_info",
          "type": "save_circle::structs::Structs::GroupInfo"
        },
        {
          "name": "member_data",
          "type": "save_circle::structs::Structs::GroupMember"
        },
        {
          "name": "next_payout_date",
          "type": "core::integer::u64"
        },
        {
          "name": "position_in_queue",
          "type": "core::integer::u32"
        },
        {
          "name": "total_contributed_so_far",
          "type": "core::integer::u256"
        },
        {
          "name": "expected_payout_amount",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "name": "save_circle::interfaces::Isavecircle::Isavecircle",
      "type": "interface",
      "items": [
        {
          "name": "register_user",
          "type": "function",
          "inputs": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "avatar",
              "type": "core::byte_array::ByteArray"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_user_profile_view_data",
          "type": "function",
          "inputs": [
            {
              "name": "user_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::ProfileViewData"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "create_public_group",
          "type": "function",
          "inputs": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "description",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "member_limit",
              "type": "core::integer::u32"
            },
            {
              "name": "contribution_amount",
              "type": "core::integer::u256"
            },
            {
              "name": "lock_type",
              "type": "save_circle::enums::Enums::LockType"
            },
            {
              "name": "cycle_duration",
              "type": "core::integer::u64"
            },
            {
              "name": "cycle_unit",
              "type": "save_circle::enums::Enums::TimeUnit"
            },
            {
              "name": "requires_lock",
              "type": "core::bool"
            },
            {
              "name": "min_reputation_score",
              "type": "core::integer::u32"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_group_info",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::GroupInfo"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "create_private_group",
          "type": "function",
          "inputs": [
            {
              "name": "name",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "description",
              "type": "core::byte_array::ByteArray"
            },
            {
              "name": "member_limit",
              "type": "core::integer::u32"
            },
            {
              "name": "contribution_amount",
              "type": "core::integer::u256"
            },
            {
              "name": "cycle_duration",
              "type": "core::integer::u64"
            },
            {
              "name": "cycle_unit",
              "type": "save_circle::enums::Enums::TimeUnit"
            },
            {
              "name": "invited_members",
              "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
            },
            {
              "name": "requires_lock",
              "type": "core::bool"
            },
            {
              "name": "lock_type",
              "type": "save_circle::enums::Enums::LockType"
            },
            {
              "name": "min_reputation_score",
              "type": "core::integer::u32"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_user_profile",
          "type": "function",
          "inputs": [
            {
              "name": "user_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::UserProfile"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "join_group",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_group_member",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            },
            {
              "name": "member_index",
              "type": "core::integer::u32"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::GroupMember"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_member_index",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_joined_groups",
          "type": "function",
          "inputs": [
            {
              "name": "user_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<save_circle::structs::Structs::UserGroupDetails>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_activities",
          "type": "function",
          "inputs": [
            {
              "name": "user_address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "limit",
              "type": "core::integer::u32"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<save_circle::structs::Structs::UserActivity>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_user_statistics",
          "type": "function",
          "inputs": [
            {
              "name": "user_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::UserStatistics"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_group_member",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            },
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "lock_liquidity",
          "type": "function",
          "inputs": [
            {
              "name": "token_address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "amount",
              "type": "core::integer::u256"
            },
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_locked_balance",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "withdraw_locked",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_penalty_locked",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "has_completed_circle",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "contribute",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_insurance_pool_balance",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "activate_group",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "distribute_payout",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "name": "get_next_payout_recipient",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "save_circle::structs::Structs::GroupMember"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_payout_order",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "admin_withdraw_from_pool",
          "type": "function",
          "inputs": [
            {
              "name": "group_id",
              "type": "core::integer::u256"
            },
            {
              "name": "amount",
              "type": "core::integer::u256"
            },
            {
              "name": "recipient",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        }
      ]
    },
    {
      "name": "PausableImpl",
      "type": "impl",
      "interface_name": "openzeppelin_security::interface::IPausable"
    },
    {
      "name": "openzeppelin_security::interface::IPausable",
      "type": "interface",
      "items": [
        {
          "name": "is_paused",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "name": "AccessControlMixinImpl",
      "type": "impl",
      "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
    },
    {
      "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
      "type": "interface",
      "items": [
        {
          "name": "has_role",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_role_admin",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "grant_role",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "revoke_role",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "renounce_role",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "hasRole",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "getRoleAdmin",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::felt252"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "grantRole",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "revokeRole",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "renounceRole",
          "type": "function",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "supports_interface",
          "type": "function",
          "inputs": [
            {
              "name": "interface_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "name": "constructor",
      "type": "constructor",
      "inputs": [
        {
          "name": "default_admin",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "token_address",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_security::pausable::PausableComponent::Paused",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_security::pausable::PausableComponent::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "Paused",
          "type": "openzeppelin_security::pausable::PausableComponent::Paused"
        },
        {
          "kind": "nested",
          "name": "Unpaused",
          "type": "openzeppelin_security::pausable::PausableComponent::Unpaused"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "role",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "sender",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "role",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "sender",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "role",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "previous_admin_role",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "new_admin_role",
          "type": "core::felt252"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "RoleGranted",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted"
        },
        {
          "kind": "nested",
          "name": "RoleRevoked",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked"
        },
        {
          "kind": "nested",
          "name": "RoleAdminChanged",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_introspection::src5::SRC5Component::Event",
      "type": "event",
      "variants": []
    },
    {
      "kind": "struct",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "class_hash",
          "type": "core::starknet::class_hash::ClassHash"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "Upgraded",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::UserRegistered",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "name",
          "type": "core::byte_array::ByteArray"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::GroupCreated",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "creator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "member_limit",
          "type": "core::integer::u32"
        },
        {
          "kind": "data",
          "name": "contribution_amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "cycle_duration",
          "type": "core::integer::u64"
        },
        {
          "kind": "data",
          "name": "cycle_unit",
          "type": "save_circle::enums::Enums::TimeUnit"
        },
        {
          "kind": "data",
          "name": "visibility",
          "type": "save_circle::enums::Enums::GroupVisibility"
        },
        {
          "kind": "data",
          "name": "requires_lock",
          "type": "core::bool"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::UsersInvited",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "inviter",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "invitees",
          "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::UserJoinedGroup",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "member_index",
          "type": "core::integer::u32"
        },
        {
          "kind": "data",
          "name": "joined_at",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::FundsWithdrawn",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::ContributionMade",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "user",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "contribution_amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "insurance_fee",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "total_paid",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::PayoutDistributed",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "recipient",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "cycle",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::PayoutSent",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "recipient",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "cycle_number",
          "type": "core::integer::u64"
        },
        {
          "kind": "data",
          "name": "timestamp",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "save_circle::events::Events::AdminPoolWithdrawal",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "admin",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "group_id",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "amount",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "recipient",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "remaining_balance",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "save_circle::contracts::Savecircle::SaveCircle::Event",
      "type": "event",
      "variants": [
        {
          "kind": "flat",
          "name": "PausableEvent",
          "type": "openzeppelin_security::pausable::PausableComponent::Event"
        },
        {
          "kind": "flat",
          "name": "AccessControlEvent",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event"
        },
        {
          "kind": "flat",
          "name": "SRC5Event",
          "type": "openzeppelin_introspection::src5::SRC5Component::Event"
        },
        {
          "kind": "flat",
          "name": "UpgradeableEvent",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
        },
        {
          "kind": "nested",
          "name": "UserRegistered",
          "type": "save_circle::events::Events::UserRegistered"
        },
        {
          "kind": "nested",
          "name": "GroupCreated",
          "type": "save_circle::events::Events::GroupCreated"
        },
        {
          "kind": "nested",
          "name": "UsersInvited",
          "type": "save_circle::events::Events::UsersInvited"
        },
        {
          "kind": "nested",
          "name": "UserJoinedGroup",
          "type": "save_circle::events::Events::UserJoinedGroup"
        },
        {
          "kind": "nested",
          "name": "FundsWithdrawn",
          "type": "save_circle::events::Events::FundsWithdrawn"
        },
        {
          "kind": "nested",
          "name": "ContributionMade",
          "type": "save_circle::events::Events::ContributionMade"
        },
        {
          "kind": "nested",
          "name": "PayoutDistributed",
          "type": "save_circle::events::Events::PayoutDistributed"
        },
        {
          "kind": "nested",
          "name": "PayoutSent",
          "type": "save_circle::events::Events::PayoutSent"
        },
        {
          "kind": "nested",
          "name": "AdminPoolWithdrawal",
          "type": "save_circle::events::Events::AdminPoolWithdrawal"
        }
      ]
    }
  ] as const
    
