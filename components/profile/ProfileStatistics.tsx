import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Analytics {
  joinedGroups: number
  createdGroups: number
  activeGroups: number
  completedCycles: number
  totalPayments: number
  onTimePayments: number
}

interface ProfileStatisticsProps {
  analytics: Analytics
}

export default function ProfileStatistics({ analytics }: ProfileStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Participation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Groups Joined</span>
            <span className="font-semibold">
              {analytics.joinedGroups}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Groups Created</span>
            <span className="font-semibold">
              {analytics.createdGroups}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Currently Active</span>
            <span className="font-semibold">
              {analytics.activeGroups}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Completed Cycles</span>
            <span className="font-semibold">
              {analytics.completedCycles}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Payments</span>
            <span className="font-semibold">
              {analytics.totalPayments}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">On-Time Payments</span>
            <span className="font-semibold text-green-600">
              {analytics.onTimePayments}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Late Payments</span>
            <span className="font-semibold text-red-600">
              {analytics.totalPayments - analytics.onTimePayments}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Success Rate</span>
            <span className="font-semibold">
              {analytics.totalPayments > 0
                ? `${Math.round(
                    (analytics.onTimePayments / analytics.totalPayments) * 100
                  )}%`
                : "0%"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
