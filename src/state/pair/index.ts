import { createSlice } from "@reduxjs/toolkit";

import { PairState, WalletState } from "state/types";

import { ChainId } from "@brewlabs/sdk";
import { getTradingPair } from "./fetchTradingPairs";

const initialState: PairState = {
  tradingPairs: {},
};

export const fetchTradingPairAsync = (chainId: ChainId, pair: string) => async (dispatch) => {
  const data = await getTradingPair(chainId, pair);
  dispatch(setPairData({ chainId, pair, data }));
};

export const PairSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setPairData: (state, action) => {
      const { chainId, pair, data } = action.payload;
      if (!state.tradingPairs[chainId]) state.tradingPairs[chainId] = {};
      state.tradingPairs[chainId][pair] = data;
    },
  },
});

// Actions
export const { setPairData } = PairSlice.actions;

export default PairSlice.reducer;
