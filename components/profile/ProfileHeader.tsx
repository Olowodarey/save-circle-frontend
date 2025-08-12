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

          <div className="flex-1 space-y-4">
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.name}
                  </h1>
                  <p className="text-gray-600 font-mono text-sm mt-1">
                    {profileData.walletAddress}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {profileData.isRegistered ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <User className="w-3 h-3 mr-1" />
                      Registered Member
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <User className="w-3 h-3 mr-1" />
                      Not Registered
                    </Badge>
                  )}
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">
                      {profileData.reputationScore} Reputation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Member since{" "}
                      {new Date(profileData.profileCreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Total Locked
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {profileData.totalLockAmount.toLocaleString()} USDC
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Total Saved
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {analytics.totalSaved.toLocaleString()} USDC
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">
                        Active Groups
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {analytics.activeGroups}
                    </p>
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
