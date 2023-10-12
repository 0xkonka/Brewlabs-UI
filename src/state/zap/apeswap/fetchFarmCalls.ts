import { erc20ABI } from "wagmi";

import masterchefABI from "config/abi/masterape";
import externalMasterChefAbi from "config/abi/externalMasterchef";
import { AppId } from "config/constants/types";
import { FarmConfig } from "state/types";
import { getExternalMasterChefAddress, getMasterApeAddress } from "utils/addressHelpers";

const fetchFarmCalls = (farm: FarmConfig, chainId: number) => {
  const masterChefAddress = getMasterApeAddress(chainId);
  const lpAddress = farm.lpAddresses[chainId];
  const calls = [
    {
      abi: erc20ABI,
      address: farm.tokenAddresses[chainId],
      functionName: "balanceOf",
      args: [lpAddress],
    },
    {
      abi: erc20ABI,
      address: farm.quoteTokenAdresses[chainId],
      functionName: "balanceOf",
      args: [lpAddress],
    },
    {
      abi: erc20ABI,
      address: lpAddress,
      functionName: "balanceOf",
      args: [masterChefAddress],
    },
    {
      abi: erc20ABI,
      address: lpAddress,
      functionName: "totalSupply",
    },
    {
      abi: erc20ABI,
      address: farm.tokenAddresses[chainId],
      functionName: "decimals",
    },
    {
      abi: erc20ABI,
      address: farm.quoteTokenAdresses[chainId],
      functionName: "decimals",
    },
    {
      abi: masterchefABI,
      address: masterChefAddress,
      functionName: "poolInfo",
      args: [farm.pid],
    },
    {
      abi: masterchefABI,
      address: masterChefAddress,
      functionName: "totalAllocPoint",
    },
  ];
  return calls;
};

export const fetchExternalCall = (farm: FarmConfig) => {
  const masterChefAddress = getExternalMasterChefAddress(AppId.APESWAP);
  const call = {
    abi: externalMasterChefAbi,
    address: masterChefAddress,
    functionName: "poolInfo",
    args: [farm.pid],
  };
  return call;
};

export default fetchFarmCalls;
