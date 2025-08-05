// components/ProtectedLink.tsx
import Link from "next/link"
import { useAccount } from "@starknet-react/core"
import { toast } from "sonner" // or your preferred toast library
import { ReactNode } from "react"

interface ProtectedLinkProps {
  href: string
  children: ReactNode
  className?: string
  [key: string]: any // for other props like asChild, etc.
}

export function ProtectedLink({ href, children, className, ...props }: ProtectedLinkProps) {
  const { address, isConnected } = useAccount()

  const handleClick = (e: React.MouseEvent) => {
    if (!isConnected || !address) {
      e.preventDefault()
      toast.error("Please connect your wallet to continue", {
        description: "You need to connect your wallet to access this feature",
        action: {
          label: "Connect Wallet",
          onClick: () => {
            // You can trigger wallet modal here if needed
            // setShowWalletModal(true)
          }
        }
      })
      return false
    }
  }

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}