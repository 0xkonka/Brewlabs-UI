import axios from "axios";
import { DEX_GURU_CHAIN_NAME, DEX_GURU_SWAP_AMM } from "config";
import { useEffect, useState } from "react";
let searchTimeout;
let wrappedCriteria = "";

export const useTokenAllPairs = (criteria) => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAllPairs(criteria, limit = 10) {
    let { data: tokens } = await axios.get(`https://api.dex.guru/v3/tokens/search/${criteria}?network=eth,bsc`);
    tokens = tokens.data;
    const result = await Promise.all(
      tokens.map((token) =>
        axios.post("https://api.dex.guru/v3/pools/", {
          id: `${token.id}`,
          limit: 10,
          network: token.network,
          order: "desc",
          sort_by: "liquidity_stable",
        })
      )
    );
    let _pairs = [];
    result.map((data, i) =>
      data.data.data.map((pool, j) => {
        const chainId = Number(
          Object.keys(DEX_GURU_CHAIN_NAME).find((key, i) => pool.network === DEX_GURU_CHAIN_NAME[key])
        );
        if (Object.keys(DEX_GURU_SWAP_AMM).includes(pool.amm) && _pairs.length <= limit && pool.liquidityStable)
          _pairs.push({
            ...pool,
            token: tokens[i].address,
            address: pool.id.replace(`-${chainId}`, ""),
            volume24hUSD: tokens[i].volume24hUSD,
            amm: DEX_GURU_SWAP_AMM[pool.amm],
            chainId,
          });
      })
    );
    const isExisting = _pairs.find((pair) => pair.address === criteria.toLowerCase());
    if (isExisting) _pairs = [isExisting];

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
          volume24hStable: pair.volume24hStable,
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
          priceChange24h: response.volume24hStable ? ((prices[0] - prices24h[0]) / prices[0]) * 100 : 0,
          address: response.pair,
        };
      });

    return _pairs.slice(0, limit);
  }

  useEffect(() => {
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    wrappedCriteria = criteria;

    searchTimeout = setTimeout(async () => {
      if (criteria === "" || wrappedCriteria !== criteria) {
        setPairs([]);
        return;
      }
      setLoading(true);
      try {
        const result = await fetchAllPairs(criteria);
        setPairs(result);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }, 500);
  }, [criteria]);

  return { pairs, loading, fetchAllPairs };
};
