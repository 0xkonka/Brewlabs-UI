import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSlowRefreshEffect, useDailyRefreshEffect } from "hooks/useRefreshEffect";
import { erc20ABI, useAccount, useSigner } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import {
  getClaimableTokenContract,
  getContract,
  getDividendTrackerContract,
  getMulticallContract,
} from "utils/contractHelpers";
import ERC20ABI from "../config/abi/erc20.json";
import claimableTokenABI from "../config/abi/claimableToken.json";

import { ethers } from "ethers";

const DashboardContext: any = React.createContext({
  tokens: [],
  marketHistory: [],
  pending: false,
  setPending: () => {},
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

const WETH_ADDR: any = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
};

const CHAIN_LOGO: any = {
  1: "/images/dashboard/tokens/ETH.png",
  56: "/images/dashboard/tokens/BNB.png",
};

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

const DashboardContextProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState([]);
  const [marketHistory, setMarketHistory] = useState([]);
  const [pending, setPending] = useState(false);
  const [tokenlist, setTokenList] = useState([]);
  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { data: signer }: any = useSigner();

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

  const fetchTokenBaseInfo = async (address: any) => {
    const calls = [
      {
        address: address,
        name: "name",
      },
      {
        address: address,
        name: "symbol",
      },
      {
        address: address,
        name: "decimals",
      },
    ];
    const result = await multicall(erc20ABI, calls);
    return result;
  };

  const fetchEthBalance = async (address: any) => {
    const multicallContract = getMulticallContract(chainId);
    const result = await multicallContract.getEthBalance(address);
    return result;
  };

  const fetchTokenBalance = async (address: any, account: any) => {
    const multicallContract = getMulticallContract(chainId);
    const calls = [
      {
        name: "balanceOf",
        params: [account],
        address: address,
      },
    ];
    const result = await multicall(ERC20ABI, calls);
    return result[0][0];
  };

  const fetchTokenInfo = async (token: any) => {
    try {
      const to = Math.floor(Date.now() / 1000);
      const url = `https://api.dex.guru/v1/tradingview/history?symbol=${token.address}-${
        chainId === 56 ? "bsc" : "eth"
      }_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;
      let result = await axios.get(url);

      const _infoResult = await fetchTokenBaseInfo(token.address);

      const isVerifiedResult = await axios.get(
        `https://${SCAN_URI[chainId]}/api?module=contract&action=getabi&address=${token.address}&apikey=${API_KEY[chainId]}`
      );

      let reward = {
          pendingRewards: 0,
          totalRewards: 0,
          symbol: "",
        },
        isReward = false;
      try {
        const claimableContract = getClaimableTokenContract(chainId, token.address);
        const dividendTracker = await claimableContract.dividendTracker();
        let rewardToken,
          pendingRewards = 0,
          totalRewards = 0;
        try {
          // const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
          const rewardTokenAddress = await claimableContract.dividendToken();
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
            name: chainId === 56 ? "BNB" : "ETH",
            symbol: chainId === 56 ? "BNB" : "ETH",
            decimals: 18,
          };
        }
        if (rewardToken.address === "0x0") {
          totalRewards = await fetchEthBalance(dividendTracker);
        } else {
          totalRewards = await fetchTokenBalance(rewardToken.address, dividendTracker);
        }
        const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
        pendingRewards = await dividendTrackerContract.withdrawableDividendOf(address);
        reward.pendingRewards = pendingRewards / Math.pow(10, rewardToken.decimals);
        reward.totalRewards = totalRewards / Math.pow(10, rewardToken.decimals);
        reward.symbol = rewardToken.symbol;
        isReward = true;
      } catch (e) {
        // console.log(e);
      }
      let isScam = false;
      try {
        if (signer) {
          const tokenContract = getContract(chainId, token.address, ERC20ABI, signer);
          await tokenContract.estimateGas.transfer("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", 1);
        }
      } catch (error) {
        isScam = true;
      }
      return {
        ...token,
        priceList: result.data.c,
        price: result.data.c[result.data.c.length - 1],
        name: token.logo === CHAIN_LOGO[chainId] ? CHAIN_NAME[chainId] : _infoResult[0][0],
        symbol: token.logo === CHAIN_LOGO[chainId] ? CHAIN_NAME[chainId] : _infoResult[1][0],
        decimals: _infoResult[2][0],
        isVerified: isVerifiedResult.data.message === "NOTOK" ? false : true,
        reward,
        isScam: token.logo === CHAIN_LOGO[chainId] ? false : isScam,
        isReward,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokenInfos = async (tokens: [], initial: boolean) => {
    let data;
    console.log("Initial", initial);
    if (initial)
      data = await Promise.all(
        tokens.map(async (data: any) => {
          const tokenInfo = await fetchTokenInfo(data);
          const serializedToken = { ...tokenInfo };
          return serializedToken;
        })
      );
    else {
      let temp = [];
      for (let i = 0; i < tokens.length; i++) {
        const tokenInfo: any = await fetchTokenInfo(tokens[i]);
        temp.push(tokenInfo);
      }
      data = temp;
    }
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

      const ethBalance = await fetchEthBalance(address);
      if (ethBalance / 1 > 0) {
        console.log(ethBalance.toString());
        _tokens.push({
          balance: ethBalance,
          logo: CHAIN_LOGO[chainId],
          address: WETH_ADDR[chainId],
        });
      }

      for (let i = 0; i < tokenListCalls.length; i++) {
        if (result[i][0] / 1 > 0) {
          const filters: any = tokenlist.filter((data: any) => data.address === tokenListCalls[i].address);
          _tokens.push({
            balance: result[i][0],
            logo: filters.length
              ? filters[0].logoURI
              : chainId === 56
              ? "/images/dashboard/tokens/empty-token-bsc.webp"
              : "/images/dashboard/tokens/empty-token-eth.webp",
            address: tokenListCalls[i].address,
          });
        }
      }
      console.log(_tokens);
      let tokenInfos: any = await fetchTokenInfos(_tokens, tokens.length === 0);
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

  async function fetchMarketInfo() {
    try {
      let i;
      for (i = 0; i < apiKeyList.length; i++) {
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
      }
      if (i === apiKeyList.length) {
        setMarketHistory([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !address || !tokenlist.length) {
      setTokens([]);
    } else {
      fetchMarketInfo();
      fetchTokens();
    }
  }, [chainId, address, tokenlist]);

  useDailyRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !address) setTokenList([]);
    else {
      fetchTokenList();
    }
  }, [chainId]);

  return (
    <DashboardContext.Provider value={{ tokens, marketHistory, pending, setPending }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
