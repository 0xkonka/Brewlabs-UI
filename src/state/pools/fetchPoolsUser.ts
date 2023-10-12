import axios from "axios";
import { erc20ABI } from "wagmi";

import lockupStakingABI from "config/abi/staking/brewlabsLockup";
import lockupStakingV2ABI from "config/abi/staking/brewlabsLockupV2";
import brewlabsStakingMultiABI from "config/abi/staking/brewlabsStakingMulti";
import singleStakingABI from "config/abi/staking/singlestaking";

import { API_URL, MULTICALL_FETCH_LIMIT } from "config/constants";
import { PoolCategory } from "config/constants/types";
import { getViemClients } from "utils/viem";

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
export const fetchPoolsAllowance = async (account, chainId, pools) => {
  const client = getViemClients({ chainId });

  const nonBnbPools = pools.filter((pool) => !pool.stakingToken.isNative && pool.chainId === chainId);
  const filters = [];
  for (let i = 0; i < nonBnbPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = nonBnbPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const calls = batch.map((pool) => ({
          address: pool.stakingToken.address,
          abi: erc20ABI,
          functionName: "allowance",
          args: [account, pool.contractAddress],
        }));

        const allowances = await client.multicall({ contracts: calls });
        nonBnbPools.forEach((pool, index) => {
          data[pool.sousId] = allowances[index].result.toString();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserBalances = async (account, chainId, pools) => {
  const client = getViemClients({ chainId });
  // Non BNB pools
  const nonBnbPools = pools.filter((pool) => !pool.stakingToken.isNative && pool.chainId === chainId);
  const filters = [];
  for (let i = 0; i < nonBnbPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = nonBnbPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const calls = batch.map((pool) => ({
          address: pool.stakingToken.address,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [account],
        }));
        const tokenBalancesRaw = await client.multicall({ contracts: calls });

        nonBnbPools.forEach((pool, index) => {
          data[pool.sousId] = tokenBalancesRaw[index].result.toString();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  // BNB pools
  const bnbBalance = await client.getBalance({ address: account });
  const bnbPools = pools.filter((pool) => pool.stakingToken.isNative);
  const bnbBalances = bnbPools
    .filter((p) => p.chainId === chainId)
    .reduce((acc, pool) => ({ ...acc, [pool.sousId]: bnbBalance.toString() }), {});

  return { ...data, ...bnbBalances };
};

export const fetchUserStakeBalances = async (account, chainId, pools) => {
  const client = getViemClients({ chainId });

  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = { stakedBalances: {}, lockedBalances: {} };
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory.indexOf("Lockup") === -1);
        const calls = nonLockupPools.map((p) => ({
          address: p.contractAddress,
          abi: singleStakingABI,
          functionName: "userInfo",
          args: [account],
        }));

        const lockupPools = batch.filter((p) => !p.stakingToken.isNative && p.poolCategory === PoolCategory.LOCKUP);
        const lockupCalls = lockupPools.map((p) => ({
          address: p.contractAddress,
          abi: lockupStakingABI,
          functionName: "userInfo",
          args: [p.lockup, account],
        }));

        const lockupV2Pools = batch.filter(
          (p) =>
            !p.stakingToken.isNative && p.poolCategory !== PoolCategory.LOCKUP && p.poolCategory.indexOf("Lockup") > -1
        );
        const lockupV2Calls = lockupV2Pools.map((p) => ({
          address: p.contractAddress,
          abi: lockupStakingV2ABI,
          functionName: "userInfo",
          args: [account],
        }));

        const nonLockupPoolsUserInfo: any = await client.multicall({ contracts: calls });
        const lockupPoolsUserInfo: any = await client.multicall({ contracts: lockupCalls });
        const lockupV2PoolsUserInfo: any = await client.multicall({ contracts: lockupV2Calls });

        nonLockupPools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = nonLockupPoolsUserInfo[index].result.amount.toString();
          data.lockedBalances[pool.sousId] = nonLockupPoolsUserInfo[index].result.locked
            ? nonLockupPoolsUserInfo[index].result.locked.toString()
            : "0";
        });
        lockupPools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = lockupPoolsUserInfo[index].result.amount.toString();
          data.lockedBalances[pool.sousId] = lockupPoolsUserInfo[index].result.locked.toString();
        });
        lockupV2Pools.forEach((pool, index) => {
          data.stakedBalances[pool.sousId] = lockupV2PoolsUserInfo[index].result.amount.toString();
          data.lockedBalances[pool.sousId] = lockupV2PoolsUserInfo[index].result.locked.toString();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserPendingRewards = async (account, chainId, pools) => {
  const client = getViemClients({ chainId });

  const selectedPools = pools.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupPools = batch.filter(
          (p) => !p.stakingToken.isNative && p.chainId === chainId && p.poolCategory !== PoolCategory.LOCKUP
        );
        const calls = nonLockupPools
          .filter((p) => p.chainId === chainId)
          .map((p) => ({
            address: p.contractAddress,
            abi: singleStakingABI,
            functionName: "pendingReward",
            args: [account],
          }));

        const lockupPools = batch.filter(
          (p) => !p.stakingToken.isNative && p.chainId === chainId && p.poolCategory === PoolCategory.LOCKUP
        );
        const lockupCalls = lockupPools
          .filter((p) => p.chainId === chainId)
          .map((p) => ({
            address: p.contractAddress,
            abi: lockupStakingABI,
            functionName: "pendingReward",
            args: [account, BigInt(p.lockup)],
          }));

        const nonLockupsRes = await client.multicall({ contracts: calls });
        const lockupsRes = await client.multicall({ contracts: lockupCalls });

        nonLockupPools.forEach((pool, index) => {
          data[pool.sousId] = nonLockupsRes[index].result.toString();
        });
        lockupPools.forEach((pool, index) => {
          data[pool.sousId] = lockupsRes[index].result.toString();
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchUserPendingReflections = async (account, chainId, pools) => {
  const client = getViemClients({ chainId });

  const selectedPools = pools.filter(
    (p) => p.sousId > 1 && (p.sousId < 10 || p.sousId > 12) && p.reflection && p.chainId === chainId
  );
  const filters = [];
  for (let i = 0; i < selectedPools.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedPools.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = {};
  await Promise.all(
    filters.map(async (batch) => {
      try {
        const nonLockupReflectionPools = batch.filter((p) => p.poolCategory.indexOf("Lockup") === -1);
        const lockupReflectionPools = batch.filter(
          (p) => p.poolCategory === PoolCategory.LOCKUP && ![13, 14, 33, 34].includes(p.sousId)
        );
        const multiReflectionPools = batch.filter(
          (p) => p.poolCategory === PoolCategory.MULTI || p.poolCategory === PoolCategory.MULTI_LOCKUP
        );

        const calls = nonLockupReflectionPools.map((p) => ({
          address: p.contractAddress,
          abi: singleStakingABI,
          functionName: "pendingDividends",
          args: [account],
        }));
        const lockupCalls = lockupReflectionPools.map((p) => ({
          address: p.contractAddress,
          abi: lockupStakingABI,
          functionName: "pendingDividends",
          args: [account, BigInt(p.lockup)],
        }));

        const nonLockupRes = await client.multicall({ contracts: calls });
        const lockupRes = await client.multicall({ contracts: lockupCalls });

        nonLockupReflectionPools.forEach((pool, index) => {
          data[pool.sousId] = [nonLockupRes[index].result.toString()];
        });
        lockupReflectionPools.forEach((pool, index) => {
          data[pool.sousId] = [lockupRes[index].result.toString()];
        });

        await Promise.all(
          multiReflectionPools.map(async (p) => {
            try {
              const multiRes = await client.readContract({
                address: p.contractAddress,
                abi: brewlabsStakingMultiABI,
                functionName: "pendingDividends",
                args: [account],
              });
              const pendings = [];
              for (let i = 0; i < p.reflectionTokens.length; i++) {
                pendings.push(multiRes[i].toString());
              }
              data[p.sousId] = pendings;
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log("no staked");
            }
          })
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );

  return data;
};

export const fetchPoolAllowance = async (pool, account, chainId) => {
  const client = getViemClients({ chainId });

  const allowance = await client.readContract({
    address: pool.stakingToken.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [account, pool.contractAddress],
  });
  return allowance.toString();
};

export const fetchUserBalance = async (pool, account, chainId) => {
  const client = getViemClients({ chainId });

  if (pool.stakingToken.isNative) {
    const bnbBalance = await client.getBalance({ address: account });
    return bnbBalance;
  }

  const tokenBalance = await client.readContract({
    address: pool.stakingToken.address,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [account],
  });
  return tokenBalance.toString();
};

export const fetchUserStakeBalance = async (pool, account, chainId) => {
  const client = getViemClients({ chainId });

  const txData: any = {
    address: pool.contractAddress,
    abi:
      pool.poolCategory === PoolCategory.LOCKUP
        ? lockupStakingABI
        : pool.poolCategory.indexOf("Lockup") > -1
        ? lockupStakingV2ABI
        : singleStakingABI,
    functionName: "userInfo",
    args: pool.poolCategory === PoolCategory.LOCKUP ? [BigInt(pool.lockup), account] : [account],
  };
  const userInfo: any = await client.readContract(txData);

  return {
    stakedBalance: userInfo.result.amount.toString(),
    lockedBalance: userInfo.result.locked ? userInfo.result.locked.toString() : "0",
  };
};

export const fetchUserPendingReward = async (pool, account, chainId) => {
  const client = getViemClients({ chainId });

  const txData: any = [
    {
      address: pool.contractAddress,
      abi: pool.poolCategory === PoolCategory.LOCKUP ? lockupStakingABI : singleStakingABI,
      functionName: "pendingReward",
      args: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
    },
  ];
  const rewards = await client.readContract(txData);
  return rewards.toString();
};

export const fetchUserPendingReflection = async (pool, account, chainId) => {
  const client = getViemClients({ chainId });

  if (pool.poolCategory === PoolCategory.LOCKUP) {
    const txData: any = {
      address: pool.contractAddress,
      abi: lockupStakingABI,
      functionName: "pendingDividends",
      args: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
    };
    const lockupRes = await client.readContract(txData);
    return [lockupRes.toString()];
  }

  if (pool.poolCategory === PoolCategory.MULTI || pool.poolCategory === PoolCategory.MULTI_LOCKUP) {
    const txData: any = {
      address: pool.contractAddress,
      abi: brewlabsStakingMultiABI,
      functionName: "pendingDividends",
      args: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
    };
    const multiRes = await client.readContract(txData);
    const pendings = [];
    for (let i = 0; i < pool.reflectionTokens.length; i++) {
      pendings.push(multiRes[i].toString());
    }

    return pendings;
  }

  const txData: any = {
    address: pool.contractAddress,
    abi: singleStakingABI,
    functionName: "pendingDividends",
    args: pool.poolCategory === PoolCategory.LOCKUP ? [account, pool.lockup] : [account],
  };
  const nonLockupRes = await client.readContract(txData);
  return [nonLockupRes.toString()];
};

export const fetchUserDepositData = async (pool, account) => {
  const res = await axios.post(`${API_URL}/deposit/${account}/single`, { type: "pool", id: pool.sousId });

  const ret = res?.data ?? [];

  let record = { sousId: pool.sousId, deposits: [] };
  record.deposits = ret.filter((d) => d.sousId === pool.sousId);

  return record;
};
