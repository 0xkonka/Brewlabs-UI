import React, { useEffect, useState } from "react";
import { useFastRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getMulticallContract } from "utils/contractHelpers";
import zappers from "../../config/constants/directory/zappers.json";
import FarmABI from "config/abi/staking/brewlabsFarm.json";
import PairABI from "config/abi/lpToken.json";

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

const ZapperContext: any = React.createContext({
  data: [],
  accountData: [],
});

const blockCount = {
  1: 6219,
  56: 28800,
};

const ZapperContextProvider = ({ children }: any) => {
  const { address } = useAccount();
  // const address = "0x89A3d642c49856c89398e75BE387506bd929f08D";
  const { chainId } = useActiveChainId();
  const [data, setData] = useState(zappers);
  const [accountData, setAccountData] = useState(zappers);

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

  async function fetchPrice(address: string, chainID: number) {
    const to = Math.floor(Date.now() / 1000);

    //Fetching Staking Token Price
    const priceUrl = `https://api.dex.guru/v1/tradingview/history?symbol=${
      address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? WETH_ADDR[chainID] : address
    }-${chainID === 56 ? "bsc" : "eth"}_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;

    const priceResult = await axios.get(priceUrl);
    return priceResult.data.c[priceResult.data.c.length - 1];
  }

  async function fetchLPPrice(data: any) {
    const price0 = await fetchPrice(data.stakingToken.pair.token0.address, data.chainID);
    const price1 = await fetchPrice(data.stakingToken.pair.token1.address, data.chainID);

    const decimals0 = data.stakingToken.pair.token0.decimals;
    const decimals1 = data.stakingToken.pair.token1.decimals;

    const calls = [
      {
        address: data.stakingToken.address,
        name: "getReserves",
        params: [],
      },
      {
        address: data.stakingToken.address,
        name: "totalSupply",
        params: [],
      },
    ];
    const result = await multicall(PairABI, calls, data.chainID);
    const reserves = result[0];
    const totalSupply = result[1][0] / Math.pow(10, data.stakingToken.decimals);
    const price: number =
      (2 *
        Math.sqrt(((reserves[0] / Math.pow(10, decimals0)) * reserves[1]) / Math.pow(10, decimals1)) *
        Math.sqrt(price0 * price1)) /
      totalSupply;
    return price;
  }

  async function fetchAPR(data: any, tokenPrice: number, lpPrice: number, rewardPerBlock: number, totalStaked: number) {
    const rate =
      totalStaked * lpPrice
        ? (rewardPerBlock * 36500 * blockCount[data.chainID] * tokenPrice) / (totalStaked * lpPrice)
        : Infinity;
    return rate;
  }

  async function fetchPoolData(data: any) {
    const price: number = await fetchLPPrice(data);
    let calls: any = [
      {
        address: data.address,
        name: "poolInfo",
        params: [0],
      },
      {
        address: data.address,
        name: "performanceFee",
        params: [],
      },
      {
        address: data.address,
        name: "rewardPerBlock",
        params: [],
      },
      {
        address: data.address,
        name: "totalStaked",
        params: [0],
      },
    ];

    const callResult = await multicall(FarmABI, calls, data.chainID);

    const totalStaked = callResult[3][0] / Math.pow(10, data.stakingToken.decimals);
    const earningTokenPrice = await fetchPrice(data.earningToken.address, data.chainID);
    const rewardPerBlock = callResult[2][0] / Math.pow(10, data.earningToken.decimals);
    const apr = await fetchAPR(data, earningTokenPrice, price, rewardPerBlock, totalStaked);
    const tvl = Math.round(totalStaked * price);

    const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${data.address}&startblock=0&endblock=99999999&sort=asc&apikey=HQ1F33DXXJGEF74NKMDNI7P8ASS4BHIJND`;

    let sHistoryResult: any = await axios.get(url);
    sHistoryResult = sHistoryResult.data.result;
    if (sHistoryResult === "Max rate limit reached" || !sHistoryResult) sHistoryResult = [];
    // console.log(sHistoryResult);
    let txCount = 0,
      sAmounts = {},
      _stakedAddressesHistory = [],
      totalFee = 0,
      tempStaked = 0,
      sHistory: any = [],
      _totalStakedHistory = [],
      _tokenFeeHistory = [],
      _performanceFeeHistory = [];

    sHistoryResult.map((history: any) => {
      if (history.functionName.includes("deposit(")) {
        const iface = new ethers.utils.Interface(["function deposit(uint256 _pid, uint256 _amount)"]);
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
        const iface = new ethers.utils.Interface(["function withdraw(uint256 _pid, uint256 _amount)"]);
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

      const functions = ["deposit(", "withdraw(", "claimReward("];
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
      totalStaked: Math.round(totalStaked),
      apr: apr.toFixed(2),
      price,
      tvl,
      totalPerformanceFee: (txCount * data.performanceFee) / Math.pow(10, 18),
      totalFee: totalFee / Math.pow(10, data.stakingToken.decimals),
      totalStakedAddresses: c,
      graphData: [_totalStakedHistory, _tokenFeeHistory, _performanceFeeHistory, tempHistory],
      isCustody: false,
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
          name: "pendingRewards",
          params: [0, address],
        },
        {
          address: data.address,
          name: "userInfo",
          params: [0, address],
        },
      ];
      const result = await multicall(FarmABI, calls, data.chainID);
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
      const totalInfos = await Promise.all([fetchTokenTxAmount(data.address, data.chainID, data.earningToken.address)]);

      const rewardResult: any = totalInfos[0];

      return {
        pendingReward: result[0][0] / Math.pow(10, data.earningToken.decimals),
        stakedAmount: result[1][0],
        balance: balanceResult[0][0],
        allowance: balanceResult[1][0] > "10000",
        totalReward:
          rewardResult.data !== undefined
            ? getEarningAmount(rewardResult.data.result, data.earningToken.decimals)
            : data.totalReward,
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
    setAccountData(zappers);
  }, [chainId, address]);

  useSlowRefreshEffect(() => {
    fetchPoolDatas();
  }, []);

  useFastRefreshEffect(() => {
    if (!address) {
      setAccountData(zappers);
      return;
    }
    fetchAccountPoolDatas();
  }, [address, chainId]);

  return <ZapperContext.Provider value={{ data, accountData }}>{children}</ZapperContext.Provider>;
};

export { ZapperContext, ZapperContextProvider };
