"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Wallet, ExternalLink, AlertCircle } from "lucide-react"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletType: string) => void
}

export default function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const wallets = [
    {
      id: "argentx",
      name: "ArgentX",
      description: "The most popular Starknet wallet",
      icon: "/placeholder.svg?height=48&width=48",
      installed: typeof window !== "undefined" && window.starknet_argentX,
      downloadUrl: "https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb",
      popular: true,
    },
    {
      id: "braavos",
      name: "Braavos",
      description: "Smart wallet for Starknet",
      icon: "/placeholder.svg?height=48&width=48",
      installed: typeof window !== "undefined" && window.starknet_braavos,
      downloadUrl: "https://chrome.google.com/webstore/detail/braavos-smart-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma",
      popular: false,
    },
    {
      id: "okx",
      name: "OKX Wallet",
      description: "Multi-chain wallet with Starknet support",
      icon: "/placeholder.svg?height=48&width=48",
      installed: typeof window !== "undefined" && window.okxwallet?.starknet,
      downloadUrl: "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
      popular: false,
    },
  ]

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would implement actual wallet connection logic
      // For now, we'll just simulate a successful connection
      onConnect(walletId)
      onClose()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setConnecting(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>Choose a wallet to connect to Save Circle</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`relative border rounded-lg p-4 transition-all ${
                wallet.installed
                  ? "hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                  : "border-gray-200 bg-gray-50"
              }`}
              onClick={() => wallet.installed && handleConnect(wallet.id)}
            >
              {wallet.popular && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-600">Popular</Badge>
              )}

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center">
                  <img
                    src={wallet.icon || "/placeholder.svg"}
                    alt={wallet.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextElementSibling!.style.display = "flex"
                    }}
                  />
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm hidden">
                    {wallet.name.charAt(0)}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                  <p className="text-sm text-gray-600">{wallet.description}</p>

                  {!wallet.installed && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">Not installed</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {wallet.installed ? (
                    <Button size="sm" disabled={connecting === wallet.id} className="min-w-[80px]">
                      {connecting === wallet.id ? "Connecting..." : "Connect"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(wallet.downloadUrl, "_blank")
                      }}
                      className="min-w-[80px]"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Install
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">New to Starknet?</p>
                <p className="text-blue-700">
                  We recommend starting with ArgentX - it's the most popular and user-friendly Starknet wallet.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
