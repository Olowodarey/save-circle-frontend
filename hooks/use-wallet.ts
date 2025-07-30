"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type React from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  walletType: string | null
  connect: (walletType: string) => Promise<void>
  disconnect: () => void
  isConnecting: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet was previously connected
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("connected-wallet")
      const savedAddress = localStorage.getItem("wallet-address")

      if (savedWallet && savedAddress) {
        setWalletType(savedWallet)
        setAddress(savedAddress)
        setIsConnected(true)
      }
    }
  }, [])

  const connect = async (selectedWalletType: string) => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection for demo
      const mockAddress = "0x1234567890abcdef1234567890abcdef12345678"

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("connected-wallet", selectedWalletType)
        localStorage.setItem("wallet-address", mockAddress)
      }

      // Update state
      setWalletType(selectedWalletType)
      setAddress(mockAddress)
      setIsConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("connected-wallet")
      localStorage.removeItem("wallet-address")
    }
    setWalletType(null)
    setAddress(null)
    setIsConnected(false)
  }

  const value = {
    isConnected,
    address,
    walletType,
    connect,
    disconnect,
    isConnecting,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
