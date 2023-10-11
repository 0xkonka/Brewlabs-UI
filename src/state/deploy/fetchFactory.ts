import { ChainId } from "@brewlabs/sdk";

import FarmFactoryAbi from "config/abi/farm/factory";
import { tokens } from "config/constants/tokens";
import { serializeToken } from "state/user/hooks/helpers";
import { getFarmFactoryAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchFarmFactoryData = async (chainId: ChainId) => {
  const publicClient = getViemClients({ chainId });

  const factoryContract = { address: getFarmFactoryAddress(chainId) as `0x${string}`, abi: FarmFactoryAbi };
  const calls = [
    { ...factoryContract, functionName: "payingToken" },
    { ...factoryContract, functionName: "serviceFee" },
  ];

  const result = await publicClient.multicall({ contracts: calls });
  return {
    chainId,
    payingToken: serializeToken(Object.values(tokens[chainId]).find((t: any) => t.address === result[0].result)),
    serviceFee: result[1].result.toString(),
  };
};
