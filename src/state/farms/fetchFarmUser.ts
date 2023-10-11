import { ChainId } from "@brewlabs/sdk";
import axios from "axios";
import { erc20ABI } from "wagmi";

import masterchefABI from "config/abi/farm/masterchef";
import farmImplAbi from "config/abi/farm/farmImpl";

import { API_URL } from "config/constants";
import { SerializedFarmConfig } from "config/constants/types";
import { getMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchFarmUserAllowances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);
  const publicClient = getViemClients({ chainId });

  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.lpAddress as `0x${string}`,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account, (farm.contractAddress ?? masterChefAddress) as `0x${string}`],
    };
  });

  const rawLpAllowances = await publicClient.multicall({ contracts: calls });
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return lpBalance.result.toString();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  try {
    const publicClient = getViemClients({ chainId });
    const calls = farmsToFetch.map((farm) => {
      return {
        address: farm.lpAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [account],
      };
    });

    const rawTokenBalances = await publicClient.multicall({ contracts: calls });
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
      return tokenBalance.result.toString();
    });
    return parsedTokenBalances;
  } catch (e) {
    return [];
  }
};

export const fetchFarmUserStakedBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);
  const publicClient = getViemClients({ chainId });

  let data = [];

  // fetch normal farms
  const calls = farmsToFetch
    .filter((f) => !f.category)
    .map((farm) => ({
      address: (farm.contractAddress ?? masterChefAddress) as `0x${string}`,
      abi: masterchefABI,
      functionName: "userInfo",
      args: [BigInt(farm.poolId), account],
    }));
  let rawStakedBalances = await publicClient.multicall({ contracts: calls });

  farmsToFetch
    .filter((f) => !f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        stakedBalance: rawStakedBalances[index].result[0].toString(),
      });
    });

  // fetch factroy-created farms
  rawStakedBalances = await publicClient.multicall({
    contracts: farmsToFetch
      .filter((f) => f.category)
      .map((farm) => ({
        address: farm.contractAddress as `0x${string}`,
        abi: farmImplAbi,
        functionName: "userInfo",
        args: [account],
      })),
  });

  farmsToFetch
    .filter((f) => f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        stakedBalance: rawStakedBalances[index].result[0].toString(),
      });
    });

  return data;
};

export const fetchFarmUserEarnings = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  try {
    const masterChefAddress = getMasterChefAddress(chainId);
    const publicClient = getViemClients({ chainId });

    let data = [];

    // fetch normal farms
    let rawEarnings = await publicClient.multicall({
      contracts: farmsToFetch
        .filter((f) => !f.enableEmergencyWithdraw)
        .filter((f) => !f.category)
        .map((farm) => ({
          address: (farm.contractAddress ?? masterChefAddress) as `0x${string}`,
          abi: masterchefABI,
          functionName: "pendingRewards",
          args: [BigInt(farm.poolId), account],
        })),
    });

    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => !f.category)
      .forEach((farm, index) => {
        data.push({
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          earnings: rawEarnings[index].result.toString(),
        });
      });

    // fetch factroy-created farms
    rawEarnings = await publicClient.multicall({
      contracts: farmsToFetch
        .filter((f) => !f.enableEmergencyWithdraw)
        .filter((f) => f.category)
        .map((farm) => ({
          address: farm.contractAddress as `0x${string}`,
          abi: farmImplAbi,
          functionName: "pendingRewards",
          args: [account],
        })),
    });

    farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => f.category)
      .forEach((farm, index) => {
        data.push({
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          earnings: rawEarnings[index].result.toString(),
        });
      });

    return data;
  } catch (e) {
    return [];
  }
};

export const fetchFarmUserReflections = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);
  const publicClient = getViemClients({ chainId });

  let data = [];

  // fetch normal farms
  let rawReflections = await publicClient.multicall({
    contracts: farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => !f.category)
      .map((farm) => ({
        address: (farm.contractAddress ?? masterChefAddress) as `0x${string}`,
        abi: masterchefABI,
        functionName: "pendingReflections",
        args: [BigInt(farm.poolId), account],
      })),
  });

  farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .filter((f) => !f.category)
    .map((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        reflections: rawReflections[index].result.toString(),
      });
    });

  // fetch factroy-created farms
  rawReflections = await publicClient.multicall({
    contracts: farmsToFetch
      .filter((f) => !f.enableEmergencyWithdraw)
      .filter((f) => f.category)
      .map((farm) => ({
        address: farm.contractAddress as `0x${string}`,
        abi: farmImplAbi,
        functionName: "pendingReflections",
        args: [account],
      })),
  });

  farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .filter((f) => f.category)
    .forEach((farm, index) => {
      data.push({
        pid: farm.pid,
        farmId: farm.farmId,
        poolId: farm.poolId,
        chainId: farm.chainId,
        reflections: rawReflections[index].result.toString(),
      });
    });

  return data;
};

export const fetchFarmUserDeposits = async (farm, account) => {
  const res = await axios.post(`${API_URL}/deposit/${account}/single`, { type: "farm", id: farm.pid });

  const ret = res?.data ?? [];

  let record = { pid: farm.pid, deposits: [] };
  record.deposits = ret.filter((d) => d.farmId === farm.pid);

  return record;
};
