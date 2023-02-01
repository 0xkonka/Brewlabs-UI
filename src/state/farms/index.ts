import { createSlice } from "@reduxjs/toolkit";

import farmsConfig from 'config/constants/farms'
import { resetUserState } from "state/global/actions";
import { SerializedFarmsState } from "./types";

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
    reflections: '0',
  },
}))

const initialState: SerializedFarmsState = {
  data: noAccountFarmConfig,
  prices: {},
  loadArchivedFarmsData: false,
  userDataLoaded: false,
};

export const farmsSlice = createSlice({
  name: "Farms",
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload;
      state.loadArchivedFarmsData = loadArchivedFarmsData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = state.data.map((farm: any) => {
        return {
          ...farm,
          userData: {
            allowance: "0",
            tokenBalance: "0",
            stakedBalance: "0",
            earnings: "0",
          },
        };
      });
      state.userDataLoaded = false;
    });
  },
});

// Actions
export const { setLoadArchivedFarmsData } = farmsSlice.actions;

export default farmsSlice.reducer;
