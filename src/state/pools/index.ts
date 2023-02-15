import { createSlice } from "@reduxjs/toolkit";
import { ChainId } from "@brewlabs/sdk";
import axios from "axios";

import { API_URL } from "config/constants";
import { BIG_ZERO } from "utils/bigNumber";
import { PoolsState } from "state/types";

import { fetchPoolsBlockLimits, fetchPoolsStakingLimits, fetchPoolsTotalStaking } from "./fetchPools";
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
  fetchUserPendingReflections,
  fetchPoolAllowance,
  fetchUserBalance,
  fetchUserStakeBalance,
  fetchUserPendingReward,
  fetchUserPendingReflection,
} from "./fetchPoolsUser";
import { AppThunk, SerializedPool } from "./types";

const initialState: PoolsState = {
  data: [],
  userDataLoaded: false,
};

// Thunks
export const fetchPoolsPublicDataAsync = (currentBlock: number, chainId: ChainId) => async (dispatch, getState) => {
  const pools = getState().pools.data;

  const blockLimits = await fetchPoolsBlockLimits(chainId, pools);
  const totalStakings = await fetchPoolsTotalStaking(chainId, pools);

  const liveData = pools
    .filter((p) => p.chainId === chainId)
    .map((pool) => {
      const blockLimit = blockLimits.find((entry) => entry.sousId === pool.sousId);
      const totalStaking = totalStakings.find((entry) => entry.sousId === pool.sousId);
      const isPoolEndBlockExceeded =
        currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false;
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded;

      return {
        ...blockLimit,
        ...totalStaking,
        isFinished: isPoolFinished,
      };
    });

  dispatch(setPoolsPublicData(liveData));
};

export const fetchPoolsPublicDataFromApiAsync = () => async (dispatch) => {
  axios.post(`${API_URL}/pools`).then((res) => {
    dispatch(setPoolsPublicData(res.data));
  });
};

export const fetchPoolsStakingLimitsAsync = (chainId: ChainId) => async (dispatch, getState) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter((p) => p.chainId === chainId)
    .filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined);

  const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit);

  const stakingLimitData = poolsWithStakingLimit.map((pool) => {
    const stakingLimit = stakingLimits[pool.sousId] || BIG_ZERO;
    return {
      sousId: pool.sousId,
      stakingLimit: stakingLimit.toJSON(),
    };
  });

  dispatch(setPoolsPublicData(stakingLimitData));
};

export const fetchPoolsUserDataAsync = (account: string, chainId: ChainId) => async (dispatch, getState) => {
  const pools = getState().pools.data;

  fetchPoolsAllowance(account, chainId, pools).then((allowances) => {
    dispatch(
      setPoolsUserData(
        pools.map((pool) => ({
          sousId: pool.sousId,
          allowance: allowances[pool.sousId],
        }))
      )
    );
  });

  fetchUserBalances(account, chainId, pools).then((stakingTokenBalances) => {
    dispatch(
      setPoolsUserData(
        pools.map((pool) => ({
          sousId: pool.sousId,
          stakingTokenBalance: stakingTokenBalances[pool.sousId],
        }))
      )
    );
  });

  fetchUserStakeBalances(account, chainId, pools).then(({ stakedBalances, lockedBalances }) => {
    dispatch(
      setPoolsUserData(
        pools.map((pool) => ({
          sousId: pool.sousId,
          stakedBalance: stakedBalances[pool.sousId],
          lockedBalance: lockedBalances[pool.sousId] ?? BIG_ZERO.toJSON(),
        }))
      )
    );
  });

  fetchUserPendingRewards(account, chainId, pools).then((pendingRewards) => {
    dispatch(
      setPoolsUserData(
        pools.map((pool) => ({
          sousId: pool.sousId,
          pendingReward: pendingRewards[pool.sousId],
        }))
      )
    );
  });

  fetchUserPendingReflections(account, chainId, pools).then((pendingReflections) => {
    dispatch(
      setPoolsUserData(
        pools.map((pool) => ({
          sousId: pool.sousId,
          pendingReflections: pendingReflections[pool.sousId] ?? [],
        }))
      )
    );
  });
};

export const updateUserAllowance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
  async (dispatch, getState) => {
    const pool = getState().pools.data.find((p) => p.sousId === sousId && p.chainId === chainId);
    if (!pool) return;

    const allowances = await fetchPoolAllowance(pool, account, chainId);
    dispatch(updatePoolsUserData({ sousId, field: "allowance", value: allowances }));
  };

export const updateUserBalance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
  async (dispatch, getState) => {
    const pool = getState().pools.data.find((p) => p.sousId === sousId && p.chainId === chainId);
    if (!pool) return;

    const tokenBalances = await fetchUserBalance(pool, account, chainId);
    dispatch(updatePoolsUserData({ sousId, field: "stakingTokenBalance", value: tokenBalances }));
  };

export const updateUserStakedBalance =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
  async (dispatch, getState) => {
    const pool = getState().pools.data.find((p) => p.sousId === sousId && p.chainId === chainId);
    if (!pool) return;

    const { stakedBalance, lockedBalance } = await fetchUserStakeBalance(pool, account, chainId);
    dispatch(updatePoolsUserData({ sousId, field: "stakedBalance", value: stakedBalance }));
    dispatch(updatePoolsUserData({ sousId, field: "lockedBalance", value: lockedBalance ?? BIG_ZERO }));
  };

export const updateUserPendingReward =
  (sousId: number, account: string, chainId: ChainId): AppThunk =>
  async (dispatch, getState) => {
    const pool = getState().pools.data.find((p) => p.sousId === sousId && p.chainId === chainId);
    if (!pool) return;

    const pendingRewards = await fetchUserPendingReward(pool, account, chainId);
    dispatch(updatePoolsUserData({ sousId, field: "pendingReward", value: pendingRewards }));

    const pendingReflections = await fetchUserPendingReflection(pool, account, chainId);
    dispatch(updatePoolsUserData({ sousId, field: "pendingReflections", value: pendingReflections ?? [] }));
  };

export const PoolsSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload;
      livePoolsData.map((pool) => {
        const index = state.data.findIndex((p) => p.sousId === pool.sousId);
        if (index >= 0) {
          state.data[index] = { ...state.data[index], ...pool };
        } else if (pool.contractAddress) {
          state.data.push(pool);
        }
        return pool;
      });
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload;
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId);
        return { ...pool, userData: { ...pool.userData, ...userPoolData } };
      });
      state.userDataLoaded = true;
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload;
      const index = state.data.findIndex((p) => p.sousId === sousId);

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
    resetPendingReflection: (state, action) => {
      const sousId = action.payload;
      const index = state.data.findIndex((p) => p.sousId === sousId);

      if (index >= 0) {
        state.data[index].userData.pendingReflections = state.data[index].userData.pendingReflections.map(() =>
          BIG_ZERO.toJSON()
        );
      }
    },
  },
  extraReducers: {},
});

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData, resetPendingReflection } = PoolsSlice.actions;

export default PoolsSlice.reducer;
