import { ChainId, Currency } from "@brewlabs/sdk";

import IndexFactoryAbi from "config/abi/indexes/factory.json";
import { tokens } from "config/constants/tokens";
import { serializeToken } from "state/user/hooks/helpers";
import { getIndexFactoryAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchIndexFactoryData = async (chainId: ChainId) => {
  const calls = [
    {
      address: getIndexFactoryAddress(chainId),
      name: "payingToken",
    },
    {
      address: getIndexFactoryAddress(chainId),
      name: "serviceFee",
    },
    {
      address: getIndexFactoryAddress(chainId),
      name: "feeLimit",
    },
  ];

  const result = await multicall(IndexFactoryAbi, calls, chainId);
  return {
    chainId,
    payingToken: serializeToken(Object.values(tokens[chainId]).find((t: any) => t.address === result[0][0])),
    serviceFee: result[1][0].toString(),
    feeLimit: result[2][0].toNumber(),
  };
};
