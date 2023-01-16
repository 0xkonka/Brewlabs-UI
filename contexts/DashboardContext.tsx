import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDailyRefreshEffect, useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { erc20ABI, useAccount, useProvider, useSigner } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import {
  getClaimableTokenContract,
  getContract,
  getDividendTrackerContract,
  getMulticallContract,
} from "utils/contractHelpers";
import ERC20ABI from "../config/abi/erc20.json";

import { ethers } from "ethers";

const DashboardContext: any = React.createContext({
  tokens: [],
  marketHistory: [],
  tokenList: [],
  pending: false,
  setPending: () => {},
});

const WETH_ADDR: any = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
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

const tokenList_URI: any = {
  56: "https://tokens.coingecko.com/binance-smart-chain/all.json",
  1: "https://tokens.coingecko.com/ethereum/all.json",
};

let temp_addr, temp_id;
const DashboardContextProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState([]);
  const [marketHistory, setMarketHistory] = useState([]);
  const [allowance, setAllowances] = useState([]);
  const [pending, setPending] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const { address } = useAccount();
  // const address = "0x53Ff4a10a30deb6d412f9b47caeec28af7f8e799";
  temp_addr = address;
  const { chainId } = useActiveChainId();
  temp_id = chainId;
  const { data: signer }: any = useSigner();
  const ethersProvider = useProvider();

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

  const fetchTokenInfo = async (token: any) => {
    try {
      const to = Math.floor(Date.now() / 1000);
      const url = `https://api.dex.guru/v1/tradingview/history?symbol=${
        token.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? WETH_ADDR[chainId] : token.address
      }-${chainId === 56 ? "bsc" : "eth"}_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;
      let result = await axios.get(url);

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
        const dividendTrackerContract = getDividendTrackerContract(chainId, dividendTracker);
        pendingRewards = await dividendTrackerContract.withdrawableDividendOf(address);
        totalRewards = await dividendTrackerContract.withdrawnDividendOf(address);
        reward.pendingRewards =
          pendingRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.totalRewards =
          totalRewards / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
        reward.symbol = rewardToken.symbol;
        isReward = true;
      } catch (e) {
        // console.log(e);
      }
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

      return {
        ...token,
        priceList: result.data.c,
        price: result.data.c[result.data.c.length - 1],
        reward,
        isScam: isScam,
        isReward,
      };
    } catch (error) {
      console.log(token.address);
      console.log(error);
    }
  };

  const fetchTokenInfos = async (tokens: [], initial: boolean) => {
    let data: any;
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
      console.log("Fetch Start");
      const covalUrl = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_6cd616c30ff1407bbbb4b12c5bd`;
      const covalReponse: any = await axios.get(covalUrl);
      const items = covalReponse.data.data.items;
      let _tokens: any = [];
      console.log("PREVIOUS", tokens);
      for (let i = 0; i < items.length; i++) {
        const filter = tokens.filter((data) => data.address.toLowerCase() === items[i].contract_address.toLowerCase());
        const price = filter.length
          ? filter[0].price
          : items[i].contract_ticker_symbol === "BUSD" || items[i].contract_ticker_symbol === "USDC"
          ? 1
          : items[i].quote_rate / 1;
        const isLP = !items[i].contract_name;
        let LPInfo;
        if (isLP) {
          LPInfo = await fetchTokenBaseInfo(items[i].contract_address);
          console.log(LPInfo);
        }
        if (items[i].balance / 1 > 0 || items[i].contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
          _tokens.push({
            balance: items[i].balance / Math.pow(10, isLP ? LPInfo[2] : items[i].contract_decimals),
            name: isLP ? LPInfo[0] : items[i].contract_name,
            symbol: isLP ? LPInfo[1] : items[i].contract_ticker_symbol,
            decimals: isLP ? LPInfo[2] : items[i].contract_decimals,
            // logo: items[i].logo_url,
            address: items[i].contract_address.toLowerCase(),
            price,
            priceList: filter.length ? filter[0].priceList : [price],
            reward: {
              totalRewards: filter.length ? filter[0].reward.totalRewards : 0,
              pendingRewards: filter.length ? filter[0].reward.pendingRewards : 0,
              symbol: filter.length ? filter[0].reward.symbol : "",
            },
            isScam: filter.length ? filter[0].isScam : false,
            isReward: filter.length ? filter[0].isReward : false,
          });
      }
      console.log(_tokens);

      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;
      setTokens(_tokens);
      let tokenInfos: any = await fetchTokenInfos(_tokens, tokens.length === 0);
      if (!temp_addr || temp_addr !== address || temp_id !== chainId) return;
      console.log("Tokens", tokenInfos);
      setTokens(tokenInfos);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMarketInfo() {
    let i;
    console.log("FETCH MARKET PRICE");
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
    console.log("Step 2 chainID, signer, address = ", chainId, signer, address);
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

  return (
    <DashboardContext.Provider value={{ tokens, marketHistory, pending, setPending, tokenList }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
