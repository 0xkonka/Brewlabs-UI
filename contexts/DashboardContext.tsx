import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "config/constants";
import { useSlowRefreshEffect, useDailyRefreshEffect } from "hooks/useRefreshEffect";
import { balanceQuery } from "./queries";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getMulticallContract } from "utils/contractHelpers";
import ERC20ABI from "../config/abi/erc20.json";

import { ethers } from "ethers";
import { filter } from "lodash";

const DashboardContext = React.createContext({
  tokens: [],
});

const API_KEY: any = {
  56: "QMDXDTXQEXI4ZNFVECYNW7IQQ1AKKZ85P1",
  1: "47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX",
};

const tokenList_URI: any = {
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  1: "https://tokens.coingecko.com/ethereum/all.json",
};

const SCAN_URI: any = {
  1: "api.etherscan.io",
  56: "api.bscscan.com",
};

const DashboardContextProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState([]);
  const [tokenlist, setTokenList] = useState([]);
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

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

  async function splitMulticall(abi: any, calls: any) {
    let len = calls.length / 1500;
    let result: any = [];
    for (let i = 0; i < len; i++) {
      let _calls = [];
      for (let j = i * 1500; j < Math.min((i + 1) * 1500, calls.length); j++) {
        _calls.push(calls[j]);
      }
      const _result = await multicall(abi, _calls);
      result = [...result, ..._result];
    }
    return result;
  }

  const fetchTokenInfo = async (token: any) => {
    try {
      const to = Math.floor(Date.now() / 1000);
      let result = await axios.get(
        `https://api.dex.guru/v1/tradingview/history?symbol=${token.address}-${
          chainId === 56 ? "bsc" : "eth"
        }_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`
      );
      const calls = [
        {
          address: token.address,
          name: "name",
        },
        {
          address: token.address,
          name: "symbol",
        },
        {
          address: token.address,
          name: "decimals",
        },
      ];
      const _infoResult = await multicall(ERC20ABI, calls);

      const isVerifiedResult = await axios.get(
        `https://${SCAN_URI[chainId]}/api?module=contract&action=getabi&address=${token.address}&apikey=${API_KEY[chainId]}`
      );

      return {
        ...token,
        priceList: result.data.c,
        price: result.data.c[result.data.c.length - 1],
        name: _infoResult[0][0],
        symbol: _infoResult[1][0],
        decimals: _infoResult[2][0],
        isVerified: isVerifiedResult.data.message === "NOTOK" ? false : true,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokenInfos = async (tokens: []) => {
    const data = await Promise.all(
      tokens.map(async (data) => {
        const tokenInfo: any = await fetchTokenInfo(data);
        const serializedToken = { ...tokenInfo };
        return serializedToken;
      })
    );
    return data;
  };

  async function fetchTokens() {
    try {
      let tokenTxs: any = await axios.get(
        `https://${SCAN_URI[chainId]}/api?module=account&action=tokentx&address=${address}&page=1&offset=10000&sort=desc&apikey=${API_KEY[chainId]}`
      );
      tokenTxs = tokenTxs.data.result;
      let tokenListCalls: any = [];
      for (let i = 0; i < tokenTxs.length; i++) {
        const filter = tokenListCalls.filter((data: any) => data.address === tokenTxs[i].contractAddress);
        if (filter.length) continue;
        if (tokenTxs[i].to === address?.toLowerCase()) {
          tokenListCalls.push({
            address: tokenTxs[i].contractAddress,
            name: "balanceOf",
            params: [address],
          });
        }
      }
      let _tokens: any = [];
      const result = await splitMulticall(ERC20ABI, tokenListCalls);
      for (let i = 0; i < tokenListCalls.length; i++) {
        if (result[i][0] / 1 > 0) {
          const filters: any = tokenlist.filter((data: any) => data.address === tokenListCalls[i].address);
          // if (filters.length) {
          // console.log(filters[0].name);
          _tokens.push({
            // name: filters[0].name,
            // symbol: filters[0].symbol,
            // decimals: filters[0].decimals,
            balance: result[i][0],
            isReward: true,
            isScam: false,
            logo: filters.length ? filters[0].logoURI : "/logo.png",
            address: tokenListCalls[i].address,
            reward: {
              totalRewards: 0,
              pendingRewards: 0,
              symbol: "",
            },
          });
          // }
        }
      }
      let tokenInfos: any = await fetchTokenInfos(_tokens);
      console.log(tokenInfos);
      setTokens(tokenInfos);
    } catch (error) {
      console.log(error);
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
    if (!(chainId === 56 || chainId === 1) || !address || !tokenlist.length) {
      setTokens([]);
    } else fetchTokens();
  }, [chainId, address, tokenlist]);

  useDailyRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !address) setTokenList([]);
    else {
      fetchTokenList();
    }
  }, [chainId]);

  return <DashboardContext.Provider value={{ tokens }}>{children}</DashboardContext.Provider>;
};

export { DashboardContext, DashboardContextProvider };
