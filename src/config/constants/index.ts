import { ChainId, Currency, JSBI, Percent, Token } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";

import { BIG_TEN } from "utils/bigNumber";
import { tokens } from "./tokens";

export const FAST_INTERVAL = 10000;
export const MEDIUM_INTERVAL = 30000;
export const SLOW_INTERVAL = 60000;
export const BIGSLOW_INTERVAL = 60000 * 2;
export const DAY_INTERVAL = 60000 * 24 * 60;
export const SECOND_INTERVAL = 1000;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
// export const API_URL = "http://localhost:5050/api";
export const MULTICALL_FETCH_LIMIT = 120;

export const ETH_ADDRESSES = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000000000",
];
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]?: Currency[];
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    tokens[ChainId.ETHEREUM].weth,
    // tokens[ChainId.ETHEREUM].usdt,
  ],
  [ChainId.BSC_MAINNET]: [
    tokens[ChainId.BSC_MAINNET].wbnb,
    tokens[ChainId.BSC_MAINNET].brews,
    tokens[ChainId.BSC_MAINNET].busd,
    tokens[ChainId.BSC_MAINNET].usdt,
    tokens[ChainId.BSC_MAINNET].btcb,
    tokens[ChainId.BSC_MAINNET].ust,
    tokens[ChainId.BSC_MAINNET].eth,
    tokens[ChainId.BSC_MAINNET].usdc,
  ],
  [ChainId.BSC_TESTNET]: [
    tokens[ChainId.BSC_TESTNET].wbnb,
    tokens[ChainId.BSC_TESTNET].busd,
    tokens[ChainId.BSC_TESTNET].tokenA,
  ],
  [ChainId.POLYGON]: [tokens[ChainId.POLYGON].wmatic, tokens[ChainId.POLYGON].usdt],
  [ChainId.FANTOM]: [tokens[ChainId.FANTOM].wftm, tokens[ChainId.FANTOM].eth, tokens[ChainId.FANTOM].usdc],
  [ChainId.AVALANCHE]: [tokens[ChainId.AVALANCHE].wavax, tokens[ChainId.AVALANCHE].usdc],
  [ChainId.CRONOS]: [tokens[ChainId.CRONOS].wcro, tokens[ChainId.CRONOS].usdc],
  [ChainId.BRISE]: [tokens[ChainId.BRISE].wbrise, tokens[ChainId.BRISE].usdt, tokens[ChainId.BRISE].usdc],
};

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {},
  [ChainId.BSC_MAINNET]: {},
  [ChainId.POLYGON]: {},
  [ChainId.FANTOM]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.CRONOS]: {},
  [ChainId.BRISE]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.BSC_MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {},
  [ChainId.BSC_MAINNET]: {},
  [ChainId.POLYGON]: {},
  [ChainId.FANTOM]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.CRONOS]: {},
  [ChainId.BRISE]: {},
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [tokens[ChainId.ETHEREUM].weth, tokens[ChainId.ETHEREUM].usdt],
  [ChainId.BSC_MAINNET]: [
    tokens[ChainId.BSC_MAINNET].wbnb,
    tokens[ChainId.BSC_MAINNET].brews,
    tokens[ChainId.BSC_MAINNET].dai,
    tokens[ChainId.BSC_MAINNET].busd,
    tokens[ChainId.BSC_MAINNET].usdt,
  ],
  [ChainId.BSC_TESTNET]: [tokens[ChainId.BSC_TESTNET].wbnb, tokens[ChainId.BSC_TESTNET].busd],
  [ChainId.POLYGON]: [tokens[ChainId.POLYGON].wmatic, tokens[ChainId.POLYGON].usdc],
  [ChainId.FANTOM]: [tokens[ChainId.FANTOM].wftm, tokens[ChainId.FANTOM].usdc],
  [ChainId.AVALANCHE]: [tokens[ChainId.AVALANCHE].wavax, tokens[ChainId.AVALANCHE].usdc],
  [ChainId.CRONOS]: [tokens[ChainId.CRONOS].wcro, tokens[ChainId.CRONOS].usdc],
  [ChainId.BRISE]: [tokens[ChainId.BRISE].wbrise, tokens[ChainId.BRISE].usdt, tokens[ChainId.BRISE].usdc],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC_MAINNET]: [
    [tokens[ChainId.BSC_MAINNET].brews, tokens[ChainId.BSC_MAINNET].wbnb],
    [tokens[ChainId.BSC_MAINNET].busd, tokens[ChainId.BSC_MAINNET].usdt],
    [tokens[ChainId.BSC_MAINNET].dai, tokens[ChainId.BSC_MAINNET].usdt],
  ],
};

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const BLOCKS_PER_DAY = {
  [ChainId.ETHEREUM]: 6426,
  [ChainId.BSC_MAINNET]: 28800,
  [ChainId.POLYGON]: 40000,
};

export const DEFAULT_CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || "56", 10);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.02
export const MIN_BNB: JSBI = JSBI.multiply(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), JSBI.BigInt(2)); // .02 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

export const slippageWithTVL = 200;
export const slippageDefault = 50;

export const FREEZER_CHAINS = {
  1: "ethereum",
  56: "smartchain",
};

export const LIVECOIN_APIS = [
  "82fc55c0-9833-4d12-82bb-48ae9748bead",
  "10760947-8c9a-4a18-b20f-2be694baf496",
  "4853da0a-f79f-4714-a915-d683b8168e1e",
  "4f616412-ca6d-4876-9a94-dac14e142b12",
];

export const TOKENLIST_URI = {
  1: "https://tokens.coingecko.com/ethereum/all.json",
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  137: "https://tokens.coingecko.com/polygon-pos/all.json",
  250: "https://tokens.coingecko.com/fantom/all.json",
  43114: "https://tokens.coingecko.com/avalanche/all.json",
  42161: "https://tokens.coingecko.com/arbitrum-one/all.json",
  25: "https://tokens.coingecko.com/cronos/all.json",
};

export const CHART_PERIOD_RESOLUTION = {
  0: {
    period: 86400,
    resolution: 10,
  },
  1: {
    period: 86400 * 7,
    resolution: 60,
  },
  2: {
    period: 86400 * 30,
    resolution: 240,
  },
  3: {
    period: 86400 * 365,
    resolution: 1440,
  },
  4: {
    period: 86400 * 10000,
    resolution: 1440,
  },
};

export const DEX_GURU_WETH_ADDR = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

