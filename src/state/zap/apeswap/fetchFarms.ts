import BigNumber from "bignumber.js";
import { chunk } from "lodash";
import { Farm, FarmLpAprsType, LpTokenPrices } from "state/types";
import { getViemClients } from "utils/viem";

import fetchFarmCalls, { fetchExternalCall } from "./fetchFarmCalls";
import cleanFarmData from "./cleanFarmData";

const fetchFarms = async (
  chainId: number,
  lpPrices: LpTokenPrices[],
  bananaPrice: BigNumber,
  farmsLpAprs: FarmLpAprsType,
  farmsConfig: Farm[]
) => {
  const client = getViemClients({ chainId });

  const farmIds = [];
  const farmCalls: any = farmsConfig.flatMap((farm) => {
    farmIds.push(farm.pid);
    return fetchFarmCalls(farm, chainId);
  });
  const externalCalls: any = farmsConfig.flatMap((farm) => fetchExternalCall(farm));
  const vals = await client.multicall({ contracts: farmCalls, allowFailure: false });
  const externalVals = await client.multicall({ contracts: externalCalls });
  const chunkSize = farmCalls.length / farmsConfig.length;
  const chunkedFarms = chunk(vals, chunkSize);
  return cleanFarmData(farmIds, chunkedFarms, externalVals, lpPrices, bananaPrice, farmsLpAprs, farmsConfig);
};

export default fetchFarms;
