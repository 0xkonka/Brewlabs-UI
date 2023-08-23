import axios from "axios";
import { DEX_GURU_CHAIN_NAME, DEX_GURU_SWAP_AMM } from "config";
import { useEffect, useState } from "react";
import { isAddress } from "utils";
let searchTimeout;
let wrappedCriteria = "";

export async function fetchAllPairs(criteria, limit = 10, sort = "liquidity_stable", chain = null) {
  if (!criteria) return;
  let { data: tokens } = await axios.get(
    `https://api.dex.guru/v3/tokens/search/${criteria}?network=${chain ?? "eth,bsc,polygon,arbitrum"}`
  );
  tokens = tokens.data;

  const result = await Promise.all(
    tokens.map((token) =>
      axios.post("https://api.dex.guru/v3/pools/", {
        id: `${token.id}`,
        limit: 10,
        network: token.network,
        order: "desc",
        sort_by: sort,
      })
    )
  );
  let _pairs = [];
  result.map((data, i) =>
    data.data.data.map((pool, j) => {
      const chainId = Number(
        Object.keys(DEX_GURU_CHAIN_NAME).find((key, i) => pool.network === DEX_GURU_CHAIN_NAME[key])
      );
      if (Object.keys(DEX_GURU_SWAP_AMM).includes(pool.amm) && pool.liquidityStable)
        _pairs.push({
          ...pool,
          token: tokens[i].address,
          address: pool.id.replace(`-${chainId}`, ""),
          amm: DEX_GURU_SWAP_AMM[pool.amm],
          chainId,
        });
    })
  );
  const isExisting = _pairs.find((pair) => pair.address === criteria.toLowerCase());
  if (isExisting) _pairs = [isExisting];
  _pairs = _pairs.slice(0, limit);
  const infoResponse = await Promise.all(
    _pairs.map(async (pair) => {
      let response;
      if (pair.volume24hStable)
        response = await axios.post("https://api.dex.guru/v3/tokens/transactions", {
          amm: pair.amm,
          current_token_id: `${pair.token}-${pair.network}`,
          limit: 100,
          offset: 0,
          order: "desc",
          date: { start_date: Date.now() - 3600 * 24 * 1000, end_date: Date.now() },
          pool_address: pair.address,
          sort_by: "timestamp",
          token_status: "all",
          transaction_types: ["swap"],
          with_full_totals: true,
        });
      else
        response = await axios.post("https://api.dex.guru/v3/tokens/transactions", {
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
        });
      return {
        ...response.data,
        token: pair.token,
        pair: pair.address,
        chainId: pair.chainId,
      };
    })
  );

  _pairs = infoResponse
    .filter((response) => response.data.length)
    .map((response: any, i) => {
      let tokenAddresses = response.data[0].tokenAddresses,
        symbols = response.data[0].symbols,
        prices = response.data[0].pricesStable,
        prices24h = response.data[response.data.length - 1].pricesStable;
      if (tokenAddresses[1] === response.token) {
        tokenAddresses = [tokenAddresses[1], tokenAddresses[0]];
        symbols = [symbols[1], symbols[0]];
        prices = [prices[1], prices[0]];
        prices24h = [prices24h[1], prices24h[0]];
      }
      return {
        chainId: response.chainId,
        swap: response.data[0].type,
        tokenAddresses,
        symbols,
        price: prices[0],
        priceChange24h: response.data.length > 1 ? ((prices[0] - prices24h[0]) / prices[0]) * 100 : 0,
        address: response.pair,
      };
    });
  return _pairs.slice(0, limit);
}

export const useTokenAllPairs = (criteria) => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    wrappedCriteria = criteria;

    searchTimeout = setTimeout(async () => {
      if (criteria === "") {
        setPairs([]);
        return;
      }
      setLoading(true);
      try {
        const result = await fetchAllPairs(criteria);
        if (wrappedCriteria === criteria) setPairs(result);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }, 500);
  }, [criteria]);

  return { pairs, loading };
};

export async function fetchTradingHistories(query, chainId) {
  let histories = [];
  if (query.account && !isAddress(query.account)) return [];
  let count = query.limit;
  if (!query.limit) {
    const { data: response } = await axios.post("https://api.dex.guru/v3/tokens/transactions/count", query);
    count = response.count;
  }
  const offset = query.offset;
  const limit = query.limit;
  await Promise.all(
    new Array(Math.min(Math.ceil(count / 100), 100)).fill("").map(async (result, i) => {
      query = { ...query, limit: limit ? limit : 100, offset: offset ? offset : 100 * i };
      const { data }: any = await axios.post("https://api.dex.guru/v3/tokens/transactions", query);
      histories = [
        ...histories,
        ...data.data.map((history) => {
          return { ...history, chainId };
        }),
      ];
      return histories;
    })
  );
  return histories;
}

export function getVolume(address, data, period) {
  let buyVolume = 0,
    sellVolume = 0;

  const sellCount = data
    .filter(
      (history) =>
        history.fromAddress === address.toLowerCase() && Number(history.timestamp) >= Date.now() / 1000 - period
    )
    .map((history) => (sellVolume += history.amountStable)).length;

  const buyCount = data
    .filter(
      (history) =>
        history.fromAddress !== address.toLowerCase() && Number(history.timestamp) >= Date.now() / 1000 - period
    )
    .map((history) => (buyVolume += history.amountStable)).length;

  return {
    buyVolume,
    sellVolume,
    buyCount,
    sellCount,
    totalCount: buyCount + sellCount,
    totalVolume: buyVolume + sellVolume,
  };
}

export function getVolumeDatas(address, histories) {
  const v5m = getVolume(address, histories, 5 * 60);
  const v30m = getVolume(address, histories, 30 * 60);
  const v24hr = getVolume(address, histories, 3600 * 24);
  const v7d = getVolume(address, histories, 3600 * 24 * 7);
  return {
    txn: {
      "5m": {
        Buys: v5m.buyCount,
        Sells: v5m.sellCount,
        Total: v5m.totalCount,
        isUp: v5m.buyCount >= v5m.sellCount,
      },
      "30m": {
        Buys: v30m.buyCount,
        Sells: v30m.sellCount,
        Total: v30m.totalCount,
        isUp: v30m.buyCount >= v30m.sellCount,
      },
      "24hr": {
        Buys: v24hr.buyCount,
        Sells: v24hr.sellCount,
        Total: v24hr.totalCount,
        isUp: v24hr.buyCount >= v24hr.sellCount,
      },
      "7d": {
        Buys: v7d.buyCount,
        Sells: v7d.sellCount,
        Total: v7d.totalCount,
        isUp: v7d.buyCount >= v7d.sellCount,
      },
    },
    "txn (usd)": {
      "5m": {
        Buys: v5m.buyVolume,
        Sells: v5m.sellVolume,
        Total: v5m.totalVolume,
        isUp: v5m.buyVolume >= v5m.sellVolume,
      },
      "30m": {
        Buys: v30m.buyVolume,
        Sells: v30m.sellVolume,
        Total: v30m.totalVolume,
        isUp: v30m.buyVolume >= v30m.sellVolume,
      },
      "24hr": {
        Buys: v24hr.buyVolume,
        Sells: v24hr.sellVolume,
        Total: v24hr.totalVolume,
        isUp: v24hr.buyVolume >= v24hr.sellVolume,
      },
      "7d": {
        Buys: v7d.buyVolume,
        Sells: v7d.sellVolume,
        Total: v7d.totalVolume,
        isUp: v7d.buyVolume >= v7d.sellVolume,
      },
    },
  };
}

export const defaultVolume = {
  txn: {
    "5m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "30m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "24hr": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "7d": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
  },
  "txn (usd)": {
    "5m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "30m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "24hr": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "7d": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
  },
};
