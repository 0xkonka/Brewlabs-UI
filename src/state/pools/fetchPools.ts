import axios from "axios";
import { ChainId } from "@brewlabs/sdk";
import { formatUnits } from "viem";

import singleStakingABI from "config/abi/staking/singlestaking";
import lockupStakingABI from "config/abi/staking/brewlabsLockup";
import lockupV2StakingABI from "config/abi/staking/brewlabsLockupV2";
import lockupMultiStakingABI from "config/abi/staking/brewlabsStakingMulti";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import { PoolCategory } from "config/constants/types";
import { getAddress } from "utils/addressHelpers";
import { sumOfArray } from "utils/functions";
import { getViemClients } from "utils/viem";

export const fetchPoolsBlockLimits = async (chainId, pools) => {
  const publicClient = getViemClients({ chainId });
  const poolsWithEnd = pools.filter((p) => p.sousId !== 0 && p.chainId === chainId);

  const filters = [];
  for (let i = 0; i < poolsWithEnd.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = poolsWithEnd.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const callsStartBlock = batch.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "startBlock",
          };
        });
        const callsEndBlock = batch.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "bonusEndBlock",
          };
        });

        const starts = await publicClient.multicall({ contracts: callsStartBlock });
        const ends = await publicClient.multicall({ contracts: callsEndBlock });

        batch.forEach((pool, index) => {
          data.push({
            sousId: pool.sousId,
            startBlock: +starts[index].result.toString(),
            endBlock: pool.forceEndblock ? pool.forceEndblock : +ends[index].result.toString(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchRewardPerBlocks = async (chainId, pools) => {
  const publicClient = getViemClients({ chainId });
  const selectedPools = pools.filter((p) => p.sousId !== 0 && p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => p.poolCategory.indexOf("Lockup") === -1);
        const lockupPools = batch.filter((p) => p.poolCategory === PoolCategory.LOCKUP);
        const lockupV2Pools = batch.filter(
          (p) => p.poolCategory === PoolCategory.LOCKUP_V2 || p.poolCategory === PoolCategory.MULTI_LOCKUP
        );

        const callsNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "rewardPerBlock",
          };
        });

        const callsLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: lockupStakingABI,
            functionName: "rewardPerBlock",
            args: [poolConfig.lockup],
          };
        });

        const callsLockupV2Pools = lockupV2Pools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: lockupV2StakingABI,
            functionName: "rewardPerBlock",
          };
        });

        const nonLockupPoolsRewards = await publicClient.multicall({ contracts: callsNonLockupPools });
        const lockupPoolsRewards = await publicClient.multicall({ contracts: callsLockupPools });
        const lockupV2PoolsRewards = await publicClient.multicall({ contracts: callsLockupV2Pools });

        const callsForDepositFeesNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "depositFee",
          };
        });
        const callsForWithdrawFeesNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "withdrawFee",
          };
        });
        const callsFeesLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: lockupStakingABI,
            functionName: "lockups",
            args: [poolConfig.lockup],
          };
        });

        const callsFeesLockupV2Pools = lockupV2Pools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: lockupV2StakingABI,
            functionName: "lockupInfo",
          };
        });

        const nonLockupPoolsDFee: any = await publicClient.multicall({ contracts: callsForDepositFeesNonLockupPools });
        const nonLockupPoolsWFee: any = await publicClient.multicall({ contracts: callsForWithdrawFeesNonLockupPools });
        const lockupPoolsFees: any = await publicClient.multicall({ contracts: callsFeesLockupPools });
        const lockupV2PoolsFees: any = await publicClient.multicall({ contracts: callsFeesLockupV2Pools });

        nonLockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: nonLockupPoolsRewards[index].result.toString(),
            depositFee: +(nonLockupPoolsDFee[index].result / BigInt(100)).toString(),
            withdrawFee: +(nonLockupPoolsWFee[index].result / BigInt(100)).toString(),
            duration: 0,
          });
        });
        lockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: lockupPoolsRewards[index].result.toString(),
            depositFee: +(lockupPoolsFees[index].result.depositFee / BigInt(100)).toString(),
            withdrawFee: +(lockupPoolsFees[index].result.withdrawFee / BigInt(100)).toString(),
            duration: +lockupPoolsFees[index].result.duration.toString(),
          });
        });
        lockupV2Pools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            tokenPerBlock: lockupV2PoolsRewards[index].result.toString(),
            depositFee: +(lockupV2PoolsFees[index].depositFee / BigInt(100)).toString(),
            withdrawFee: +(lockupV2PoolsFees[index].withdrawFee / BigInt(100)).toString(),
            duration: +lockupV2PoolsFees[index].duration.toString(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolsTotalStaking = async (chainId, pools) => {
  const publicClient = getViemClients({ chainId });

  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory !== PoolCategory.LOCKUP);
        const lockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory === PoolCategory.LOCKUP);

        const callsNonLockupPools = nonLockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: singleStakingABI,
            functionName: "totalStaked",
          };
        });

        const callsLockupPools = lockupPools.map((poolConfig) => {
          return {
            address: poolConfig.contractAddress,
            abi: lockupStakingABI,
            functionName: "lockups",
            args: [poolConfig.lockup],
          };
        });

        const nonLockupPoolsTotalStaked: any = await publicClient.multicall({ contracts: callsNonLockupPools });
        const lockupPoolsTotalStaked: any = await publicClient.multicall({ contracts: callsLockupPools });

        nonLockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            totalStaked: nonLockupPoolsTotalStaked[index].result.toString(),
          });
        });

        lockupPools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            totalStaked: lockupPoolsTotalStaked[index].result.toString(),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPerformanceFees = async (chainId, pools) => {
  const publicClient = getViemClients({ chainId });
  const selectedPools = pools.filter((p) => p.isServiceFee && p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const callsPools = batch.map((pool) => {
          return {
            address: pool.contractAddress,
            abi: singleStakingABI,
            functionName: "performanceFee",
          };
        });

        const performanceFees = await publicClient.multicall({ contracts: callsPools });

        pools.forEach((p, index) => {
          data.push({
            sousId: p.sousId,
            performanceFee: performanceFees[index].result.toString(),
            duration: 0,
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolStakingLimit = async (chainId: ChainId, address: string): Promise<string> => {
  try {
    const publicClient = getViemClients({ chainId });

    const stakingLimit = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: singleStakingABI,
      functionName: "poolLimitPerUser",
    });
    return stakingLimit.toString();
  } catch (error) {
    return "0";
  }
};

export const fetchPoolsStakingLimits = async (pools: any[]): Promise<{ [key: string]: string }> => {
  const validPools = pools.filter((p) => !p.stakingToken.isNative && !p.isFinished);

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) =>
    fetchPoolStakingLimit(validPool.chainId, getAddress(validPool.contractAddress, validPool.chainId))
  );
  const stakingLimits = await Promise.all(stakingLimitPromises);

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    };
  }, {});
};

export const fetchPoolTotalRewards = async (pool) => {
  const publicClient = getViemClients({ chainId: pool.chainId });

  let calls: any = [
    {
      address: pool.contractAddress,
      abi: lockupStakingABI,
      functionName: "availableRewardTokens",
      args: [],
    },
  ];

  if (pool.poolCategory === PoolCategory.MULTI_LOCKUP) {
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      calls.push({
        address: pool.contractAddress,
        abi: lockupMultiStakingABI,
        functionName: "availableDividendTokens",
        args: [BigInt(i)],
      });
    }
  } else {
    if (
      (pool.poolCategory === PoolCategory.CORE && pool.sousId <= 20) ||
      (pool.poolCategory === PoolCategory.LOCKUP && pool.sousId <= 48) ||
      (pool.poolCategory === PoolCategory.LOCKUP_V2 && pool.sousId <= 65)
    ) {
      calls.push({
        address: pool.contractAddress,
        abi: singleStakingABI,
        functionName: "availabledividendTokens",
      });
    } else {
      calls.push({
        address: pool.contractAddress,
        abi: lockupStakingABI,
        functionName: "availableDividendTokens",
      });
    }
  }

  const res: any = await publicClient.multicall({ contracts: calls });
  let availableReflections = [];
  if (pool.reflection) {
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      availableReflections.push(formatUnits(res[i + 1].result, pool.reflectionTokens[i].decimals));
    }
  }

  return { availableRewards: formatUnits(res[0].result, pool.earningToken.decimals), availableReflections };
};

export const fetchPoolDepositBalance = async (pool) => {
  const url = `${EXPLORER_API_URLS[pool.chainId]}?module=account&action=tokentx&contractaddress=${
    pool.earningToken.address
  }&address=${pool.contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${EXPLORER_API_KEYS[pool.chainId]}`;

  let sHistoryResult: any = await axios.get(url);
  sHistoryResult = sHistoryResult.data.result;

  let depositBalance = 0;

  if (
    sHistoryResult &&
    sHistoryResult !== "Max rate limit reached" &&
    sHistoryResult !== "Error! Invalid contract address format"
  ) {
    sHistoryResult.map((history: any) => {
      if (history.to.toLowerCase() === pool.contractAddress.toLowerCase()) {
        depositBalance += history.value / Math.pow(10, pool.earningToken.decimals);
      }
    });
  }
  return depositBalance;
};

export const fetchPoolFeeHistories = async (pool) => {
  let res;
  try {
    res = await axios.post(`${API_URL}/fee/single`, { type: "pool", id: pool.sousId });
  } catch (e) {}
  if (!res.data) {
    return { performanceFees: [], tokenFees: [], stakedAddresses: [] };
  }
  const { performanceFees, tokenFees, stakedAddresses } = res.data;

  let _performanceFees = [],
    _tokenFees = [],
    _stakedAddresses = [];
  const timeBefore24Hrs = Math.floor(new Date().setHours(new Date().getHours() - 24) / 1000);
  const curTime = Math.floor(new Date().getTime() / 1000);

  for (let t = timeBefore24Hrs; t <= curTime; t += 3600) {
    _performanceFees.push(sumOfArray(performanceFees.filter((v) => v.timestamp <= t).map((v) => v.value)));
    _tokenFees.push(sumOfArray(tokenFees.filter((v) => v.timestamp <= t).map((v) => +v.value)));
    _stakedAddresses.push(sumOfArray(stakedAddresses.filter((v) => v.timestamp <= t).map((v) => v.value)));
  }

  return { performanceFees: _performanceFees, tokenFees: _tokenFees, stakedAddresses: _stakedAddresses };
};
