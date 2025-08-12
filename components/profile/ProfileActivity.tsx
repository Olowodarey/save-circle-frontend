import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react"

interface Activity {
  type: string
  description: string
  amount: string
  date: string
  icon: any
  color: string
}

interface ProfileActivityProps {
  recentActivity: Activity[]
}

export default function ProfileActivity({ recentActivity }: ProfileActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest transactions and group activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <activity.icon
                    className={`w-5 h-5 ${activity.color}`}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.date}
                  </p>
                </div>
              </div>
              {activity.amount && (
                <span
                  className={`font-medium ${
                    activity.amount.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {activity.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
