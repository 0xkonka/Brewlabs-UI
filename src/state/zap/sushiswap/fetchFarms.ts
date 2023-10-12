import BigNumber from "bignumber.js";

import masterchefABI from "config/abi/externalMasterchef";
import { AppId, Chef } from "config/constants/types";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

const fetchFarms = async (chainId: number, farmsConfig) => {
  const client = getViemClients({ chainId });

  const masterChefAddress = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF);
  const masterChefV2Address = getExternalMasterChefAddress(AppId.SUSHISWAP, Chef.MASTERCHEF_V2);

  const masterChefCalls = farmsConfig.map((farm) => ({
    address: farm.chef === Chef.MASTERCHEF ? masterChefAddress : masterChefV2Address,
    abi: masterchefABI,
    functionName: "poolInfo",
    args: [farm.id],
  }));
  const masterChefMultiCallResult = await client.multicall({ contracts: masterChefCalls });
  return farmsConfig.map((farm, index) => {
    const info: any = masterChefMultiCallResult[index].result;
    const totalRewards = info ? new BigNumber(info[2].toString()) : new BigNumber(0);
    const totalSupply = info ? new BigNumber(info[3].toString()) : new BigNumber(0);
    return {
      ...farm,
      totalSupply: totalSupply.toJSON(),
      totalRewards: totalRewards.toJSON(),
    };
  });
};

export default fetchFarms;
