import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { Metadata, ProjectId } from "config/constants/wagmi";

import { WagmiConfig } from "wagmi";
import { bsc, mainnet, arbitrum, polygon, avalanche, fantom, cronos, brise, bscTestnet, goerli } from "../chains";

const chains = [bsc, mainnet, arbitrum, polygon, avalanche, fantom, cronos, brise, bscTestnet, goerli];
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: ProjectId,
  metadata: Metadata,
});
createWeb3Modal({ wagmiConfig, projectId: ProjectId, chains });

export function WagmiProvider(props) {
  return <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>;
}
