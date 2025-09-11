import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Wallet,
  TrendingUp,
  Users,
  Star,
  Calendar,
  Save,
  X,
} from "lucide-react"

interface ProfileData {
  name: string
  avatar: string
  walletAddress: string
  isRegistered: boolean
  totalLockAmount: number
  profileCreatedAt: string
  reputationScore: number
}

interface Analytics {
  totalSaved: number
  activeGroups: number
}

interface ProfileHeaderProps {
  profileData: ProfileData
  analytics: Analytics
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  onSaveProfile: () => void
  loading: boolean
}

export default function ProfileHeader({
  profileData,
  analytics,
  isEditing,
  setIsEditing,
  onSaveProfile,
  loading
}: ProfileHeaderProps) {
  const [editForm, setEditForm] = useState({
    name: profileData.name,
    avatar: profileData.avatar,
  })

  const generateNewAvatar = () => {
    const avatars = [
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
      "/placeholder.svg?height=120&width=120",
    ]
    const newAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    setEditForm({ ...editForm, avatar: newAvatar })
  }

  const handleSave = () => {
    onSaveProfile()
    setIsEditing(false)
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={isEditing ? editForm.avatar : profileData.avatar}
              />
              <AvatarFallback className="text-4xl">
                {(isEditing ? editForm.name : profileData.name)
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateNewAvatar}
              >
                Generate New
              </Button>
            )}
          </div>

          <div className="flex-1 w-full min-w-0 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Display Name</Label>
                  <Input
                    id="editName"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                    {profileData.name}
                  </h1>
                  <p className="text-gray-600 font-mono text-xs sm:text-sm mt-1 overflow-hidden text-ellipsis">
                    {profileData.walletAddress}
                  </p>
                </div>

                <div className="flex flex-wrap items-start gap-2 sm:gap-4">
                  <div className="flex-shrink-0">
                    {profileData.isRegistered ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 whitespace-nowrap text-xs sm:text-sm">
                        <User className="w-3 h-3 mr-1 flex-shrink-0" />
                        Registered Member
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 whitespace-nowrap text-xs sm:text-sm">
                        <User className="w-3 h-3 mr-1 flex-shrink-0" />
                        Not Registered
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                      {profileData.reputationScore} Reputation
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 py-1 rounded-md w-full sm:w-auto">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                      Member since {new Date(profileData.profileCreatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="w-full overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 w-full">
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg min-w-0 w-full">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-blue-900 text-sm sm:text-base truncate">
                          Total Locked
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-1 truncate">
                        {profileData.totalLockAmount.toLocaleString()} USDC
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-green-50 rounded-lg min-w-0 w-full">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-900 text-sm sm:text-base truncate">
                          Total Saved
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1 truncate">
                        {analytics.totalSaved.toLocaleString()} USDC
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-purple-50 rounded-lg min-w-0 w-full">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <span className="font-medium text-purple-900 text-sm sm:text-base truncate">
                          Active Groups
                        </span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-purple-900 mt-1">
                        {analytics.activeGroups}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
