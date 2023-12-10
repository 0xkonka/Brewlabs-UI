import axios from "axios";
import { DEXSCREENER_CHAINNAME, DEXSCREENER_DEXID, DEXTOOLS_CHAINNAME } from "config";
import { API_URL } from "config/constants";
import { isAddress } from "utils";

// https://api.dexscreener.com/latest/dex/pairs/bsc/0x7213a321F1855CF1779f42c0CD85d3D95291D34C,0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae

function checkString(string) {
  return !isNaN(string) && string.toString().indexOf(".") != -1;
}

async function analyzeLog(str) {
  try {
    const temp = str.replace(/[\u0000-\u001F]/g, "#");
    let valueList = temp.split("#");
    const chain = valueList.find((value) =>
      Object.keys(DEXSCREENER_CHAINNAME).find((key, i) => value.includes(DEXSCREENER_CHAINNAME[key]))
    );

    if (!chain) return null;

    const chainId = Object.keys(DEXSCREENER_CHAINNAME).find((key, i) => chain.includes(DEXSCREENER_CHAINNAME[key]));

    valueList = valueList.filter((value) => value !== chain);

    let dexIds = valueList.filter((value) => DEXSCREENER_DEXID.includes(value));
    if (dexIds.length === 1) {
      dexIds = [dexIds[0], dexIds[0]];
    }

    let addresses = [],
      names = [],
      symbols = [],
      index = 0;
    valueList.map((value, i) => {
      const splitAddresses = value
        .split("T")
        .filter((addr) => isAddress(addr))
        .map((addr) => addr.toLowerCase());
      addresses = [...addresses, ...splitAddresses];
      if (splitAddresses.length > 0) {
        if (index === 0) {
          names.push(valueList[i + 1]);
        }
        if (index === 1) {
          symbols.push(value.split("T")[0]);
          names.push(valueList[i + 1]);
          symbols.push(valueList[i + 2]);
        }
        index++;
      }
    });

    const prices = valueList.filter((value) => checkString(value));
    prices.splice(0, 1);

    const result = await Promise.all([
      axios.get(`https://open-api.dextools.io/free/v2/pool/${DEXTOOLS_CHAINNAME[chainId]}/${addresses[0]}/price`, {
        headers: { "X-BLOBR-KEY": "B2DNT6EitS7cAZw2jYit6NhViULBJsoV" },
      }),
    ]);
    const priceInfos = result[0].data;

    return {
      chainId: Number(chainId),
      a: dexIds[1],
      dexId: dexIds[0],
      address: addresses[0],
      pairAddress: addresses[0],
      baseToken: {
        address: addresses[1],
        name: names[0],
        symbol: symbols[0],
        price: Number(prices[1]),
      },
      quoteToken: {
        address: addresses[2],
        name: names[1],
        symbol: symbols[1],
        price: prices[1] / prices[0],
      },
      priceUsd: Number(prices[1]),
      reserve0: 0,
      reserve1: 0,
      liquidity: { usd: 55 },
      tvl: 55,
      volume: { h24: priceInfos.data.volume24h ?? 0 },
      priceChange: { h24: (priceInfos.data.priceChain24h ?? 0) * 100000 },
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

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
    let { data: brewPairs } = await axios.get(brewSwapUrl);
    let searchedPairs = [];

    if (isAddress(criteria) || type === "simple") {
      const url = `https://io.dexscreener.com/dex/search/v3/pairs?q=${criteria}`;
      let { data: response } = await axios.post(`https://pein-api.vercel.app/api/tokenController/getHTML`, { url });
      const pair = await analyzeLog(response.result);
      if (pair) searchedPairs = [pair];
      // searchedPairs = result.data.result.pairs;
      // if (chain) searchedPairs = searchedPairs.filter((pair) => pair.chainId === chain);
      // searchedPairs = searchedPairs.map((pair) => {
      //   return getPairParams(pair);
      // });
    } else {
      const result = await axios.get(`https://api.dex.guru/v3/tokens/search/${criteria}?network=eth,bsc,polygon`);
      let tokens = result.data.data;
      const isLP = tokens.find((token) => token.address === criteria.toLowerCase() && token.marketType === "lp");
      if (isLP) tokens = [isLP];
      const filteredTokens = tokens.filter((token) => token.liquidityUSD).slice(0, 10);
      const searchResult = await Promise.all(
        filteredTokens.map(async (token) => {
          const url = `https://io.dexscreener.com/dex/search/v2/pairs?q=${token.address}`;
          let result = await axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", { url });
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
      .sort((a, b) => b.volume.h24 - a.volume.h24)
      .map((pair) => {
        const isBrewPair = brewPairs.find((bPair) => bPair.address === pair.address);
        if (isBrewPair) return { ...pair, otherdexId: "brewlabs" };
        return pair;
      });

    brewPairs = brewPairs.filter((pair) => !searchedPairs.find((sPair) => sPair.address === pair.address));
    searchedPairs = [...searchedPairs, ...brewPairs];
    return searchedPairs;
  } catch (e) {
    console.log(e);
    return [];
  }
}
