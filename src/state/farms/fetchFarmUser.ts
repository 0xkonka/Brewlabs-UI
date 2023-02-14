import { ChainId } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";

import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/masterchef.json";
import { SerializedFarmConfig } from "config/constants/types";
import { getMasterChefAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchFarmUserAllowances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.lpAddress,
      name: "allowance",
      params: [account, farm.contractAddress ?? masterChefAddress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls, chainId);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.lpAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: farm.contractAddress ?? masterChefAddress,
      name: "userInfo",
      params: [farm.poolId, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls, chainId);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  const calls = farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .map((farm) => {
      return {
        address: farm.contractAddress ?? masterChefAddress,
        name: "pendingRewards",
        params: [farm.poolId, account],
      };
    });

  const rawEarnings = await multicall(masterchefABI, calls, chainId);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};

export const fetchFarmUserReflections = async (
  account: string,
  chainId: ChainId,
  farmsToFetch: SerializedFarmConfig[]
) => {
  const masterChefAddress = getMasterChefAddress(chainId);

  const calls = farmsToFetch
    .filter((f) => !f.enableEmergencyWithdraw)
    .map((farm) => {
      return {
        address: farm.contractAddress ?? masterChefAddress,
        name: "pendingReflections",
        params: [farm.poolId, account],
      };
    });

  const rawReflections = await multicall(masterchefABI, calls, chainId);
  const parsedReflections = rawReflections.map((reflections) => {
    return new BigNumber(reflections).toJSON();
  });
  return parsedReflections;
};
