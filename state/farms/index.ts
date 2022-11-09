import { createSlice } from "@reduxjs/toolkit";
import { resetUserState } from "state/global/actions";

const initialState: any = {
  data: [],
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
