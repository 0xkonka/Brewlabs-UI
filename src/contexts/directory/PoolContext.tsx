import React, { useEffect, useState } from "react";
import { useFastRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getMulticallContract } from "utils/contractHelpers";
import pools from "../../config/constants/directory/pools.json";
import UnLockABI from "config/abi/brewlabsUnLockup.json";

import { ethers } from "ethers";
import axios from "axios";
import { ERC20_ABI } from "config/abi/erc20";

const WETH_ADDR: any = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};

const API_KEY = {
  1: "47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX",
  56: "HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND",
};

const PoolContext: any = React.createContext({
  data: [],
  accountData: [],
});

const custoDy = "0xE1f1dd010BBC2860F81c8F90Ea4E38dB949BB16F";

const PoolContextProvider = ({ children }: any) => {
  const { address } = useAccount();
  // const address = "0xc6c6602743b17c8fd3014cf5012120fc3cec2cb7";
  const { chainId } = useActiveChainId();
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);

  function getEarningAmount(data, decimals) {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].to === address.toLowerCase()) {
        sum += data[i].value / Math.pow(10, decimals);
      }
    }
    return sum;
  }

  async function multicall(abi: any, calls: any, chainID: number) {
    const itf = new ethers.utils.Interface(abi);
    const multi = getMulticallContract(chainID);
    const calldata = calls.map((call: any) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  }

  async function fetchPoolData(data: any) {
    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${data.address}&startblock=0&endblock=99999999&sort=asc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`;

    const to = Math.floor(Date.now() / 1000);

    //Fetching Staking Token Price
    const priceUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${
      data.stakingToken.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ? WETH_ADDR[chainId]
        : data.stakingToken.address
    }-${data.chainID === 56 ? "bsc" : "eth"}_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;

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
      {
        address: data.address,
        name: "owner",
      },
    ];

    const callResult = await multicall(UnLockABI, calls, data.chainID);

    const apr = (callResult[0][0] / callResult[1][0]) * 28800 * 36500;
    const endBlock = callResult[2][0] / 1 - callResult[4][0] / 1;
    const remainingBlock = callResult[3][0] / 1 - callResult[4][0] / 1;
    const totalStaked = callResult[1][0] / Math.pow(10, data.stakingToken.decimals);
    const tvl = Math.round(totalStaked * price);

    const sHistoryResult = await axios.get(url);

    let txCount = 0,
      sAmounts = {},
      _stakedAddressesHistory = [],
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

        tempStaked += decodeResult._amount / Math.pow(10, data.stakingToken.decimals);
        _totalStakedHistory.push(tempStaked);

        sHistory.push({
          value: decodeResult._amount / Math.pow(10, data.stakingToken.decimals),
          blockNumber: history.blockNumber,
          timeRemaining: 0,
          symbol: data.stakingToken.symbol,
          address: history.from,
        });

        if (!sAmounts[history.from])
          sAmounts[history.from] = {
            timeStamp: history.timeStamp,
            value: BigInt(0),
          };
        sAmounts[history.from].timeStamp = history.timeStamp;
        sAmounts[history.from].value += BigInt(decodeResult._amount);

        if (history.timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000) {
          totalFee += (decodeResult._amount * data.depositFee) / 100;
          _tokenFeeHistory.push(totalFee / Math.pow(10, data.stakingToken.decimals));
        }
      }
      if (history.functionName.includes("withdraw(")) {
        const iface = new ethers.utils.Interface(["function withdraw(uint256 _amount)"]);
        const decodeResult = iface.decodeFunctionData("withdraw", history.input);

        tempStaked -= decodeResult._amount / Math.pow(10, data.stakingToken.decimals);
        _totalStakedHistory.push(tempStaked);

        if (history.timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000) {
          totalFee += (decodeResult._amount * data.withdrawFee) / 100;
          _tokenFeeHistory.push(totalFee / Math.pow(10, data.stakingToken.decimals));
        }

        if (!sAmounts[history.from])
          sAmounts[history.from] = {
            timeStamp: history.timeStamp,
            value: BigInt(0),
          };
        sAmounts[history.from].timeStamp = history.timeStamp;
        sAmounts[history.from].value -= BigInt(decodeResult._amount);
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

    //Fetching Staked Addresses History
    let c = 0;
    Object.keys(sAmounts).map((data: any, i) => {
      if (sAmounts[data].value > BigInt(0)) c++;
    });

    let tempC = c,
      tempHistory = [];
    _stakedAddressesHistory.push(c);
    Object.keys(sAmounts).map((data: any, i) => {
      if (sAmounts[data].timeStamp * 1000 >= Date.now() - 3600 * 24 * 1000) {
        tempC--;
        _stakedAddressesHistory.push(tempC);
      }
    });

    for (let i = _stakedAddressesHistory.length - 1; i >= 0; i--) tempHistory.push(_stakedAddressesHistory[i]);

    _totalStakedHistory.push(totalStaked);

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
      totalStakedAddresses: c,
      graphData: [_totalStakedHistory, _tokenFeeHistory, _performanceFeeHistory, tempHistory],
      isCustody: callResult[5][0].toLowerCase() === custoDy.toLowerCase(),
    };
  }

  async function fetchPoolDatas() {
    try {
      const _data = data;
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

  async function fetchTokenTxAmount(address: string, chainID: number, tokenAddress: string) {
    const rewardUrl = `https://api.bscscan.com/api?module=account&action=tokentx&contractAddress=${tokenAddress}&address=${address}&sort=asc&apikey=${API_KEY[chainID]}`;
    const rewardResult = await axios.get(rewardUrl);
    return rewardResult;
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
      const result = await multicall(UnLockABI, calls, data.chainID);
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
      const balanceResult = await multicall(ERC20_ABI, calls, data.chainID);
      const totalInfos = await Promise.all([
        fetchTokenTxAmount(data.address, data.chainID, data.earningToken.address),
        fetchTokenTxAmount(data.address, data.chainID, data.reflectionToken.address),
      ]);

      const rewardResult: any = totalInfos[0];
      const reflectionResult: any = totalInfos[1];

      return {
        pendingReward: result[0][0] / Math.pow(10, data.earningToken.decimals),
        pendingReflection: result[1][0] / Math.pow(10, data.reflectionToken.decimals),
        stakedAmount: result[2][0],
        available: result[2].amount,
        balance: balanceResult[0][0],
        allowance: balanceResult[1][0] > "10000",
        totalReward:
          rewardResult.data !== undefined
            ? getEarningAmount(rewardResult.data.result, data.earningToken.decimals)
            : data.totalReward,
        totalReflection:
          reflectionResult.data !== undefined
            ? getEarningAmount(reflectionResult.data.result, data.reflectionToken.decimals)
            : data.totalReflection,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAccountPoolDatas() {
    try {
      const _data = accountData;
      let temp = await Promise.all(
        _data.map(async (data: any) => {
          let accountInfo;
          if (data.chainID !== chainId) accountInfo = {};
          else accountInfo = await fetchAccountPoolData(data);
          const serializedToken = { ...data, ...accountInfo };
          return serializedToken;
        })
      );
      setAccountData(temp);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setAccountData(pools);
  }, [chainId, address]);

  useSlowRefreshEffect(() => {
    fetchPoolDatas();
  }, []);

  useFastRefreshEffect(() => {
    if (!address) {
      setAccountData(pools);
      return;
    }
    fetchAccountPoolDatas();
  }, [address, chainId]);

  return <PoolContext.Provider value={{ data, accountData }}>{children}</PoolContext.Provider>;
};

export { PoolContext, PoolContextProvider };
