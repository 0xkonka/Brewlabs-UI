import masterchefABI from "config/abi/externalMasterchef";
import { AppId } from "config/constants/types";
import { Farm } from "state/types";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchApeFarmUserStakedBalances = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const client = getViemClients({ chainId });
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP);
  const calls: any = farmsConfig.map((farm) => {
    return {
      address: masterChefAddress,
      abi: masterchefABI,
      functionName: "userInfo",
      args: [farm.pid, account],
    };
  });

  const rawStakedBalances = await client.multicall({ contracts: calls });
  const parsedStatedBalances = rawStakedBalances.map((stakedBalance) => {
    return stakedBalance.result[0].toString();
  });
  const parsedTotalRewards = rawStakedBalances.map((stakedBalance) => {
    return stakedBalance.result[2].toString();
  });
  return [parsedStatedBalances, parsedTotalRewards];
};

export const fetchApeFarmUserEarnings = async (chainId: number, account: string, farmsConfig: Farm[]) => {
  const client = getViemClients({ chainId });
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP);
  const calls: any = farmsConfig.map((farm) => {
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
