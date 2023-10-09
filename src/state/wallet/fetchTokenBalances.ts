import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { fetchBalance } from "@wagmi/core";
import axios from "axios";
import { erc20ABI } from "wagmi";

import { ERC20_ABI } from "config/abi/erc20";
import claimableTokenAbi from "config/abi/claimableToken";
import dividendTrackerAbi from "config/abi/dividendTracker";

import { COVALENT_API_KEYS, COVALENT_CHAIN_NAME } from "config";
import { API_URL, DEX_GURU_WETH_ADDR } from "config/constants";
import { fetchTokenBaseInfo } from "contexts/DashboardContext/fetchFeaturedPrices";
import { getNativeSybmol } from "lib/bridge/helpers";
import { defaultMarketData } from "state/prices/types";
import { isAddress } from "utils";
import multicall from "utils/multicall";
import { getViemClients } from "utils/viem";

async function getTokenBaseBalances(account: string, chainId: number) {
  if (!isAddress(account) || !Object.keys(COVALENT_CHAIN_NAME).includes(chainId.toString())) return [];

  let data: any = [];
  if (chainId === 56) {
    data = await axios.post(`${API_URL}/html/getTokenBalances`, { address: account, chainId });
    data = data.data;
  } else {
    const { data: response } = await axios.get(
      `https://api.covalenthq.com/v1/${COVALENT_CHAIN_NAME[chainId]}/address/${account}/balances_v2/?`,
      { headers: { Authorization: `Bearer ${COVALENT_API_KEYS[0]}` } }
    );
    if (response.error) return [];
    const items = response.data.items;

    data = items
      .filter((i) => i.balance !== "0")
      .map((item) => {
        return {
          address: item.contract_address,
          balance: item.balance / Math.pow(10, item.contract_decimals),
          decimals: item.contract_decimals,
          name: item.contract_name,
          symbol: item.contract_ticker_symbol,
        };
      });

    // fetch missing symbol & decimals
    const calls = [];
    data
      .filter((i) => !i.name)
      .forEach((element) => {
        calls.push(
          {
            name: "name",
            address: element.address,
          },
          {
            name: "symbol",
            address: element.address,
          },
          {
            name: "decimals",
            address: element.address,
          }
        );
      });
    const result = await multicall(ERC20_ABI, calls, chainId);

    data = [
      ...data.filter((i) => i.name),
      ...data
        .filter((i) => !i.name)
        .map((item, index) => ({
          address: item.address,
          balance: item.balance / Math.pow(10, result[3 * index + 2][0]),
          decimals: result[3 * index + 2][0],
          name: result[3 * index][0],
          symbol: result[3 * index + 1][0],
        })),
    ];
  }
  if (chainId === ChainId.BSC_MAINNET) {
    const ethBalance = await fetchBalance({ address: account as `0x${string}`, chainId, formatUnits: "ether" });
    data.push({
      address: DEX_GURU_WETH_ADDR,
      balance: +ethBalance.value.toString() / Math.pow(10, 18),
      decimals: 18,
      name: "Binance",
      symbol: "BNB",
    });
  }
  if (!data.length) {
    data.push({
      address: DEX_GURU_WETH_ADDR,
      balance: 0,
      decimals: 18,
      name: WNATIVE[chainId].name,
      symbol: WNATIVE[chainId].symbol,
    });
  }
  return data;
}

const isScamToken = async (token: any, account: string, chainId: number) => {
  let isScam = false;

  if (!token.name?.includes("_Tracker")) {
    try {
      if (account && token.address !== DEX_GURU_WETH_ADDR) {
        const publicClient = getViemClients({ chainId });
        await publicClient.simulateContract({
          address: token.address,
          abi: erc20ABI,
          functionName: "transfer",
          args: ["0x2170Ed0880ac9A755fd29B2688956BD959F933F8", BigInt(1)],
          account,
        });
      }
    } catch (error) {
      isScam = true;
    }
  }
  return isScam;
};

const fetchTokenInfo = async (token: any, chainId: number, address: string) => {
  try {
    const publicClient = getViemClients({ chainId });
    let reward = {
        pendingRewards: 0,
        totalRewards: 0,
        symbol: "",
      },
      isReward = false;

    try {
      const claimableResult = await publicClient.multicall({
        contracts: [
          {
            address: token.address as `0x${string}`,
            abi: claimableTokenAbi,
            functionName: "dividendTracker",
          },
        ],
      });
      const dividendTracker: any = claimableResult[0]?.result;

      let rewardToken: any,
        pendingRewards: any = BigInt(0),
        totalRewards: any = BigInt(0);
      try {
        const rewardTokenAddress = await publicClient.readContract({
          address: dividendTracker as `0x${string}`,
          abi: dividendTrackerAbi,
          functionName: "rewardToken",
        });
        const rewardTokenBaseinfo = await fetchTokenBaseInfo(rewardTokenAddress, chainId);
        rewardToken = {
          address: rewardTokenAddress,
          name: rewardTokenBaseinfo[0][0],
          symbol: rewardTokenBaseinfo[1][0],
          decimals: rewardTokenBaseinfo[2][0],
        };
      } catch (e) {
        rewardToken = {
          address: "0x0",
          name: getNativeSybmol[chainId],
          symbol: getNativeSybmol[chainId],
          decimals: 18,
        };
      }

      let calls = [
        {
          address: dividendTracker,
          abi: dividendTrackerAbi,
          functionName: "withdrawableDividendOf",
          args: [address],
        },
        {
          address: dividendTracker,
          abi: dividendTrackerAbi,
          functionName: "withdrawnDividendOf",
          args: [address],
        },
      ];
      const rewardResult = await publicClient.multicall({ contracts: calls });
      pendingRewards = rewardResult[0].result;
      totalRewards = rewardResult[1].result;

      reward.pendingRewards =
        +pendingRewards.toString() / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
      reward.totalRewards =
        +totalRewards.toString() / Math.pow(10, token.name.toLowerCase() === "brewlabs" ? 18 : rewardToken.decimals);
      reward.symbol = rewardToken.symbol;
      isReward = true;
    } catch (e) {}

    let scamResult: any = await isScamToken(token, address, chainId);

    return {
      reward,
      isScam: scamResult !== undefined ? scamResult : token.isScam,
      isReward,
    };
  } catch (error) {
    console.log(error);
    return token;
  }
};

export const getTokenDetails = async (tokens: any, chainId: ChainId, address: string) => {
  if (!isAddress(address) || !Object.keys(COVALENT_CHAIN_NAME).includes(chainId.toString()) || !tokens.length)
    return [];
  let data: any;

  data = await Promise.all(
    tokens.map(async (data: any) => {
      const tokenInfo = await fetchTokenInfo(data, chainId, address);
      const serializedToken = { ...data, ...tokenInfo };
      return serializedToken;
    })
  );
  return data;
};

export async function getTokenBalances(account: string, chainId: ChainId, tokenMarketData: any) {
  if (!isAddress(account) || !Object.keys(COVALENT_CHAIN_NAME).includes(chainId.toString())) return [];
  try {
    const items: any = await getTokenBaseBalances(account, chainId);
    let _tokens: any = [];

    for (let i = 0; i < items.length; i++) {
      const address = items[i].address;
      const { usd: price } =
        tokenMarketData[address === DEX_GURU_WETH_ADDR ? WNATIVE[chainId].address.toLowerCase() : address] ||
        defaultMarketData;

      _tokens.push({
        ...items[i],
        price: price ?? 0,
        chainId,
      });
    }

    return _tokens;
  } catch (error) {
    console.log(error);
    return [];
  }
}
