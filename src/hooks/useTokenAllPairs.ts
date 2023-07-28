import axios from "axios";
import { DEX_GURU_CHAIN_NAME, DEX_GURU_SWAP_AMM } from "config";
import { API_URL } from "config/constants";
import { useEffect, useState } from "react";
let searchTimeout;
let wrappedCriteria = "";

export const useTokenAllPairs = (criteria, chainId) => {
  const [pairs, setPairs] = useState([]);

  async function fetchAllPairs() {
    try {
      if (criteria === "") {
        setPairs([]);
        return;
      }
      if (wrappedCriteria !== criteria) return;
      let { data: tokens } = await axios.get(`https://api.dex.guru/v3/tokens/search/${criteria}?network=eth,bsc`);
      tokens = tokens.data.filter((token) => token.verified && token.network === DEX_GURU_CHAIN_NAME[chainId]);
      const result = await Promise.all(
        tokens.map((token) =>
          axios.post("https://api.dex.guru/v3/pools/", {
            id: `${token.id}`,
            limit: 10,
            network: token.network,
            order: "desc",
            sort_by: "volume24h_stable",
          })
        )
      );
      let _pairs = [];
      result.map((data, i) =>
        data.data.data.map((pool, j) => {
          let tokenAddresses = [],
            symbols = [];
          if (pool.tokenAddresses[0] === tokens[i].address) {
            tokenAddresses = pool.tokenAddresses;
            symbols = pool.symbols;
          } else {
            tokenAddresses = [pool.tokenAddresses[1], pool.tokenAddresses[0]];
            symbols = [pool.symbols[1], pool.symbols[0]];
          }
          const price = tokens[i].priceUSD;
          const priceChange24h = tokens[i].priceUSDChange24h * 100;
          _pairs.push({
            ...pool,
            price,
            priceChange24h,
            tokenAddresses,
            symbols,
            chainId,
            swap: DEX_GURU_SWAP_AMM[pool.amm],
            address: pool.id.replace(`-${chainId}`, ""),
          });
        })
      );
      _pairs = _pairs
        .filter((pair) => pair.amm === "1" || pair.amm === "2")
        .sort((a, b) => b.liquidityStable - a.liquidityStable);
      setPairs(_pairs.slice(0, 10));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    wrappedCriteria = criteria;
    searchTimeout = setTimeout(fetchAllPairs, 500);
  }, [criteria, chainId]);

  return pairs;
};
