import { createSlice } from "@reduxjs/toolkit";

import { PairState, WalletState } from "state/types";

import { ChainId } from "@brewlabs/sdk";
import { getBrewlabsSwapFee, getTradingAllPairs, getTradingPair } from "./fetchTradingPairs";
import { BASES_TO_TRACK_LIQUIDITY_FOR } from "config/constants";

const initialState: PairState = {
  tradingPairs: {},
};

export const fetchTradingPairAsync = (chainId: ChainId, address: string) => async (dispatch) => {
  const data = await getTradingPair(chainId, address);
  dispatch(setPairData({ chainId, address, data }));
};

export const fetchTradingPairFeesAsync = (chainId: ChainId, address: string) => async (dispatch) => {
  const data = await getBrewlabsSwapFee(chainId, address);
  dispatch(setPairFeeData({ chainId, address, data }));
};

export const fetchTradingAllPairAsync = (chainId: ChainId) => async (dispatch) => {
  const pairs = await getTradingAllPairs(chainId);
  dispatch(setPairs({ chainId, pairs }));
};

export const PairSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setPairData: (state: any, action) => {
      const { chainId, data } = action.payload;
      if (!state.tradingPairs[chainId]) state.tradingPairs[chainId] = {};
      const pair = data.pair;
      if (pair) {
        const isBaseToken0 = BASES_TO_TRACK_LIQUIDITY_FOR[chainId].find(
          (token) => token.address.toLowerCase() === pair.token0.address
        );
        let baseToken: any = !isBaseToken0 ? pair.token0 : pair.token1,
          quoteToken: any = !isBaseToken0 ? pair.token1 : pair.token0;

        baseToken = {
          ...baseToken,
          price: !isBaseToken0 ? data.price.price0 : data.price.price1,
          price24h: !isBaseToken0 ? data.price24h.price24h0 : data.price24h.price24h1,
          price24hHigh: !isBaseToken0 ? data.price24hHigh.price24hHigh0 : data.price24hHigh.price24hHigh1,
          price24hLow: !isBaseToken0 ? data.price24hLow.price24hLow0 : data.price24hLow.price24hLow1,
          price24hChange: !isBaseToken0 ? data.price24hChange.price24hChange0 : data.price24hChange.price24hChange1,
        };

        quoteToken = {
          ...quoteToken,
          price: isBaseToken0 ? data.price.price0 : data.price.price1,
          price24h: isBaseToken0 ? data.price24h.price24h0 : data.price24h.price24h1,
          price24hHigh: isBaseToken0 ? data.price24hHigh.price24hHigh0 : data.price24hHigh.price24hHigh1,
          price24hLow: isBaseToken0 ? data.price24hLow.price24hLow0 : data.price24hLow.price24hLow1,
          price24hChange: isBaseToken0 ? data.price24hChange.price24hChange0 : data.price24hChange.price24hChange1,
        };

        state.tradingPairs[chainId][pair.address] = {
          ...state.tradingPairs[chainId][pair.address],
          baseToken,
          quoteToken,
          volume24h: data.volume24h,
        };
      }
    },
    setPairs: (state, action) => {
      const { chainId, pairs } = action.payload;
      if (!state.tradingPairs[chainId]) state.tradingPairs[chainId] = {};
      pairs.map(
        (pair) =>
          (state.tradingPairs[chainId][pair.address] = { ...state.tradingPairs[chainId][pair.address], ...pair })
      );
    },
    setPairFeeData: (state, action) => {
      const { chainId, address, data } = action.payload;
      if (!state.tradingPairs[chainId]) state.tradingPairs[chainId] = {};
      state.tradingPairs[chainId][address] = { ...state.tradingPairs[chainId][address], fees: data };
    },
  },
});

// Actions
export const { setPairData, setPairs, setPairFeeData } = PairSlice.actions;

export default PairSlice.reducer;
