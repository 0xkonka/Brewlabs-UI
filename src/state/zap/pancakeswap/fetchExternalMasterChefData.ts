import { ChainId } from "@brewlabs/sdk";

import masterChefABI from "config/abi/externalMasterchef";
import { AppId } from "config/constants/types";
import { getExternalMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

const masterChefAddress = getExternalMasterChefAddress(AppId.PANCAKESWAP);

const masterChefFarmCalls = (farm) => {
  const { pid } = farm;
  return pid || pid === 0
    ? {
        address: masterChefAddress,
        abi: masterChefABI,
        functionName: "poolInfo",
        args: [pid],
      }
    : null;
};

export const fetchExternalMasterChefData = async (farms) => {
  const client = getViemClients({ chainId: ChainId.BSC_MAINNET });

  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm));
  const masterChefAggregatedCalls = masterChefCalls.filter((masterChefCall) => masterChefCall !== null);
  const masterChefMultiCallResult = await client.multicall({ contracts: masterChefAggregatedCalls });
  let masterChefChunkedResultCounter = 0;
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall === null) {
      return null;
    }
    const data = masterChefMultiCallResult[masterChefChunkedResultCounter].result;
    masterChefChunkedResultCounter++;
    return data;
  });
};
