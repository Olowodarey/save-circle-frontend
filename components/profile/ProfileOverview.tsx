import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Clock,
} from "lucide-react"

interface Analytics {
  completedCycles: number
  totalEarned: number
  averageContribution: number
  onTimePayments: number
  totalPayments: number
}

interface ProfileData {
  reputationScore: number
}

interface ProfileOverviewProps {
  analytics: Analytics
  profileData: ProfileData
}

export default function ProfileOverview({ analytics, profileData }: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Cycles
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.completedCycles}
            </div>
            <p className="text-xs text-muted-foreground">
              100% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earned
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalEarned.toLocaleString()} USDC
            </div>
            <p className="text-xs text-muted-foreground">
              From completed cycles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Contribution
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageContribution} USDC
            </div>
            <p className="text-xs text-muted-foreground">Per cycle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Rate
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (analytics.onTimePayments / analytics.totalPayments) * 100
              )}
              %
            </div>
            <Progress
              value={
                (analytics.onTimePayments / analytics.totalPayments) * 100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Reputation Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Reputation Progress</CardTitle>
          <CardDescription>
            Your journey to the next reputation tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Advanced (75+)</span>
              <span className="text-sm text-gray-600">
                {profileData.reputationScore}/90
              </span>
            </div>
            <Progress
              value={
                ((profileData.reputationScore - 75) / (90 - 75)) * 100
              }
            />
            <p className="text-sm text-gray-600">
              {90 - profileData.reputationScore} points needed to reach
              Expert tier
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
