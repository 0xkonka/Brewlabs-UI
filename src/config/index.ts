import { ChainId } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";

import { BIG_TEN } from "utils/bigNumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const SUPPORTED_CHAINS_FOR_MODULES = {
  swap: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  constructor: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
  zapper: [ChainId.ETHEREUM, ChainId.BSC_MAINNET],
};

export const BLOCK_TIMES = {
  [ChainId.ETHEREUM]: 13.25,
  [ChainId.BSC_MAINNET]: 3,
  [ChainId.BSC_TESTNET]: 3,
  [ChainId.POLYGON]: 2.3,
  [ChainId.FANTOM]: 1, //  will be used as per second in fantom
  [ChainId.AVALANCHE]: 3,
  [ChainId.CRONOS]: 6,
  [ChainId.BRISE]: 15,
};

export const SECONDS_PER_YEAR = 365 * 86400; // 10512000
export const BASE_URL = "https://earn.brewlabs.info";

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 200000;

export const BANANA_PER_BLOCK = new BigNumber(10);
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BANANA_PER_YEAR = BANANA_PER_BLOCK.times(BLOCKS_PER_YEAR);

export const COVALENT_API_KEYS = ["cqt_rQYkrrFc34HqD4T4R7XvPM76gh6D", "cqt_rQ4tXTKbyY7qbvywfdQbctPFbjWC"];

export const COVALENT_CHAIN_NAME = {
  [ChainId.ETHEREUM]: "eth-mainnet",
  [ChainId.BSC_MAINNET]: "bsc-mainnet",
  [ChainId.BSC_TESTNET]: "bsc-testnet",
  [ChainId.POLYGON]: "matic-mainnet",
  [ChainId.ARBITRUM]: "arbitrum-aminnet",
  [ChainId.FANTOM]: "fantom-mainnet",
  [ChainId.AVALANCHE]: "avalanche-mainnet",
};

export const UNMARSHAL_API_KEYS = [
  "5yA1HYPCmf4xpXjZQMOAa5BJPnupBs45eLE3D7O1",
  "K82WDxM7Ej3y9u8VSmLYa8pdeqTVqziA2VGQaSRq",
  "81Ev4SteeHa2L23LdTq0e3U1urG82Idc8vtwbiIS",
  "bG6czxhve08cqjNx3tQ8r9P6TDFC8qmI6qwDRXRv",
  "gxzF8K9KM98XQaLuypeVC6HJ9TJq8d0V89nbd7G3",
];

export const UNMARSHAL_CHAIN_NAME = {
  1: "ethereum",
  56: "bsc",
  137: "matic",
};

export const DEX_GURU_CHAIN_NAME = {
  1: "eth",
  56: "bsc",
  137: "polygon",
  [ChainId.ARBITRUM]: "arbitrum",
  8453: "base",
};

export const DEX_GURU_SWAP_AMM = {
  2: "uniswap_v3",
  1: "uniswap",
  4: "pancakeswap",
  193: "pancakeswap_v3",
  60: "pancakeswap_v1",
  3: "sushiswap",
  236: "sushiswap_v3",
};

export const DEXTOOLS_CHAINNAME = {
  1: "ether",
  56: "bsc",
};

export const DEXSCREENER_CHAINNAME = {
  1: "ethereum",
  56: "bsc",
};
