"use client";
import React from "react";
 
import { sepolia, mainnet} from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  publicProvider,
  ready,
  braavos,
  useInjectedConnectors,
  voyager,
  argent,
} from "@starknet-react/core";
 
export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Always show recommended connectors for better mobile support
    includeRecommended: "always",
    // Order connectors with most popular first
    order: "alphabetical",
  });


  const provider = jsonRpcProvider({
    rpc: () => {
      return {
        nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_8/xi0vRGP4g0IT5lePSjZHm",
        headers: {
          "Content-Type": "application/json",
        },
      };
    },
  });
 
  // Fallback provider for better mobile compatibility
  const fallbackProvider = publicProvider();
 
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}