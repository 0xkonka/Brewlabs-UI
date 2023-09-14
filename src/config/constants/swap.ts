import { ChainId } from "@brewlabs/sdk";

export const AGGREGATOR_SUBGRAPH_NAMES = {
  [ChainId.ETHEREUM]: "brewlabs-aggregator-mainnet",
  [ChainId.BSC_MAINNET]: "brewlabs-aggregator-bsc",
  [ChainId.ARBITRUM]: "brewlabs-aggregator-arbitrum",
  [ChainId.POLYGON]: "brewlabs-aggregator-polygon",
  [ChainId.FANTOM]: "brewlabs-aggregator-fantom",
};

export const ROUTER_SUBGRAPH_NAMES = {
  [ChainId.POLYGON]: "brewswap-polygon",
  [ChainId.BSC_TESTNET]: "brewswap-chapel",
};

export const SUPPORTED_DEXES = {
  liquidity: {
    [ChainId.ETHEREUM]: ["uniswap-v2"],
    [ChainId.BSC_MAINNET]: ["pcs-v2", "apeswap"],
    [ChainId.BSC_TESTNET]: ["brewlabs", "pcs-v2"],
  },
  deploy: {
    [ChainId.ETHEREUM]: ["uniswap-v2"],
    [ChainId.BSC_MAINNET]: ["pcs-v2"],
    [ChainId.BSC_TESTNET]: ["brewlabs", "pcs-v2"],
  },
};

export const DEX_LOGOS = {
  brewlabs: "/images/brewlabsRouter.png",
  "pcs-v2": "https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png",
  pancakeswap: "https://assets-stage.dex.guru/icons/56/0x10ED43C718714eb63d5aA57B78B54704E256024E.svg",
  pancakeswap_v3: "https://assets-stage.dex.guru/icons/56/0x10ED43C718714eb63d5aA57B78B54704E256024E.svg",
  pancakeswap_v1: "https://assets-stage.dex.guru/icons/56/0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F.svg",
  apeswap: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1281.png",
  uniswap: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
  "uniswap-v2": "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
  uniswap_v3: "https://assets-stage.dex.guru/icons/1/0xE592427A0AEce92De3Edee1F18E0157C05861564.svg",
  quickswap: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/4098.png",
  spookyswap: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1455.png",
  tradejoe: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/6799.png",
  mmfinance: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1572.png",
  sushiswap: "https://assets-stage.dex.guru/icons/1/0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F.svg",
  sushiswap_v3: "https://assets-stage.dex.guru/icons/1/0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F.svg",
};
