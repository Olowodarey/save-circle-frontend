"use client";

import { useConnect, type Connector } from "@starknet-react/core";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Wallet, AlertCircle } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletType: string) => void
}

export default function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const { connectors, connectAsync, isPending, isSuccess, isError, error, reset } = useConnect();
  // Only show installed wallets
  const availableWallets = connectors

  const handleConnect = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
      if (isSuccess) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
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
          {availableWallets.length > 0 ? (
            <>
              {availableWallets.map((connector) => (
                <div
                  key={connector.id}
                  className={`relative border rounded-lg p-4 transition-all hover:border-blue-300 hover:bg-blue-50 cursor-pointer`}
                  onClick={() => handleConnect(connector)}
                >
                  {/* {connector.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-600">Popular</Badge>
                  )} */}

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center">
                      <img
                        src={connector.icon || "/placeholder.svg"}
                        alt={connector.name}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling!.style.display = "flex"
                        }}
                      />
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm hidden">
                        {connector.name.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                      {/* <p className="text-sm text-gray-600">{connector.description}</p> */}

                      {isPending && ( 
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-blue-600">Connecting...</span>
                        </div>
                      )}
                      
                      {isError && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-red-600">Connection failed</span>
                          <button 
                            onClick={reset}
                            className="text-xs text-blue-600 hover:underline ml-1"
                          >
                            Retry
                          </button>
                        </div>
                      )} 
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Wallets Found</h3>
              <p className="text-gray-600 mb-4">Please install a Starknet wallet to connect to Save Circle.</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Supported wallets:</p>
                <ul className="space-y-1">
                  <li>• ArgentX (Recommended)</li>
                  <li>• Braavos</li>
                  <li>• OKX Wallet</li>
                </ul>
              </div>
            </div>
          )}

          {availableWallets.length > 0 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}