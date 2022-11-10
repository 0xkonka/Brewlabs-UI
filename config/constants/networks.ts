import { ChainId } from "@brewlabs/sdk";
import { chainId } from "wagmi";
import { bsc, mainnet, polygon, avalandche, fantomOpera, cronos, brise, bscTest, goerli } from "../../contexts/wagmi";

export const SupportedChains = [bsc, mainnet, polygon, avalandche, fantomOpera, cronos, brise, bscTest, goerli];

export const SUPPORTED_CHAIN_IDS = SupportedChains.map((chain) => chain.id);
export const PAGE_SUPPORTED_CHAINS = {
  farms: [
    ChainId.ETHEREUM,
    ChainId.BSC_MAINNET,
    ChainId.POLYGON,
    ChainId.FANTOM,
    ChainId.AVALANCHE,
    ChainId.CRONOS,
    ChainId.BRISE,
  ],
  pools: [
    ChainId.ETHEREUM,
    ChainId.BSC_MAINNET,
    ChainId.POLYGON,
    ChainId.FANTOM,
    ChainId.AVALANCHE,
    ChainId.CRONOS,
    ChainId.BRISE,
  ],
  swap: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  constructor: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  zapper: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  bridge: [ChainId.GOERLI, ChainId.BSC_TESTNET],
  stables: [],
};

export const CHAIN_KEYS = {
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.GOERLI]: "goerli",
  [ChainId.BSC_MAINNET]: "smartchain",
  [ChainId.BSC_TESTNET]: "chapel",
  [ChainId.POLYGON]: "polygon",
  [ChainId.FANTOM]: "fantom",
  [ChainId.AVALANCHE]: "avalanchec",
  [ChainId.CRONOS]: "cronos",
  [ChainId.BRISE]: "brise",
};

export const EXPLORER_NAMES = {
  [ChainId.ETHEREUM]: "Etherscan",
  [ChainId.GOERLI]: "Etherscan",
  [ChainId.BSC_MAINNET]: "BscScan",
  [ChainId.BSC_TESTNET]: "BscScan",
  [ChainId.POLYGON]: "Polygonscan",
  [ChainId.FANTOM]: "FTMScan",
  [ChainId.AVALANCHE]: "Snowtrace",
  [ChainId.CRONOS]: "CronoScan",
  [ChainId.BRISE]: "BriseScan",
};

export const CHAIN_LABLES = {
  [ChainId.ETHEREUM]: "Ethereum",
  [ChainId.GOERLI]: "Goerli",
  [ChainId.BSC_MAINNET]: "BNB Smart Chain",
  [ChainId.BSC_TESTNET]: "BSC Testnet",
  [ChainId.POLYGON]: "Polygon Chain",
  [ChainId.FANTOM]: "Fantom Chain",
  [ChainId.AVALANCHE]: "Avalanche",
  [ChainId.CRONOS]: "Cronos Chain",
  [ChainId.BRISE]: "Brise Chain",
};

export const CHAIN_ICONS = {
  [ChainId.ETHEREUM]: "/images/networks/eth.svg",
  [ChainId.GOERLI]: "/images/networks/eth.svg",
  [ChainId.BSC_MAINNET]: "/images/networks/bsc.png",
  [ChainId.BSC_TESTNET]: "/images/networks/bsc.png",
  [ChainId.POLYGON]: "/images/networks/polygon.png",
  [ChainId.FANTOM]: "/images/networks/ftm.svg",
  [ChainId.AVALANCHE]: "/images/networks/avalanche.svg",
  [ChainId.CRONOS]: "/images/networks/cronos.png",
  [ChainId.BRISE]: "/images/networks/bitgert.png",
};

export const NetworkOptions = SUPPORTED_CHAIN_IDS.map((chainId: ChainId) => ({
  id: chainId,
  name: CHAIN_LABLES[chainId],
  image: CHAIN_ICONS[chainId],
}));
