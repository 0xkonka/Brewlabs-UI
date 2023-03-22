/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { WNATIVE } from "@brewlabs/sdk";
import { erc20ABI, useAccount, useSigner } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";

import ERC20ABI from "config/abi/erc20.json";
import claimableTokenAbi from "config/abi/claimableToken.json";
import dividendTrackerAbi from "config/abi/dividendTracker.json";
import prices from "config/constants/prices";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useDailyRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { getContract, getDividendTrackerContract, getMulticallContract } from "utils/contractHelpers";

const DashboardContext: any = React.createContext({
  tokens: [],
  priceHistory: [],
  marketHistory: [],
  tokenList: [],
  pending: false,
  setPending: () => {},
});

const CHAIN_NAME: any = {
  1: "ETH",
  56: "BNB",
};

const apiKeyList = [
  "82fc55c0-9833-4d12-82bb-48ae9748bead",
  "10760947-8c9a-4a18-b20f-2be694baf496",
  "4853da0a-f79f-4714-a915-d683b8168e1e",
  "4f616412-ca6d-4876-9a94-dac14e142b12",
];

const tokenList_URI: any = {
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  1: "https://tokens.coingecko.com/ethereum/all.json",
};

let temp_addr: any, temp_id: any;
const DashboardContextProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState([]);
  const [marketHistory, setMarketHistory] = useState([]);
  const [pending, setPending] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const { address } = useAccount();
  // const address = "0xfd18d8638c1659b602905c29c0bc0e93c6d2426c";
  temp_addr = address;
  const { chainId } = useActiveChainId();
  temp_id = chainId;
  const { data: signer }: any = useSigner();

  async function multicall(abi: any, calls: any) {
    const itf = new ethers.utils.Interface(abi);
    const multi = getMulticallContract(chainId);
    const calldata = calls.map((call: any) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  }

  const fetchTokenBaseInfo = async (address: any, type = "name symbol decimals") => {
    let calls: any = [];
    const splitList = type.split(" ");
    for (let i = 0; i < splitList.length; i++)
      calls.push({
        address: address,
        name: splitList[i],
      });
    const result = await multicall(erc20ABI, calls);
    return result;
  };

  const isScamToken = async (token: any) => {
    let isScam = false;
    if (!token.name.includes("_Tracker")) {
      try {
        if (signer && token.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
          const tokenContract = getContract(chainId, token.address, ERC20ABI, signer);
          await tokenContract.estimateGas.transfer("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", 1);
        }
      } catch (error) {
        isScam = true;
      }
    }
    return isScam;
  };

  async function fetchPrice(address: any, chainID: number, resolution: number) {
    const to = Math.floor(Date.now() / 1000);
    const url = `https://api.dex.guru/v1/tradingview/history?symbol=${
      address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" || !address ? WNATIVE[chainID].address : address
    }-${chainID === 56 ? "bsc" : "eth"}_USD&resolution=${resolution}&from=${to - 3600 * 24}&to=${to}`;
    let result: any = await axios.get(url);
    return result;
  }

  async function fetchPrices() {
    let data: any;

    data = await Promise.all(
      prices.map(async (data: any) => {
        const tokenInfo = await fetchPrice(data.address, data.chainId, 60);

        const serializedToken = { ...data, history: tokenInfo.data.c };
        return serializedToken;
      })
    );

    setPriceHistory(data);
    return data;
  }

  const fetchTokenInfo = async (token: any) => {
    try {
      let result: any = await fetchPrice(token.address, chainId, 10);

      let reward = {
          pendingRewards: 0,
          totalRewards: 0,
          symbol: "",
        },
        isReward = false,
        balance = token.balance;
      try {
        let calls = [
          {
            address: token.address,
            name: "dividendTracker",
          },
          {
            address: token.address,
            name: "balanceOf",
            params: [address],
          },
        ];
        const claimableResult = await multicall(claimableTokenAbi, calls);
        const dividendTracker = claimableResult[0][0];
        balance = claimableResult[1][0] / Math.pow(10, token.decimals);
        let rewardToken: any,
          pendingRewards = 0,
          totalRewards = 0;
        try {
          const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
          const rewardTokenAddress = await dividendTrackerContract.rewardToken();
          const rewardTokenBaseinfo = await fetchTokenBaseInfo(rewardTokenAddress);
          rewardToken = {
            address: rewardTokenAddress,
            name: rewardTokenBaseinfo[0][0],
            symbol: rewardTokenBaseinfo[1][0],
            decimals: rewardTokenBaseinfo[2][0],
          };
        } catch (e) {
          rewardToken = {
            address: "0x0",
            name: CHAIN_NAME[chainId],
            symbol: CHAIN_NAME[chainId],
            decimals: 18,
          };
        }
        calls = [
          {
            address: dividendTracker,
            name: "withdrawableDividendOf",
            params: [address],
          },
          {
            address: dividendTracker,
            name: "withdrawnDividendOf",
            params: [address],
          },
        ];
        const rewardResult = await multicall(dividendTrackerAbi, calls);
        pendingRewards = rewardResult[0][0];
        totalRewards = rewardResult[1][0];
        reward.pendingRewards =
          pendingRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.totalRewards =
          totalRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.symbol = rewardToken.symbol;
        isReward = true;
      } catch (e) {}

      let scamResult: any = await Promise.all([await isScamToken(token)]);
      scamResult = scamResult[0];

      return {
        priceList: result.data ? result.data.c : token.priceList,
        price: result.data ? result.data.c[result.data.c.length - 1] : token.price,
        reward,
        isScam: scamResult !== undefined ? scamResult : token.isScam,
        isReward,
        balance,
      };
    } catch (error) {
      console.log(error);
      return token;
    }
  };

  const fetchTokenInfos = async (tokens: []) => {
    let data: any;

    data = await Promise.all(
      tokens.map(async (data: any) => {
        const tokenInfo = await fetchTokenInfo(data);
        const serializedToken = { ...data, ...tokenInfo };
        return serializedToken;
      })
    );
    return data;
  };

  async function fetchTokenBalances() {
    const multicallContract = getMulticallContract(chainId);
    const ethBalance = await multicallContract.getEthBalance(address);
    let data: any = [];
    if (chainId === 1) {
      const result = await axios.get(`https://api.blockchain.info/v2/eth/data/account/${address}/tokens`);
      const nonZeroBalances = result.data.tokenAccounts.filter((data: any) => data.balance / 1 > 0);
      data = await Promise.all(
        nonZeroBalances.map(async (token: any) => {
          const data = await Promise.all([
            // fetchPrice(token.tokenHash, chainId, 10),
            fetchTokenBaseInfo(token.tokenHash, "name"),
          ]);
          return {
            address: token.tokenHash,
            balance: token.balance / Math.pow(10, token.decimals),
            decimals: token.decimals,
            name: data[0][0][0],
            symbol: token.tokenSymbol,
            price: 0,
            priceList: [0],
          };
        })
      );
    } else if (chainId === 56) {
      const result = await axios.get(
        `https://bsc-explorer-api.nodereal.io/api/token/getTokensByAddress?address=${address}&pageSize=0x64`
      );
      data = result.data.data.erc20.details
        .filter(
          (token: any) =>
            token.tokenBalance / Math.pow(10, token.tokenDecimals / 1) > 0 && !token.tokenName.includes("u0000")
        )
        .map((token: any) => {
          return {
            address: token.tokenAddress,
            balance: token.tokenBalance / Math.pow(10, token.tokenDecimals / 1),
            decimals: token.tokenDecimals / 1,
            name: token.tokenName,
            symbol: token.tokenSymbol,
            price: token.price,
            priceList: [token.price],
          };
        });
    }
    data.push({
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      balance: ethBalance / Math.pow(10, 18),
      decimals: 18,
      name: chainId === 1 ? "Ethereum" : "Binance",
      symbol: chainId === 1 ? "ETH" : "BNB",
      price: 0,
      priceList: [0],
    });
    return data;
  }
  async function fetchTokens() {
    try {
      const items: any = await fetchTokenBalances();
      let _tokens: any = [];

      for (let i = 0; i < items.length; i++) {
        const filter = tokens.filter((data) => data.address.toLowerCase() === items[i].address.toLowerCase());
        _tokens.push({
          balance: items[i].balance,
          name: items[i].name,
          symbol: items[i].symbol,
          decimals: items[i].decimals,
          address: items[i].address.toLowerCase(),
          price: filter.length ? filter[0].price : items[i].price,
          priceList: filter.length ? filter[0].priceList : items[i].priceList,
          reward: {
            totalRewards: filter.length ? filter[0].reward.totalRewards : 0,
            pendingRewards: filter.length ? filter[0].reward.pendingRewards : 0,
            symbol: filter.length ? filter[0].reward.symbol : "",
          },
          isScam: filter.length ? filter[0].isScam : false,
          isReward: filter.length ? filter[0].isReward : false,
        });
      }

      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;
      setTokens(_tokens);
      let tokenInfos: any = await fetchTokenInfos(_tokens);
      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;

      setTokens(tokenInfos);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMarketInfo() {
    let i;
    for (i = 0; i < apiKeyList.length; i++) {
      try {
        const response = await fetch(new Request("https://api.livecoinwatch.com/overview/history"), {
          method: "POST",
          headers: new Headers({
            "content-type": "application/json",
            "x-api-key": apiKeyList[i],
          }),
          body: JSON.stringify({
            currency: "USD",
            start: Date.now() - 1000 * 3600 * 24,
            end: Date.now(),
          }),
        });
        let result = await response.json();
        let temp: any = [];
        for (let i = 0; i < result.length; i++) {
          temp.push(result[i].cap);
        }
        setMarketHistory(temp);
        break;
      } catch (error) {
        console.log(error);
      }
    }
    if (i === apiKeyList.length) {
      setMarketHistory([]);
    }
  }

  async function fetchTokenList() {
    try {
      const result = await axios.get(tokenList_URI[chainId]);
      setTokenList(result.data.tokens);
    } catch (error) {
      console.log(error);
    }
  }

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !signer || !address) {
      setTokens([]);
    } else {
      fetchTokens();
    }
  }, [chainId, signer]);

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1)) {
      setMarketHistory([]);
    } else {
      fetchMarketInfo();
    }
  }, [chainId]);

  useDailyRefreshEffect(() => {
    fetchTokenList();
  }, [chainId]);

  useEffect(() => {
    setTokens([]);
  }, [chainId, address]);

  useSlowRefreshEffect(() => {
    fetchPrices();
  }, []);

  return (
    <DashboardContext.Provider value={{ tokens, marketHistory, pending, setPending, tokenList, priceHistory }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
