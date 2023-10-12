import { ChainId } from "@brewlabs/sdk";
import { chunk } from "lodash";

import masterchefABI from "config/abi/pancakeMasterchef";
import { getPancakeMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers";
import { getPancakeMasterChefContract as getMasterchefContract } from "utils/contractHelpers";
import { getViemClients } from "utils/viem";

const masterChefAddress = getMasterChefAddress();
const masterChefContract = getMasterchefContract();

export const fetchMasterChefFarmPoolLength = async () => {
  const poolLength = await masterChefContract.poolLength();
  return poolLength;
};

const masterChefFarmCalls = (farm) => {
  const { pid } = farm;
  return pid || pid === 0
    ? [
        {
          address: masterChefAddress,
          abi: masterchefABI,
          functionName: "poolInfo",
          args: [pid],
        },
        {
          address: masterChefAddress,
          abi: masterchefABI,
          functionName: "totalRegularAllocPoint",
        },
      ]
    : [null, null];
};

export const fetchMasterChefData = async (farms) => {
  const client = getViemClients({ chainId: ChainId.BSC_MAINNET });

  const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm));
  const chunkSize = masterChefCalls.flat().length / farms.length;
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat();
  const masterChefMultiCallResult = await client.multicall({ contracts: masterChefAggregatedCalls });
  const masterChefChunkedResultRaw: any = chunk(masterChefMultiCallResult, chunkSize);
  let masterChefChunkedResultCounter = 0;
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null];
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter].result;
    masterChefChunkedResultCounter++;
    return data;
  });
};
