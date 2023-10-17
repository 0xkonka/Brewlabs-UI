import { WNATIVE } from "@brewlabs/sdk";
import axios from "axios";

import { DEX_GURU_CHAIN_NAME } from "config";
import { ERC20_ABI } from "config/abi/erc20";
import { DEX_GURU_WETH_ADDR } from "config/constants";
import prices from "config/constants/prices";
import { getViemClients } from "utils/viem";
import { erc20ABI } from "wagmi";

export const fetchTokenBaseInfo = async (
  address: any,
  chainId: number,
  type = "name symbol decimals",
  accountAddress: string = null
) => {
  const client = getViemClients({ chainId });

  let calls: any = [];
  const splitList = type === "" ? [] : type.split(" ");

  for (let i = 0; i < splitList.length; i++) calls.push({ address, abi: erc20ABI, functionName: splitList[i] });
  if (accountAddress) calls.push({ address, abi: erc20ABI, functionName: "balanceOf", args: [accountAddress] });

  const result = await client.multicall({ contracts: calls });
  return result.map((r) => r?.result);
};

export async function fetchPrice(address: any, chainId: number, resolution: number, period = 86400) {
  const to = Math.floor(Date.now() / 1000);
  const url = `https://api.dex.guru/v1/tradingview/history?symbol=${
    address === DEX_GURU_WETH_ADDR || !address ? WNATIVE[chainId].address : address
  }-${DEX_GURU_CHAIN_NAME[chainId]}_USD&resolution=${resolution}&from=${to - period}&to=${to}`;
  let result: any = await axios.get(url);
  return result;
}

export async function fetchFeaturedPrices() {
  let data: any;
  data = await Promise.all(
    prices.map(async (data: any) => {
      const tokenInfo = await fetchPrice(data.address, data.chainId, 60);
      const serializedToken = { ...data, history: tokenInfo.data.c };
      return serializedToken;
    })
  );

  return data;
}
