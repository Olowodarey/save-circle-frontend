import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StarknetProvider } from "@/app/provider/starknet-provider" ;
import {Toaster} from "sonner";
import {UserProvider} from "@/contexts/UserContext"
import { AppNavigation } from "@/components/navigation/app-navigation"
import { GroupsPreloader } from "@/components/providers/groups-preloader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Save Circle - Decentralized Savings Platform",
  description:
    "Join the future of community savings with Save Circle. Create or join Esusu groups, build your reputation, and grow your wealth together on Starknet.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    // Optional: Add multiple sizes for better compatibility
    // icon: [
    //   { url: '/favicon.svg', type: 'image/svg+xml' },
    //   { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    // ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StarknetProvider>  
          <UserProvider>
            <GroupsPreloader />
            <AppNavigation />
            {children}
          </UserProvider>
          <Toaster position="top-right"/>
        </StarknetProvider>
        </body>
    </html>
  )
}