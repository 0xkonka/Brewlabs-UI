import React, { useState } from "react";
import { useFastRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getMulticallContract } from "utils/contractHelpers";
import pools from "../views/directory/pools.json";
import UnLockABI from "config/abi/brewlabsUnLockup.json";

import { ethers } from "ethers";
import axios from "axios";
import { ERC20_ABI } from "config/abi/erc20";

const WETH_ADDR: any = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};

const PoolContext: any = React.createContext({
  data: [],
  accountData: [],
  ethPrice: 0,
});

const PoolContextProvider = ({ children }: any) => {
  const { address } = useAccount();
  // const address = "0x16ba08046a9bbec7ba7a0e6fd5fbd7b097f549bf";
  const { chainId } = useActiveChainId();
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);
  const [ethPrice, setETHPrice] = useState(0);

  async function multicall(abi: any, calls: any) {
    try {
      const itf = new ethers.utils.Interface(abi);
      const multi = getMulticallContract(chainId);
      const calldata = calls.map((call: any) => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
      ]);

      const { returnData } = await multi.aggregate(calldata);
      const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPoolData(data: any) {
    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${data.address}&startblock=0&endblock=99999999&sort=asc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`;

    const to = Math.floor(Date.now() / 1000);

    //Fetching ETH Price
    axios
      .get(
        `https://api.dex.guru/v1/tradingview/history?symbol=${WETH_ADDR[chainId]}-${
          chainId === 56 ? "bsc" : "eth"
        }_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`
      )
      .then((result) => setETHPrice(result.data.c[result.data.c.length - 1]))
      .catch((e) => console.log(e));

    //Fetching Staking Token Price
    const priceUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${
      data.stakingToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? WETH_ADDR[chainId]
        : data.stakingToken.address
    }-${chainId === 56 ? "bsc" : "eth"}_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;

    const priceResult = await axios.get(priceUrl);
    const price = priceResult.data.c[priceResult.data.c.length - 1];

    let calls: any = [
      {
        name: "rewardPerBlock",
        address: data.address,
      },
      {
        name: "totalStaked",
        address: data.address,
      },
      {
        address: data.address,
        name: "bonusEndBlock",
      },
      {
        address: data.address,
        name: "lastRewardBlock",
      },

      {
        address: data.address,
        name: "startBlock",
      },
    ];

    const callResult = await multicall(UnLockABI, calls);

    const apr = (callResult[0][0] / callResult[1][0]) * 28800 * 36500;
    const endBlock = callResult[2][0] / 1 - callResult[4][0] / 1;
    const remainingBlock = callResult[3][0] / 1 - callResult[4][0] / 1;
    const totalStaked = callResult[1][0] / Math.pow(10, data.stakingToken.decimals);
    const tvl = Math.round(totalStaked * price);

    const sHistoryResult = await axios.get(url);
    let txCount = 0,
      sAmounts = {},
      c = 0,
      totalFee = 0,
      tempStaked = 0,
      sHistory: any = [],
      _totalStakedHistory = [],
      _tokenFeeHistory = [],
      _performanceFeeHistory = [];

    sHistoryResult.data.result.map((history: any) => {
      if (history.functionName.includes("deposit(")) {
        const iface = new ethers.utils.Interface(["function deposit(uint256 _amount)"]);
        const decodeResult = iface.decodeFunctionData("deposit", history.input);

        if (!sAmounts[history.from]) sAmounts[history.from] = BigInt(0);
        sAmounts[history.from] += BigInt(decodeResult._amount);

        tempStaked += decodeResult._amount / Math.pow(10, data.stakingToken.decimals);
        _totalStakedHistory.push(tempStaked);
        sHistory.push({
          value: decodeResult._amount / Math.pow(10, data.stakingToken.decimals),
          blockNumber: history.blockNumber,
          timeRemaining: 0,
          symbol: data.stakingToken.symbol,
          address: history.from,
        });
        if (history.timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000) {
          totalFee += (decodeResult._amount * data.depositFee) / 100;
          _tokenFeeHistory.push(totalFee / Math.pow(10, data.stakingToken.decimals));
        }
      }
      if (history.functionName.includes("withdraw(")) {
        const iface = new ethers.utils.Interface(["function withdraw(uint256 _amount)"]);
        const decodeResult = iface.decodeFunctionData("withdraw", history.input);

        if (!sAmounts[history.from]) sAmounts[history.from] = BigInt(0);
        sAmounts[history.from] -= BigInt(decodeResult._amount);

        tempStaked -= decodeResult._amount / Math.pow(10, data.stakingToken.decimals);
        _totalStakedHistory.push(tempStaked);

        if (history.timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000) {
          totalFee += (decodeResult._amount * data.withdrawFee) / 100;
          _tokenFeeHistory.push(totalFee / Math.pow(10, data.stakingToken.decimals));
        }
      }
      const functions = [
        "deposit(",
        "withdraw(",
        "compoundReward(",
        "compoundDividend(",
        "claimReward(",
        "claimDividend(",
      ];
      if (history.timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000)
        for (let j = 0; j < functions.length; j++)
          if (history.functionName.includes(functions[j])) {
            txCount++;
            _performanceFeeHistory.push((txCount * data.performanceFee) / Math.pow(10, 18));
            break;
          }
    });
    Object.keys(sAmounts).map((data, i) => {
      if (sAmounts[data] >= BigInt(0)) c++;
    });

    _totalStakedHistory.push(totalStaked);

    console.log(sHistory);
    return {
      history: sHistory,
      endBlock,
      totalStaked: Math.round(totalStaked),
      remainingBlock,
      apr: apr.toFixed(2),
      price,
      tvl,
      totalPerformanceFee: (txCount * data.performanceFee) / Math.pow(10, 18),
      totalFee: totalFee / Math.pow(10, data.stakingToken.decimals),
      stakedAddresses: c,
      graphData: [_totalStakedHistory, _tokenFeeHistory, _performanceFeeHistory],
    };
  }

  async function fetchPoolDatas() {
    try {
      const _data = pools.filter((data) => data.chainID === chainId);
      let temp = await Promise.all(
        _data.map(async (data: any) => {
          const poolInfo = await fetchPoolData(data);
          const temp = { ...data, ...poolInfo };
          const serializedToken = { ...temp };
          return serializedToken;
        })
      );
      setData(temp);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAccountPoolData(data: any) {
    try {
      let calls = [
        {
          address: data.address,
          name: "pendingReward",
          params: [address],
        },
        {
          address: data.address,
          name: "pendingDividends",
          params: [address],
        },
        {
          address: data.address,
          name: "userInfo",
          params: [address],
        },
      ];
      const result = await multicall(UnLockABI, calls);
      calls = [
        {
          address: data.stakingToken.address,
          name: "balanceOf",
          params: [address],
        },
        {
          address: data.stakingToken.address,
          name: "allowance",
          params: [address, data.address],
        },
      ];
      const balanceResult = await multicall(ERC20_ABI, calls);
      return {
        pendingReward: result[0][0] / Math.pow(10, data.earningToken.decimals),
        pendingReflection: result[1][0] / Math.pow(10, data.reflectionToken.decimals),
        stakedAmount: result[2][0],
        available: result[2].amount,
        balance: balanceResult[0][0],
        allowance: balanceResult[1][0] > "10000",
        totalReward: result[2].rewardDebt / Math.pow(10, data.earningToken.decimals),
        totalReflection: result[2].reflectionDebt / Math.pow(10, data.reflectionToken.decimals),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAccountPoolDatas() {
    try {
      const _data = pools.filter((data) => data.chainID === chainId);
      let temp = await Promise.all(
        _data.map(async (data: any) => {
          const accountInfo: any = await fetchAccountPoolData(data);
          const serializedToken = { ...accountInfo };
          return serializedToken;
        })
      );
      console.log(temp);
      setAccountData(temp);
    } catch (error) {
      console.log(error);
    }
  }
  useSlowRefreshEffect(() => {
    fetchPoolDatas();
  }, [chainId]);

  useFastRefreshEffect(() => {
    fetchAccountPoolDatas();
  }, [address, chainId]);

  return <PoolContext.Provider value={{ data, accountData, ethPrice }}>{children}</PoolContext.Provider>;
};

export { PoolContext, PoolContextProvider };
