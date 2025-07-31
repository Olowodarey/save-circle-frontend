import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StarknetProvider } from "@/components/starknet-provider" ;

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Save Circle - Decentralized Savings Platform",
  description:
    "Join the future of community savings with Save Circle. Create or join Esusu groups, build your reputation, and grow your wealth together on Starknet.",
    generator: 'v0.dev'
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
          {children}
        </StarknetProvider>
        </body>
    </html>
  )
}
