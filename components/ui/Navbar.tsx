import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Coins, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {ProtectedLink} from "@/components/ProtectedLinks"
import Logo from "@/svg/logo";

interface HeaderProps {
    setShowWalletModal: (show: boolean) => void;
}

const Navbar = ({ setShowWalletModal }: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            <div className="container mx-auto px-4 py-3 sm:py-4">
                {/* Main navbar */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                            <Logo/>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">
                            Save Circle
                        </span>
                        <span className="text-lg font-bold text-gray-900 xs:hidden">
                            SC
                        </span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                        <Link href="/#" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Home
                        </Link>
                        <ProtectedLink setShowWalletModal={setShowWalletModal} href="/groups" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Groups
                        </ProtectedLink>
                        <ProtectedLink setShowWalletModal={setShowWalletModal} href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Profile
                        </ProtectedLink>
                        <ProtectedLink setShowWalletModal={setShowWalletModal} href="/reputation" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Reputation
                        </ProtectedLink>
                        <Link href="/Faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                            FAQ
                        </Link>
                    </nav>
                    
                    {/* Desktop Wallet Section */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-3">
                        {!isConnected ? (
                            <Button 
                                onClick={() => setShowWalletModal(true)}
                                className="text-sm px-3 py-2 lg:px-4"
                            >
                                Connect Wallet
                            </Button>
                        ) : (
                            <div className="flex items-center gap-1 lg:gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                    <span className="hidden lg:inline">{walletType}</span>
                                    <span className="lg:hidden">Connected</span>
                                </Badge>
                                <span className="text-xs lg:text-sm text-gray-600 font-mono hidden sm:inline">
                                    {address?.slice(0, 4)}...{address?.slice(-3)}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleDisconnect} className="p-1 lg:p-2">
                                    <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Mobile Wallet Status */}
                        {isConnected && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                <span className="hidden sm:inline">Connected</span>
                                <span className="sm:hidden">•</span>
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                        <nav className="flex flex-col gap-3 pt-4">
                            <Link 
                                href="/#" 
                                className="text-gray-600 hover:text-gray-900 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <ProtectedLink 
                                setShowWalletModal={setShowWalletModal} 
                                href="/groups" 
                                className="text-gray-600 hover:text-gray-900 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Groups
                            </ProtectedLink>
                            <ProtectedLink 
                                setShowWalletModal={setShowWalletModal} 
                                href="/profile" 
                                className="text-gray-600 hover:text-gray-900 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </ProtectedLink>
                            <ProtectedLink 
                                setShowWalletModal={setShowWalletModal} 
                                href="/reputation" 
                                className="text-gray-600 hover:text-gray-900 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Reputation
                            </ProtectedLink>
                            <Link 
                                href="/Faq" 
                                className="text-gray-600 hover:text-gray-900 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                FAQ
                            </Link>
                            
                            {/* Mobile Wallet Section */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                {!isConnected ? (
                                    <Button 
                                        onClick={() => {
                                            setShowWalletModal(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full"
                                    >
                                        Connect Wallet
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm font-medium text-green-700">{walletType}</span>
                                            </div>
                                            <span className="text-xs text-gray-600 font-mono">
                                                {address?.slice(0, 6)}...{address?.slice(-4)}
                                            </span>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => {
                                                handleDisconnect();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Disconnect Wallet
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;