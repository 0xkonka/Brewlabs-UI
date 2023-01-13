import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
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

const emptyLogos = {
  1: "/images/dashboard/tokens/empty-token-eth.webp",
  56: "/images/dashboard/tokens/empty-token-bsc.webp",
};

const SCAN_URI: any = {
  1: "api.etherscan.io",
  56: "api.bscscan.com",
};

const WETH_ADDR: any = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  56: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
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

  function imageExists(url: any) {
    return new Promise((resolve) => {
      var img = new Image();
      img.addEventListener("load", () => resolve(true));
      img.addEventListener("error", () => resolve(false));
      img.src = url;
    });
  }
  const fetchTokenInfo = async (token: any) => {
    try {
      const to = Math.floor(Date.now() / 1000);
      const url = `https://api.dex.guru/v1/tradingview/history?symbol=${token.address}-${
        chainId === 56 ? "bsc" : "eth"
      }_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`;
      let result = await axios.get(url);

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
        if (rewardToken.address === "0x0" || token.name.toLowerCase() === "brewlabs") {
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
        if (signer && token.address !== WETH_ADDR[chainId]) {
          const tokenContract = getContract(chainId, token.address, ERC20ABI, signer);
          await tokenContract.estimateGas.transfer("0x2170Ed0880ac9A755fd29B2688956BD959F933F8", 1);
        }
      } catch (error) {
        isScam = true;
      }

      let logoExist;
      try {
        logoExist = await imageExists(token.logo);
      } catch (e) {}
      return {
        ...token,
        logo: logoExist ? token.logo : emptyLogos[chainId],
        priceList: result.data.c,
        price: result.data.c[result.data.c.length - 1],
        isVerified: isVerifiedResult.data.message === "NOTOK" ? false : true,
        reward,
        isScam: isScam,
        isReward,
      };
    } catch (error) {
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
      for (let i = 0; i < items.length; i++) {
        if (items[i].balance / 1 > 0)
          _tokens.push({
            balance: items[i].balance,
            name: items[i].contract_name,
            symbol: items[i].contract_ticker_symbol,
            decimals: items[i].contract_decimals,
            logo: items[i].logo_url,
            address:
              items[i].contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                ? WETH_ADDR[chainId]
                : items[i].contract_address,
          });
      }
      let tokenInfos: any = await fetchTokenInfos(_tokens, tokens.length === 0);
      console.log(tokenInfos);
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

  useSlowRefreshEffect(() => {
    if (!(chainId === 56 || chainId === 1) || !signer) {
      setTokens([]);
    } else {
      fetchMarketInfo();
      fetchTokens();
    }
  }, [chainId, signer]);

  return (
    <DashboardContext.Provider value={{ tokens, marketHistory, pending, setPending }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };
