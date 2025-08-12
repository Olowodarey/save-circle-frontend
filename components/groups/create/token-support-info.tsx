"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface TokenSupportInfoProps {
  supportedTokens: Array<{ value: string; label: string; icon: string }>;
}

export default function TokenSupportInfo({ supportedTokens }: TokenSupportInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="w-5 h-5 text-indigo-600" />
          Multi-Token Support & Automatic Conversion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Supported Tokens</h4>
            <div className="grid grid-cols-2 gap-2">
              {supportedTokens.map((token) => (
                <div key={token.value} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-lg">{token.icon}</span>
                  <span className="font-medium">{token.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">How It Works</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Accept contributions in any supported Starknet token</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Automatic conversion to USDC via integrated DEX protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>All savings stored in stable USDC for consistency</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Real-time conversion rates with minimal slippage</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
