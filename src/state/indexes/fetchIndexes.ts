import axios from "axios";
import { ethers } from "ethers";

import IndexAbi from "config/abi/indexes/index.json";

import { MULTICALL_FETCH_LIMIT } from "config/constants";
import multicall from "utils/multicall";

export const fetchIndexsTotalStaking = async (chainId, indexes) => {
  const selectedIndexs = indexes.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedIndexs.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedIndexs.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      if (batch.length === 0) return;

      try {
        let calls = [];
        for (let pool of batch) {
          for (let k = 0; k < pool.numTokens; k++) {
            calls.push({
              address: pool.address,
              name: "totalStaked",
              params: [k],
            });
          }
        }

        const totalStakes = await multicall(IndexAbi, calls, chainId);

        if (totalStakes) {
          let idx = 0;
          for (let pool of batch) {
            let totalStaked = [];
            for (let k = 0; k < pool.numTokens; k++) {
              totalStaked.push(ethers.utils.formatUnits(totalStakes[idx][0], pool.tokens[k].decimals));
              idx++;
            }

            data.push({ pid: pool.pid, totalStaked });
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

const getPriceChange = (prices, time) => {
  let currentPriceChange = 0,
    prevPriceChange = 0;
  let curPrices = [];
  for (let k = 0; k < prices.length; k++) {
    curPrices.push(prices[k].c[prices[k].c.length - 1]);
    prevPriceChange += curPrices[k] / prices.length;
  }

  let prevPrices = new Array(prices.length).fill(0);
  for (let k = 0; k < prices.length; k++) {
    for (let i = prices[k].t.length; i >= 0; i--)
      if (prices[k].t[i] < (Date.now() - time) / 1000) {
        prevPrices[k] = prices[k].c[i];
        break;
      }
    prevPriceChange += prevPrices[k] / prices.length;
  }

  return {
    percent: ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100,
    value: currentPriceChange - prevPriceChange,
  };
};

const getHistory = (prices) => {
  let temp = [];

  for (let i = 0; i < prices[0].length; i++) {
    let currentPriceChange = 0,
      prevPriceChange = 0;
    for (let k = 0; k < prices.length; k++) {
      currentPriceChange += prices[k][i] / prices.length;
      prevPriceChange += prices[k][0] / prices.length;
    }
    const average = ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100;

    temp.push(average);
  }
  return temp;
};

export const fetchIndexPerformance = async (pool) => {
  const to = Math.floor(Date.now() / 1000);

  let prices = [];
  try {
    for (let i = 0; i < pool.numTokens; i++) {
      const tokenYearUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${
        pool.tokens[i].address
      }-eth_USD&resolution=1440&from=${to - 3600 * 24 * 365}&to=${to}`;

      let priceResult = await axios.get(tokenYearUrl);
      const yearlyPrice = priceResult.data;

      const tokenDayUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${
        pool.tokens[i].address
      }-eth_USD&resolution=60&from=${to - 3600 * 24}&to=${to}`;

      priceResult = await axios.get(tokenDayUrl);
      const dailyPrice = priceResult.data;
      prices.push(yearlyPrice, dailyPrice);
    }
  } catch (e) {
    return;
  }

  let priceChanges = [
    getPriceChange(
      prices.map((p) => p[0]),
      364 * 86400 * 1000
    ),
    getPriceChange(
      prices.map((p) => p[0]),
      30 * 86400 * 1000
    ),
    getPriceChange(
      prices.map((p) => p[0]),
      7 * 86400 * 1000
    ),
    getPriceChange(
      prices.map((p) => p[1]),
      3600 * 23 * 1000
    ),
  ];

  let priceHistories = getHistory(prices.map((p) => p[1].c));

  return { priceChanges, priceHistories };
};
