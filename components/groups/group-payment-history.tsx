"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface PaymentHistoryItem {
  cycle: number;
  recipient: string;
  date: string;
  amount: string;
  status: string;
}

interface GroupPaymentHistoryProps {
  paymentHistory: PaymentHistoryItem[];
}

export default function GroupPaymentHistory({ paymentHistory }: GroupPaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Previous payouts and cycle completions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment history yet</p>
              <p className="text-sm">Payments will appear here once the group starts cycling</p>
            </div>
          ) : (
            paymentHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Cycle {payment.cycle} Payout</h4>
                    <p className="text-sm text-gray-600">
                      Paid to {payment.recipient} on {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{payment.amount}</p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{payment.status}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
