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
  // Helper function to safely calculate payment rate
  const calculatePaymentRate = () => {
    const { onTimePayments, totalPayments } = analytics;
    
    // Check if values exist and totalPayments is not zero
    if (!totalPayments || totalPayments === 0 || onTimePayments === undefined || onTimePayments === null) {
      return 0;
    }
    
    // Ensure onTimePayments doesn't exceed totalPayments
    const safeOnTimePayments = Math.min(onTimePayments, totalPayments);
    
    return Math.round((safeOnTimePayments / totalPayments) * 100);
  };

  // Helper function to safely calculate reputation progress
  const calculateReputationProgress = () => {
    const score = profileData?.reputationScore || 0;
    
    // Ensure score is within valid range for Advanced tier (75-90)
    if (score < 75) return 0;
    if (score >= 90) return 100;
    
    return ((score - 75) / (90 - 75)) * 100;
  };

  const paymentRate = calculatePaymentRate();
  const reputationProgress = calculateReputationProgress();
  const pointsNeeded = Math.max(0, 90 - (profileData?.reputationScore || 0));

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
              {analytics?.completedCycles || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completedCycles > 0 ? "100% completion rate" : "No completed cycles yet"}
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
              {(analytics?.totalEarned || 0).toLocaleString()} USDC
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
              {analytics?.averageContribution || 0} USDC
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
              {paymentRate}%
            </div>
            <Progress
              value={paymentRate}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {analytics?.onTimePayments || 0} of {analytics?.totalPayments || 0} payments on time
            </p>
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
                {profileData?.reputationScore || 0}/90
              </span>
            </div>
            <Progress
              value={reputationProgress}
            />
            <p className="text-sm text-gray-600">
              {pointsNeeded > 0 
                ? `${pointsNeeded} points needed to reach Expert tier`
                : "Expert tier achieved!"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}