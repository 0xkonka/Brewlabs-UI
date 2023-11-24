import axios from "axios";
import { DEXSCREENER_CHAINNAME } from "config";
import { API_URL } from "config/constants";
import { isAddress } from "utils";

// https://api.dexscreener.com/latest/dex/pairs/bsc/0x7213a321F1855CF1779f42c0CD85d3D95291D34C,0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae

function getPairParams(pair) {
  const chainId = Number(
    Object.keys(DEXSCREENER_CHAINNAME).find((key, i) => pair.chainId === DEXSCREENER_CHAINNAME[key])
  );
  return {
    ...pair,
    address: pair.pairAddress.toLowerCase(),
    chainId,
    priceUsd: Number(pair.priceUsd),
    baseToken: { ...pair.baseToken, address: pair.baseToken.address.toLowerCase() },
    quoteToken: { ...pair.quoteToken, address: pair.quoteToken.address.toLowerCase() },
  };
}

export async function fetchAllPairs(criteria, chain = null, type = "none") {
  try {
    if (!criteria) return;

    const brewSwapUrl = `${API_URL}/chart/search/pairs?q=${criteria}`;
    const { data: brewPairs } = await axios.get(brewSwapUrl);
    console.log(brewPairs);

    let searchedPairs = [];

    if (isAddress(criteria) || type === "simple") {
      const url = `https://io.dexscreener.com/dex/search/pairs?q=${criteria}&s=2`;
      let result = await axios.post(`https://pein-api.vercel.app/api/tokenController/getHTML`, { url });
      searchedPairs = result.data.result.pairs;
      if (chain) searchedPairs = searchedPairs.filter((pair) => pair.chainId === chain);
      searchedPairs = searchedPairs.map((pair) => {
        return getPairParams(pair);
      });
    } else {
      const result = await axios.get(`https://api.dex.guru/v3/tokens/search/${criteria}?network=eth,bsc,polygon`);
      let tokens = result.data.data;
      const isLP = tokens.find((token) => token.address === criteria.toLowerCase() && token.marketType === "lp");
      if (isLP) tokens = [isLP];
      const filteredTokens = tokens.filter((token) => token.liquidityUSD).slice(0, 10);
      const searchResult = await Promise.all(
        filteredTokens.map(async (token) => {
          const url = `https://io.dexscreener.com/dex/search/pairs?q=${token.address}&s=2`;
          let result = await axios.post(`https://pein-api.vercel.app/api/tokenController/getHTML`, { url });
          const searchedPairs = result.data.result.pairs;
          return searchedPairs.map((pair) => {
            return getPairParams(pair);
          });
        })
      );
      searchResult.map((data) => (searchedPairs = [...searchedPairs, ...data]));
    }
    searchedPairs = searchedPairs
      .filter((pair) => pair.liquidity?.usd && Object.keys(DEXSCREENER_CHAINNAME).includes(pair.chainId.toString()))
      .sort((a, b) => b.volume.h24 - a.volume.h24);

    searchedPairs = [...searchedPairs, ...brewPairs];
    return searchedPairs;
  } catch (e) {
    console.log(e);
    return [];
  }
}
