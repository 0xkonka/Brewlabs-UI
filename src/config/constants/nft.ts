import { ChainId } from "@brewlabs/sdk";
import { tokens } from "./tokens";

export const stableCoins = {
  [ChainId.ETHEREUM]: [tokens[ChainId.ETHEREUM].usdc, tokens[ChainId.ETHEREUM].usdt],
  [ChainId.BSC_MAINNET]: [tokens[ChainId.BSC_MAINNET].busd, tokens[ChainId.BSC_MAINNET].usdt],
  [ChainId.POLYGON]: [tokens[ChainId.POLYGON].usdc, tokens[ChainId.POLYGON].usdt],
  [ChainId.BSC_TESTNET]: [tokens[ChainId.BSC_MAINNET].busd],
};
