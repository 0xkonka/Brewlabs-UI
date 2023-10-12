import { ChainId } from "@brewlabs/sdk";

import { AppId, Chef } from "config/constants/types";
import masterchefABI from "config/abi/externalMasterchef";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchSushiFarmUserStakedBalances = async (account: string, farms) => {
  const client = getViemClients({ chainId: ChainId.ETHEREUM });

  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);

  const calls = farms.map((farm) => {
    return {
      address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
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

export const fetchSushiFarmUserEarnings = async (account: string, farms) => {
  const client = getViemClients({ chainId: ChainId.ETHEREUM });

  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);

  const calls = farms.map((farm) => {
    return {
      address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
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
