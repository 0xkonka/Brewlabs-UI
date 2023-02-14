import { createSlice } from "@reduxjs/toolkit";

import farmsConfig from "config/constants/farms";
import { resetUserState } from "state/global/actions";
import { SerializedFarmsState } from "./types";

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
          userData: initialUserData,
        };
      });
      state.userDataLoaded = false;
    });
  },
});

// Actions
export const { setLoadArchivedFarmsData } = farmsSlice.actions;

export default farmsSlice.reducer;
