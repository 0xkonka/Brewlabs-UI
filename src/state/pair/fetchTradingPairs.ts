import { ChainId } from "@brewlabs/sdk";
import axios from "axios";
import { ethers } from "ethers";
import { getBrewlabsFeeManagerContract, getBrewlabsPairContract } from "utils/contractHelpers";

function getPriceByTx(tx) {
  const amount0 = Math.max(tx.amount0In, tx.amount0Out);
  const amount1 = Math.max(tx.amount1In, tx.amount1Out);
  return { price0: tx.amountUSD / amount0, price1: tx.amountUSD / amount1 };
}
export async function getTradingPair(chainId, pair) {
  let query = `{
    pair(
      id: "${pair.toLowerCase()}"
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
  }`;

  const { data: response } = await axios.post("https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon", {
    query,
  });

  const pairData = response.data.pair;
  if (!pairData) return {};

  const wrappedPairData = {
    ...pairData,
    address: pairData.id,
    token0: { ...pairData.token0, address: pairData.token0.id },
    token1: { ...pairData.token1, address: pairData.token1.id },
    chainId,
  };
  const default_value = {
    pair: wrappedPairData,
    price: { price0: 0, price1: 0 },
    price24hChange: { price24hChange0: 0, price24hChange1: 0 },
    volume24h: 0,
    tvl: 0,
    feesCollected: 0,
  };

  if (chainId !== ChainId.POLYGON) return default_value;
  try {
    query = `{
      swaps(
        where: {pair_: {id: "${pair.toLowerCase()}"}}
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
        pair {
          reserveUSD
        }
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
    const timestamp = Math.floor(Date.now() / 1000 - 86400);

    const tvl = Number(swaps[0].pair.reserveUSD);

    if (timestamp >= swaps[0].timestamp) {
      const price = getPriceByTx(swaps[0]);
      return {
        pair: wrappedPairData,
        price,
        price24h: { price24h0: 0, price24h1: 0 },
        price24hChange: { price24hChange0: 0, price24hChange1: 0 },
        volume24h: 0,
        tvl,
        feesCollected24h: 0,
      };
    }

    let totalSwaps = [],
      index = 0;
    swaps = [];

    do {
      query = `{
        swaps(
          where: {pair_: {id: "${pair.toLowerCase()}"}, timestamp_gte: "${timestamp}"}
          first: 1000
          skip:${1000 * index}
          orderBy: timestamp
        ) {
          amount1In
          amount0In
          amount0Out
          amount1Out
          amountUSD
          amountFeeUSD
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
      volume24h = 0,
      feesCollected24h = 0;
    const price24hChange = {
      price24hChange0: price24h.price24h0 ? (price.price0 - price24h.price24h0) * price.price0 * 100 : 0,
      price24hChange1: price24h.price24h1 ? (price.price1 - price24h.price24h1) * price.price1 * 100 : 0,
    };

    for (let i = 0; i < totalSwaps.length; i++) {
      volume24h += Number(totalSwaps[i].amountUSD);
      feesCollected24h += Number(totalSwaps[i].amountFeeUSD);
    }

    return { price, price24h, price24hChange, volume24h, tvl, feesCollected24h, pair: wrappedPairData };
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

export async function getTradingPairHistories(chainId, period) {
  if (chainId !== ChainId.POLYGON) return { volumeHistory: [], feeHistory: [] };
  try {
    let query,
      swaps,
      index = 0,
      totalSwaps = [],
      volumeHistory = [],
      feeHistory = [],
      tvlHistory = [];

    const timestamp = Math.floor(Date.now() / 1000 - period);

    do {
      query = `{
        swaps(
          where: {timestamp_gte: "${timestamp}"}
          first: 1000
          skip:${1000 * index}
          orderBy: timestamp
        ) {
          amount1In
          amount0In
          amount0Out
          amount1Out
          amountUSD
          amountFeeUSD
          timestamp
          pair {
            id
          }
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

    let j = 0;
    for (let i = 1; i <= 10; i++) {
      let v = 0,
        fee = 0;
      while (j < totalSwaps.length && Number(totalSwaps[j].timestamp) <= timestamp + (period / 10) * i) {
        v += Number(totalSwaps[j].amountUSD);
        fee += Number(totalSwaps[j].amountFeeUSD);
        j++;
      }
      volumeHistory.push(v);
      feeHistory.push(fee);
    }

    query = `{
      pairs {
        id
        reserve1
        reserve0
        token0 {
          derivedUSD
        }
        token1 {
          derivedUSD
        }
     }
    }`;

    const { data: reserveResponse } = await axios.post(
      "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
      { query }
    );

    const pairs = reserveResponse.data.pairs;

    let historiesByPair = [];
    for (let i = 0; i < pairs.length; i++) {
      const swapsByPair = totalSwaps
        .filter((swap) => swap.pair.id === pairs[i].id)
        .sort((a, b) => b.timestamp - a.timestamp);
      let history = [];

      for (let j = 0; j < 10; j++) {
        let reserve0 = Number(pairs[i].reserve0);
        let reserve1 = Number(pairs[i].reserve1);
        let price0 = Number(pairs[i].token0.derivedUSD);
        let price1 = Number(pairs[i].token1.derivedUSD);
        let k = 0;
        while (k < swapsByPair.length && Number(swapsByPair[k].timestamp) > Date.now() / 1000 - (period / 10) * j) {
          reserve0 += Number(swapsByPair[k].amount0Out);
          reserve0 -= Number(swapsByPair[k].amount0In);
          reserve1 += Number(swapsByPair[k].amount1Out);
          reserve1 -= Number(swapsByPair[k].amount1In);
          price0 = getPriceByTx(swapsByPair[k]).price0;
          price1 = getPriceByTx(swapsByPair[k]).price1;
          k++;
        }
        history.push(reserve0 * price0 + reserve1 * price1);
      }
      historiesByPair.push(history);
    }

    for (let i = 9; i >= 0; i--) {
      let s = 0;
      for (let j = 0; j < historiesByPair.length; j++) s += historiesByPair[j][i];
      tvlHistory.push(s);
    }

    return { volumeHistory, feeHistory, tvlHistory };
  } catch (e) {
    console.log(e);
    return { volumeHistory: [], feeHistory: [] };
  }
}

export async function getBrewlabsSwapFee(chainId: ChainId, pair: string) {
  try {
    const pairContract = getBrewlabsPairContract(chainId, pair);
    const feeManagerContract = getBrewlabsFeeManagerContract(chainId);
    const data = await feeManagerContract.getPoolFeeInfo(pair);
    // const owner = await feeManagerContract.owner();
    const stakingPool = await pairContract.stakingPool();

    const lpFee = Number(data.feeDistribution[0]) / 10000;
    const brewlabsFee = Number(data.feeDistribution[1]) / 10000;
    const tokenOwnerFee = Number(data.feeDistribution[2]) / 10000;
    const stakingFee = Number(data.feeDistribution[3]) / 10000;
    const referralFee = Number(data.feeDistribution[4]) / 10000;
    return {
      fees: {
        totalFee: lpFee + brewlabsFee + tokenOwnerFee + stakingFee + referralFee,
        lpFee,
        brewlabsFee,
        tokenOwnerFee,
        stakingFee,
        referralFee,
      },
      tokenOwner: data.tokenOwner,
      referrer: data.referer,
      stakingPool,
      owner:
        chainId === ChainId.BSC_TESTNET
          ? "0x9543F59c1Fc00C37d6B239ED1988F7af9Aed780E"
          : "0xE1f1dd010BBC2860F81c8F90Ea4E38dB949BB16F",
    };
  } catch (e) {
    console.log(e);
    return {
      tokenOwner: ethers.constants.AddressZero,
      referrer: ethers.constants.AddressZero,
      stakingPool: ethers.constants.AddressZero,
      owner:
        chainId === ChainId.BSC_TESTNET
          ? "0x9543F59c1Fc00C37d6B239ED1988F7af9Aed780E"
          : "0xE1f1dd010BBC2860F81c8F90Ea4E38dB949BB16F",
      fees: { totalFee: 0.3, lpFee: 0.25, brewlabsFee: 0.05, tokenOwnerFee: 0, stakingFee: 0, referralFee: 0 },
    };
  }
}
