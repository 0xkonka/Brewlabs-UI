import { ChainId } from "@brewlabs/sdk";
import axios from "axios";

function getPriceByTx(tx) {
  const amount0 = Math.max(tx.amount0In, tx.amount0Out);
  const amount1 = Math.max(tx.amount1In, tx.amount1Out);
  return { price0: tx.amountUSD / amount0, price1: tx.amountUSD / amount1 };
}
export async function getTradingPair(chainId, pair) {
  const default_value = {
    price: { price0: 0, price1: 0 },
    price24h: { price24h0: 0, price24h1: 0 },
    price24hHigh: { price24hHigh0: 0, price24hHigh1: 0 },
    price24hLow: { price24hLow0: 0, price24hLow1: 0 },
    price24hChange: { price24hChange0: 0, price24hChange1: 0 },
    volume24h: 0,
  };
  if (chainId !== ChainId.POLYGON) return default_value;
  try {
    let query = `{
      swaps(
        where: {pair_: {id: "${pair}"}}
        first: 1
        orderBy: timestamp
        orderDirection: desc
      ) {
        amount1In
        amount0In
        amount0Out
        amount1Out
        amountUSD
        timestamp
      }
  }`;
    const { data: response } = await axios.post(
      "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
      {
        query,
      }
    );
    let swaps = response.data.swaps;
    if (!swaps.length) return default_value;
    const timestamp = Number(swaps[0].timestamp) - 86400;

    let totalSwaps = [],
      index = 0;
    swaps = [];
    do {
      query = `{
        swaps(
          where: {pair_: {id: "${pair}"}, timestamp_gte: "${timestamp}"}
          first: 1000
          skip:${1000 * index}
          orderBy: timestamp
        ) {
          amount1In
          amount0In
          amount0Out
          amount1Out
          amountUSD
          timestamp
        }
      }`;
      const { data: response } = await axios.post(
        "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
        { query }
      );

      swaps = response.data.swaps;
      totalSwaps = [...totalSwaps, ...swaps];
      index++;
    } while (swaps.length === 1000);

    let price = getPriceByTx(totalSwaps[totalSwaps.length - 1]),
      price24h = { price24h0: getPriceByTx(totalSwaps[0]).price0, price24h1: getPriceByTx(totalSwaps[0]).price1 },
      price24hHigh = { price24hHigh0: 0, price24hHigh1: 0 },
      price24hLow = { price24hLow0: 1000000, price24hLow1: 1000000 },
      volume24h = 0;
    const price24hChange = {
      price24hChange0: price24h.price24h0 ? (price.price0 / price24h.price24h0) * price.price0 * 100 : 0,
      price24hChange1: price24h.price24h1 ? (price.price1 / price24h.price24h1) * price.price1 * 100 : 0,
    };

    for (let i = 0; i < totalSwaps.length; i++) {
      volume24h += Number(totalSwaps[i].amountUSD);
      if (price24hHigh.price24hHigh0 <= getPriceByTx(totalSwaps[i]).price0)
        price24hHigh.price24hHigh0 = getPriceByTx(totalSwaps[i]).price0;
      if (price24hHigh.price24hHigh1 <= getPriceByTx(totalSwaps[i]).price1)
        price24hHigh.price24hHigh1 = getPriceByTx(totalSwaps[i]).price1;

      if (price24hLow.price24hLow0 >= getPriceByTx(totalSwaps[i]).price0)
        price24hLow.price24hLow0 = getPriceByTx(totalSwaps[i]).price0;
      if (price24hLow.price24hLow1 >= getPriceByTx(totalSwaps[i]).price1)
        price24hLow.price24hLow1 = getPriceByTx(totalSwaps[i]).price1;
    }

    return { price, price24h, price24hHigh, price24hLow, price24hChange, volume24h };
  } catch (e) {
    console.log(e);
    return default_value;
  }
}

export async function getTradingAllPairs(chainId: ChainId) {
  if (chainId !== ChainId.POLYGON) return [];
  try {
    let totalPairs = [];
    let pairs = [],
      index = 0;
    do {
      const { data: response } = await axios.post(
        "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
        {
          query: `{
            pairs(
              first: 1000
              skip: ${index * 1000}
            ) {
              id
              token0 {
                decimals
                id
                name
                symbol
              }
              token1 {
                decimals
                id
                name
                symbol
              }
              reserveETH
            }
          }`,
        }
      );
      pairs = response.data.pairs;
      totalPairs = [...totalPairs, ...pairs];
      index++;
    } while (pairs.length === 1000);
    return totalPairs
      .sort((a, b) => Number(b.reserveETH) - Number(a.reserveETH))
      .map((pair) => ({
        ...pair,
        address: pair.id,
        token0: { ...pair.token0, address: pair.token0.id },
        token1: { ...pair.token1, address: pair.token1.id },
        chainId,
      }));
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getVolumeHistory(address, chainId, type) {
  if (chainId !== ChainId.POLYGON) return [];
  try {
    if (type === "24h") {
      const { data: response } = await axios.post(
        "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
        {
          query: `{
            pairHourDatas(
              where: {pair_: {id: "${address}"}, hourStartUnix_gte: ${Math.floor(Date.now() / 1000 - 86400)}}
              orderBy: hourStartUnix
            ) {
              pair {
                id
              }
              hourlyVolumeUSD
              hourStartUnix
            }
          }`,
        }
      );
      return response.data.pairHourDatas.map((data) => data.hourlyVolumeUSD);
    }
    const deltaTime = type === "7d" ? 86400 * 7 : 86400 * 30;

    const { data: response } = await axios.post(
      "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
      {
        query: `{
          pairDayDatas(
            where: {pairAddress: "${address}", date_gte: ${Math.floor(Date.now() / 1000 - deltaTime)}}
            orderBy: date
          ) {
            dailyVolumeUSD
            date
          }
        }`,
      }
    );
    return response.data.pairDayDatas.map((data) => data.dailyVolumeUSD);
  } catch (e) {
    console.log(e);
    return [];
  }
}
