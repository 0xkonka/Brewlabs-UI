import { createSlice } from "@reduxjs/toolkit";

import { ChartState, HomeState } from "state/types";
import { fetchAllPairs } from "./fetchPairInfo";

const initialState: ChartState = {
  pairs: {},
};

export const fetchPairsAsync =
  (criteria, chain = null, type) =>
  async (dispatch) => {
    const pairs = await fetchAllPairs(criteria, chain, type);
    dispatch(addPairs(pairs));
  };

export const ChartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    addPairs: (state, action) => {
      const pairs = action.payload;
      pairs.map((pair) => {
        if (!state.pairs[pair.chainId]) state.pairs[pair.chainId] = {};
        state.pairs[pair.chainId][pair.address] = {
          ...state.pairs[pair.chainId][pair.address],
          ...pair,
        };
      });
    },
  },
});

// Actions
export const { addPairs } = ChartSlice.actions;

export default ChartSlice.reducer;
