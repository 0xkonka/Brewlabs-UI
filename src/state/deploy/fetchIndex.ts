import { ChainId } from "@brewlabs/sdk";

import IndexFactoryAbi from "config/abi/indexes/factory";
import { tokens } from "config/constants/tokens";
import { serializeToken } from "state/user/hooks/helpers";
import { getIndexFactoryAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchIndexFactoryData = async (chainId: ChainId) => {
  const publicClient = getViemClients({ chainId });
  const factoryContract = { address: getIndexFactoryAddress(chainId) as `0x${string}`, abi: IndexFactoryAbi };
  const calls = [
    { ...factoryContract, functionName: "payingToken" },
    { ...factoryContract, functionName: "serviceFee" },
    { ...factoryContract, functionName: "feeLimits", args: [BigInt(0)] },
    { ...factoryContract, functionName: "feeLimits", args: [BigInt(1)] },
    { ...factoryContract, functionName: "brewlabsFee" },
  ];

  const result = await publicClient.multicall({ contracts: calls });
  return {
    chainId,
    payingToken: serializeToken(Object.values(tokens[chainId]).find((t: any) => t.address === result[0].result)),
    serviceFee: result[1].result.toString(),
    depositFeeLimit: +result[2].result.toString() / 100,
    commissionFeeLimit: +result[3].result.toString() / 100,
    brewsFee: +result[4].result.toString() / 100,
  };
};
