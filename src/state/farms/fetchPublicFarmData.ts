import BigNumber from "bignumber.js";
import { ethers } from "ethers";

import erc20 from "config/abi/erc20.json";
import masterchefABI from "config/abi/masterchef.json";
import masterchefV2ABI from "config/abi/masterchefV2.json";
import { MULTICALL_FETCH_LIMIT } from "config/constants";
import { SerializedFarmConfig, Version } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import multicall from "utils/multicall";

import { SerializedBigNumber, SerializedFarm } from "./types";

type PublicFarmData = {
  poolWeight: SerializedBigNumber;
  rewardPerBlock: SerializedBigNumber;
  multiplier: string;
  depositFee: string;
  withdrawFee: string;
  performanceFee: string;
};

const fetchFarm = async (farm: SerializedFarm): Promise<PublicFarmData> => {
  const { poolId, chainId } = farm;

  // Only make masterchef calls if farm has poolId
  let info;
  if (farm.version) {
    [info] =
      farm.poolId || farm.poolId === 0
        ? await multicall(
            masterchefV2ABI,
            [
              {
                address: farm.contractAddress,
                name: "poolInfo",
                params: [poolId],
              },
            ],
            chainId
          )
        : [null];
  } else {
    [info] =
      farm.poolId || farm.poolId === 0
        ? await multicall(
            masterchefABI,
            [
              {
                address: farm.contractAddress,
                name: "poolInfo",
                params: [poolId],
              },
            ],
            chainId
          )
        : [null, null, null];
  }

  const [totalAllocPoint, rewardPerBlock] =
    farm.poolId || farm.poolId === 0
      ? await multicall(
          masterchefABI,
          [
            {
              address: farm.contractAddress,
              name: "totalAllocPoint",
            },
            {
              address: farm.contractAddress,
              name: "rewardPerBlock",
            },
          ],
          chainId
        )
      : [null];

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const depositFee = info ? new BigNumber(info.depositFee) : BIG_ZERO;
  const withdrawFee = info ? new BigNumber(info.withdrawFee) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  let performanceFee = BIG_ZERO;
  if (farm.isServiceFee) {
    const [feeInfo] = await multicall(
      masterchefABI,
      [
        {
          address: farm.contractAddress,
          name: "performanceFee",
        },
      ],
      chainId
    );
    performanceFee = new BigNumber(feeInfo);
  }

  return {
    poolWeight: poolWeight.toJSON(),
    rewardPerBlock: rewardPerBlock ? new BigNumber(rewardPerBlock).toJSON() : BIG_ZERO.toJSON(),
    multiplier: `${allocPoint.div(100).toString()}X`,
    depositFee: `${depositFee.dividedBy(100).toFixed(2)}`,
    withdrawFee: `${withdrawFee.dividedBy(100).toFixed(2)}`,
    performanceFee: performanceFee.toString(),
  };
};

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig);
      const serializedFarm = { ...farmConfig, ...farm };
      return serializedFarm;
    })
  );
  return data;
};

export const fetchTotalStakesForFarms = async (chainId, farmsToFetch: SerializedFarm[]) => {
  const filters = [];
  for (let i = 0; i < farmsToFetch.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = farmsToFetch.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const commonFarms = batch.filter((farm) => !farm.version || farm.version <= Version.V2);
        const compoundFarms = batch.filter((farm) => farm.version > Version.V2);

        const totalStakes = await multicall(
          erc20,
          commonFarms.map((farm) => ({
            address: farm.lpAddress,
            name: "balanceOf",
            params: [farm.contractAddress],
          })),
          chainId
        );

        if (totalStakes) {
          commonFarms.forEach((farm, index) => {
            data.push({ pid: farm.pid, totalStaked: ethers.utils.formatUnits(totalStakes[index][0], 18) });
          });
        }

        const v3TotalStakes = await multicall(
          masterchefV2ABI,
          compoundFarms.map((farm) => ({
            address: farm.contractAddress,
            name: "totalStaked",
            params: [farm.poolId],
          })),
          chainId
        );

        if (v3TotalStakes) {
          compoundFarms.forEach((farm, index) => {
            data.push({
              pid: farm.pid,
              totalStaked: ethers.utils.formatUnits(v3TotalStakes[index][0], 18),
            });
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export default fetchFarms;
