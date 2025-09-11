"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import { ready, braavos, argent, useInjectedConnectors, useAccount, useConnect, useDisconnect } from "@starknet-react/core";


interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
}

export default function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, isPending: isConnecting, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    // Always show recommended connectors for better mobile support
    includeRecommended: "always",
    // Order connectors with most popular first
    order: "alphabetical",
  });

  // Close modal when connection is successful
  useEffect(() => {
    if (isConnected && address) {
      onConnect(activeConnector?.name || "unknown");
      onClose();
      setConnectingWallet(null);
    }
  }, [isConnected, address, activeConnector, onConnect, onClose]);

  // Clear connecting state if error occurs
  useEffect(() => {
    if (error) {
      setConnectingWallet(null);
    }
  }, [error]);

  const handleConnect = async (connector: any) => {
    try {
      setConnectingWallet(connector.id);
      console.log('Attempting to connect to:', connector.name, connector.id);
      
      // For mobile wallets, we might need to handle deep linking
      if (connector.name?.toLowerCase().includes('argent') && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobile ArgentX connection
        console.log('Mobile ArgentX detected, attempting connection...');
      }
      
      await connect({ connector });
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setConnectingWallet(null);
      
      // Show more helpful error message for mobile users
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('Mobile connection failed. User may need to open wallet app first.');
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setConnectingWallet(null);
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

  const getWalletStatus = (connector: any) => {
    if (isConnected && activeConnector?.id === connector.id) {
      return "connected";
    }
    if (connectingWallet === connector.id && isConnecting) {
      return "connecting";
    }
    if (error && connectingWallet === connector.id) {
      return "error";
    }
    return "disconnected";
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                {isConnected ? "Wallet Connected" : "Connect Wallet"}
              </CardTitle>
              <CardDescription>
                {isConnected 
                  ? `Connected to ${activeConnector?.name || "wallet"}`
                  : "Choose a wallet to connect to Save Circle"
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connected Wallet Info */}
          {isConnected && address && (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{activeConnector?.name}</p>
                    <p className="text-sm text-green-700">
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDisconnect}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Instructions */}
          {/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !isConnected && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Mobile Connection Tips:</p>
                  <p className="text-amber-700 mt-1">
                    Make sure your wallet app is installed and try opening it before connecting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet List */}
          {connectors.length > 0 ? (
            <>
              {connectors.map((connector: any) => {
                const status = getWalletStatus(connector);
                const isCurrentlyConnected = status === "connected";
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                return (
                  <div
                    key={connector.id}
                    className={`relative border rounded-lg p-4 transition-all cursor-pointer ${
                      isCurrentlyConnected
                        ? "border-green-300 bg-green-50"
                        : status === "connecting"
                        ? "border-blue-300 bg-blue-50"
                        : status === "error"
                        ? "border-red-300 bg-red-50"
                        : "hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() => !isCurrentlyConnected && handleConnect(connector)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center relative">
                        {connector.icon ? (
                          <img 
                            src={typeof connector.icon === "string" ? connector.icon : connector.icon.light} 
                            alt={connector.name}
                            className="h-8 w-8 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              // e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs absolute"
                          style={{ display: connector.icon ? 'none' : 'flex' }}
                        >
                          {connector.name?.charAt(0) || 'W'}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                          {isCurrentlyConnected && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Connected
                            </Badge>
                          )}
                          {isMobile && connector.name?.toLowerCase().includes('argent') && (
                            <Badge variant="outline" className="text-xs">
                              Mobile
                            </Badge>
                          )}
                        </div>

                        {status === "connecting" && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-blue-600">Connecting...</span>
                          </div>
                        )}
                        
                        {status === "error" && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            <span className="text-xs text-red-600">Connection failed</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(connector);
                              }}
                              className="text-xs text-blue-600 hover:underline ml-1"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open("https://www.argent.xyz/argent-x/", "_blank")}
                >
                  Install ArgentX
                </Button>
              </div>
            </div>
          )}

          {/* Info Section */}
          {connectors.length > 0 && !isConnected && (
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

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-900">Connection Error</p>
                <p className="text-red-700">
                  {error.message || "Failed to connect to wallet. Please try again."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}