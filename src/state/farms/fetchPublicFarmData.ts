import axios from "axios";
import { formatUnits } from "viem";
import { erc20ABI } from "wagmi";

import masterchefABI from "config/abi/farm/masterchef";
import masterchefV2ABI from "config/abi/farm/masterchefV2";
import farmImplAbi from "config/abi/farm/farmImpl";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { SerializedFarmConfig, Version } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import { sumOfArray } from "utils/functions";
import { getViemClients } from "utils/viem";

import { SerializedBigNumber, SerializedFarm } from "./types";

type PublicFarmData = {
  poolWeight: SerializedBigNumber;
  rewardPerBlock: SerializedBigNumber;
  multiplier: string;
  depositFee: string;
  withdrawFee: string;
  performanceFee: string;
  startBlock: number;
  endBlock?: number;
};

export const fetchFarm = async (farm: SerializedFarm): Promise<PublicFarmData> => {
  const { poolId, chainId } = farm;
  const publicClient = getViemClients({ chainId });

  // Only make masterchef calls if farm has poolId
  let info;
  if (farm.version) {
    info =
      farm.poolId || farm.poolId === 0
        ? await publicClient.readContract({
            address: farm.contractAddress as `0x${string}`,
            abi: masterchefV2ABI,
            functionName: "poolInfo",
            args: [BigInt(poolId)],
          })
        : null;
  } else {
    info =
      farm.poolId || farm.poolId === 0
        ? await publicClient.readContract({
            address: farm.contractAddress as `0x${string}`,
            abi: masterchefABI,
            functionName: "poolInfo",
            args: [BigInt(poolId)],
          })
        : null;
  }

  const [totalAllocPoint, rewardPerBlock, startBlock] =
    farm.poolId || farm.poolId === 0
      ? await publicClient.multicall({
          contracts: [
            {
              address: farm.contractAddress as `0x${string}`,
              abi: masterchefABI,
              functionName: "totalAllocPoint",
            },
            {
              address: farm.contractAddress as `0x${string}`,
              abi: masterchefABI,
              functionName: "rewardPerBlock",
            },
            {
              address: farm.contractAddress as `0x${string}`,
              abi: masterchefABI,
              functionName: "startBlock",
            },
          ],
        })
      : [null, null, null];
console.log(info)
  const allocPoint = info ? info.result.allocPoint : BIG_ZERO;
  const depositFee = info ? info.depositFee : BIG_ZERO;
  const withdrawFee = info ? info.withdrawFee : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint / totalAllocPoint.result : BIG_ZERO;

  let performanceFee = BIG_ZERO;
  if (farm.isServiceFee) {
    const feeInfo = await publicClient.readContract({
      address: farm.contractAddress as `0x${string}`,
      abi: masterchefABI,
      functionName: "performanceFee",
    });
    performanceFee = feeInfo;
  }

  return {
    poolWeight: poolWeight.toString(),
    rewardPerBlock: rewardPerBlock ? rewardPerBlock.result.toString() : "0",
    multiplier: `${(allocPoint / BigInt(100)).toString()}X`,
    depositFee: `${(+(depositFee / BigInt(100)).toString()).toFixed(2)}`,
    withdrawFee: `${(+(withdrawFee / BigInt(100)).toString()).toFixed(2)}`,
    performanceFee: performanceFee.toString(),
    startBlock: +(info.startBlock ? info.startBlock : startBlock).toString(),
    endBlock: info.bonusEndBlock ? +info.bonusEndBlock.toString() : undefined,
  };
};

export const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
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
  const publicClient = getViemClients({ chainId });

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

        const totalStakes: any = await publicClient.multicall({
          contracts: commonFarms.map((farm) => ({
            address: farm.lpAddress,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [farm.contractAddress],
          })),
        });

        if (totalStakes) {
          commonFarms.forEach((farm, index) => {
            data.push({ pid: farm.pid, totalStaked: totalStakes[index].result.toString() });
          });
        }

        const v3TotalStakes: any = await publicClient.multicall({
          contracts: compoundFarms
            .filter((f) => !f.category)
            .map((farm) => ({
              address: farm.contractAddress,
              abi: masterchefV2ABI,
              functionName: "totalStaked",
              args: farm.category ? [] : [BigInt(farm.poolId)],
            })),
        });

        if (v3TotalStakes) {
          compoundFarms
            .filter((f) => !f.category)
            .forEach((farm, index) => {
              data.push({
                pid: farm.pid,
                totalStaked: v3TotalStakes[index].result.toString(),
              });
            });
        }

        const v3ImplTotalStakes: any = await publicClient.multicall({
          contracts: compoundFarms
            .filter((f) => f.category)
            .map((farm) => ({
              address: farm.contractAddress,
              abi: farmImplAbi,
              functionName: "totalStaked",
              args: farm.category ? [] : [BigInt(farm.poolId)],
            })),
        });

        if (v3ImplTotalStakes) {
          compoundFarms
            .filter((f) => f.category)
            .forEach((farm, index) => {
              data.push({
                pid: farm.pid,
                totalStaked: v3ImplTotalStakes[index].result.toString(),
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

export const fetchFarmTotalRewards = async (farm) => {
  const publicClient = getViemClients({ chainId: farm.chainId });
  let availableRewards, availableReflections;
  if (farm.pid > 10) {
    let calls = [
      {
        address: farm.contractAddress,
        abi: masterchefV2ABI,
        functionName: "availableRewardTokens",
      },
      {
        address: farm.contractAddress,
        abi: masterchefV2ABI,
        functionName: "availableDividendTokens",
      },
    ];
    [availableRewards, availableReflections] = await publicClient.multicall({ contracts: calls });
  } else {
    let calls = [
      {
        address: farm.earningToken.address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [farm.contractAddress],
      },
      {
        address:
          !farm.reflectionToken || farm.reflectionToken?.isNative
            ? farm.earningToken.address
            : farm.reflectionToken.address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [farm.contractAddress],
      },
    ];
    [availableRewards, availableReflections] = await publicClient.multicall({ contracts: calls });

    if (farm.reflectionToken?.isNative) {
      availableReflections = { result: await publicClient.getBalance({address: farm.contractAddress}) };
    }
  }

  return {
    availableRewards: formatUnits(availableRewards.result, farm.earningToken.decimals),
    availableReflections: farm.reflectionToken
      ? formatUnits(availableReflections.result, farm.reflectionToken.decimals)
      : "0",
  };
};

export const fetchFarmFeeHistories = async (farm) => {
  let res;
  try {
    res = await axios.post(`${API_URL}/fee/single`, { type: "farm", id: farm.pid });
  } catch (e) {}
  if (!res.data) {
    return { performanceFees: [], stakedAddresses: [] };
  }
  const { performanceFees, stakedAddresses } = res.data;

  let _performanceFees = [],
    _stakedAddresses = [];
  const timeBefore24Hrs = Math.floor(new Date().setHours(new Date().getHours() - 24) / 1000);
  const curTime = Math.floor(new Date().getTime() / 1000);

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _performanceFees.push(sumOfArray(performanceFees.filter((v) => v.timestamp <= t).map((v) => v.value)));
    _stakedAddresses.push(sumOfArray(stakedAddresses.filter((v) => v.timestamp <= t).map((v) => v.value)));
  }

  return { performanceFees: _performanceFees, stakedAddresses: _stakedAddresses };
};
