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
} from "@starknet-react/core";
 
export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [ready(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
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
 
 
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}