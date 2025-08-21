"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/ui/Navbar"
import WalletConnectModal from "@/components/wallet/wallet-connect-modal"

export function AppNavigation() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const pathname = usePathname()
  
  // Don't show navbar on landing page
  const isLandingPage = pathname === "/"
  
  if (isLandingPage) {
    return null
  }

  return (
    <>
      <Navbar setShowWalletModal={setShowWalletModal} />
      <WalletConnectModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)}
        onConnect={(walletType) => {
          console.log('Connected wallet:', walletType)
          setShowWalletModal(false)
        }}
      />
    </>
  )
}
