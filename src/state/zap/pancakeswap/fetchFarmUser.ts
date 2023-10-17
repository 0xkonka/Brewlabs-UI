import { ChainId } from "@brewlabs/sdk";
import masterchefABI from "config/abi/externalMasterchef";
import { AppId } from "config/constants/types";
import { getExternalMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch) => {
  const client = getViemClients({ chainId: ChainId.BSC_MAINNET });
  const masterChefAddress = getMasterChefAddress(AppId.PANCAKESWAP);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      abi: masterchefABI,
      functionName: "userInfo",
      args: [farm.pid, account],
    };
  });

  const rawStakedBalances = await client.multicall({ contracts: calls });
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return stakedBalance.result[0].toString();
  });
  const parsedTotalRewards = rawStakedBalances.map((stakedBalance) => {
    return stakedBalance.result[2].toString();
  });
  return [parsedStakedBalances, parsedTotalRewards];
};

export const fetchFarmUserEarnings = async (account: string, farmsToFetch) => {
  const client = getViemClients({ chainId: ChainId.BSC_MAINNET });

  const masterChefAddress = getMasterChefAddress(AppId.PANCAKESWAP);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      abi: masterchefABI,
      functionName: "pendingCake",
      args: [farm.pid, account],
    };
  });

  const rawEarnings = await client.multicall({ contracts: calls });
  const parsedEarnings = rawEarnings.map((earnings) => {
    return earnings.result.toString();
  });
  return parsedEarnings;
};
