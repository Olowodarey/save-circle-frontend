import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Coins, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {ProtectedLink} from "@/components/ProtectedLinks"

interface HeaderProps {
    setShowWalletModal: (show: boolean) => void;
}

const Navbar = ({ setShowWalletModal }: HeaderProps) => {
    const { address, isConnected, connector: activeConnector } = useAccount();
    const { disconnect } = useDisconnect();

    // Get wallet type from the active connector
    const walletType = activeConnector?.name || "Wallet";

    useEffect(() => {
        // StarkNet React handles connection persistence automatically
        console.log("Wallet connection status:", { isConnected, address, walletType });
    }, [isConnected, address, walletType]);

    const handleDisconnect = async () => {
        try {
            await disconnect();
            console.log("Wallet disconnected successfully");
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        }
    };

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Save Circle</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                  
                    <ProtectedLink setShowWalletModal={setShowWalletModal} href="/groups" className="text-gray-600 hover:text-gray-900">
                        Groups
                    </ProtectedLink>
                    <ProtectedLink setShowWalletModal={setShowWalletModal} href="/profile" className="text-gray-600 hover:text-gray-900">
                        Profile
                    </ProtectedLink>
                    <ProtectedLink setShowWalletModal={setShowWalletModal} href="/reputation" className="text-gray-600 hover:text-gray-900">
                        Reputation
                    </ProtectedLink>
                </nav>
                
                <div className="flex items-center gap-3">
                    {!isConnected ? (
                        <Button onClick={() => setShowWalletModal(true)}>
                            Connect Wallet
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                {walletType}
                            </Badge>
                            <span className="text-sm text-gray-600 font-mono">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                    {/* <Button asChild>
                        <Link href="/dashboard">Launch App</Link>
                    </Button> */}
                </div>
            </div>
        </header>
    );
};

export default Navbar;