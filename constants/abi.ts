export const MY_CONTRACT_ABI = 

    [
      {
        "type": "function",
        "name": "pause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "unpause",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "impl",
        "name": "UpgradeableImpl",
        "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
      },
      {
        "type": "interface",
        "name": "openzeppelin_upgrades::interface::IUpgradeable",
        "items": [
          {
            "type": "function",
            "name": "upgrade",
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
        "type": "impl",
        "name": "SavecircleImpl",
        "interface_name": "save_circle::interfaces::Isavecircle::Isavecircle"
      },
      {
        "type": "struct",
        "name": "core::byte_array::ByteArray",
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
        "type": "enum",
        "name": "core::bool",
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
        "type": "struct",
        "name": "core::integer::u256",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::UserProfile",
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
        "type": "enum",
        "name": "save_circle::enums::Enums::ActivityType",
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
        "type": "enum",
        "name": "core::option::Option::<core::integer::u256>",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::UserActivity",
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
        "type": "enum",
        "name": "save_circle::enums::Enums::LockType",
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
        "type": "enum",
        "name": "save_circle::enums::Enums::TimeUnit",
        "variants": [
          {
            "name": "Hours",
            "type": "()"
          },
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
        "type": "enum",
        "name": "save_circle::enums::Enums::GroupState",
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
        "type": "enum",
        "name": "save_circle::enums::Enums::GroupVisibility",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::GroupInfo",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::UserStatistics",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::ProfileViewData",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::GroupMember",
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
        "type": "struct",
        "name": "save_circle::structs::Structs::UserGroupDetails",
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
        "type": "interface",
        "name": "save_circle::interfaces::Isavecircle::Isavecircle",
        "items": [
          {
            "type": "function",
            "name": "register_user",
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
            "type": "function",
            "name": "get_user_profile_view_data",
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
            "type": "function",
            "name": "create_public_group",
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
            "type": "function",
            "name": "get_group_info",
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
            "type": "function",
            "name": "create_private_group",
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
            "type": "function",
            "name": "get_user_profile",
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
            "type": "function",
            "name": "join_group",
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
            "type": "function",
            "name": "get_group_member",
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
            "type": "function",
            "name": "get_user_member_index",
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
            "type": "function",
            "name": "get_user_joined_groups",
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
            "type": "function",
            "name": "get_user_activities",
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
            "type": "function",
            "name": "get_user_statistics",
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
            "type": "function",
            "name": "is_group_member",
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
            "type": "function",
            "name": "lock_liquidity",
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
            "type": "function",
            "name": "get_locked_balance",
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
            "type": "function",
            "name": "withdraw_locked",
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
            "type": "function",
            "name": "get_penalty_locked",
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
            "type": "function",
            "name": "has_completed_circle",
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
            "type": "function",
            "name": "contribute",
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
            "type": "function",
            "name": "get_insurance_pool_balance",
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
            "type": "function",
            "name": "activate_group",
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
            "type": "function",
            "name": "distribute_payout",
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
            "type": "function",
            "name": "claim_payout",
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
            "type": "function",
            "name": "get_next_payout_recipient",
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
            "type": "function",
            "name": "get_payout_order",
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
            "type": "function",
            "name": "admin_withdraw_from_pool",
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
          },
          {
            "type": "function",
            "name": "get_group_locked_funds",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              }
            ],
            "outputs": [
              {
                "type": "(core::integer::u256, core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>)"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_cycle_contributors",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              },
              {
                "name": "cycle",
                "type": "core::integer::u64"
              }
            ],
            "outputs": [
              {
                "type": "(core::integer::u256, core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>)"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_contribution_deadline",
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
                "type": "core::integer::u64"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_missed_deadline_penalty",
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
                "type": "core::integer::u256"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_time_until_deadline",
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
                "type": "core::integer::u64"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "track_missed_deadline_penalty",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              },
              {
                "name": "user",
                "type": "core::starknet::contract_address::ContractAddress"
              },
              {
                "name": "penalty_amount",
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
            "type": "function",
            "name": "check_and_apply_deadline_penalty",
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
                "type": "core::integer::u256"
              }
            ],
            "state_mutability": "external"
          },
          {
            "type": "function",
            "name": "remove_member_from_group",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              },
              {
                "name": "member_address",
                "type": "core::starknet::contract_address::ContractAddress"
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
            "type": "function",
            "name": "add_admin",
            "inputs": [
              {
                "name": "new_admin",
                "type": "core::starknet::contract_address::ContractAddress"
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
            "type": "function",
            "name": "admin_contribute_from_lock",
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
            "state_mutability": "external"
          },
          {
            "type": "function",
            "name": "get_current_cycle",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              }
            ],
            "outputs": [
              {
                "type": "core::integer::u64"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_current_cycle_contributors",
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
            "type": "function",
            "name": "get_group_total_contributions",
            "inputs": [
              {
                "name": "group_id",
                "type": "core::integer::u256"
              }
            ],
            "outputs": [
              {
                "type": "(core::integer::u256, core::integer::u256, core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>)"
              }
            ],
            "state_mutability": "view"
          },
          {
            "type": "function",
            "name": "get_held_payouts",
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
            "state_mutability": "view"
          }
        ]
      },
      {
        "type": "impl",
        "name": "PausableImpl",
        "interface_name": "openzeppelin_security::interface::IPausable"
      },
      {
        "type": "interface",
        "name": "openzeppelin_security::interface::IPausable",
        "items": [
          {
            "type": "function",
            "name": "is_paused",
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
        "type": "impl",
        "name": "AccessControlMixinImpl",
        "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
      },
      {
        "type": "interface",
        "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
        "items": [
          {
            "type": "function",
            "name": "has_role",
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
            "type": "function",
            "name": "get_role_admin",
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
            "type": "function",
            "name": "grant_role",
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
            "type": "function",
            "name": "revoke_role",
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
            "type": "function",
            "name": "renounce_role",
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
            "type": "function",
            "name": "hasRole",
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
            "type": "function",
            "name": "getRoleAdmin",
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
            "type": "function",
            "name": "grantRole",
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
            "type": "function",
            "name": "revokeRole",
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
            "type": "function",
            "name": "renounceRole",
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
            "type": "function",
            "name": "supports_interface",
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
        "type": "constructor",
        "name": "constructor",
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
        "type": "event",
        "name": "openzeppelin_security::pausable::PausableComponent::Paused",
        "kind": "struct",
        "members": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
        "kind": "struct",
        "members": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_security::pausable::PausableComponent::Event",
        "kind": "enum",
        "variants": [
          {
            "name": "Paused",
            "type": "openzeppelin_security::pausable::PausableComponent::Paused",
            "kind": "nested"
          },
          {
            "name": "Unpaused",
            "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
            "kind": "nested"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
        "kind": "struct",
        "members": [
          {
            "name": "role",
            "type": "core::felt252",
            "kind": "data"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
        "kind": "struct",
        "members": [
          {
            "name": "role",
            "type": "core::felt252",
            "kind": "data"
          },
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
        "kind": "struct",
        "members": [
          {
            "name": "role",
            "type": "core::felt252",
            "kind": "data"
          },
          {
            "name": "previous_admin_role",
            "type": "core::felt252",
            "kind": "data"
          },
          {
            "name": "new_admin_role",
            "type": "core::felt252",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
        "kind": "enum",
        "variants": [
          {
            "name": "RoleGranted",
            "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
            "kind": "nested"
          },
          {
            "name": "RoleRevoked",
            "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
            "kind": "nested"
          },
          {
            "name": "RoleAdminChanged",
            "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
            "kind": "nested"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_introspection::src5::SRC5Component::Event",
        "kind": "enum",
        "variants": []
      },
      {
        "type": "event",
        "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
        "kind": "struct",
        "members": [
          {
            "name": "class_hash",
            "type": "core::starknet::class_hash::ClassHash",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
        "kind": "enum",
        "variants": [
          {
            "name": "Upgraded",
            "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
            "kind": "nested"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::UserRegistered",
        "kind": "struct",
        "members": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "name",
            "type": "core::byte_array::ByteArray",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::GroupCreated",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "creator",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "member_limit",
            "type": "core::integer::u32",
            "kind": "data"
          },
          {
            "name": "contribution_amount",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "cycle_duration",
            "type": "core::integer::u64",
            "kind": "data"
          },
          {
            "name": "cycle_unit",
            "type": "save_circle::enums::Enums::TimeUnit",
            "kind": "data"
          },
          {
            "name": "visibility",
            "type": "save_circle::enums::Enums::GroupVisibility",
            "kind": "data"
          },
          {
            "name": "requires_lock",
            "type": "core::bool",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::UsersInvited",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "inviter",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "invitees",
            "type": "core::array::Array::<core::starknet::contract_address::ContractAddress>",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::UserJoinedGroup",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "member_index",
            "type": "core::integer::u32",
            "kind": "data"
          },
          {
            "name": "joined_at",
            "type": "core::integer::u64",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::FundsWithdrawn",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "amount",
            "type": "core::integer::u256",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::ContributionMade",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "contribution_amount",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "insurance_fee",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "total_paid",
            "type": "core::integer::u256",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::PayoutDistributed",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "amount",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "cycle",
            "type": "core::integer::u64",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::PayoutSent",
        "kind": "struct",
        "members": [
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "amount",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "cycle_number",
            "type": "core::integer::u64",
            "kind": "data"
          },
          {
            "name": "timestamp",
            "type": "core::integer::u64",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::events::Events::AdminPoolWithdrawal",
        "kind": "struct",
        "members": [
          {
            "name": "admin",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "group_id",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "amount",
            "type": "core::integer::u256",
            "kind": "data"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
          },
          {
            "name": "remaining_balance",
            "type": "core::integer::u256",
            "kind": "data"
          }
        ]
      },
      {
        "type": "event",
        "name": "save_circle::contracts::Savecircle::SaveCircle::Event",
        "kind": "enum",
        "variants": [
          {
            "name": "PausableEvent",
            "type": "openzeppelin_security::pausable::PausableComponent::Event",
            "kind": "flat"
          },
          {
            "name": "AccessControlEvent",
            "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
            "kind": "flat"
          },
          {
            "name": "SRC5Event",
            "type": "openzeppelin_introspection::src5::SRC5Component::Event",
            "kind": "flat"
          },
          {
            "name": "UpgradeableEvent",
            "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
            "kind": "flat"
          },
          {
            "name": "UserRegistered",
            "type": "save_circle::events::Events::UserRegistered",
            "kind": "nested"
          },
          {
            "name": "GroupCreated",
            "type": "save_circle::events::Events::GroupCreated",
            "kind": "nested"
          },
          {
            "name": "UsersInvited",
            "type": "save_circle::events::Events::UsersInvited",
            "kind": "nested"
          },
          {
            "name": "UserJoinedGroup",
            "type": "save_circle::events::Events::UserJoinedGroup",
            "kind": "nested"
          },
          {
            "name": "FundsWithdrawn",
            "type": "save_circle::events::Events::FundsWithdrawn",
            "kind": "nested"
          },
          {
            "name": "ContributionMade",
            "type": "save_circle::events::Events::ContributionMade",
            "kind": "nested"
          },
          {
            "name": "PayoutDistributed",
            "type": "save_circle::events::Events::PayoutDistributed",
            "kind": "nested"
          },
          {
            "name": "PayoutSent",
            "type": "save_circle::events::Events::PayoutSent",
            "kind": "nested"
          },
          {
            "name": "AdminPoolWithdrawal",
            "type": "save_circle::events::Events::AdminPoolWithdrawal",
            "kind": "nested"
          }
        ]
      }
    ]
    
    
   
    
    
