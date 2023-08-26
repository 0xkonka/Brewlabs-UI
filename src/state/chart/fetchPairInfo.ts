import axios from "axios";
import { DEX_GURU_CHAIN_NAME, DEX_GURU_SWAP_AMM } from "config";
import { BASES_TO_TRACK_LIQUIDITY_FOR } from "config/constants";
import { tokens as wrappedTokens } from "config/constants/tokens";

export async function fetchAllPairs(criteria, limit, sort, chain) {
  if (!criteria) return;
  let { data: tokens } = await axios.get(
    `https://api.dex.guru/v3/tokens/search/${criteria}?network=${chain ?? "eth,bsc,polygon,arbitrum"}`
  );
  tokens = tokens.data;
  const isLP = tokens.find((token) => token.marketType === "lp");
  let _pairs = [];

  if (isLP) {
    const chainId = Number(
      Object.keys(DEX_GURU_CHAIN_NAME).find((key, i) => isLP.network === DEX_GURU_CHAIN_NAME[key])
    );
    const isBase0 = BASES_TO_TRACK_LIQUIDITY_FOR[chainId]?.find(
      (token) =>
        token.address.toLowerCase() === isLP.underlyingAddresses[0] &&
        token.address.toLowerCase() !== wrappedTokens[chainId].brews?.address?.toLowerCase()
    );
    let tokenAddresses = isLP.underlyingAddresses;
    let symbols = isLP.symbols;
    let token = isLP.underlyingAddresses[0];
    if (isBase0) {
      token = isLP.underlyingAddresses[1];
      tokenAddresses = [isLP.underlyingAddresses[1], isLP.underlyingAddresses[0]];
      symbols = [isLP.symbols[1], isLP.symbols[0]];
    }
    _pairs = [
      {
        params: JSON.stringify({ criteria, limit, sort, chain }),
        volume24hStable: isLP.volume24hUSD,
        token,
        address: isLP.id.replace(`-${isLP.network}`, ""),
        amm: isLP.AMM,
        chainId,
        network: isLP.network,
        symbols,
        tokenAddresses,
      },
    ];
  } else {
    tokens = tokens.slice(0, limit);
    const result = await Promise.all(
      tokens.map((token) =>
        axios.post("https://api.dex.guru/v3/pools/", {
          id: `${token.id}`,
          limit: 10,
          network: token.network,
          order: "desc",
          sort_by: sort,
          verfied: true,
        })
      )
    );

    result.map((data, i) =>
      data.data.data.map((pool, j) => {
        const chainId = Number(
          Object.keys(DEX_GURU_CHAIN_NAME).find((key, i) => pool.network === DEX_GURU_CHAIN_NAME[key])
        );
        const isBase0 = BASES_TO_TRACK_LIQUIDITY_FOR[chainId]?.find(
          (token) =>
            token.address.toLowerCase() === pool.tokenAddresses[0] &&
            token.address.toLowerCase() !== wrappedTokens[chainId].brews?.address?.toLowerCase()
        );
        let tokenAddresses = pool.tokenAddresses;
        let symbols = pool.symbols;
        let token = pool.tokenAddresses[0];
        if (isBase0) {
          token = pool.tokenAddresses[1];
          tokenAddresses = [pool.tokenAddresses[1], pool.tokenAddresses[0]];
          symbols = [pool.symbols[1], pool.symbols[0]];
        }
        if (Object.keys(DEX_GURU_SWAP_AMM).includes(pool.amm) && pool.liquidityStable)
          _pairs.push({
            params: JSON.stringify({ criteria, limit, sort, chain }),
            criteria,
            volume24hStable: pool.volume24hStable,
            token,
            address: pool.id.replace(`-${chainId}`, ""),
            amm: DEX_GURU_SWAP_AMM[pool.amm],
            chainId,
            network: pool.network,
            symbols,
            tokenAddresses,
            verified: tokens[i].verified,
          });
      })
    );
  }

  _pairs = _pairs.sort((a, b) => b.volume24hStable * b.verified - a.volume24hStable * a.verified).slice(0, limit);

  return _pairs;
}

export async function fetchPairPriceInfo(pair) {
  try {
    const query1: any = {
      amm: pair.amm,
      current_token_id: `${pair.token}-${pair.network}`,
      limit: 1,
      offset: 0,
      order: "desc",
      pool_address: pair.address,
      sort_by: "timestamp",
      token_status: "all",
      transaction_types: ["swap"],
      with_full_totals: true,
    };
    const query2: any = {
      ...query1,
      date: {
        start_date: Math.floor(Date.now() / 1000 - 3600 * 24 * 30),
        end_date: Math.floor(Date.now() / 1000 - 3600 * 24),
        period: "custom",
      },
    };
    const result = await Promise.all([
      axios.post("https://api.dex.guru/v3/tokens/transactions", query1),
      axios.post("https://api.dex.guru/v3/tokens/transactions", query2),
    ]);

    if (pair.token === "0x2170Ed0880ac9A755fd29B2688956BD959F933F8".toLowerCase()) console.log(result);

    let prices = [0, 0];
    let prices24h = [0, 0];
    if (result[0].data.data.length) {
      prices = result[0].data.data[0].pricesStable;
      if (result[0].data.data[0].tokenAddresses[0] !== pair.tokenAddresses[0]) {
        prices = [prices[1], prices[0]];
      }
    }

    if (result[1].data.data.length) {
      prices24h = result[1].data.data[0].pricesStable;
      if (result[1].data.data[0].tokenAddresses[0] !== pair.tokenAddresses[0]) {
        prices24h = [prices24h[1], prices24h[0]];
      }
    }

    const price = prices[0];
    const price24h = prices24h[0];

    return {
      ...pair,
      price,
      priceChange24h: price ? ((price - price24h) / price) * 100 : 0,
      price24h,
    };
  } catch (e) {
    console.log(e);
    return {
      ...pair,
      price: 0,
      priceChange24h: 0,
      price24h: 0,
    };
  }
}

export async function fetchPairPriceInfos(pairs) {
  try {
    const prices = await Promise.all(pairs.map((pair) => fetchPairPriceInfo(pair)));
    return prices;
  } catch (e) {
    console.log(e);
    return [];
  }
}
