import { ChainId } from "@brewlabs/sdk";

import PoolFactoryAbi from "config/abi/staking/brewlabsPoolFactory.json";
import { tokens } from "config/constants/tokens";
import { serializeToken } from "state/user/hooks/helpers";
import { getPoolFactoryAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchPoolFactoryData = async (chainId: ChainId) => {
  const calls = [
    {
      address: getPoolFactoryAddress(chainId),
      name: "payingToken",
    },
    {
      address: getPoolFactoryAddress(chainId),
      name: "serviceFee",
    },
  ];

  const result = await multicall(PoolFactoryAbi, calls, chainId);
  return {
    chainId,
    payingToken: serializeToken(Object.values(tokens[chainId]).find((t: any) => t.address === result[0][0])),
    serviceFee: result[1][0].toString(),
  };
};
