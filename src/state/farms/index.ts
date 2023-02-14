import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

import { API_URL } from "config/constants";
import { resetUserState } from "state/global/actions";
import { SerializedFarmsState } from "state/types";

import {
  fetchFarmUserAllowances,
  fetchFarmUserEarnings,
  fetchFarmUserReflections,
  fetchFarmUserStakedBalances,
  fetchFarmUserTokenBalances,
} from "./fetchFarmUser";
import { fetchTotalStakesForFarms } from "./fetchPublicFarmData";

const initialUserData = {
  allowance: "0",
  tokenBalance: "0",
  stakedBalance: "0",
  earnings: "0",
  reflections: "0",
  deposits: [],
};

const initialState: SerializedFarmsState = {
  data: [],
  userDataLoaded: false,
};

export const fetchFarmsPublicDataFromApiAsync = () => async (dispatch) => {
  axios.post(`${API_URL}/farms`).then((res) => {
    dispatch(setFarmsPublicData(res.data ?? []));
  });
};

export const fetchFarmsTotalStakesAsync = (chainId) => async (dispatch, getState) => {
  const farms = getState().farms.data.filter((farm) => farm.chainId === chainId);
  if (farms.length === 0) return;

  const data = await fetchTotalStakesForFarms(chainId, farms);
  dispatch(setFarmsPublicData(data));
};

export const fetchFarmUserDataAsync =
  ({ account, chainId, pids }) =>
  async (dispatch, getState) => {
    const farmsToFetch = getState().farms.data.filter((farmConfig) => pids.includes(farmConfig.pid));
    if (farmsToFetch.length === 0) return;

    fetchFarmUserAllowances(account, chainId, farmsToFetch).then((userFarmAllowances) => {
      const data = farmsToFetch.map((farm, index) => {
        return {
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          allowance: userFarmAllowances[index],
        };
      });
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserTokenBalances(account, chainId, farmsToFetch).then((userFarmTokenBalances) => {
      const data = farmsToFetch.map((farm, index) => {
        return {
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          tokenBalance: userFarmTokenBalances[index],
        };
      });
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserStakedBalances(account, chainId, farmsToFetch).then((userStakedBalances) => {
      const data = farmsToFetch.map((farm, index) => {
        return {
          pid: farm.pid,
          farmId: farm.farmId,
          poolId: farm.poolId,
          chainId: farm.chainId,
          stakedBalance: userStakedBalances[index],
        };
      });
      dispatch(setFarmUserData(data));
    });
    fetchFarmUserEarnings(
      account,
      chainId,
      farmsToFetch.filter((f) => f.farmId !== 17)
    ).then((userFarmEarnings) => {
      const data = farmsToFetch
        .filter((f) => f.farmId !== 17)
        .filter((f) => !f.enableEmergencyWithdraw)
        .map((farm, index) => {
          return {
            pid: farm.pid,
            farmId: farm.farmId,
            poolId: farm.poolId,
            chainId: farm.chainId,
            earnings: userFarmEarnings[index] ?? "0",
          };
        });
      dispatch(setFarmUserData(data));
    });
    await fetchFarmUserReflections(
      account,
      chainId,
      farmsToFetch.filter((f) => f.farmId !== 17)
    ).then((userFarmReflections) => {
      const data = farmsToFetch
        .filter((f) => f.farmId !== 17)
        .filter((f) => !f.enableEmergencyWithdraw)
        .map((farm, index) => {
          return {
            pid: farm.pid,
            farmId: farm.farmId,
            poolId: farm.poolId,
            chainId: farm.chainId,
            reflections: userFarmReflections[index] ?? "0",
          };
        });
      dispatch(setFarmUserData(data));
    });
  };

export const farmsSlice = createSlice({
  name: "Farms",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData = action.payload;
      liveFarmsData.map((farm) => {
        const index = state.data.findIndex((entry) => entry.pid === farm.pid);
        if (index >= 0) {
          state.data[index] = { ...state.data[index], ...farm };
        } else if (farm.contractAddress) {
          state.data.push({ ...farm, userData: initialUserData, TVLData: [] });
        }
        return farm;
      });
    },
    setFarmUserData: (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl;
        const index = state.data.findIndex((farm) => farm.pid === pid);
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, ...userDataEl } };
      });
      state.userDataLoaded = true;
    },
    updateFarmsUserData: (state, action) => {
      const { field, value, pid, farmId } = action.payload;
      const index = state.data.findIndex((p) => p.poolId === pid && p.farmId === farmId);

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = state.data.map((farm: any) => {
        return {
          ...farm,
          userData: initialUserData,
        };
      });
      state.userDataLoaded = false;
    });
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData, updateFarmsUserData } = farmsSlice.actions;

export default farmsSlice.reducer;
