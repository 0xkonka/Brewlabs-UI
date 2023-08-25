import axios from "axios";
import { Adapters } from "config/constants/aggregator";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addPairs, fetchPairPriceInfoAsync } from "state/chart";
import { fetchAllPairs } from "state/chart/fetchPairInfo";
import { usePairInfoByParams } from "state/chart/hooks";
import { isAddress } from "utils";
let searchTimeout;
let wrappedCriteria = "";

export const useTokenAllPairs = (criteria) => {
  const pairs: any = usePairInfoByParams({
    criteria,
    limit: 10,
    sort: "volume24h_stable",
    chain: null,
  });
  const [loading, setLoading] = useState(false);

  const dispatch: any = useDispatch();

  useEffect(() => {
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    wrappedCriteria = criteria;

    searchTimeout = setTimeout(async () => {
      if (criteria === "") return;
      setLoading(true);
      const pairs = await fetchAllPairs(criteria, 10, "volume24h_stable", null);
      setLoading(false);
      dispatch(addPairs(pairs));
      dispatch(fetchPairPriceInfoAsync(pairs));
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

  if (isAddress(query.pool)) {
    const pools = [...Adapters[chainId].map((adapter) => adapter.address.toLowerCase()), query.pool];
    const erc20txs = histories
      .filter((history) => history.transactionType === "transfer")
      .filter((history) =>
        query.type === "buy"
          ? pools.includes(history.fromAddress)
          : query.type === "sell"
          ? pools.includes(history.toAddress)
          : pools.includes(history.toAddress) || pools.includes(history.fromAddress)
      )
      .map((history) => {
        const pool = pools.find((pool) => pool === history.fromAddress || pool === history.toAddress);
        return {
          ...history,
          fromAddress: history.fromAddress === pool ? "" : history.tokenAddresses[0],
          amountStable: history.amountsStable[0],
          nativeAmount: null,
          walletsCategories: [],
          sender: query.account,
          type: "",
          poolAddress: query.pool,
        };
      });
    const swapTxs = histories
      .filter((history) => history.transactionType === "swap")
      .filter((history) =>
        query.type === "buy"
          ? query.address === history.fromAddress
          : query.type === "sell"
          ? query.address !== history.fromAddress
          : true
      );
    return [...erc20txs, ...swapTxs];
  }
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
