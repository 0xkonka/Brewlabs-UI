import { createSlice } from "@reduxjs/toolkit";

import { ChartState, HomeState } from "state/types";
import { fetchAllPairs, fetchPairPriceInfos } from "./fetchPairInfo";

const initialState: ChartState = {
  pairs: {},
};

export const fetchPairsAsync =
  (criteria, limit = 10, sort = "volume24h_stable", chain = null) =>
  async (dispatch) => {
    const pairs = await fetchAllPairs(criteria, limit, sort, chain);
    dispatch(addPairs(pairs));
    dispatch(fetchPairPriceInfoAsync(pairs));
  };

export const fetchPairPriceInfoAsync = (pairs) => async (dispatch) => {
  const priceInfos = await fetchPairPriceInfos(pairs);
  dispatch(setPairPrices(priceInfos));
};

export const ChartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setPairPrices: (state, action) => {
      const prices = action.payload;
      prices.map((price) => {
        if (!state.pairs[price.chainId]) state.pairs[price.chainId] = {};
        state.pairs[price.chainId][price.address] = {
          ...state.pairs[price.chainId][price.address],
          ...price,
          params: state.pairs[price.chainId][price.address]?.params,
        };
      });
    },
    addPairs: (state, action) => {
      const pairs = action.payload;
      pairs.map((pair) => {
        if (!state.pairs[pair.chainId]) state.pairs[pair.chainId] = {};
        state.pairs[pair.chainId][pair.address] = {
          ...state.pairs[pair.chainId][pair.address],
          ...pair,
          params: !state.pairs[pair.chainId][pair.address]?.params.includes(pair.params)
            ? [...(state.pairs[pair.chainId][pair.address]?.params ?? []), pair.params]
            : state.pairs[pair.chainId][pair.address]?.params,
        };
      });
    },
  },
});

// Actions
export const { setPairPrices, addPairs } = ChartSlice.actions;

export default ChartSlice.reducer;
